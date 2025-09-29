'use client';

import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Stack, Grid } from '@mui/material';
import { useUserData } from './useUserData';
import { useAppSelector } from '@/shared/hooks';
import { getAuthState } from '@/features/auth/store/auth.selectors';
import { Loading } from '@/shared/types';

const UserData = () => {
  const { user: userData, loading, handleFetchUserData, handleUpdateUserData } = useUserData();
  const { user: userAccount } = useAppSelector(getAuthState);
  const [showUserData, setShowUserData] = useState(false);
  const onShowUserData = async () => {
    await handleFetchUserData(userAccount?.id);
    setShowUserData(true);
  };

  const onHideUserData = async () => {
    setShowUserData(false);
  };

  const onUpdateUser = async () => {
    const userData = {
      numberOfRents: 35,
      totalAverageWeightRatings: 4.5,
      recentlyActive: Date.now(),
      rankingScore: 4.5 * 1000 + 35 * 10 + Date.now() / 1000000, // RANKING_SCORE = (totalAverageWeightRatings * 1000) + (numberOfRents * 10) + (recentlyActive / 1000000);
    };
    await handleUpdateUserData(userAccount?.id, userData);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'flex-start' }}>
      {showUserData && userData && (
        <Stack direction="column">
          <Typography variant="h6">User Info:</Typography>
          <Typography>Email: {userData.email}</Typography>
          <Typography>Rents: {userData.numberOfRents}</Typography>
          <Typography>
            Total Average Weight Ratings: {userData.totalAverageWeightRatings}
          </Typography>
          <Typography>Ranking Score: {userData.rankingScore}</Typography>
        </Stack>
      )}
      <Grid container>
        {showUserData && userData && (
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={onUpdateUser}
              disabled={loading === Loading.pending}
            >
              {loading === Loading.pending ? 'Updating...' : 'Update User Data'}
            </Button>
          </Grid>
        )}
        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={showUserData ? onHideUserData : onShowUserData}
            disabled={loading === Loading.pending}
          >
            {loading === Loading.pending
              ? 'Fetching...'
              : showUserData
                ? 'Hide User Data'
                : 'Display User Data'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserData;
