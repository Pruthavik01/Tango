import { useState, useMemo, useEffect } from "react";
import sunImage from "../assets/sun.png";
import moonImage from "../assets/moon.png";
import { generatePuzzle, validateBoard, checkWin } from "./generate";

export default function Game({ n, onWin }) {
  const grid = Array(n).fill(null);

  // Generate puzzle (solution, relations, prefills)
  const { solution, relations, prefills } = useMemo(() => {
    return generatePuzzle(n);
  }, [n]);

  // Initial player grid: place prefilled icons in the starting state
  const [board, setBoard] = useState(() => {
    const arr = Array.from({ length: n }, () => Array(n).fill(""));
    if (prefills && prefills.length) {
      for (let p of prefills) {
        const [i, j] = p.pos;
        arr[i][j] = p.value;
      }
    }
    return arr;
  });

  // Track errors for visual feedback
  const [errors, setErrors] = useState([]);

  // Locked cells grid (true for prefilled/hint cells)
  const locked = useMemo(() => {
    const lockArr = Array.from({ length: n }, () => Array(n).fill(false));
    if (prefills && prefills.length) {
      for (let p of prefills) {
        const [i, j] = p.pos;
        lockArr[i][j] = true;
      }
    }
    return lockArr;
  }, [prefills, n]);

  const getRelation = (i, j) => {
    for (let rel of relations) {
      const [r1, c1] = rel.from;
      const [r2, c2] = rel.to;

      // Horizontal
      if (r1 === i && c1 === j && r2 === i && c2 === j + 1) {
        return { symbol: rel.symbol, direction: "right" };
      }

      // Vertical
      if (r1 === i && c1 === j && r2 === i + 1 && c2 === j) {
        return { symbol: rel.symbol, direction: "down" };
      }
    }
    return null;
  };

  const renderIcon = (value) => {
    if (value === "sun") {
      return (
        <img
          src={sunImage}
          alt="Sun"
          className="w-3/5 h-3/5 object-contain select-none pointer-events-none"
          draggable="false"
        />
      );
    }
    else if (value === "moon") {
      return (
        <img
          src={moonImage}
          alt="Moon"
          className="w-3/5 h-3/5 object-contain select-none pointer-events-none"
          draggable="false"
        />
      );
    }
    return null;
  };

  const toggleIcon = (i, j) => {
    // Locked cells are hints — don't allow changes
    if (locked[i][j]) return;

    setBoard((prev) => {
      const newArray = prev.map((row) => row.slice()); // deep copy
      if (newArray[i][j] === "sun") {
        newArray[i][j] = "moon";
      } else if (newArray[i][j] === "moon") {
        newArray[i][j] = "";
      } else {
        newArray[i][j] = "sun";
      }
      return newArray;
    });
  };

  const hasError = (i, j) => {
    return errors.some(err => err.pos[0] === i && err.pos[1] === j);
  };

  const getErrorType = (i, j) => {
    const error = errors.find(err => err.pos[0] === i && err.pos[1] === j);
    return error ? error.type : null;
  };



  useEffect(() => {
    const { isValid, errors: validationErrors } = validateBoard(board, relations);
    setErrors(validationErrors);

    // checkWin already checks completeness + validity (per above)
    if (checkWin(board, relations)) {
      onWin?.();
    }
  }, [board, relations, onWin]);


  return (
    <div className="inline-block">
      {grid.map((_, i) => (
        <div key={i} className="flex">
          {grid.map((_, j) => {
            const relation = getRelation(i, j);
            const isLocked = locked[i][j];
            const error = hasError(i, j);
            const errorType = getErrorType(i, j);

            return (
              <div
                key={j}
                onClick={() => toggleIcon(i, j)}
                className={`
                  relative w-20 h-20 border-2 flex items-center justify-center select-none transition-all duration-200
                  ${isLocked
                    ? "bg-blue-50 border-blue-300 cursor-default"
                    : error
                      ? errorType === 'hint'
                        ? "bg-red-100 border-red-500 cursor-pointer animate-pulse"
                        : "bg-red-50 border-red-400 cursor-pointer"
                      : "bg-white border-gray-300 cursor-pointer hover:bg-gray-50 hover:border-blue-400"
                  }
                `}
                title={
                  isLocked
                    ? "Given hint"
                    : error
                      ? errorType === 'hint'
                        ? "Violates hint constraint (= or x)"
                        : errorType === 'three'
                          ? "Three in a row/column"
                          : "Too many of this icon"
                      : "Click to toggle sun/moon"
                }
              >
                {/* ICON */}
                {board[i][j] && (
                  <div className={`w-full h-full flex items-center justify-center ${error ? "opacity-60" : "opacity-100"}`}>
                    {renderIcon(board[i][j])}
                  </div>
                )}

                {/* ERROR INDICATOR */}
                {error && !isLocked && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                )}

                {/* RELATION SYMBOL */}
                {relation && relation.direction === "right" && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white border-2 border-gray-700 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold text-gray-800 z-10 pointer-events-none select-none shadow-md">
                    {relation.symbol}
                  </div>
                )}

                {relation && relation.direction === "down" && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-white border-2 border-gray-700 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold text-gray-800 z-10 pointer-events-none select-none shadow-md">
                    {relation.symbol}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}