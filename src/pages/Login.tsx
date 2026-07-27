import { useState } from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import techMahindraLogo from "@/assets/tech-mahindra-logo.png";
import { appendLoginAuditEntry, isAllowedDemoEmail, normalizeEmail, TECH_MAHINDRA_DOMAIN } from "@/lib/demoAccess";

interface LoginProps {
  onAuthenticated: (email: string) => void;
}

const Login = ({ onAuthenticated }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = normalizeEmail(email);

    if (!trimmed) {
      setError("Please enter your email address.");
      return;
    }

    if (!isAllowedDemoEmail(trimmed)) {
      setError(`Access restricted to ${TECH_MAHINDRA_DOMAIN} email addresses.`);
      return;
    }

    appendLoginAuditEntry(trimmed);
    onAuthenticated(trimmed);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 px-4">
      <div className="w-full max-w-md rounded-[28px] border border-border/40 bg-card/80 backdrop-blur-2xl shadow-[0_20px_70px_-15px_hsl(var(--primary)/0.25)] p-10 space-y-8">
        <div className="flex flex-col items-center gap-4">
          <img
            src={techMahindraLogo}
            alt="Tech Mahindra"
            className="h-24 w-auto object-contain"
          />
          <div className="h-px w-16 bg-border/60" />
        </div>

        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            AI Commerce Navigator
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your Tech Mahindra email to access the demo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder={`you${TECH_MAHINDRA_DOMAIN}`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="h-12 text-base rounded-xl bg-background/60 border-border/50 focus-visible:ring-primary/40"
              autoFocus
            />
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>

          <Button type="submit" className="w-full h-12 text-base rounded-xl font-semibold">
            Access Demo
          </Button>
        </form>

        <p className="text-xs text-center text-muted-foreground/70">
          This demo is restricted to authorized Tech Mahindra personnel.
        </p>
      </div>
    </div>
  );
};

export default Login;
