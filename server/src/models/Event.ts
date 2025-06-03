import mongoose, { Document, Schema } from 'mongoose';

export interface EventDocument extends Document {
  _id: string;
  title: string;
  description: string;
  eventType: 'meeting' | 'conference' | 'workshop' | 'seminar' | 'protest' | 'celebration' | 'training' | 'other';
  venue: {
    name: string;
    address: string;
    city: string;
    district: string;
    state: string;
    pincode?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  startDateTime: Date;
  endDateTime: Date;
  organizer: mongoose.Types.ObjectId;
  speakers?: {
    name: string;
    designation: string;
    organization: string;
    bio?: string;
    image?: string;
  }[];
  agenda?: {
    time: string;
    topic: string;
    speaker?: string;
    duration: number; // in minutes
  }[];
  registrationRequired: boolean;
  maxAttendees?: number;
  registeredAttendees: mongoose.Types.ObjectId[];
  registrationDeadline?: Date;
  registrationFee?: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'postponed';
  category: string[];
  featuredImage?: string;
  attachments?: {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    url: string;
  }[];
  isPublic: boolean;
  requirements?: string[];
  contactPerson: {
    name: string;
    phone: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<EventDocument>({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required']
  },
  eventType: {
    type: String,
    enum: ['meeting', 'conference', 'workshop', 'seminar', 'protest', 'celebration', 'training', 'other'],
    required: true
  },
  venue: {
    name: {
      type: String,
      required: [true, 'Venue name is required'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Venue address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true
    },
    state: {
      type: String,
      trim: true,
      default: 'Telangana'
    },
    pincode: {
      type: String,
      trim: true,
      match: [/^[1-9][0-9]{5}$/, 'Please provide a valid pincode']
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  startDateTime: {
    type: Date,
    required: [true, 'Start date and time is required']
  },
  endDateTime: {
    type: Date,
    required: [true, 'End date and time is required']
  },
  organizer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  speakers: [{
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    bio: { type: String, trim: true },
    image: { type: String }
  }],
  agenda: [{
    time: { type: String, required: true },
    topic: { type: String, required: true, trim: true },
    speaker: { type: String, trim: true },
    duration: { type: Number, required: true, min: 1 }
  }],
  registrationRequired: {
    type: Boolean,
    default: false
  },
  maxAttendees: {
    type: Number,
    min: 1
  },
  registeredAttendees: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  registrationDeadline: {
    type: Date
  },
  registrationFee: {
    type: Number,
    min: 0,
    default: 0
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled', 'postponed'],
    default: 'upcoming'
  },
  category: [{
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
  isPublic: {
    type: Boolean,
    default: true
  },
  requirements: [{
    type: String,
    trim: true
  }],
  contactPerson: {
    name: {
      type: String,
      required: [true, 'Contact person name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Contact person phone is required'],
      match: [/^[6-9]\d{9}$/, 'Please provide a valid phone number']
    },
    email: {
      type: String,
      required: [true, 'Contact person email is required'],
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email']
    }
  }
}, {
  timestamps: true
});

// Validation for end date after start date
eventSchema.pre('save', function(next) {
  if (this.endDateTime <= this.startDateTime) {
    next(new Error('End date and time must be after start date and time'));
  } else {
    next();
  }
});

// Auto-update status based on dates
eventSchema.pre('save', function(next) {
  const now = new Date();
  
  if (this.status === 'upcoming') {
    if (now >= this.startDateTime && now <= this.endDateTime) {
      this.status = 'ongoing';
    } else if (now > this.endDateTime) {
      this.status = 'completed';
    }
  }
  
  next();
});

// Index for search and sorting
eventSchema.index({ title: 'text', description: 'text' });
eventSchema.index({ startDateTime: 1, status: 1 });
eventSchema.index({ eventType: 1, status: 1 });
eventSchema.index({ 'venue.district': 1, status: 1 });

// Virtual for attendee count
eventSchema.virtual('attendeeCount').get(function() {
  return this.registeredAttendees.length;
});

// Virtual for availability
eventSchema.virtual('spotsAvailable').get(function() {
  if (!this.maxAttendees) return null;
  return this.maxAttendees - this.registeredAttendees.length;
});

// Ensure virtual fields are serialized
eventSchema.set('toJSON', { virtuals: true });

export default mongoose.model<EventDocument>('Event', eventSchema);
