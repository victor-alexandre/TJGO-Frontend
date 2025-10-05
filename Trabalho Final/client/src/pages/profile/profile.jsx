import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth/authProvider';
import { useFormik } from 'formik';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Divider,
  Alert,
  Collapse,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  Save as SaveIcon,
  Lock as LockIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { profileValidationSchema } from '../../utils/validation';

const Profile = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  const [alert, setAlert] = React.useState({ open: false, message: '', severity: 'success' });
  const { onUpdateUser, onDeleteUser } = useOutletContext();
  const { user, updateUser } = useAuth(); 
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

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
        const updateData = {
          name: values.name,
          email: values.email
        };

        // Se o usuário está tentando alterar a senha, inclui os campos de senha
        if (isChangingPassword && values.currentPassword && values.newPassword) {
          updateData.currentPassword = values.currentPassword;
          updateData.newPassword = values.newPassword;
        }
        // --- CORREÇÃO AQUI (Parte 2) ---
        // 1. Chamamos a função e guardamos o retorno (os dados atualizados)
        const updatedUserResponse = await onUpdateUser(updateData);
        
        // 2. Usamos a função do AuthProvider para atualizar o estado global e o localStorage
        updateUser(updatedUserResponse);
        
        showAlert('Perfil atualizado com sucesso!', 'success');
        
        if (isChangingPassword) {
          profileFormik.setFieldValue('currentPassword', '');
          profileFormik.setFieldValue('newPassword', '');
          profileFormik.setFieldValue('confirmPassword', '');
          setIsChangingPassword(false);
        }
      } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        showAlert(error.response?.data?.message || 'Erro ao atualizar perfil. Tente novamente.', 'error');
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

  // O `isChangingPassword` agora serve apenas para controlar a VISIBILIDADE dos campos.
  const handleTogglePasswordChange = () => {
    if (isChangingPassword) {
      profileFormik.setFieldValue('currentPassword', '');
      profileFormik.setFieldValue('newPassword', '');
      profileFormik.setFieldValue('confirmPassword', '');
      profileFormik.setErrors({
        ...profileFormik.errors,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
    setIsChangingPassword(!isChangingPassword);
  };

  const hasChanges = () => {
    return profileFormik.dirty;
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = () => {
    onDeleteUser(); // Chama a função de exclusão do layout
    handleCloseDeleteDialog();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/')} sx={{ mr: 1}}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" gutterBottom>
          Meu Perfil
        </Typography>
      </Box>

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
            {/* Coluna dos Dados */}
            <Grid item xs={12}>
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
                    variant={isChangingPassword ? "contained" : "contained"}
                    startIcon={<LockIcon />}
                    onClick={handleTogglePasswordChange}
                    disabled={isSubmitting}
                    fullWidth
                    sx={{ height: '56px' }}
                    color={isChangingPassword ? "error" : "primary"}
                  >
                    {isChangingPassword ? 'Cancelar Alteração' : 'Alterar Senha'}
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
                  disabled={isSubmitting || !profileFormik.isValid || !hasChanges()}
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      {/* Seção de Informações da Conta */}
      <Paper 
        sx={{ 
          p: 3, 
          mt: 3, 
          border: 1, 
          borderColor: 'error.main', 
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(211, 47, 47, 0.25)' : 'rgba(211, 47, 47, 0.05)'
        }}
      >
        <Typography variant="h6" gutterBottom color="error">
          Zona de Perigo
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          A exclusão da sua conta é uma ação permanente e removerá todos os seus dados.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleOpenDeleteDialog}
            startIcon={<DeleteIcon />}
          >
            Excluir Minha Conta
          </Button>
        </Box>
      </Paper>

      {/* --- DIÁLOGO DE CONFIRMAÇÃO ADICIONADO --- */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-account-dialog-title"
        aria-describedby="delete-account-dialog-description"
      >
        <DialogTitle id="delete-account-dialog-title">
          {"Confirmar Exclusão Permanente da Conta"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-account-dialog-description">
            Você tem certeza que deseja excluir sua conta? Todos os seus dados, incluindo suas notas e tags, serão perdidos para sempre. Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} autoFocus color="error">
            Sim, Excluir a Conta
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;