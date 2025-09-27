import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const PORT = process.env.PORT || 3001;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SGCPD API",
      version: "1.0.0",
      description: "Documentação da API para o Sistema de Gerenciamento de Conteúdo Pessoal Dinâmico",
    },
    servers: [
      { 
        url: `http://localhost:${PORT}`,
        description: "Servidor de Desenvolvimento"
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          description: "Representa um usuário do sistema.",
          properties: {
            id: { type: "integer", description: "ID único do usuário." },
            name: { type: "string", description: "Nome do usuário." },
            email: { type: "string", description: "E-mail do usuário (deve ser único)." },
            createdAt: { type: "string", format: "date-time", description: "Data de criação do usuário." },
            updatedAt: { type: "string", format: "date-time", description: "Data da última atualização." }
          },
          example: {
            id: 1,
            name: "João da Silva",
            email: "joao.silva@example.com",
            createdAt: "2025-09-27T14:30:00Z",
            updatedAt: "2025-09-27T14:30:00Z"
          },
        },
        Content: {
          type: "object",
          description: "Representa uma nota de conteúdo criada por um usuário.",
          properties: {
            id: { type: "integer", description: "ID único do conteúdo." },
            user_id: { type: "integer", description: "ID do usuário proprietário." },
            titulo: { type: "string", description: "Título da nota." },
            texto: { type: "string", description: "Corpo do texto da nota." },
            status: { type: "string", description: "Status do conteúdo (ex: 'pendente', 'concluído')." },
            createdAt: { type: "string", format: "date-time", description: "Data de criação da nota." },
            updatedAt: { type: "string", format: "date-time", description: "Data da última atualização da nota." }
          },
          example: {
            id: 1,
            user_id: 1,
            titulo: "Minha Primeira Nota",
            texto: "Este é o conteúdo da minha nota.",
            status: "pendente",
            createdAt: "2025-09-27T15:00:00Z",
            updatedAt: "2025-09-27T15:00:00Z"
          },
        },
        Tag: {
          type: "object",
          description: "Representa uma tag para categorizar conteúdos.",
          properties: {
            id: { type: "integer", description: "ID único da tag." },
            name: { type: "string", description: "Nome da tag (ex: 'Trabalho')." },
            createdAt: { type: "string", format: "date-time", description: "Data de criação da tag." },
            updatedAt: { type: "string", format: "date-time", description: "Data da última atualização da tag." }
          },
          example: {
            id: 1,
            name: "Trabalho",
            createdAt: "2025-09-27T16:00:00Z",
            updatedAt: "2025-09-27T16:00:00Z"
          },
        },
      },
    },
  },
  // Path to the files containing OpenAPI definitions
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}


module.exports = setupSwagger;