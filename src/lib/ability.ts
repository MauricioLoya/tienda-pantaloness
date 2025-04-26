import { defineAbility } from '@casl/ability';

export type Action = 'manage' | 'create' | 'read' | 'update' | 'delete';
export type Subject = 'User' | 'all';

export type AppAbility = ReturnType<typeof defineAbility>;

export function createAbility(isSuper: boolean | undefined) {
  console.log('isSuper', isSuper);
  return defineAbility((can, cannot) => {
    if (isSuper) {
      can('manage', 'all');
    } else {
      can('read', 'User');
      cannot('create', 'User');
      cannot('update', 'User');
      cannot('delete', 'User');
    }
  });
}
