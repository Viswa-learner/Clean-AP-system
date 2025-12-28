import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Package, AlertCircle, CheckCircle, Clock, Star, AlertTriangle, Truck } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, dustbinRequests, complaints, updateDustbinRequest, updateComplaint } = useApp();
  const [activeTab, setActiveTab] = useState<'assigned' | 'in-progress' | 'completed' | 'issues'>('assigned');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // UPDATE 4: Filter all tasks by status
  const assignedTasks = [
    ...dustbinRequests.filter(r => r.status === 'pending').map(r => ({ ...r, type: 'dustbin' })),
    ...complaints.filter(c => c.status === 'pending').map(c => ({ ...c, type: 'complaint' }))
  ];

  const inProgressTasks = [
    ...dustbinRequests.filter(r => r.status === 'in-progress').map(r => ({ ...r, type: 'dustbin' })),
    ...complaints.filter(c => c.status === 'in-progress').map(c => ({ ...c, type: 'complaint' }))
  ];

  const completedTasks = [
    ...dustbinRequests.filter(r => r.status === 'completed').map(r => ({ ...r, type: 'dustbin' })),
    ...complaints.filter(c => c.status === 'completed').map(c => ({ ...c, type: 'complaint' }))
  ];

  const issuesReported = [
    ...dustbinRequests.filter(r => r.status === 'issue-reported').map(r => ({ ...r, type: 'dustbin' })),
    ...complaints.filter(c => c.status === 'issue-reported').map(c => ({ ...c, type: 'complaint' }))
  ];

  const tabs = [
    { key: 'assigned', label: 'Assigned', count: assignedTasks.length, icon: Package },
    { key: 'in-progress', label: 'In Progress', count: inProgressTasks.length, icon: Truck },
    { key: 'completed', label: 'Completed', count: completedTasks.length, icon: CheckCircle },
    { key: 'issues', label: 'Issues Reported', count: issuesReported.length, icon: AlertTriangle }
  ];

  const getCurrentTasks = () => {
    if (activeTab === 'assigned') return assignedTasks;
    if (activeTab === 'in-progress') return inProgressTasks;
    if (activeTab === 'completed') return completedTasks;
    return issuesReported;
  };

  // UPDATE 4: Admin Actions
  const handleResolveIssue = (task: any) => {
    if (task.type === 'dustbin') {
      updateDustbinRequest(task.id, { status: 'completed' });
    } else {
      updateComplaint(task.id, { status: 'completed' });
    }
    toast.success('Issue resolved. User has been notified: "Your reported issue has been resolved."');
    setShowDetailModal(false);
  };

  const handleReassignTask = (task: any) => {
    toast.success('Task reassigned to another staff member');
    setShowDetailModal(false);
  };

  const handleViewDetails = (task: any) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  // Village Stats
  const villageStats = ['Tekkali', 'Village A', 'Village B', 'Village C'].map(village => {
    const allTasks = [...dustbinRequests, ...complaints].filter(t => t.village === village);
    const completed = allTasks.filter(t => t.status === 'completed');
    return {
      village,
      total: allTasks.length,
      completed: completed.length,
      pending: allTasks.length - completed.length,
      completionRate: allTasks.length > 0 ? Math.round((completed.length / allTasks.length) * 100) : 0
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* UPDATE 4: Task Detail Modal */}
      {showDetailModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl my-8">
            <h3 className="text-xl text-gray-800 mb-4">Task Details</h3>
            
            <div className="space-y-3 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Task Type</p>
                  <p className="text-gray-800 capitalize">{selectedTask.type === 'dustbin' ? 'Dustbin Request' : 'Cleaning Complaint'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Handled By</p>
                  <p className="text-gray-800">
                    {selectedTask.type === 'dustbin' ? 'Village Staff' : 'Cleaning Staff'}
                    {selectedTask.assignedTo && ` (${selectedTask.assignedTo})`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Status</p>
                  <p className="text-gray-800 capitalize">{selectedTask.status.replace('-', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">User</p>
                  <p className="text-gray-800">{selectedTask.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Village</p>
                  <p className="text-gray-800">{selectedTask.village}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-gray-800">{selectedTask.userPhone}</p>
                </div>
              </div>

              {selectedTask.expectedDate && selectedTask.expectedTime && (
                <div>
                  <p className="text-sm text-gray-600">Expected Time Slot</p>
                  <p className="text-gray-800">{selectedTask.expectedDate} at {selectedTask.expectedTime}</p>
                </div>
              )}

              {selectedTask.completedAt && (
                <div>
                  <p className="text-sm text-gray-600">Completion Date & Time</p>
                  <p className="text-gray-800">{new Date(selectedTask.completedAt).toLocaleString()}</p>
                </div>
              )}

              {selectedTask.type === 'dustbin' && (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Place Type</p>
                    <p className="text-gray-800">{selectedTask.placeType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Dustbin Types</p>
                    <p className="text-gray-800">{selectedTask.dustbinTypes.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bin Size</p>
                    <p className="text-gray-800">{selectedTask.binSize}</p>
                  </div>
                </>
              )}

              {selectedTask.type === 'complaint' && (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="text-gray-800">{selectedTask.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Before Photo</p>
                    <img src={selectedTask.photo} alt="Complaint" className="w-full max-w-md rounded-lg" />
                  </div>
                  {selectedTask.completionPhoto && (
                    <div>
                      <p className="text-sm text-gray-600">After Photo</p>
                      <img src={selectedTask.completionPhoto} alt="Completed" className="w-full max-w-md rounded-lg" />
                    </div>
                  )}
                  {selectedTask.completionNote && (
                    <div>
                      <p className="text-sm text-gray-600">Completion Note</p>
                      <p className="text-gray-800">{selectedTask.completionNote}</p>
                    </div>
                  )}
                </>
              )}

              {/* UPDATE 2, 4: Show User Rating & Feedback */}
              {selectedTask.rating && (
                <div>
                  <p className="text-sm text-gray-600">User Rating</p>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < selectedTask.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-800">({selectedTask.rating}/5)</span>
                  </div>
                </div>
              )}

              {selectedTask.feedback && (
                <div>
                  <p className="text-sm text-gray-600">User Feedback</p>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{selectedTask.feedback}</p>
                </div>
              )}

              {/* UPDATE 3, 4: Show Reported Issue Details */}
              {selectedTask.issueType && (
                <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
                  <p className="text-sm text-orange-600 mb-2">REPORTED ISSUE</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">Issue Type</p>
                      <p className="text-orange-800">{selectedTask.issueType}</p>
                    </div>
                    {selectedTask.issueDescription && (
                      <div>
                        <p className="text-sm text-gray-600">Description</p>
                        <p className="text-orange-800">{selectedTask.issueDescription}</p>
                      </div>
                    )}
                    {selectedTask.issueReportedAt && (
                      <div>
                        <p className="text-sm text-gray-600">Reported At</p>
                        <p className="text-orange-800">{new Date(selectedTask.issueReportedAt).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-600">Location</p>
                <a href={selectedTask.mapLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {selectedTask.location}
                </a>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg"
              >
                Close
              </button>
              {selectedTask.status === 'issue-reported' && (
                <>
                  <button
                    onClick={() => handleReassignTask(selectedTask)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
                  >
                    Reassign Task
                  </button>
                  <button
                    onClick={() => handleResolveIssue(selectedTask)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
                  >
                    Mark as Resolved
                  </button>
                </>
              )}
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
          <h1 className="text-2xl">Admin Dashboard</h1>
          <p className="text-green-100 mt-1">{user?.name}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <div key={tab.key} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <TabIcon className={`w-8 h-8 ${
                    tab.key === 'issues' ? 'text-orange-600' :
                    tab.key === 'completed' ? 'text-green-600' :
                    tab.key === 'in-progress' ? 'text-blue-600' :
                    'text-gray-600'
                  }`} />
                  <span className="text-3xl text-gray-800">{tab.count}</span>
                </div>
                <p className="text-gray-600">{tab.label}</p>
              </div>
            );
          })}
        </div>

        {/* UPDATE 4: Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="flex overflow-x-auto border-b border-gray-200">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex-1 min-w-fit py-4 px-6 text-center transition-colors ${
                    activeTab === tab.key
                      ? 'border-b-2 border-green-600 text-green-600'
                      : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <TabIcon className="w-5 h-5" />
                    <span>{tab.label}</span>
                    <span className="text-xs">({tab.count})</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {getCurrentTasks().length === 0 ? (
              <p className="text-gray-500 text-center py-8">No tasks in this category</p>
            ) : (
              <div className="space-y-4">
                {getCurrentTasks().map((task) => (
                  <div key={task.id} className={`border-2 rounded-lg p-4 ${
                    task.status === 'issue-reported' ? 'border-orange-300 bg-orange-50' :
                    task.status === 'completed' ? 'border-green-200 bg-green-50' :
                    task.status === 'in-progress' ? 'border-blue-200 bg-blue-50' :
                    'border-gray-200'
                  }`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm">
                            {task.type === 'dustbin' ? 'Dustbin Request' : 'Cleaning Complaint'}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            task.status === 'issue-reported' ? 'bg-orange-200 text-orange-800' :
                            task.status === 'completed' ? 'bg-green-200 text-green-800' :
                            task.status === 'in-progress' ? 'bg-blue-200 text-blue-800' :
                            'bg-yellow-200 text-yellow-800'
                          }`}>
                            {task.status.replace('-', ' ')}
                          </span>
                        </div>
                        <p className="text-gray-800 mb-1">{task.userName} - {task.village}</p>
                        <p className="text-sm text-gray-600">
                          {task.type === 'dustbin' 
                            ? `${task.placeType} - ${task.dustbinTypes.join(', ')}`
                            : task.description
                          }
                        </p>
                        {task.assignedTo && (
                          <p className="text-sm text-gray-600 mt-1">
                            Handled by: {task.assignedTo}
                          </p>
                        )}
                        {task.rating && (
                          <p className="text-sm text-yellow-600 mt-1">
                            Rating: {'⭐'.repeat(task.rating)}
                          </p>
                        )}
                        {task.issueType && (
                          <p className="text-sm text-orange-600 mt-1">
                            ⚠️ Issue: {task.issueType}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleViewDetails(task)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Village-wise Statistics */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl text-gray-800 mb-6">Village-wise Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {villageStats.map((stat) => (
              <div key={stat.village} className="border-2 border-gray-200 rounded-lg p-4">
                <h3 className="text-lg text-gray-800 mb-3">{stat.village}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Tasks</span>
                    <span className="text-gray-800">{stat.total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completed</span>
                    <span className="text-green-600">{stat.completed}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pending</span>
                    <span className="text-orange-600">{stat.pending}</span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Completion Rate</span>
                      <span className="text-gray-800">{stat.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          stat.completionRate >= 80 ? 'bg-green-600' :
                          stat.completionRate >= 50 ? 'bg-yellow-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${stat.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
