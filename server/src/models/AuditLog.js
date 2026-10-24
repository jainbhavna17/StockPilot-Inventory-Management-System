import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // AUD-9021
    action: { type: String, required: true },
    userId: { type: String, required: true },
    ip: { type: String, required: true },
    timestamp: { type: String, required: true },
    details: { type: String, required: true },
  },
  { timestamps: true }
);

auditLogSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  },
});

export default mongoose.model('AuditLog', auditLogSchema);
