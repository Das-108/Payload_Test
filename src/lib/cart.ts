import { Payload } from 'payload'

export async function getOrCreateCart(payload: Payload, userId: string | number, tenantId: string | number) {
  console.log(`[CART SERVICE] Querying cart for User: ${userId} | Tenant: ${tenantId}`)
  
  const cartQuery = await payload.find({
    collection: 'carts',
    where: {
      and: [
        { user: { equals: Number(userId) } },
        { tenant: { equals: Number(tenantId) } }
      ]
    },
    depth: 1,
  })

  if (cartQuery.docs.length > 0) {
    console.log(`[CART SERVICE] Found existing cart ID: ${cartQuery.docs[0].id}`)
    return cartQuery.docs[0]
  }

  console.log(`[CART SERVICE] Creating brand new cart for User: ${userId}`)
  return await payload.create({
    collection: 'carts',
    data: {
      // 🟢 FIXED: Explicitly cast variables using Number() to match database schemas
      user: Number(userId),
      tenant: Number(tenantId),
      items: [],
      subtotal: 0,
    }
  })
}

export function calculateSubtotal(items: any[]) {
  return items.reduce((sum, item) => {
    const price = item.priceSnapshot || 0
    const qty = item.quantity || 0
    return sum + (price * qty)
  }, 0)
}

export async function addToCart(payload: Payload, userId: string | number, tenantId: string | number, productId: string | number) {
  const cart = await getOrCreateCart(payload, userId, tenantId)
  
  const product = await payload.findByID({
    collection: 'products',
    id: Number(productId),
  })

  if (!product) throw new Error(`Product with ID ${productId} not found`)

  const items = [...(cart.items || [])]
  const existingIndex = items.findIndex(item => {
    const id = typeof item.product === 'object' ? item.product.id : item.product
    return String(id) === String(productId)
  })

  if (existingIndex > -1) {
    items[existingIndex].quantity = (items[existingIndex].quantity || 1) + 1
  } else {
    items.push({
      // 🟢 FIXED: Cast to Number to eliminate product property assignment mismatch
      product: Number(productId),
      quantity: 1,
      priceSnapshot: product.priceInUSD || 0,
    })
  }

  const subtotal = calculateSubtotal(items)
  return await payload.update({
    collection: 'carts',
    id: cart.id,
    data: { items, subtotal }
  })
}

export async function removeFromCart(payload: Payload, userId: string | number, tenantId: string | number, productId: string | number) {
  const cart = await getOrCreateCart(payload, userId, tenantId)
  const items = (cart.items || []).filter(item => {
    const id = typeof item.product === 'object' ? item.product.id : item.product
    return String(id) !== String(productId)
  })

  const subtotal = calculateSubtotal(items)
  return await payload.update({ 
    collection: 'carts', 
    id: cart.id, 
    data: { 
      items: items.map(item => ({
        product: typeof item.product === 'object' ? item.product.id : Number(item.product),
        quantity: item.quantity,
        priceSnapshot: item.priceSnapshot
      })), 
      subtotal 
    } 
  })
}

export async function updateItemQuantity(payload: Payload, userId: string | number, tenantId: string | number, productId: string | number, quantity: number) {
  if (quantity <= 0) return removeFromCart(payload, userId, tenantId, productId)

  const cart = await getOrCreateCart(payload, userId, tenantId)
  const items = [...(cart.items || [])]
  const targetIdx = items.findIndex(item => {
    const id = typeof item.product === 'object' ? item.product.id : item.product
    return String(id) === String(productId)
  })

  if (targetIdx === -1) throw new Error('Item not found in shopping cart')

  items[targetIdx].quantity = quantity
  const subtotal = calculateSubtotal(items)
  return await payload.update({ 
    collection: 'carts', 
    id: cart.id, 
    data: { 
      items: items.map(item => ({
        product: typeof item.product === 'object' ? item.product.id : Number(item.product),
        quantity: item.quantity,
        priceSnapshot: item.priceSnapshot
      })), 
      subtotal 
    } 
  })
}

export async function clearCart(payload: Payload, userId: string | number, tenantId: string | number) {
  const cart = await getOrCreateCart(payload, userId, tenantId)
  return await payload.update({ collection: 'carts', id: cart.id, data: { items: [], subtotal: 0 } })
}