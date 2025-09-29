'use client';

import { Button, TextField, Box } from '@mui/material';
import { useLoginForm } from './useLoginForm';

const LoginForm = () => {
  const { email, password, handleChange, handleLogin } = useLoginForm();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField name="email" label="Email" value={email} onChange={handleChange} />
      <TextField
        name="password"
        label="Password"
        type="password"
        value={password}
        onChange={handleChange}
      />
      <Button variant="contained" onClick={handleLogin}>
        Login
      </Button>
    </Box>
  );
};

export default LoginForm;
