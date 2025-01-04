import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  DialogTitle,
  DialogContent
} from '@mui/material';
import { supplierService } from '../../services/api';

function OrderStatus({ supplierId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const response = await supplierService.getOrderStatus(supplierId);
        setOrders(response.data);
      } catch (err) {
        setError('Failed to load order status');
      } finally {
        setLoading(false);
      }
    };

    if (supplierId) {
      loadOrders();
    }
  }, [supplierId]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <DialogTitle>Current Orders</DialogTitle>
      <DialogContent>
        <List>
          {orders.map((order) => (
            <ListItem key={order.id}>
              <ListItemText
                primary={`Order #${order.id}`}
                secondary={`Status: ${order.status}`}
              />
            </ListItem>
          ))}
          {orders.length === 0 && (
            <Typography variant="body2" color="textSecondary">
              No current orders
            </Typography>
          )}
        </List>
      </DialogContent>
    </Box>
  );
}

export default OrderStatus;