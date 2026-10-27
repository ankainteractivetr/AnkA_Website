export class AppError extends Error
{
  constructor(message)
  {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends AppError
{}

export class NotFoundError extends AppError
{}

/** The request clashes with stored data, e.g. a project slug that is already taken. */
export class ConflictError extends AppError
{}

export class AuthenticationError extends AppError
{
  constructor(message = 'Invalid credentials.')
  {
    super(message);
  }
}

/**
 * A validation failure worded in both site languages (`text` is a LocalizedText), for the public form and the game APIs,
 * which answer in the visitor's language. `field` is the position of the invalid form field, when there is one.
 */
export class LocalizedValidationError extends ValidationError
{
  constructor(text, field = null)
  {
    super(text.en);
    this.text = text;
    this.field = field;
  }
}
