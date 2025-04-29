import React, { useEffect, useState } from 'react';
import {api}  from '../../lib/axios';


interface Plans {
  id: number,
  name: string,
  varbase:number,
}

export default function CreatePatient() {
  const [name, setName] = useState<string>('');
  const [cpf, setCpf] = useState<string>('');
  const [health_plan, setHealthPlan] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('')
  
  const [plans, setPlans] = useState<Plans[]>([])

  useEffect(() => {
    const fetchPlans = async() =>{
      try{
        const response = await api.get('/plans')
        setPlans(response.data)
      }catch (error) {
        console.error('Erro ao buscar planos:', error);
      }
    }

    fetchPlans();
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!health_plan){
      alert('Selecione um plano de saúde')
      return
    }
    
    console.log({ name, cpf, health_plan, birthDate });

    try {
      await api.post('/patient', { name, cpf, health_plan, birthDate });
      alert('Paciente cadastrado!');

      setName('');
      setCpf('');
      setHealthPlan('');
      setBirthDate('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow mt-8">
      <h3 className="text-lg font-semibold">Cadastrar Paciente</h3>

      <div>
        <label className="block mb-1">Nome</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome"
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1">CPF</label>
        <input
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          placeholder="CPF"
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1">Plano de Saúde</label>
        <select
          value={health_plan}
          onChange={(e) => setHealthPlan(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Selecione um plano</option>
          {plans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1">Data de Nascimento</label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Salvar
      </button>
    </form>
  );
}