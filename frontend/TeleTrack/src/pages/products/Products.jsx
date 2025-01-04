import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import ProductForm from './ProductForm';
import { productService } from '../../services/api';
import DeleteConfirmDialog from '../../components/DeleteConfirmDialog';
import { useSnackbar } from 'notistack';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAll();
      setProducts(response.data);
    } catch (error) {
      enqueueSnackbar('Error fetching products', { variant: 'error' });
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedProduct) {
        await productService.update(selectedProduct.product_id, formData);
        enqueueSnackbar('Product updated successfully', { variant: 'success' });
      } else {
        await productService.create(formData);
        enqueueSnackbar('Product created successfully', { variant: 'success' });
      }
      setOpen(false);
      fetchProducts();
    } catch (error) {
      enqueueSnackbar('Error saving product', { variant: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      await productService.delete(selectedProduct.product_id);
      enqueueSnackbar('Product deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      fetchProducts();
    } catch (error) {
      enqueueSnackbar('Error deleting product', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedProduct(null);
            setOpen(true);
          }}
        >
          Add Product
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Stock Level</TableCell>
              <TableCell>Reorder Point</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.product_id}>
                <TableCell>{product.product_name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.stock_level}</TableCell>
                <TableCell>{product.reorder_point}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setSelectedProduct(product);
                      setOpen(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setSelectedProduct(product);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedProduct ? 'Edit Product' : 'Add Product'}
        </DialogTitle>
        <DialogContent>
          <ProductForm
            initialData={selectedProduct}
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        content="Are you sure you want to delete this product?"
      />
    </Box>
  );
};

export default Products;