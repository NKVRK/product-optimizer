import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import { Search, AutoAwesome } from '@mui/icons-material';
import { useFetch } from '../hooks/useFetch';
import { productAPI } from '../services/api';
import OriginalVsOptimizedCard from '../components/OriginalVsOptimizedCard';
import { useTheme } from '../context/ThemeContext';

const HomePage = () => {
  // State for the ASIN input and the submitted ASIN
  const [asin, setAsin] = useState('');
  const [submittedAsin, setSubmittedAsin] = useState(null);
  const { setIsOptimizing } = useTheme();
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [validationError, setValidationError] = useState('');

  // Custom hook to fetch data when a new ASIN is submitted
  const { data, loading, error } = useFetch(
    submittedAsin ? () => productAPI.getASIN(submittedAsin) : null,
    [submittedAsin, fetchTrigger]
  );

  // Update the global optimizing state
  useEffect(() => {
    setIsOptimizing(loading);
  }, [loading, setIsOptimizing]);

  // Handle form submission and validate the ASIN
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedAsin = asin.trim().toUpperCase();
    
    // ASIN validation regex (10 alphanumeric characters)
    const asinRegex = /^[A-Z0-9]{10}$/;

    if (asinRegex.test(trimmedAsin)) {
      setValidationError('');
      setSubmittedAsin(trimmedAsin);
      setFetchTrigger(prev => prev + 1);
    } else {
      setValidationError('Invalid ASIN format. Please enter a 10-character alphanumeric ASIN.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom color="primary">
            Product Optimizer
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
            Enter an ASIN to generate AI-optimized product information
          </Typography>

          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ASIN"
                variant="outlined"
                value={asin}
                onChange={(e) => setAsin(e.target.value)}
                placeholder="Enter Amazon ASIN (e.g., B08N5WRWNW)"
                disabled={loading}
                error={!!validationError}
                helperText={validationError}
                InputProps={{
                  startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md="auto">
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!asin.trim() || loading}
                startIcon={loading ? <CircularProgress size={20} /> : <AutoAwesome />}
                sx={{ minWidth: 160, height: 56 }}
              >
                {loading ? 'Optimizing...' : 'Optimize'}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Display API errors */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Display the optimization results */}
      {data && (
        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Results for ASIN: <strong>{data.asin}</strong>
          </Typography>
          <OriginalVsOptimizedCard
            originalInfo={data.original_info}
            optimizedInfo={data.optimized_info}
          />
        </Box>
      )}
    </Container>
  );
};

export default HomePage;