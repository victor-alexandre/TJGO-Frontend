import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Header from '../header/header';
import Sidebar from '../sidebar/sidebar';
import { api } from '../../api/api'; 
import { useAuth } from '../../contexts/auth/authProvider';

const Layout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);

  const fetchNotes = useCallback(async () => {
    try {
      const notesData = await api.getNotes();
      setNotes(notesData);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    }
  }, []);
  
  const fetchAllTags = useCallback(async () => {
    try {
        const tagsData = await api.getTags();
        setAllTags(tagsData);
    } catch (error) {
        console.error('Failed to fetch tags:', error);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
    fetchAllTags();
  }, [fetchNotes, fetchAllTags]);

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleTagChange = (event) => {
    const { value } = event.target;
    if (value.includes('all')) {
      setSelectedTags([]);
      return;
    }
    setSelectedTags(typeof value === 'string' ? value.split(',') : value);
  };

  const filteredNotes = notes
    .filter(note => selectedStatus === 'all' || note.status === selectedStatus)
    .filter(note => 
        selectedTags.length === 0 || 
        selectedTags.some(tagId => note.tags.some(noteTag => noteTag.id === tagId))
    )
    .filter(note => {
      const term = searchTerm.toLowerCase();
      return !term || 
             (note.titulo && note.titulo.toLowerCase().includes(term)) ||
             (note.texto && note.texto.toLowerCase().includes(term));
    });

  const handleSearch = (event) => setSearchTerm(event.target.value);
  const handleEditNote = (id) => navigate(`/notes/edit/${id}`);

  const handleDeleteNote = async (id) => {
    try {
      await api.deleteNote(id);
      fetchNotes();
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };
  
  const onUpdateUser = async (userData) => {
    try {
      const updatedUser = await api.updateUserProfile(user.id, userData);
      return updatedUser; 
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  };

  const onDeleteUser = async () => {
    try {
      await api.deleteUser(user.id);
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
    }
  };

  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [sidebarOpen, setSidebarOpen] = useState(isDesktop);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  const sidebarWidth = 240;
  const collapsedSidebarWidth = 60;

  return (
    <Box sx={{ display: 'flex' }}>
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar open={sidebarOpen} onToggle={toggleSidebar} isDesktop={isDesktop} />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          mt: '64px', 
          ml: { md: sidebarOpen ? `${sidebarWidth}px` : `${collapsedSidebarWidth}px`}, 
          transition: theme.transitions.create('margin'), 
          minHeight: 'calc(100vh - 64px)', 
          backgroundColor: 'background.default' 
        }}
      >
        <Outlet context={{
          notes: filteredNotes,
          searchTerm,
          handleSearch,
          handleEditNote,
          handleDeleteNote,
          onUpdateUser,
          onDeleteUser,
          fetchNotes,
          allTags,
          selectedStatus,
          handleStatusChange,
          selectedTags,
          handleTagChange,
        }} />
      </Box>
    </Box>
  );
};

export default Layout;