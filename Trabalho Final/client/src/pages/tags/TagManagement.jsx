// client/src/pages/tags/TagManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { api } from '../../api/api'; // Importa a API

const TagManagement = () => {
  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState(null); // Tag sendo editada
  const [editedTagName, setEditedTagName] = useState(''); // Novo nome da tag em edição
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);

  const fetchTags = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedTags = await api.getTags();
      setTags(fetchedTags);
    } catch (error) {
      console.error('Erro ao buscar tags:', error);
      setSnackbar({ open: true, message: error.message || 'Erro ao carregar tags.', severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      setSnackbar({ open: true, message: 'O nome da tag não pode ser vazio.', severity: 'warning' });
      return;
    }
    setIsSubmitting(true);
    try {
      const createdTag = await api.createTag(newTagName.trim());
      setTags((prevTags) => [...prevTags, createdTag]);
      setNewTagName('');
      setSnackbar({ open: true, message: `Tag '${createdTag.name}' criada com sucesso!`, severity: 'success' });
    } catch (error) {
      console.error('Erro ao criar tag:', error);
      setSnackbar({ open: true, message: error.message || 'Erro ao criar tag.', severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (tag) => {
    setEditingTag(tag);
    setEditedTagName(tag.name);
  };

  const handleUpdateTag = async () => {
    if (!editedTagName.trim()) {
      setSnackbar({ open: true, message: 'O nome da tag não pode ser vazio.', severity: 'warning' });
      return;
    }
    if (editingTag && editedTagName.trim() !== editingTag.name) {
      setIsSubmitting(true);
      try {
        const updatedTag = await api.updateTag(editingTag.id, editedTagName.trim());
        setTags((prevTags) =>
          prevTags.map((tag) => (tag.id === updatedTag.id ? updatedTag : tag))
        );
        setEditingTag(null);
        setEditedTagName('');
        setSnackbar({ open: true, message: `Tag '${updatedTag.name}' atualizada com sucesso!`, severity: 'success' });
      } catch (error) {
        console.error('Erro ao atualizar tag:', error);
        setSnackbar({ open: true, message: error.message || 'Erro ao atualizar tag.', severity: 'error' });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setEditingTag(null); // Se o nome não mudou, apenas sai do modo de edição
    }
  };

  const handleDeleteClick = (tag) => {
    setTagToDelete(tag);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setTagToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (tagToDelete) {
      setIsSubmitting(true);
      try {
        await api.deleteTag(tagToDelete.id);
        setTags((prevTags) => prevTags.filter((tag) => tag.id !== tagToDelete.id));
        setSnackbar({ open: true, message: `Tag '${tagToDelete.name}' deletada com sucesso!`, severity: 'success' });
      } catch (error) {
        console.error('Erro ao deletar tag:', error);
        setSnackbar({ open: true, message: error.message || 'Erro ao deletar tag.', severity: 'error' });
      } finally {
        setIsSubmitting(false);
        handleCloseDeleteDialog();
      }
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gerenciar Tags
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Criar Nova Tag
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Nome da Nova Tag"
            variant="outlined"
            fullWidth
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            disabled={isSubmitting}
            onKeyPress={(e) => { if (e.key === 'Enter') handleCreateTag(); }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateTag}
            disabled={!newTagName.trim() || isSubmitting}
          >
            Criar
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Tags Existentes
        </Typography>
        {tags.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            Nenhuma tag cadastrada.
          </Typography>
        ) : (
          <List>
            {tags.map((tag) => (
              <ListItem key={tag.id} divider>
                {editingTag && editingTag.id === tag.id ? (
                  <TextField
                    value={editedTagName}
                    onChange={(e) => setEditedTagName(e.target.value)}
                    onBlur={handleUpdateTag} // Salva ao perder o foco
                    onKeyPress={(e) => { if (e.key === 'Enter') handleUpdateTag(); }}
                    fullWidth
                    variant="outlined"
                    size="small"
                    autoFocus
                  />
                ) : (
                  <ListItemText primary={tag.name} />
                )}
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(tag)} disabled={isSubmitting}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" color="error" onClick={() => handleDeleteClick(tag)} disabled={isSubmitting}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">{"Confirmar Exclusão"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Tem certeza que deseja excluir a tag "{tagToDelete?.name}"? Esta ação não pode ser desfeita.
            A exclusão de uma tag pode afetar notas que a utilizam.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} autoFocus color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TagManagement;