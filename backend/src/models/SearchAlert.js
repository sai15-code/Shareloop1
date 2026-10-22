import mongoose from 'mongoose';

const searchAlertSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  term: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  radius: { type: Number, required: true, min: 1, max: 25 },
  locality: { type: String, trim: true, maxlength: 120 },
  notifyByEmail: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('SearchAlert', searchAlertSchema);
