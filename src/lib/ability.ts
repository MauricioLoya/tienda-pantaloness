import { defineAbility } from '@casl/ability';

export type ActionPermission = 'manage' | 'create' | 'read' | 'update' | 'delete';
export type SubjectPermission =
  | 'User'
  | 'Order'
  | 'Product'
  | 'Category'
  | 'Promotion'
  | 'Section'
  | 'Config'
  | 'all';

export type AppAbility = ReturnType<typeof defineAbility>;

export function createAbility(isSuper: boolean | undefined) {
  return defineAbility((can, cannot) => {
    if (isSuper) {
      can('manage', 'all');
    } else {
      can('read', 'User');
      cannot('create', 'User');
      cannot('update', 'User');
      cannot('delete', 'User');
      // Permisos básicos para usuarios normales
      // Orders
      can('read', 'User');
      can('read', 'Order');
      can('create', 'Order');
      can('update', 'Order');
      can('delete', 'Order');
      // Categorías
      can('read', 'Category');
      can('create', 'Category');
      can('update', 'Category');
      can('delete', 'Category');

      // Productos
      can('read', 'Product');
      can('create', 'Product');
      can('update', 'Product');
      can('delete', 'Product');

      // Promociones
      can('read', 'Promotion');
      can('create', 'Promotion');
      can('update', 'Promotion');
      can('delete', 'Promotion');

      // Sections
      can('read', 'Section');
      can('create', 'Section');
      can('update', 'Section');
      can('delete', 'Section');

      // Configuración
      can('read', 'Config');
      can('update', 'Config');
    }
  });
}
