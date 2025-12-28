import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Home, User } from 'lucide-react';

export default function CleaningStaffProfile() {
  const navigate = useNavigate();
  const { user } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-green-600 text-white py-4">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/cleaning-staff/dashboard')}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl">Profile</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Staff Info */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
          <h2 className="text-xl text-gray-800 mb-4">Staff Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Staff ID</p>
              <p className="text-gray-800">CS-{user?.aadhaar || '001'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="text-gray-800">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Role</p>
              <p className="text-gray-800">Cleaning Staff</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Assigned Village</p>
              <p className="text-gray-800">{user?.village}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="text-gray-800">{user?.phone}</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => navigate('/')}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-4">
            <button
              onClick={() => navigate('/cleaning-staff/dashboard')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-green-600"
            >
              <Home className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </button>
            <button
              onClick={() => navigate('/cleaning-staff/profile')}
              className="flex flex-col items-center gap-1 text-green-600"
            >
              <User className="w-6 h-6" />
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
