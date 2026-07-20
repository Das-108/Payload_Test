import type { CartItem as ProviderCartItem } from '@/providers/CartProvider'
import { CartModal } from './CartModal'

export type CartItem = ProviderCartItem

export function Cart() {
  return <CartModal />
}
