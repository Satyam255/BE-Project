import multer from "multer";

/**
 * Multer storage configuration
 * Defines where and how files will be stored on the server
 */
const storage = multer.diskStorage({
    
    // Destination folder for uploads
    destination: (req, file, cb) => {
        // All uploaded files will be stored inside the "uploads" folder
        cb(null, "uploads/");
    },

    // File naming strategy
    filename: (req, file, cb) => {
        // Using original file name (not recommended for production due to collisions)
        // Better approach: `${Date.now()}-${file.originalname}`
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

/**
 * File filter
 * Controls which file types are allowed to be uploaded
 */
const fileFilter = (req, file, cb) => {
    
    // Allowed MIME types
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/pdf'
    ];

    // Check if uploaded file type is allowed
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept file
    } else {
        // Reject file with custom error message
        cb(
            new Error("Only .jpeg, .jpg, .png and .pdf formats are supported."),
            false
        );
    }
};

/**
 * Multer instance
 * Combines storage + file filter
 * This middleware is used in routes for handling file uploads
 */
const upload = multer({ storage, fileFilter });

export default upload;
