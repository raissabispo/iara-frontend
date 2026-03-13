// src/services/api.ts
const API_URL = "https://iara-backend-h52r.onrender.com";

export async function sendMessage(text: string) {
  // Validação básica
  if (!text || text.trim() === "") {
    throw new Error("Mensagem não pode ser vazia");
  }

  console.log("Enviando pergunta:", text);

  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      pergunta: text.trim() 
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Erro detalhado:", errorData);
    throw new Error(errorData.detail || "Erro na requisição");
  }

  return response.json();
}

export async function uploadCSV(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  console.log("Enviando CSV:", file.name);

  const response = await fetch(`${API_URL}/upload-csv`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Erro no upload:", errorData);
    throw new Error(errorData.detail || "Erro no upload do CSV");
  }

  return response.json();
}