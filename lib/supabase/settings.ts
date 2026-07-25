import { cache } from "react";
import { createClient } from "./server";

const DEFAULT_TOP_UNITS_LABEL = "Top phòng";

export const getTopUnitsLabel = cache(async (): Promise<string> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", "top_units_label")
    .single();

  return data?.value || DEFAULT_TOP_UNITS_LABEL;
});
