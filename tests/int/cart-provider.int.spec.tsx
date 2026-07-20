import { CartProvider, useCart } from '@/providers/CartProvider'
import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

function CartProbe() {
  const { isLoading, totalItemsCount } = useCart()

  return (
    <div>
      <span data-testid="loading">{isLoading ? 'loading' : 'idle'}</span>
      <span data-testid="count">{totalItemsCount}</span>
    </div>
  )
}

describe('CartProvider', () => {
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
})
