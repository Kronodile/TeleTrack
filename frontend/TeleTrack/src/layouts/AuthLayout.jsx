import { Box } from '@mui/material';

function AuthLayout({ children }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      {children}
    </Box>
  );
}

export default AuthLayout;