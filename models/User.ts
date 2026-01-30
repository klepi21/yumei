import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
    },
    image: {
        type: String,
    },
    betaAccess: {
        type: Boolean,
        default: false,
    },
    isPro: {
        type: Boolean,
        default: false,
    },
    credits: {
        type: Number,
        default: 0
    },
    lastGenerationDate: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Force model recompilation in dev to pick up schema changes
if (process.env.NODE_ENV === 'development') {
    if (mongoose.models.User) {
        delete mongoose.models.User;
    }
}

export default mongoose.models.User || mongoose.model('User', UserSchema);
