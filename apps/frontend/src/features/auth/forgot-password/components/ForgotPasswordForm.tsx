'use client';

import React from 'react';
import { Box, Button, Paper, Stack, TextField, Typography, Link as MuiLink } from '@mui/material';
import NextLink from 'next/link';

export type ForgotPasswordFormProps = {
  email: string;
  submitting?: boolean;
  message?: string | null;
  error?: string | null;
  setEmail: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ email, submitting, message, error, setEmail, onSubmit }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={2} sx={{ p: 4, width: '100%', maxWidth: 480 }}>
        <form onSubmit={onSubmit}>
          <Stack spacing={2}>
            <Typography variant="h5" component="h1">Forgot password</Typography>
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required />
            {message && <Typography color="success.main" variant="body2">{message}</Typography>}
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <Button type="submit" variant="contained" disabled={!!submitting}>{submitting ? 'Sending...' : 'Send reset link'}</Button>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Remembered your password?{' '}<MuiLink component={NextLink} href="/login">Sign in</MuiLink>
            </Typography>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default ForgotPasswordForm;
