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
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/auth/authProvider';

const drawerWidth = 240;
const collapsedDrawerWidth = 60;

const Sidebar = ({ open, onToggle, isDesktop }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const handleNavigation = (path) => {
    navigate(path);
    if (!isDesktop) {
      onToggle();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (!isDesktop) {
      onToggle();
    }
  };

  const menuItems = [
    { text: 'Minhas Notas', icon: <DescriptionIcon />, path: '/' },
    { text: 'Nova Nota', icon: <NoteAddIcon />, path: '/notes/new' },
    { text: 'Gerenciar Tags', icon: <LabelIcon />, path: '/tags' },
    { text: 'Perfil', icon: <PersonIcon />, path: '/profile' },
  ];

  const isActive = (itemPath) => {
    if (itemPath === '/') {
      return location.pathname === '/' || (location.pathname.startsWith('/notes/') && !location.pathname.endsWith('/new'));
    }
    return location.pathname.startsWith(itemPath);
  };

  const drawerContent = (
    <>
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
                justifyContent: 'center',
                px: 2.5,
                mx: 1,
                my: 0.5,
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
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
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  opacity: open ? 1 : 0,
                  '& .MuiTypography-root': {
                    fontWeight: isActive(item.path) ? 600 : 400
                  }
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <List>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{ minHeight: 48, justifyContent: 'center', px: 2.5, mx: 1, my: 0.5, borderRadius: 1 }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );

  return (
    <Drawer
      variant={isDesktop ? 'permanent' : 'temporary'}
      open={open}
      onClose={isDesktop ? null : onToggle}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: open ? drawerWidth : collapsedDrawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : collapsedDrawerWidth,
          boxSizing: 'border-box',
          transition: (theme) => theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
          border: 'none',
          boxShadow: 2,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;