import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/shared/hooks';
import { doRegister } from '@/features/auth/store/auth.actions';

export type UseRegisterReturn = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  submitting: boolean;
  error: string | null;
  success: string | null;
  setName: (v: string) => void;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  setConfirmPassword: (v: string) => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
};

export function useRegister(): UseRegisterReturn {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccess(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setSubmitting(true);
    try {
      const action = await dispatch(doRegister({ name, email, password, role: 'member' }));
      const payload: any = (action as any).payload;
      if (payload?.token) {
        setSuccess('Registration successful! Redirecting to your dashboard...');
        setTimeout(() => router.push('/dashboard'), 600);
      } else {
        setSuccess('Registration successful! Please sign in.');
        setTimeout(() => router.push('/login'), 600);
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
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
  };
}

export default useRegister;
