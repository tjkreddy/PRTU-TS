import mongoose, { Document, Schema } from 'mongoose';

export interface GrievanceDocument extends Document {
  _id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: 'salary' | 'promotion' | 'transfer' | 'workload' | 'harassment' | 'infrastructure' | 'policy' | 'welfare' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'submitted' | 'under_review' | 'in_progress' | 'resolved' | 'closed' | 'rejected';
  submittedBy: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  school?: string;
  district?: string;
  affectedPersons?: {
    name: string;
    employeeId?: string;
    designation?: string;
  }[];
  evidenceFiles?: {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    url: string;
  }[];
  timeline: {
    date: Date;
    action: string;
    description: string;
    performedBy: mongoose.Types.ObjectId;
    attachments?: {
      filename: string;
      originalName: string;
      url: string;
    }[];
  }[];
  resolution?: {
    description: string;
    resolvedBy: mongoose.Types.ObjectId;
    resolvedAt: Date;
    satisfactionRating?: number; // 1-5 stars
    feedback?: string;
  };
  followUpRequired: boolean;
  followUpDate?: Date;
  tags: string[];
  isAnonymous: boolean;
  contactDetails?: {
    phone: string;
    email: string;
    preferredContactMethod: 'phone' | 'email' | 'both';
  };
  escalationLevel: number; // 0-3 (0: initial, 1: supervisor, 2: department head, 3: union leadership)
  relatedGrievances?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const grievanceSchema = new Schema<GrievanceDocument>({
  ticketNumber: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: [true, 'Grievance title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Grievance description is required']
  },
  category: {
    type: String,
    enum: ['salary', 'promotion', 'transfer', 'workload', 'harassment', 'infrastructure', 'policy', 'welfare', 'other'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'in_progress', 'resolved', 'closed', 'rejected'],
    default: 'submitted'
  },
  submittedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  school: {
    type: String,
    trim: true
  },
  district: {
    type: String,
    trim: true
  },
  affectedPersons: [{
    name: { type: String, required: true, trim: true },
    employeeId: { type: String, trim: true },
    designation: { type: String, trim: true }
  }],
  evidenceFiles: [{
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true }
  }],
  timeline: [{
    date: { type: Date, default: Date.now },
    action: { type: String, required: true },
    description: { type: String, required: true },
    performedBy: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    attachments: [{
      filename: { type: String, required: true },
      originalName: { type: String, required: true },
      url: { type: String, required: true }
    }]
  }],
  resolution: {
    description: { type: String },
    resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: { type: Date },
    satisfactionRating: { 
      type: Number, 
      min: 1, 
      max: 5 
    },
    feedback: { type: String }
  },
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isAnonymous: {
    type: Boolean,
    default: false
  },
  contactDetails: {
    phone: { 
      type: String,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid phone number']
    },
    email: { 
      type: String,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email']
    },
    preferredContactMethod: {
      type: String,
      enum: ['phone', 'email', 'both'],
      default: 'email'
    }
  },
  escalationLevel: {
    type: Number,
    min: 0,
    max: 3,
    default: 0
  },
  relatedGrievances: [{
    type: Schema.Types.ObjectId,
    ref: 'Grievance'
  }]
}, {
  timestamps: true
});

// Generate ticket number before saving
grievanceSchema.pre('save', async function(next) {
  if (!this.ticketNumber) {
    const currentYear = new Date().getFullYear();
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    
    // Find the last grievance of current month
    const lastGrievance = await mongoose.model('Grievance').findOne(
      { 
        ticketNumber: { 
          $regex: `^GRV-${currentYear}${currentMonth}-` 
        } 
      },
      {},
      { sort: { ticketNumber: -1 } }
    );
    
    let nextNumber = 1;
    if (lastGrievance && lastGrievance.ticketNumber) {
      const lastNumber = parseInt(lastGrievance.ticketNumber.split('-')[2]);
      nextNumber = lastNumber + 1;
    }
    
    this.ticketNumber = `GRV-${currentYear}${currentMonth}-${nextNumber.toString().padStart(4, '0')}`;
  }
  
  next();
});

// Add timeline entry when status changes
grievanceSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.timeline.push({
      date: new Date(),
      action: 'Status Changed',
      description: `Status changed to ${this.status}`,
      performedBy: this.assignedTo || this.submittedBy
    } as any);
  }
  next();
});

// Index for search and sorting
grievanceSchema.index({ ticketNumber: 1 });
grievanceSchema.index({ title: 'text', description: 'text' });
grievanceSchema.index({ status: 1, priority: 1, createdAt: -1 });
grievanceSchema.index({ category: 1, district: 1 });
grievanceSchema.index({ submittedBy: 1, status: 1 });
grievanceSchema.index({ assignedTo: 1, status: 1 });

// Virtual for days since submission
grievanceSchema.virtual('daysSinceSubmission').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - this.createdAt.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for SLA breach warning
grievanceSchema.virtual('isOverdue').get(function() {
  const slaMap = {
    'urgent': 1,    // 1 day
    'high': 3,      // 3 days
    'medium': 7,    // 7 days
    'low': 14       // 14 days
  };
  
  const slaDays = slaMap[this.priority];
  return this.daysSinceSubmission > slaDays && this.status !== 'resolved' && this.status !== 'closed';
});

// Ensure virtual fields are serialized
grievanceSchema.set('toJSON', { virtuals: true });

export default mongoose.model<GrievanceDocument>('Grievance', grievanceSchema);
