import { useState } from "react"
import type { ChangeEvent } from "react"

type Props = {
  onSend: (text: string) => void
  onFile: (file: File) => void
}

export function ChatInput({ onSend, onFile }: Props) {

  const [text, setText] = useState("")

  function handleSend() {

    if (!text.trim()) return

    onSend(text)
    setText("")
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {

    const file = e.target.files?.[0]

    if (!file) return

    if (!file.name.endsWith(".csv")) {
      alert("Envie apenas arquivos CSV")
      return
    }

    console.log("CSV selecionado:", file)

    onFile(file)
  }

  return (
    <div className="chat-input-container">

      <label className="upload-button">
        📎
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          hidden
        />
      </label>

      <input
        type="text"
        placeholder="Digite sua mensagem..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend()
        }}
      />

      <button onClick={handleSend}>
        Enviar
      </button>

    </div>
  )
}