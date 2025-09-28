import React from 'react';
import { Box, Typography, Container, Link, IconButton } from '@mui/material';
import { GitHub as GitHubIcon, LinkedIn as LinkedInIcon, Email as EmailIcon } from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800],
        borderTop: '1px solid',
        borderColor: 'divider',
        transition: 'margin 0.3s ease', // Transição suave
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: 'center',
          gap: 2 
        }}>
          {/* Informações de Copyright */}
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="body2" color="text.secondary">
              © {currentYear} Notes App. Todos os direitos reservados.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              José Solenir Lima Figuerêdo
                Owen Alves Lima
                Renato Aparecido dos Santos Júnior
                Victor Alexandre de Carvalho Coelho
            </Typography>
            
          </Box>

          {/* Links Rápidos */}
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link 
              href="#" 
              color="text.secondary" 
              variant="body2"
              underline="hover"
            >
              Política de Privacidade
            </Link>
            <Link 
              href="#" 
              color="text.secondary" 
              variant="body2"
              underline="hover"
            >
              Termos de Uso
            </Link>
            <Link 
              href="#" 
              color="text.secondary" 
              variant="body2"
              underline="hover"
            >
              Suporte
            </Link>
          </Box>

          {/* Redes Sociais */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              size="small" 
              color="primary"
              aria-label="GitHub"
            >
              <GitHubIcon fontSize="small" />
            </IconButton>
            <IconButton 
              size="small" 
              color="primary"
              aria-label="LinkedIn"
            >
              <LinkedInIcon fontSize="small" />
            </IconButton>
            <IconButton 
              size="small" 
              color="primary"
              aria-label="Email"
            >
              <EmailIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Versão do App */}
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Versão 1.0.0
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;