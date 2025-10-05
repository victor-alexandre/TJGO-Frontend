// client/src/pages/notes/notes.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation, useOutletContext } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup'; // Biblioteca para validação de schemas
import { useAuth } from '../../contexts/auth/authProvider';

// Importações de componentes Material-UI
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Paper,
  FormHelperText,
  CircularProgress, 
  Snackbar, 
  Alert, 
  IconButton,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog, 
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  Save as SaveIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon, 
} from '@mui/icons-material';
import { api } from '../../api/api';

// Schema de validação usando Yup para garantir a integridade dos dados do formulário
const noteValidationSchema = Yup.object({
  titulo: Yup.string()
    .required('Título é obrigatório')
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  texto: Yup.string()
    .required('Descrição é obrigatória')
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres'),
  tags: Yup.array()
    .of(Yup.number()) // Espera um array de IDs numéricos para as tags
    .min(1, 'Selecione pelo menos uma tag')
    .required('Tags são obrigatórias'), // Adicionado para garantir que o array não seja vazio
});

const Notes = () => {
  // Hooks de roteamento para navegação e acesso a parâmetros da URL
  const { id: noteId } = useParams(); // Captura o ID da nota se estiver em modo de edição
  const navigate = useNavigate(); // Função para navegação programática
  const location = useLocation(); // Objeto de localização para verificar o caminho atual
  const { fetchNotes: refreshNotesList } = useOutletContext(); // Função para atualizar a lista de notas no componente pai (Layout)

  // --- Estados Comuns ---
  // Estado para gerenciar o Snackbar (mensagens de feedback global)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // --- Estados e Lógica para a VISÃO DE LISTA ---
  const [notes, setNotes] = useState([]); // Armazena a lista de notas
  const [isLoadingList, setIsLoadingList] = useState(true); // Indica se a lista está sendo carregada
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Controla a visibilidade do diálogo de exclusão
  const [noteToDelete, setNoteToDelete] = useState(null); // Armazena a nota a ser excluída

  const { user } = useAuth();

  // `useCallback` para otimizar a função `fetchNotes`, prevenindo recriações desnecessárias
  // e garantindo uma referência estável para dependências de `useEffect`.
  const fetchNotes = useCallback(async () => {
    setIsLoadingList(true); // Ativa o indicador de carregamento
    try {
      const fetchedNotes = await api.getNotes(); // Chama a API para buscar notas
      setNotes(fetchedNotes); // Atualiza o estado com as notas recebidas
    } catch (error) {
      console.error('Erro ao buscar notas:', error);
      // Exibe uma mensagem de erro no Snackbar
      setSnackbar({ open: true, message: error.message || 'Erro ao carregar notas.', severity: 'error' });
    } finally {
      setIsLoadingList(false); // Desativa o indicador de carregamento
    }
  }, []); // Array de dependências vazio, pois a função não depende de nenhum estado/prop externo

  // Lida com o clique no botão de deletar, abrindo o diálogo de confirmação
  const handleDeleteClick = (note) => {
    setNoteToDelete(note);
    setOpenDeleteDialog(true);
  };

  // Fecha o diálogo de exclusão e limpa a nota a ser deletada
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setNoteToDelete(null);
  };

  // `useCallback` para a função de confirmação de exclusão
  const handleConfirmDelete = useCallback(async () => {
    if (noteToDelete) {
      try {
        await api.deleteNote(noteToDelete.id); // Chama a API para deletar a nota
        setSnackbar({ open: true, message: 'Nota deletada com sucesso!', severity: 'success' });
        // Pequeno atraso para o usuário ver o Snackbar antes da lista ser atualizada
        setTimeout(() => {
          fetchNotes(); // Recarrega a lista de notas após a exclusão
        }, 1000);
      } catch (error) {
        console.error('Erro ao deletar nota:', error);
        setSnackbar({ open: true, message: error.message || 'Erro ao deletar nota.', severity: 'error' });
      } finally {
        handleCloseDeleteDialog(); // Fecha o diálogo de exclusão
      }
    }
  }, [noteToDelete, fetchNotes]); // Dependências: `noteToDelete` para saber qual nota deletar e `fetchNotes` para recarregar a lista

  // --- Estados e Lógica para a VISÃO DE FORMULÁRIO ---
  const [allTags, setAllTags] = useState([]); // Armazena todas as tags disponíveis
  const [newTagName, setNewTagName] = useState(''); // Estado para o input de nova tag
  const [isSubmittingForm, setIsSubmittingForm] = useState(false); // Indica se o formulário está em processo de submissão
  const [isLoadingForm, setIsLoadingForm] = useState(true); // Indica se os dados do formulário estão sendo carregados

  // Determina o modo atual da página com base na URL
  const isEditMode = Boolean(noteId); // Verdadeiro se `noteId` estiver presente na URL
  const isCreateMode = location.pathname === '/notes/new'; // Verdadeiro se o caminho for '/notes/new'
  const isListView = location.pathname === '/'; // Verdadeiro se o caminho for a raiz, indicando a lista de notas

  // Configuração do Formik para gerenciamento de formulários e validação
  const formik = useFormik({
    initialValues: {
      titulo: '',
      texto: '',
      status: 'draft',
      tags: [],
    },
    validationSchema: noteValidationSchema,
    onSubmit: async (values) => {
      setIsSubmittingForm(true);
      try {
        const noteData = {
          user_id: user.id,
          titulo: values.titulo,
          texto: values.texto,
          status: values.status,
          tagIds: values.tags,
        };

        if (isEditMode) {
          await api.updateNote(noteId, noteData);
          setSnackbar({ open: true, message: 'Nota atualizada com sucesso!', severity: 'success' });
        } else {
          await api.createNote(noteData);
          setSnackbar({ open: true, message: 'Nota criada com sucesso!', severity: 'success' });
        }

        // CORREÇÃO: Chama a função para atualizar a lista de notas na Home
        await refreshNotesList();
        
        // Navega para a home imediatamente após a lista ser atualizada
        navigate('/');
        
      } catch (error) {
        console.error('Erro ao salvar nota:', error);
        setSnackbar({ open: true, message: error.message || 'Erro ao salvar nota.', severity: 'error' });
      } finally {
        setIsSubmittingForm(false);
      }
    }
  });

  // `useCallback` para a função de adicionar nova tag
  const handleAddNewTag = useCallback(async () => {
    if (newTagName.trim()) { // Verifica se o nome da tag não está vazio
      try {
        const createdTag = await api.createTag(newTagName.trim()); // Chama a API para criar a tag
        setAllTags((prevTags) => [...prevTags, createdTag]); // Adiciona a nova tag à lista de tags disponíveis
        
        const currentSelectedTags = formik.values.tags;
        // Adiciona a nova tag criada automaticamente às tags selecionadas, se ainda não estiver lá
        if (!currentSelectedTags.includes(createdTag.id)) {
          formik.setFieldValue('tags', [...currentSelectedTags, createdTag.id]);
        }
        setNewTagName(''); // Limpa o campo de nova tag
        setSnackbar({ open: true, message: `Tag '${createdTag.name}' criada com sucesso!`, severity: 'success' });
      } catch (error) {
        console.error('Erro ao criar nova tag:', error);
        setSnackbar({ open: true, message: error.message || 'Erro ao criar nova tag.', severity: 'error' });
      }
    }
  }, [newTagName, allTags, formik.values.tags, formik.setFieldValue]); // Dependências: `newTagName` para o valor do input, `allTags` para atualizar a lista, e `formik` para atualizar o campo `tags`

  // Permite adicionar uma nova tag pressionando 'Enter'
  const handleNewTagKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Previne a submissão do formulário
      handleAddNewTag();
    }
  };

  // Remove uma tag das tags selecionadas no formulário
  const handleRemoveSelectedTag = (tagIdToRemove) => {
    const filteredTags = formik.values.tags.filter(tagId => tagId !== tagIdToRemove);
    formik.setFieldValue('tags', filteredTags); // Atualiza o campo 'tags' do Formik
  };

  // Fecha o Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return; // Ignora cliques fora do Snackbar
    setSnackbar({ ...snackbar, open: false });
  };

  // --- useEffects para carregar dados com base na visão ---

  // `useEffect` para carregar a lista de notas quando a visão for de lista
  useEffect(() => {
    if (isListView) {
      fetchNotes();
    }
  }, [isListView, fetchNotes]); // Dependências: `isListView` para ativar/desativar, `fetchNotes` para chamar a função de busca

  // `useEffect` para carregar dados do formulário (tags e dados da nota em edição)
  useEffect(() => {
    if (isCreateMode || isEditMode) {
      const fetchDataForForm = async () => {
        setIsLoadingForm(true); // Ativa o indicador de carregamento do formulário
        try {
          const tagsResponse = await api.getTags(); // Busca todas as tags disponíveis
          setAllTags(tagsResponse);

          if (isEditMode) {
            const noteResponse = await api.getNoteById(noteId); // Busca a nota pelo ID para edição
            // Preenche o formulário com os dados da nota existente
            formik.setValues({
              titulo: noteResponse.titulo,
              texto: noteResponse.texto,
              status: noteResponse.status,
              tags: noteResponse.tags.map(tag => tag.id), // Mapeia para IDs das tags
            });
          } else {
            formik.resetForm(); // Limpa o formulário para uma nova criação
          }
        } catch (error) {
          console.error('Erro ao carregar dados para o formulário:', error);
          setSnackbar({ open: true, message: error.message || 'Erro ao carregar dados para o formulário.', severity: 'error' });
        } finally {
          setIsLoadingForm(false); // Desativa o indicador de carregamento
        }
      };
      fetchDataForForm();
    }
  }, [isCreateMode, isEditMode, noteId, formik.resetForm, formik.setValues]); // Dependências: modos de página, `noteId` para edição, e funções do Formik para resetar/setar valores

  // --- Renderização Condicional ---
  // Renderiza a interface apropriada com base no modo da página (lista, criação ou edição).
  let content;

  if (isListView) {
    if (isLoadingList) {
      // Exibe um indicador de progresso enquanto a lista está sendo carregada
      content = (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      );
    } else {
      // Renderiza a lista de notas
      content = (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              Minhas Notas
            </Typography>
          </Box>

          {notes.length === 0 ? (
            // Mensagem exibida se não houver notas
            <Typography variant="h6" color="textSecondary" sx={{ mt: 5, textAlign: 'center' }}>
              Nenhuma nota encontrada. Crie sua primeira nota através do menu lateral!
            </Typography>
          ) : (
            // Grid para exibir as notas em formato de cartão
            <Grid container spacing={3}>
              {notes.map((note) => (
                <Grid item xs={12} sm={6} md={4} key={note.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="div" gutterBottom>
                        {note.titulo}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {/* Exibe uma prévia do texto, truncando se for muito longo */}
                        {note.texto.substring(0, 150)}{note.texto.length > 150 ? '...' : ''}
                      </Typography>
                      <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {/* Renderiza as tags associadas à nota */}
                        {note.tags && note.tags.map((tag) => (
                          <Chip key={tag.id} label={tag.name} size="small" color="primary" variant="outlined" />
                        ))}
                      </Box>
                      <Chip label={note.status} size="small" sx={{ mt: 1 }} />
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                      {/* Botões de ação para editar e deletar */}
                      <IconButton size="small" onClick={() => navigate(`/notes/${note.id}/edit`)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDeleteClick(note)}>
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Diálogo de Confirmação de Exclusão */}
          <Dialog
            open={openDeleteDialog}
            onClose={handleCloseDeleteDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Confirmar Exclusão"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
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
    }
  } else if (isCreateMode || isEditMode) {
    if (isLoadingForm) {
      // Exibe um indicador de progresso enquanto os dados do formulário estão sendo carregados
      content = (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      );
    } else {
      // Renderiza o formulário de criação/edição de notas
      content = (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton onClick={() => navigate('/')} sx={{ mr: 1}}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" gutterBottom>
              {isEditMode ? 'Editar Nota' : 'Nova Nota'}
            </Typography>
          </Box>
          
          <Paper sx={{ p: 3 }}>
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Campo Título */}
              <TextField
                label="Título da Nota"
                name="titulo"
                variant="outlined"
                fullWidth
                value={formik.values.titulo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} // Aciona a validação ao sair do campo
                error={formik.touched.titulo && Boolean(formik.errors.titulo)} // Exibe erro se o campo foi tocado e há erro
                helperText={formik.touched.titulo && formik.errors.titulo} // Mensagem de erro
                disabled={isSubmittingForm}
              />
              
              {/* Campo Descrição */}
              <TextField
                label="Descrição"
                name="texto"
                variant="outlined"
                fullWidth
                multiline
                rows={6}
                value={formik.values.texto}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.texto && Boolean(formik.errors.texto)}
                helperText={formik.touched.texto && formik.errors.texto}
                disabled={isSubmittingForm}
              />

              {/* Campo Status */}
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  input={<OutlinedInput label="Status" />}
                  disabled={isSubmittingForm}
                >
                  <MenuItem value="Pendente">Pendente</MenuItem>
                  <MenuItem value="Em Andamento">Em Andamento</MenuItem>
                  <MenuItem value="Concluido">Concluido</MenuItem>
                </Select>
              </FormControl>
              
              {/* Campo Tags */}
              <FormControl 
                fullWidth 
                error={formik.touched.tags && Boolean(formik.errors.tags)} // Erro para o FormControl se as tags não forem válidas
              >
                <InputLabel id="tags-label">Tags</InputLabel>
                <Select
                  labelId="tags-label"
                  name="tags"
                  multiple // Permite seleção múltipla
                  value={formik.values.tags}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  input={<OutlinedInput label="Tags" />}
                  renderValue={(selectedTagIds) => (
                    // Renderiza as tags selecionadas como Chips
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selectedTagIds.map((tagId) => {
                        const tag = allTags.find(t => t.id === tagId);
                        return tag ? <Chip key={tagId} label={tag.name} size="small" /> : null;
                      })}
                    </Box>
                  )}
                  disabled={isSubmittingForm}
                >
                  {/* Mapeia todas as tags disponíveis para MenuItem */}
                  {allTags.map((tag) => (
                    <MenuItem key={tag.id} value={tag.id}>
                      {tag.name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.tags && formik.errors.tags && (
                  <FormHelperText error>{formik.errors.tags}</FormHelperText> // Mensagem de erro para as tags
                )}
              </FormControl>
              
              {/* Adicionar Nova Tag */}
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  label="Nova Tag"
                  variant="outlined"
                  size="small"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyPress={handleNewTagKeyPress} // Captura 'Enter' para adicionar tag
                  disabled={isSubmittingForm}
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddNewTag}
                  disabled={!newTagName.trim() || isSubmittingForm} // Desabilita se o campo estiver vazio ou o formulário estiver submetendo
                  variant="outlined"
                  type="button" // Importante para não submeter o formulário principal
                >
                  Adicionar
                </Button>
              </Box>
              
              {/* Tags Selecionadas (exibidas como Chips com opção de remover) */}
              {formik.values.tags.length > 0 && (
                <Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Tags selecionadas:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {formik.values.tags.map(tagId => {
                      const tag = allTags.find(t => t.id === tagId);
                      return tag ? (
                        <Chip
                          key={tag.id}
                          label={tag.name}
                          onDelete={() => handleRemoveSelectedTag(tag.id)} // Permite remover a tag selecionada
                          disabled={isSubmittingForm}
                        />
                      ) : null;
                    })}
                  </Box>
                </Box>
              )}
              
              {/* Botões de Ação do Formulário */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => formik.resetForm()} // Reseta o formulário para os valores iniciais
                  disabled={isSubmittingForm || !formik.dirty} // Desabilita se submetendo ou se o formulário não foi alterado
                >
                  Limpar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={isSubmittingForm || !formik.isValid} // Desabilita se submetendo ou se o formulário não é válido
                >
                  {isSubmittingForm ? 'Salvando...' : (isEditMode ? 'Salvar Alterações' : 'Criar Nota')}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      );
    }
  }

  // O componente `Snackbar` é renderizado uma única vez no nível mais alto do componente `Notes`.
  // Isso garante que ele esteja sempre presente na DOM e possa ser acionado de qualquer parte
  // da lógica do componente, independentemente da renderização condicional do `content`.
  return (
    <>
      {content} {/* Renderiza o conteúdo específico da visão (lista ou formulário) */}
      <Snackbar
        open={snackbar.open} // Controla a visibilidade do Snackbar
        autoHideDuration={4000} // Duração em milissegundos antes de fechar automaticamente
        onClose={handleCloseSnackbar} // Função para fechar o Snackbar manualmente ou por autoHide
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} // Posição do Snackbar
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Notes;