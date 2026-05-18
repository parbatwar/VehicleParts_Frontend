import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', role: 'staff', password: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await axios.get('/admin/staff');
      setStaff(res.data);
    } catch (err) {
      alert('Failed to fetch staff');
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/admin/staff/${editingId}`, form);
      } else {
        await axios.post('/admin/staff', form);
      }
      setForm({ name: '', email: '', role: 'staff', password: '' });
      setEditingId(null);
      fetchStaff();
    } catch (err) {
      alert('Failed to save staff');
    }
  };

  const handleEdit = staffMember => {
    setForm({ name: staffMember.name, email: staffMember.email, role: staffMember.role, password: '' });
    setEditingId(staffMember.id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this staff member?')) return;
    try {
      await axios.delete(`/admin/staff/${id}`);
      fetchStaff();
    } catch (err) {
      alert('Failed to delete staff');
    }
  };

  return (
    <div>
      <h2>Staff Registration & Role Management</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required type="email" />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
        </select>
        <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" required={!editingId} />
        <button type="submit">{editingId ? 'Update' : 'Register'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', email: '', role: 'staff', password: '' }); }}>Cancel</button>}
      </form>
      <table>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {staff.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.role}</td>
              <td>
                <button onClick={() => handleEdit(s)}>Edit</button>
                <button onClick={() => handleDelete(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffManagement;
