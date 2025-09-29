import React from 'react';
import { useAppDispatch } from '@/shared/hooks';
import { requestPasswordReset } from '@/features/auth/store/auth.actions';

export type UseForgotPasswordReturn = {
  email: string;
  submitting: boolean;
  message: string | null;
  error: string | null;
  setEmail: (v: string) => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
};

export function useForgotPassword(): UseForgotPasswordReturn {
  const dispatch = useAppDispatch();
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setMessage(null);
    setError(null);
    setSubmitting(true);
    try {
      await dispatch(requestPasswordReset({ email }));
      setMessage("If an account with that email exists, we'll send password reset instructions.");
    } catch (err) {
      setError('Request failed. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return { email, submitting, message, error, setEmail, handleSubmit };
}

export default useForgotPassword;
