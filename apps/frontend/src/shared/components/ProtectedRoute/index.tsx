'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/shared/hooks';
import useAppDispatch from '@/shared/hooks/useAppDispatch';
import { getAuthState } from '@/features/auth/store/auth.selectors';
import { fetchCurrentUser } from '@/features/auth/store/auth.actions';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(getAuthState);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function checkAuth() {
      try {
        if (isAuthenticated) return; // already authed
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        if (token) {
          await dispatch(fetchCurrentUser() as any);
        } else {
          router.push('/');
        }
      } finally {
        if (mounted) setChecking(false);
      }
    }
    checkAuth();
    return () => { mounted = false; };
  }, [dispatch, isAuthenticated, router]);

  useEffect(() => {
    if (!checking && !isAuthenticated) {
      router.push('/');
    }
  }, [checking, isAuthenticated, router]);

  if (!isAuthenticated) {
    // Avoid flashing content or redirect loops while we check persisted token
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
