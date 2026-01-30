import mongoose from 'mongoose';

const DreamPanelSchema = new mongoose.Schema({
    id: String,
    sceneDescription: String,
    emotion: String,
    imageUrl: String, // Will store Base64 data URI for now
    prompt: String,
});

const DreamSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true,
    },
    input: {
        type: String,
        required: true,
    },
    interpretedNarrative: String,
    style: {
        type: String,
        required: true,
    },
    panels: [DreamPanelSchema], // Legacy support for old format
    comicImageUrl: String, // Single image with all panels
    sanitizedDream: String, // The safe version of the text if modified
    panelCount: Number, // Number of panels in the comic (3-6)
    imagePrompt: String, // The prompt used to generate the comic
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Dream || mongoose.model('Dream', DreamSchema);
