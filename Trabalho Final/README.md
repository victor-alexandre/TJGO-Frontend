# Sistema de Gerenciamento de Conteúdo Pessoal Dinâmico (SGCPD)

## 📑 Sumário

- [📌 Descrição](#-descrição)
- [👨‍💻 Equipe de Desenvolvimento](#-equipe-de-desenvolvimento)
- [📅 Cronograma de Entregas](#-cronograma-de-entregas)
- [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
- [🚀 Funcionalidades](#-funcionalidades)
- [📋 Requisitos do Sistema](#-requisitos-do-sistema)
- [🗃️ Modelo Entidade-Relacionamento (MER)](#️-modelo-entidade-relacionamento-mer)
- [📂 Estrutura do Projeto](#-estrutura-do-projeto-proposta)
- [⚙️ Como Executar o Projeto](#️-como-executar-o-projeto)
- [🗂️ Divisão de Tarefas](#️-divisão-de-tarefas)
- [📖 Licença](#-licença)

---

## 📌 Descrição

O **SGCPD** é uma aplicação web desenvolvida com **Node.js, Express, React e PostgreSQL**, conteinerizada com **Docker**,
para gerenciamento de conteúdos pessoais (ex.: notas de texto).  
O sistema permite criar, organizar, buscar e filtrar informações de forma simples e intuitiva, inspirado em ferramentas como o [Evernote](https://evernote.com/pt-br).

---

## 👨‍💻 Equipe de Desenvolvimento

| Integrante        | Papel no Projeto                        | Principais Responsabilidades                                                                 |
| ----------------- | --------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Owen**          | 🧑‍💻 Tech Lead / Fullstack              | Liderança técnica, definição de arquitetura, componentes React, navegação e integração com DB |
| **Solenir**       | 🎨 Frontend Developer / Fullstack       | Estilização (CSS), design responsivo, definição de componentes e implementação de telas        |
| **Renato**        | ⚙️ Backend Developer / Fullstack        | Desenvolvimento da API Node.js, modelagem de dados e endpoints                                |
| **Victor Alexandre** | 🧭 Product Owner / Scrum Master / QA | Organização do time, documentação, acompanhamento das entregas, design, testes e validação    |


---

## 📅 Cronograma de Entregas

- **Entrega 1 (22/09/2025)** → [Protótipo visual](https://www.figma.com/design/9uV5xXigW1zoeqREa4u6e6/Tarefa-Frontend---UFG-TJGO?m=auto&t=JKAtn9DRB2dW3C13-1) no Figma. ✅
- **Entrega 2 (29/09/2025)** → CRUD funcional de uma entidade - Será apresentado em aula. ✅
- **Entrega 3 (06/10/2025)** → Projeto final completo (CRUD + filtros + responsividade) - Será apresentado em aula. ✅

---

## 🛠️ Tecnologias Utilizadas

- React (Front-End)
- Node.js + Express (Back-End)
- PostgreSQL (Banco de Dados)
- Docker + Docker Compose
- CSS3

---

## 🚀 Funcionalidades

- **CRUD de Usuários**
- **CRUD de Conteúdo**
- **Categorização e Tags**
- **Busca e Filtragem**
- **Design Responsivo**
- **Interface Intuitiva (UX)**

---

## 📋 Requisitos do Sistema

### 🔹 Requisitos Funcionais

| ID    | Requisito          | Descrição                                    |
| ----- | ------------------ | -------------------------------------------- |
| RF-01 | CRUD de Usuário    | Criar, ler, atualizar e deletar usuários.    |
| RF-02 | CRUD de Conteúdo   | Criar, ler, atualizar e deletar notas.       |
| RF-03 | Tags               | Adicionar categorias/tags.                   |
| RF-04 | Filtragem e Busca  | Buscar itens por texto, categoria ou status. |
| RF-05 | Responsividade     | Funcionar em desktop, tablet e mobile.       |

### 🔹 Requisitos Não Funcionais

| ID     | Requisito        | Descrição                               | Justificativa                |
| ------ | ---------------- | --------------------------------------- | ---------------------------- |
| RNF-01 | Usabilidade (UX) | Interface clara, lógica e com feedback. | Boa experiência do usuário.  |
| RNF-02 | Performance      | Respostas rápidas.                      | Melhor retenção.             |
| RNF-03 | Manutenibilidade | Código modular e comentado.             | Facilita evolução.           |
| RNF-04 | Segurança        | Hash de senhas e comunicação segura.    | Protege dados.               |
| RNF-05 | Ambiente DevOps  | Docker Compose.                         | Evita conflitos de ambiente. |

---

## 🗃️ Modelo Entidade-Relacionamento (MER)

```mermaid
erDiagram
    USERS {
        int id PK
        string name
        string email
        string password
        datetime createdAt
        datetime updatedAt
    }
    CONTENTS {
        int id PK
        string titulo
        string texto
        string status
        datetime createdAt
        datetime updatedAt
        int user_id FK
    }
    TAGS {
        int tag_id PK
        string nome
        datetime createdAt
        datetime updatedAt
    }
    CONTENT_TAGS {
        int content_id FK
        int tag_id FK
        datetime createdAt
        datetime updatedAt
    }

    USERS ||--o{ CONTEUDOS : "possui"
    CONTEUDOS ||--o{ CONTEUDO_TAG : "associado"
    TAGS ||--o{ CONTEUDO_TAG : "classifica"
```

---

## 📂 Estrutura do Projeto Simplificada

```bash
Trabalho Final/
│── client/
│   ├── public/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── contexts/
│       ├── pages/
│       ├── routes/
│       ├── utils/
│       ├── App.css
│       ├── App.js
│   ├── .env
│   ├── .gitignore
│   ├── Dockerfile.dev
│   ├── package-lock.json
│   ├── package.json
│
│── server/
│   ├── config/
│   ├── migrations/
│   ├── models/
│   ├── routes/
│   ├── seeders/
│   ├── src/
│   ├── .env
│   ├── .gitignore
│   ├── Dockerfile.dev
│   ├── entrypoint.sh
│   ├── package-lock.json
│   └── package.json
│
│── .gitignore
│── Atividade - Projeto Final.pdf
│── docker-compose.yml
│── README.md
```

---

## ⚙️ Como Executar o Projeto

1. Clone este repositório:
   ```bash
   git clone https://github.com/victor-alexandre/TJGO-Frontend.git
   ```
2. Acesse a pasta do projeto:
   ```bash
   cd Trabalho Final
   ```
3. Suba os containers com Docker Compose:
   ```bash
   docker-compose up --build
   ```
4. Acesse a aplicação no navegador:
   - Front-End → http://localhost:3000
   - Back-End → http://localhost:3001
   - Banco → localhost:5432


---

## 📘 Guia do Usuário

O Guia do Usuário descreve como utilizar a aplicação SGCPD e testar a API via Swagger.

1️⃣ Acessando a aplicação

🌐 Abra o navegador e acesse:

http://localhost:3000


🔑 Faça login ou registre um novo usuário.

2️⃣ Funcionalidades principais

📝 Criar Nota → Clique em "Adicionar Nota", preencha título, conteúdo e tags.

✏️ Editar Nota → Abra uma nota existente e clique em "Editar".

🗑️ Deletar Nota → Abra uma nota e clique em "Excluir".

🏷️ Gerenciar Tags → Crie, edite ou exclua categorias para organizar suas notas.

🔍 Buscar/Filtrar → Utilize a barra de busca para filtrar notas por título, conteúdo ou tags.

3️⃣ Navegação

📂 Menu lateral → Acesso rápido a notas, tags e perfil.

👤 Perfil do usuário → Atualize dados de cadastro e senha.

4️⃣ Observações

💾 Todas as alterações são salvas automaticamente no banco de dados.

🔄 Para reiniciar a aplicação, certifique-se de que os containers Docker estejam rodando:

docker-compose up


💡 Dica: futuramente você pode adicionar prints para ilustrar cada passo.

## 🛠️ Swagger da API

A API do SGCPD possui documentação interativa via Swagger, que permite testar as rotas de forma visual e intuitiva.

1. 🌐 Acessando o Swagger

Certifique-se de que o backend esteja rodando (http://localhost:3001).

Abra no navegador:

http://localhost:3001/api-docs

2. ⚙️ Funcionalidades do Swagger

👀 Visualizar todas as rotas disponíveis → GET, POST, PUT e DELETE.

🧪 Testar requisições diretamente no navegador.

📄 Ver exemplos de request e response para cada endpoint.

3. 🚀 Exemplos rápidos de uso

📝 Criar uma nota
→ Selecione o endpoint POST /contents.
→ Preencha os campos titulo, texto e tags.
→ Clique em Execute para enviar a requisição.

🔍 Buscar notas
→ Selecione o endpoint GET /contents.
→ Clique em Execute para visualizar todas as notas cadastradas.

✏️ Atualizar nota
→ Selecione PUT /contents/{id}.
→ Informe o id da nota e os campos que deseja atualizar.
→ Clique em Execute.

🗑️ Deletar nota
→ Selecione DELETE /contents/{id}.
→ Informe o id da nota a ser removida.
→ Clique em Execute.

💡 Dica: Utilize o Swagger para testar rapidamente a API antes de usar o frontend ou para entender os parâmetros de cada rota.



---

## 🗂️ Divisão de Tarefas

| Tópico        | Tarefa                                                             | Responsável    | Data Entrega | Status | Observações                                    |
| ------------- | ------------------------------------------------------------------ | -------------- | ------------ | ------ | ---------------------------------------------- |
| Documentação  | Criar Readme no git                                                | Victor         | 15/09/2025   | OK     |                                                |
| Documentação  | Criar MER do banco                                                 | Owen           | 15/09/2025   | OK     |                                                |
| Documentação  | Criar DER do banco                                                 | Victor         | 22/09/2025   | OK     |                                                |
| Documentação  | Definir os requisitos                                              | Renato         | 17/09/2025   | OK     | Os requisitos definidos serão colocados no Readme |
| Documentação  | Consolidar a documentação no Readme do GitHub                      | Victor         |              | OK     |                                                |
| Design        | Criar os fluxos no Figma                                           | Victor         | 21/09/2025   | OK     |                                                |
| Código        | Criar a API - backend Node                                         | Owen/Victor    |              | OK     |                                                |
| Código        | Definir rotas                                                      | Victor         |              | OK     |                                                |
| Código        | Adicionar usuário                                                  | Victor         |              | OK     |                                                |
| Código        | Editar usuário                                                     | Victor         |              | OK     |                                                |
| Código        | Adicionar Nota                                                     | Victor/Renato  |              | OK     |                                                |
| Código        | Buscar Nota                                                        | Victor         |              | OK     |                                                |
| Código        | Editar Nota                                                        | Victor/Renato  |              | OK     |                                                |
| Código        | Adicionar TAG                                                      | Victor         |              | OK     |                                                |
| Código        | Criar o arquivo de configuração Backend: `dockerfile`              | Owen/Victor    |              | OK     |                                                |
| Código        | Criar o banco - Postgres (ou usar equivalente às migrations Ruby)  | Owen           |              | OK     |                                                |
| Código        | Criar o frontend - React                                           | Solenir/Renato |              | OK     |                                                |
| Código        | Definir Componentes                                                | Solenir        |              | OK     |                                                |
| Código        | Tela Cadastro                                                      | Solenir        |              | OK     |                                                |
| Código        | Tela Login                                                         | Solenir        |              | OK     |                                                |
| Código        | Tela página principal                                              | Solenir        |              | OK     |                                                |
| Código        | Tela de adicionar nota                                             | Renato         |              | OK     |                                                |
| Código        | Tela de editar nota                                                | Renato         |              | OK     |                                                |
| Código        | Tela de adicionar tag                                              | Renato         |              | OK     |                                                |
| Código        | Tela de editar tag                                                 | Renato         |              | OK     |                                                |
| Código        | Tela de editar perfil                                              | Renato         |              | OK     |                                                |
| Código        | Menu Lateral                                                       | Solenir        |              | OK     |                                                |
| Código        | Busca de notas por tag, título e conteúdo                          | Solenir        |              | OK     |                                                |
| Código        | Criar o arquivo de configuração Frontend: `dockerfile`             | Solenir        |              | OK     |                                                |
| Código        | Criar o deploy com o Docker Compose                                | Owen/Victor    |              | OK     |                                                |
| Revisão Geral | Revisão geral do projeto                                           | Todos          |              | OK     |                                                |
| Apresentação  | Apresentar durante a aula o projeto                                | Victor/Owen    |              |        |                                                |

---

## 📖 Licença

Projeto acadêmico, sem fins comerciais.
