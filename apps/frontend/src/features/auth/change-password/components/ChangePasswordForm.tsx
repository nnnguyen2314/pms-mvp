'use client';

import React from 'react';
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';

export type ChangePasswordFormProps = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  submitting?: boolean;
  message?: string | null;
  error?: string | null;
  setCurrentPassword: (v: string) => void;
  setNewPassword: (v: string) => void;
  setConfirmPassword: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ currentPassword, newPassword, confirmPassword, submitting, message, error, setCurrentPassword, setNewPassword, setConfirmPassword, onSubmit }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={2} sx={{ p: 4, width: '100%', maxWidth: 480 }}>
        <form onSubmit={onSubmit}>
          <Stack spacing={2}>
            <Typography variant="h5" component="h1">Change password</Typography>
            <TextField label="Current password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} fullWidth required />
            <TextField label="New password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} fullWidth required />
            <TextField label="Confirm new password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} fullWidth required />
            {message && <Typography color="success.main" variant="body2">{message}</Typography>}
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <Button type="submit" variant="contained" disabled={!!submitting}>{submitting ? 'Saving...' : 'Change password'}</Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default ChangePasswordForm;
