import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { MessageSquare, Flame, Target, Volume2 } from 'lucide-react';

interface ParkerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ParkerModal({ isOpen, onClose }: ParkerModalProps) {
  const [debateQuestion, setDebateQuestion] = useState('');
  const [debateResponse, setDebateResponse] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'savage'>('easy');
  const [predictionGame, setPredictionGame] = useState('');
  const [prediction, setPrediction] = useState('');
  const [confidence, setConfidence] = useState(0);

  const handleDebate = () => {
    if (!debateQuestion.trim()) return;
    
    const responses = {
      easy: {
        giannis: "Look, I respect Giannis tremendously - the man is a Greek Freak for a reason! But let's be honest here, when we talk about pure dominance, we gotta look at the full picture. Sure, he's putting up numbers, but is he carrying his team to championships consistently? That's the real test of dominance.",
        lebron: "LeBron? Come on now, we're talking about someone who's been doing this for over 20 years! The man is still putting up triple-doubles at his age. But hey, father time is undefeated, and we're starting to see some cracks in that armor.",
        default: "That's an interesting take! But here's what I think - you gotta look at both sides of this argument. There's definitely merit to what you're saying, but let me present the counterpoint..."
      },
      savage: {
        giannis: "GIANNIS?! Are you KIDDING me right now?! This man has won ONE championship - ONE! - and y'all acting like he's the second coming of Michael Jordan! The Bucks haven't done ANYTHING since 2021! Where's the dominance? Where's the consistency? I don't wanna hear about no 'most dominant' until he proves it AGAIN!",
        lebron: "LeBron? LEBRON?! Listen, I love the King, but we're in 2025 and this man is FORTY YEARS OLD! Stop living in the past! Yeah he was dominant - WAS! Past tense! We got Luka, we got Tatum, we got actual young stars carrying the league NOW!",
        default: "OH SO NOW WE'RE JUST MAKING UP NARRATIVES?! That's the WORST take I've heard all week! Let me tell you why you're completely wrong about this..."
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
      {
        text: "I'm telling you RIGHT NOW - this game is OVER before it starts! The home team is gonna DOMINATE, and it won't even be close. Mark it down!",
        confidence: 95
      },
      {
        text: "Listen, on paper this should be easy, but something feels OFF about this matchup. I got a gut feeling about an upset brewing...",
        confidence: 72
      },
      {
        text: "This is gonna be a BARN BURNER! Both teams are desperate, both teams are hungry. Whoever wants it more in the final minutes takes this one home.",
        confidence: 60
      },
      {
        text: "You know what? I'm going COMPLETELY against the grain here. Everyone's sleeping on the underdog, but I see something special happening tonight!",
        confidence: 83
      }
    ];
    
    const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];
    setPrediction(randomPrediction.text);
    setConfidence(randomPrediction.confidence);
  };

  const todayHotTake = "I don't wanna hear another WORD about the Lakers until they actually WIN something this season! Y'all been talking about 'championship aspirations' for THREE YEARS and what do we have to show for it? NOTHING! Stop giving me hypotheticals and start giving me RESULTS!";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-red-600" />
            Parker's Sports Central
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="debate" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="debate" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Debate Mode
            </TabsTrigger>
            <TabsTrigger value="hottake" className="flex items-center gap-2">
              <Flame className="w-4 h-4" />
              Hot Take
            </TabsTrigger>
            <TabsTrigger value="predictions" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Predictions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="debate" className="space-y-4">
            <div>
              <h3 className="mb-2">Ask Parker a Sports Question</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Challenge Parker with your hottest sports takes and watch him argue back!
              </p>
              
              <div className="space-y-3">
                <Input
                  placeholder="e.g., Is Giannis still the most dominant player?"
                  value={debateQuestion}
                  onChange={(e) => setDebateQuestion(e.target.value)}
                />
                
                <div className="flex items-center gap-2">
                  <span className="text-sm">Difficulty:</span>
                  <Button
                    variant={difficulty === 'easy' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDifficulty('easy')}
                  >
                    Go Easy
                  </Button>
                  <Button
                    variant={difficulty === 'savage' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDifficulty('savage')}
                  >
                    Go Savage
                  </Button>
                </div>
                
                <Button onClick={handleDebate} disabled={!debateQuestion.trim()}>
                  Start Debate
                </Button>
              </div>

              {debateResponse && (
                <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-600 rounded-r-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={difficulty === 'savage' ? 'destructive' : 'secondary'}>
                      Parker {difficulty === 'savage' ? '🔥 SAVAGE' : '💬 EASY'}
                    </Badge>
                  </div>
                  <p className="text-sm italic">"{debateResponse}"</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="hottake" className="space-y-4">
            <div>
              <h3 className="mb-2">Hot Take of the Day</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Parker's most outrageous opinion, delivered with zero filter!
              </p>
              
              <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="w-5 h-5 text-red-600" />
                  <Badge variant="destructive">🔥 SPICY TAKE</Badge>
                </div>
                <p className="italic">"{todayHotTake}"</p>
                <Separator className="my-3" />
                <p className="text-xs text-gray-500">- Parker, probably yelling at his TV</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-4">
            <div>
              <h3 className="mb-2">Bold Predictions</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Ask Parker about any upcoming game and get his trademark dramatic prediction!
              </p>
              
              <div className="space-y-3">
                <Input
                  placeholder="e.g., Lakers vs Celtics tonight"
                  value={predictionGame}
                  onChange={(e) => setPredictionGame(e.target.value)}
                />
                
                <Button onClick={handlePrediction} disabled={!predictionGame.trim()}>
                  Get Prediction
                </Button>
              </div>

              {prediction && (
                <div className="mt-4 space-y-3">
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">🎯 PARKER'S PICK</Badge>
                    </div>
                    <p className="text-sm italic">"{prediction}"</p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Parker's Confidence Level</span>
                      <Badge variant={confidence >= 90 ? 'destructive' : confidence >= 70 ? 'default' : 'secondary'}>
                        {confidence}%
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          confidence >= 90 ? 'bg-red-600' : 
                          confidence >= 70 ? 'bg-blue-600' : 'bg-gray-400'
                        }`}
                        style={{ width: `${confidence}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {confidence >= 90 ? "Lock it in!" : 
                       confidence >= 70 ? "Pretty confident" : "Gut feeling"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}