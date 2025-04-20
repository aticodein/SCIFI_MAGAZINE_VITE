import React from "react";

type CardGridProps = {
  items: {
    title: string;
    description: string;
    icon?: React.ReactNode;
    badge?: string;
    titleClass?: string;
  }[];
};

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
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-6 flex-wrap">
          {row.map((item, index) => (
            <div
              key={index}
              className="relative bg-white dark:bg-gray-400 rounded-xl shadow-md p-6 w-72 text-center hover:scale-105 transition duration-300"
            >
              {item.badge && (
                <div className="absolute top-2 right-2 bg-brand-yellow text-xs font-bold px-2 py-1 rounded shadow">
                  {item.badge}
                </div>
              )}
              {item.icon && (
                <div className="mb-2 text-1xl text-brand-dark dark:text-gray-400">
                  {item.icon}
                </div>
              )}
              <h3 className={item.titleClass || "text-brand-dark text-lg font-semibold mb-2"}>
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-800">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
