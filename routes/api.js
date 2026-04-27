const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

router.post('/workflow/start', contentController.startWorkflow);
router.post('/generate/script', contentController.generateScript);
router.post('/generate/video', contentController.generateVideoPlaceholder);
router.post('/generate/thumbnail', contentController.generateThumbnail);
router.post('/generate/metadata', contentController.generateMetadata);
router.post('/upload/youtube', contentController.uploadYoutubePlaceholder);

module.exports = router;
