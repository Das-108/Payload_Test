'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Address, Config } from '@/payload-types'
import {
  defaultCountries as supportedCountries,
  useAddresses,
} from '@payloadcms/plugin-ecommerce/client/react'
import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Button } from '@/components/ui/button'
import { deepMergeSimple } from 'payload/shared'

type AddressFormValues = {
  name?: string | null
  line1?: string | null
  line2?: string | null
  city?: string | null
  state?: string |null
}

type AddressFormInitialData = Partial<
  Omit<Address, 'id' | 'updatedAt' | 'createdAt'>
>& {
  country?: string | null
  title?: string | null
  firstName?: string | null
  lastName?: string | null
  company?: string | null
  phone?: string | null
  addressLine1?: string | null
  addressLine2?: string | null
  postalCode?: string | null
}

type Props = {
  addressID?: Config['db']['defaultIDType']
  initialData?: AddressFormInitialData
  callback?: (data: Partial<Address>) => void
  /**
   * If true, the form will not submit to the API.
   */
  skipSubmission?: boolean
}

export const AddressForm: React.FC<Props> = ({
  addressID,
  initialData,
  callback,
  skipSubmission,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AddressFormValues>({
    defaultValues: initialData,
  })

  const { createAddress, updateAddress } = useAddresses()

  const onSubmit = useCallback(
    async (data: AddressFormValues) => {
      const newData = deepMergeSimple(initialData || {}, data)

      if (!skipSubmission) {
        if (addressID) {
          await updateAddress(addressID, newData)
        } else {
          await createAddress(newData)
        }
      }

      if (callback) {
        callback(newData)
      }
    },
    [initialData, skipSubmission, callback, addressID, updateAddress, createAddress],
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <FormItem>
            <Label htmlFor="name">Name*</Label>
            <Input id="name" {...register('name', { required: 'Name is required.' })} />
            {errors.name && <FormError message={errors.name.message} />}
          </FormItem>

          <FormItem>
            <Label htmlFor="line1">Address Line 1*</Label>
            <Input id="line1" {...register('line1', { required: 'Address Line 1 is required.' })} />
            {errors.line1 && <FormError message={errors.line1.message} />}
          </FormItem>

          <FormItem>
            <Label htmlFor="line2">Address Line 2</Label>
            <Input id="line2" {...register('line2')} />
            {errors.line2 && <FormError message={errors.line2.message} />}
          </FormItem>

          <FormItem>
            <Label htmlFor="city">City*</Label>
            <Input id="city" {...register('city', { required: 'City is required.' })} />
            {errors.city && <FormError message={errors.city.message} />}
          </FormItem>

          <FormItem>
            <Label htmlFor="state">State</Label>
            <Input id="state" {...register('state')} />
            {errors.state && <FormError message={errors.state.message} />}
          </FormItem>
        </div>
      </div>

      <Button type="submit">Submit</Button>
    </form>
  )
}
