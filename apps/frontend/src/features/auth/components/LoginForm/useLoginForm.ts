import React, { useCallback, useState } from 'react';
import useAppDispatch from '../../../../shared/hooks/useAppDispatch';
import { doLogin } from '@/features/auth/store/auth.actions';
import { useRouter } from 'next/navigation';

export const useLoginForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'email') {
      setEmail(e.target.value);
    }
    if (e.target.name === 'password') {
      setPassword(e.target.value);
    }
  };

  const handleDoLogin = useCallback(
    async (email: string, password: string) => {
      await dispatch(doLogin({ email, password }));
    },
    [dispatch]
  );

  const handleLogin = async () => {
    try {
      await handleDoLogin(email, password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return { email, password, handleChange, handleLogin };
};
