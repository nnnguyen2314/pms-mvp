'use client';

import React from 'react';
import RegisterForm from '../components/RegisterForm';
import { useRegister } from '../hooks/useRegister';

const RegisterContainer: React.FC = () => {
  const {
    name,
    email,
    password,
    confirmPassword,
    submitting,
    error,
    success,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
    handleSubmit,
  } = useRegister();

  return (
    <RegisterForm
      name={name}
      email={email}
      password={password}
      confirmPassword={confirmPassword}
      submitting={submitting}
      error={error}
      success={success}
      onChange={{ setName, setEmail, setPassword, setConfirmPassword }}
      onSubmit={(e) => void handleSubmit(e)}
    />
  );
};

export default RegisterContainer;
