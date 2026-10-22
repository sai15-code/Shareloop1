import mongoose from 'mongoose';

const itemRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  category: { type: String, required: true, enum: ['Books & Media', 'Electronics', 'Furniture', 'Clothing & Shoes', 'Kitchen & Dining', 'Tools & Hardware'] },
  description: { type: String, required: true, trim: true, minlength: 10, maxlength: 1000 },
  locality: { type: String, trim: true, maxlength: 120 },
  status: { type: String, enum: ['active', 'fulfilled', 'closed'], default: 'active' },
}, { timestamps: true });

export default mongoose.model('ItemRequest', itemRequestSchema);
