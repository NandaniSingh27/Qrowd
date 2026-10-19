const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { roomCreateLimiter } = require('../middleware/rateLimiter');
const { validate } = require('../middleware/validators/authValidator');
const { createRoomSchema } = require('../middleware/validators/roomValidator');
const {
  createRoom,
  getMyRooms,
  getRoomByCode,
  closeRoom,
  deleteRoom,
} = require('../controllers/roomController');

router.post('/', protect, roomCreateLimiter, validate(createRoomSchema), createRoom);
router.get('/mine', protect, getMyRooms);
router.get('/:code', getRoomByCode);
router.patch('/:id/toggle', protect, closeRoom);
router.delete('/:id', protect, deleteRoom);

module.exports = router;