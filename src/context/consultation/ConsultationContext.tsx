import { createContext } from "react";
import { useForm } from "react-hook-form";

interface Consultation {
  id: string;
  consultation_data: string;
  medic_id: string;
  patient_id: string;
  notes: string;
}

interface ConsultationContextType{
  consultations: Consultation[];
  loading: boolean;
  editingId: string | null;
  fetchMedic: () => Promise<void>;
  deleteMedic: (id: string) => Promise<void>;
  handleEdit: (consultation: Consultation) => void;
  onSubmit: (data: Consultation) => Promise<void>;
  register: ReturnType<typeof useForm<Consultation>>["register"];
  handleSubmit: ReturnType<typeof useForm<Consultation>>["handleSubmit"];
  formState: ReturnType<typeof useForm<Consultation>>["formState"];
}

export const ConsultationContext = createContext<ConsultationContextType | undefined>(undefined)