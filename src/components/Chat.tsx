import { useState } from "react"
import { MessageBubble } from "./Message"
import { ChatInput } from "./Input"
import type { Message } from "../types/message"
import { sendMessage, uploadCSV } from "../services/api"
import "./chat.css"
import Logo from "../assets/logoIara.png"

export function Chat() {

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Olá! Eu sou a IARA 🤖

Sou uma assistente financeira inteligente que analisa seus gastos.

Para começar, envie seu arquivo CSV com suas transações financeiras usando o botão 📎.

Seu CSV deve conter colunas como:

• data
• descrição
• categoria
• valor`,
      sender: "agent"
    }
  ])

  const [csvEnviado, setCsvEnviado] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  async function handleSend(text: string) {

    const userMessage: Message = {
      id: Date.now(),
      text,
      sender: "user"
    }

    // Exigir CSV antes de continuar
    if (!csvEnviado) {

      setMessages(prev => [
        ...prev,
        userMessage,
        {
          id: Date.now() + 1,
          text: "Antes de continuar, preciso que você envie o arquivo CSV usando o botão 📎.",
          sender: "agent"
        }
      ])

      return
    }

    setMessages(prev => [...prev, userMessage])

    setIsTyping(true)

    try {

      const data = await sendMessage(text)

      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          text: data.resposta,
          sender: "agent"
        }
      ])

    } catch (error) {

      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          text: "Erro ao conectar com o servidor.",
          sender: "agent"
        }
      ])
      
      console.error("Erro no sendMessage:", error)

    } finally {
      setIsTyping(false)
    }
  }

  async function handleFile(file: File) {

    console.log("Enviando CSV:", file)

    setIsTyping(true)

    try {

      const data = await uploadCSV(file)

      setCsvEnviado(true)

      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          text: `✅ ${data.mensagem || "Arquivo CSV recebido!"} 📊

Agora posso analisar suas finanças.

Pergunte por exemplo:

• Quanto gastei por categoria?
• Qual meu maior gasto?
• Como economizar?`,
          sender: "agent"
        }
      ])

      // Se houver estatísticas, pode mostrar
      if (data.estatisticas) {
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              id: Date.now(),
              text: `📈 Estatísticas rápidas:
• Total de registros: ${data.estatisticas.linhas}
• Total gasto: R$ ${data.estatisticas.total_gasto?.toFixed(2)}
• Categorias diferentes: ${data.estatisticas.categorias}`,
              sender: "agent"
            }
          ])
        }, 500)
      }

    } catch (error) {

      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          text: "❌ Erro ao enviar o CSV. Verifique se o arquivo está no formato correto.",
          sender: "agent"
        }
      ])
      
      console.error("Erro no upload:", error)

    } finally {
      setIsTyping(false)
    }
  }

  return (

    <div className="chat-container">

      <div className="chat-header">

        <div className="header-logo">
          <img src={Logo} alt="IARA"/>
        </div>

        <div className="header-content">
          <h1>IARA <span className="header-badge">AI</span></h1>
          <p>Assistente Financeira Inteligente</p>
        </div>

        <div className="header-status">
          <span className="status-dot"></span>
          Online
        </div>

      </div>

      <div className="chat-messages">

        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            message={msg}
          />
        ))}

        {isTyping && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}

      </div>

      <ChatInput
        onSend={handleSend}
        onFile={handleFile}
      />

    </div>

  )
}