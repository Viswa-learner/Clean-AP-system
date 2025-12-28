import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Camera } from 'lucide-react';
import { toast } from 'sonner';

export default function CompleteTask() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { complaints, completeComplaint } = useApp();
  const [completionPhoto, setCompletionPhoto] = useState('');
  const [completionNote, setCompletionNote] = useState('');

  const complaint = complaints.find(c => c.id === id);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCompletionPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!completionPhoto) {
      toast.error('Please upload completion photo');
      return;
    }

    if (id) {
      completeComplaint(id, completionPhoto, completionNote);
      toast.success('Task marked as completed successfully');
      navigate('/cleaning-staff/dashboard');
    }
  };

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
            <span>Back</span>
          </button>
          <h1 className="text-2xl">Complete Task</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Original Complaint */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg text-gray-800 mb-4">Original Complaint</h2>
          <img src={complaint.photo} alt="Complaint" className="w-full rounded-lg mb-4" />
          <p className="text-gray-800">{complaint.description}</p>
        </div>

        {/* Upload Completion Photo */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg text-gray-800 mb-4">Upload Completion Photo *</h2>
          <p className="text-sm text-gray-600 mb-4">Required: Photo showing the task has been completed</p>
          {!completionPhoto ? (
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-green-500 transition-colors">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Click to upload completion photo</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          ) : (
            <div className="space-y-4">
              <img src={completionPhoto} alt="Completion" className="w-full rounded-lg" />
              <button
                onClick={() => setCompletionPhoto('')}
                className="text-red-600 hover:text-red-700"
              >
                Remove Photo
              </button>
            </div>
          )}
        </div>

        {/* Completion Note */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg text-gray-800 mb-4">Completion Note (Optional)</h2>
          <textarea
            value={completionNote}
            onChange={(e) => setCompletionNote(e.target.value)}
            placeholder="Add any notes about the completed task..."
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!completionPhoto}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Submit Completion
        </button>
      </div>
    </div>
  );
}
