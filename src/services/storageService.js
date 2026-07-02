import { supabase } from '../supabase/supabaseClient.js';
import { PRODUCT_IMAGES_BUCKET } from '../utils/constants.js';

export async function uploadProductImage(file, productId) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${productId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(fileName, file, { cacheControl: '3600', upsert: false });

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicUrlData } = supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .getPublicUrl(fileName);

  return { path: fileName, url: publicUrlData.publicUrl };
}

export async function saveProductImageRecord(productId, { path, url }, sortOrder = 0) {
  const { data, error } = await supabase
    .from('product_images')
    .insert({
      product_id: productId,
      image_url: url,
      image_path: path,
      sort_order: sortOrder,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteProductImage(imageId, imagePath) {
  const { error: storageError } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .remove([imagePath]);

  if (storageError) throw new Error(storageError.message);

  const { error: dbError } = await supabase
    .from('product_images')
    .delete()
    .eq('id', imageId);

  if (dbError) throw new Error(dbError.message);
}

export async function uploadLogo(file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `branding/logo-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(fileName, file, { cacheControl: '3600', upsert: true });

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicUrlData } = supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}