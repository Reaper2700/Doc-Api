API de Gerenciamento de Pacientes e Médicos

 Funcionalidades

 Pacientes (Patients)

- Criar Paciente  
  Endpoint: `POST /patients`  
  Descrição: Cria um novo paciente.

- Ler Pacientes  
  Endpoint: `GET /patients`  
  Descrição: Retorna uma lista de todos os pacientes.

- Ler Paciente único  
  Endpoint: `GET /patients/{id}`  
  Descrição: Retorna os detalhes de um paciente específico pelo seu ID.

- Atualizar Paciente  
  Endpoint: `PUT /patients/{id}`  
  Descrição: Atualiza os dados de um paciente específico.

- Deletar Paciente  
  Endpoint: `DELETE /patients/{id}`  
  Descrição: Deleta um paciente específico.



Médicos (Medics)

- Criar Médico  
  Endpoint: `POST /medics`  
  Descrição: Cria um novo médico.

- Ler Médicos  
  Endpoint: `GET /medics`  
  Descrição: Retorna uma lista de todos os médicos.

- Ler Médico único  
  Endpoint: `GET /medics/{id}`  
  Descrição: Retorna os detalhes de um médico específico pelo seu ID.

- Atualizar Médico  
  Endpoint: `PUT /medics/{id}`  
  Descrição: Atualiza os dados de um médico específico.

- Deletar Médico  
  Endpoint: `DELETE /medics/{id}`  
  Descrição: Deleta um médico específico.



 Tratativa de Erros

 Pacientes (Patients)

1. ID não encontrado (para Atualização e Deleção)  
   Causa: O ID do paciente não existe no banco de dados.  
   Mensagem de erro: "ID não encontrado"

2. CPF já cadastrado (para Criação e Atualização)  
   Causa: O CPF fornecido já está registrado para outro paciente.  
   Mensagem de erro: "CPF já cadastrado"

3. CPF inválido (para Criação e Atualização)  
   Causa: O CPF fornecido não é válido de acordo com as regras de formatação.  
   Mensagem de erro: "CPF inválido"

 Médicos (Medics)

1. ID não encontrado (para Atualização e Deleção)  
   Causa: O ID do médico não existe no banco de dados.  
   Mensagem de erro: "ID não encontrado"

2. CPF já cadastrado (para Criação e Atualização)  
   Causa: O CPF fornecido já está registrado para outro médico.  
   Mensagem de erro: "CPF já cadastrado"

3. CPF inválido (para Criação e Atualização)  
   Causa: O CPF fornecido não é válido de acordo com as regras de formatação.  
   Mensagem de erro: "CPF inválido"
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
        crm iguais(post,create)
