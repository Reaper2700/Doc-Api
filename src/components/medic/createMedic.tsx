import React, { useEffect, useState } from 'react';
import {api}  from '../../lib/axios';
import { CampMedic, CreateMedicContainer } from './stylesCreate';

export default function CreateMedic() {
  const [name, setName] = useState<string>('');
  const [cpf, setCpf] = useState<string>('');
  const [crm, setCrm] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/medic', { name, cpf, crm, birthDate });
      alert('Médico cadastrado!');

      setName('');
      setCpf('');
      setCrm('');
      setBirthDate('');
    } catch (error: any) {
      if (error.response) {
        console.error('Erro de validação:', error.response.data);
        alert(JSON.stringify(error.response.data, null, 2)); // mostra os problemas
      } else {
        console.error(error);
        alert('Erro inesperado ao cadastrar médico.');
      }
    }
  };

  return (
    <CreateMedicContainer>
      <form onSubmit={handleSubmit}>
        <CampMedic>
          <div className='Item'>
            <label>Nome</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" />
          </div>
          <div>
            <label>CRM</label>
            <input value={crm} onChange={(e) => setCrm(e.target.value)} placeholder="CRM" />
          </div>
          <div>
          <label>CPF</label>
            <input value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="CPF" />
          </div>
          <div>
          <label>Data de Nascimento</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>
        </CampMedic>
        <div className='ButtonMedic'>
          <button type="submit">Criar Médico</button>
        </div>
      </form>
    </CreateMedicContainer>
  );
}