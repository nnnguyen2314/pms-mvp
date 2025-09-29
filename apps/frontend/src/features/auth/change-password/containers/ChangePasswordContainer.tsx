'use client';

import React from 'react';
import ChangePasswordForm from '../components/ChangePasswordForm';
import { useChangePassword } from '../hooks/useChangePassword';
import ProtectedRoute from '@/shared/components/ProtectedRoute';

const ChangePasswordContainer: React.FC = () => {
  const {
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
  } = useChangePassword();

  return (
    <ProtectedRoute>
      <ChangePasswordForm
        currentPassword={currentPassword}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        submitting={submitting}
        message={message}
        error={error}
        setCurrentPassword={setCurrentPassword}
        setNewPassword={setNewPassword}
        setConfirmPassword={setConfirmPassword}
        onSubmit={(e) => void handleSubmit(e)}
      />
    </ProtectedRoute>
  );
};

export default ChangePasswordContainer;
