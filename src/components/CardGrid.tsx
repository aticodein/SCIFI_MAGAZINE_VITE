import React from "react";

type CardGridProps = {
  items: {
    title: string;
    description: string;
  }[];
};

// Helper to break array into chunks of max 3
function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export default function CardGrid({ items }: CardGridProps) {
  const rows = chunkArray(items, 3);

  return (
    <div className="flex flex-col items-center gap-6">
      {chunkArray(items, 3).map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-6 flex-wrap">
          {row.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 w-72 text-center hover:scale-105 transition duration-200"
            >
              <h3 className="text-brand-indigo text-lg font-semibold mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
  
}
