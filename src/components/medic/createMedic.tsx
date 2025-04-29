import React, { useState } from 'react';
import {api}  from '../../lib/axios';

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
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" />
      <input value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="CPF" />
      <input value={crm} onChange={(e) => setCrm(e.target.value)} placeholder="CRM" />
      <input value={birthDate} onChange={(e) => setBirthDate(e.target.value)} placeholder="Data de Nascimento" />
      <button type="submit">Salvar</button>
    </form>
  );
}