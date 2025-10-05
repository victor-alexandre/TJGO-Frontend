import React from 'react';
import SignUp from '../../components/auth/signUp';
import { Box, Paper, Typography, Container } from '@mui/material';

const SignUpPage = () => {
  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.background.default,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={4}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
            Cadastre-se
          </Typography>
          <SignUp />
        </Paper>
      </Container>
    </Box>
  );
};

export default SignUpPage;