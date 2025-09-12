import React, { useState } from 'react';
import { HelpCircle, Play } from 'lucide-react';

const NBARecapMode: React.FC = () => {
  const [recapType, setRecapType] = useState<'daily' | 'myteams'>('daily');
  const [nbaRecap, setNbaRecap] = useState('');

  const handleNbaRecap = () => {
    const dailyRecaps = [
      "Ladies and gentlemen, here's what went down last night! Luka Dončić dropped 42 and made the Suns look like they should've stayed home - and don't get me STARTED on the Knicks! They blew a 20-point lead AGAIN! I'm telling you, this team has zero clutch gene. ZERO! Meanwhile, the Celtics are quietly putting together something special, but nobody wants to talk about it because it's not flashy enough.",
      "WHAT a night of basketball! The Warriors showed they still got some fight left - Curry with 38 and made it look EASY! But can we talk about how the Lakers got absolutely DEMOLISHED by the Nuggets? Jokić had a triple-double by the THIRD QUARTER! LeBron looked tired, AD was invisible, and don't even mention their bench. This team is in serious trouble, mark my words!",
      "Buckle up because last night was INSANE! Giannis went for 45 and 15, but here's the kicker - the Bucks STILL lost! How do you put up those numbers and LOSE?! Meanwhile, the Heat are proving everyone wrong AGAIN. Jimmy Butler with that clutch gene we've been talking about. This man just shows up when it matters!"
    ];

    const myTeamsRecaps = [
      "Alright, YOUR teams update - and it's not looking pretty! The Lakers got cooked AGAIN, giving up 130 points to a team that shouldn't score 100! Russell Westbrook had more turnovers than assists, and I'm starting to think this experiment is OVER. Your Celtics though? They're looking solid, Tatum's developing that killer instinct we need to see.",
      "Time for your personalized pain report! The Knicks blew ANOTHER lead - that's what, the 5th time this month?! Julius Randle disappeared in the 4th quarter like he always does. But hey, at least the Nets are trying to stay competitive without their stars. Effort counts for something, right? RIGHT?!",
      "Your teams recap, and I got mixed feelings! The Warriors showed some vintage Splash Brothers action - Curry and Klay combining for 65! But your other team, the Sixers? Embiid sat out ANOTHER game with 'load management.' I'm sorry, but you can't win championships sitting on the bench!"
    ];

    const recaps = recapType === 'daily' ? dailyRecaps : myTeamsRecaps;
    const randomRecap = recaps[Math.floor(Math.random() * recaps.length)];
    setNbaRecap(randomRecap);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-800">NBA Recap</span>
        <HelpCircle className="w-3 h-3 text-gray-400" />
      </div>
      
      <div className="space-y-2">
        <div className="flex gap-1">
          <button
            className={`h-6 px-2 text-xs rounded-md flex-1 transition-colors ${
              recapType === 'daily' 
                ? 'bg-orange-100 text-orange-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setRecapType('daily')}
          >
            Daily Recap
          </button>
          <button
            className={`h-6 px-2 text-xs rounded-md flex-1 transition-colors ${
              recapType === 'myteams' 
                ? 'bg-orange-100 text-orange-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setRecapType('myteams')}
          >
            Your Teams
          </button>
        </div>
        
        {/* Voice-First NBA Recap */}
        <div className="flex flex-col items-center gap-2 p-2 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
          <div className="text-xs text-center text-orange-700">
            🏀 Tap or press Space/Enter for recap
          </div>
          <button 
            onClick={handleNbaRecap} 
            className="h-10 w-10 rounded-full bg-orange-600 hover:scale-105 transition-all duration-300 flex items-center justify-center"
          >
            <Play className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {nbaRecap && (
        <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded">
          <div className="flex items-center gap-1 mb-2">
            <Play className="w-3 h-3 text-orange-600" />
            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
              {recapType === 'daily' ? 'DAILY RECAP' : 'YOUR TEAMS'}
            </span>
          </div>
          <div className="text-xs italic leading-relaxed">
            &ldquo;{nbaRecap}&rdquo;
          </div>
          <div className="mt-2 pt-2 border-t border-orange-200">
            <p className="text-xs text-gray-500">🏀 Parker&apos;s Last Night Rundown</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NBARecapMode;
