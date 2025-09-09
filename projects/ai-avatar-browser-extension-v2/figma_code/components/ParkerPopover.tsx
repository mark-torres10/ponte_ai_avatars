import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { MessageSquare, Flame, Target, HelpCircle, Send, Play, MessageCircle, Radio, Mic, MicOff, Keyboard, Zap } from 'lucide-react';

interface ParkerPopoverProps {
  children: React.ReactNode;
  initialMode?: 'debate' | 'hottake' | 'predictions' | 'nba' | 'fantake' | 'companion';
}

export function ParkerPopover({ children, initialMode = 'debate' }: ParkerPopoverProps) {
  const [activeMode, setActiveMode] = useState<'debate' | 'hottake' | 'predictions' | 'nba' | 'fantake' | 'companion'>(initialMode);
  const [debateQuestion, setDebateQuestion] = useState('');
  const [debateResponse, setDebateResponse] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'savage'>('easy');
  const [predictionGame, setPredictionGame] = useState('');
  const [prediction, setPrediction] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [nbaRecap, setNbaRecap] = useState('');
  const [recapType, setRecapType] = useState<'daily' | 'myteams'>('daily');
  const [isRecording, setIsRecording] = useState(false);
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleDebate = () => {
    if (!debateQuestion.trim()) return;
    
    const responses = {
      easy: {
        giannis: "I respect Giannis, but pure dominance means consistent championships. Where's the consistency?",
        lebron: "LeBron's still amazing at his age, but father time is undefeated. We're seeing some cracks.",
        default: "Interesting take! Let me present the counterpoint..."
      },
      savage: {
        giannis: "GIANNIS?! ONE championship and y'all acting like he's MJ! The Bucks haven't done ANYTHING since 2021!",
        lebron: "LeBron? This man is FORTY! Stop living in the past! We got Luka, Tatum carrying the league NOW!",
        default: "OH SO NOW WE'RE MAKING UP NARRATIVES?! That's the WORST take I've heard all week!"
      }
    };

    const questionLower = debateQuestion.toLowerCase();
    let response = '';
    
    if (questionLower.includes('giannis')) {
      response = responses[difficulty].giannis;
    } else if (questionLower.includes('lebron')) {
      response = responses[difficulty].lebron;
    } else {
      response = responses[difficulty].default;
    }
    
    setDebateResponse(response);
  };

  const handlePrediction = () => {
    if (!predictionGame.trim()) return;
    
    const predictions = [
      { text: "This game is OVER before it starts! Home team dominates!", confidence: 95 },
      { text: "Something feels OFF... I got a gut feeling about an upset.", confidence: 72 },
      { text: "BARN BURNER! Whoever wants it more in final minutes wins.", confidence: 60 },
      { text: "Going against the grain - underdog special tonight!", confidence: 83 }
    ];
    
    const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];
    setPrediction(randomPrediction.text);
    setConfidence(randomPrediction.confidence);
  };

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

  const handleVoiceInput = (mode: 'debate' | 'predictions') => {
    if (isRecording) {
      // Stop recording if already recording
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    
    // Simulate voice recording
    setTimeout(() => {
      setIsRecording(false);
      
      if (mode === 'debate') {
        setDebateQuestion("Is Giannis still the most dominant player in the league?");
        handleDebate();
      } else if (mode === 'predictions') {
        setPredictionGame("Lakers vs Celtics tonight");
        handlePrediction();
      }
    }, 2000);
  };

  const handleQuickVoice = () => {
    // If recording, stop it
    if (isRecording) {
      setIsRecording(false);
      return;
    }
    
    // Determine which mode to use based on current active mode
    if (activeMode === 'debate') {
      handleVoiceInput('debate');
    } else if (activeMode === 'predictions') {
      handleVoiceInput('predictions');
    } else if (activeMode === 'nba') {
      handleNbaRecap();
    } else {
      // Default to debate mode for other modes
      setActiveMode('debate');
      setTimeout(() => handleVoiceInput('debate'), 100);
    }
  };

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if popover is open and not typing in an input
      if (!isPopoverOpen || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      // Spacebar to trigger voice input
      if (e.code === 'Space' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        handleQuickVoice();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isPopoverOpen, activeMode, isRecording]);

  const todayHotTake = "I don't wanna hear another WORD about the Lakers until they WIN something! Three years of 'championship aspirations' and NOTHING to show for it!";

  return (
    <TooltipProvider>
      <Popover onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          {children}
        </PopoverTrigger>
        <PopoverContent className="w-80 p-3" align="end" sideOffset={5}>
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Parker Sports</span>
                {/* Quick Voice Shortcut Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant={isRecording ? "destructive" : "outline"}
                      className={`h-6 w-6 p-0 transition-all duration-300 ${
                        isRecording ? 'animate-pulse' : 'hover:scale-110'
                      }`}
                      onClick={handleQuickVoice}
                    >
                      {isRecording ? (
                        <MicOff className="w-3 h-3" />
                      ) : (
                        <Zap className="w-3 h-3" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      {isRecording ? 'Stop Recording (Spacebar)' : 'Quick Voice (Spacebar)'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activeMode === 'debate' ? 'default' : 'ghost'}
                      size="sm"
                      className="h-7 px-2"
                      onClick={() => setActiveMode('debate')}
                    >
                      <MessageSquare className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Debate Mode</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activeMode === 'hottake' ? 'default' : 'ghost'}
                      size="sm"
                      className="h-7 px-2"
                      onClick={() => setActiveMode('hottake')}
                    >
                      <Flame className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Hot Take Mode</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activeMode === 'predictions' ? 'default' : 'ghost'}
                      size="sm"
                      className="h-7 px-2"
                      onClick={() => setActiveMode('predictions')}
                    >
                      <Target className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Predictions Mode</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activeMode === 'nba' ? 'default' : 'ghost'}
                      size="sm"
                      className="h-7 px-2"
                      onClick={() => setActiveMode('nba')}
                    >
                      <Play className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">NBA Recap Mode</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activeMode === 'fantake' ? 'default' : 'ghost'}
                      size="sm"
                      className="h-7 px-2"
                      onClick={() => setActiveMode('fantake')}
                    >
                      <MessageCircle className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Fan Take Reactions</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activeMode === 'companion' ? 'default' : 'ghost'}
                      size="sm"
                      className="h-7 px-2"
                      onClick={() => setActiveMode('companion')}
                    >
                      <Radio className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Game Companion Mode</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            <Separator />

            {/* Quick Voice Status */}
            {isRecording && (
              <div className="flex items-center justify-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-red-600">🎙️ Recording... (Spacebar to stop)</span>
              </div>
            )}

            {/* Debate Mode */}
            {activeMode === 'debate' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Debate Mode</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Ask Parker sports questions and watch him argue back passionately</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                <div className="space-y-2">
                  {/* Voice Input (Primary) */}
                  <div className="flex flex-col items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                    <div className="text-xs text-center text-blue-700 mb-1">
                      🎙️ {isRecording ? 'Recording... (Spacebar to stop)' : 'Tap or press Spacebar to ask Parker'}
                    </div>
                    <Button
                      size="lg"
                      variant={isRecording ? "destructive" : "default"}
                      className={`h-12 w-12 rounded-full transition-all duration-300 ${
                        isRecording ? 'animate-pulse scale-110' : 'hover:scale-105'
                      }`}
                      onClick={() => handleVoiceInput('debate')}
                    >
                      {isRecording ? (
                        <MicOff className="w-5 h-5" />
                      ) : (
                        <Mic className="w-5 h-5" />
                      )}
                    </Button>
                    {isRecording && (
                      <div className="text-xs text-red-600 animate-pulse">
                        🔴 Tap or press Spacebar to stop
                      </div>
                    )}
                  </div>

                  {/* Difficulty Selection */}
                  <div className="flex gap-1 justify-center">
                    <Button
                      variant={difficulty === 'easy' ? 'secondary' : 'ghost'}
                      size="sm"
                      className="h-6 px-3 text-xs"
                      onClick={() => setDifficulty('easy')}
                    >
                      Go Easy
                    </Button>
                    <Button
                      variant={difficulty === 'savage' ? 'destructive' : 'ghost'}
                      size="sm"
                      className="h-6 px-3 text-xs"
                      onClick={() => setDifficulty('savage')}
                    >
                      Go Savage
                    </Button>
                  </div>

                  {/* Text Input (Secondary) */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs text-muted-foreground w-full"
                      onClick={() => setInputMode(inputMode === 'voice' ? 'text' : 'voice')}
                    >
                      <Keyboard className="w-3 h-3 mr-1" />
                      Or type your question
                    </Button>
                    
                    {inputMode === 'text' && (
                      <div className="flex gap-1 mt-2">
                        <Input
                          placeholder="Ask a sports question..."
                          value={debateQuestion}
                          onChange={(e) => setDebateQuestion(e.target.value)}
                          className="text-xs h-7"
                          onKeyDown={(e) => e.key === 'Enter' && handleDebate()}
                        />
                        <Button size="sm" onClick={handleDebate} disabled={!debateQuestion.trim()} className="h-7 px-2">
                          <Send className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {debateResponse && (
                  <div className="p-2 bg-muted rounded text-xs">
                    <Badge variant={difficulty === 'savage' ? 'destructive' : 'secondary'} className="mb-1 text-xs">
                      Parker
                    </Badge>
                    <p className="italic">"{debateResponse}"</p>
                  </div>
                )}
              </div>
            )}

            {/* Hot Take Mode */}
            {activeMode === 'hottake' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Hot Take</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Parker's most outrageous daily opinion with zero filter</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                <div className="p-3 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded">
                  <div className="flex items-center gap-1 mb-2">
                    <Flame className="w-3 h-3 text-red-600" />
                    <Badge variant="destructive" className="text-xs">SPICY</Badge>
                  </div>
                  <p className="text-xs italic">"{todayHotTake}"</p>
                </div>
              </div>
            )}

            {/* Predictions Mode */}
            {activeMode === 'predictions' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Predictions</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Get bold predictions with Parker's confidence meter</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                <div className="space-y-2">
                  {/* Voice Input (Primary) */}
                  <div className="flex flex-col items-center gap-2 p-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                    <div className="text-xs text-center text-green-700 mb-1">
                      🎯 {isRecording ? 'Recording... (Spacebar to stop)' : 'Tap or press Spacebar for predictions'}
                    </div>
                    <Button
                      size="lg"
                      variant={isRecording ? "destructive" : "default"}
                      className={`h-12 w-12 rounded-full transition-all duration-300 ${
                        isRecording ? 'animate-pulse scale-110' : 'hover:scale-105'
                      }`}
                      onClick={() => handleVoiceInput('predictions')}
                    >
                      {isRecording ? (
                        <MicOff className="w-5 h-5" />
                      ) : (
                        <Mic className="w-5 h-5" />
                      )}
                    </Button>
                    {isRecording && (
                      <div className="text-xs text-red-600 animate-pulse">
                        🔴 Tap or press Spacebar to stop
                      </div>
                    )}
                  </div>

                  {/* Text Input (Secondary) */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs text-muted-foreground w-full"
                      onClick={() => setInputMode(inputMode === 'voice' ? 'text' : 'voice')}
                    >
                      <Keyboard className="w-3 h-3 mr-1" />
                      Or type a game
                    </Button>
                    
                    {inputMode === 'text' && (
                      <div className="flex gap-1 mt-2">
                        <Input
                          placeholder="Enter a game..."
                          value={predictionGame}
                          onChange={(e) => setPredictionGame(e.target.value)}
                          className="text-xs h-7"
                          onKeyDown={(e) => e.key === 'Enter' && handlePrediction()}
                        />
                        <Button size="sm" onClick={handlePrediction} disabled={!predictionGame.trim()} className="h-7 px-2">
                          <Send className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {prediction && (
                  <div className="space-y-2">
                    <div className="p-2 bg-blue-50 border-l-2 border-blue-600 rounded text-xs">
                      <Badge variant="secondary" className="mb-1 text-xs">Parker's Pick</Badge>
                      <p className="italic">"{prediction}"</p>
                    </div>
                    
                    <div className="p-2 bg-muted rounded">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs">Confidence</span>
                        <Badge variant={confidence >= 90 ? 'destructive' : confidence >= 70 ? 'default' : 'secondary'} className="text-xs">
                          {confidence}%
                        </Badge>
                      </div>
                      <div className="w-full bg-background rounded-full h-1">
                        <div 
                          className={`h-1 rounded-full transition-all duration-500 ${
                            confidence >= 90 ? 'bg-red-600' : 
                            confidence >= 70 ? 'bg-blue-600' : 'bg-gray-400'
                          }`}
                          style={{ width: `${confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* NBA Recap Mode */}
            {activeMode === 'nba' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">NBA Recap</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Parker's dramatic 1-2 minute recap of last night's games</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                <div className="space-y-2">
                  <div className="flex gap-1">
                    <Button
                      variant={recapType === 'daily' ? 'secondary' : 'ghost'}
                      size="sm"
                      className="h-6 px-2 text-xs flex-1"
                      onClick={() => setRecapType('daily')}
                    >
                      Daily Recap
                    </Button>
                    <Button
                      variant={recapType === 'myteams' ? 'secondary' : 'ghost'}
                      size="sm"
                      className="h-6 px-2 text-xs flex-1"
                      onClick={() => setRecapType('myteams')}
                    >
                      Your Teams
                    </Button>
                  </div>
                  
                  {/* Voice-First NBA Recap */}
                  <div className="flex flex-col items-center gap-2 p-2 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
                    <div className="text-xs text-center text-orange-700">
                      🏀 Tap or press Spacebar for recap
                    </div>
                    <Button 
                      onClick={handleNbaRecap} 
                      className={`h-10 w-10 rounded-full transition-all duration-300 hover:scale-105`}
                      size="sm"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {nbaRecap && (
                  <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded">
                    <div className="flex items-center gap-1 mb-2">
                      <Play className="w-3 h-3 text-orange-600" />
                      <Badge variant="secondary" className="text-xs">
                        {recapType === 'daily' ? 'DAILY RECAP' : 'YOUR TEAMS'}
                      </Badge>
                    </div>
                    <div className="text-xs italic leading-relaxed">
                      "{nbaRecap}"
                    </div>
                    <div className="mt-2 pt-2 border-t border-orange-200">
                      <p className="text-xs text-gray-500">���� Parker's Last Night Rundown</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Fan Take Reactions Mode */}
            {activeMode === 'fantake' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Fan Take Reactions</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Paste Reddit/ESPN comments and watch Parker lose his mind</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded text-center">
                  <div className="flex justify-center gap-2 mb-2">
                    <Mic className="w-5 h-5 text-purple-600" />
                    <MessageCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <Badge variant="outline" className="text-xs mb-2">COMING SOON</Badge>
                  <p className="text-xs text-gray-600 mb-2">
                    Read fan comments aloud or paste them - Parker will deliver his most BRUTAL voice reactions yet!
                  </p>
                  <p className="text-xs italic text-purple-700">
                    "This is RIDICULOUS! ABSURD!"
                  </p>
                </div>
              </div>
            )}

            {/* Game Companion Mode */}
            {activeMode === 'companion' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Game Companion</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Live commentary during games with quarter/halftime takes</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded text-center">
                  <div className="flex justify-center gap-2 mb-2">
                    <Radio className="w-5 h-5 text-green-600" />
                    <Mic className="w-5 h-5 text-green-600" />
                  </div>
                  <Badge variant="outline" className="text-xs mb-2">COMING SOON</Badge>
                  <p className="text-xs text-gray-600 mb-2">
                    Parker will interrupt with live voice commentary during games - quarter analysis, halftime takes, and clutch moments!
                  </p>
                  <div className="flex items-center justify-center gap-1 text-xs">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="italic text-green-700">
                      "LIVE VOICE FROM COURTSIDE"
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
}