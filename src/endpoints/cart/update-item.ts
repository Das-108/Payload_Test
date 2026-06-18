import { PayloadHandler } from 'payload'
import { updateItemQuantity } from '../../lib/cart'
import { fetchTenantByDomain } from '../../utilities/fetchTenantByDomain'

export const updateItemHandler: PayloadHandler = async (req) => {
  try {
    if (!req.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    
    const host = req.headers.get('host') || ''
    const tenant = await fetchTenantByDomain(host)
    if (!tenant) return Response.json({ error: 'Tenant mapping not found', host }, { status: 400 })

    const body = typeof req.json === 'function' ? await req.json() : (req as any).body
    const { productId, quantity } = body

    if (!productId || quantity === undefined) {
      return Response.json({ error: 'Missing productId or quantity parameters' }, { status: 400 })
    }

    const updatedCart = await updateItemQuantity(req.payload, req.user.id, tenant.id, productId, Number(quantity))
    return Response.json({ success: true, cart: updatedCart }, { status: 200 })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}