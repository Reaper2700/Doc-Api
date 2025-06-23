import { createContext } from "react";
import { useForm } from "react-hook-form";

interface Patient {
  id: string;
  name: string;
  cpf: string;
  health_plan: number;
  birthDate: string;
}

interface PatientContextType{
      patients: Patient[];
      loading: boolean;
      editingId: string | null;
      fetchPatient: () => Promise<void>;
      deletePatient: (id: string) => Promise<void>;
      handleEdit: (patient: Patient) => void;
      onSubmit: (data: Patient) => Promise<void>;
      register: ReturnType<typeof useForm<Patient>>["register"];
      handleSubmit: ReturnType<typeof useForm<Patient>>["handleSubmit"];
      formState: ReturnType<typeof useForm<Patient>>["formState"];
}

export const PatientContext = createContext<PatientContextType | undefined>(undefined)