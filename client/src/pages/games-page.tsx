import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

// Simple memory game
function MemoryGame() {
  const [cards, setCards] = useState<number[]>([]);
  const [flipped, setFlipped] = useState<boolean[]>([]);
  const [matched, setMatched] = useState<boolean[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Initialize game
  const startGame = () => {
    const cardValues = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];
    // Shuffle
    const shuffled = [...cardValues].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped(Array(cardValues.length).fill(false));
    setMatched(Array(cardValues.length).fill(false));
    setMoves(0);
    setGameStarted(true);
  };
  
  // Handle card click
  const handleClick = (index: number) => {
    // If disabled or already flipped or matched, ignore
    if (disabled || flipped[index] || matched[index]) return;
    
    const newFlipped = [...flipped];
    newFlipped[index] = true;
    setFlipped(newFlipped);
    
    // Check if this is the first or second card flipped
    const flippedIndices = newFlipped.reduce((indices, isFlipped, i) => {
      if (isFlipped && !matched[i]) indices.push(i);
      return indices;
    }, [] as number[]);
    
    if (flippedIndices.length === 2) {
      setMoves(moves + 1);
      setDisabled(true);
      
      // Check if the two cards match
      const [first, second] = flippedIndices;
      if (cards[first] === cards[second]) {
        // Match
        const newMatched = [...matched];
        newMatched[first] = true;
        newMatched[second] = true;
        setMatched(newMatched);
        setDisabled(false);
        
        // Check if all cards are matched
        if (newMatched.every(Boolean)) {
          setTimeout(() => {
            alert(`Congratulations! You've completed the game in ${moves + 1} moves.`);
          }, 500);
        }
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          const resetFlipped = [...newFlipped];
          resetFlipped[first] = false;
          resetFlipped[second] = false;
          setFlipped(resetFlipped);
          setDisabled(false);
        }, 1000);
      }
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Memory Game</CardTitle>
        <CardDescription className="text-center">Match all the pairs with the fewest moves</CardDescription>
      </CardHeader>
      <CardContent>
        {!gameStarted ? (
          <div className="flex justify-center">
            <Button onClick={startGame}>Start Game</Button>
          </div>
        ) : (
          <>
            <div className="text-center mb-4">
              <Badge variant="outline" className="mb-2">Moves: {moves}</Badge>
              <Button variant="outline" size="sm" onClick={startGame} className="ml-4">Restart</Button>
            </div>
            <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
              {cards.map((card, index) => (
                <div 
                  key={index}
                  onClick={() => handleClick(index)}
                  className={`
                    aspect-square flex items-center justify-center rounded-md text-xl font-bold transition-all duration-300
                    ${flipped[index] || matched[index] ? 'bg-primary text-primary-foreground' : 'bg-muted cursor-pointer hover:bg-muted/80'}
                    ${matched[index] ? 'opacity-80' : 'opacity-100'}
                  `}
                >
                  {(flipped[index] || matched[index]) ? card : '?'}
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Word Scramble Game
function WordScrambleGame() {
  const [currentWord, setCurrentWord] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [userGuess, setUserGuess] = useState("");
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState<{text: string; type: "success" | "error" | "info"} | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const words = [
    "community", "environment", "government", "healthcare", "education",
    "transport", "housing", "safety", "recycling", "pollution",
    "playground", "sidewalk", "bicycle", "library", "garden"
  ];
  
  // Scramble a word
  const scrambleWord = (word: string) => {
    return word.split('').sort(() => Math.random() - 0.5).join('');
  };
  
  // Get a new word
  const getNewWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    const word = words[randomIndex];
    const scrambled = scrambleWord(word);
    setCurrentWord(word);
    setScrambledWord(scrambled);
    setUserGuess("");
    setMessage(null);
  };
  
  // Start the game
  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameStarted(true);
    setGameOver(false);
    getNewWord();
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Check user guess
  const checkGuess = () => {
    if (userGuess.toLowerCase() === currentWord.toLowerCase()) {
      setScore(score + 1);
      setMessage({ text: "Correct! +1 point", type: "success" });
      setTimeout(() => {
        getNewWord();
      }, 1500);
    } else {
      setMessage({ text: "Try again!", type: "error" });
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Word Scramble</CardTitle>
        <CardDescription className="text-center">Unscramble the words before time runs out</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!gameStarted ? (
          <div className="flex justify-center">
            <Button onClick={startGame}>Start Game</Button>
          </div>
        ) : gameOver ? (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Game Over!</h3>
            <p className="text-lg">Your final score: {score}</p>
            <Button onClick={startGame}>Play Again</Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <Badge variant="outline">Score: {score}</Badge>
              <Badge variant={timeLeft <= 10 ? "destructive" : "secondary"}>Time: {timeLeft}s</Badge>
            </div>
            <Progress value={(timeLeft / 30) * 100} className="h-2" />
            
            <div className="bg-muted/50 p-6 rounded-md text-center">
              <h3 className="text-2xl font-bold mb-2">{scrambledWord}</h3>
              <p className="text-sm text-muted-foreground">Unscramble the word above</p>
            </div>
            
            <div className="flex space-x-2">
              <Input 
                type="text" 
                value={userGuess} 
                onChange={(e) => setUserGuess(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && checkGuess()}
                placeholder="Your guess..."
                className="flex-1"
              />
              <Button onClick={checkGuess}>Submit</Button>
            </div>
            
            {message && (
              <div className={`text-center p-2 rounded-md ${
                message.type === "success" ? "bg-green-100 text-green-800" : 
                message.type === "error" ? "bg-red-100 text-red-800" : 
                "bg-blue-100 text-blue-800"
              }`}>
                {message.text}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Reaction Speed Test Game
function ReactionSpeedGame() {
  const [status, setStatus] = useState<'waiting' | 'ready' | 'clicked' | 'tooEarly' | 'results'>('waiting');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [delay, setDelay] = useState<number | null>(null);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const startGame = () => {
    setStatus('waiting');
    setStartTime(null);
    setEndTime(null);
    clearTimeout(timerRef.current!);
    
    // Random delay between 2-6 seconds
    const newDelay = Math.floor(Math.random() * 4000) + 2000;
    setDelay(newDelay);
    
    timerRef.current = setTimeout(() => {
      setStatus('ready');
      setStartTime(Date.now());
    }, newDelay);
  };
  
  const handleClick = () => {
    if (status === 'waiting') {
      clearTimeout(timerRef.current!);
      setStatus('tooEarly');
    } else if (status === 'ready') {
      const now = Date.now();
      setEndTime(now);
      const time = now - startTime!;
      setReactionTime(time);
      
      const newAttempts = [...attempts, time];
      setAttempts(newAttempts);
      
      if (bestTime === null || time < bestTime) {
        setBestTime(time);
      }
      
      setStatus('results');
    } else if (status === 'tooEarly' || status === 'results') {
      startGame();
    }
  };
  
  // Get message based on time
  const getMessage = () => {
    if (!reactionTime) return "";
    if (reactionTime < 200) return "Incredible reflexes!";
    if (reactionTime < 300) return "Very fast!";
    if (reactionTime < 400) return "Good job!";
    return "Keep practicing!";
  };
  
  // Get background color based on status
  const getBgColor = () => {
    switch (status) {
      case 'waiting':
        return 'bg-red-500 hover:bg-red-600';
      case 'ready':
        return 'bg-green-500 hover:bg-green-600';
      case 'tooEarly':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'results':
        return 'bg-primary hover:bg-primary/90';
      default:
        return 'bg-muted hover:bg-muted/80';
    }
  };
  
  // Get message text based on status
  const getStatusText = () => {
    switch (status) {
      case 'waiting':
        return 'Wait for green...';
      case 'ready':
        return 'Click now!';
      case 'tooEarly':
        return 'Too early! Click to retry.';
      case 'results':
        return reactionTime ? `${reactionTime}ms - ${getMessage()}` : '';
      default:
        return 'Click to start';
    }
  };
  
  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle className="text-center">Reaction Speed Test</CardTitle>
        <CardDescription className="text-center">Test your reflexes - click when the screen turns green</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          onClick={handleClick}
          className={`w-full aspect-video rounded-md flex items-center justify-center cursor-pointer ${getBgColor()} text-white font-bold transition-all`}
        >
          <div className="text-center">
            <p className="text-xl mb-2">{getStatusText()}</p>
            {status === 'waiting' && <p className="text-sm">Click when the box turns green</p>}
            {status === 'results' && (
              <Button variant="ghost" className="text-white border border-white mt-2" onClick={startGame}>
                Try Again
              </Button>
            )}
            {status === 'waiting' && (
              <div className="flex justify-center">
                <div className="h-1 bg-white/20 w-20 mt-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-100" 
                    style={{ width: delay ? `${(Date.now() % delay) / delay * 100}%` : '0%' }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-muted/30 p-3 rounded-md">
            <p className="text-sm text-muted-foreground">Best Time</p>
            <p className="text-lg font-bold">{bestTime ? `${bestTime}ms` : '-'}</p>
          </div>
          <div className="bg-muted/30 p-3 rounded-md">
            <p className="text-sm text-muted-foreground">Average</p>
            <p className="text-lg font-bold">
              {attempts.length > 0 
                ? `${Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length)}ms` 
                : '-'}
            </p>
          </div>
        </div>
        
        {attempts.length > 0 && (
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground mb-1">Last 5 Attempts</p>
            <div className="flex justify-center space-x-2">
              {attempts.slice(-5).map((time, i) => (
                <Badge key={i} variant="outline">{time}ms</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function QuizGame() {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  
  const quizQuestions = [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      answer: 2 // Paris
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
      answer: 1 // Mars
    },
    {
      question: "What is the largest mammal?",
      options: ["Elephant", "Giraffe", "Blue Whale", "Hippopotamus"],
      answer: 2 // Blue Whale
    },
    {
      question: "Who painted the Mona Lisa?",
      options: ["Vincent van Gogh", "Pablo Picasso", "Michelangelo", "Leonardo da Vinci"],
      answer: 3 // Leonardo da Vinci
    },
    {
      question: "Which country is home to the kangaroo?",
      options: ["New Zealand", "South Africa", "Australia", "Brazil"],
      answer: 2 // Australia
    }
  ];
  
  const startQuiz = () => {
    setStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
  };
  
  const handleAnswer = (selectedOption: number) => {
    if (selectedOption === quizQuestions[currentQuestion].answer) {
      setScore(score + 1);
    }
    
    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };
  
  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle className="text-center">Quiz Game</CardTitle>
        <CardDescription className="text-center">Test your knowledge with this quick quiz</CardDescription>
      </CardHeader>
      <CardContent>
        {!started ? (
          <div className="flex justify-center">
            <Button onClick={startQuiz}>Start Quiz</Button>
          </div>
        ) : showResult ? (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Quiz Complete!</h3>
            <p className="text-lg">Your score: {score} out of {quizQuestions.length}</p>
            <Button onClick={startQuiz}>Play Again</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <Badge variant="outline">Question {currentQuestion + 1}/{quizQuestions.length}</Badge>
              <Badge variant="secondary">Score: {score}</Badge>
            </div>
            
            <h3 className="text-lg font-medium mb-4">{quizQuestions[currentQuestion].question}</h3>
            
            <div className="grid gap-3">
              {quizQuestions[currentQuestion].options.map((option, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  className="justify-start text-left h-auto py-3"
                  onClick={() => handleAnswer(index)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function GamesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Games</h1>
      <p className="text-muted-foreground mb-8">Take a break and have some fun with these mini-games!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div>
          <MemoryGame />
          <ReactionSpeedGame />
        </div>
        <div>
          <WordScrambleGame />
          <QuizGame />
        </div>
      </div>
      
      <Separator className="my-10" />
      
      <div className="bg-muted/30 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Game Events Coming Soon</h2>
        <p className="text-muted-foreground">
          We're working on adding competitive events and leaderboards to these games, so community members can 
          compete with each other. Stay tuned for upcoming tournaments and prizes!
        </p>
      </div>
    </div>
  );
}