export class MarkdownDocError extends Error {
  constructor(message) {
    super(message);
    this.message = message; // rm when native class support.
  }

  get name() {
    return 'MarkdownDocError';
  }
}

export class Warning extends MarkdownDocError {
  constructor(message) {
    super(message);
    this.message = message; // rm when native class support.
  }

  get name() {
    return 'Warning';
  }
}
