'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/shared/api/axiosInstance';
import LoginContainer from '@/features/auth/login/containers/LoginContainer';
import { Box, CircularProgress } from '@mui/material';

const LoginPage = () => {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    async function checkAuth() {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        if (!token) {
          if (mounted) { setIsAuthed(false); setChecking(false); }
          return;
        }
        await api.get('/auth/me');
        if (!mounted) return;
        setIsAuthed(true);
        setTimeout(() => router.push('/dashboard'), 0);
      } catch (e) {
        if (!mounted) return;
        try { if (typeof window !== 'undefined') localStorage.removeItem('authToken'); } catch {}
        setIsAuthed(false);
      } finally {
        if (mounted) setChecking(false);
      }
    }
    checkAuth();
    return () => { mounted = false; };
  }, [router]);

  if (checking) {
    return (
      <Box sx={{ display: 'flex', minHeight: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isAuthed) {
    // Redirecting in effect; render nothing
    return null;
  }

  return <LoginContainer />;
};

export default LoginPage;
