export const PERMISSION_CONSTANT = {
  // User Management
  MANAGE_USERS: 'MANAGE_USERS',
  VIEW_USERS: 'VIEW_USERS',
  CREATE_USER: 'CREATE_USER',
  UPDATE_USER: 'UPDATE_USER',
  DELETE_USER: 'DELETE_USER',

  // Role Management
  MANAGE_ROLES: 'MANAGE_ROLES',
  VIEW_ROLES: 'VIEW_ROLES',
  CREATE_ROLE: 'CREATE_ROLE',
  UPDATE_ROLE: 'UPDATE_ROLE',
  DELETE_ROLE: 'DELETE_ROLE',

  // Permission Management
  MANAGE_PERMISSIONS: 'MANAGE_PERMISSIONS',
  VIEW_PERMISSIONS: 'VIEW_PERMISSIONS',
  ASSIGN_PERMISSIONS: 'ASSIGN_PERMISSIONS',

  // Product Management
  MANAGE_PRODUCTS: 'MANAGE_PRODUCTS',
  VIEW_PRODUCTS: 'VIEW_PRODUCTS',
  CREATE_PRODUCT: 'CREATE_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',

  // Category Management
  MANAGE_CATEGORIES: 'MANAGE_CATEGORIES',
  VIEW_CATEGORIES: 'VIEW_CATEGORIES',
  CREATE_CATEGORY: 'CREATE_CATEGORY',
  UPDATE_CATEGORY: 'UPDATE_CATEGORY',
  DELETE_CATEGORY: 'DELETE_CATEGORY',

  // Order Management
  MANAGE_ORDERS: 'MANAGE_ORDERS',
  VIEW_ORDERS: 'VIEW_ORDERS',
  CREATE_ORDER: 'CREATE_ORDER',
  UPDATE_ORDER: 'UPDATE_ORDER',
  DELETE_ORDER: 'DELETE_ORDER',
  CANCEL_ORDER: 'CANCEL_ORDER',

  // Shipping Management
  MANAGE_SHIPPING: 'MANAGE_SHIPPING',
  VIEW_SHIPPING: 'VIEW_SHIPPING',
  CREATE_SHIPPING: 'CREATE_SHIPPING',
  UPDATE_SHIPPING: 'UPDATE_SHIPPING',
  DELETE_SHIPPING: 'DELETE_SHIPPING',

  // Delivery Brand Management
  MANAGE_DELIVERY_BRANDS: 'MANAGE_DELIVERY_BRANDS',
  VIEW_DELIVERY_BRANDS: 'VIEW_DELIVERY_BRANDS',
  CREATE_DELIVERY_BRAND: 'CREATE_DELIVERY_BRAND',
  UPDATE_DELIVERY_BRAND: 'UPDATE_DELIVERY_BRAND',
  DELETE_DELIVERY_BRAND: 'DELETE_DELIVERY_BRAND',

  // Shop Management
  MANAGE_SHOPS: 'MANAGE_SHOPS',
  VIEW_SHOPS: 'VIEW_SHOPS',
  CREATE_SHOP: 'CREATE_SHOP',
  UPDATE_SHOP: 'UPDATE_SHOP',
  DELETE_SHOP: 'DELETE_SHOP',

  // Reports & Analytics
  VIEW_REPORTS: 'VIEW_REPORTS',
  VIEW_ANALYTICS: 'VIEW_ANALYTICS',
  EXPORT_DATA: 'EXPORT_DATA',

  // System Settings
  EDIT_SETTINGS: 'EDIT_SETTINGS',
  VIEW_SETTINGS: 'VIEW_SETTINGS',
  MANAGE_SYSTEM: 'MANAGE_SYSTEM',
};

export const PERMISSION_KEY = 'permissions';

export const PERMISSIONS_LIST = Object.entries(PERMISSION_CONSTANT).map(
  ([key, value]) => ({
    key,
    value,
    description: formatPermissionDescription(value),
    module: getPermissionModule(value),
  }),
);

function formatPermissionDescription(permission: string): string {
  return permission
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}

function getPermissionModule(permission: string): string {
  if (permission.includes('USER')) return 'User Management';
  if (permission.includes('ROLE')) return 'Role Management';
  if (permission.includes('PERMISSION')) return 'Permission Management';
  if (permission.includes('PRODUCT')) return 'Product Management';
  if (permission.includes('CATEGOR')) return 'Category Management';
  if (permission.includes('ORDER')) return 'Order Management';
  if (permission.includes('SHIPPING')) return 'Shipping Management';
  if (permission.includes('DELIVERY')) return 'Delivery Management';
  if (permission.includes('SHOP')) return 'Shop Management';
  if (permission.includes('REPORT') || permission.includes('ANALYTIC'))
    return 'Reports & Analytics';
  if (permission.includes('SETTING') || permission.includes('SYSTEM'))
    return 'System Management';
  return 'General';
}
