export const uploadImageToImgBB = async (file: File): Promise<string> => {
  try {
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

    const response = await fetch(`https://api.imgbb.com/1/upload`, {
      method: 'POST',
      body: new URLSearchParams({
        key: '0abaff8639e8fd086a1f3b107d83eb15',
        image: base64Image,
      }),
    });

    const result = await response.json();
    if (result.success) {
      return result.data.url;
    } else {
      throw new Error('Failed to upload image');
    }
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
};