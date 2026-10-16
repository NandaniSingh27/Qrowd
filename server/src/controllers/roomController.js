const { nanoid } = require('nanoid');
const Room = require('../models/Room');
const Question = require('../models/Question');

const createRoom = async (req, res) => {
  try {
    const { title } = req.body;
    const code = nanoid(8);

    const room = await Room.create({ title, code, host: req.userId });

    res.status(201).json(room);
  } catch (err) {
    console.error('Create room error:', err.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getMyRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ host: req.userId }).sort({ createdAt: -1 });
    res.json(rooms);
  } catch (err) {
    console.error('Get rooms error:', err.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getRoomByCode = async (req, res) => {
  try {
    const room = await Room.findOne({ code: req.params.code });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const questions = await Question.find({ room: room._id, isHidden: false })
      .sort({ isPinned: -1, voteCount: -1, createdAt: -1 });

    res.json({ room, questions });
  } catch (err) {
    console.error('Get room error:', err.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const closeRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.host.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    room.isOpen = !room.isOpen;
    await room.save();

    res.json(room);
  } catch (err) {
    console.error('Close room error:', err.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = { createRoom, getMyRooms, getRoomByCode, closeRoom };