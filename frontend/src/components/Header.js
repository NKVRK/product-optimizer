import {
  AppBar,
  Toolbar,
  Button,
  Box,
  useTheme as useMuiTheme,
  IconButton
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  // MUI's theme hook for responsive design
  const theme = useMuiTheme();
  
  // Custom theme context hook for global state like isOptimizing
  const { isOptimizing } = useTheme();

  // React Router hook to get the current page's location
  const location = useLocation();

  // Navigation items for the header
  const navItems = [
    { path: '/', label: 'Home' },
    // Disable the History button while an optimization is in progress
    { path: '/history', label: 'History', disabled: isOptimizing }
  ];

  return (
    <AppBar position="static" elevation={1} color="default">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        
        {/* Logo Icon that links to the homepage */}
        <IconButton
          component={Link}
          to="/"
          sx={{ color: 'primary' }}
        >
          <TrendingUpIcon fontSize="large" />
        </IconButton>

        {/* Navigation links */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 2 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              // Highlight the button if it's the active page
              variant={location.pathname === item.path ? "contained" : "text"}
              disabled={item.disabled}
              color="primary"
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Theme toggle switch */}
        <ThemeToggle />
      </Toolbar>
    </AppBar>
  );
};

export default Header;