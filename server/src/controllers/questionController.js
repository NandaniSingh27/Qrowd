const Question = require('../models/Question');
const Room = require('../models/Room');
const Vote = require('../models/Vote');

const submitQuestion = async (req, res) => {
  try {
    const room = await Room.findOne({ code: req.params.code });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    if (!room.isOpen) {
      return res.status(403).json({ message: 'This room is closed' });
    }

    const { text } = req.body;
    const question = await Question.create({ room: room._id, text });

    res.status(201).json(question);
  } catch (err) {
    console.error('Submit question error:', err.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const voteQuestion = async (req, res) => {
  try {
    const { voterId } = req.body;
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const existingVote = await Vote.findOne({ question: question._id, voterId });

    if (existingVote) {
      // Toggle: remove the vote
      await existingVote.deleteOne();
      question.voteCount = Math.max(0, question.voteCount - 1);
    } else {
      await Vote.create({ question: question._id, voterId });
      question.voteCount += 1;
    }

    await question.save();
    res.json(question);
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error from the unique index — race condition safety net
      return res.status(409).json({ message: 'Vote already recorded' });
    }
    console.error('Vote error:', err.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('room');
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Ownership check via the parent room's host
    if (question.room.host.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const allowedFields = ['isAnswered', 'isPinned', 'isHidden'];
    for (const field of allowedFields) {
      if (field in req.body) {
        question[field] = Boolean(req.body[field]);
      }
    }

    await question.save();
    res.json(question);
  } catch (err) {
    console.error('Update question error:', err.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('room');
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.room.host.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await question.deleteOne();
    res.json({ message: 'Question deleted' });
  } catch (err) {
    console.error('Delete question error:', err.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = { submitQuestion, voteQuestion, updateQuestion, deleteQuestion };