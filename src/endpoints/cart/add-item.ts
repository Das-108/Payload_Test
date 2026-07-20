import type { PayloadHandler } from 'payload'
import { addToCart } from '../../lib/cart'
import { fetchTenantByDomain } from '../../utilities/fetchTenantByDomain'

type AddItemRequestBody = {
  productId?: string | number
  quantity?: number | string
}

export const addItemHandler: PayloadHandler = async (req) => {
  try {
    if (!req.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const host = req.headers.get('host') || ''
    const tenant = await fetchTenantByDomain(host)
    if (!tenant) return Response.json({ error: 'Tenant mapping not found', host }, { status: 400 })

    const requestBody = typeof req.json === 'function' ? await req.json() : req.body
    const body =
      typeof requestBody === 'object' && requestBody !== null
        ? (requestBody as Partial<AddItemRequestBody>)
        : {}

    const { productId, quantity = 1 } = body

    if (!productId) {
      return Response.json({ error: 'Missing target productId body parameter' }, { status: 400 })
    }

    const updatedCart = await addToCart(
      req.payload,
      req.user.id,
      tenant.id,
      productId,
      Number(quantity),
    )
    return Response.json({ success: true, cart: updatedCart }, { status: 200 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error'

    // 🛡️ Error mapping router to prevent 500 status leaks
    if (message === 'PRODUCT_NOT_FOUND') {
      return Response.json({ error: 'Product not found' }, { status: 404 })
    }
    if (message === 'PRODUCT_BELONGS_TO_ANOTHER_TENANT') {
      return Response.json(
        { error: 'Access Denied: Product belongs to another store context' },
        { status: 403 },
      )
    }
    if (message === 'PRODUCT_OUT_OF_STOCK') {
      return Response.json({ error: 'This item is currently out of stock' }, { status: 400 })
    }

    return Response.json({ error: message }, { status: 500 })
  }
}
