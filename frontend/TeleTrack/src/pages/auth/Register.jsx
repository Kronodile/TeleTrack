import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  Alert,
  Divider 
} from '@mui/material';
import { toast } from 'react-toastify';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      localStorage.setItem('token', 'dummy-token');
      toast.success('Registration successful!');
      navigate('/');
      setLoading(false);
    }, 1000);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Create Account
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Full Name"
          margin="normal"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={loading}
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          margin="normal"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={loading}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          disabled={loading}
        />
        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          margin="normal"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
          disabled={loading}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </Button>

        <Divider sx={{ my: 2 }} />
        
        <Typography align="center">
          Already have an account?{' '}
          <Link to="/login" style={{ textDecoration: 'none' }}>
            Login here
          </Link>
        </Typography>
      </Box>
    </Paper>
  );
}

export default Register;