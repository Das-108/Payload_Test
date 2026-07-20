import { Button } from '@/components/ui/button'

import { CartBadge } from './CartBadge'

export function OpenCartButton({
  className,
  quantity,
  ...rest
}: {
  className?: string
  quantity?: number
}) {
  return (
    <Button
      variant="nav"
      size="clear"
      className="navLink relative items-end hover:cursor-pointer"
      {...rest}
    >
      <span>Cart</span>

      {quantity ? (
        <>
          <span>•</span>
          <CartBadge />
        </>
      ) : null}
    </Button>
  )
}
