import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { usePlans } from "../../context/Plans/PlansProvider";
import { HeaderContainer } from "../header/styles";
import { Buttons, ListMedic, MedicContainer, MedicItem } from "../medic/stylesCreate";
import { PencilSimpleLine, Trash } from "@phosphor-icons/react";
import { EditPlans } from "./EditPlansModal";
import { useState } from "react";
import CreatePlan from "./CreatePlans";

interface Plans {
    id: string;
    name: string;
    varbase: number;
}

export function ListPlans() {
    const { plans, deletePlans, fetchPlans, handleEdit } = usePlans();
    const [originalPlan, setOriginalPlan] = useState<Plans | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const openEditModal = (plan: Plans) => {
        handleEdit(plan);
        setOriginalPlan(plan);
        setIsOpen(true);
    };

    const closeEditModal = () => {
        setIsOpen(false);
        setOriginalPlan(null);
    };

    return (
        <MedicContainer>
            <div>
                <HeaderContainer>
                    <div className="Name">
                        <h2>Lista de Planos</h2>
                        <h3>Quantidade de Planos: {plans.length}</h3>
                    </div>
                </HeaderContainer>

                <ListMedic>
                    <MedicItem>
                        {plans.map((plan) => (
                            <div className="Medicos" key={plan.id}>
                                <span>
                                    {plan.name} - {plan.varbase}
                                </span>
                                <Buttons>
                                    <button onClick={() => openEditModal(plan)}>
                                        <PencilSimpleLine size={20} />
                                    </button>
                                    <button onClick={() => deletePlans(plan.id)}>
                                        <Trash size={20} />
                                    </button>
                                </Buttons>
                            </div>
                        ))}
                    </MedicItem>
                </ListMedic>
                <CreatePlan/>
            </div>

            {originalPlan && (
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <div style={{ display: "none" }} />
                    </DialogTrigger>

                    <EditPlans
                        plan={originalPlan}
                        onCancel={closeEditModal}
                        onSuccess={() => {
                            fetchPlans();
                            closeEditModal();
                        }}
                    />
                </Dialog>
            )}
        <div/>
        </MedicContainer>
    );
}
