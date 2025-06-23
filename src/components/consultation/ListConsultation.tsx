import { useState } from "react";
import { PatientContainer } from "../patients/styles";
import { HeaderContainer } from "../header/styles";
import { Buttons, ListMedic, MedicItem } from "../medic/stylesCreate";
import { DialogTrigger, Root, DialogContent, DialogOverlay, DialogPortal } from "@radix-ui/react-dialog";
import { PencilSimpleLine, Trash } from "@phosphor-icons/react";
import { useConsultations } from "../../context/consultation/ConsultationProvider";
import { useMedics } from "../../context/Medics/MedicProvider";
import { EditConsultation } from "./ModalEdirConsultation";
import { usePatients } from "../../context/Patients/PatientsProvider";
import CreateConsultation from "./CreateConsultation";

interface Consultation {
  id: string;
  consultation_data: string;
  medic_id: string;
  patient_id: string;
  notes: string;
}

export function ListConsultation() {
  const { consultations, deleteConsultation, fetchConsultation, handleEdit } = useConsultations();
  const { medics } = useMedics();
  const { patients } = usePatients();

  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalWithConsultation = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedConsultation(null);
  };

  const onSuccessUpdate = () => {
    fetchConsultation();
    closeModal();
  };

  return (
    <PatientContainer>
      <div>
        <HeaderContainer>
          <div className="Name">
            <img />
            <h2>Consultas Agendadas: {consultations.length}</h2>
          </div>
        </HeaderContainer>

        <ListMedic>
          <MedicItem>
            {consultations.length === 0 ? (
              <p>Nenhuma consulta encontrada.</p>
            ) : (
              consultations.map((consultation) => {
                const medic = medics.find((p) => String(p.id) === consultation.medic_id);
                const patient = patients.find((p) => String(p.id) === consultation.patient_id);

                return (
                  <div className="Medicos" key={consultation.id}>
                    <span>
                      {new Date(consultation.consultation_data).toLocaleDateString()} - Médico: {medic ? medic.name : "sem Médico"} - Paciente: {patient ? patient.name : "sem Paciente"} - {consultation.notes}
                    </span>
                    <Buttons>
                      <button onClick={() => openModalWithConsultation(consultation)}>
                        <PencilSimpleLine size={20} />
                      </button>

                      <button onClick={() => deleteConsultation(consultation.id)}>
                        <Trash size={20} />
                      </button>
                    </Buttons>
                  </div>
                );
              })
            )}
          </MedicItem>
        </ListMedic>
          <CreateConsultation/>
        {/* Modal edit */}
        {selectedConsultation && (
          <Root open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
            <EditConsultation
              consultation={selectedConsultation}
              onCancel={closeModal}
              onSuccess={onSuccessUpdate}
            />
          </Root>
        )}
      </div>
    </PatientContainer>
  );
}
