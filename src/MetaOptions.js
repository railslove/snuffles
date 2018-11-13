import changeCaseObject from 'change-case-object'

const BODY_KEY_CASE_OPTIONS = {
  SNAKE_CASE: changeCaseObject.snakeCase,
  CAMEL_CASE: changeCaseObject.camelCase,
  PARAM_CASE: changeCaseObject.paramCase
}

export default class MetaOptions {
  constructor(options) {
    if (options.bodyKeyCase && !this.isValidBodyKeyCase(options.bodyKeyCase)) {
      throw new Error('This body key formatting option is not allowed.')
    }

    this.bodyKeyCase = options.bodyKeyCase
    if (typeof options.logger === 'function') {
      this.logger = options.logger
    } else {
      this.logger = () => {} // noop logger
    }
  }

  isValidBodyKeyCase(bodyKeyCase) {
    return Object.keys(BODY_KEY_CASE_OPTIONS).includes(bodyKeyCase)
  }

  getBodyKeyConverter() {
    return BODY_KEY_CASE_OPTIONS[this.bodyKeyCase]
  }
}
