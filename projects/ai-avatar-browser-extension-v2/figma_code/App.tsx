import { useState } from 'react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { ParkerPopover } from './components/ParkerPopover';

export default function App() {
  const [parkerMode, setParkerMode] = useState<'debate' | 'hottake' | 'predictions' | 'nba' | 'fantake' | 'companion'>('debate');

  const handleNbaClick = () => {
    setParkerMode('nba');
    // The popover will open automatically when the mode changes
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ESPN Header */}
      <header className="bg-red-600 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-6">
              <div className="text-white font-bold text-xl">ESPN</div>
              <nav className="hidden md:flex space-x-4 text-sm">
                <a href="#" className="hover:text-gray-200">NFL</a>
                <button 
                  onClick={handleNbaClick}
                  className="hover:text-gray-200 transition-colors"
                >
                  NBA
                </button>
                <a href="#" className="hover:text-gray-200">MLB</a>
                <a href="#" className="hover:text-gray-200">NHL</a>
                <a href="#" className="hover:text-gray-200">College</a>
                <a href="#" className="hover:text-gray-200">Soccer</a>
                <a href="#" className="hover:text-gray-200">Tennis</a>
              </nav>
            </div>

            {/* Right side with avatar */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <span>Watch</span>
                <span>•</span>
                <span>Fantasy</span>
                <span>•</span>
                <span>More Sports</span>
              </div>
              
              {/* Avatar with pulsating hover effect */}
              <ParkerPopover initialMode={parkerMode}>
                <button className="group relative">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1615843423179-bea071facf96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMGF2YXRhcnxlbnwxfHx8fDE3NTcyNjg2MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Parker Avatar"
                    className="w-8 h-8 rounded-full object-cover transition-transform duration-300 group-hover:animate-pulse group-hover:scale-110"
                  />
                  {/* Subtle ring that pulses on hover */}
                  <div className="absolute inset-0 rounded-full ring-2 ring-white/30 opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
                </button>
              </ParkerPopover>
            </div>
          </div>
        </div>
      </header>

      {/* Sub Navigation */}
      <div className="bg-gray-800 text-white text-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-6 h-10">
            <a href="#" className="hover:text-gray-300">Scores</a>
            <a href="#" className="hover:text-gray-300">Schedule</a>
            <a href="#" className="hover:text-gray-300">Standings</a>
            <a href="#" className="hover:text-gray-300">Stats</a>
            <a href="#" className="hover:text-gray-300">Teams</a>
            <a href="#" className="hover:text-gray-300">Players</a>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-6">
        {/* Sample ESPN-style content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured Game */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Featured Game</h2>
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Dallas Mavericks</div>
                  <div className="text-2xl font-bold">116</div>
                  <div className="text-xs text-gray-400">FINAL</div>
                </div>
                <div className="text-gray-400 text-xs">vs</div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Philadelphia 76ers</div>
                  <div className="text-2xl font-bold">118</div>
                  <div className="text-xs text-gray-400">FINAL</div>
                </div>
              </div>
            </div>

            {/* Sample Stats Table */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Team Stats</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Player</th>
                      <th className="text-center py-2">MIN</th>
                      <th className="text-center py-2">PTS</th>
                      <th className="text-center py-2">REB</th>
                      <th className="text-center py-2">AST</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 text-blue-600">Luka Dončić</td>
                      <td className="text-center">32</td>
                      <td className="text-center">28</td>
                      <td className="text-center">8</td>
                      <td className="text-center">12</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-blue-600">Kyrie Irving</td>
                      <td className="text-center">30</td>
                      <td className="text-center">24</td>
                      <td className="text-center">4</td>
                      <td className="text-center">6</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-blue-600">Dereck Lively II</td>
                      <td className="text-center">28</td>
                      <td className="text-center">12</td>
                      <td className="text-center">10</td>
                      <td className="text-center">2</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold mb-4">Top Stories</h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <div className="text-blue-600 hover:underline cursor-pointer">
                    NBA Trade Deadline Approaching
                  </div>
                  <div className="text-gray-500 text-xs">2 hours ago</div>
                </div>
                <div className="text-sm">
                  <div className="text-blue-600 hover:underline cursor-pointer">
                    Injury Report Update
                  </div>
                  <div className="text-gray-500 text-xs">4 hours ago</div>
                </div>
                <div className="text-sm">
                  <div className="text-blue-600 hover:underline cursor-pointer">
                    Playoff Picture Heating Up
                  </div>
                  <div className="text-gray-500 text-xs">6 hours ago</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold mb-4">Upcoming Games</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>LAL vs BOS</span>
                  <span className="text-gray-500">8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>GSW vs MIA</span>
                  <span className="text-gray-500">8:30 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>DEN vs PHX</span>
                  <span className="text-gray-500">9:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}