import api from './axios'

const STORAGE_KEY = 'vehicleParts.staffMembers'

const listEndpoints = ['/staff', '/users/staff', '/auth/staff']
const registerEndpoints = ['/staff/register', '/auth/register/staff', '/auth/register']

const roleUpdateEndpoints = (id) => [
  { method: 'put', url: `/staff/${id}/role` },
  { method: 'patch', url: `/staff/${id}/role` },
  { method: 'put', url: `/staff/${id}` },
  { method: 'patch', url: `/staff/${id}` },
]

const deleteEndpoints = (id) => [
  { method: 'delete', url: `/staff/${id}` },
  { method: 'delete', url: `/users/${id}` },
]

function readStoredStaffMembers() {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    const parsed = value ? JSON.parse(value) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeStoredStaffMembers(staffMembers) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(staffMembers))
}

function isRecoverableEndpointError(error) {
  if (!error.response) {
    return true
  }

  return [404, 405, 501].includes(error.response.status)
}

function getErrorMessage(error, fallbackMessage) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.title ||
    error?.message ||
    fallbackMessage
  )
}

function extractCollection(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (!payload || typeof payload !== 'object') {
    return []
  }

  const possibleCollections = [
    payload.items,
    payload.data,
    payload.results,
    payload.staff,
    payload.staffMembers,
    payload.users,
  ]

  return possibleCollections.find(Array.isArray) || []
}

function normalizeStaffMember(staffMember, fallback = {}) {
  const source = { ...fallback, ...staffMember }
  const fullName =
    source.fullName ||
    source.name ||
    [source.firstName, source.lastName].filter(Boolean).join(' ') ||
    'Unnamed Staff'

  const statusValue = source.status
  const isActive =
    typeof source.isActive === 'boolean'
      ? source.isActive
      : typeof source.active === 'boolean'
        ? source.active
        : typeof statusValue === 'string'
          ? statusValue.toLowerCase() !== 'inactive'
          : true

  return {
    id:
      source.id ||
      source.staffId ||
      source.userId ||
      source.email ||
      `staff-${Date.now()}`,
    fullName,
    email: source.email || '',
    phoneNumber: source.phoneNumber || source.phone || '',
    role: source.role || 'Staff',
    isActive,
    createdAt:
      source.createdAt ||
      source.registeredAt ||
      source.createdDate ||
      new Date().toISOString(),
  }
}

function mergeStaffMember(staffMember) {
  const existing = readStoredStaffMembers()
  const next = [
    normalizeStaffMember(staffMember),
    ...existing.filter((item) => item.id !== staffMember.id),
  ]

  writeStoredStaffMembers(next)
  return next
}

async function tryRequestSequence(requests) {
  let lastError = null

  for (const request of requests) {
    try {
      return await request()
    } catch (error) {
      if (!isRecoverableEndpointError(error)) {
        throw error
      }

      lastError = error
    }
  }

  throw lastError || new Error('No matching API endpoint was available.')
}

export async function fetchStaffMembers() {
  try {
    const response = await tryRequestSequence(
      listEndpoints.map((endpoint) => () => api.get(endpoint)),
    )

    const items = extractCollection(response.data).map((item) =>
      normalizeStaffMember(item),
    )

    writeStoredStaffMembers(items)
    return { staffMembers: items, source: 'api' }
  } catch (error) {
    if (!isRecoverableEndpointError(error)) {
      throw new Error(getErrorMessage(error, 'Unable to load staff members.'), {
        cause: error,
      })
    }

    return {
      staffMembers: readStoredStaffMembers().map((item) => normalizeStaffMember(item)),
      source: 'local',
    }
  }
}

export async function registerStaffMember(formData) {
  const payload = {
    fullName: formData.fullName.trim(),
    email: formData.email.trim(),
    phoneNumber: formData.phoneNumber.trim(),
    password: formData.password,
    role: formData.role,
  }

  try {
    const response = await tryRequestSequence(
      registerEndpoints.map((endpoint) => () => api.post(endpoint, payload)),
    )

    const responseData =
      response.data?.data || response.data?.staff || response.data?.user || response.data
    const staffMember = normalizeStaffMember(responseData, payload)

    mergeStaffMember(staffMember)
    return { staffMember, source: 'api' }
  } catch (error) {
    if (!isRecoverableEndpointError(error)) {
      throw new Error(getErrorMessage(error, 'Unable to register staff member.'), {
        cause: error,
      })
    }

    const staffMember = normalizeStaffMember({
      ...payload,
      id: `local-${Date.now()}`,
      isActive: true,
    })

    mergeStaffMember(staffMember)
    return { staffMember, source: 'local' }
  }
}

export async function updateStaffRole(staffMemberId, role) {
  const current = readStoredStaffMembers().find((item) => item.id === staffMemberId)
  const payload = {
    id: staffMemberId,
    role,
    fullName: current?.fullName,
    email: current?.email,
  }

  try {
    const response = await tryRequestSequence(
      roleUpdateEndpoints(staffMemberId).map(({ method, url }) => () =>
        api[method](url, payload),
      ),
    )

    const responseData = response.data?.data || response.data?.staff || response.data
    const staffMember = normalizeStaffMember(responseData, { ...current, ...payload })

    mergeStaffMember(staffMember)
    return { staffMember, source: 'api' }
  } catch (error) {
    if (!isRecoverableEndpointError(error)) {
      throw new Error(getErrorMessage(error, 'Unable to update the staff role.'), {
        cause: error,
      })
    }

    const staffMember = normalizeStaffMember({ ...current, ...payload })
    mergeStaffMember(staffMember)
    return { staffMember, source: 'local' }
  }
}

export async function removeStaffMember(staffMemberId) {
  try {
    await tryRequestSequence(
      deleteEndpoints(staffMemberId).map(({ method, url }) => () => api[method](url)),
    )
  } catch (error) {
    if (!isRecoverableEndpointError(error)) {
      throw new Error(getErrorMessage(error, 'Unable to remove the staff member.'), {
        cause: error,
      })
    }
  }

  const next = readStoredStaffMembers().filter((item) => item.id !== staffMemberId)
  writeStoredStaffMembers(next)
  return next
}
