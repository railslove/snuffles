import changeCaseObject from 'change-case-object'

const BODY_KEY_CASE_OPTIONS = {
  SNAKE_CASE: changeCaseObject.snakeCase,
  CAMEL_CASE: changeCaseObject.camelCase,
  PARAM_CASE: changeCaseObject.paramCase
}

export default class MetaOptions {
  constructor(options) {
    if (!this.isValidBodyKeyCase(options.bodyKeyCase)) {
      throw new Error('This body key formatting option is not allowed.')
    }
    this.bodyKeyCase = options.bodyKeyCase

    if (!this.isValidLogger(options.logger)) {
      throw new Error('The provided logger is not a function.')
    }
    this.logger = options.logger
  }

  isValidBodyKeyCase(bodyKeyCase) {
    return bodyKeyCase && Object.keys(BODY_KEY_CASE_OPTIONS).includes(bodyKeyCase)
  }

  isValidLogger(logger) {
    return typeof logger === 'function'
  }

  getBodyKeyConverter() {
    return BODY_KEY_CASE_OPTIONS[this.bodyKeyCase]
  }
}
