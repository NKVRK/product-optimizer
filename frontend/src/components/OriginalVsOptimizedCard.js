import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  Grid,
  useTheme,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { CheckCircle, AutoAwesome } from '@mui/icons-material';

// A reusable card component to display either original or optimized product info.
const InfoCard = ({ title, data, type }) => {
  const theme = useTheme();
  const isOriginal = type === 'original';

  return (
    <Card 
      sx={{ height: '100%' }}
      variant="outlined"
    >
      <CardHeader
        avatar={isOriginal ? <CheckCircle color="primary" /> : <AutoAwesome sx={{ color: '#03DAC6' }} />}
        title={
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        }
      />
      <Divider />
      <CardContent>
        {/* Product Title */}
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          {data.title}
        </Typography>
        
        {/* Product Description */}
        <Typography variant="body2" color="text.secondary" paragraph>
          {data.description}
        </Typography>

        {/* Product Features */}
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Features:
        </Typography>
        <List dense sx={{ p: 0 }}>
          {data.features?.map((feature, index) => (
            <ListItem key={index} sx={{ py: 0, pl: 1 }}>
              <ListItemText primary={`• ${feature}`} />
            </ListItem>
          ))}
        </List>

        {/* AI-suggested Keywords (only for optimized card) */}
        {data.keywords && (
          <>
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
              Keywords:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {data.keywords.map((keyword, index) => (
                <Chip key={index} label={keyword} variant="outlined" size="small" />
              ))}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

// This component renders two InfoCard components side-by-side for comparison.
const OriginalVsOptimizedCard = ({ originalInfo, optimizedInfo }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={3}>
        {/* Original Product Info Card */}
        <Grid item xs={12} md={6}>
          <InfoCard
            title="Original Product"
            data={originalInfo}
            type="original"
          />
        </Grid>
        {/* Optimized Product Info Card */}
        <Grid item xs={12} md={6}>
          <InfoCard
            title="AI Optimized"
            data={optimizedInfo}
            type="optimized"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default OriginalVsOptimizedCard;