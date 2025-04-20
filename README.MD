task one

Pacientes (Patients)
   OK Criar Paciente
        Endpoint: POST /patients
    OK Ler Pacientes
        Endpoint: GET /patients
    Falta Ler unique Paciente
        Endpoint: GET /patients/{id}
    OK Atualizar Paciente
        Endpoint: PUT /patients/{id}
    OK Deletar Paciente
        Endpoint: DELETE /patients/{id}

Médicos (Medics)
    Criar Médico
        Endpoint: POST /medics
    Ler Médico
        Endpoint: GET /medics
    Falta Ler unique Medico
        Endpoint: GET /patients/{id}
    Atualizar Médico
        Endpoint: PUT /medics/{id}
    Deletar Médico
        Endpoint: DELETE /medics/{id}

tratativa de erros
    patients 
        ids não encontrado(update, delete)
        cpf iguais(post,update)
        cpf invalido(post,create)

    Medic
        ids não encontrado(update, delete)
        cpf iguais(post,update)
        cpf invalido(post,create)
