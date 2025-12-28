import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function StaffLogin() {
  const navigate = useNavigate();
  const { role } = useParams<{ role: string }>();
  const { setUser } = useApp();
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');

  const roleLabels = {
    'village-staff': 'Village Staff',
    'cleaning-staff': 'Cleaning Staff',
    'admin': 'Admin'
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!staffId || !password) {
      toast.error('Please enter both Staff ID and Password');
      return;
    }

    setUser({
      name: role === 'admin' ? 'Admin User' : `${roleLabels[role as keyof typeof roleLabels]} Member`,
      aadhaar: '',
      phone: '+91 98765 43210',
      village: 'Tekkali',
      role: role as any
    });

    toast.success('Login successful!');
    
    if (role === 'village-staff') {
      navigate('/village-staff/dashboard');
    } else if (role === 'cleaning-staff') {
      navigate('/cleaning-staff/dashboard');
    } else if (role === 'admin') {
      navigate('/admin/dashboard');
    }
  };

  const roleTitle = roleLabels[role as keyof typeof roleLabels];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="bg-green-600 text-white py-4">
        <div className="container mx-auto px-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl">CLEAN AP</h1>
          <p className="text-green-100 mt-1">{roleTitle} Login</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl text-gray-800 text-center mb-8">
              {roleLabels[role as keyof typeof roleLabels]} Login
            </h1>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">
                  {role === 'admin' ? 'Admin ID' : 'Staff ID'}
                </label>
                <input
                  type="text"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  placeholder={`Enter ${role === 'admin' ? 'Admin' : 'Staff'} ID`}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}