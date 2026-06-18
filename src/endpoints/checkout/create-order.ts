import type { PayloadHandler } from 'payload'

export const createOrderHandler: PayloadHandler = async (req) => {
  
  try {
    // 1. Check if user is authenticated
    if (!req.user) {
      return Response.json({ error: 'Unauthorized user access' }, { status: 401 })
    }

    // 2. Extract tenant context automatically injected by your middleware/headers
    // If the plugin handles extraction via headers, fallback or capture the id
    const tenantId = (req as any).tenant?.id || req.headers.get('x-tenant-id')
    if (!tenantId) {
      return Response.json({ error: 'Missing tenant context boundary' }, { status: 400 })
    }

    // 3. Find the user's active cart for this isolated tenant
    const cartQuery = await req.payload.find({
      collection: 'carts',
      where: {
        and: [
          { user: { equals: req.user.id } },
          { tenant: { equals: tenantId } }
        ]
      },
      depth: 1,
      req,
    })

    const activeCart = cartQuery.docs[0]
    if (!activeCart || !activeCart.items || activeCart.items.length === 0) {
      return Response.json({ error: 'Your shopping cart is empty' }, { status: 400 })
    }

    // 4. Transform cart items into static immutable Order item snapshots
    const orderItems = activeCart.items.map((item: any) => ({
      product: typeof item.product === 'object' ? item.product.id : item.product,
      quantity: item.quantity,
      price: item.priceSnapshot, // Lock down the price completely on the server
    }))

    // 5. Generate the permanent Order document record
    const newOrder = await req.payload.create({
      collection: 'orders',
      data: {
        user: req.user.id,
        tenant: tenantId,
        items: orderItems,
        total: activeCart.subtotal || 0,
        status: 'pending',
        paymentStatus: 'unpaid',
        paymentMethod: 'khalti',
      },
      req,
    })

    // 6. Delete the temporary fluid cart document
    await req.payload.delete({
      collection: 'carts',
      id: activeCart.id,
      req,
    })

    return Response.json({
      success: true,
      message: 'Order created successfully from cart snapshot',
      orderId: newOrder.id,
      totalAmount: newOrder.total,
    }, { status: 201 })

  } catch (error: any) {
    return Response.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}