"use client";

import React from 'react';
import { Box, Button, Paper, Stack, TextField, Typography, Link as MuiLink } from '@mui/material';
import NextLink from 'next/link';

export type LoginFormProps = {
  email: string;
  password: string;
  submitting?: boolean;
  error?: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ email, password, submitting, error, onChange, onSubmit }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={2} sx={{ p: 4, width: '100%', maxWidth: 420 }}>
        <form onSubmit={onSubmit}>
          <Stack spacing={2}>
            <Typography variant="h5" component="h1">Sign in</Typography>
            <TextField label="Email" name="email" value={email} onChange={onChange} type="email" fullWidth required />
            <TextField label="Password" name="password" value={password} onChange={onChange} type="password" fullWidth required />
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <Button type="submit" variant="contained" color="primary" disabled={!!submitting}>
              {submitting ? 'Signing in...' : 'Login'}
            </Button>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <MuiLink component={NextLink} href="/forgot-password">Forgot password?</MuiLink>
            </Typography>
            <Typography variant="body2">
              New here? <MuiLink component={NextLink} href="/register">Create an account</MuiLink>
            </Typography>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginForm;
