import { useState, useEffect } from 'react';
import CreatePatient from './createPatient';
import {
  Buttons,
  HeaderPatientContainer,
  ListPatient,
  PatientContainer,
  PatientItem
} from './styles';
import { PencilSimpleLine, Trash } from '@phosphor-icons/react';
import { DialogTrigger, Root } from '@radix-ui/react-dialog';
import { EditPatient } from './Modal/EditPatient';
import { usePatients } from '../../context/Patients/PatientsProvider';
import { api } from '../../lib/axios';

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

export default function ListPatients() {
  const { patients, handleEdit, fetchPatients, deletePatient } = usePatients();
  const [originalPatient, setOriginalPatient] = useState<Patient | null>(null);
  const [plans, setPlans] = useState<Plans[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get('/plans');
        setPlans(res.data);
      } catch (err) {
        console.error('Erro ao buscar planos:', err);
      }
    };

    fetchPlans();
  }, []);

  return (
    <PatientContainer>
      <div>
        <HeaderPatientContainer>
          <div className="Name">
            <h2>Lista de Pacientes</h2>
          </div>
          <h3>Quantidade de pacientes: {patients.length}</h3>
        </HeaderPatientContainer>

        <ListPatient>
          <PatientItem>
            {patients.map((patient) => {
              const plan = plans.find((p) => p.id === patient.health_plan);
              const isEditing = originalPatient?.id === patient.id;

              return (
                <div className="Patients" key={patient.id}>
                  <span>
                    {patient.name} - {plan ? plan.name : 'Avulso'} - {patient.cpf} -{' '}
                    {new Date(patient.birthDate).toLocaleDateString()}
                  </span>
                  <Buttons>
                    <Root
                      open={isEditing}
                      onOpenChange={(open) => {
                        if (open) {
                          setOriginalPatient(patient);
                          handleEdit(patient);
                        } else {
                          setOriginalPatient(null);
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <button>
                          <PencilSimpleLine size={20} />
                        </button>
                      </DialogTrigger>

                      {isEditing && (
                        <EditPatient
                          patient={patient}
                          onCancel={() => setOriginalPatient(null)}
                          onSuccess={() => {
                            fetchPatients();
                            setOriginalPatient(null);
                          }}
                        />
                      )}
                    </Root>

                    <button onClick={() => deletePatient(patient.id)}>
                      <Trash size={20} />
                    </button>
                  </Buttons>
                </div>
              );
            })}
          </PatientItem>
        </ListPatient>

        <CreatePatient />
      </div>
    </PatientContainer>
  );
}
