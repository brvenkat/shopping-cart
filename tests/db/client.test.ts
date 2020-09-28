import { DBClient } from '../../src/db/client'
import * as mock from '../mock.data'

const mockQuery = jest.fn().mockResolvedValue({
  rows: ['some-data']
})

const mockRelease = jest.fn()

jest.mock('../../src/config/appConfig', () => ({
  AppConfig:  jest.fn().mockImplementation(() => ({
    db: {
      database: 'some-db',
      host: 'some-db-host',
      password: 'some-password',
      port: 10,
      user: 'some-user'
    }
  }))
}))

jest.mock('pg', () => ({
  Pool: jest.fn().mockImplementation(() => ({
    connect: jest.fn().mockResolvedValue({
      query: mockQuery,
      release: mockRelease
    })
  }))
}))

describe('DBClient ', () => {
  it('Should create the same Object', () => {
    const firstClient = DBClient.instance
    const secondClient = DBClient.instance
    expect(firstClient).toBe(secondClient)
  })

  it('Should call bulk insert with proper data ', async () => {
    await DBClient.instance.bulkInsert(mock.allEntries)
    expect(mockQuery).toHaveBeenCalledWith('BEGIN')
    expect(mockQuery).toHaveBeenCalledWith(`INSERT INTO SUBSCRIPTION(id, "customerId", "productId", "status", "quanity", "timeCreated") VALUES
          ($1, $2, $3, $4, $5, current_timestamp)`, ["some-id", "12345", "123", "pending", 2])
    expect(mockQuery).toHaveBeenCalledWith(`INSERT INTO SUBSCRIPTION(id, "customerId", "productId", "status", "quanity", "timeCreated") VALUES
          ($1, $2, $3, $4, $5, current_timestamp)`, ["some-id", "12345", "456", "pending", 2])
    expect(mockQuery).toHaveBeenCalledWith(`INSERT INTO customer(id, name) VALUES ($1, $2)`, ["12345", "some-customer-name"])
    expect(mockQuery).toHaveBeenCalledWith('COMMIT')
    expect(mockRelease).toHaveBeenCalledWith()
  })

  it('Should query with proper data ', async () => {
    const result = await DBClient.instance.query('select * from some-table')
    expect(mockQuery).toHaveBeenCalledWith('select * from some-table')
    expect(result).toEqual(['some-data'])
    expect(mockRelease).toHaveBeenCalledWith()
  })
})
