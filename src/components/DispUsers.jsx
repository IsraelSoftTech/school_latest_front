import React, { useEffect, useState } from 'react';
import './DispUsers.css';
import ApiService from '../services/api';
import { MdArrowBack, MdEdit, MdDelete, MdSave, MdClose, MdVisibility, MdVisibilityOff } from 'react-icons/md';

const DispUsers = ({ onBack, showBack = false }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ username: '', contact: '', password: '', role: '' });
  const [visiblePassword, setVisiblePassword] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ApiService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await ApiService.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const handleEdit = (user) => {
    setEditUser(user.id);
    setEditForm({ username: user.username, contact: user.contact, password: '', role: user.role });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await ApiService.editUser(editUser, editForm);
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      alert('Failed to update user');
    }
  };

  return (
    <div className="disp-users-container">
      <div className="disp-users-header">
        {showBack && (
          <button className="back-btn" aria-label="Back" onClick={onBack || (() => window.history.back())}>
            <MdArrowBack style={{ marginRight: 6 }} /> Back
          </button>
        )}
        <h2 style={{ margin: 0 }}>All Users</h2>
      </div>
      {loading ? (
        <div className="loader">Loading users...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="table-responsive">
          <table className="users-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Number</th>
                <th>Password</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                editUser === user.id ? (
                  <tr key={user.id} className="edit-row">
                    <td><input name="username" value={editForm.username} onChange={handleEditChange} /></td>
                    <td><input name="contact" value={editForm.contact} onChange={handleEditChange} /></td>
                    <td><input name="password" value={editForm.password} onChange={handleEditChange} placeholder="New password" /></td>
                    <td>
                      <select name="role" value={editForm.role} onChange={handleEditChange}>
                        <option value="admin">admin</option>
                        <option value="student">student</option>
                        <option value="teacher">teacher</option>
                        <option value="parent">parent</option>
                      </select>
                    </td>
                    <td>
                      <button className="save-btn" aria-label="Save" onClick={handleEditSubmit}><MdSave /></button>
                      <button className="cancel-btn" aria-label="Cancel" onClick={() => setEditUser(null)}><MdClose /></button>
                    </td>
                  </tr>
                ) : (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.contact}</td>
                    <td className="password-cell">
                      {visiblePassword === user.id ? (user.password || '••••••••') : '••••••••'}
                      <button
                        className="password-eye"
                        aria-label={visiblePassword === user.id ? 'Hide password' : 'Show password'}
                        onClick={() => setVisiblePassword(visiblePassword === user.id ? null : user.id)}
                        tabIndex={0}
                      >
                        {visiblePassword === user.id ? <MdVisibilityOff /> : <MdVisibility />}
                      </button>
                    </td>
                    <td>{user.role}</td>
                    <td>
                      <button className="edit-btn" aria-label="Edit User" onClick={() => handleEdit(user)}><MdEdit /></button>
                      <button className="delete-btn" aria-label="Delete User" onClick={() => handleDelete(user.id)}><MdDelete /></button>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DispUsers; 