import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../../lib/axios';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { Buttons, HeaderMedicContainer, ListMedic, MedicContainer, MedicItem } from './stylesCreate';
import CreateMedic from './createMedic';
import Medic from "../../assets/doc.png"
import { PencilSimpleLine, Trash } from '@phosphor-icons/react';
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, Root } from '@radix-ui/react-dialog';
import { EditMedic } from './Modal/EditMedic';

interface Medic {
  id: number;
  name: string;
  cpf: string;
  crm: string;
  birthDate: number;
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

    
  };

  const handleEdit = (medic: Medic) => {
    setEditingId(medic.id);
    setOriginalMedic(medic);
    Object.entries(medic).forEach(([key, value]) => {
      setValue(key as keyof Medic, value);
    });
  };

  if (loading) return <p>Carregando...</p>;
  
  type Props = {
    dataString: string
  }
  return (
    <MedicContainer>
      <div>
        <HeaderMedicContainer>
          <div className='Name'>
            <img src={Medic}/>
            <h2>Lista de Médicos</h2>
          </div>
          <h3>Quantidade de Médicos: {medics.length}</h3>
        </HeaderMedicContainer>
        <ListMedic>
        <MedicItem>
          {medics.map(medic => (
            <div className='Medicos' key={medic.id}>
              <span>{medic.name} - {medic.crm} - {medic.cpf} - {new Date(medic.birthDate).toLocaleDateString()}</span>
              <Buttons>
                <Root>
                  <DialogTrigger asChild>
                    <button onClick={() => handleEdit(medic)}>
                    <PencilSimpleLine size={20} />
                    </button>
                </DialogTrigger>
                  <EditMedic
                    medic={originalMedic}
                    onCancel={() =>setOriginalMedic(null)}
                    onSuccess={() => {
                      fetchMedics();
                      setOriginalMedic(null);
                    }}
                    />
                </Root>

                <button onClick={() => deleteMedic(medic.id)}>
                  <Trash size={20} />
                </button>
              </Buttons>
            </div>
          ))}
        </MedicItem>
        </ListMedic>
      <CreateMedic/>
    </div>
    </MedicContainer>
  );
}
