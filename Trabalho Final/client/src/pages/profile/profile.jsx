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
  Alert,
  Collapse,
} from '@mui/material';
import {
  Save as SaveIcon,
  PhotoCamera as PhotoCameraIcon,
  Lock as LockIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { profileValidationSchema } from '../../utils/validation';


const Profile = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  const [alert, setAlert] = React.useState({ open: false, message: '', severity: 'success' });
  const { onUpdateUser } = useOutletContext();
  const { user } = useAuth();

  const profileFormik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema: profileValidationSchema,
    enableReinitialize: true, 
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        // Prepara os dados para envio
        const updateData = {
          name: values.name,
          email: values.email
        };

        // Se o usuário está tentando alterar a senha, inclui os campos de senha
        if (isChangingPassword && values.currentPassword && values.newPassword) {
          updateData.currentPassword = values.currentPassword;
          updateData.newPassword = values.newPassword;
        }

        await onUpdateUser(updateData);
        
        showAlert('Perfil atualizado com sucesso!', 'success');
        
        // Reseta os campos de senha após sucesso
        if (isChangingPassword) {
          profileFormik.setFieldValue('currentPassword', '');
          profileFormik.setFieldValue('newPassword', '');
          profileFormik.setFieldValue('confirmPassword', '');
          setIsChangingPassword(false);
        }
      } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        showAlert('Erro ao atualizar perfil. Tente novamente.', 'error');
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const handleCancelPasswordChange = () => {
    profileFormik.setFieldValue('currentPassword', '');
    profileFormik.setFieldValue('newPassword', '');
    profileFormik.setFieldValue('confirmPassword', '');
    setIsChangingPassword(false);
  };

  const handleTogglePasswordChange = () => {
    if (isChangingPassword) {
      handleCancelPasswordChange();
    } else {
      setIsChangingPassword(true);
    }
  };

  // Verifica se o formulário está válido considerando a senha
  const isFormValid = () => {
    if (!profileFormik.isValid) return false;
    
    if (isChangingPassword) {
      try {
        passwordValidationSchema.validateSync(profileFormik.values);
        return true;
      } catch {
        return false;
      }
    }
    
    return true;
  };

  // Verifica se há alterações no formulário
  const hasChanges = () => {
    const baseChanges = profileFormik.dirty;
    
    if (isChangingPassword) {
      return baseChanges || 
             profileFormik.values.currentPassword || 
             profileFormik.values.newPassword || 
             profileFormik.values.confirmPassword;
    }
    
    return baseChanges;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Meu Perfil
      </Typography>

      {/* Alert de feedback */}
      <Collapse in={alert.open}>
        <Alert
          severity={alert.severity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleCloseAlert}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {alert.message}
        </Alert>
      </Collapse>
      
      <Paper sx={{ p: 4 }}>
        <Box component="form" onSubmit={profileFormik.handleSubmit}>
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
                    value={profileFormik.values.name}
                    onChange={profileFormik.handleChange}
                    onBlur={profileFormik.handleBlur}
                    error={profileFormik.touched.name && Boolean(profileFormik.errors.name)}
                    helperText={profileFormik.touched.name && profileFormik.errors.name}
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
                    value={profileFormik.values.email}
                    onChange={profileFormik.handleChange}
                    onBlur={profileFormik.handleBlur}
                    error={profileFormik.touched.email && Boolean(profileFormik.errors.email)}
                    helperText={profileFormik.touched.email && profileFormik.errors.email}
                    disabled={isSubmitting}
                  />
                </Grid>

                {/* Botão para alterar senha */}
                <Grid item xs={12} sm={6}>
                  <Button
                    variant={isChangingPassword ? "outlined" : "text"}
                    startIcon={<LockIcon />}
                    onClick={handleTogglePasswordChange}
                    disabled={isSubmitting}
                    fullWidth
                    sx={{ height: '56px' }}
                  >
                    {isChangingPassword ? 'Cancelar Alteração de Senha' : 'Alterar Senha'}
                  </Button>
                </Grid>

                {/* Campos de senha (condicionais) */}
                {isChangingPassword && (
                  <>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Senha Atual"
                        name="currentPassword"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={profileFormik.values.currentPassword}
                        onChange={profileFormik.handleChange}
                        onBlur={profileFormik.handleBlur}
                        error={profileFormik.touched.currentPassword && Boolean(profileFormik.errors.currentPassword)}
                        helperText={profileFormik.touched.currentPassword && profileFormik.errors.currentPassword}
                        disabled={isSubmitting}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Nova Senha"
                        name="newPassword"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={profileFormik.values.newPassword}
                        onChange={profileFormik.handleChange}
                        onBlur={profileFormik.handleBlur}
                        error={profileFormik.touched.newPassword && Boolean(profileFormik.errors.newPassword)}
                        helperText={profileFormik.touched.newPassword && profileFormik.errors.newPassword}
                        disabled={isSubmitting}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Confirmar Nova Senha"
                        name="confirmPassword"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={profileFormik.values.confirmPassword}
                        onChange={profileFormik.handleChange}
                        onBlur={profileFormik.handleBlur}
                        error={profileFormik.touched.confirmPassword && Boolean(profileFormik.errors.confirmPassword)}
                        helperText={profileFormik.touched.confirmPassword && profileFormik.errors.confirmPassword}
                        disabled={isSubmitting}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
              
              <Divider sx={{ my: 3 }} />
              
              {/* Botões de Ação */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => {
                    profileFormik.resetForm();
                    setIsChangingPassword(false);
                  }}
                  disabled={isSubmitting || !hasChanges()}
                >
                  Descartar Alterações
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={isSubmitting || !isFormValid() || !hasChanges()}
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