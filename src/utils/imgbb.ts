import { supabase } from "@/integrations/supabase/client";

interface ImgBBResponse {
  data: {
    url: string;
    delete_url: string;
  };
  success: boolean;
  status: number;
}

export const uploadToImgBB = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  const { data: settings } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'imgbb_api_key')
    .single();

  if (!settings) {
    throw new Error('ImgBB API key not found');
  }

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${settings.value}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  const result: ImgBBResponse = await response.json();
  
  if (!result.success) {
    throw new Error('Failed to upload image');
  }

  return result.data.url;
};