import userValidationSchema from "../validationSchemas/userValidationSchema.js";

export function registerUserValidation(req, res, next) {
  const { body } = req.body;

  const { error } = userValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessage = error.details.reduce(
      (acc, curr) => `${acc}, ${curr.message}`,
      ""
    );

    return res.status(400).json({ error: errorMessage });
  }

  next();
}
