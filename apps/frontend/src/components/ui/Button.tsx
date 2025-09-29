"use client";

import React from 'react';
import { Button as MUIButton, ButtonProps as MUIButtonProps } from '@mui/material';

export type ButtonProps = MUIButtonProps & { testId?: string };

export default function Button({ testId, children, ...rest }: ButtonProps) {
  return (
    <MUIButton data-testid={testId} {...rest}>
      {children}
    </MUIButton>
  );
}
