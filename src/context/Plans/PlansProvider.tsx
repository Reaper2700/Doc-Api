import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../lib/axios";

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

interface PlansProviderProps {
  children: ReactNode;
}

export function PlansProvider({ children }: PlansProviderProps) {
  const [plans, setPlans] = useState<Plans[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<string | null>(null); // Corrigido
  const [originalPlans, setOriginalPlans] = useState<Plans | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState,
  } = useForm<Plans>();

  const fetchPlans = async () => {
    setLoading(true); // Garantir loading ao iniciar
    try {
      const res = await api.get("/plans");
      setPlans(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deletePlans = async (id: string) => {
    try {
      await api.delete(`/plans/${id}`);
      await fetchPlans();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (plans: Plans) => {
    setEditingId(plans.id);
    setOriginalPlans(plans);
    Object.entries(plans).forEach(([key, value]) => {
      setValue(key as keyof Plans, value);
    });
  };

  const onSubmit = async (data: Plans) => {
    if (!originalPlans) return;

    const updatedFields: Partial<Plans> = {};
    Object.entries(data).forEach(([key, value]) => {
      const originalValue = originalPlans[key as keyof Plans];
      if (value !== originalValue) {
        updatedFields[key as keyof Plans] = value;
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      alert("Nenhuma alteração detectada.");
      return;
    }

    try {
      await api.patch(`/plans/${originalPlans.id}`, updatedFields);
      await fetchPlans();
      setEditingId(null);
      setOriginalPlans(null);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <PlansContext.Provider
      value={{
        plans,
        loading,
        editingId,
        fetchPlans,
        deletePlans,
        handleEdit,
        onSubmit,
        register,
        handleSubmit,
        formState,
      }}
    >
      {children}
    </PlansContext.Provider>
  );
}

export const usePlans = () => {
  const context = useContext(PlansContext);
  if (!context) {
    throw new Error("usePlans deve ser usado dentro de um PlansProvider");
  }
  return context;
};
