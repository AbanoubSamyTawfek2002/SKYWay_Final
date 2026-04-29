import express from 'express';
import { getJournals, getJournalById, createJournal } from '../controllers/journalController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getJournals);
router.get('/:id', getJournalById);
router.post('/', protect, admin, createJournal); // Only admins can create via API generally, but keeping simple for now

export default router;
