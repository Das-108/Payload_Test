'use client'

import { CreateAddressModal } from '@/components/addresses/CreateAddressModal'
import type { Address } from '@/payload-types'
import React from 'react'

type AddressDisplayData = Partial<Address> & {
  name?: string | null
  line1?: string | null
  line2?: string | null
  city?: string | null
  state?: string | null
}

type Props = {
  address: AddressDisplayData
  /**
   * Completely override the default actions
   */
  actions?: React.ReactNode
  /**
   * Insert elements before the actions
   */
  beforeActions?: React.ReactNode
  /**
   * Insert elements after the actions
   */
  afterActions?: React.ReactNode
  /**
   * Hide all actions
   */
  hideActions?: boolean
}

export const AddressItem: React.FC<Props> = ({
  address,
  actions,
  hideActions = false,
  beforeActions,
  afterActions,
}) => {
  if (!address) {
    return null
  }

  const addressData = address

  return (
    <div className="flex items-center">
      <div className="grow">
        <p className="font-medium">{addressData.name}</p>

        <p>
          {addressData.line1}
          {addressData.line2 && <>, {addressData.line2}</>}
        </p>

        <p>
          {addressData.city}
          {addressData.state && `, ${addressData.state}`}
        </p>
      </div>

      {!hideActions && address.id && (
        <div className="shrink flex flex-col gap-2">
          {actions ? (
            actions
          ) : (
            <>
              {beforeActions}
              <CreateAddressModal
                addressID={address.id}
                initialData={address}
                buttonText="Edit"
                modalTitle="Edit address"
              />
              {afterActions}
            </>
          )}
        </div>
      )}
    </div>
  )
}
