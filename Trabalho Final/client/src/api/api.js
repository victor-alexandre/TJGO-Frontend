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
    ...(token && { 'Authorization': `Bearer ${token}` }) // Adiciona o header de autorização se o token existir
  };
};

export const api = {
  // --- FUNÇÕES DE NOTAS (CONTEÚDO) ---

  async getNotes() {
    const response = await fetch(`${API_BASE_URL}/contents`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erro ao buscar as notas.');
    return response.json();
  },

  async createNote(noteData) {
    const response = await fetch(`${API_BASE_URL}/contents`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(noteData)
    });
    if (!response.ok) throw new Error('Erro ao criar a nota.');
    return response.json();
  },

  async deleteNote(noteId) {
    const response = await fetch(`${API_BASE_URL}/contents/${noteId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erro ao deletar a nota.');
    // DELETE geralmente não retorna corpo, então não precisamos de .json()
    return { success: true };
  },

  // --- FUNÇÕES DE TAGS ---

  async getTags() {
    const response = await fetch(`${API_BASE_URL}/tags`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erro ao buscar as tags.');
    return response.json();
  },

  async createTag(tagName) {
    const response = await fetch(`${API_BASE_URL}/tags`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ nome: tagName })
    });
    if (!response.ok) throw new Error('Erro ao criar a tag.');
    return response.json();
  },

  // --- FUNÇÕES DE USUÁRIO ---

  async getUserProfile() {
    // Esta rota precisa ser protegida e retornar o usuário logado
    // Vamos assumir uma rota /api/users/profile no backend
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erro ao buscar o perfil do usuário.');
    return response.json();
  },

  async updateUserProfile(userId, userData) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error('Erro ao atualizar o perfil.');
    return response.json();
  }
};