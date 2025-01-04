import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

function SupplierForm({ supplier, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  });

  useEffect(() => {
    if (supplier) {
      setFormData(supplier);
    }
  }, [supplier]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <DialogTitle>
        {supplier ? 'Edit Supplier' : 'Add Supplier'}
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Supplier Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Contact Name"
          value={formData.contactName}
          onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
          margin="normal"
        />
        <TextField
          fullWidth
          type="email"
          label="Contact Email"
          value={formData.contactEmail}
          onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Contact Phone"
          value={formData.contactPhone}
          onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
          margin="normal"
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Box>
  );
}

export default SupplierForm;