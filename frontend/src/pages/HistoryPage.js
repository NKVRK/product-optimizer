import { useState, useMemo } from 'react';
import {
  Container,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { Visibility, History } from '@mui/icons-material';
import { useFetch } from '../hooks/useFetch';
import { productAPI } from '../services/api';
import SearchBar from '../components/SearchBar';
import Modal from '../components/Modal';
import OriginalVsOptimizedCard from '../components/OriginalVsOptimizedCard';

const HistoryPage = () => {
  // State for the search term and the currently selected ASIN for the modal
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsin, setSelectedAsin] = useState(null);
  
  // Fetch the list of all products
  const { data: products, loading, error } = useFetch(() => productAPI.getHistory());
  
  // Fetch the history for a specific ASIN when selected
  const { data: asinHistory } = useFetch(
    selectedAsin ? () => productAPI.getASINHistory(selectedAsin) : null,
    [selectedAsin]
  );

  // Memoized filtering of products based on the search term
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    return products.filter(product =>
      product.asin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // Handlers for the modal
  const handleViewOptimizations = (asin) => {
    setSelectedAsin(asin);
  };

  const handleCloseModal = () => {
    setSelectedAsin(null);
  };

  // Display a loading indicator while fetching data
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading product history...
        </Typography>
      </Container>
    );
  }

  // Display an error message if the fetch fails
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Failed to load product history: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          Optimization History
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          View all previously optimized products and their optimization history
        </Typography>
      </Box>

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        sx={{ mb: 3 }}
      />

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ASIN</strong></TableCell>
              <TableCell><strong>Product Name</strong></TableCell>
              <TableCell><strong>Last Updated</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.asin} hover>
                <TableCell>
                  <Chip label={product.asin} variant="outlined" />
                </TableCell>
                <TableCell>{product.title}</TableCell>
                <TableCell>{new Date(product.last_updated).toLocaleString()}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => handleViewOptimizations(product.asin)}
                  >
                    View Optimizations
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Display a message when no history is found */}
      {filteredProducts.length === 0 && (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', mt: 2 }}>
          <History sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No optimization history found
          </Typography>
        </Paper>
      )}

      {/* Modal to display the optimization history for a selected ASIN */}
      <Modal
        open={!!selectedAsin}
        onClose={handleCloseModal}
        title={`Optimization History for ${selectedAsin}`}
        maxWidth="lg"
      >
        {asinHistory ? (
          <Box>
            <Typography variant="h6" gutterBottom>{asinHistory.title}</Typography>
            {asinHistory.history.map((version, index) => (
              <Box key={index} sx={{ mb: 4 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                  Optimization from {new Date(version.timestamp).toLocaleString()}
                </Typography>
                <OriginalVsOptimizedCard
                  originalInfo={version.original_info}
                  optimizedInfo={version.optimized_info}
                  timestamp={version.timestamp}
                />
              </Box>
            ))}
          </Box>
        ) : (
          <CircularProgress />
        )}
      </Modal>
    </Container>
  );
};

export default HistoryPage;