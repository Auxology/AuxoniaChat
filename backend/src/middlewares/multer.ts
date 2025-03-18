import multer from 'multer';

// Store files in memory
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
  // Accept only images
  if (file.mimetype.startsWith('image/')) {
    callback(null, true);
  } else {
    throw ('Please upload an image');
  }
};

// Upload middleware
export const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});