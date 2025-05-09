const express = require('express');
const router = express.Router();
const axios = require('axios');

// POST /api/v1/semantic-search
router.post('/semantic-search', async (req, res) => {
  try {
    const { queryText } = req.body;
    const response = await axios.post('http://localhost:5000/search', { queryText });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Semantic search failed', details: err.message });
  }
});

module.exports = router;