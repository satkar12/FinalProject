import { supabase } from "@/integrations/supabase/client";

export interface Resource {
    id: string;
    file_name: string;
    file_url: string;
    uploaded_by: string;
    uploaded_at: string;
    summary: string | null;
}

export const uploadResource = async (file: File): Promise<Resource> => {
    try {
        // ✅ Get current user
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            throw new Error("User must be authenticated to upload files");
        }

        // ✅ Unique file path inside user's folder
        const timestamp = new Date().getTime();
        const filePath = `${user.id}/${timestamp}_${file.name}`;

        // ✅ Upload to storage
        const { error: uploadError } = await supabase.storage
            .from("resources-bucket")
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: false,
            });

        if (uploadError) {
            throw new Error(`Upload failed: ${uploadError.message}`);
        }

        // ✅ Get public URL
        const { data: urlData } = supabase.storage
            .from("resources-bucket")
            .getPublicUrl(filePath);

        const publicUrl = urlData.publicUrl;

        // ✅ Insert metadata into resources table
        const { data, error: dbError } = await supabase
            .from("resources")
            .insert([
                {
                    file_name: file.name,
                    file_url: publicUrl,
                    uploaded_by: user.id, // 👈 must match auth.uid()
                    uploaded_at: new Date().toISOString(),
                },
            ])
            .select()
            .single();

        if (dbError) {
            // Rollback storage upload if DB insert fails
            await supabase.storage.from("resources-bucket").remove([filePath]);
            throw new Error(`Database error: ${dbError.message}`);
        }

        return data as Resource;
    } catch (error) {
        console.error("Upload resource error:", error);
        throw error;
    }
};

export const fetchResources = async (): Promise<Resource[]> => {
    try {
        const { data, error } = await supabase
            .from("resources")
            .select("*")
            .order("uploaded_at", { ascending: false });

        if (error) {
            throw new Error(`Fetch failed: ${error.message}`);
        }

        return (data as Resource[]) || [];
    } catch (error) {
        console.error("Fetch resources error:", error);
        throw error;
    }
};
export const createSignedUrl = async (fileUrl: string): Promise<string> => {
    try {
        // Extract the file path from the public URL
        const urlParts = fileUrl.split('/resources-bucket/');
        if (urlParts.length < 2) {
            throw new Error('Invalid file URL');
        }
        const filePath = urlParts[1];

        // Create a signed URL that expires in 5 minutes (300 seconds)
        const { data, error } = await supabase.storage
            .from('resources-bucket')
            .createSignedUrl(filePath, 300);

        if (error) {
            throw new Error(`Failed to create signed URL: ${error.message}`);
        }

        return data.signedUrl;
    } catch (error) {
        console.error('Create signed URL error:', error);
        throw error;
    }
};