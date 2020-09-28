import { DBClient } from '../db/client'
import uuid from 'uuid'

export const products = async () => DBClient.instance.query('select * from products')

export const customer = async (name) => DBClient.instance.query(`select * from customer where name ilike '%${name}%'`)

export const subscriptions = async(name) => DBClient.instance.query(`select p.name, SUM(s.quanity) as times from products p
  inner join subscription s on s."productId" = p.id inner join customer c on c.id = s."customerId"
  where c.name ilike '%${name}%' and s.status='pending' group by p.name`)

export const specialCustomers = async (name) => DBClient.instance.query(`select o.type, o.price, o."upgradedNumber",
 o."originalNumber", p.name from offers o inner join "specialOffers" sp on sp."offerId" = o.id inner join products p
 on p.id = o."productId" inner join customer c on c.id = sp."customerId" where c.name ilike '%${name}%'`)

 export const generateInserts = async (item, allProducts) => {
  const cust = await customer(item.retailer)
  const idToInsert = cust.length > 0 ? cust[0].id : uuid.v4()

  const subscriptionEntries =  ['Classic Ad', 'Stand out Ad', 'Premium Ad'].reduce((entry, current) => {
    if (parseInt(item[current], 10)) {
      entry.push({
        id: uuid.v4(),
        custId: idToInsert,
        productId: allProducts.find((product) => product.name === current).id,
        status: 'pending',
        quantity: parseInt(item[current], 10)
      })
    }
    return entry
  }, [])

  const customerEntries = cust.length > 0 ? [] : [{
    id: idToInsert,
    name: item.retailer
  }]
  return {
    subscriptionEntries,
    customerEntries
  }
 }