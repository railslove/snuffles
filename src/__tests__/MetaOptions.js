import MetaOptions from '../MetaOptions'

describe('MetaOptions', () => {
  describe('Initialisation', () => {
    it('is valid with a valida options object', () => {
      const options = { bodyKeyCase: 'SNAKE_CASE' }
      const metaOptions = new MetaOptions(options)
      expect(metaOptions).toBeTruthy()
    })

    it('throws an error if bodyKeyCase is not valid', () => {
      const options = { bodyKeyCase: 'INVALID' }
      expect(() => new MetaOptions(options)).toThrow()
    })
  })
})
