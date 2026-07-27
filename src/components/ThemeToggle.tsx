import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      className="w-8 h-8 rounded-lg bg-secondary/60 flex items-center justify-center hover:bg-secondary transition-colors"
      aria-label="Toggle theme"
    >
      {dark ? <Sun className="w-3.5 h-3.5 text-warning" /> : <Moon className="w-3.5 h-3.5 text-foreground" />}
    </button>
  );
};

export default ThemeToggle;
