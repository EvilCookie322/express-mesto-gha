const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateCurrentUser,
  updateCurrentUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.post('/users', createUser);
router.patch('/users/me', updateCurrentUser);
router.patch('/users/me/avatar', updateCurrentUserAvatar);

module.exports = router;
