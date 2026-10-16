const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validators/authValidator');
const { createRoomSchema } = require('../middleware/validators/roomValidator');
const {
  createRoom,
  getMyRooms,
  getRoomByCode,
  closeRoom,
} = require('../controllers/roomController');

router.post('/', protect, validate(createRoomSchema), createRoom);
router.get('/mine', protect, getMyRooms);
router.get('/:code', getRoomByCode);
router.patch('/:id/toggle', protect, closeRoom);

module.exports = router;