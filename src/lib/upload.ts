import { supabase } from "@/integrations/supabase/client";

export async function uploadDesignFile(userId: string, file: File) {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("designs").upload(path, file, { contentType: file.type });
  if (error) throw error;
  return { path, type: file.type === "application/pdf" ? "pdf" : "image" };
}

export const ACCEPT = "image/png,image/jpeg,image/webp,image/gif,application/pdf";
