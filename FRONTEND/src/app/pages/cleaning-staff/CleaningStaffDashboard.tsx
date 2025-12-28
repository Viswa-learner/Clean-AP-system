import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Home, User, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function CleaningStaffDashboard() {
  const navigate = useNavigate();
  const { user, complaints, updateComplaintStatus, updateComplaint } = useApp();
  const [activeTab, setActiveTab] = useState<'assigned' | 'in-progress' | 'completed'>('assigned');
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);
  const [showTimeDialog, setShowTimeDialog] = useState(false);
  const [expectedDate, setExpectedDate] = useState('');
  const [expectedTime, setExpectedTime] = useState('');

  const assignedComplaints = complaints.filter(c => c.status === 'pending');
  const inProgressComplaints = complaints.filter(c => c.status === 'in-progress' && c.assignedTo === user?.name);
  const completedComplaints = complaints.filter(c => c.status === 'completed' && c.assignedTo === user?.name);

  const tabs = [
    { key: 'assigned', label: 'Assigned', count: assignedComplaints.length },
    { key: 'in-progress', label: 'In Progress', count: inProgressComplaints.length },
    { key: 'completed', label: 'Completed', count: completedComplaints.length }
  ];

  const getCurrentComplaints = () => {
    if (activeTab === 'assigned') return assignedComplaints;
    if (activeTab === 'in-progress') return inProgressComplaints;
    return completedComplaints;
  };

  // UPDATE 6: Accept Task and Set Time
  const handleAcceptTask = (id: string) => {
    setSelectedComplaint(id);
    setShowTimeDialog(true);
  };

  const handleSetTime = () => {
    if (!selectedComplaint || !expectedDate || !expectedTime) {
      toast.error('Please select both date and time slot');
      return;
    }

    updateComplaint(selectedComplaint, {
      status: 'in-progress',
      assignedTo: user?.name,
      expectedDate,
      expectedTime
    });

    // UPDATE 7: Notifications
    toast.success(`Cleaning scheduled for ${expectedDate}, ${expectedTime}. User and village staff have been notified.`);
    
    setShowTimeDialog(false);
    setSelectedComplaint(null);
    setExpectedDate('');
    setExpectedTime('');
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
      {/* Time Slot Dialog - UPDATE 6 */}
      {showTimeDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl text-gray-800 mb-4">Set Expected Cleaning Time</h3>
            
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
                  setSelectedComplaint(null);
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
                Accept & Set Time
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
          <h1 className="text-2xl">Cleaning Staff Dashboard</h1>
          <p className="text-green-100 mt-1">{user?.name}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Tabs */}
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
        </div>

        {/* Complaints List */}
        <div className="space-y-4">
          {getCurrentComplaints().length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <p className="text-gray-500">No complaints in this category</p>
            </div>
          ) : (
            getCurrentComplaints().map((complaint) => (
              <div key={complaint.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex gap-4 mb-4">
                  <img src={complaint.photo} alt="Complaint" className="w-32 h-32 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-gray-800 mb-2">{complaint.description}</p>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>User:</strong> {complaint.userName}</p>
                      <p><strong>Phone:</strong> {complaint.userPhone}</p>
                      <p><strong>Location:</strong> {complaint.location}</p>
                      <p>
                        <a href={complaint.mapLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View on Google Maps
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Show scheduled time if set */}
                {complaint.expectedDate && complaint.expectedTime && (
                  <div className="bg-blue-50 p-3 rounded-lg mb-4">
                    <p className="text-sm text-blue-800 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Scheduled: {complaint.expectedDate} at {complaint.expectedTime}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  {activeTab === 'assigned' && (
                    <button
                      onClick={() => handleAcceptTask(complaint.id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                    >
                      Accept & Set Time
                    </button>
                  )}
                  {activeTab === 'in-progress' && (
                    <button
                      onClick={() => navigate(`/cleaning-staff/complete/${complaint.id}`)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
                    >
                      Mark as Completed
                    </button>
                  )}
                  {activeTab === 'completed' && complaint.completionPhoto && (
                    <div className="w-full">
                      <p className="text-sm text-gray-600 mb-2">Completion Photo:</p>
                      <img src={complaint.completionPhoto} alt="Completed" className="w-full rounded-lg" />
                      {complaint.completionNote && (
                        <p className="text-sm text-gray-600 mt-2">Note: {complaint.completionNote}</p>
                      )}
                    </div>
                  )}
                  <button
                    onClick={() => navigate(`/cleaning-staff/task/${complaint.id}`)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Navigation - UPDATE 9 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-4">
            <button
              onClick={() => navigate('/cleaning-staff/dashboard')}
              className="flex flex-col items-center gap-1 text-green-600"
            >
              <Home className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </button>
            <button
              onClick={() => navigate('/cleaning-staff/profile')}
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
