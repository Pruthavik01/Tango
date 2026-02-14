import { useState } from 'react';
import './App.css';
import Game from './Components/Game';
import Timer from './Components/Timer';
import WinModal from './Components/WinModal';
import GameRules from './Components/GameRules';

function App() {
  const [isWin, setIsWin] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [showRules, setShowRules] = useState(false);

  const handleWin = () => {
    setIsWin(true);
  };

  const handleReset = () => {
    setGameKey(prev => prev + 1);
    setIsWin(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Tango
          </h1>
          <p className="text-gray-600 text-lg mb-4">
            A logical puzzle game of suns and moons
          </p>
          <button
            onClick={() => setShowRules(!showRules)}
            className="text-blue-600 hover:text-blue-800 font-semibold underline"
          >
            {showRules ? "Hide Rules" : "Show Rules"}
          </button>
        </div>

        {/* Rules Section */}
        {showRules && (
          <div className="mb-8">
            <GameRules />
          </div>
        )}

        {/* Game Area */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center">
          <Timer isWin={isWin} onReset={handleReset} />
          
          <div className="mb-6">
            <Game key={gameKey} n={6} onWin={handleWin} />
          </div>

          {/* Legend */}
          <div className="w-full max-w-md bg-gray-50 rounded-lg p-4 mt-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Legend:</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-50 border-2 border-blue-300 rounded"></div>
                <span>Given hint (locked)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-50 border-2 border-red-400 rounded"></div>
                <span>Error (rule violated)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white border-2 border-gray-700 rounded-full flex items-center justify-center font-bold">=</div>
                <span>These two cells must be the same</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white border-2 border-gray-700 rounded-full flex items-center justify-center font-bold">x</div>
                <span>These two cells must be different</span>
              </div>
            </div>
          </div>
        </div>

        {/* Win Modal */}
        {isWin && <WinModal onNewGame={handleReset} />}
      </div>
    </div>
  );
}

export default App;