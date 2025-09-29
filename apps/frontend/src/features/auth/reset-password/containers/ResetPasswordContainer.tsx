'use client';

import React from 'react';
import useResetPassword from '../hooks/useResetPassword';
import ResetPasswordForm from '../components/ResetPasswordForm';

const ResetPasswordContainer: React.FC = () => {
  const {
    hasToken,
    password,
    confirmPassword,
    message,
    error,
    submitting,
    setPassword,
    setConfirmPassword,
    onSubmit,
  } = useResetPassword();

  return (
    <ResetPasswordForm
      hasToken={!!hasToken}
      password={password}
      confirmPassword={confirmPassword}
      message={message}
      error={error}
      submitting={submitting}
      onPasswordChange={setPassword}
      onConfirmPasswordChange={setConfirmPassword}
      onSubmit={onSubmit}
    />
  );
};

export default ResetPasswordContainer;
