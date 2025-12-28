import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Camera, MapPin, Mic, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function RaiseComplaint() {
  const navigate = useNavigate();
  const { user, addComplaint } = useApp();
  const [photo, setPhoto] = useState('');
  const [locationGranted, setLocationGranted] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [mapLink, setMapLink] = useState('https://maps.google.com/?q=AITAM+College+Tekkali');
  const [description, setDescription] = useState('');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const requestLocation = () => {
    setShowLocationDialog(true);
  };

  const allowLocation = () => {
    setShowLocationDialog(false);
    setLocationGranted(true);
    toast.success('Location detected successfully');
  };

  const handleSubmit = () => {
    if (!photo || !locationGranted || !description.trim()) {
      toast.error('Please complete all fields');
      return;
    }

    const complaint = {
      id: Date.now().toString(),
      userId: user?.aadhaar || '',
      userName: user?.name || '',
      userPhone: user?.phone || '',
      village: user?.village || '',
      photo: photo,
      location: 'AITAM College, Tekkali',
      mapLink: mapLink,
      description: description,
      status: 'pending',
      createdAt: new Date()
    };

    addComplaint(complaint);
    toast.success('Complaint registered successfully. Cleaning staff will resolve the issue shortly.');
    navigate('/citizen/home');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Location Permission Dialog - UPDATE 2 */}
      {showLocationDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl text-gray-800 mb-4">Allow CLEAN AP to access your location?</h3>
            <p className="text-gray-600 mb-6 text-sm">This helps us identify the exact location of the complaint for faster resolution.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLocationDialog(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg"
              >
                Don't Allow
              </button>
              <button
                onClick={allowLocation}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
              >
                Allow
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
          <h1 className="text-2xl">CLEAN AP - Raise Complaint</h1>
          <p className="text-green-100 mt-1">Report waste management issue</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Step 1: Upload Photo */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
          <h2 className="text-lg text-gray-800 mb-4">Upload Complaint Photo *</h2>
          {!photo ? (
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-green-500 transition-colors">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Click to upload photo</p>
                <p className="text-sm text-gray-500 mt-2">Required</p>
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
              <img src={photo} alt="Complaint" className="w-full rounded-lg" />
              <button
                onClick={() => setPhoto('')}
                className="text-red-600 hover:text-red-700"
              >
                Remove Photo
              </button>
            </div>
          )}
        </div>

        {/* Step 2: Location */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
          <h2 className="text-lg text-gray-800 mb-4">Location</h2>
          {!locationGranted ? (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <p className="text-gray-700 mb-6">Allow location access</p>
              <button
                onClick={requestLocation}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
              >
                Allow Location Access
              </button>
            </div>
          ) : (
            <div>
              <div className="bg-green-50 border-2 border-green-200 p-4 rounded-lg mb-4">
                <p className="text-green-800 flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Location detected successfully
                </p>
              </div>

              <p className="text-gray-700 mb-4">Default Location: AITAM College, Tekkali</p>
              
              <label className="block text-gray-700 mb-2">Google Maps Link</label>
              <input
                type="url"
                value={mapLink}
                onChange={(e) => setMapLink(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              />
              <p className="text-sm text-gray-500 mt-2">You can change the location link if needed</p>
            </div>
          )}
        </div>

        {/* Step 3: Description */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg text-gray-800">Description *</h2>
            <button className="flex items-center gap-2 text-green-600 hover:text-green-700">
              <Mic className="w-5 h-5" />
              <span className="text-sm">Voice</span>
            </button>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue..."
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none resize-none"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!photo || !locationGranted || !description.trim()}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Submit Complaint
        </button>
      </div>
    </div>
  );
}