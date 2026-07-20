import { OrderStatus } from '@/components/OrderStatus'
import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { Order } from '@/payload-types'
import { formatDateTime } from '@/utilities/formatDateTime'
import Link from 'next/link'

type Props = {
  order: Order
}

export const OrderItem: React.FC<Props> = ({ order }) => {
  const ord = order as any
  const itemsLabel = ord.items?.length === 1 ? 'Item' : 'Items'

  return (
    <div className="bg-card border rounded-lg px-4 py-2 md:px-6 md:py-4 flex flex-col sm:flex-row gap-12 sm:items-center sm:justify-between">
      <div className="flex flex-col gap-4">
        <h3 className="text-sm uppercase font-mono tracking-widest text-primary/50 truncate max-w-32 sm:max-w-none">{`#${ord.id}`}</h3>

        <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-6">
          <p className="text-xl">
            <time dateTime={ord.createdAt}>
              {formatDateTime({ date: ord.createdAt, format: 'MMMM dd, yyyy' })}
            </time>
          </p>

          {ord.status && <OrderStatus status={ord.status} />}
        </div>

        <p className="flex gap-2 text-xs text-primary/80">
          <span>
            {ord.items?.length} {itemsLabel}
          </span>
          {(ord.total || ord.price) && (
            <>
              <span>•</span>
              <Price as="span" amount={ord.total || ord.price} currencyCode={ord.currency ?? undefined} />
            </>
          )}
        </p>
      </div>

      <Button variant="outline" asChild className="self-start sm:self-auto">
        <Link href={`/orders/${ord.id}`}>View Order</Link>
      </Button>
    </div>
  )
}