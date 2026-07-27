import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/context/WorkspaceContext";
import { cn } from "@/lib/utils";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { personas, signIn, personaId } = useWorkspace();
  const [selected, setSelected] = useState(personaId);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-3xl">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded bg-primary text-sm font-bold text-primary-foreground">
            UF
          </span>
          <h1 className="text-2xl font-semibold text-foreground">Unified Financial Services Engagement Hub</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A single workspace across insurance, wealth and service operations. Choose a demonstration persona to enter.
          </p>
        </div>

        <div className="surface-panel p-5">
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-foreground">Demonstration personas</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {personas.map((p) => (
                <label
                  key={p.id}
                  className={cn(
                    "flex cursor-pointer gap-3 rounded border p-3 transition-colors",
                    selected === p.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50",
                  )}
                >
                  <input
                    type="radio"
                    name="persona"
                    value={p.id}
                    checked={selected === p.id}
                    onChange={() => setSelected(p.id)}
                    className="mt-1 h-4 w-4 accent-[hsl(var(--primary))]"
                  />
                  <span>
                    <span className="block text-sm font-medium text-foreground">
                      {p.name} — {p.title}
                    </span>
                    <span className="block text-xs text-muted-foreground">{p.team}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{p.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Prototype environment. All records are synthetic; no production system is contacted.
            </p>
            <Button
              onClick={() => {
                signIn(selected);
                navigate(selected === "customer" ? "/self-service" : "/home");
              }}
            >
              Enter workspace
              <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
