import multer, { memoryStorage } from 'multer';

// Configure multer to store files in memory
const storage = memoryStorage();

const upload = multer({ storage: storage });

export default upload;
