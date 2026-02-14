// src/components/Game.js
import { useState, useMemo, useEffect } from "react";

import sunImage from "../assets/sun.png";
import moonImage from "../assets/moon.png";
import { generatePuzzle, validateBoard } from "./generate";

export default function Game({ n }) {
  const grid = Array(n).fill(null);

  // generate puzzle (solution, relations, prefills)
  const { solution, relations, prefills } = useMemo(() => {
    return generatePuzzle(n);
  }, [n]);

  // initial player grid: place prefilled icons in the starting state
  const [name, setName] = useState(() => {
    const arr = Array.from({ length: n }, () => Array(n).fill(""));
    if (prefills && prefills.length) {
      for (let p of prefills) {
        const [i, j] = p.pos;
        arr[i][j] = p.value;
      }
    }
    return arr;
  });

  // locked cells grid (true for prefilled/hint cells)
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

  const iconMap = {
    sun: sunImage,
    moon: moonImage,
  };

  const addicon = (i, j) => {
    // locked cells are hints — don't allow changes
    if (locked[i][j]) return;

    setName((prev) => {
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

  useEffect(() => {
    const valid = validateBoard(name);

    if (!valid) {
      console.log("Invalid move");
      return;
    }

    const isFull = name.every(row => row.every(cell => cell !== ""));

    if (isFull) {
      alert("🎉 You solved it!");
    }

  }, [name]);



  return (
    <div className="inline-block">
      {grid.map((_, i) => (
        <div key={i} className="flex">
          {grid.map((_, j) => {
            const relation = getRelation(i, j);
            const isLocked = locked[i][j];

            return (
              <div
                key={j}
                onClick={() => addicon(i, j)}
                className={`relative w-16 h-16 border border-gray-400 flex items-center justify-center cursor-pointer select-none
                  ${isLocked ? "bg-gray-50 cursor-default ring-1 ring-indigo-200" : "hover:bg-gray-100"}`}
                title={isLocked ? "Given hint" : "Click to toggle sun/moon"}
              >
                {/* ICON */}
                {name[i][j] && (
                  <img
                    src={iconMap[name[i][j]]}
                    alt=""
                    className={`w-2/3 h-2/3 object-contain ${isLocked ? "opacity-95" : "opacity-100"}`}
                    draggable="false"
                  />
                )}

                {/* RELATION SYMBOL */}
                {relation && relation.direction === "right" && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white rounded-md text-md font-bold z-10 pointer-events-none select-none">
                    {relation.symbol}
                  </div>
                )}

                {relation && relation.direction === "down" && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-white text-lg font-bold z-10 pointer-events-none select-none">
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
