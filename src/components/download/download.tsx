import { useState } from "react";
import { Container, HeaderFilterContainer } from "../filter/styles";
import { ListMedic, MedicContainer, MedicItem } from "../medic/stylesCreate";
import { HeaderHomePage, HomePageContainer } from "../styles";
import { api } from "../../lib/axios";

export function DownLoadPage() {
    const [selectedTableExport, setSelectedTableExport] = useState("");
    const [selectedTableImport, setSelectedTableImport] = useState("");
    
    const tables = ["Medics", "Patients", "Plans", "Consultation"];
    const endpointsByTable: Record<string, string> = {
        Consultation: "/consultation/export",
        Medics: "/medic/export",
        Patients: "/patient/export",
        Plans: "/plans/export",
    };

    const handleFetch = async () => {
        try {
            const endpoints = endpointsByTable[selectedTableExport as keyof typeof endpointsByTable]
            if (!endpoints) return null

            const response = await api.get(endpoints, {
                responseType: "blob"
            })

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${selectedTableExport}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Erro ao buscar filtros:", error);
        }
    }

    const endpointsByTableUpload: Record<string, string> ={
        Consultation: "/consultation/import",
        Plans: "/plans/import",
        Patients: "/patient/import",
        Medics: "/medic/import",
    }
    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        
        if (!file) return

        const formData = new FormData()
        formData.append("file", file)
        try {
            const endpoints = endpointsByTableUpload[selectedTableImport as keyof typeof endpointsByTableUpload]

            const response = await api.post(endpoints, formData, {
                 headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            alert("Importação concluída com sucesso!")
        } catch (err) {
            console.error("Erro ao importar:", err)
            alert("Erro ao importar planilha")
        }
    }

    return (
        <div>
            <HomePageContainer>
                <HeaderHomePage />
            </HomePageContainer>

            <Container>
                <MedicContainer>
                    <div>
                        <HeaderFilterContainer>
                            <div>
                                <label>Tabelas Download</label>
                                <select onChange={(e) => { setSelectedTableExport(e.target.value) }}>
                                    <option value="">Selecione uma tabela</option>
                                    {tables.map((table) => (
                                        <option key={table} value={table}>
                                            {table}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button className="button" onClick={handleFetch}>Buscar</button>

                            <div>
                                <label>Tabela Upload</label>
                                <select onChange={(e) => { setSelectedTableImport(e.target.value) }}>
                                    <option value="">Selecione uma tabela</option>
                                    {tables.map((table) => (
                                        <option key={table} value={table}>
                                            {table}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <input type="file" accept=".xlsx" onChange={handleUpload} />

                        </HeaderFilterContainer>
                        <ListMedic>
                            <MedicItem>
                            </MedicItem>

                        </ListMedic>
                    </div>
                </MedicContainer>
            </Container>
        </div>
    );
}