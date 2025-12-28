import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, MapPin, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function RequestDustbin() {
  const navigate = useNavigate();
  const { user, addDustbinRequest } = useApp();
  const [step, setStep] = useState(1);
  const [placeType, setPlaceType] = useState('');
  const [selectedBins, setSelectedBins] = useState<string[]>([]);
  const [locationGranted, setLocationGranted] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [mapLink, setMapLink] = useState('https://maps.google.com/?q=AITAM+College+Tekkali');

  const placeTypes = [
    { value: 'home', label: 'Home', size: 'Small' },
    { value: 'shop', label: 'Shop', size: 'Medium' },
    { value: 'school-hospital', label: 'School / Hospital', size: 'Large' },
    { value: 'function', label: 'Function', size: 'Extra Large (Temporary Event)' }
  ];

  const dustbinTypes = [
    { value: 'green', label: 'Green Dustbin', subtext: 'Wet Waste', icon: '🟢', desc: 'Kitchen / food waste' },
    { value: 'blue', label: 'Blue Dustbin', subtext: 'Dry Waste', icon: '🔵', desc: 'Plastic / bottle' },
    { value: 'red', label: 'Red Dustbin', subtext: 'Sanitary Waste', icon: '🔴', desc: 'Medical / sanitary' }
  ];

  const getBinSize = () => {
    const selected = placeTypes.find(p => p.value === placeType);
    return selected?.size || '';
  };

  const toggleBin = (bin: string) => {
    if (selectedBins.includes(bin)) {
      setSelectedBins(selectedBins.filter(b => b !== bin));
    } else {
      setSelectedBins([...selectedBins, bin]);
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
    if (!placeType || selectedBins.length === 0 || !locationGranted) {
      toast.error('Please complete all steps');
      return;
    }

    const request = {
      id: Date.now().toString(),
      userId: user?.aadhaar || '',
      userName: user?.name || '',
      userPhone: user?.phone || '',
      village: user?.village || '',
      placeType: placeTypes.find(p => p.value === placeType)?.label || '',
      dustbinTypes: selectedBins.map(b => dustbinTypes.find(d => d.value === b)?.label || ''),
      binSize: getBinSize(),
      location: 'AITAM College, Tekkali',
      mapLink: mapLink,
      status: 'pending',
      createdAt: new Date(),
      assignedTo: 'Village Staff'
    };

    addDustbinRequest(request);
    toast.success('Dustbin request submitted successfully and sent to village staff and admin');
    navigate('/citizen/home');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Location Permission Dialog - UPDATE 2 */}
      {showLocationDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl text-gray-800 mb-4">Allow CLEAN AP to access your location?</h3>
            <p className="text-gray-600 mb-6 text-sm">This helps us serve you better by identifying your exact location for dustbin placement.</p>
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
            onClick={() => step === 1 ? navigate('/citizen/home') : setStep(step - 1)}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl">CLEAN AP - Request Dustbin</h1>
          <p className="text-green-100 mt-1">Step {step} of 4</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Step 1: Place Type */}
        {step === 1 && (
          <div>
            <h2 className="text-xl text-gray-800 mb-6">Select Place Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {placeTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setPlaceType(type.value)}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    placeType === type.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-green-300'
                  }`}
                >
                  <h3 className="text-lg text-gray-800 mb-1">{type.label}</h3>
                  <p className="text-sm text-gray-600">Size: {type.size}</p>
                </button>
              ))}
            </div>
            {placeType && (
              <button
                onClick={() => setStep(2)}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
              >
                Continue
              </button>
            )}
          </div>
        )}

        {/* Step 2: Dustbin Selection - UPDATE 1: WITH CHECKBOXES */}
        {step === 2 && (
          <div>
            <h2 className="text-xl text-gray-800 mb-4">Select Dustbin Types</h2>
            <p className="text-gray-600 mb-6">You can select multiple dustbins</p>
            <div className="space-y-4">
              {dustbinTypes.map((bin) => (
                <button
                  key={bin.value}
                  onClick={() => toggleBin(bin.value)}
                  className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                    selectedBins.includes(bin.value)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-green-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* CHECKBOX - UPDATE 1 */}
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                      selectedBins.includes(bin.value)
                        ? 'bg-green-600 border-green-600'
                        : 'border-gray-300 bg-white'
                    }`}>
                      {selectedBins.includes(bin.value) && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                    
                    <span className="text-4xl flex-shrink-0">{bin.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-lg text-gray-800">{bin.label}</h3>
                      <p className="text-green-600">{bin.subtext}</p>
                      <p className="text-sm text-gray-600 mt-1">{bin.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Bin Size:</strong> {getBinSize()}
              </p>
            </div>
            {selectedBins.length > 0 && (
              <button
                onClick={() => setStep(3)}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
              >
                Continue
              </button>
            )}
          </div>
        )}

        {/* Step 3: Location - UPDATE 2: IMPROVED LOCATION HANDLING */}
        {step === 3 && (
          <div>
            <h2 className="text-xl text-gray-800 mb-6">Location Access</h2>
            {!locationGranted ? (
              <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <MapPin className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <p className="text-gray-700 mb-6">
                  We need your location to process the dustbin request
                </p>
                <button
                  onClick={requestLocation}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg"
                >
                  Allow Location Access
                </button>
              </div>
            ) : (
              <div>
                <div className="bg-green-50 border-2 border-green-200 p-4 rounded-lg mb-6">
                  <p className="text-green-800 flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    Location detected successfully
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg mb-4">
                  <h3 className="text-lg text-gray-800 mb-4">Default Location</h3>
                  <p className="text-gray-700 mb-4">AITAM College, Tekkali</p>
                  
                  {/* Static Map Preview */}
                  <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800&h=450&fit=crop" 
                      alt="Map Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    AITAM College, Tekkali
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
                  <label className="block text-gray-700 mb-2">Google Maps Link</label>
                  <input
                    type="url"
                    value={mapLink}
                    onChange={(e) => setMapLink(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                  <p className="text-sm text-gray-500 mt-2">You can change the location link if needed</p>
                  <button
                    onClick={() => {}}
                    className="mt-3 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Change Location
                  </button>
                </div>

                <button
                  onClick={() => setStep(4)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div>
            <h2 className="text-xl text-gray-800 mb-6">Confirm Details</h2>
            <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="text-gray-800">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone Number</p>
                <p className="text-gray-800">{user?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Village</p>
                <p className="text-gray-800">{user?.village}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Place Type</p>
                <p className="text-gray-800">{placeTypes.find(p => p.value === placeType)?.label}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Dustbin Types</p>
                <p className="text-gray-800">{selectedBins.map(b => dustbinTypes.find(d => d.value === b)?.label).join(', ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bin Size</p>
                <p className="text-gray-800">{getBinSize()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="text-gray-800">AITAM College, Tekkali</p>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
            >
              Submit Dustbin Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
}