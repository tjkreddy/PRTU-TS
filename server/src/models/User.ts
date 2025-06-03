import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface UserDocument extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'member' | 'admin' | 'super_admin';
  employeeId?: string;
  school?: string;
  district?: string;
  designation?: string;
  phoneNumber?: string;
  dateOfJoining?: Date;
  membershipNumber?: string;
  isActive: boolean;
  isVerified: boolean;
  avatar?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['member', 'admin', 'super_admin'],
    default: 'member'
  },
  employeeId: {
    type: String,
    sparse: true,
    unique: true,
    trim: true
  },
  school: {
    type: String,
    trim: true
  },
  district: {
    type: String,
    trim: true
  },
  designation: {
    type: String,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true,
    match: [
      /^[6-9]\d{9}$/,
      'Please provide a valid Indian phone number'
    ]
  },
  dateOfJoining: {
    type: Date
  },
  membershipNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: String
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true, default: 'Telangana' },
    pincode: { 
      type: String, 
      trim: true,
      match: [/^[1-9][0-9]{5}$/, 'Please provide a valid pincode']
    }
  },
  emergencyContact: {
    name: { type: String, trim: true },
    relationship: { type: String, trim: true },
    phoneNumber: { 
      type: String, 
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid phone number']
    }
  }
}, {
  timestamps: true
});

// Index for search functionality
userSchema.index({ name: 'text', email: 'text', employeeId: 'text' });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Generate membership number before saving
userSchema.pre('save', async function(next) {
  if (!this.membershipNumber && this.role === 'member') {
    const currentYear = new Date().getFullYear();
    const lastMember = await mongoose.model('User').findOne(
      { membershipNumber: { $exists: true } },
      {},
      { sort: { membershipNumber: -1 } }
    );
    
    let nextNumber = 1;
    if (lastMember && lastMember.membershipNumber) {
      const lastNumber = parseInt(lastMember.membershipNumber.split('-')[2]);
      nextNumber = lastNumber + 1;
    }
    
    this.membershipNumber = `PRTU-${currentYear}-${nextNumber.toString().padStart(6, '0')}`;
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export default mongoose.model<UserDocument>('User', userSchema);
