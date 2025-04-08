import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

// Simple quiz game
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <MemoryGame />
        </div>
        <div>
          <QuizGame />
        </div>
      </div>
      
      <Separator className="my-10" />
      
      <div className="bg-muted/30 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">More Games Coming Soon</h2>
        <p className="text-muted-foreground">
          We're working on adding more fun games and activities to help community members relax and engage 
          with each other. Stay tuned for updates!
        </p>
      </div>
    </div>
  );
}