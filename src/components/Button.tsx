type ButtonProps = {
  gray?: boolean;
  small?: boolean;
  className?: string;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export function Button({ gray, small, className = "", ...props }: ButtonProps) {
  const colorClasses = gray
    ? "bg-gray-400 hover:bg-gray-300 focus-visible:bg-gray-300"
    : "bg-[#1d92ae] hover:bg-[#1d92ae]/90 focus-visible:bg-blue-400";
  const sizeClasses = small ? "px-2 py-1" : "px-4 py-2 font-bold";

  return (
    <button
      className={`rounded-lg text-white transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${colorClasses} ${sizeClasses} ${className}`}
      {...props}
    ></button>
  );
}
