'use client';

import { ReactNode } from 'react';
import { useAbilityContext } from './ability-context';
import { ActionPermission, SubjectPermission } from './ability';

type CanProps = {
  I: ActionPermission;
  a: SubjectPermission;
  children: ReactNode;
  fallback?: ReactNode;
};

export function Can({ I, a, children, fallback = null }: CanProps) {
  const ability = useAbilityContext();

  return ability.can(I, a) ? <>{children}</> : <>{fallback}</>;
}