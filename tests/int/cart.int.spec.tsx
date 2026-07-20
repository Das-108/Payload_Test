import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CartProvider, useCart } from '@/providers/CartProvider'
import { addToCart } from '@/lib/cart'

function CartProbe() {
  const { isLoading, totalItemsCount } = useCart()

  return (
    <div>
      <span data-testid="loading">{isLoading ? 'loading' : 'idle'}</span>
      <span data-testid="count">{totalItemsCount}</span>
    </div>
  )
}

describe('Cart cart flow', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('exposes loading state and computes the cart item count from the API response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          id: 'cart-1',
          items: [
            { product: 'product-1', quantity: 2, priceSnapshot: 20 },
            { product: 'product-2', quantity: 1, priceSnapshot: 15 },
          ],
          subtotal: 55,
        }),
      }),
    )

    render(
      <CartProvider>
        <CartProbe />
      </CartProvider>,
    )

    expect(screen.getByTestId('loading').textContent).toBe('loading')

    await waitFor(() => {
      expect(screen.getByTestId('count').textContent).toBe('3')
    })
  })

  it('blocks adding products that belong to a different tenant', async () => {
    const payload = {
      find: vi.fn().mockResolvedValue({ docs: [] }),
      create: vi.fn().mockResolvedValue({ id: 1 }),
      update: vi.fn(),
      findByID: vi.fn().mockResolvedValue({ id: 99, tenant: 2, inventory: 10, priceInUSD: 15 }),
    }

    await expect(addToCart(payload as never, 1, 1, 10)).rejects.toThrow('PRODUCT_BELONGS_TO_ANOTHER_TENANT')
  })
})
