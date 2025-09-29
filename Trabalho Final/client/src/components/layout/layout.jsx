import React, { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, ThemeProvider, createTheme, CssBaseline, Snackbar, Alert } from '@mui/material';
import Header from '../header/header';
import Sidebar from '../sidebar/sidebar';
import Footer from '../footer/footer';
import { useAuth } from '../../contexts/auth/authProvider';
import { api } from '../../api/api';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { user, updateUser } = useAuth();

  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [notesData, tagsData] = await Promise.all([
        api.getNotes(),
        api.getTags()
      ]);
      setNotes(notesData);
      setTags(tagsData);
    } catch (error) {
      showSnackbar('Erro ao carregar dados', 'error');
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user, loadInitialData]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCreateNote = useCallback(async (noteData) => {
    try {
      const newNote = await api.createNote(noteData);
      setNotes(prevNotes => [...prevNotes, newNote]);
      showSnackbar('Nota criada com sucesso!');
      return newNote;
    } catch (error) {
      showSnackbar('Erro ao criar nota', 'error');
      throw error;
    }
  }, [showSnackbar]);

  const handleDeleteNote = useCallback(async (noteId) => {
    try {
      await api.deleteNote(noteId);
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
      showSnackbar('Nota deletada com sucesso!');
    } catch (error) {
      showSnackbar('Erro ao deletar nota', 'error');
      throw error;
    }
  }, [showSnackbar]);

  const handleCreateTag = useCallback(async (tagName) => {
    try {
      const newTag = await api.createTag(tagName);
      setTags(prevTags => [...new Set([...prevTags, newTag])]);
      return newTag;
    } catch (error) {
      showSnackbar('Erro ao criar tag', 'error');
      throw error;
    }
  }, [showSnackbar]);

  const handleUpdateUser = useCallback(async (userData) => {
    try {
      // Passa o ID do usuário autenticado para a chamada da API
      const updatedUserFromApi = await api.updateUserProfile(user.id, userData); 
      
      // ATUALIZAÇÃO PRINCIPAL:
      // Chama a função centralizada do AuthProvider para atualizar o estado e o localStorage
      updateUser(updatedUserFromApi);

      showSnackbar('Perfil atualizado com sucesso!');
      return updatedUserFromApi;
    } catch (error) {
      showSnackbar('Erro ao atualizar perfil', 'error');
      throw error;
    }
  }, [showSnackbar, user, updateUser]); // Adiciona updateUser às dependências do useCallback

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header 
          sidebarOpen={sidebarOpen} 
          toggleSidebar={toggleSidebar}
          user={user}
        />
        
        {/* Container principal que inclui Sidebar e Conteúdo */}
        <Box sx={{ display: 'flex', flex: 1 }}>
          <Sidebar 
            open={sidebarOpen} 
            onToggle={toggleSidebar}
          />
          
          {/* Container do conteúdo principal + footer */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            flexGrow: 1,
            minHeight: '100vh',
            transition: 'margin 0.3s ease',
            marginLeft: sidebarOpen ? '240px' : '0px',
            width: sidebarOpen ? 'calc(100% - 240px)' : '100%'
          }}>
            {/* Área de conteúdo principal */}
            <Box 
              component="main" 
              sx={{ 
                flexGrow: 1,
                p: 3,
                minHeight: 'calc(100vh - 120px)', // Altura total menos header e footer
              }}
            >
              <Outlet context={{
                notes,
                tags,
                loading,
                onCreateNote: handleCreateNote,
                onDeleteNote: handleDeleteNote,
                onCreateTag: handleCreateTag,
                onUpdateUser: handleUpdateUser
              }} />
            </Box>
            
            {/* Footer - agora dentro do container flexível */}
            <Footer />
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default Layout;