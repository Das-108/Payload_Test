'use client'

import { useAuth } from '@/providers/Auth'
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

export interface CartItem {
  id?: string | null
  product: unknown
  quantity: number
  priceSnapshot: number
  [key: string]: unknown
}

export interface Cart {
  id?: string | number
  items?: CartItem[]
  subtotal?: number
  [key: string]: unknown
}

type CartMutationInput =
  | string
  | number
  | {
      product?: string | number
      productId?: string | number
      quantity?: number
      id?: string | number
    }

interface CartContextType {
  cart: Cart | null
  loading: boolean
  isLoading: boolean
  addItem: (input: CartMutationInput) => Promise<void>
  updateQuantity: (productId: string | number, quantity: number) => Promise<void>
  removeItem: (productId: string | number) => Promise<void>
  clearCart: () => Promise<void>
  incrementItem: (productId: string | number) => Promise<void>
  decrementItem: (productId: string | number) => Promise<void>
  totalItemsCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { status, user } = useAuth()

  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/cart', {
        credentials: 'include',
        method: 'GET',
      })

      if (!res.ok) {
        if (res.status === 401) {
          setCart(null)
          return
        }

        throw new Error(`Cart request failed with status ${res.status}`)
      }

      const data = await res.json()
      setCart(data && typeof data === 'object' && 'items' in data ? (data as Cart) : null)
    } catch (err) {
      console.error('[CART PROVIDER ERROR]: Failed to synchronize cart state', err)
      setCart(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchCart()
  }, [fetchCart, status, user?.id])

  const runMutation = useCallback(
    async (path: string, options: RequestInit, successMessage: string, errorMessage: string) => {
      setIsLoading(true)

      try {
        const res = await fetch(path, {
          credentials: 'include',
          ...options,
        })
        const data = await res.json().catch(() => null)

        if (!res.ok) {
          throw new Error((data as { error?: string } | null)?.error || errorMessage)
        }

        if (data && typeof data === 'object' && 'cart' in data && data.cart) {
          setCart(data.cart as Cart)
        } else if (data && typeof data === 'object' && 'items' in data) {
          setCart(data as Cart)
        }

        toast.success(successMessage)
      } catch (err) {
        const message = err instanceof Error ? err.message : errorMessage
        console.error(`[CART PROVIDER ERROR]: ${message}`, err)
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const addItem = useCallback(
    async (input: CartMutationInput) => {
      const productId =
        typeof input === 'string' || typeof input === 'number'
          ? input
          : (input?.productId ?? input?.product ?? input?.id)

      if (!productId) {
        throw new Error('Missing product selection')
      }

      await runMutation(
        '/api/cart/add',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId,
            quantity: typeof input === 'object' ? (input.quantity ?? 1) : 1,
          }),
        },
        'Item added to cart.',
        'Unable to add the item to your cart.',
      )
    },
    [runMutation],
  )

  const updateQuantity = useCallback(
    async (productId: string | number, quantity: number) => {
      await runMutation(
        '/api/cart/update',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, quantity }),
        },
        'Cart updated.',
        'Unable to update the cart.',
      )
    },
    [runMutation],
  )

  const removeItem = useCallback(
    async (productId: string | number) => {
      await runMutation(
        '/api/cart/remove',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        },
        'Item removed from cart.',
        'Unable to remove the item.',
      )
    },
    [runMutation],
  )

  const clearCart = useCallback(async () => {
    await runMutation(
      '/api/cart/clear',
      {
        method: 'DELETE',
      },
      'Cart cleared.',
      'Unable to clear the cart.',
    )
  }, [runMutation])

  const incrementItem = useCallback(
    async (productId: string | number) => {
      const currentItem = cart?.items?.find((item) => {
        const resolvedProductId =
          typeof item.product === 'object' && item.product !== null
            ? (item.product as { id?: string | number }).id
            : item.product
        return String(resolvedProductId) === String(productId)
      })

      const nextQuantity = (currentItem?.quantity ?? 0) + 1
      await updateQuantity(productId, nextQuantity)
    },
    [cart?.items, updateQuantity],
  )

  const decrementItem = useCallback(
    async (productId: string | number) => {
      const currentItem = cart?.items?.find((item) => {
        const resolvedProductId =
          typeof item.product === 'object' && item.product !== null
            ? (item.product as { id?: string | number }).id
            : item.product
        return String(resolvedProductId) === String(productId)
      })

      const nextQuantity = Math.max(0, (currentItem?.quantity ?? 0) - 1)
      await updateQuantity(productId, nextQuantity)
    },
    [cart?.items, updateQuantity],
  )

  const totalItemsCount = useMemo(() => {
    return cart?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0
  }, [cart?.items])

  return (
    <CartContext.Provider
      value={{
        cart,
        loading: isLoading,
        isLoading,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        incrementItem,
        decrementItem,
        totalItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be executed within a valid CartProvider subtree block.')
  }
  return context
}
