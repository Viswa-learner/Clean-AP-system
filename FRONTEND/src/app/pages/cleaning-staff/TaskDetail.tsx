import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, MapPin } from 'lucide-react';

export default function TaskDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { complaints } = useApp();

  const complaint = complaints.find(c => c.id === id);

  if (!complaint) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Complaint not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-600 text-white py-4">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/cleaning-staff/dashboard')}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl">Task Details</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl text-gray-800 mb-4">Complaint Photo</h2>
          <img src={complaint.photo} alt="Complaint" className="w-full rounded-lg mb-4" />
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Description</p>
              <p className="text-gray-800">{complaint.description}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">User Name</p>
              <p className="text-gray-800">{complaint.userName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="text-gray-800">{complaint.userPhone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Village</p>
              <p className="text-gray-800">{complaint.village}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="text-gray-800 mb-2">{complaint.location}</p>
              <a
                href={complaint.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:underline"
              >
                <MapPin className="w-4 h-4" />
                Open in Google Maps
              </a>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
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
            {complaint.completionPhoto && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Completion Photo</p>
                <img src={complaint.completionPhoto} alt="Completed" className="w-full rounded-lg" />
                {complaint.completionNote && (
                  <p className="text-gray-800 mt-2">Note: {complaint.completionNote}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {complaint.status === 'in-progress' && (
          <button
            onClick={() => navigate(`/cleaning-staff/complete/${complaint.id}`)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
          >
            Mark as Completed
          </button>
        )}
      </div>
    </div>
  );
}
