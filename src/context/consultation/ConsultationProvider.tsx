import { ReactNode, useEffect, useState, createContext, useContext } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../lib/axios";

interface Consultation {
  id: string;
  consultation_data: string;
  medic_id: string;
  patient_id: string;
  notes: string;
}

interface ConsultationContextType {
  consultations: Consultation[];
  loading: boolean;
  editingId: string | null;
  fetchConsultation: () => Promise<void>;
  deleteConsultation: (id: string) => Promise<void>;
  handleEdit: (consultation: Consultation) => void;
  onSubmit: (data: Consultation) => Promise<void>;
  register: ReturnType<typeof useForm<Consultation>>["register"];
  handleSubmit: ReturnType<typeof useForm<Consultation>>["handleSubmit"];
  formState: ReturnType<typeof useForm<Consultation>>["formState"];
}

export const ConsultationsContext = createContext<ConsultationContextType | undefined>(undefined);

interface ConsultationProviderProps {
  children: ReactNode;
}

export function ConsultationProvider({ children }: ConsultationProviderProps) {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [originalConsultation, setOriginalConsultation] = useState<Consultation | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState,
  } = useForm<Consultation>();

  const fetchConsultation = async () => {
    try {
      const res = await api.get("/consultation"); 
      setConsultations(res.data);
      console.log(res.data)
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteConsultation = async (id: string) => {
    try {
      await api.delete(`/consultation/${id}`); 
      await fetchConsultation();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (consultation: Consultation) => {
    setEditingId(consultation.id);
    setOriginalConsultation(consultation);
    Object.entries(consultation).forEach(([key, value]) => {
      setValue(key as keyof Consultation, value);
    });
  };

  const onSubmit = async (data: Consultation) => {
    if (!originalConsultation) return;

    const updatedFields: Partial<Consultation> = {};
    const currentValues = getValues();

    Object.entries(currentValues).forEach(([key, value]) => {
      const originalValue = originalConsultation[key as keyof Consultation];
      if (value !== originalValue) {
        updatedFields[key as keyof Consultation] = value;
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      alert("Nenhuma alteração detectada.");
      return;
    }

    try {
      await api.patch(`/consultation/${originalConsultation.id}`, updatedFields);
      await fetchConsultation();
      setEditingId(null);
      setOriginalConsultation(null);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchConsultation();
  }, []);

  return (
    <ConsultationsContext.Provider
      value={{
        consultations,
        loading,
        fetchConsultation,
        deleteConsultation,
        editingId,
        handleEdit,
        onSubmit,
        register,
        handleSubmit,
        formState,
      }}
    >
      {children}
    </ConsultationsContext.Provider>
  );
}

export const useConsultations = () => {
  const context = useContext(ConsultationsContext);
  if (!context) {
    throw new Error("useConsultations deve ser usado dentro de um ConsultationProvider");
  }
  return context;
};
