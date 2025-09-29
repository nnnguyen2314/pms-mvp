'use client';

import React from 'react';
import LoginForm from '../components/LoginForm';
import { useLogin } from '../hooks/useLogin';

const LoginContainer: React.FC = () => {
  const { email, password, submitting, error, handleChange, handleSubmit } = useLogin();

  return (
    <LoginForm
      email={email}
      password={password}
      submitting={submitting}
      error={error}
      onChange={handleChange}
      onSubmit={(e) => void handleSubmit(e)}
    />
  );
};

export default LoginContainer;
