import { AppConfig } from '../../src/config/AppConfig'

describe('AppConfig ', () => {
  let originalEnv: any
  const env = {
    DB_NAME: 'some-name',
    DB_HOST: 'some-host',
    DB_PASSWORD: 'some-password',
    DB_PORT: '5432',
    DB_USERNAME: 'some-user'
  }
  beforeEach(() => {
    originalEnv = process.env
    process.env = env
  })

  afterEach(() => {
    process.env = originalEnv
  })
  it('Should return correct config ', () => {
    const config = new AppConfig()
    expect(config).toHaveProperty('db', {
      database: 'some-name',
      host: 'some-host',
      password: 'some-password',
      port: 5432,
      user: 'some-user'
    })
  })
})