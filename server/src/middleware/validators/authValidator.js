const {z} = require('zod');

const registerSchema = z.object({
    name: z.string().trim().min(2).max(50),
    email: z.string().trim().email().toLowerCase(),
    password: z.string().min(8).max(100),
});

const loginSchema = z.object({
    email: z.string().trim().email().toLowerCase(),
    password: z.string().min(1),
});

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: 'Invalid input',
      errors: result.error.issues.map((i) => i.message),
    });
  }
  req.body = result.data; // sanitized, trimmed data replaces raw input
  next();
};

module.exports = { registerSchema, loginSchema, validate };
  