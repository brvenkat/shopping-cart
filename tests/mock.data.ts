import { StatusType } from '../src/models/subscription'
export const products = [
  {
    id: '123',
    name: 'Classic Ad',
    description: 'some-description',
    price: '12.99'
  },
  {
    id: '456',
    name: 'Stand out Ad',
    description: 'some-description-2',
    price: '9.99'
  },
  {
    id: '456',
    name: 'Premium Ad',
    description: 'some-description-2',
    price: '9.99'
  }
]

export const subscriptionEntries = [
  {
    id: '123',
    custId: '456',
    productId: '123',
    status: 'pending',
    quantity: 2
  }
]

export const customerEntries = [
  {
    id: '12345',
    name: 'some-customer-name'
  }
]

export const subscriptions = [
  {
    name: 'Classic Ad',
    times: '2'
  },
  {
    name: 'Stand out Ad',
    times: '3'
  },
  {
    name: 'Premium Ad',
    times: '2'
  }
]

export const specialOffers = [
  {
    name: 'Classic Ad',
    type: 'discount',
    price: 122.99
  },
  {
    name: 'Premium Ad',
    type: 'deal',
    originalNumber: 2,
    upgradedNumber: 3
  }
]

export const allSubscriptions = [
  {
    id: 'some-id',
    custId: '12345',
    productId: '123',
    status: 'pending' as StatusType,
    quantity: 2
  },
  {
    id: 'some-id',
    custId: '12345',
    productId: '456',
    status: 'pending' as StatusType,
    quantity: 2
  }
]
export const allEntries = [...customerEntries, ...allSubscriptions]