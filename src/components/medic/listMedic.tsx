import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../../lib/axios';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { ListMedic } from './stylesCreate';
import CreateMedic from './createMedic';

interface Medic {
  id: number;
  name: string;
  cpf: string;
  crm: string;
  birthDate: string;
}

export default function ListMedics() {
  const [medics, setMedics] = useState<Medic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [originalMedic, setOriginalMedic] = useState<Medic | null>(null);

  const { register, handleSubmit, reset, setValue, getValues, formState: { errors } } = useForm<Medic>();

  const fetchMedics = async () => {
    try {
      const res = await api.get('/medic');
      setMedics(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedics();
  }, []);

  const deleteMedic = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir o médico?')) {
      try {
        await api.delete(`/medic/${id}`);
        fetchMedics();
      } catch (error) {
        console.error(error);
      }
    }
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
      alert('Nenhuma alteração detectada.');
      return;
    }

    try {
      await api.patch(`/medic/${originalMedic.id}`, updatedFields);
      alert('Médico atualizado com sucesso!');
      fetchMedics();
      reset();
      setEditingId(null);
      setOriginalMedic(null);
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar médico.');
    }
  };

  const handleEdit = (medic: Medic) => {
    setEditingId(medic.id);
    setOriginalMedic(medic);
    Object.entries(medic).forEach(([key, value]) => {
      setValue(key as keyof Medic, value);
    });
  };

  if (loading) return <p className="text-center">Carregando...</p>;

  return (
    <div>
    <ListMedic>
    <div>
      <h2>Lista de Médicos</h2>
      <ul>
        {medics.map(medic => (
          <li key={medic.id} className="flex justify-between items-center bg-gray-100 p-3 rounded shadow">
            <span>{medic.name} - {medic.crm} - {medic.cpf} - {medic.birthDate}</span>
            <div className="space-x-2">
              <button onClick={() => handleEdit(medic)} className="text-blue-500 hover:text-blue-700">
                <FaEdit />
              </button>
              <button onClick={() => deleteMedic(medic.id)} className="text-red-500 hover:text-red-700">
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editingId && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3>Editar Médico</h3>

          <input type="hidden" {...register('id')} />

          <div>
            <label>Nome</label>
            <input className="w-full border p-2 rounded" {...register('name', { required: true })} />
            {errors.name && <p>Nome é obrigatório</p>}
          </div>

          <div>
            <label>CRM</label>
            <input {...register('crm', { required: true })} />
            {errors.crm && <p>CRM é obrigatório</p>}
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
            <button type="button" onClick={() => { reset(); setEditingId(null); setOriginalMedic(null); }}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">
              Cancelar
            </button>
          </div>
        </form>
      )}
      <CreateMedic/>
    </div>
    </ListMedic>
    </div>
  );
}
