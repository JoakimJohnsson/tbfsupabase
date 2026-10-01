import { supabase } from "./client";

export const IMAGES_BUCKET = "images";

export type ImageFolder = "records" | "artists" | "persons";

export const uploadImage = async (file: File, folder: ImageFolder, customFileName?: string): Promise<string> => {
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const baseName = customFileName
        ? customFileName.replace(/[^a-z0-9_-]/gi, "-").toLowerCase()
        : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const timestamp = Date.now();
    const filePath = `${folder}/${baseName}-${timestamp}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from(IMAGES_BUCKET).upload(filePath, file, {
        upsert: true,
    });

    if (uploadError) {
        throw uploadError;
    }

    const { data } = supabase.storage.from(IMAGES_BUCKET).getPublicUrl(filePath);

    return data.publicUrl;
};

export const deleteImageFromStorage = async (imageUrl?: string | null): Promise<void> => {
    if (!imageUrl) {
        return;
    }

    let filePath = imageUrl;

    try {
        const parsedUrl = new URL(imageUrl);
        const storageMatch = parsedUrl.pathname.match(/\/storage\/v1\/object\/public\/images\/(.+)$/);

        if (storageMatch?.[1]) {
            filePath = decodeURIComponent(storageMatch[1]);
        }
    } catch {
        // A raw storage path is also valid.
    }

    const normalizedPath = filePath
        .replace(/^\/+/, "")
        .replace(/^images\//, "")
        .trim();

    if (!normalizedPath) {
        return;
    }

    const { error } = await supabase.storage.from(IMAGES_BUCKET).remove([normalizedPath]);

    if (error) {
        throw error;
    }
};
