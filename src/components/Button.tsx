import clsx from "clsx";
import React from "react";

export type ButtonProps = {
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: "button" | "submit" | "reset";
};

const Button: React.FC<ButtonProps> = (props) => {
  return (
    <button
      type={props.type}
      onClick={props.onClick}
      className={clsx([
        "bg-indigo-400 h-max w-max rounded-lg text-white font-bold py-2 px-4 duration-[500ms,800ms]",
        "hover:bg-indigo-300",
        props.className,
      ])}
      disabled={props.loading || props.disabled}
    >
      {props.loading ? (
        <div className="flex items-center justify-center">
          <div className="h-5 w-5 border-t-transparent border-solid animate-spin rounded-full border-white border-4"></div>
          <div className="ml-2"> Processing... </div>
        </div>
      ) : (
        props.children
      )}
    </button>
  );
};

export default Button;
