// client/src/components/sidebar/sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  NoteAdd as NoteAddIcon,
  Person as PersonIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Label as LabelIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar = ({ open, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Minhas Notas', icon: <DescriptionIcon />, path: '/' },
    { text: 'Nova Nota', icon: <NoteAddIcon />, path: '/notes/new' },
    { text: 'Gerenciar Tags', icon: <LabelIcon />, path: '/tags' },
    { text: 'Perfil', icon: <PersonIcon />, path: '/profile' },
  ];

  const isActive = (itemPath) => {
    // Para 'Minhas Notas' (path: '/'):
    // Ativo se a rota atual for exatamente '/'
    // OU se a rota começar com '/notes/' (como '/notes/123/edit')
    // E NÃO FOR a rota de criação de nova nota ('/notes/new')
    if (itemPath === '/') {
      return location.pathname === '/' || (location.pathname.startsWith('/notes/') && !location.pathname.endsWith('/new'));
    } 
    // Para 'Nova Nota' (path: '/notes/new'):
    // Ativo APENAS se a rota atual for exatamente '/notes/new'
    else if (itemPath === '/notes/new') {
      return location.pathname === '/notes/new';
    }
    // Para outras rotas (Gerenciar Tags, Perfil):
    // Ativo se a rota atual começar com o path do item.
    else {
      return location.pathname.startsWith(itemPath);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : 0,
          boxSizing: 'border-box',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
          border: 'none',
          boxShadow: 2,
          backgroundColor: 'background.paper',
          position: 'fixed',
          height: '100vh', 
          top: 0,
          left: 0,
        },
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {open && (
            <Typography variant="h6" noWrap component="div" color="primary">
              Menu
            </Typography>
          )}
          <IconButton onClick={onToggle} size="small">
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Box>
      </Toolbar>
      
      <Divider />
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              selected={isActive(item.path)}
              onClick={() => handleNavigation(item.path)}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                mx: 1,
                my: 0.5,
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  }
                },
                '&:hover': {
                  backgroundColor: 'action.hover',
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: isActive(item.path) ? 'primary.contrastText' : 'inherit'
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  opacity: open ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                  '& .MuiTypography-root': {
                    fontWeight: isActive(item.path) ? 600 : 400
                  }
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ mt: 'auto' }} /> 
           
    </Drawer>
  );
};

export default Sidebar;