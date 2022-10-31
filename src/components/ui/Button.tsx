import React from "react";

interface Props {
  bgColor: string;
  color: string;
  size?: string;
  text: string;
  borderRadius: string;
  type: "button" | "submit";
  disabled?: boolean;
  additionalClass?: string;
  width?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

const Button = ({
  bgColor,
  color,
  size,
  text,
  borderRadius,
  type,
  disabled,
  additionalClass,
  width,
  onClick,
}: Props) => {
  return (
    <button
      type={type}
      style={{
        // backgroundColor: disabled ? "#bbb" : bgColor,
        color,
        borderRadius,
      }}
      className={`text-${size} p-3 cursor-pointer ${bgColor} hover:drop-shadow-xl uppercase disabled:opacity-50  disabled:cursor-default disabled:drop-shadow-none w-${width} ${
        additionalClass ? additionalClass : ""
      }`}
      disabled={disabled ? disabled : false}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
