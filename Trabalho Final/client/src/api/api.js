// Simulação de chamadas API
const API_BASE_URL = process.env.REACT_APP_API_URL;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Função para obter o token do localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Headers com autenticação
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const api = {
  async getNotes() {
    await delay(500);
    // Substitua por: 
    // return fetch(`${API_BASE_URL}/notes`, { headers: getAuthHeaders() }).then(res => res.json());
    return [
      {
        id: 1,
        title: 'Primeira Nota',
        description: 'Esta é a minha primeira nota no aplicativo.',
        tags: ['importante', 'trabalho'],
        createdAt: new Date('2024-01-15').toISOString(),
        userId: 1
      },
      {
        id: 2,
        title: 'Lista de Compras',
        description: 'Leite, ovos, pão, frutas e vegetais.',
        tags: ['pessoal', 'casa'],
        createdAt: new Date('2024-01-16').toISOString(),
        userId: 1
      }
    ];
  },

  async createNote(noteData) {
    await delay(500);
    // Substitua por: 
    // return fetch(`${API_BASE_URL}/notes`, { 
    //   method: 'POST', 
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify(noteData) 
    // })
    return {
      id: Date.now(),
      ...noteData,
      userId: 1,
      createdAt: new Date().toISOString()
    };
  },

  async deleteNote(noteId) {
    await delay(500);
    // Substitua por: 
    // return fetch(`${API_BASE_URL}/notes/${noteId}`, { 
    //   method: 'DELETE',
    //   headers: getAuthHeaders()
    // })
    return { success: true, message: 'Nota deletada com sucesso' };
  },

  async getTags() {
    await delay(300);
    // Substitua por: 
    // return fetch(`${API_BASE_URL}/tags`, { headers: getAuthHeaders() }).then(res => res.json());
    return ['importante', 'trabalho', 'pessoal', 'casa', 'estudos', 'urgente'];
  },

  async createTag(tagName) {
    await delay(300);
    // Substitua por: 
    // return fetch(`${API_BASE_URL}/tags`, { 
    //   method: 'POST', 
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify({ name: tagName }) 
    // })
    return tagName;
  },

  async getUserProfile() {
    await delay(400);
    // Substitua por: 
    // return fetch(`${API_BASE_URL}/user/profile`, { headers: getAuthHeaders() }).then(res => res.json());
    const userData = localStorage.getItem('user');
    if (userData) {
      return JSON.parse(userData);
    }
    return {
      id: 1,
      name: 'Usuário Teste',
      email: 'user@example.com',
      phone: '(11) 99999-9999',
      bio: 'Desenvolvedor React',
      avatar: null
    };
  },

  async updateUserProfile(userData) {
    await delay(500);
    // Substitua por: 
    // return fetch(`${API_BASE_URL}/user/profile`, { 
    //   method: 'PUT', 
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify(userData) 
    // })

    // Atualiza no localStorage também
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    return { ...updatedUser, updatedAt: new Date().toISOString() };
  }
};