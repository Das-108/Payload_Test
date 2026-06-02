import type { Access } from 'payload'
import { checkRole } from '@/access/utilities'

/**
 * Global access checker for the System Owner (You).
 * This replaces the "isSuperAdmin" logic from the video.
 */
export const isAdmin: Access = ({ req }) => {
  // Only users with the 'admin' role get global power
  return Boolean(req.user && checkRole(['admin'], req.user))
}