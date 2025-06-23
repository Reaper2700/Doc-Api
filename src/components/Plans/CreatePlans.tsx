import React from "react";
import { usePlans } from "../../context/Plans/PlansProvider";
import { CampPatient, CreatePatientContainer } from "../patients/styles";
import { api } from "../../lib/axios";


interface Plans {
  id: number;
  name: string;
  varbase: number;
}

export default function CreatePlan() {
  const { register, handleSubmit, formState, onSubmit: onUpdateOrCreate, fetchPlans} = usePlans();

  const handleCreate = async (data: Omit<Plans, "id">) => {
    try {

      await api.post("/plans", data);
      console.log(data)
      alert("Plano criado com sucesso!");
      fetchPlans()
  
    } catch (error: any) {
      console.error(error);
      alert("Erro ao criar plano");
    }
  };

  return (
    <CreatePatientContainer style={{paddingBottom: "20px"}}>
      <form onSubmit={handleSubmit(handleCreate)}>
        <CampPatient>
          <div>
            <label className="block mb-1">Nome</label>
            <input
              {...register("name", { required: true })}
              placeholder="Nome"
              className="w-full border p-2 rounded"
            />
            {formState.errors.name && (
              <p className="text-red-500 text-sm">Nome é obrigatório</p>
            )}
          </div>

          <div>
            <label>Valor do Plano (varbase)</label>
            <input
              type="number"
              {...register("varbase", { required: true, valueAsNumber: true })}
              placeholder="Valor do Plano"
              className="w-full border p-2 rounded"
            />
            {formState.errors.varbase && (
              <p className="text-red-500 text-sm">Valor é obrigatório</p>
            )}
          </div>
        </CampPatient>

        <div className="ButtonPatient">
          <button type="submit">Criar Plano</button>
        </div>
      </form>
    </CreatePatientContainer>
  );
}
