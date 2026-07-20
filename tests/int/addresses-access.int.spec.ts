import { Addresses } from '@/collections/Addresses'
import { describe, expect, it } from 'vitest'

type AccessArgs = Parameters<NonNullable<NonNullable<typeof Addresses.access>['read']>>[0]

describe('Addresses access control', () => {
  it('scopes reads to the authenticated user', async () => {
    const result = await Addresses.access?.read?.({
      req: {
        user: {
          id: 42,
          roles: ['customer'],
        },
      },
    } as AccessArgs)

    expect(result).toEqual({
      and: [{ user: { equals: 42 } }],
    })
  })

  it('blocks anonymous users from reading addresses', async () => {
    const result = await Addresses.access?.read?.({
      req: {
        user: null,
      },
    } as AccessArgs)

    expect(result).toBe(false)
  })
})
