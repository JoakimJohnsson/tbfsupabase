import { supabase } from "./client";

export const IMAGES_BUCKET = "images";

export type ImageFolder = "records" | "artists" | "persons";

export const uploadImage = async (file: File, folder: ImageFolder, customFileName?: string): Promise<string> => {
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const baseName = customFileName
        ? customFileName.replace(/[^a-z0-9_-]/gi, "-").toLowerCase()
        : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const filePath = `${folder}/${baseName}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from(IMAGES_BUCKET).upload(filePath, file, {
        upsert: true,
    });

    if (uploadError) {
        throw uploadError;
    }

    const { data } = supabase.storage.from(IMAGES_BUCKET).getPublicUrl(filePath);

    return data.publicUrl;
};
