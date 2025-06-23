import { useEffect } from "react";
import { api } from "../../lib/axios";
import { DialogClose, DialogPortal, DialogTitle } from "@radix-ui/react-dialog";
import { Content, Overlay } from "../medic/Modal/styles";
import { useForm } from "react-hook-form";

interface Plans {
  id: string;
  name: string;
  varbase: number;
}

interface EditPlansProps {
  plan: Plans;
  onCancel: () => void;
  onSuccess: () => void;
}

export function EditPlans({ plan, onCancel, onSuccess }: EditPlansProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields, isSubmitting },
  } = useForm<Plans>({
    defaultValues: plan,
    mode: "onChange",
  });

  useEffect(() => {
    if (plan) {
      reset(plan);
    }
  }, [plan, reset]);

  const onSubmit = async (data: Plans) => {
    const updatedData: Partial<Plans> = {};

    for (const key in dirtyFields) {
      const typedKey = key as keyof Plans;
      updatedData[typedKey] = data[typedKey];
    }

    console.log("Campos alterados:", updatedData);

    if (Object.keys(updatedData).length === 0) {
      alert("Nenhuma alteração feita.");
      return;
    }

    try {
      await api.patch(`/plans/${data.id}`, updatedData);
      alert("Plano atualizado!");
      onSuccess();
    } catch (error: any) {
      if (error.response) {
        console.error("Erro de validação:", error.response.data);
        alert(JSON.stringify(error.response.data, null, 2));
      } else {
        console.error(error);
        alert("Erro inesperado ao atualizar plano.");
      }
    }
  };

  return (
    <DialogPortal>
      <Overlay />
      <Content>
        <DialogTitle>Editar Plano</DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register("id")} />

          <div>
            <label>Nome</label>
            <input
              className="w-full border p-2 rounded"
              {...register("name", { required: "Nome é obrigatório" })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label>Valor do Plano</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              {...register("varbase", {
                required: "Valor é obrigatório",
                valueAsNumber: true,
              })}
            />
            {errors.varbase && (
              <p className="text-red-500 text-sm">{errors.varbase.message}</p>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Atualizar
            </button>
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              onClick={() => {
                reset(plan);
                onCancel();
              }}
            >
              Cancelar
            </button>
          </div>
        </form>

        <DialogClose asChild>
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-black"
            aria-label="Fechar"
          >
            ✕
          </button>
        </DialogClose>
      </Content>
    </DialogPortal>
  );
}
