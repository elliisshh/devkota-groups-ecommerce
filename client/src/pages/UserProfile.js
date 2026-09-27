import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
  const user = useSelector(state => state.user); const dispatch = useDispatch(); const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || '', phone: '', address: '', city: '', state: '', zipCode: '', country: '' }); const [message, setMessage] = useState('');
  useEffect(() => { if (!user) navigate('/login'); else axios.get(`/api/users/${user.id}`).then(({ data }) => setForm({ name: data.name || '', phone: data.phone || '', address: data.address || '', city: data.city || '', state: data.state || '', zipCode: data.zipCode || '', country: data.country || '' })).catch(() => {}); }, [user, navigate]);
  const submit = async e => { e.preventDefault(); try { const { data } = await axios.put(`/api/users/${user.id}`, form); dispatch({ type: 'LOGIN_SUCCESS', payload: { ...user, ...data } }); setMessage('Profile updated successfully.'); } catch { setMessage('Could not update profile.'); } };
  return <div className="container py-12 max-w-2xl"><div className="bg-white rounded shadow p-6"><h1 className="text-3xl font-bold mb-6">My profile</h1>{message && <p className="bg-green-100 text-green-700 p-3 mb-4 rounded">{message}</p>}<form onSubmit={submit} className="grid md:grid-cols-2 gap-4">{Object.keys(form).map(key => <input key={key} name={key} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={key.replace(/([A-Z])/g, ' $1')} className="border rounded px-3 py-2" />)}<button className="md:col-span-2 bg-blue-600 text-white py-2 rounded">Save changes</button></form></div></div>;
};
export default UserProfile;
