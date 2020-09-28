import { DBClient } from '../db/client'
import { products, subscriptions, specialCustomers, generateInserts } from '../utils/dbHelper'
import { round } from 'reliable-round'

export type OfferType = 'classic' | 'standOut' | 'premium'

const allProductsFn = async () => await products()
let allProducts

export class Checkout {

  private totalPrice: number
  private addedItems: string
  private customer: string

  public add = async (item) => {
    try {
      this.totalPrice = 0
      const {subscriptionEntries, customerEntries} = await this.sanitize(item)
      await DBClient.instance.bulkInsert([...customerEntries, ...subscriptionEntries])
      return this.setCheckoutData(item)
    } catch (err) {
      console.log('Error during insertion ', err)
      throw new Error(err)
    }
  }

  public total = () => ({
    totalPrice: round(this.totalPrice, 2),
    addedItems: this.addedItems,
    customer: this.customer
  })

  private setCheckoutData = async (item) => {
    const [allSubscriptions, allSpecialOffers] = await Promise.all([
      subscriptions(item.retailer),
      specialCustomers(item.retailer)
    ])

    const allNewSubscriptions = allSubscriptions.map((subscription) => {
      const hasOffer = allSpecialOffers.find((offer) => offer.name === subscription.name)
      if (hasOffer && hasOffer.type === 'discount') {
        this.totalPrice += parseInt(subscription.times, 10) * parseFloat(hasOffer.price)
      } else if (hasOffer && hasOffer.type === 'deal') {
        return this.computeNewSubscription(subscription, hasOffer)
      } else {
        const product = allProducts.find((product) => product.name === subscription.name)
        this.totalPrice += parseInt(subscription.times, 10) * parseFloat(product.price)
      }
      return subscription
    })

    this.addedItems = allNewSubscriptions.map((subscription) => `${subscription.name},`.repeat(subscription.times).replace(/,$/, "")).join()
    this.customer = item.retailer
    return this.addedItems
  }

  private sanitize = async (item) => {
    allProducts = await allProductsFn()
    return generateInserts(item, allProducts)
  }

  private computeNewSubscription = (subscription, hasOffer) => {
    const product = allProducts.find((product) => product.name === subscription.name)
    const currentQuanity = parseInt(subscription.times)
    const origNumber = parseInt(hasOffer.originalNumber)
    const newNumber = parseInt(hasOffer.upgradedNumber)
    const times = Math.floor(currentQuanity/origNumber) * newNumber + (currentQuanity % origNumber)
    this.totalPrice += currentQuanity * parseFloat(product.price)
    return {
      ...subscription,
      times
    }
  }
}
