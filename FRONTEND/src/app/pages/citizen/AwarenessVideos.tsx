import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play } from 'lucide-react';

export default function AwarenessVideos() {
  const navigate = useNavigate();

  const videos = [
    { id: 1, title: 'Waste Segregation Basics', duration: '5:30', thumbnail: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=250&fit=crop' },
    { id: 2, title: 'Composting at Home', duration: '8:15', thumbnail: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400&h=250&fit=crop' },
    { id: 3, title: 'Recycling Plastic Waste', duration: '6:45', thumbnail: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=400&h=250&fit=crop' },
    { id: 4, title: 'Proper Disposal Methods', duration: '7:20', thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=250&fit=crop' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-green-600 text-white py-4">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/citizen/home')}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl">CLEAN AP</h1>
          <p className="text-green-100 mt-1">Awareness Videos</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative group cursor-pointer">
                <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-50 transition-all">
                  <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-green-600 ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                  {video.duration}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg text-gray-800">{video.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}