'use client';

import React from 'react';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import { useForgotPassword } from '../hooks/useForgotPassword';

const ForgotPasswordContainer: React.FC = () => {
  const { email, submitting, message, error, setEmail, handleSubmit } = useForgotPassword();

  return (
    <ForgotPasswordForm
      email={email}
      submitting={submitting}
      message={message}
      error={error}
      setEmail={setEmail}
      onSubmit={(e) => void handleSubmit(e)}
    />
  );
};

export default ForgotPasswordContainer;
