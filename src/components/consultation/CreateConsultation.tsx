import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CreatePatientContainer, CampPatient } from "../patients/styles";
import { api } from "../../lib/axios";
import { useConsultations } from "../../context/consultation/ConsultationProvider";
import { useMedics } from "../../context/Medics/MedicProvider";
import { usePatients } from "../../context/Patients/PatientsProvider";
import { usePlans } from "../../context/Plans/PlansProvider";

interface ConsultationFormData {
    consultation_data: string;
    medic_id: string;
    patient_id: string;
    notes?: string;
}

interface Patient {
    id: string;
    name: string;
    cpf: string;
    health_plan: number;
    birthDate: string;
}

interface Plans {
    id: number;
    name: string;
    varbase: number;
}

export default function CreateConsultation() {
    const { fetchConsultation } = useConsultations();
    const { medics } = useMedics();
    const { patients } = usePatients();
    const { plans } = usePlans();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ConsultationFormData>({
        defaultValues: {
            consultation_data: "",
            medic_id: "",
            patient_id: "",
            notes: "",
        },
    });


    const onSubmit = async (data: ConsultationFormData) => {
        try {
            // converte e substitui o campo consultation_data para string ISO
            const payload = {
                ...data,
                consultation_data: new Date(data.consultation_data).toISOString(),
            };

            console.log("Payload enviado:", payload);

            await api.post("/consultation", payload);
            alert("Consulta criada com sucesso!");
            fetchConsultation();
            reset(); // limpa o formulário após sucesso
        } catch (error: any) {
            console.error("Erro na criação:", error.response?.data || error.message);
            alert("Erro ao criar consulta: " + JSON.stringify(error.response?.data));
        }
    };

    const [patientPlan, setPatientPlan] = useState<string | undefined>(undefined)
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOption = event.target.selectedOptions[0];
        const healthPlan = selectedOption.dataset.healthPlan;
        setPatientPlan(healthPlan)
    };

    const selectedPlan = plans.find((plans) => plans.id === patientPlan)

    return (
        <CreatePatientContainer>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CampPatient style={{paddingRight: "380px"}}>
                    <div>
                        <label>Data da Consulta</label>
                        <input
                            type="date"
                            {...register("consultation_data", { required: "Data é obrigatória" })}
                        />
                        {errors.consultation_data && (
                            <p style={{ color: "red" }}>{errors.consultation_data.message}</p>
                        )}
                    </div>

                    <div>
                        <label>Médico</label>
                        <select className="HealthPlan" {...register("medic_id", { required: "Selecione um médico" })}>
                            <option value="">Selecione um Médico</option>
                            {medics.map((medic) => (
                                <option key={medic.id} value={medic.id}>
                                    {medic.name}
                                </option>
                            ))}
                        </select>
                        {errors.medic_id && (
                            <p style={{ color: "red" }}>{errors.medic_id.message}</p>
                        )}
                    </div>

                    <div>
                        <label>Paciente</label>
                        <select className="HealthPlan" {...register("patient_id", { required: "Selecione um paciente" })} onChange={handleChange}>
                            <option value="">Selecione um Paciente</option>
                            {patients.map((patient) => (
                                <option key={patient.id} value={patient.id} data-health-plan={patient.health_plan}>
                                    {patient.name}

                                </option>


                            ))}
                        </select>
                        {errors.patient_id && (
                            <p style={{ color: "red" }}>{errors.patient_id.message}</p>
                        )}

                    </div>

                        <div>
                            {selectedPlan && (
                            <input type="text" value={selectedPlan.name} readOnly />
                        )}
                        </div>
                    
                    <div>
                        <label>Observações</label>
                        <textarea {...register("notes")} placeholder="Notas opcionais" />
                    </div>
                </CampPatient>

                <div className="ButtonPatient">
                    <button type="submit" disabled={isSubmitting}>
                        Criar Consulta
                    </button>
                </div>
            </form>
        </CreatePatientContainer>
    );
}
