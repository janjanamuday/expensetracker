import express from 'express';
import { addTransaction, deleteTransaction, getTransactions } from '../controllers/tcontroller.js';


const router = express.Router();

router.get('/', getTransactions);
router.post('/', addTransaction);
router.delete('/:id', deleteTransaction);

export default router;