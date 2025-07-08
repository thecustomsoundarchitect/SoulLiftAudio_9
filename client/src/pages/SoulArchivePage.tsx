import { useState } from 'react'
import { User, Heart, Calendar, Award, Settings, Edit3 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SoulArchivePage() {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div 
      className="flex-1 flex flex-col bg-[#F3F7FF] relative overflow-hidden"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      {/* Glass morphism overlay */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
      
      {/* Floating glass orbs for visual interest */}
      <div className="absolute top-24 right-16 w-32 h-32 bg-white/20 rounded-full blur-xl animate-pulse delay-200"></div>
      <div className="absolute bottom-32 left-12 w-40 h-40 bg-white/15 rounded-full blur-2xl animate-pulse delay-800"></div>
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white/10 rounded-full blur-lg animate-pulse delay-1100"></div>

      <div className="max-w-4xl mx-auto px-6 py-8 relative z-10 pb-24 sm:pb-28">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              User Profile
            </span>
          </h1>
          
          <p className="text-[#4D5563]">Your account and profile settings</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/60 backdrop-blur-md rounded-lg p-1 flex shadow-xl border border-white/30">
            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'stats', label: 'Stats', icon: Award },
              { id: 'activity', label: 'Activity', icon: Calendar },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-md transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'bg-white/60 hover:bg-white/80 backdrop-blur-md text-[#4D5563]'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/80 backdrop-blur-lg rounded-lg p-8 shadow-2xl border border-white/50">
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="bg-white/60 backdrop-blur-md rounded-lg p-6 shadow-xl mb-6 border border-white/30">
                  <h3 className="text-xl font-semibold mb-4 text-[#4D5563]">Profile Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[#4D5563]/80">Name</span>
                      <span className="font-medium text-[#4D5563]">John Doe</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#4D5563]/80">Email</span>
                      <span className="font-medium text-[#4D5563]">john@example.com</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#4D5563]/80">Member Since</span>
                      <span className="font-medium text-[#4D5563]">January 2024</span>
                    </div>
                  </div>
                  <button className="mt-4 flex items-center mx-auto px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-xl transition-all duration-200">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'stats' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <div className="bg-white/60 backdrop-blur-md rounded-lg p-6 text-center shadow-xl border border-white/30">
                  <Heart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[#4D5563]">12</div>
                  <div className="text-[#4D5563]/80">Soul Hugs Created</div>
                </div>
                <div className="bg-white/60 backdrop-blur-md rounded-lg p-6 text-center shadow-xl border border-white/30">
                  <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[#4D5563]">45</div>
                  <div className="text-[#4D5563]/80">Days Active</div>
                </div>
                <div className="bg-white/60 backdrop-blur-md rounded-lg p-6 text-center shadow-xl border border-white/30">
                  <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[#4D5563]">3</div>
                  <div className="text-[#4D5563]/80">Achievements</div>
                </div>
              </motion.div>
            )}

            {activeTab === 'activity' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/60 backdrop-blur-md rounded-lg p-6 shadow-xl border border-white/30"
              >
                <h3 className="text-xl font-semibold mb-4 text-[#4D5563]">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-white/60 backdrop-blur-md rounded-lg shadow-lg border border-white/30">
                    <Heart className="w-5 h-5 text-purple-600 mr-3" />
                    <div>
                      <div className="font-medium text-[#4D5563]">Created Soul Hug for Mom</div>
                      <div className="text-sm text-[#4D5563]/80">2 hours ago</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-white/60 backdrop-blur-md rounded-lg shadow-lg border border-white/30">
                    <Heart className="w-5 h-5 text-purple-600 mr-3" />
                    <div>
                      <div className="font-medium text-[#4D5563]">Shared Soul Hug with Sarah</div>
                      <div className="text-sm text-[#4D5563]/80">1 day ago</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/60 backdrop-blur-md rounded-lg p-6 shadow-xl border border-white/30"
              >
                <h3 className="text-xl font-semibold mb-4 text-[#4D5563]">Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#4D5563]/80">Email Notifications</span>
                    <button className="w-12 h-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full relative">
                      <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#4D5563]/80">Auto-save Drafts</span>
                    <button className="w-12 h-6 bg-gray-300 rounded-full relative">
                      <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#4D5563]/80">Public Profile</span>
                    <button className="w-12 h-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full relative">
                      <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
      </div>
    </div>
  )
}