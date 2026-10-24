import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // TXN-88401
    sku: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['STOCK_IN', 'STOCK_OUT', 'ADJUSTMENT'], required: true },
    qty: { type: Number, required: true },
    timestamp: { type: String, required: true },
    user: { type: String, required: true },
    role: { type: String, required: true },
  },
  { timestamps: true }
);

transactionSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  },
});

export default mongoose.model('Transaction', transactionSchema);
