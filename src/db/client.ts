import pg from 'pg'
import { AppConfig } from '../config/AppConfig'
import { Subscription } from '../models/subscription'
import { Customer } from '../models/customer'

export class DBClient {
  private static _instance: DBClient
  private pool;
  private constructor(config: AppConfig) {
    this.pool = new pg.Pool(config.db)
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new DBClient(new AppConfig())
    }
    return this._instance
  }

  public async bulkInsert<T extends Customer | Subscription>(entries: T[]) {
    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')

      entries.map((async(entry) => {
        if (this.isSubscription(entry)) {
          const insertSubscription = `INSERT INTO SUBSCRIPTION(id, "customerId", "productId", "status", "quanity", "timeCreated") VALUES
          ($1, $2, $3, $4, $5, current_timestamp)`
          const insertSubscriptionValue = Object.keys(entry).map((idx) => entry[idx])
          await client.query(insertSubscription, insertSubscriptionValue)
        } else {
          const insertCustomer = `INSERT INTO customer(id, name) VALUES ($1, $2)`
          const insertCustomerValue = Object.keys(entry).map((idx) => entry[idx])
          await client.query(insertCustomer, insertCustomerValue)
        }
      }))

      await client.query('COMMIT')
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }
  }

  private isSubscription = (entry: Subscription | Customer): entry is Subscription => {
    return (entry as Subscription).custId !== undefined
  }

  public async query(query: string) {
    const client = await this.pool.connect()
    try {
      const result = await client.query(query)
      return result.rows

    } catch (err) {
      throw err
    } finally {
      client.release()
    }
  }
}
