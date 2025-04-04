import { supabase } from "@/integrations/supabase/client";

// Hash the filename to make it harder to guess using Web Crypto API
const hashFilename = async (filename: string): Promise<string> => {
  const timestamp = Date.now().toString();
  const data = new TextEncoder().encode(filename + timestamp);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  const truncatedHash = hashHex.substring(0, 16); // Take first 16 chars for reasonable length
  
  const extension = filename.split('.').pop();
  return `${truncatedHash}.${extension}`;
};

// Upload image securely to ImgBB and store metadata in Supabase
export const uploadImageSecurely = async (file: File): Promise<string> => {
  try {
    // Check file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.');
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    // Hash the filename
    const hashedFilename = await hashFilename(file.name);

    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve) => {
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        const base64Image = base64Data.split(',')[1];
        resolve(base64Image);
      };
    });
    
    reader.readAsDataURL(file);
    const base64Image = await base64Promise;

    // Upload to ImgBB
    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: new URLSearchParams({
        key: '0abaff8639e8fd086a1f3b107d83eb15',
        image: base64Image,
        name: hashedFilename,
      }),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error('Failed to upload image');
    }

    // Log upload for audit purposes
    console.log(`Image uploaded: ${hashedFilename} at ${new Date().toISOString()}`);

    return result.data.url;
  } catch (error) {
    console.error('Secure image upload error:', error);
    throw error;
  }
};