import Product from '../models/Product.js';
import Transaction from '../models/Transaction.js';
import { computeStatus, nowStamp, uniqueId } from '../utils/helpers.js';
import { logAudit } from '../utils/auditLogger.js';

const parseBody = (body) => ({
  name: body.name,
  category: body.category,
  stock: parseInt(body.stock, 10) || 0,
  minStock: parseInt(body.minStock, 10) || 0,
  unitPrice: parseFloat(body.unitPrice) || 0,
  warehouse: body.warehouse,
});

const recordTransaction = async (req, product, mode) => {
  const id = await uniqueId(Transaction, 'TXN', 80000, 10000);
  return Transaction.create({
    id,
    sku: product.id,
    name: product.name,
    type: mode === 'add' ? 'STOCK_IN' : 'ADJUSTMENT',
    qty: product.stock,
    timestamp: nowStamp(),
    user: req.user.name,
    role: req.user.role,
  });
};

// GET /api/products
export const getProducts = async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
};

// POST /api/products
export const createProduct = async (req, res) => {
  const data = parseBody(req.body);
  if (!data.name || !data.category || !data.warehouse) {
    return res.status(400).json({ message: 'Name, category and warehouse are required' });
  }

  const id = await uniqueId(Product, 'SKU', 1000, 9000);
  const product = await Product.create({ id, ...data, status: computeStatus(data.stock, data.minStock) });
  await logAudit(req, 'PRODUCT_CREATED', `Added SKU ${id} (${product.name})`);
  const transaction = await recordTransaction(req, product, 'add');

  return res.status(201).json({ product, transaction });
};

// PUT /api/products/:id
export const updateProduct = async (req, res) => {
  const data = parseBody(req.body);
  const product = await Product.findOne({ id: req.params.id });
  if (!product) return res.status(404).json({ message: 'SKU not found' });

  Object.assign(product, data, { status: computeStatus(data.stock, data.minStock) });
  await product.save();
  await logAudit(req, 'PRODUCT_UPDATED', `Updated SKU ${product.id}`);
  const transaction = await recordTransaction(req, product, 'edit');

  return res.json({ product, transaction });
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  const product = await Product.findOneAndDelete({ id: req.params.id });
  if (!product) return res.status(404).json({ message: 'SKU not found' });
  await logAudit(req, 'PRODUCT_DELETED', `Deleted SKU ${product.id} (${product.name})`);
  return res.json({ id: product.id });
};
