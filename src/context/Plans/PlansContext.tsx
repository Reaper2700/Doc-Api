import { createContext } from "react";
import { useForm } from "react-hook-form";
interface Plans {
  id: string; // Corrigido: era number
  name: string;
  varbase: number;
}

interface PlansContextType {
  plans: Plans[];
  loading: boolean;
  editingId: string | null;
  fetchPlans: () => Promise<void>;
  deletePlans: (id: string) => Promise<void>;
  handleEdit: (plans: Plans) => void;
  onSubmit: (data: Plans) => Promise<void>;
  register: ReturnType<typeof useForm<Plans>>["register"];
  handleSubmit: ReturnType<typeof useForm<Plans>>["handleSubmit"];
  formState: ReturnType<typeof useForm<Plans>>["formState"];
}

export const PlansContext = createContext<PlansContextType | undefined>(undefined);