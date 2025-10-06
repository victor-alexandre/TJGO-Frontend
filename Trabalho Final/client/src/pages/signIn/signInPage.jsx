import React from 'react';
import SignIn from '../../components/auth/signIn';
import { Box, Paper, Typography, Container } from '@mui/material';

const SignInPage = () => {
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
            Notes App
          </Typography>
          <SignIn />
        </Paper>
      </Container>
    </Box>
  );
};

export default SignInPage;