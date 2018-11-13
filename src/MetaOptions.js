import changeCaseObject from 'change-case-object'

const BODY_KEY_CASE_OPTIONS = {
  SNAKE_CASE: changeCaseObject.snakeCase,
  CAMEL_CASE: changeCaseObject.camelCase,
  PARAM_CASE: changeCaseObject.paramCase
}

export default class MetaOptions {
  constructor(options) {
    if (!options.bodyKeyCase || !this.isValidBodyKeyCase(options.bodyKeyCase)) {
      throw new Error('This body key formatting option is not allowed.')
    }

    this.bodyKeyCase = options.bodyKeyCase
  }

  isValidBodyKeyCase(bodyKeyCase) {
    if (Object.keys(BODY_KEY_CASE_OPTIONS).indexOf(bodyKeyCase) < 0) {
      return false
    }
    return true
  }

  getBodyKeyConverter() {
    return BODY_KEY_CASE_OPTIONS[this.bodyKeyCase]
  }
}
