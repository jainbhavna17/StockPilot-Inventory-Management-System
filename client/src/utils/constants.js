// Demo credentials used by the "Select a demo user role" modal and the header role switcher.
// They match the users created by `npm run seed` on the server.
export const DEMO_CREDENTIALS = {
  admin: { email: 'admin@stockpilot.io', password: 'Password@123' },
  manager: { email: 'manager@stockpilot.io', password: 'Password@123' },
  viewer: { email: 'viewer@stockpilot.io', password: 'Password@123' },
};

export const NAV_ITEMS = [
  { key: 'landing', label: 'Overview' },
  { key: 'dashboard', label: 'Catalog Console' },
  { key: 'transactions', label: 'Movements Ledger' },
  { key: 'audit', label: 'Audit Log' },
  { key: 'analytics', label: 'Analytics' },
];

export const CATEGORIES = ['Electronics', 'Furniture', 'Peripherals'];
export const WAREHOUSES = ['US-East-1', 'US-West-2', 'EU-Central-1'];
