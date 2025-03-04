import express from 'express';
import { getDeals } from '../utils/deals.js';

const router = express.Router();

let deals = [];

router.get('/', async (req, res) => {
  deals = deals.length > 0 ? deals : await getDeals();
  res.json(deals);
});

export default router;
