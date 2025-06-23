import { ReactNode, useEffect, useState, createContext, useContext } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../lib/axios";

interface Medic {
    id: number;
    name: string;
    cpf: string;
    crm: string;
    birthDate: number;
}

interface MedicContextType {
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

export const MedicsContext = createContext<MedicContextType | undefined>(undefined);

interface MedicProviderProps {
    children: ReactNode;
}

export function MedicProvider({ children }: MedicProviderProps) {
    const [medics, setMedics] = useState<Medic[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [originalMedic, setOriginalMedic] = useState<Medic | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        reset,
        formState,
    } = useForm<Medic>();

    const fetchMedic = async () => {
        try {
            const res = await api.get("/medic");
            setMedics(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteMedic = async (id: number) => {
        try {
            await api.delete(`/medic/${id}`);
            fetchMedic();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (medic: Medic) => {
        setEditingId(medic.id);
        setOriginalMedic(medic);
        Object.entries(medic).forEach(([key, value]) => {
            setValue(key as keyof Medic, value);
        });
    };

    const onSubmit = async () => {
        if (!originalMedic) return;

        const updatedFields: Partial<Medic> = {};
        const currentValues = getValues();

        Object.entries(currentValues).forEach(([key, value]) => {
            const originalValue = originalMedic[key as keyof Medic];
            if (value !== originalValue) {
                updatedFields[key as keyof Medic] = value;
            }
        });

        if (Object.keys(updatedFields).length === 0) {
            alert("Nenhuma alteração detectada.");
            return;
        }

        try {
            await api.put(`/medic/${originalMedic.id}`, updatedFields);
            await fetchMedic();
            setEditingId(null);
            setOriginalMedic(null);
            reset();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchMedic();
    }, []);

    return (
        <MedicsContext.Provider
            value={{
                medics,
                loading,
                fetchMedic,
                deleteMedic,
                editingId,
                handleEdit,
                onSubmit,
                register,
                handleSubmit,
                formState,
            }}
        >
            {children}
        </MedicsContext.Provider>
    );
}

export const useMedics = () => {
    const context = useContext(MedicsContext);
    if (!context) {
        throw new Error("useMedics deve ser usado dentro de um MedicProvider");
    }
    return context;
};
