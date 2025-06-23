import { useState } from 'react';
import { Buttons, HeaderMedicContainer, ListMedic, MedicContainer, MedicItem } from './stylesCreate';
import CreateMedic from './createMedic';
import Medic from "../../assets/doc.png"
import { PencilSimpleLine, Trash } from '@phosphor-icons/react';
import { DialogTrigger, Root } from '@radix-ui/react-dialog';
import { EditMedic } from './Modal/EditMedic';

import { useMedics } from '../../context/Medics/MedicProvider';

interface Medic {
  id: number;
  name: string;
  cpf: string;
  crm: string;
  birthDate: string;
}

export default function ListMedics() {
  const { medics, fetchMedic, deleteMedic, handleEdit} = useMedics()

  const [originalMedic, setOriginalMedic] = useState<Medic | null>(null);

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
                    <button onClick={() => {handleEdit(medic), setOriginalMedic(medic)}}>
                    <PencilSimpleLine size={20} />
                    </button>
                </DialogTrigger>
                  <EditMedic
                    medic={originalMedic}
                    onCancel={() =>setOriginalMedic(null)}
                    onSuccess={() => {
                      fetchMedic();
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
