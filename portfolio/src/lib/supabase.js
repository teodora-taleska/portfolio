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
  console.log("saveReactions called:", id, patch);

  const { data, error } = await supabase
    .from("reactions")
    .upsert(
      { id, type, likes: 0, dislikes: 0, clicks: 0, ...patch },
      { onConflict: "id" }
    )
    .select();

  if (error) {
    console.error("saveReactions error:", error.message, error);
  } else {
    console.log("saveReactions success:", data);
  }
}
