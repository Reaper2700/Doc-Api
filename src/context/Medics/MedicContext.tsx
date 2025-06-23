import { createContext } from "react";
import { useForm } from "react-hook-form";

interface Medic {
  id: number;
  name: string;
  cpf: string;
  crm: string;
  birthDate: number;
}

interface MedicContextType{
  medics: Medic[];
  loading: boolean;
  editingId: number | null;
  fetchMedic: () => Promise<void>;
  deleteMedic: (id: number) => Promise<void>;
  handleEdit: (medic: Medic) => void;
  onSubmit: () => Promise<void>;
  register: ReturnType<typeof useForm<Medic>>["register"];
  handleSubmit: ReturnType<typeof useForm<Medic>>["handleSubmit"];
  formState: ReturnType<typeof useForm<Medic>>["formState"];
}

export const MedicsContext = createContext<MedicContextType | undefined>(undefined)