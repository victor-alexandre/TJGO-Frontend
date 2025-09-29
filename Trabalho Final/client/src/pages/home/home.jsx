import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Fab,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Tag as TagIcon,
} from '@mui/icons-material';

const Home = () => {
  const { notes, tags, onDeleteNote } = useOutletContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Filtrar notas
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          note.description.toLowerCase().includes(searchTerm.toLowerCase());
    // CORREÇÃO: Acessar a propriedade 'nome' de cada objeto tag para a busca
    const matchesTag = selectedTag ? note.tags.some(tag => tag.nome === selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const handleDeleteClick = (note) => {
    setNoteToDelete(note);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (noteToDelete) {
      await onDeleteNote(noteToDelete.id);
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setNoteToDelete(null);
  };

  const handleCreateNewNote = () => {
    navigate('/notes');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNotePreview = (description) => {
    return description.length > 150 
      ? `${description.substring(0, 150)}...` 
      : description;
  };

  return (
    <Box sx={{ position: 'relative', minHeight: 'calc(100vh - 200px)' }}>
      {/* Cabeçalho e Estatísticas */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Minhas Notas
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {filteredNotes.length} de {notes.length} notas
            {selectedTag && ` • Filtrado por: ${selectedTag}`}
          </Typography>
        </Box>
      </Box>
      
      {/* Filtros e Busca */}
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Buscar notas..."
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        
        {/* Tags Filtro */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>
            Filtrar por tag:
          </Typography>
          <Chip
            label="Todas"
            variant={selectedTag === '' ? 'filled' : 'outlined'}
            onClick={() => setSelectedTag('')}
            color="primary"
            size="small"
          />
          {/* CORREÇÃO: Acessar 'tag.id' para a key e 'tag.nome' para o label */}
          {tags.map(tag => (
            <Chip
              key={tag.id}
              label={tag.name}
              variant={selectedTag === tag.name ? 'filled' : 'outlined'}
              onClick={() => setSelectedTag(tag.name)}
              color="primary"
              size="small"
              icon={<TagIcon />}
            />
          ))}
        </Box>
      </Box>

      {/* Lista de Notas */}
      {filteredNotes.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          backgroundColor: 'background.default',
          borderRadius: 2
        }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {notes.length === 0 ? 'Nenhuma nota encontrada' : 'Nenhuma nota corresponde aos filtros'}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            {notes.length === 0 
              ? 'Comece criando sua primeira nota!' 
              : 'Tente alterar os termos de busca ou remover os filtros de tag'
            }
          </Typography>
          {notes.length === 0 && (
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleCreateNewNote}
            >
              Criar Primeira Nota
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredNotes.map((note) => (
            <Grid item xs={12} sm={6} md={4} key={note.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom noWrap>
                    {note.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="textSecondary" 
                    sx={{ 
                      mb: 2,
                      minHeight: '60px',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {getNotePreview(note.description)}
                  </Typography>
                  
                  {/* Tags */}
                  <Box sx={{ mb: 2 }}>
                    {/* CORREÇÃO: Acessar 'tag.id' para a key e 'tag.name' para o label */}
                    {note.tags.map(tag => (
                      <Chip
                        key={tag.id}
                        label={tag.name}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          mr: 0.5, 
                          mb: 0.5,
                          fontSize: '0.7rem'
                        }}
                        onClick={() => setSelectedTag(tag.name)}
                      />
                    ))}
                  </Box>
                  
                  {/* Data de Criação */}
                  <Typography variant="caption" color="textSecondary">
                    Criada em: {formatDate(note.createdAt)}
                  </Typography>
                </CardContent>
                
                {/* Ações */}
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Box>
                    <Tooltip title="Editar nota">
                      <IconButton size="small" color="primary">
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir nota">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteClick(note)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  <Button 
                    size="small" 
                    color="primary"
                    onClick={() => {
                      // Aqui você pode implementar a visualização completa da nota
                      console.log('Visualizar nota:', note.id);
                    }}
                  >
                    Ver Mais
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* FAB - Floating Action Button */}
      <Tooltip title="Criar nova nota">
        <Fab 
          color="primary" 
          aria-label="add"
          onClick={handleCreateNewNote}
          size="medium"
          sx={{
            position: 'fixed',
            bottom: theme.spacing(3),
            right: theme.spacing(3),
            zIndex: (theme) => theme.zIndex.speedDial,
            '&:hover': {
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir a nota "{noteToDelete?.title}"?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancelar</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;