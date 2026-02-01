const mongoose = require('mongoose');

// Use env from .env.local if needed, but since I'm running via node I'll just try to connect
const MONGODB_URI = "mongodb+srv://dinos:Vp4CshRstR48e3gR@cluster0.p7ghz.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0";

async function checkDreams() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        const Dream = mongoose.models.Dream || mongoose.model('Dream', new mongoose.Schema({}, { strict: false }));

        const completedDreams = await Dream.find({ status: 'completed' }).limit(5).lean();

        console.log(`Found ${completedDreams.length} completed dreams.`);

        completedDreams.forEach((dream, i) => {
            console.log(`\n--- Dream ${i + 1} ---`);
            console.log(`ID: ${dream._id}`);
            console.log(`Input: ${dream.input}`);
            console.log(`comicImageUrl exists: ${!!dream.comicImageUrl}`);
            if (dream.comicImageUrl) {
                console.log(`comicImageUrl start: ${dream.comicImageUrl.substring(0, 50)}...`);
            }
            console.log(`panels count: ${dream.panels ? dream.panels.length : 0}`);
            if (dream.panels && dream.panels.length > 0) {
                console.log(`First panel imageUrl exists: ${!!dream.panels[0].imageUrl}`);
            }
        });

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

checkDreams();
