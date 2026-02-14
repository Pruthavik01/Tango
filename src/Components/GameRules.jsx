export default function GameRules() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Play</h2>
      
      <div className="space-y-4 text-gray-700">
        <div>
          <h3 className="font-bold text-lg mb-2">🎯 Objective</h3>
          <p>Fill the entire grid with suns (☀️) and moons (🌙) following the rules below.</p>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-2">📋 Rules</h3>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li>
              <strong>No three in a row:</strong> You cannot have three consecutive suns or moons in any row or column.
            </li>
            <li>
              <strong>Equal distribution:</strong> Each row and column must have an equal number of suns and moons (3 of each for a 6x6 grid).
            </li>
            <li>
              <strong>Follow the hints:</strong>
              <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                <li><strong>=</strong> means the two adjacent cells must have the same icon</li>
                <li><strong>x</strong> means the two adjacent cells must have different icons</li>
              </ul>
            </li>
            <li>
              <strong>Blue cells:</strong> These are pre-filled hints and cannot be changed.
            </li>
          </ol>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-2">🎮 Controls</h3>
          <p>Click any white cell to cycle through: Sun → Moon → Empty</p>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-2">⚠️ Error Detection</h3>
          <p>Cells with errors will be highlighted in red. Fix all errors to win!</p>
        </div>
      </div>
    </div>
  );
}