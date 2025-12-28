import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function CitizenLogin() {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 12);
    setAadhaar(value);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (aadhaar.length !== 12) {
      toast.error('Please enter valid 12-digit Aadhaar number');
      return;
    }
    setOtpSent(true);
    toast.success('OTP sent to Aadhaar-linked mobile number');
  };

  const handleVerifyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter valid 6-digit OTP');
      return;
    }

    // Simulate login
    setUser({
      name: 'John Doe',
      aadhaar: aadhaar,
      phone: '+91 98765 43210',
      village: 'Tekkali',
      role: 'citizen'
    });

    toast.success('Login successful!');
    navigate('/citizen/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="bg-green-600 text-white py-4">
        <div className="container mx-auto px-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl">CLEAN AP</h1>
          <p className="text-green-100 mt-1">Citizen Login</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl text-gray-800 text-center mb-8">Citizen Login</h1>

            <form onSubmit={otpSent ? handleVerifyLogin : handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">Aadhaar Number</label>
                <input
                  type="text"
                  value={aadhaar}
                  onChange={handleAadhaarChange}
                  placeholder="Enter 12-digit Aadhaar Number"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  disabled={otpSent}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">Numbers only • Max length: 12 digits</p>
              </div>

              {!otpSent && (
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors"
                >
                  Send OTP
                </button>
              )}

              {otpSent && (
                <>
                  <div>
                    <label className="block text-gray-700 mb-2">OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={handleOtpChange}
                      placeholder="Enter OTP"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">Numbers only • Max length: 6 digits</p>
                  </div>

                  <p className="text-sm text-center text-green-600">
                    OTP sent to Aadhaar-linked mobile number
                  </p>

                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors"
                  >
                    Verify & Login
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}