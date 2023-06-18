import React, { PropsWithChildren } from "react";

const Chip: React.FC<
  PropsWithChildren & {
    color: "blue" | "yellow" | "red" | "green";
  }
> = ({ children, color }) => {
  return (
    <div
      className={`
      center relative inline-block select-none whitespace-nowrap rounded-lg px-2.5 py-1 align-baseline font-sans text-xs font-bold uppercase leading-none text-white 
      ${color === "red" ? "bg-red-500" : ""} 
      ${color === "yellow" ? "bg-yellow-500" : ""}
      ${color === "green" ? "bg-green-500" : ""} 
      ${color === "blue" ? "bg-blue-500" : ""}
      }`}
    >
      <div className="mt-px">{children}</div>
    </div>
  );
};

export default Chip;
