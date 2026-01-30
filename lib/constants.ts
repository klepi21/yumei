export const COMIC_STYLES = [
    {
        id: "anime",
        name: "Anime/Manga",
        // Merging the user's "Manga" prompt into the existing "Anime" one or keeping as separate?
        // User asked to "add those comic styles also", implying addition to existing ones.
        // Existing default was "anime".
        // I will include "anime" as the default one matching existing behavior, and add others.
        // Actually, user provided "manga" in the list. I'll use their list and maybe keep "anime" as an alias or merge.
        // Let's stick to the user's provided list + "anime" if it's distinct, or just map "anime" to "manga" if close.
        // Given the prompt "Anime/manga style" in previous code, "Manga" fits well. 
        // I will add the user's list, plus "anime" to avoid breaking existing "style: 'anime'" if it exists in DB.
        prompt: "high quality anime style, vibrant colors, detailed backgrounds, expressive characters, studio ghibli inspired",
    },
    {
        id: "american-modern",
        name: "American Modern",
        prompt: "contemporary American superhero comic style, bold vibrant colors, dynamic heroic poses, detailed muscular anatomy, cinematic action scenes, modern digital art",
    },
    {
        id: "manga",
        name: "Manga (B&W)",
        prompt: "Japanese manga style, clean precise black linework, screen tone shading, expressive eyes, dynamic speed lines, black and white with impact effects",
    },
    {
        id: "noir",
        name: "Noir",
        prompt: "film noir style, high contrast black and white, deep dramatic shadows, 1940s detective aesthetic, heavy bold inking, moody atmospheric lighting",
    },
    {
        id: "vintage",
        name: "Vintage",
        prompt: "Golden Age 1950s comic style, visible halftone Ben-Day dots, limited retro color palette, nostalgic warm tones, classic adventure comics",
    },
] as const;

export type ComicStyleId = typeof COMIC_STYLES[number]['id'];
