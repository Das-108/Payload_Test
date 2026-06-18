import { PayloadHandler } from 'payload'
import { clearCart } from '../../lib/cart'
import { fetchTenantByDomain } from '../../utilities/fetchTenantByDomain'

export const clearCartHandler: PayloadHandler = async (req) => {
  try {
    if (!req.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    
    const host = req.headers.get('host') || ''
    const tenant = await fetchTenantByDomain(host)
    if (!tenant) return Response.json({ error: 'Tenant mapping not found', host }, { status: 400 })

    const wipedCart = await clearCart(req.payload, req.user.id, tenant.id)
    return Response.json({ success: true, cart: wipedCart }, { status: 200 })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}