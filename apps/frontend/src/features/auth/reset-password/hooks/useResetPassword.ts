import React, { useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAppDispatch } from '@/shared/hooks';
import { resetPassword } from '@/features/auth/store/auth.actions';

export default function useResetPassword() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const hasToken = useMemo(() => Boolean(token), [token]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!hasToken) {
      setError('Invalid or missing token. Please use the link from your email.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      await dispatch(resetPassword({ token: token as string, password }));
      setMessage('Password has been reset successfully. You can now sign in.');
      setTimeout(() => router.push('/login'), 800);
    } catch (err) {
      setError('Failed to reset password. The link may have expired.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    token,
    hasToken,
    password,
    confirmPassword,
    message,
    error,
    submitting,
    setPassword,
    setConfirmPassword,
    onSubmit,
  };
}
