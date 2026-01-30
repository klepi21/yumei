const fs = require("fs");
const path = require("path");

// Load env vars manually
const envPath = path.resolve(process.cwd(), ".env.local");
let apiKey = "";

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    const match = envContent.match(/GOOGLE_GENERATIVE_AI_API_KEY=(.*)/);
    if (match && match[1]) {
        apiKey = match[1].trim().replace(/^["']|["']$/g, ''); // strip quotes
    }
}

async function listModels() {
    if (!apiKey) {
        console.error("❌ No GOOGLE_GENERATIVE_AI_API_KEY found in .env.local");
        return;
    }

    try {
        console.log("Checking models with key:", apiKey.substring(0, 5) + "...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.error) {
            console.error("❌ Error listing models:", data.error);
            return;
        }

        console.log("✅ Available Models:");
        if (data.models) {
            data.models.forEach(m => {
                if (m.name.includes('gemini')) {
                    console.log(`- ${m.name} (${m.displayName})`);
                }
            });
        } else {
            console.log("No models found in response", data);
        }

    } catch (error) {
        console.error("❌ Exception:", error);
    }
}

listModels();
