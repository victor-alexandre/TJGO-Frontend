import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  Paper,
  InputBase,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

const getStatusChipColor = (status) => {
  if (status === 'published' || status === 'Concluido') return 'success';
  if (status === 'archived' || status === 'Em Andamento') return 'warning';
  return undefined; 
};

const Home = () => {
  const {
    notes,
    searchTerm,
    handleSearch,
    handleEditNote,
    handleDeleteNote,
    allTags,
    selectedStatus,
    handleStatusChange,
    selectedTags,
    handleTagChange,
  } = useOutletContext();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const handleClickDelete = (note) => {
    setNoteToDelete(note);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setNoteToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (noteToDelete) {
      handleDeleteNote(noteToDelete.id);
    }
    handleCloseDeleteDialog();
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Minhas Notas
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={selectedStatus}
                label="Status"
                onChange={handleStatusChange}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="draft">Rascunho</MenuItem>
                <MenuItem value="published">Publicado</MenuItem>
                <MenuItem value="archived">Arquivado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Tags</InputLabel>
              <Select
                multiple
                value={selectedTags}
                onChange={handleTagChange}
                input={<OutlinedInput label="Tags" />}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return <em>Todas</em>;
                  }
                  return (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((tagId) => {
                        const tag = allTags.find(t => t.id === tagId);
                        return <Chip key={tagId} label={tag ? tag.name : ''} size="small" />;
                      })}
                    </Box>
                  );
                }}
              >
                <MenuItem value="all">
                  <em>Todas</em>
                </MenuItem>
                {allTags && allTags.map((tag) => (
                  <MenuItem key={tag.id} value={tag.id}>
                    {tag.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Paper component="form" onSubmit={(e) => e.preventDefault()} sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', mb: 3 }}>
        <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Buscar por título ou texto..." value={searchTerm} onChange={handleSearch} />
        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search"><SearchIcon /></IconButton>
      </Paper>

      <Grid container spacing={3}>
        {notes && notes.length > 0 ? (
          notes.map((note) => (
            <Grid item key={note.id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }}}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="div" gutterBottom>{note.titulo}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, wordBreak: 'break-word' }}>{note.texto}</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Chip
                      label={note.status}
                      color={getStatusChipColor(note.status)}
                      size="small"
                    />
                    {note.tags && note.tags.map((tag) => (
                      <Chip key={tag.id} label={tag.name} size="small" variant="outlined" />
                    ))}
                  </Box>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <IconButton size="small" color="primary" onClick={() => handleEditNote(note.id)}><EditIcon /></IconButton>
                  <IconButton size="small" color="error" onClick={() => handleClickDelete(note)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography sx={{ mt: 3, textAlign: 'center' }}>Nenhuma nota encontrada com os filtros selecionados.</Typography>
          </Grid>
        )}
      </Grid>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">{"Confirmar Exclusão"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Tem certeza que deseja excluir a nota "{noteToDelete?.titulo}"? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} autoFocus color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;