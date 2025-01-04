import { useState } from 'react';
import { authService } from '../../services/api';
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
import { useAuth } from '../../contexts/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
        const response = await authService.login(credentials);
        login(response.data); // This will set token and user info
        toast.success('Login successful!');
        navigate('/');
      } catch (err) {
        setError(err.response?.data?.message || 'Login failed');
        toast.error('Login failed');
      } finally {
        setLoading(false);
      }
    };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4, 
        maxWidth: 400, 
        width: '100%',
        backgroundColor: 'background.paper' 
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Login to TeleTrack
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={credentials.email}
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
          required
          disabled={loading}
          autoComplete="email"
          autoFocus
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          required
          disabled={loading}
          autoComplete="current-password"
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ mt: 1 }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        <Divider sx={{ my: 2 }}>or</Divider>
        
        <Typography align="center">
          Don't have an account?{' '}
          <Link 
            to="/register" 
            style={{ 
              textDecoration: 'none',
              color: theme => theme.palette.primary.main
            }}
          >
            Register here
          </Link>
        </Typography>
      </Box>
    </Paper>
  );
}

export default Login;