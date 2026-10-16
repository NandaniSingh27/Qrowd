const { z } = require('zod')

const createQuestionSchema = z.object({
    text: z.string().trim().min(3).max(300),
});

const voteSchema = z.object({
    voterId: z.string().trim().min(10).max(100),
});

module.exports = { createQuestionSchema, voteSchema };