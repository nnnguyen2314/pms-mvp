'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/shared/api/axiosInstance';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';

export default function Home() {
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
        // Short delay to avoid flashing UI
        setTimeout(() => router.push('/dashboard'), 0);
      } catch (e) {
        if (!mounted) return;
        // Token missing/expired/invalid
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

  if (!isAuthed) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 8, px: 2 }}>
        <Stack spacing={3}>
          <Typography variant="h3" component="h1">PM SaaS</Typography>
          <Typography variant="h6" color="text.secondary">
            A lightweight project management platform with workspaces, projects, boards, tasks, and collaboration tools.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign in to start organizing your work, track progress across boards, and collaborate with your team.
          </Typography>
          <Box>
            <Button size="large" variant="contained" color="primary" onClick={() => router.push('/login')}>
              Getting Started
            </Button>
          </Box>
        </Stack>
      </Box>
    );
  }

  // If already authenticated, we start redirecting to /dashboard in effect.
  return null;
}
