import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Home, User, Phone, CheckCircle, Clock, Package, Truck, Star, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function CitizenProfile() {
  const navigate = useNavigate();
  const { user, dustbinRequests, complaints, updateDustbinRequest, updateComplaint } = useApp();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedTaskType, setSelectedTaskType] = useState<'dustbin' | 'complaint' | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [issueType, setIssueType] = useState('');
  const [issueDescription, setIssueDescription] = useState('');

  const userRequests = dustbinRequests.filter(r => r.userId === user?.aadhaar);
  const userComplaints = complaints.filter(c => c.userId === user?.aadhaar);

  const getStatusDisplay = (status: string) => {
    const statusMap = {
      'pending': { label: 'Submitted', color: 'yellow', icon: Package },
      'approved': { label: 'Assigned', color: 'blue', icon: Clock },
      'in-progress': { label: 'In Progress', color: 'blue', icon: Truck },
      'completed': { label: 'Completed', color: 'green', icon: CheckCircle },
      'rejected': { label: 'Rejected', color: 'red', icon: Clock },
      'issue-reported': { label: 'Issue Reported', color: 'orange', icon: AlertTriangle }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap['pending'];
  };

  const handleMaskedCall = () => {
    alert('Connecting to support via masked call...\nPersonal phone numbers are hidden for privacy.');
  };

  // UPDATE 2: Service Completed Successfully - Show Feedback
  const handleServiceCompleted = (id: string, type: 'dustbin' | 'complaint') => {
    setSelectedTaskId(id);
    setSelectedTaskType(type);
    setShowFeedbackModal(true);
  };

  // UPDATE 3: Report Issue
  const handleReportIssue = (id: string, type: 'dustbin' | 'complaint') => {
    setSelectedTaskId(id);
    setSelectedTaskType(type);
    setShowIssueModal(true);
  };

  // UPDATE 2: Submit Feedback
  const submitFeedback = () => {
    if (rating === 0) {
      toast.error('Please provide a rating');
      return;
    }

    if (selectedTaskId && selectedTaskType) {
      if (selectedTaskType === 'dustbin') {
        updateDustbinRequest(selectedTaskId, { rating, feedback });
      } else {
        updateComplaint(selectedTaskId, { rating, feedback });
      }
      
      toast.success('Thank you for your feedback!');
      setShowFeedbackModal(false);
      setRating(0);
      setFeedback('');
      setSelectedTaskId(null);
      setSelectedTaskType(null);
    }
  };

  // UPDATE 3: Submit Issue Report
  const submitIssue = () => {
    if (!issueType) {
      toast.error('Please select an issue type');
      return;
    }

    if (selectedTaskId && selectedTaskType) {
      const updates = {
        status: 'issue-reported' as any,
        issueType,
        issueDescription,
        issueReportedAt: new Date()
      };

      if (selectedTaskType === 'dustbin') {
        updateDustbinRequest(selectedTaskId, updates);
      } else {
        updateComplaint(selectedTaskId, updates);
      }
      
      toast.success('Your issue has been reported. Our team will review it shortly.');
      setShowIssueModal(false);
      setIssueType('');
      setIssueDescription('');
      setSelectedTaskId(null);
      setSelectedTaskType(null);
    }
  };

  const issueTypes = [
    'Work not done',
    'Partially done',
    'Poor quality work',
    'Wrong completion marked',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* UPDATE 2: Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl text-gray-800 mb-4">Rate Your Experience</h3>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-3">How satisfied are you with the service?</p>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Feedback (Optional)</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your experience..."
                rows={3}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowFeedbackModal(false);
                  setRating(0);
                  setFeedback('');
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={submitFeedback}
                disabled={rating === 0}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg disabled:bg-gray-300"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE 3: Issue Report Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl text-gray-800 mb-4">Report Service Issue</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Issue Type</label>
              <div className="space-y-2">
                {issueTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setIssueType(type)}
                    className={`w-full px-4 py-2 rounded-lg border-2 text-left transition-colors ${
                      issueType === type
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 hover:border-red-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Description (Optional)</label>
              <textarea
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                placeholder="Describe the issue in detail..."
                rows={3}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowIssueModal(false);
                  setIssueType('');
                  setIssueDescription('');
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={submitIssue}
                disabled={!issueType}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg disabled:bg-gray-300"
              >
                Submit Issue
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-green-600 text-white py-4">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/citizen/home')}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl">Profile</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* User Info */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
          <h2 className="text-xl text-gray-800 mb-4">Personal Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="text-gray-800">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Aadhaar Number</p>
              <p className="text-gray-800">**** **** {user?.aadhaar.slice(-4)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="text-gray-800">{user?.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Village</p>
              <p className="text-gray-800">{user?.village}</p>
            </div>
          </div>
        </div>

        {/* My Complaints */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
          <h2 className="text-xl text-gray-800 mb-4">My Complaints</h2>
          {userComplaints.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No complaints raised yet</p>
          ) : (
            <div className="space-y-4">
              {userComplaints.map((complaint) => {
                const statusInfo = getStatusDisplay(complaint.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <div key={complaint.id} className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex gap-4 mb-4">
                      <img src={complaint.photo} alt="Complaint" className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-gray-800 mb-2">{complaint.description}</p>
                        
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                          statusInfo.color === 'green' 
                            ? 'bg-green-100 text-green-800'
                            : statusInfo.color === 'blue'
                            ? 'bg-blue-100 text-blue-800'
                            : statusInfo.color === 'red'
                            ? 'bg-red-100 text-red-800'
                            : statusInfo.color === 'orange'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          <StatusIcon className="w-4 h-4" />
                          {statusInfo.label}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Assigned To:</span>
                        <span className="text-gray-800">Cleaning Staff</span>
                      </div>
                      
                      {complaint.expectedDate && complaint.expectedTime && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Expected Service Date:</span>
                            <span className="text-gray-800">{complaint.expectedDate}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Expected Time Slot:</span>
                            <span className="text-gray-800">{complaint.expectedTime}</span>
                          </div>
                        </>
                      )}

                      {complaint.rating && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Your Rating:</span>
                          <span className="text-yellow-600">{'⭐'.repeat(complaint.rating)}</span>
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-2">
                        Staff contact details are hidden for privacy.
                      </p>

                      {complaint.status === 'in-progress' && (
                        <button
                          onClick={handleMaskedCall}
                          className="w-full mt-3 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                        >
                          <Phone className="w-4 h-4" />
                          Call Support
                        </button>
                      )}

                      {/* UPDATE 2, 3: Show options after completion */}
                      {complaint.status === 'completed' && !complaint.rating && !complaint.issueType && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleServiceCompleted(complaint.id, 'complaint')}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
                          >
                            Service Completed Successfully
                          </button>
                          <button
                            onClick={() => handleReportIssue(complaint.id, 'complaint')}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
                          >
                            Report Issue
                          </button>
                        </div>
                      )}

                      {complaint.status === 'issue-reported' && (
                        <div className="bg-orange-50 p-3 rounded-lg mt-3">
                          <p className="text-sm text-orange-800">
                            <strong>Reported Issue:</strong> {complaint.issueType}
                          </p>
                          {complaint.issueDescription && (
                            <p className="text-sm text-orange-700 mt-1">{complaint.issueDescription}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {complaint.completionPhoto && (
                      <div className="mt-3 border-t border-gray-200 pt-3">
                        <p className="text-sm text-green-600 mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Problem Solved
                        </p>
                        <img src={complaint.completionPhoto} alt="Completed" className="w-full rounded-lg" />
                        {complaint.completionNote && (
                          <p className="text-sm text-gray-600 mt-2">{complaint.completionNote}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* My Dustbin Requests */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
          <h2 className="text-xl text-gray-800 mb-4">My Dustbin Requests</h2>
          {userRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No dustbin requests yet</p>
          ) : (
            <div className="space-y-4">
              {userRequests.map((request) => {
                const statusInfo = getStatusDisplay(request.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <div key={request.id} className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-gray-800 mb-1">{request.placeType}</p>
                        <p className="text-sm text-gray-600">
                          {request.dustbinTypes.join(', ')}
                        </p>
                        <p className="text-sm text-gray-600">Size: {request.binSize}</p>
                      </div>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                        statusInfo.color === 'green'
                          ? 'bg-green-100 text-green-800'
                          : statusInfo.color === 'blue'
                          ? 'bg-blue-100 text-blue-800'
                          : statusInfo.color === 'red'
                          ? 'bg-red-100 text-red-800'
                          : statusInfo.color === 'orange'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusInfo.label}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Assigned To:</span>
                        <span className="text-gray-800">Village Staff</span>
                      </div>
                      
                      {request.expectedDate && request.expectedTime && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Expected Service Date:</span>
                            <span className="text-gray-800">{request.expectedDate}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Expected Time Slot:</span>
                            <span className="text-gray-800">{request.expectedTime}</span>
                          </div>
                        </>
                      )}

                      {request.rating && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Your Rating:</span>
                          <span className="text-yellow-600">{'⭐'.repeat(request.rating)}</span>
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-2">
                        Staff contact details are hidden for privacy.
                      </p>

                      {request.status === 'in-progress' && (
                        <button
                          onClick={handleMaskedCall}
                          className="w-full mt-3 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                        >
                          <Phone className="w-4 h-4" />
                          Call Support
                        </button>
                      )}

                      {/* UPDATE 2, 3: Show options after completion */}
                      {request.status === 'completed' && !request.rating && !request.issueType && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleServiceCompleted(request.id, 'dustbin')}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
                          >
                            Service Completed Successfully
                          </button>
                          <button
                            onClick={() => handleReportIssue(request.id, 'dustbin')}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
                          >
                            Report Issue
                          </button>
                        </div>
                      )}

                      {request.status === 'issue-reported' && (
                        <div className="bg-orange-50 p-3 rounded-lg mt-3">
                          <p className="text-sm text-orange-800">
                            <strong>Reported Issue:</strong> {request.issueType}
                          </p>
                          {request.issueDescription && (
                            <p className="text-sm text-orange-700 mt-1">{request.issueDescription}</p>
                          )}
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-gray-500 mt-3">
                      {new Date(request.createdAt).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            navigate('/');
          }}
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
              onClick={() => navigate('/citizen/home')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-green-600"
            >
              <Home className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </button>
            <button
              onClick={() => navigate('/citizen/profile')}
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
