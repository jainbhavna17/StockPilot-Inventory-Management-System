// "YYYY-MM-DD HH:mm:ss" (same format as the original UI)
export const nowStamp = () => new Date().toISOString().replace('T', ' ').substring(0, 19);

// Generates e.g. SKU-4821 / TXN-83920 / AUD-5512 and retries until the id is unused.
export const uniqueId = async (Model, prefix, min, span) => {
  for (let i = 0; i < 20; i += 1) {
    const id = `${prefix}-${Math.floor(min + Math.random() * span)}`;
    // eslint-disable-next-line no-await-in-loop
    const exists = await Model.exists({ id });
    if (!exists) return id;
  }
  return `${prefix}-${Date.now()}`;
};

export const computeStatus = (stock, minStock) => {
  if (stock === 0) return 'Out of Stock';
  if (stock <= minStock) return 'Low Stock';
  return 'In Stock';
};
