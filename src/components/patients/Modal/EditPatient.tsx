import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../../lib/axios";
import { DialogClose, DialogPortal, DialogTitle } from "@radix-ui/react-dialog";
import { Content, Overlay } from "../../medic/Modal/styles";

interface Patient {
  id: string; // Corrigido: id agora é string
  name: string;
  cpf: string;
  health_plan: number;
  birthDate: string;
}

interface EditPatientProps {
  patient: Patient | null;
  onCancel: () => void;
  onSuccess: () => void;
}

interface Plans {
  id: number;
  name: string;
  varbase: number;
}

export function EditPatient({ patient, onCancel, onSuccess }: EditPatientProps) {
  const [plans, setPlans] = useState<Plans[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPlans = async () => {
    try {
      const res = await api.get("/plans");
      setPlans(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields }
  } = useForm<Patient>({
    defaultValues: patient || {},
  });

  useEffect(() => {
    if (patient) {
      reset({
        ...patient,
        birthDate: new Date(patient.birthDate).toISOString().split("T")[0],
      });
    }
  }, [patient]);

  const onSubmit = async (data: Patient) => {
    const updatedData: Partial<Record<keyof Patient, string | number>> = {};

    for (const key in dirtyFields) {
      const typedKey = key as keyof Patient;

      if (typedKey === "birthDate") {
        updatedData[typedKey] = new Date(data.birthDate).getTime();
      } else {
        updatedData[typedKey] = data[typedKey];
      }
    }

    try {
      await api.patch(`/patient/${data.id}`, updatedData);
      alert("Paciente atualizado!");
      onSuccess();
    } catch (error: any) {
      if (error.response) {
        console.error("Erro de validação:", error.response.data);
        alert(JSON.stringify(error.response.data, null, 2));
      } else {
        console.error(error);
        alert("Erro inesperado ao atualizar paciente.");
      }
    }
  };

  if (!patient) return null;

  return (
    <DialogPortal>
      <Overlay />
      <Content>
        <DialogTitle>Editar Paciente</DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register("id")} />

          <div>
            <label>Nome</label>
            <input
              className="w-full border p-2 rounded"
              {...register("name", { required: true })}
            />
            {errors.name && <p>Nome é obrigatório</p>}
          </div>

          <div>
            <label>Plano de Saúde</label>
            <select {...register("health_plan", { required: true })}>
              <option value="">Selecione um plano</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
            </select>
            {errors.health_plan && <p>Plano é obrigatório</p>}
          </div>

          <div>
            <label>CPF</label>
            <input
              className="w-full border p-2 rounded"
              {...register("cpf", { required: true })}
            />
            {errors.cpf && <p>CPF é obrigatório</p>}
          </div>

          <div>
            <label>Data de Nascimento</label>
            <input type="date" {...register("birthDate", { required: true })} />
            {errors.birthDate && <p>Data de nascimento é obrigatória</p>}
          </div>

          <div className="flex gap-2 mt-4">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Atualizar
            </button>
            <button
              type="button"
              className="bg-gray-300 px-4 py-2 rounded"
              onClick={() => {
                reset();
                onCancel();
              }}
            >
              Cancelar
            </button>
          </div>
        </form>

        <DialogClose />
      </Content>
    </DialogPortal>
  );
}
