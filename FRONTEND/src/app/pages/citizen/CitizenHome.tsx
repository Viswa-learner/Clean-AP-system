import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Trash2, AlertCircle, Video, Home, User, ArrowLeft } from 'lucide-react';

export default function CitizenHome() {
  const navigate = useNavigate();
  const { user } = useApp();

  const cards = [
    {
      title: 'Request Dustbin',
      icon: Trash2,
      path: '/citizen/request-dustbin',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Raise Complaint',
      icon: AlertCircle,
      path: '/citizen/raise-complaint',
      color: 'bg-red-100 text-red-600'
    },
    {
      title: 'Awareness Videos',
      icon: Video,
      path: '/citizen/awareness',
      color: 'bg-blue-100 text-blue-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white py-4">
        <div className="container mx-auto px-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>Logout</span>
          </button>
          <h1 className="text-2xl">CLEAN AP</h1>
          <p className="text-green-100 mt-1">Welcome, {user?.name}</p>
        </div>
      </div>

      {/* Main Cards */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {cards.map((card) => (
            <button
              key={card.path}
              onClick={() => navigate(card.path)}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${card.color}`}>
                  <card.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl text-gray-800">{card.title}</h3>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-4">
            <button
              onClick={() => navigate('/citizen/home')}
              className="flex flex-col items-center gap-1 text-green-600"
            >
              <Home className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </button>
            <button
              onClick={() => navigate('/citizen/profile')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-green-600"
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