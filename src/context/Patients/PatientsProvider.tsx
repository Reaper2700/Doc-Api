import { ReactNode, useEffect, useState, createContext, useContext } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../lib/axios";

interface Patient {
    id: string;
    name: string;
    cpf: string;
    health_plan: number;
    birthDate: string;
}

interface PatientContextType {
    patients: Patient[];
    loading: boolean;
    editingId: string | null;
    fetchPatients: () => Promise<void>;
    deletePatient: (id: string) => Promise<void>;
    handleEdit: (patient: Patient) => void;
    onSubmit: (data: Patient) => Promise<void>;
    register: ReturnType<typeof useForm<Patient>>["register"];
    handleSubmit: ReturnType<typeof useForm<Patient>>["handleSubmit"];
    formState: ReturnType<typeof useForm<Patient>>["formState"];
}

export const PatientContext = createContext<PatientContextType | undefined>(undefined);

interface PatientProviderProps {
    children: ReactNode;
}

export function PatientProvider({ children }: PatientProviderProps) {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [originalPatient, setOriginalPatient] = useState<Patient | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        reset,
        formState,
    } = useForm<Patient>();

    const fetchPatients = async () => {
        try {
            const res = await api.get("/patient");
            setPatients(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deletePatient = async (id: string) => {
        try {
            await api.delete(`/patient/${id}`);
            fetchPatients();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (patient: Patient) => {
        setEditingId(patient.id);
        setOriginalPatient(patient);
        Object.entries(patient).forEach(([key, value]) => {
            setValue(key as keyof Patient, value);
        });
    };

    const onSubmit = async () => {
        if (!originalPatient) return;

        const updatedFields: Partial<Patient> = {};
        const currentValues = getValues();

        Object.entries(currentValues).forEach(([key, value]) => {
            const originalValue = originalPatient[key as keyof Patient];
            if (value !== originalValue) {
                updatedFields[key as keyof Patient] = value;
            }
        });

        if (Object.keys(updatedFields).length === 0) {
            alert("Nenhuma alteração detectada.");
            return;
        }

        try {
            await api.put(`/patient/${originalPatient.id}`, updatedFields);
            await fetchPatients();
            setEditingId(null);
            setOriginalPatient(null);
            reset();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    return (
        <PatientContext.Provider
            value={{
                patients,
                loading,
                fetchPatients,
                deletePatient,
                editingId,
                handleEdit,
                onSubmit,
                register,
                handleSubmit,
                formState,
            }}
        >
            {children}
        </PatientContext.Provider>
    );
}

export const usePatients = () => {
    const context = useContext(PatientContext);
    if (!context) {
        throw new Error("usePatients deve ser usado dentro de um PatientProvider");
    }
    return context;
};
