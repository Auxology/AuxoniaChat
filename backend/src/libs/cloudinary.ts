import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload file to Cloudinary
export const uploadProfilePicture = async (file: Express.Multer.File): Promise<string> => {
  try {
    // Convert the buffer to base64
    const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: 'profile-pictures',
      transformation: [
        { width: 250, height: 250, crop: 'fill', gravity: 'face' }
      ]
    });
    
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};

export const deleteProfilePicture = async (avatarUrl: string): Promise<void> => {
  try {
      // Skip if there's no avatar URL
      if (!avatarUrl) return;
      
      // Extract the public ID from the Cloudinary URL
      // Example URL: https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/profile-pictures/abc123
      const urlParts = avatarUrl.split('/');
      const fileWithVersion = urlParts[urlParts.length - 2] + '/' + urlParts[urlParts.length - 1];
      const publicId = fileWithVersion.split('.')[0]; // Remove file extension if present
      
      // Delete from Cloudinary
      await cloudinary.uploader.destroy(publicId);
  } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      // Don't throw the error, just log it - this prevents profile picture updates from failing
      // if the deletion fails
  }
}

// Upload to server image to Cloudinary
export const uploadServerImage = async (file: Express.Multer.File): Promise<string> => {
  try {
    // Convert the buffer to base64
    const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: 'server-images',
      transformation: [
        { width: 800, height: 800, crop: 'fill' }
      ]
    });

    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};