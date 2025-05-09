import React, { useEffect, useState } from 'react';
import {api}  from '../../lib/axios';
import { CampPatient, CreatePatientContainer } from './styles';


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
    }  catch (error: any) {
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
    <CreatePatientContainer>
      <form onSubmit={handleSubmit}>
        <CampPatient>

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
          <label>CPF</label>
          <input
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="CPF"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Plano de Saúde</label>
          <select
            value={health_plan}
            onChange={(e) => setHealthPlan(e.target.value)}
            className='HealthPlan'
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
          <label>Data de Nascimento</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>

        </CampPatient>
        <div className='ButtonPatient'>
          <button type="submit">Criar Paciente</button>
        </div>
      </form>
    </CreatePatientContainer>
  );
}