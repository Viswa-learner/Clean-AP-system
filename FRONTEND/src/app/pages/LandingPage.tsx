import { useNavigate } from 'react-router-dom';
import { User, Users, Briefcase, Shield } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const roles = [
    {
      title: 'Citizen / Public',
      icon: User,
      path: '/citizen/login',
      description: 'Request dustbins and raise complaints'
    },
    {
      title: 'Village Staff',
      icon: Users,
      path: '/staff/login/village-staff',
      description: 'Manage dustbin requests'
    },
    {
      title: 'Cleaning Staff',
      icon: Briefcase,
      path: '/staff/login/cleaning-staff',
      description: 'Handle cleaning complaints'
    },
    {
      title: 'Admin (Internal Dashboard)',
      icon: Shield,
      path: '/staff/login/admin',
      description: 'Monitor and manage system'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl text-green-800 mb-4">CLEAN AP</h1>
          <p className="text-2xl text-gray-700">Waste Management System</p>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl text-gray-800">Select Your Role</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {roles.map((role) => (
            <button
              key={role.path}
              onClick={() => navigate(role.path)}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-green-500"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <role.icon className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl text-gray-800">{role.title}</h3>
                <p className="text-sm text-gray-600">{role.description}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center mt-16 text-gray-600">
          <p>Built for efficient waste management</p>
        </div>
      </div>
    </div>
  );
}