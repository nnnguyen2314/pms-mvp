'use client';

import React from 'react';
import { Box, Button, Paper, Stack, TextField, Typography, Link as MuiLink } from '@mui/material';
import NextLink from 'next/link';

export type RegisterFormProps = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  submitting?: boolean;
  error?: string | null;
  success?: string | null;
  onChange: {
    setName: (v: string) => void;
    setEmail: (v: string) => void;
    setPassword: (v: string) => void;
    setConfirmPassword: (v: string) => void;
  };
  onSubmit: (e: React.FormEvent) => void;
};

const RegisterForm: React.FC<RegisterFormProps> = ({ name, email, password, confirmPassword, submitting, error, success, onChange, onSubmit }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={2} sx={{ p: 4, width: '100%', maxWidth: 480 }}>
        <form onSubmit={onSubmit}>
          <Stack spacing={2}>
            <Typography variant="h5" component="h1">Create account</Typography>
            <TextField label="Full name" value={name} onChange={(e) => onChange.setName(e.target.value)} fullWidth autoFocus />
            <TextField label="Email" type="email" value={email} onChange={(e) => onChange.setEmail(e.target.value)} fullWidth required />
            <TextField label="Password" type="password" value={password} onChange={(e) => onChange.setPassword(e.target.value)} fullWidth required />
            <TextField label="Confirm password" type="password" value={confirmPassword} onChange={(e) => onChange.setConfirmPassword(e.target.value)} fullWidth required />
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            {success && <Typography color="success.main" variant="body2">{success}</Typography>}
            <Button type="submit" variant="contained" disabled={!!submitting}>
              {submitting ? 'Creating...' : 'Create account'}
            </Button>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Already have an account?{' '}<MuiLink component={NextLink} href="/login">Sign in</MuiLink>
            </Typography>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default RegisterForm;
