import { products, customer, subscriptions, specialCustomers, generateInserts } from '../../src/utils/dbHelper'
import { DBClient } from '../../src/db/client'
import uuid from 'uuid'

describe('helpers', () => {
  let dbSpy;
  const allProducts = [
    {
      id: '123',
      name: 'Classic Ad'
    },
    {
      id: '456',
      name: 'Stand out Ad'
    },
    {
      id: '789',
      name: 'Premium Ad'
    }
  ]
  const item = {
    retailer: 'some-retailer',
    'Classic Ad': 2,
    'Stand out Ad': 3,
    'Premium Ad': 1
  }
  const result = { 
    subscriptionEntries: [ 
      { id: '123',
        custId: '123',
        productId: '123',
        status: 'pending',
        quantity: 2 
      },
      { 
        id: '123',
        custId: '123',
        productId: '456',
        status: 'pending',
        quantity: 3 
      },
      { 
        id: '123',
        custId: '123',
        productId: '789',
        status: 'pending',
        quantity: 1 
      } 
    ],
   customerEntries: [ 
     { 
       id: '123', 
      name: 'some-retailer' 
      } 
    ] 
  }
  beforeEach(() => {
    dbSpy = jest.spyOn(DBClient.instance, 'query').mockResolvedValue({})
    jest.spyOn(uuid, 'v4').mockReturnValue('123')
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  it('Should return valid set of products ', async () => {
    const productList = await products()
    expect(dbSpy).toHaveBeenCalledWith('select * from products')
    expect(productList).toEqual({})
  })
  it('Should return valid set of customer ', async () => {
    const customerList = await customer('some-customer')
    expect(dbSpy).toHaveBeenCalledWith(`select * from customer where name ilike '%some-customer%'`)
    expect(customerList).toEqual({})
  })
  it('Should return all subscriptions ', async () => {
    const subscriptionList = await subscriptions('some-customer')
    expect(dbSpy).toHaveBeenCalledWith(`select p.name, SUM(s.quanity) as times from products p
  inner join subscription s on s."productId" = p.id inner join customer c on c.id = s."customerId"
  where c.name ilike '%some-customer%' and s.status='pending' group by p.name`)
    expect(subscriptionList).toEqual({})
  })
  it('Should return all special offers ', async () => {
    const subscriptionList = await specialCustomers('some-customer')
    expect(dbSpy).toHaveBeenCalledWith(`select o.type, o.price, o."upgradedNumber",
 o."originalNumber", p.name from offers o inner join "specialOffers" sp on sp."offerId" = o.id inner join products p
 on p.id = o."productId" inner join customer c on c.id = sp."customerId" where c.name ilike '%some-customer%'`)
    expect(subscriptionList).toEqual({})
  })
  it('Should generate valid inserts ', async () => {
    jest.spyOn(DBClient.instance, 'query').mockResolvedValue([])
    expect(await generateInserts(item, allProducts)).toEqual(result)
  })
})