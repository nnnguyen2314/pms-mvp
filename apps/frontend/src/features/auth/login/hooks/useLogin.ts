import React from 'react';
import useAppDispatch from '@/shared/hooks/useAppDispatch';
import { doLogin } from '@/features/auth/store/auth.actions';
import { useRouter } from 'next/navigation';

export type UseLoginReturn = {
  email: string;
  password: string;
  submitting: boolean;
  error: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
};

export function useLogin(): UseLoginReturn {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'email') setEmail(e.target.value);
    if (e.target.name === 'password') setPassword(e.target.value);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await dispatch(doLogin({ email, password }));
      router.push('/dashboard');
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return { email, password, submitting, error, handleChange, handleSubmit };
}

export default useLogin;
