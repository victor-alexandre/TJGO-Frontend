import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
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
} from '@mui/material';
import {
  Save as SaveIcon,
  Add as AddIcon,
} from '@mui/icons-material';

// Schema de validação
const noteValidationSchema = Yup.object({
  title: Yup.string()
    .required('Título é obrigatório')
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  description: Yup.string()
    .required('Descrição é obrigatória')
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres'),
  tags: Yup.array()
    .of(Yup.string())
    .min(1, 'Selecione pelo menos uma tag')
});

const Notes = () => {
  const { onCreateNote, tags, onCreateTag } = useOutletContext();
  const navigate = useNavigate();
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      tags: []
    },
    validationSchema: noteValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      try {
        await onCreateNote(values);
        resetForm();
        setNewTag('');
        navigate('/'); // Redireciona para Home após criar nota
      } catch (error) {
        console.error('Erro ao criar nota:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const handleAddNewTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onCreateTag(newTag.trim());
      // Adiciona a nova tag ao formik
      const currentTags = formik.values.tags;
      if (!currentTags.includes(newTag.trim())) {
        formik.setFieldValue('tags', [...currentTags, newTag.trim()]);
      }
      setNewTag('');
    }
  };

  const handleNewTagKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddNewTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const filteredTags = formik.values.tags.filter(tag => tag !== tagToRemove);
    formik.setFieldValue('tags', filteredTags);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Nova Nota
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Campo Título */}
          <TextField
            label="Título da Nota"
            name="title"
            variant="outlined"
            fullWidth
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            disabled={isSubmitting}
          />
          
          {/* Campo Descrição */}
          <TextField
            label="Descrição"
            name="description"
            variant="outlined"
            fullWidth
            multiline
            rows={6}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
            disabled={isSubmitting}
          />
          
          {/* Campo Tags */}
          <FormControl 
            fullWidth 
            error={formik.touched.tags && Boolean(formik.errors.tags)}
          >
            <InputLabel id="tags-label">Tags</InputLabel>
            <Select
              labelId="tags-label"
              name="tags"
              multiple
              value={formik.values.tags}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              input={<OutlinedInput label="Tags" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
              disabled={isSubmitting}
            >
              {tags.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.tags && formik.errors.tags && (
              <FormHelperText error>{formik.errors.tags}</FormHelperText>
            )}
          </FormControl>
          
          {/* Adicionar Nova Tag */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              label="Nova Tag"
              variant="outlined"
              size="small"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleNewTagKeyPress}
              disabled={isSubmitting}
              sx={{ flexGrow: 1 }}
            />
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddNewTag}
              disabled={!newTag.trim() || isSubmitting}
              variant="outlined"
              type="button"
            >
              Adicionar
            </Button>
          </Box>
          
          {/* Tags Selecionadas */}
          {formik.values.tags.length > 0 && (
            <Box>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Tags selecionadas:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {formik.values.tags.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    disabled={isSubmitting}
                  />
                ))}
              </Box>
            </Box>
          )}
          
          {/* Botões de Ação */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => formik.resetForm()}
              disabled={isSubmitting || !formik.dirty}
            >
              Limpar
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={isSubmitting || !formik.isValid}
              loading={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Nota'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Notes;