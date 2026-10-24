import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Transaction from '../models/Transaction.js';
import AuditLog from '../models/AuditLog.js';

const DEMO_PASSWORD = 'Password@123';

const USERS = [
  { name: 'John Doe', email: 'admin@stockpilot.io', role: 'Admin', avatar: 'JD', userId: 'usr_admin_01', perms: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'AUDIT_WRITE'] },
  { name: 'Sarah Connor', email: 'manager@stockpilot.io', role: 'Inventory Manager', avatar: 'SC', userId: 'usr_mgr_02', perms: ['CREATE', 'READ', 'UPDATE'] },
  { name: 'Alex Mercer', email: 'viewer@stockpilot.io', role: 'Viewer', avatar: 'AM', userId: 'usr_view_03', perms: ['READ'] },
];

const PRODUCTS = [
  { id: 'SKU-1001', name: 'MacBook Pro 16" M3 Max', category: 'Electronics', stock: 42, minStock: 15, unitPrice: 3499.0, warehouse: 'US-East-1', status: 'In Stock' },
  { id: 'SKU-1002', name: 'Ergonomic Mesh Chair X1', category: 'Furniture', stock: 8, minStock: 10, unitPrice: 450.0, warehouse: 'US-West-2', status: 'Low Stock' },
  { id: 'SKU-1003', name: 'UltraWide Curved Monitor 34"', category: 'Electronics', stock: 19, minStock: 5, unitPrice: 899.99, warehouse: 'EU-Central-1', status: 'In Stock' },
  { id: 'SKU-1004', name: 'Wireless Mechanical Keyboard', category: 'Peripherals', stock: 0, minStock: 12, unitPrice: 129.5, warehouse: 'US-East-1', status: 'Out of Stock' },
  { id: 'SKU-1005', name: 'Standing Desk Dual-Motor', category: 'Furniture', stock: 14, minStock: 8, unitPrice: 620.0, warehouse: 'US-West-2', status: 'In Stock' },
  { id: 'SKU-1006', name: 'USB-C Thunderbolt 4 Dock', category: 'Peripherals', stock: 55, minStock: 20, unitPrice: 199.0, warehouse: 'EU-Central-1', status: 'In Stock' },
  { id: 'SKU-1007', name: 'Noise-Canceling Headphones', category: 'Electronics', stock: 4, minStock: 15, unitPrice: 299.99, warehouse: 'US-East-1', status: 'Low Stock' },
];

const TRANSACTIONS = [
  { id: 'TXN-88401', sku: 'SKU-1001', name: 'MacBook Pro 16" M3 Max', type: 'STOCK_IN', qty: 10, timestamp: '2026-10-24 10:14:22', user: 'Sarah Connor', role: 'Inventory Manager' },
  { id: 'TXN-88400', sku: 'SKU-1004', name: 'Wireless Mechanical Keyboard', type: 'STOCK_OUT', qty: -5, timestamp: '2026-10-24 09:30:11', user: 'John Doe', role: 'Admin' },
  { id: 'TXN-88399', sku: 'SKU-1002', name: 'Ergonomic Mesh Chair X1', type: 'ADJUSTMENT', qty: -2, timestamp: '2026-10-23 16:45:00', user: 'John Doe', role: 'Admin' },
  { id: 'TXN-88398', sku: 'SKU-1006', name: 'USB-C Thunderbolt 4 Dock', type: 'STOCK_IN', qty: 25, timestamp: '2026-10-23 14:10:05', user: 'Sarah Connor', role: 'Inventory Manager' },
];

const AUDIT_LOGS = [
  { id: 'AUD-9021', action: 'SECURITY_TOKEN_ISSUED', userId: 'usr_admin_01', ip: '192.168.1.104', timestamp: '2026-10-24 08:00:12', details: 'RS256 Signature verified for John Doe' },
  { id: 'AUD-9022', action: 'PRODUCT_QUANTITY_UPDATE', userId: 'usr_mgr_02', ip: '10.0.4.12', timestamp: '2026-10-24 10:14:22', details: 'SKU-1001 +10 units (Supplier PO #8839)' },
  { id: 'AUD-9023', action: 'PERMISSION_CHECK', userId: 'usr_view_03', ip: '172.16.0.88', timestamp: '2026-10-24 11:20:01', details: 'Granted READ access on inventory catalog' },
];

// Insert so that the first array item is the newest (list endpoints sort by createdAt desc)
const withOrder = (rows) => {
  const base = Date.now();
  return rows.map((row, i) => ({ ...row, createdAt: new Date(base - i * 1000) }));
};

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Clearing collections...');

  await Promise.all([User.deleteMany(), Product.deleteMany(), Transaction.deleteMany(), AuditLog.deleteMany()]);

  // create() one-by-one so the password hashing hook runs
  for (const u of USERS) {
    // eslint-disable-next-line no-await-in-loop
    await User.create({ ...u, password: DEMO_PASSWORD });
  }
  await Product.insertMany(withOrder(PRODUCTS));
  await Transaction.insertMany(withOrder(TRANSACTIONS));
  await AuditLog.insertMany(withOrder(AUDIT_LOGS));

  console.log('Seed complete.');
  console.log(`Demo password for all users: ${DEMO_PASSWORD}`);
  USERS.forEach((u) => console.log(` - ${u.email} (${u.role})`));
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
