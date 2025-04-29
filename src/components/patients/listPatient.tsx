import React, { useEffect, useState } from 'react';
import { api } from '../../lib/axios';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import CreatePatient from './createPatient';

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
      <div>
        <h2>Lista de Pacientes</h2>
        <ul>
          {patients.map(patient => {
                const plan = plans.find(p=> p.id === patient.health_plan)
                return(
            <li key={patient.id}>
              <span>{patient.name} - {plan?.name} - {patient.cpf} - {patient.birthDate}</span>
              <div className="space-x-2">
                <button onClick={() => handleEdit(patient)}>
                  <FaEdit />
                </button>
                <button onClick={() => deletePatient(patient.id)}>
                  <FaTrash />
                </button>
              </div>
            </li>
            )})}
          {plans.map(plan =>(
            <li key={plan.id}>
              <span>{plan.name} - {plan.varbase}</span>
            </li>
          ))}  
        </ul>
  
        {editingId && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Editar Médico</h3>
  
            <input type="hidden" {...register('id')} />
  
            <div>
              <label className="block mb-1">Nome</label>
              <input className="w-full border p-2 rounded" {...register('name', { required: true })} />
              {errors.name && <p className="text-red-500 text-sm">Nome é obrigatório</p>}
            </div>
  
            <div>
              <label className="block mb-1">CRM</label>
              <input className="w-full border p-2 rounded" {...register('health_plan', { required: true })} />
              {errors.health_plan && <p className="text-red-500 text-sm">Plano é obrigatorio</p>}
            </div>
  
            <div>
              <label className="block mb-1">CPF</label>
              <input className="w-full border p-2 rounded" {...register('cpf', { required: true })} />
              {errors.cpf && <p className="text-red-500 text-sm">CPF é obrigatório</p>}
            </div>
  
            <div>
              <label className="block mb-1">Data de Nascimento</label>
              <input type="date" className="w-full border p-2 rounded" {...register('birthDate', { required: true })} />
              {errors.birthDate && <p className="text-red-500 text-sm">Data de nascimento é obrigatória</p>}
            </div>
  
            <div className="flex gap-4">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Atualizar
              </button>
              <button type="button" onClick={() => { reset(); setEditingId(null); setOriginalPatient(null); }}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">
                Cancelar
              </button>
            </div>
          </form>
        )}
        <CreatePatient/>
      </div>
    );
}
