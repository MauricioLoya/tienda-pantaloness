'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { AppAbility, createAbility } from './ability';

const AbilityContext = createContext<AppAbility | undefined>(undefined);

export const AbilityProvider = ({
  isSuperAdmin,
  children
}: {
  isSuperAdmin: boolean;
  children: ReactNode
}) => {
  const ability = createAbility(isSuperAdmin);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
};

export const useAbilityContext = () => {
  const context = useContext(AbilityContext);
  if (context === undefined) {
    throw new Error('useAbilityContext must be used within an AbilityProvider');
  }
  return context;
};