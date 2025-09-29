import Image from 'next/image';
import { Suspense } from 'react';
import { Box, Typography } from '@mui/material';

// Server Component: heavy static content (could be CMS-driven)
async function Stats() {
  // Simulate server-side computation or static fetch
  const stats = { workspaces: 1, users: 4, projects: 0 };
  return (
    <Box sx={{ display: 'flex', gap: 4 }}>
      <Typography>Workspaces: {stats.workspaces}</Typography>
      <Typography>Users: {stats.users}</Typography>
      <Typography>Projects: {stats.projects}</Typography>
    </Box>
  );
}

// Client Component: simple CTA
function Cta() {
  return (
    <a className="flex items-center gap-2 hover:underline hover:underline-offset-4" href="/dashboard">
      Get Started →
    </a>
  );
}

export default async function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h4">Welcome to PMS MVP</Typography>
          <Suspense fallback={<div>Loading stats...</div>}>
            <Stats />
          </Suspense>
          <Cta />
        </Box>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
