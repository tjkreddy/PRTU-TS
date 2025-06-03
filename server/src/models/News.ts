import mongoose, { Document, Schema } from 'mongoose';

export interface NewsDocument extends Document {
  _id: string;
  title: string;
  content: string;
  summary: string;
  author: mongoose.Types.ObjectId;
  category: 'general' | 'announcement' | 'achievement' | 'grievance' | 'policy' | 'event';
  tags: string[];
  featuredImage?: string;
  attachments?: {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    url: string;
  }[];
  status: 'draft' | 'published' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  publishedAt?: Date;
  views: number;
  likes: mongoose.Types.ObjectId[];
  isSticky: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const newsSchema = new Schema<NewsDocument>({
  title: {
    type: String,
    required: [true, 'News title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'News content is required']
  },
  summary: {
    type: String,
    required: [true, 'News summary is required'],
    maxlength: [500, 'Summary cannot exceed 500 characters']
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['general', 'announcement', 'achievement', 'grievance', 'policy', 'event'],
    default: 'general'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  featuredImage: {
    type: String
  },
  attachments: [{
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true }
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  publishedAt: {
    type: Date
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  isSticky: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for search and sorting
newsSchema.index({ title: 'text', content: 'text', tags: 'text' });
newsSchema.index({ status: 1, publishedAt: -1 });
newsSchema.index({ category: 1, priority: 1 });
newsSchema.index({ isSticky: -1, publishedAt: -1 });

// Auto-set publishedAt when status changes to published
newsSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Virtual for like count
newsSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Ensure virtual fields are serialized
newsSchema.set('toJSON', { virtuals: true });

export default mongoose.model<NewsDocument>('News', newsSchema);
