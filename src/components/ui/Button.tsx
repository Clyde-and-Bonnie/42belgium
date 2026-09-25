import Link from "next/link";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "default" | "lg";
  className?: string;
}

export function Button({
  href,
  children,
  variant = "primary",
  size = "default",
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-bold uppercase tracking-wider rounded-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-[var(--color-primary)] text-white hover:brightness-110 focus:ring-[var(--color-primary)]",
    secondary:
      "bg-[var(--color-secondary)] text-white hover:brightness-110 focus:ring-[var(--color-secondary)]",
    outline:
      "border-2 border-white text-white hover:bg-white hover:text-black focus:ring-white",
  };

  const sizes = {
    default: "px-6 py-3 text-sm",
    lg: "px-10 py-4 text-base",
  };

  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
