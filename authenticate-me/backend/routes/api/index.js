// backend/routes/api/index.js
const router = require('express').Router();

//To test the API router
router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
});

module.exports = router;
