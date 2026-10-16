const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { publicLimiter } = require('../middleware/rateLimiter');
const { validate } = require('../middleware/validators/authValidator');
const { createQuestionSchema, voteSchema } = require('../middleware/validators/questionValidator');
const {
  submitQuestion,
  voteQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/questionController');

router.post('/room/:code', publicLimiter, validate(createQuestionSchema), submitQuestion);
router.post('/:id/vote', publicLimiter, validate(voteSchema), voteQuestion);
router.patch('/:id', protect, updateQuestion);
router.delete('/:id', protect, deleteQuestion);

module.exports = router;