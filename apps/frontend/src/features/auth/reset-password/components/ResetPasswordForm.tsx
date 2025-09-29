'use client';

import React from 'react';
import { Box, Button, Paper, Stack, TextField, Typography, Link as MuiLink } from '@mui/material';
import NextLink from 'next/link';

export interface ResetPasswordFormProps {
  hasToken: boolean;
  password: string;
  confirmPassword: string;
  message: string | null;
  error: string | null;
  submitting: boolean;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  hasToken,
  password,
  confirmPassword,
  message,
  error,
  submitting,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={2} sx={{ p: 4, width: '100%', maxWidth: 480 }}>
        <form onSubmit={onSubmit}>
          <Stack spacing={2}>
            <Typography variant="h5" component="h1">Reset password</Typography>
            {!hasToken && (
              <Typography color="error" variant="body2">
                Missing token. Please open the link from your password reset email.
              </Typography>
            )}
            <TextField label="New password" type="password" value={password} onChange={(e) => onPasswordChange(e.target.value)} fullWidth required />
            <TextField label="Confirm new password" type="password" value={confirmPassword} onChange={(e) => onConfirmPasswordChange(e.target.value)} fullWidth required />
            {message && <Typography color="success.main" variant="body2">{message}</Typography>}
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <Button type="submit" variant="contained" disabled={submitting || !hasToken}>{submitting ? 'Resetting...' : 'Reset password'}</Button>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Back to{' '}<MuiLink component={NextLink} href="/login">Sign in</MuiLink>
            </Typography>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default ResetPasswordForm;
