import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const SnackbarAlert = ({ snackbar, handleCloseSnackbar }) => {
  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={2000}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={handleCloseSnackbar} severity='success'>
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAlert;
