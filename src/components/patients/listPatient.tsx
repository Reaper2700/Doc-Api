import React, { useEffect, useState } from 'react';
import { api } from '../../lib/axios';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import CreatePatient from './createPatient';
import { Buttons, HeaderPatientContainer, ListPatient, PatientContainer, PatientItem } from './styles';
import { PencilSimpleLine, Trash } from '@phosphor-icons/react';
import { DialogTrigger, Root } from '@radix-ui/react-dialog';
import { EditPatient } from './Modal/EditPatient';

interface Patient {
  id: number;
  name: string;
  cpf: string;
  health_plan: number;
  birthDate: string;
}

interface Plans {
  id: number,
  name: string,
  varbase:number,
}

export default function ListPatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [originalPatient, setOriginalPatient] = useState<Patient | null>(null);

  const { register, handleSubmit, reset, setValue, getValues, formState: { errors } } = useForm<Patient>();

  const [plans, setPlans] = useState<Plans[]>([])

  const fetchPlans= async () => {
    try {
      const res = await api.get('/plans');
      setPlans(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPatients = async () => {
      try {
        const res = await api.get('/patient');
        setPatients(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchPatients();
    }, []);

  const deletePatient = async (id: number) => {
      if (window.confirm('Tem certeza que deseja excluir o paciente?')) {
        try {
          await api.delete(`/patient/${id}`);
          fetchPatients(); // Recarrega os dados após deletar
        } catch (error) {
          console.error(error);
        }
      }
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
 
     // Se nada mudou, não envia
     if (Object.keys(updatedFields).length === 0) {
       alert('Nenhuma alteração detectada.');
       return;
     }
 
     try {
       await api.patch(`/patient/${originalPatient.id}`, updatedFields);
       alert('Paciente atualizado com sucesso!');
       fetchPatients();
       reset();
       setEditingId(null);
       setOriginalPatient(null);
     } catch (error) {
       console.error(error);
       alert('Erro ao atualizar médico.');
     }
   };
 
   const handleEdit = (patient: Patient) => {
     setEditingId(patient.id);
     setOriginalPatient(patient);
     Object.entries(patient).forEach(([key, value]) => {
       setValue(key as keyof Patient, value);
     });
   };

    if (loading) {
      return <p>Carregando...</p>;
    }
  return (
      <PatientContainer>
        <div>
          <HeaderPatientContainer>
            <div className='Name'>
              <h2>Lista de Pacientes</h2>
            </div>
            <h3>Quantidade de pacientes: {patients.length}</h3>
          </HeaderPatientContainer>
        <ListPatient>
          <PatientItem>
            {patients.map(patient => {
                  const plan = plans.find(p=> p.id === patient.health_plan)
                  return(
              <div className='Patients' key={patient.id}>
                <span>{patient.name} - {plan?.name} - {patient.cpf} - {new Date(patient.birthDate).toLocaleDateString()}</span>
                <Buttons>
                  <Root>
                  <DialogTrigger asChild>
                    <button onClick={() => handleEdit(patient)}>
                    <PencilSimpleLine size={20} />
                    </button>
                </DialogTrigger>
                  <EditPatient
                    patient={originalPatient}
                    onCancel={() =>setOriginalPatient(null)}
                    onSuccess={() => {
                      fetchPatients();
                      setOriginalPatient(null);
                    }}
                    />
                </Root>
                  <button onClick={() => deletePatient(patient.id)}>
                    <Trash size={20} />
                  </button>
                </Buttons>
              </div>
              )})}
          </PatientItem>
        </ListPatient>
        <CreatePatient/>
        </div>
      </PatientContainer>
    );
}
