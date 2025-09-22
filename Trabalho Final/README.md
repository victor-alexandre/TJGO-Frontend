# Sistema de Gerenciamento de Conteúdo Pessoal Dinâmico (SGCPD)

## 📌 Descrição
O **SGCPD** é uma aplicação web desenvolvida com **Node.js, React e PostgreSQL**, conteinerizada com **Docker**, 
para gerenciamento de conteúdos pessoais (ex.: notas de texto).  
O sistema permite criar, organizar, buscar e filtrar informações de forma simples e intuitiva, inspirado em ferramentas como o [Evernote](https://evernote.com/pt-br).

---

## 📅 Cronograma de Entregas
- **Entrega 1 (22/09/2025)** → [Protótipo visual](https://www.figma.com/design/9uV5xXigW1zoeqREa4u6e6/Tarefa-Frontend---UFG-TJGO?m=auto&t=JKAtn9DRB2dW3C13-1) de navegação feito no Figma ✅.  
- **Entrega 2 (29/09/2025)** → CRUD funcional de uma entidade - Será apresentado em aula.  
- **Entrega 3 (06/10/2025)** → Projeto final completo (CRUD + filtros + responsividade) - Será apresentado em aula.  

---

## 🚀 Funcionalidades
- **CRUD de Usuários**: Criar, visualizar, atualizar e excluir usuários.
- **CRUD de Conteúdo**: Criar, visualizar, atualizar e excluir notas de texto.
- **Categorização e Tags**: Adicionar categorias/tags para melhor organização.
- **Busca e Filtragem**: Localizar conteúdos por texto, categoria ou status.
- **Design Responsivo**: Layout adaptado para desktop, tablet e mobile.
- **Interface Intuitiva (UX)**: Navegação clara e feedback visual nas interações.

---

## 🛠️ Tecnologias Utilizadas
- **React (Front-End)** → Criação da interface e componentes dinâmicos.  
- **Node.js + Express (Back-End)** → API REST para lógica de negócio.  
- **PostgreSQL (Banco de Dados)** → Armazenamento dos usuários e conteúdos.  
- **Docker** → Containerização para facilitar deploy e desenvolvimento.  
- **CSS3** → Estilização, design responsivo (mobile-first).  

---

## 📂 Estrutura do Projeto (Proposta)
```bash
SGCPD/
│── client/                 # Aplicação React (Front-End)
│   ├── public/
│   └── src/
│       ├── components/     # Componentes reutilizáveis
│       ├── pages/          # Páginas principais
│       ├── services/       # Integração com API
│       └── App.js
│
│── server/                 # Aplicação Node.js (Back-End)
│   ├── src/
│   │   ├── controllers/    # Lógica de controle
│   │   ├── models/         # Modelos do banco (PostgreSQL)
│   │   ├── routes/         # Rotas da API
│   │   └── server.js       # Arquivo principal
│   └── package.json
│
│── docker-compose.yml      # Orquestração com Docker
│── README.md               # Documentação do projeto
```

---

## ⚙️ Como Executar o Projeto
1. Clone este repositório:
   ```bash
   git clone https://github.com/usuario/sgcpd.git
   ```
2. Acesse a pasta do projeto:
   ```bash
   cd sgcpd
   ```
3. Suba os containers com Docker Compose:
   ```bash
   docker-compose up --build
   ```
4. Acesse a aplicação no navegador:  
   - Front-End → `http://localhost:3000`  
   - Back-End (API) → `http://localhost:5000`  
   - Banco de Dados → `localhost:5432`  

---

## 👨‍💻 Equipe de Desenvolvimento
- **Membro 1** → Estrutura de componentes React e navegação.  
- **Membro 2** → Estilização (CSS) e responsividade.  
- **Membro 3** → API Node.js (CRUD de usuários e conteúdos).  
- **Membro 4** → Integração com PostgreSQL, busca, filtragem e documentação.  

---

## 📊 Critérios de Avaliação
- **Funcionalidade** → 50%  
- **Design e Usabilidade (UX)** → 20%  
- **Responsividade** → 20%  
- **Documentação (README.md)** → 10%  

---

## 📖 Licença
Este projeto é de uso acadêmico e não possui fins comerciais.
