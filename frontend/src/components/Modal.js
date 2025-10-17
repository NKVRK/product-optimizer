import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import { Close } from '@mui/icons-material';

// A generic, reusable modal component built with Material-UI's Dialog.
const Modal = ({ open, onClose, title, children, actions, maxWidth = 'md', fullWidth = true }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      scroll="paper"
    >
      {/* Modal Title Bar */}
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          {/* Close Button */}
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      {/* Modal Content Area */}
      <DialogContent dividers>
        {children}
      </DialogContent>
      
      {/* Optional Actions Footer */}
      {actions && (
        <DialogActions>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default Modal;