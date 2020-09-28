import { Checkout } from '../../src/core/checkout'
import { DBClient } from '../../src/db/client'
import * as helpers from '../../src/utils/dbHelper'
import * as mock from '../mock.data'

describe('Checkout ', () => {
  let checkout = new Checkout()
  const item = {
    retailer: 'some-retailer',
    'Classic Ad': 1,
    'Stand out Ad': 2,
    'Premium Ad': 3
  }
  let dbSpy
  beforeEach(() => {
    dbSpy = jest.spyOn(DBClient.instance, 'bulkInsert').mockResolvedValue()
    jest.spyOn(helpers, 'products').mockResolvedValue(mock.products)
    jest.spyOn(helpers, 'generateInserts').mockResolvedValue({
      subscriptionEntries: mock.subscriptionEntries,
      customerEntries: mock.customerEntries
    })
    jest.spyOn(helpers, 'subscriptions').mockResolvedValue(mock.subscriptions)
    jest.spyOn(helpers, 'specialCustomers').mockResolvedValue([])
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  it('Should add items properly', async () => {
    const result = await checkout.add(item)
    const expectedResult = 'Classic Ad,Classic Ad,Stand out Ad,Stand out Ad,Stand out Ad,Premium Ad,Premium Ad'
    expect(dbSpy).toHaveBeenCalledWith([...mock.customerEntries, ...mock.subscriptionEntries])
    expect(result).toEqual(expectedResult)
  })
  it('Should error out during failure scenario with log', async () => {
    dbSpy = jest.spyOn(DBClient.instance, 'bulkInsert').mockRejectedValue('error in DB')
    jest.spyOn(console, 'log').mockImplementation(() => {})
    await expect(checkout.add(item)).rejects.toThrow('error in DB')
    expect(console.log).toHaveBeenCalledWith('Error during insertion ', 'error in DB')
  })
  it('Should provide correct totals ', async () => {
    const expectedResult = { 
      totalPrice: 75.93,
      addedItems: 'Classic Ad,Classic Ad,Stand out Ad,Stand out Ad,Stand out Ad,Premium Ad,Premium Ad',
      customer: 'some-retailer' 
    }
    await checkout.add(item)
    expect(checkout.total()).toEqual(expectedResult)
  })
  it('Should add items  and total properly for special customers', async () => {
    jest.spyOn(helpers, 'specialCustomers').mockResolvedValue(mock.specialOffers)

    const result = await checkout.add(item)
    const expectedResult = 'Classic Ad,Classic Ad,Stand out Ad,Stand out Ad,Stand out Ad,Premium Ad,Premium Ad,Premium Ad'
    expect(dbSpy).toHaveBeenCalledWith([...mock.customerEntries, ...mock.subscriptionEntries])
    expect(result).toEqual(expectedResult)
    expect(checkout.total().totalPrice).toEqual(295.93)
  })
})