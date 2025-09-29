import React from 'react';
import { useAppDispatch } from '@/shared/hooks';
import { changePassword } from '@/features/auth/store/auth.actions';

export type UseChangePasswordReturn = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  submitting: boolean;
  message: string | null;
  error: string | null;
  setCurrentPassword: (v: string) => void;
  setNewPassword: (v: string) => void;
  setConfirmPassword: (v: string) => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
};

export function useChangePassword(): UseChangePasswordReturn {
  const dispatch = useAppDispatch();
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setMessage(null);
    setError(null);
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    setSubmitting(true);
    try {
      await dispatch(changePassword({ currentPassword, newPassword }));
      setMessage('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Failed to change password. Please check your current password.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    currentPassword,
    newPassword,
    confirmPassword,
    submitting,
    message,
    error,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    handleSubmit,
  };
}

export default useChangePassword;
