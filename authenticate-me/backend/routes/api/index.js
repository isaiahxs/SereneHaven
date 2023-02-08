// backend/routes/api/index.js
const router = require('express').Router();
const {restoreUser} = require('../../utils/auth')

// GET /api/restore-user
router.use(restoreUser);

//The tests below are no longer needed as they all work
// router.get(
//   '/restore-user',
//   (req, res) => {
//     return res.json(req.user);
//   }
// );

// //To test the API router
// router.post('/test', function(req, res) {
//     res.json({ requestBody: req.body });
// });

// // GET /api/require-auth
// const { requireAuth } = require('../../utils/auth.js');
// router.get(
//   '/require-auth',
//   requireAuth,
//   (req, res) => {
//     return res.json(req.user);
//   }
// );

// // GET /api/set-token-cookie
// const { setTokenCookie } = require('../../utils/auth.js');
// const { User } = require('../../db/models');
// router.get('/set-token-cookie', async (_req, res) => {
//   const user = await User.findOne({
//       where: {
//         username: 'Demo-lition'
//       }
//     });
//   setTokenCookie(res, user);
//   return res.json({ user });
// });

module.exports = router;
