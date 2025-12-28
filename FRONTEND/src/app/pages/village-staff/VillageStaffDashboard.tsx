import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Package, AlertCircle, Check, X, Clock, User, Home, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function VillageStaffDashboard() {
  const navigate = useNavigate();
  const { user, dustbinRequests, complaints, updateDustbinRequest } = useApp();
  const [activeTab, setActiveTab] = useState<'assigned' | 'in-progress' | 'completed'>('assigned');
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [showTimeDialog, setShowTimeDialog] = useState(false);
  const [expectedDate, setExpectedDate] = useState('');
  const [expectedTime, setExpectedTime] = useState('');

  // UPDATE 1: Separated by status
  const assignedRequests = dustbinRequests.filter(r => r.status === 'pending');
  const inProgressRequests = dustbinRequests.filter(r => r.status === 'in-progress');
  const completedRequests = dustbinRequests.filter(r => r.status === 'completed');
  const staffComplaints = complaints.filter(c => c.village === user?.village);

  const tabs = [
    { key: 'assigned', label: 'Assigned', count: assignedRequests.length },
    { key: 'in-progress', label: 'In Progress', count: inProgressRequests.length },
    { key: 'completed', label: 'Completed', count: completedRequests.length }
  ];

  const getCurrentRequests = () => {
    if (activeTab === 'assigned') return assignedRequests;
    if (activeTab === 'in-progress') return inProgressRequests;
    return completedRequests;
  };

  // UPDATE 1: Approve Request - changes status to "in-progress"
  const handleApprove = (id: string) => {
    setSelectedRequest(id);
    setShowTimeDialog(true);
  };

  // Set Expected Time and change to In Progress
  const handleSetTime = () => {
    if (!selectedRequest || !expectedDate || !expectedTime) {
      toast.error('Please select both date and time slot');
      return;
    }

    updateDustbinRequest(selectedRequest, {
      status: 'in-progress',
      expectedDate,
      expectedTime,
      assignedTo: user?.name || 'Village Staff'
    });

    toast.success(`Service scheduled for ${expectedDate}, ${expectedTime}. User has been notified.`);
    
    setShowTimeDialog(false);
    setSelectedRequest(null);
    setExpectedDate('');
    setExpectedTime('');
  };

  // UPDATE 1: Mark as Completed
  const handleComplete = (id: string) => {
    updateDustbinRequest(id, {
      status: 'completed',
      completedAt: new Date()
    });
    toast.success('Request marked as completed');
  };

  const handleReject = (id: string) => {
    updateDustbinRequest(id, {
      status: 'rejected'
    });
    toast.error('Request rejected');
  };

  const timeSlots = [
    '8 AM - 10 AM',
    '10 AM - 12 PM',
    '12 PM - 2 PM',
    '2 PM - 4 PM',
    '4 PM - 6 PM'
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Time Slot Dialog */}
      {showTimeDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl text-gray-800 mb-4">Set Expected Visit Time</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Expected Date</label>
              <input
                type="date"
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Time Slot</label>
              <div className="grid grid-cols-1 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setExpectedTime(slot)}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                      expectedTime === slot
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-green-300'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowTimeDialog(false);
                  setSelectedRequest(null);
                  setExpectedDate('');
                  setExpectedTime('');
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSetTime}
                disabled={!expectedDate || !expectedTime}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg disabled:bg-gray-300"
              >
                Approve & Set Time
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-green-600 text-white py-4">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Logout</span>
          </button>
          <h1 className="text-2xl">Village Staff Dashboard</h1>
          <p className="text-green-100 mt-1">{user?.name}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <Package className="w-8 h-8 text-blue-600 mb-2" />
            <p className="text-gray-600">Assigned</p>
            <p className="text-3xl text-gray-800">{assignedRequests.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <Clock className="w-8 h-8 text-orange-600 mb-2" />
            <p className="text-gray-600">In Progress</p>
            <p className="text-3xl text-gray-800">{inProgressRequests.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
            <p className="text-gray-600">Completed</p>
            <p className="text-3xl text-gray-800">{completedRequests.length}</p>
          </div>
        </div>

        {/* UPDATE 1: Tabs for Dustbin Requests */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 py-4 px-6 text-center transition-colors ${
                  activeTab === tab.key
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                <span className="block">{tab.label}</span>
                <span className="text-xs">({tab.count})</span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {getCurrentRequests().length === 0 ? (
              <p className="text-gray-500 text-center py-8">No requests in this category</p>
            ) : (
              <div className="space-y-4">
                {getCurrentRequests().map((request) => (
                  <div key={request.id} className={`border-2 rounded-lg p-4 ${
                    activeTab === 'completed' ? 'border-green-200 bg-green-50' : 'border-gray-200'
                  }`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">User Name</p>
                        <p className="text-gray-800">{request.userName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="text-gray-800">{request.userPhone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Village</p>
                        <p className="text-gray-800">{request.village}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Place Type</p>
                        <p className="text-gray-800">{request.placeType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Dustbin Types</p>
                        <p className="text-gray-800">{request.dustbinTypes.join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Bin Size</p>
                        <p className="text-gray-800">{request.binSize}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">Location</p>
                        <a href={request.mapLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {request.location}
                        </a>
                      </div>
                    </div>
                    
                    {request.expectedDate && request.expectedTime && (
                      <div className="bg-blue-50 p-3 rounded-lg mb-3">
                        <p className="text-sm text-blue-800 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Scheduled: {request.expectedDate} at {request.expectedTime}
                        </p>
                      </div>
                    )}

                    {/* UPDATE 1: Show completion details */}
                    {activeTab === 'completed' && (
                      <div className="bg-green-100 p-3 rounded-lg mb-3">
                        <p className="text-sm text-green-800 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Completed on: {request.completedAt ? new Date(request.completedAt).toLocaleString() : 'N/A'}
                        </p>
                        {request.rating && (
                          <p className="text-sm text-green-800 mt-1">
                            User Rating: {'⭐'.repeat(request.rating)}
                          </p>
                        )}
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    {activeTab === 'assigned' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                        >
                          <Check className="w-5 h-5" />
                          Approve & Set Time
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                        >
                          <X className="w-5 h-5" />
                          Reject
                        </button>
                      </div>
                    )}

                    {activeTab === 'in-progress' && (
                      <button
                        onClick={() => handleComplete(request.id)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Complaints (View Only) */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl text-gray-800 mb-4">Cleaning Complaints (Information Only)</h2>
          <p className="text-gray-600 mb-4">Cleaning staff is handling these issues</p>
          {staffComplaints.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No complaints</p>
          ) : (
            <div className="space-y-4">
              {staffComplaints.map((complaint) => (
                <div key={complaint.id} className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex gap-4">
                    <img src={complaint.photo} alt="Complaint" className="w-24 h-24 object-cover rounded-lg" />
                    <div className="flex-1">
                      <p className="text-gray-800 mb-1">{complaint.description}</p>
                      <p className="text-sm text-gray-600 mb-2">{complaint.location}</p>
                      
                      {complaint.expectedDate && complaint.expectedTime && (
                        <p className="text-sm text-blue-600 mb-2">
                          Scheduled: {complaint.expectedDate} at {complaint.expectedTime}
                        </p>
                      )}
                      
                      <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                        complaint.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : complaint.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {complaint.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-4">
            <button
              onClick={() => navigate('/village-staff/dashboard')}
              className="flex flex-col items-center gap-1 text-green-600"
            >
              <Home className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </button>
            <button
              onClick={() => navigate('/village-staff/profile')}
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
