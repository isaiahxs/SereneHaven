//In this file, create an Express router, create a test route, and export the router at the bottom of the file.

// backend/routes/index.js
const express = require('express');
const router = express.Router();

//Following two lines are from Phase 1: API Routes
const apiRouter = require('./api');
router.use('/api', apiRouter);

//The following is from Phase 0 setup of frontend connection
//---------------------------------------------------------------------------------------------
// Static routes
// Serve React build files in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  // Serve the frontend's index.html file at the root route
  router.get('/', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    return res.sendFile(
      path.resolve(__dirname, '../../frontend', 'build', 'index.html')
    );
  });

  // Serve the static assets in the frontend's build folder
  router.use(express.static(path.resolve("../frontend/build")));

  // Serve the frontend's index.html file at all other routes NOT starting with /api
  router.get(/^(?!\/?api).*/, (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    return res.sendFile(
      path.resolve(__dirname, '../../frontend', 'build', 'index.html')
    );
  });
}

// Add a XSRF-TOKEN cookie in development
if (process.env.NODE_ENV !== 'production') {
  router.get('/api/csrf/restore', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    return res.json({});
  });
}
//---------------------------------------------------------------------------------------------

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
