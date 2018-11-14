import MetaOptions from '../MetaOptions'

describe('MetaOptions', () => {
  describe('Initialisation', () => {
    it('is valid with a valida options object', () => {
      const options = { bodyKeyCase: 'SNAKE_CASE', logger: () => {} }
      const metaOptions = new MetaOptions(options)
      expect(metaOptions).toBeTruthy()
    })

    it('throws an error if no options are passed', () => {
      expect(() => new MetaOptions()).toThrow()
    })

    it('throws an error if bodyKeyCase is not present in the options', () => {
      expect(() => new MetaOptions({})).toThrow()
    })

    it('throws an error if bodyKeyCase is not valid', () => {
      const options = { bodyKeyCase: 'INVALID' }
      expect(() => new MetaOptions(options)).toThrow()
    })

    it('throws an error if logger is not valid', () => {
      const options = { bodyKeyCase: 'INVALID', logger: 'iamnotalogger' }
      expect(() => new MetaOptions(options)).toThrow()
    })
  })
})
