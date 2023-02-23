// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
//NEED TO ADD THIS TOO
const spotsRouter = require('./spots.js')
const reviewsRouter = require ('./reviews.js')
const bookingsRouter = require ('./bookings.js')
const {restoreUser} = require('../../utils/auth')

// GET /api/restore-user
router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

//now working on kanban objectives
router.use('/spots', spotsRouter);

router.use('/reviews', reviewsRouter);

router.use('/bookings', bookingsRouter);

//this line is from First Steps after authme (get all spots)
// router.use('/spots', spotsRouter);
  //for our spot related route handlers and we would have a spots.js in our api


router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});




module.exports = router;

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
