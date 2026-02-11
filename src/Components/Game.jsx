import { useState } from "react";
import sunImage from "../assets/sun.png";
import moonImage from "../assets/moon.png";

export default function Game({ n }) {

  const grid = Array(n).fill(null);
  const [name, setName] = useState(
    Array.from({ length: n }, () => Array(n).fill(""))
  );

  const relations = [
    { from: [0, 0], to: [0, 1], symbol: "=" }, // horizontal
    { from: [1, 1], to: [2, 1], symbol: "x" }, // vertical
  ];

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
    setName((prev) => {
      const newArray = [...prev]; // copy outer array
      newArray[i] = [...newArray[i]]; // copy inner array

      if (newArray[i][j] == "sun") {
        newArray[i][j] = "moon";
      } else if (newArray[i][j] == "moon") {
        newArray[i][j] = "";
      } else {
        newArray[i][j] = "sun";
      }
      return newArray;
    });
  };

  return (
    <div className="inline-block">
      {grid.map((_, i) => (
        <div key={i} className="flex">
          {grid.map((_, j) => {
            const relation = getRelation(i, j);

            return (
              <div
                key={j}
                onClick={() => addicon(i, j)}
                className="relative w-16 h-16 border border-gray-400 flex items-center justify-center cursor-pointer"
              >
                {/* ICON */}
                {name[i][j] && (
                  <img
                    src={iconMap[name[i][j]]}
                    alt=""
                    className="w-2/3 h-2/3 object-contain"
                  />
                )}

                {/* RELATION SYMBOL */}
                {relation && relation.direction === "right" && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white px-1 text-lg font-bold z-10">
                    {relation.symbol}
                  </div>
                )}

                {relation && relation.direction === "down" && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-white px-1 text-lg font-bold z-10">
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
