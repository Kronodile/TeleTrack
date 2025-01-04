import { useState, useEffect } from 'react';
import {
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
  Dialog,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import { Edit, Delete, LocalShipping } from '@mui/icons-material';
import { supplierService } from '../../services/api';
import SupplierForm from './SupplierForm';
import OrderStatus from './OrderStatus';

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [orderStatusOpen, setOrderStatusOpen] = useState(false);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const response = await supplierService.getAll();
      setSuppliers(response.data);
    } catch (err) {
      setError('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Suppliers</Typography>
        <Button 
          variant="contained" 
          onClick={() => {
            setSelectedSupplier(null);
            setFormOpen(true);
          }}
        >
          Add Supplier
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Contact Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.contactName}</TableCell>
                <TableCell>{supplier.contactEmail}</TableCell>
                <TableCell>{supplier.contactPhone}</TableCell>
                <TableCell>
                  <IconButton onClick={() => {
                    setSelectedSupplier(supplier);
                    setFormOpen(true);
                  }}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => {
                    setSelectedSupplier(supplier);
                    setOrderStatusOpen(true);
                  }}>
                    <LocalShipping />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)}>
        <SupplierForm 
          supplier={selectedSupplier}
          onSave={async (data) => {
            try {
              if (selectedSupplier) {
                await supplierService.update(selectedSupplier.id, data);
              } else {
                await supplierService.create(data);
              }
              loadSuppliers();
              setFormOpen(false);
            } catch (err) {
              setError('Failed to save supplier');
            }
          }}
          onCancel={() => setFormOpen(false)}
        />
      </Dialog>

      <Dialog open={orderStatusOpen} onClose={() => setOrderStatusOpen(false)}>
        <OrderStatus 
          supplierId={selectedSupplier?.id}
          onClose={() => setOrderStatusOpen(false)}
        />
      </Dialog>
    </Box>
  );
}

export default Suppliers;