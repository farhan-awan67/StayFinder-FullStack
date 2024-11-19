class expressError extends Error {
  constructor(status, message) {
    super(message); // Pass the message to the parent Error class
    this.status = status; // Set the status
    this.name = this.constructor.name; // Set the error name to the class name (expressError)
    Error.captureStackTrace(this, this.constructor); // Capture the stack trace, excluding this constructor
  }
}

module.exports = expressError;
