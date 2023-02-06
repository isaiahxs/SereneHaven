//In this file, create an Express router, create a test route, and export the router at the bottom of the file.

// backend/routes/index.js
const express = require('express');
const router = express.Router();

//This is the first test we used to see if our set up was functioning properly:
// router.get('/hello/world', function(req, res) {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   res.send('Hello World!');
// });

//Add a route, GET /api/csrf/restore to allow any developer to re-set the CSRF token cookie XSRF-TOKEN.
    // In this route, you are setting a cookie on the response with the name of XSRF-TOKEN to the value of the req.csrfToken method's return. Then, send the token as the response for easy retrieval.
router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
      'XSRF-Token': csrfToken
    });
  });

module.exports = router;

//In this test route, you are setting a cookie on the response with the name of XSRF-TOKEN to the value of the req.csrfToken method's return. Then, you are sending the text, Hello World! as the response's body.
