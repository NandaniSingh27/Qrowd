const { z } = require('zod');

const createRoomSchema = z.object({
    title: z.string().trim().min(3).max(100),
});

module.exports = { createRoomSchema };
