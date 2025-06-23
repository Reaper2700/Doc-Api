import { useEffect } from "react";
import { api } from "../../lib/axios";
import { DialogClose, DialogPortal, DialogTitle } from "@radix-ui/react-dialog";
import { Content, Overlay } from "../medic/Modal/styles";
import { useForm } from "react-hook-form";
import { useMedics } from "../../context/Medics/MedicProvider";
import { usePatients } from "../../context/Patients/PatientsProvider";

interface Consultation {
  id: string;
  consultation_data: string;
  medic_id: string;
  patient_id: string;
  notes: string;
}

interface EditConsultationProps {
  consultation: Consultation;
  onCancel: () => void;
  onSuccess: () => void;
}

export function EditConsultation({ consultation, onCancel, onSuccess }: EditConsultationProps) {
  const { medics } = useMedics();
  const { patients } = usePatients();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields, isSubmitting },
  } = useForm<Consultation>({
    defaultValues: {
      id: "",
      consultation_data: "",
      medic_id: "",
      patient_id: "",
      notes: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (consultation) {
      reset({
        ...consultation,
        consultation_data: consultation.consultation_data?.split("T")[0] || "",
      });
    }
  }, [consultation, reset]);

  const onSubmit = async (data: Consultation) => {
    if (!data.id) {
      alert("ID da consulta ausente.");
      return;
    }

    const updatedData: Partial<Consultation> = {};

    for (const key in dirtyFields) {
      const typedKey = key as keyof Omit<Consultation, 'id'>;
      updatedData[typedKey] = data[typedKey];
    }

    if (Object.keys(updatedData).length === 0) {
      alert("Nenhuma alteração feita.");
      return;
    }

    try {
      await api.patch(`/consultation/${data.id}`, updatedData);
      alert("Consulta atualizada com sucesso!");
      onSuccess();
    } catch (error: any) {
      if (error.response) {
        console.error("Erro de validação:", error.response.data);
        alert(JSON.stringify(error.response.data, null, 2));
      } else {
        console.error(error);
        alert("Erro inesperado ao atualizar a consulta.");
      }
    }
  };

  return (
    <DialogPortal>
      <Overlay />
      <Content>
        <DialogTitle>Editar Consulta</DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input type="hidden" {...register("id")} />

          <div>
            <label htmlFor="consultation_date">Data da consulta</label>
            <input
              id="consultation_date"
              type="date"
              {...register("consultation_date", { required: "Data é obrigatória" })}
              style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            />
            {errors.consultation_data && (
              <p style={{ color: "red", fontSize: 12 }}>{errors.consultation_data.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="medic_id">Médico</label>
            <select
              {...register("medic_id", { required: "Médico é obrigatório" })}
              style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            >
              <option value="">Selecione um Médico</option>
              {medics.map((medic) => (
                <option key={medic.id} value={medic.id}>
                  {medic.name}
                </option>
              ))}
            </select>
            {errors.medic_id && (
              <p style={{ color: "red", fontSize: 12 }}>{errors.medic_id.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="patient_id">Paciente</label>
            <select
              {...register("patient_id", { required: "Paciente é obrigatório" })}
              style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            >
              <option value="">Selecione um Paciente</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
            {errors.patient_id && (
              <p style={{ color: "red", fontSize: 12 }}>{errors.patient_id.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="notes">Observação</label>
            <textarea
              id="notes"
              {...register("notes")}
              style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            />
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                padding: "8px 16px",
                borderRadius: 4,
                border: "none",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              Atualizar
            </button>

            <button
              type="button"
              onClick={() => {
                reset(consultation);
                onCancel();
              }}
              style={{
                backgroundColor: "#9ca3af",
                color: "white",
                padding: "8px 16px",
                borderRadius: 4,
                border: "none",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
          </div>
        </form>

        <DialogClose asChild>
          <button
            aria-label="Fechar"
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "none",
              border: "none",
              fontSize: 20,
              cursor: "pointer",
              color: "#6b7280",
            }}
          >
            ✕
          </button>
        </DialogClose>
      </Content>
    </DialogPortal>
  );
}
