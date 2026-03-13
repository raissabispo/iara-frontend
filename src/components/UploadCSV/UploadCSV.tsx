import { uploadCSV } from "./../../services/api"

export function UploadCSV() {

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {

    if (!e.target.files) return

    const file = e.target.files[0]

    await uploadCSV(file)

    alert("CSV enviado com sucesso!")
  }

  return (
    <div style={{marginBottom:20}}>
      <input type="file" accept=".csv" onChange={handleFile}/>
    </div>
  )
}