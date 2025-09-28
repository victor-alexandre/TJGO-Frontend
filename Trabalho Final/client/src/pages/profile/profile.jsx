import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../contexts/auth/authProvider';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Avatar,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';

// Schema de validação do perfil
const profileValidationSchema = Yup.object({
  name: Yup.string()
    .required('Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres'),
  email: Yup.string()
    .required('Email é obrigatório')
    .email('Email deve ser válido'),
  phone: Yup.string()
    .matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone deve estar no formato (11) 99999-9999')
    .nullable(),
  bio: Yup.string()
    .max(500, 'Bio deve ter no máximo 500 caracteres')
    .nullable()
});

const Profile = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { onUpdateUser } = useOutletContext();
  const { user } = useAuth();

  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || ''
    },
    validationSchema: profileValidationSchema,
    enableReinitialize: true, // Permite reinicializar quando user mudar
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await onUpdateUser(values);
      } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const handlePhoneChange = (event) => {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      if (value.length === 0) {
        formik.setFieldValue('phone', '');
      } else if (value.length <= 2) {
        formik.setFieldValue('phone', `(${value}`);
      } else if (value.length <= 6) {
        formik.setFieldValue('phone', `(${value.slice(0,2)}) ${value.slice(2)}`);
      } else if (value.length <= 10) {
        formik.setFieldValue('phone', `(${value.slice(0,2)}) ${value.slice(2,6)}-${value.slice(6)}`);
      } else {
        formik.setFieldValue('phone', `(${value.slice(0,2)}) ${value.slice(2,7)}-${value.slice(7,11)}`);
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Meu Perfil
      </Typography>
      
      <Paper sx={{ p: 4 }}>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={4}>
            {/* Coluna da Foto */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: 'primary.main',
                    fontSize: '2rem'
                  }}
                  src={user?.avatar}
                >
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </Avatar>
                
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="avatar-upload"
                  type="file"
                />
                <label htmlFor="avatar-upload">
                  <IconButton 
                    color="primary" 
                    component="span"
                    disabled={isSubmitting}
                  >
                    <PhotoCameraIcon />
                  </IconButton>
                </label>
                
                <Typography variant="body2" color="textSecondary" align="center">
                  Clique na câmera para alterar a foto
                </Typography>
              </Box>
            </Grid>
            
            {/* Coluna dos Dados */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                {/* Nome */}
                <Grid item xs={12}>
                  <TextField
                    label="Nome Completo"
                    name="name"
                    variant="outlined"
                    fullWidth
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    disabled={isSubmitting}
                  />
                </Grid>
                
                {/* Email */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    disabled={isSubmitting}
                  />
                </Grid>
                
                {/* Telefone */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Telefone"
                    name="phone"
                    variant="outlined"
                    fullWidth
                    value={formik.values.phone}
                    onChange={handlePhoneChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                    disabled={isSubmitting}
                    placeholder="(11) 99999-9999"
                  />
                </Grid>
                
                {/* Bio */}
                <Grid item xs={12}>
                  <TextField
                    label="Bio"
                    name="bio"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={formik.values.bio}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.bio && Boolean(formik.errors.bio)}
                    helperText={
                      formik.touched.bio && formik.errors.bio 
                        ? formik.errors.bio 
                        : `${formik.values.bio.length}/500 caracteres`
                    }
                    disabled={isSubmitting}
                    placeholder="Conte um pouco sobre você..."
                  />
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 3 }} />
              
              {/* Botões de Ação */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => formik.resetForm()}
                  disabled={isSubmitting || !formik.dirty}
                >
                  Descartar Alterações
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={isSubmitting || !formik.isValid || !formik.dirty}
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      {/* Seção de Informações da Conta */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Informações da Conta
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="textSecondary">
              ID do Usuário:
            </Typography>
            <Typography variant="body1">
              {user?.id || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="textSecondary">
            Última atualização:
            </Typography>
            <Typography variant="body1">
              {user?.updatedAt 
                ? new Date(user.updatedAt).toLocaleDateString('pt-BR')
                : 'Nunca'
              }
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Profile;