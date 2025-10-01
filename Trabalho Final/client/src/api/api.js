// client/src/api/api.js
// A URL base da sua API, lida a partir do arquivo .env do cliente
const API_BASE_URL = process.env.REACT_APP_API_URL;

// Função auxiliar para obter o token de autenticação do localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Função auxiliar para montar os headers HTTP, incluindo o token de autorização
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    // Adiciona o header de autorização se o token existir, seguindo o padrão Bearer Token.
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Função auxiliar para padronizar o tratamento de respostas da API
const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    // Lança um erro com a mensagem do backend ou uma mensagem genérica.
    throw new Error(errorData.error || errorData.message || 'Ocorreu um erro na requisição.');
  }
  // Retorna a resposta JSON se houver conteúdo, caso contrário, retorna um objeto de sucesso.
  return response.status === 204 ? { success: true } : response.json();
};

export const api = {
  // --- FUNÇÕES DE NOTAS (CONTEÚDO) ---

  async getNotes() {
    const response = await fetch(`${API_BASE_URL}/contents`, {
      headers: getAuthHeaders()
    });
    return handleApiResponse(response);
  },

  async getNoteById(noteId) { // NOVA FUNÇÃO para buscar uma nota específica
    const response = await fetch(`${API_BASE_URL}/contents/${noteId}`, {
      headers: getAuthHeaders()
    });
    return handleApiResponse(response);
  },

  async createNote(noteData) { // MODIFICADO: agora espera 'tagIds' em 'noteData'
    const response = await fetch(`${API_BASE_URL}/contents`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(noteData)
    });
    return handleApiResponse(response);
  },

  async updateNote(noteId, noteData) { // NOVA FUNÇÃO para atualizar uma nota
    const response = await fetch(`${API_BASE_URL}/contents/${noteId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(noteData)
    });
    return handleApiResponse(response);
  },

  async deleteNote(noteId) {
    const response = await fetch(`${API_BASE_URL}/contents/${noteId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleApiResponse(response);
  },

  // --- FUNÇÕES DE TAGS ---

  async getTags() {
    const response = await fetch(`${API_BASE_URL}/tags`, {
      headers: getAuthHeaders()
    });
    return handleApiResponse(response);
  },

  async createTag(tagName) { // MODIFICADO: corpo espera '{ name: tagName }'
    const response = await fetch(`${API_BASE_URL}/tags`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name: tagName }) // Backend espera 'name', não 'nome'
    });
    return handleApiResponse(response);
  },

  async updateTag(tagId, tagName) { // NOVA FUNÇÃO para atualizar uma tag
    const response = await fetch(`${API_BASE_URL}/tags/${tagId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name: tagName })
    });
    return handleApiResponse(response);
  },

  async deleteTag(tagId) { // NOVA FUNÇÃO para deletar uma tag
    const response = await fetch(`${API_BASE_URL}/tags/${tagId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleApiResponse(response);
  },

  // --- FUNÇÕES DE USUÁRIO ---

  async getUserProfile() {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: getAuthHeaders()
    });
    return handleApiResponse(response);
  },

  async updateUserProfile(userId, userData) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return handleApiResponse(response);
  }
};