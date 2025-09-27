import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  AppBar,
  Toolbar,
} from '@mui/material';
import { useAuth } from '../../contexts/auth/authProvider';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Olá, {user?.name}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h4" gutterBottom>
            Bem-vindo ao Dashboard!
          </Typography>
          <Typography variant="body1" paragraph>
            Você está logado com sucesso no sistema.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Informações do usuário:</Typography>
            <Typography variant="body2">ID: {user?.id}</Typography>
            <Typography variant="body2">Nome: {user?.name}</Typography>
            <Typography variant="body2">Email: {user?.email}</Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;