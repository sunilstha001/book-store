import React, { useState } from 'react';
import api from '../api';
import { useAuthStore } from '../hooks/useAuthStore';

const ProfilePage = () => {

  const { user, updateUser } = useAuthStore();

  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const formData = new FormData();
    formData.append('username', username);
    if (password) {
      formData.append('password', password); 
    }
    if (profilePic) {
      formData.append('profilePic', profilePic);
    }

    try {
      const res = await api.put('/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      updateUser(res.data); 
      setSuccess('Profile updated successfully!');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="container mx-auto max-w-2xl p-4 py-8">
      

      <div className="bg-white p-8 rounded-xl shadow-lg">
        
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Your Profile
        </h2>
        

        <div className="flex justify-center mb-6">
          <img 
            src={user.profilePic || 'https://via.placeholder.com/100?text=User'}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-indigo-300"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}
          
          <div>
            <label 
              htmlFor="username" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password (Optional)
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
            />
          </div>

          <div>
            <label 
              htmlFor="profilePic" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Change Profile Picture
            </label>
            <input
              id="profilePic"
              type="file"
              accept="image/*"
              className="w-full text-sm text-gray-500 border border-gray-300 rounded-lg
                file:mr-4 file:py-3 file:px-4
                file:border-0 file:bg-gray-100
                file:text-sm file:font-semibold
                file:text-gray-700
                hover:file:bg-gray-200"
              onChange={(e) => setProfilePic(e.target.files[0])}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;