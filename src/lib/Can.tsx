'use client';

import { ReactNode } from 'react';
import { useAbilityContext } from './ability-context';
import { Action, Subject } from './ability';

type CanProps = {
  I: Action;
  a: Subject;
  children: ReactNode;
  fallback?: ReactNode;
};

export function Can({ I, a, children, fallback = null }: CanProps) {
  const ability = useAbilityContext();

  return ability.can(I, a) ? <>{children}</> : <>{fallback}</>;
}