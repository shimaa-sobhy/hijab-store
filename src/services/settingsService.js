import { supabase } from '../supabase/supabaseClient.js';

export async function getSettings() {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateSettings(updates) {
  const { data, error } = await supabase
    .from('settings')
    .update({
      brand_name: updates.brand_name,
      logo_url: updates.logo_url,
      whatsapp: updates.whatsapp,
      instagram: updates.instagram,
    })
    .eq('id', 1)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}