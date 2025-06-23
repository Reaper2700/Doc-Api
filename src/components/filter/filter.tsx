import { useEffect, useState } from "react";
import HeaderHomePage from "../header/Header";
import {
  ListMedic,
  MedicContainer,
  MedicItem,
} from "../medic/stylesCreate";
import { HomePageContainer } from "../styles";
import { Container, HeaderFilterContainer } from "./styles";
import { api } from "../../lib/axios";

interface Medic {
  id: number;
  name: string;
  cpf: string;
  crm: string;
  birthDate: string;
}

interface Plans {
  id: string;
  name: string;
  varbase: number;
}

export function FilterPage() {
  const tables = ["Medics", "Patients", "Plans", "Consultation"];

  const filterByTable: Record<string, string[]> = {
    Medics: ["name", "cpf"],
    Patients: ["name", "cpf", "health_plan"],
    Consultation: ["consultation_data", "medic_id"],
    Plans: ["varbase"],
  };

  const endpointsByTable: Record<string, string> = {
    Consultation: "/consultation/filter",
    Medics: "/medic/filter",
    Patients: "/patient/filter",
    Plans: "/plans/filter",
  };

  const [selectedTable, setSelectedTable] = useState("");
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string }>({});
  const [results, setResults] = useState<any[]>([]);
  const [medics, setMedics] = useState<Medic[]>([])
  const [health_plans, setHealth_plans] = useState<Plans[]>([])

  useEffect(() => {
    const fetchMedic = async () => {
      try {
        const response = await api.get('/medic')
        setMedics(response.data)
        console.log("dados recebidos", response.data)
      } catch (error) {
        console.error('Erro ao buscar medicos:', error);
      }
    }

    fetchMedic();
  }, [])

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/plans')
        setHealth_plans(response.data)
        console.log("dados recebidos:", response.data)
      } catch (error) {
        console.error('error ao buscar planos:', error)
      }
    }

    fetchPlans()
  }, [])
  const handleFetch = async () => {
    try {
      const endpoint = endpointsByTable[selectedTable as keyof typeof endpointsByTable];
      if (!endpoint) return;

      const filters = { ...activeFilters };

      if (
        selectedTable === "Consultation" &&
        filters["consultation_data"] &&
        !isNaN(new Date(filters["consultation_data"]).getTime())
      ) {
        const date = new Date(filters["consultation_data"]);
        filters["consultation_data"] = date.toISOString().split("T")[0];
      }
      const filteredParams = Object.fromEntries(
        Object.entries(activeFilters).filter(([_, value]) => value.trim() !== "")
      );

      const response = await api.get(endpoint, {
        params: filteredParams,
      });

      // Tenta pegar os dados com base na chave correspondente
      const key = selectedTable.toLowerCase(); // ex: "consultation", "medics", etc.
      const data = response.data[key] || [];

      setResults(data);
    } catch (error) {
      console.error("Erro ao buscar filtros:", error);
    }
  };

  const handleClear = () => {
    setActiveFilters({});
    setResults([]);
  };

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
                <label>Tabela</label>
                <select
                  className="HealthPlan"
                  onChange={(e) => {
                    setSelectedTable(e.target.value);
                    setActiveFilters({});
                    setResults([]);
                  }}
                >
                  <option value="">Selecione uma tabela</option>
                  {tables.map((table) => (
                    <option key={table} value={table}>
                      {table}
                    </option>
                  ))}
                </select>
              </div>

              {selectedTable && filterByTable[selectedTable]?.map((field) => {
                return (
                  <div key={field}>
                    <label>{field}</label>

                    {selectedTable === "Consultation" && field === "medic_id" ? (
                      <select
                        value={activeFilters[field] || ""}
                        onChange={(e) =>
                          setActiveFilters((prev) => ({
                            ...prev,
                            [field]: e.target.value,
                          }))
                        }
                      >
                        <option value="">Selecione um médico</option>
                        {medics.map((medic) => (
                          <option key={medic.id} value={medic.id}>
                            {medic.name}
                          </option>
                        ))}
                      </select>
                    ) : selectedTable === "Patients" && field === "health_plan" ? (
                      <select
                        value={activeFilters[field] || ""}
                        onChange={(e) =>
                          setActiveFilters((prev) => ({
                            ...prev,
                            [field]: e.target.value,
                          }))
                        }
                      >
                        <option value="">Selecione um plano</option>
                        {health_plans.map((plan) => (
                          <option key={plan.id} value={plan.id}>
                            {plan.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={activeFilters[field] || ""}
                        onChange={(e) =>
                          setActiveFilters((prev) => ({
                            ...prev,
                            [field]: e.target.value,
                          }))
                        }
                      />
                    )}
                  </div>
                );
              })}

              <button onClick={handleFetch}>Buscar</button>
              <button onClick={handleClear}>Limpar Filtros</button>
            </HeaderFilterContainer>

            <ListMedic style={{ height: "auto" }}>
              {results.map((item, index) => (
                <MedicItem key={index}>
                  <div>
                    <pre>{JSON.stringify(item, null, 2)}</pre>
                  </div>
                </MedicItem>
              ))}
            </ListMedic>
          </div>
        </MedicContainer>
      </Container>
    </div>
  );
}
