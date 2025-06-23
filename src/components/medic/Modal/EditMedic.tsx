import { DialogClose, DialogPortal, DialogTitle } from "@radix-ui/react-dialog";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Content, Overlay } from "./styles";
import { api } from "../../../lib/axios";

interface Medic {
  id: number;
  name: string;
  cpf: string;
  crm: string;
  birthDate: string;
}

interface EditMedicProps {
  medic: Medic | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export function EditMedic({ medic, onCancel, onSuccess }: EditMedicProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields }
  } = useForm<Medic>({
    defaultValues: medic || {},
  });

  useEffect(() => {
    if (medic){
       reset({...medic,
      birthDate: new Date(medic.birthDate).toISOString().split("T")[0]
    });
   }
  }, [medic]);

  const onSubmit = async (data: Medic) => {
    const updatedData: Partial<Record<keyof Medic, string | number>> = {};
     
    for (const key in dirtyFields) {
    const typedKey = key as keyof Medic;

    if (typedKey === "birthDate") {
      updatedData[typedKey] = new Date(data.birthDate).getTime();
    } else {
      updatedData[typedKey] = data[typedKey];
    }
  }

    try {
      await api.patch(`/medic/${data.id}`, updatedData);
      alert("Médico atualizado!");
      onSuccess();
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

  if (!medic) return null;

  return (
    <DialogPortal>
      <Overlay />
      <Content>
        <DialogTitle>Editar Médico</DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register("id")} />

          <div>
            <label>Nome</label>
            <input
              className="w-full border p-2 rounded"
              {...register("name", { required: true })}
            />
            {errors.name && <p>Nome é obrigatório</p>}
          </div>

          <div>
            <label>CRM</label>
            <input {...register("crm", { required: true })} />
            {errors.crm && <p>CRM é obrigatório</p>}
          </div>

          <div>
            <label>CPF</label>
            <input
              className="w-full border p-2 rounded"
              {...register("cpf", { required: true })}
            />
            {errors.cpf && <p>CPF é obrigatório</p>}
          </div>

          <div>
              <label>Data de Nascimento</label>
              <input type="date" {...register('birthDate', { required: true })} />
              {errors.birthDate && <p>Data de nascimento é obrigatória</p>}
            </div>

          <div>
            <button
              type="submit">
              Atualizar
            </button>
            <button
              type="button"
              onClick={() => {
                reset();
                onCancel();
              }}>
              Cancelar
            </button>
          </div>
        </form>

        <DialogClose />
      </Content>
    </DialogPortal>
  );
}
