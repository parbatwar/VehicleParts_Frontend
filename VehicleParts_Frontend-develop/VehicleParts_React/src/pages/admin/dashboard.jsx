import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  fetchStaffMembers,
  registerStaffMember,
  removeStaffMember,
  updateStaffRole,
} from '../../api/staff'

const roleOptions = ['Staff', 'Admin']

function createInitialForm() {
  return {
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'Staff',
  }
}

function sortStaffMembers(staffMembers) {
  return [...staffMembers].sort((left, right) => {
    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  })
}

function formatDate(value) {
  if (!value) {
    return 'Not available'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Not available'
  }

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function validateForm(form) {
  if (!form.fullName.trim()) {
    return 'Full name is required.'
  }

  if (!form.email.trim()) {
    return 'Email is required.'
  }

  if (!form.password) {
    return 'Password is required.'
  }

  if (form.password.length < 6) {
    return 'Password must be at least 6 characters long.'
  }

  if (form.password !== form.confirmPassword) {
    return 'Password and confirm password must match.'
  }

  return ''
}

function AdminDashboard() {
  const navigate = useNavigate()
  const fullName = localStorage.getItem('fullName') || 'Admin'

  const [form, setForm] = useState(createInitialForm)
  const [query, setQuery] = useState('')
  const [staffMembers, setStaffMembers] = useState([])
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeRowId, setActiveRowId] = useState('')

  const loadStaffDirectory = async (showSuccessMessage = false) => {
    setLoading(true)

    try {
      const result = await fetchStaffMembers()
      setStaffMembers(sortStaffMembers(result.staffMembers))

      if (showSuccessMessage) {
        const message =
          result.source === 'api'
            ? 'Staff directory refreshed successfully.'
            : 'Staff directory loaded from local saved data.'

        setFeedback({ type: 'success', message })
      }
    } catch (error) {
      setFeedback({ type: 'error', message: error.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const role = localStorage.getItem('role')

    if (role !== 'Admin') {
      navigate('/')
      return
    }

    const timeoutId = window.setTimeout(() => {
      loadStaffDirectory()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [navigate])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleRegister = async (event) => {
    event.preventDefault()

    const validationMessage = validateForm(form)
    if (validationMessage) {
      setFeedback({ type: 'error', message: validationMessage })
      return
    }

    setSaving(true)
    setFeedback({ type: '', message: '' })

    try {
      const result = await registerStaffMember(form)
      setStaffMembers((current) =>
        sortStaffMembers([
          result.staffMember,
          ...current.filter((staffMember) => staffMember.id !== result.staffMember.id),
        ]),
      )
      setForm(createInitialForm())
      setFeedback({
        type: 'success',
        message:
          result.source === 'api'
            ? 'Staff account registered successfully.'
            : 'Staff account saved locally because the API endpoint is not available yet.',
      })
    } catch (error) {
      setFeedback({ type: 'error', message: error.message })
    } finally {
      setSaving(false)
    }
  }

  const handleRoleChange = async (staffMemberId, role) => {
    setActiveRowId(staffMemberId)
    setFeedback({ type: '', message: '' })

    try {
      const result = await updateStaffRole(staffMemberId, role)

      setStaffMembers((current) =>
        sortStaffMembers(
          current.map((staffMember) =>
            staffMember.id === staffMemberId ? result.staffMember : staffMember,
          ),
        ),
      )

      setFeedback({
        type: 'success',
        message:
          result.source === 'api'
            ? 'Staff role updated successfully.'
            : 'Staff role updated locally because the API endpoint is not available yet.',
      })
    } catch (error) {
      setFeedback({ type: 'error', message: error.message })
    } finally {
      setActiveRowId('')
    }
  }

  const handleRemove = async (staffMemberId) => {
    const selectedStaffMember = staffMembers.find((staffMember) => staffMember.id === staffMemberId)

    if (!selectedStaffMember) {
      return
    }

    const confirmed = window.confirm(
      `Remove ${selectedStaffMember.fullName} from the staff directory?`,
    )

    if (!confirmed) {
      return
    }

    setActiveRowId(staffMemberId)
    setFeedback({ type: '', message: '' })

    try {
      const nextStaffMembers = await removeStaffMember(staffMemberId)
      setStaffMembers(sortStaffMembers(nextStaffMembers))
      setFeedback({ type: 'success', message: 'Staff member removed successfully.' })
    } catch (error) {
      setFeedback({ type: 'error', message: error.message })
    } finally {
      setActiveRowId('')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('fullName')
    navigate('/')
  }

  const filteredStaffMembers = staffMembers.filter((staffMember) => {
    const searchValue = query.trim().toLowerCase()

    if (!searchValue) {
      return true
    }

    return [staffMember.fullName, staffMember.email, staffMember.phoneNumber, staffMember.role]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(searchValue))
  })

  const adminCount = staffMembers.filter((staffMember) => staffMember.role === 'Admin').length
  const activeCount = staffMembers.filter((staffMember) => staffMember.isActive).length

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <header style={styles.hero}>
          <div>
            <p style={styles.eyebrow}>Vehicle Parts Admin</p>
            <h1 style={styles.heading}>Staff Registration and Role Management</h1>
            <p style={styles.subheading}>
              Welcome back, {fullName}. Register new staff accounts, assign access levels,
              and keep the team directory organized from one place.
            </p>
          </div>

          <div style={styles.heroActions}>
            <button type="button" onClick={() => loadStaffDirectory(true)} style={styles.secondaryButton}>
              Refresh Directory
            </button>
            <button type="button" onClick={handleLogout} style={styles.primaryButton}>
              Logout
            </button>
          </div>
        </header>

        <section style={styles.statsGrid}>
          <article style={styles.statCard}>
            <span style={styles.statLabel}>Total Staff</span>
            <strong style={styles.statValue}>{staffMembers.length}</strong>
          </article>
          <article style={styles.statCard}>
            <span style={styles.statLabel}>Admin Roles</span>
            <strong style={styles.statValue}>{adminCount}</strong>
          </article>
          <article style={styles.statCard}>
            <span style={styles.statLabel}>Standard Staff</span>
            <strong style={styles.statValue}>{Math.max(staffMembers.length - adminCount, 0)}</strong>
          </article>
          <article style={styles.statCard}>
            <span style={styles.statLabel}>Active Accounts</span>
            <strong style={styles.statValue}>{activeCount}</strong>
          </article>
        </section>

        {feedback.message && (
          <div
            style={{
              ...styles.feedback,
              ...(feedback.type === 'error' ? styles.feedbackError : styles.feedbackSuccess),
            }}
          >
            {feedback.message}
          </div>
        )}

        <section style={styles.contentGrid}>
          <article style={styles.panel}>
            <div style={styles.panelHeader}>
              <div>
                <h2 style={styles.panelTitle}>Register Staff Member</h2>
                <p style={styles.panelText}>
                  Create login credentials and assign the correct role before the staff member
                  starts using the system.
                </p>
              </div>
            </div>

            <form onSubmit={handleRegister} style={styles.form}>
              <label style={styles.field}>
                <span style={styles.label}>Full Name</span>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  style={styles.input}
                  required
                />
              </label>

              <label style={styles.field}>
                <span style={styles.label}>Email Address</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="staff@vehicleparts.com"
                  style={styles.input}
                  required
                />
              </label>

              <label style={styles.field}>
                <span style={styles.label}>Phone Number</span>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  placeholder="Optional contact number"
                  style={styles.input}
                />
              </label>

              <label style={styles.field}>
                <span style={styles.label}>Role</span>
                <select name="role" value={form.role} onChange={handleChange} style={styles.input}>
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>

              <label style={styles.field}>
                <span style={styles.label}>Password</span>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create password"
                  style={styles.input}
                  required
                />
              </label>

              <label style={styles.field}>
                <span style={styles.label}>Confirm Password</span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  style={styles.input}
                  required
                />
              </label>

              <div style={styles.formActions}>
                <button type="submit" disabled={saving} style={styles.primaryButton}>
                  {saving ? 'Registering...' : 'Register Staff'}
                </button>
                <button
                  type="button"
                  onClick={() => setForm(createInitialForm())}
                  disabled={saving}
                  style={styles.secondaryButton}
                >
                  Reset
                </button>
              </div>
            </form>
          </article>

          <article style={styles.panel}>
            <div style={styles.panelHeader}>
              <div>
                <h2 style={styles.panelTitle}>Staff Directory</h2>
                <p style={styles.panelText}>
                  Review all staff accounts, search by name or email, and adjust role access
                  whenever responsibilities change.
                </p>
              </div>

              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search staff"
                style={styles.searchInput}
              />
            </div>

            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHead}>Staff Member</th>
                    <th style={styles.tableHead}>Contact</th>
                    <th style={styles.tableHead}>Role</th>
                    <th style={styles.tableHead}>Registered</th>
                    <th style={styles.tableHead}>Status</th>
                    <th style={styles.tableHead}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" style={styles.emptyState}>
                        Loading staff directory...
                      </td>
                    </tr>
                  ) : filteredStaffMembers.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={styles.emptyState}>
                        No staff members found. Register a staff account to get started.
                      </td>
                    </tr>
                  ) : (
                    filteredStaffMembers.map((staffMember) => (
                      <tr key={staffMember.id}>
                        <td style={styles.tableCell}>
                          <strong style={styles.personName}>{staffMember.fullName}</strong>
                        </td>
                        <td style={styles.tableCell}>
                          <div style={styles.contactStack}>
                            <span>{staffMember.email || 'No email saved'}</span>
                            <span>{staffMember.phoneNumber || 'No phone saved'}</span>
                          </div>
                        </td>
                        <td style={styles.tableCell}>
                          <select
                            value={staffMember.role}
                            onChange={(event) =>
                              handleRoleChange(staffMember.id, event.target.value)
                            }
                            disabled={activeRowId === staffMember.id}
                            style={styles.roleSelect}
                          >
                            {roleOptions.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td style={styles.tableCell}>{formatDate(staffMember.createdAt)}</td>
                        <td style={styles.tableCell}>
                          <span
                            style={{
                              ...styles.statusPill,
                              ...(staffMember.isActive ? styles.statusActive : styles.statusInactive),
                            }}
                          >
                            {staffMember.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td style={styles.tableCell}>
                          <button
                            type="button"
                            onClick={() => handleRemove(staffMember.id)}
                            disabled={activeRowId === staffMember.id}
                            style={styles.dangerButton}
                          >
                            {activeRowId === staffMember.id ? 'Working...' : 'Remove'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    padding: '32px 20px',
    background:
      'radial-gradient(circle at top left, rgba(247, 194, 78, 0.2), transparent 24%), linear-gradient(180deg, #f7f4ec 0%, #eef3f8 100%)',
  },
  shell: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  hero: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
    padding: '28px',
    borderRadius: '24px',
    background: 'linear-gradient(135deg, #13293d 0%, #1b4965 100%)',
    color: '#ffffff',
    boxShadow: '0 20px 45px rgba(19, 41, 61, 0.2)',
    flexWrap: 'wrap',
  },
  eyebrow: {
    marginBottom: '10px',
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#f7c24e',
  },
  heading: {
    fontSize: 'clamp(28px, 4vw, 40px)',
    lineHeight: 1.1,
    marginBottom: '12px',
  },
  subheading: {
    maxWidth: '720px',
    color: 'rgba(255, 255, 255, 0.82)',
    lineHeight: 1.6,
  },
  heroActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
  },
  statCard: {
    padding: '22px',
    borderRadius: '20px',
    backgroundColor: '#ffffff',
    border: '1px solid rgba(19, 41, 61, 0.08)',
    boxShadow: '0 16px 30px rgba(19, 41, 61, 0.06)',
  },
  statLabel: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: '#6b7280',
    marginBottom: '10px',
  },
  statValue: {
    fontSize: '32px',
    color: '#13293d',
  },
  feedback: {
    padding: '16px 18px',
    borderRadius: '16px',
    fontWeight: 600,
  },
  feedbackSuccess: {
    backgroundColor: '#e9f8ef',
    color: '#137547',
    border: '1px solid #bde6cb',
  },
  feedbackError: {
    backgroundColor: '#fff1f1',
    color: '#b42318',
    border: '1px solid #f1b6b6',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(320px, 420px) minmax(0, 1fr)',
    gap: '24px',
    alignItems: 'start',
  },
  panel: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    border: '1px solid rgba(19, 41, 61, 0.08)',
    boxShadow: '0 18px 35px rgba(19, 41, 61, 0.08)',
    padding: '24px',
    overflow: 'hidden',
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    alignItems: 'flex-start',
    marginBottom: '22px',
    flexWrap: 'wrap',
  },
  panelTitle: {
    fontSize: '22px',
    color: '#13293d',
    marginBottom: '8px',
  },
  panelText: {
    color: '#526071',
    lineHeight: 1.6,
    maxWidth: '620px',
  },
  form: {
    display: 'grid',
    gap: '16px',
  },
  field: {
    display: 'grid',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#13293d',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '14px',
    border: '1px solid #ced6df',
    backgroundColor: '#fbfcfe',
    fontSize: '14px',
    outline: 'none',
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    paddingTop: '6px',
  },
  primaryButton: {
    border: 'none',
    borderRadius: '14px',
    padding: '12px 18px',
    backgroundColor: '#f7c24e',
    color: '#13293d',
    fontWeight: 800,
    cursor: 'pointer',
  },
  secondaryButton: {
    border: '1px solid rgba(19, 41, 61, 0.14)',
    borderRadius: '14px',
    padding: '12px 18px',
    backgroundColor: '#ffffff',
    color: '#13293d',
    fontWeight: 700,
    cursor: 'pointer',
  },
  dangerButton: {
    border: 'none',
    borderRadius: '12px',
    padding: '10px 14px',
    backgroundColor: '#c63d2f',
    color: '#ffffff',
    fontWeight: 700,
    cursor: 'pointer',
  },
  searchInput: {
    width: '100%',
    maxWidth: '240px',
    padding: '12px 14px',
    borderRadius: '14px',
    border: '1px solid #ced6df',
    backgroundColor: '#fbfcfe',
    fontSize: '14px',
  },
  tableWrap: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '760px',
  },
  tableHead: {
    textAlign: 'left',
    padding: '14px 12px',
    borderBottom: '1px solid #e5e7eb',
    color: '#526071',
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  tableCell: {
    padding: '16px 12px',
    borderBottom: '1px solid #eef2f7',
    color: '#13293d',
    verticalAlign: 'middle',
  },
  personName: {
    color: '#13293d',
  },
  contactStack: {
    display: 'grid',
    gap: '4px',
    color: '#526071',
  },
  roleSelect: {
    minWidth: '120px',
    padding: '10px 12px',
    borderRadius: '12px',
    border: '1px solid #ced6df',
    backgroundColor: '#fbfcfe',
  },
  statusPill: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '999px',
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statusActive: {
    backgroundColor: '#e9f8ef',
    color: '#137547',
  },
  statusInactive: {
    backgroundColor: '#fce7e7',
    color: '#b42318',
  },
  emptyState: {
    padding: '28px 12px',
    textAlign: 'center',
    color: '#6b7280',
  },
}

export default AdminDashboard
