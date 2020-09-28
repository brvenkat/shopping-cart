export type StatusType = 'pending'

export interface Subscription {
  id: string
  custId: string
  productId: string
  status: StatusType
  quantity: number
}