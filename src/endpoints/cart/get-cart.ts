import { PayloadHandler } from 'payload'
import { getOrCreateCart } from '../../lib/cart'
import { fetchTenantByDomain } from '../../utilities/fetchTenantByDomain'

export const getCartHandler: PayloadHandler = async (req) => {
  try {
    console.log('[API GET-CART] Request Headers Host:', req.headers.get('host'))
    console.log('[API GET-CART] Authenticated User:', req.user?.id || 'NONE')

    if (!req.user) {
      return Response.json({ error: 'Unauthorized session token context' }, { status: 401 })
    }

    const host = req.headers.get('host') || ''
    const tenant = await fetchTenantByDomain(host)
    
    if (!tenant) {
      console.error(`[API GET-CART] Failed to resolve tenant for host: ${host}`)
      return Response.json({ error: 'Tenant domain mapping not found', host }, { status: 400 })
    }

    const cart = await getOrCreateCart(req.payload, req.user.id, tenant.id)
    return Response.json(cart, { status: 200 })
  } catch (error: any) {
    return Response.json({ error: error.message || 'Server Exception' }, { status: 500 })
  }
}