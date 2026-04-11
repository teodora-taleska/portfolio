import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export async function getReactions(id) {
  const { data, error } = await supabase
    .from("reactions")
    .select("likes, dislikes, clicks")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error(`getReactions(${id}) error:`, error.message);
  }

  return data ?? { likes: 0, dislikes: 0, clicks: 0 };
}

export async function saveReactions(id, type, patch) {
  // Try updating the existing row first (only touches patch fields)
  const { data: updated, error: updateError } = await supabase
    .from("reactions")
    .update(patch)
    .eq("id", id)
    .select();

  if (updateError) {
    console.error("saveReactions update error:", updateError.message);
    return;
  }

  // No existing row — insert with safe defaults
  if (!updated || updated.length === 0) {
    const { error: insertError } = await supabase
      .from("reactions")
      .insert({ id, type, likes: 0, dislikes: 0, clicks: 0, ...patch });

    if (insertError) {
      console.error("saveReactions insert error:", insertError.message);
    }
  }
}
