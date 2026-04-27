import { Hono } from 'hono';
import * as contentController from '../controllers/contentController.js';

const router = new Hono();

router.post('/workflow/start', contentController.startWorkflow);
router.post('/generate/script', contentController.generateScript);
router.post('/generate/video', contentController.generateVideoPlaceholder);
router.post('/generate/thumbnail', contentController.generateThumbnail);
router.post('/generate/metadata', contentController.generateMetadata);
router.post('/upload/youtube', contentController.uploadYoutubePlaceholder);

export default router;
