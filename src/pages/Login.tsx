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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-0 h-[32rem] w-[32rem] rounded-full bg-primary/25 blur-[130px] animate-float" />
        <div className="absolute -right-24 bottom-0 h-[30rem] w-[30rem] rounded-full bg-[hsl(var(--primary-glow)/0.22)] blur-[140px] animate-float [animation-delay:-7s]" />
      </div>

      <div className="w-full max-w-3xl animate-scale-in">
        <div className="mb-7 text-center">
          <span className="brand-gradient mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold text-primary-foreground shadow-float">
            UF
          </span>
          <p className="glass mx-auto mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Headless360 architecture
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Unified Financial Services <span className="brand-text">Engagement Hub</span>
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            A single composable workspace across insurance, wealth and service operations — powered by Salesforce data.
            Choose a demonstration persona to enter.
          </p>
        </div>

        <div className="surface-panel p-6 shadow-float">
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-foreground">Demonstration personas</legend>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {personas.map((p) => (
                <label
                  key={p.id}
                  className={cn(
                    "flex cursor-pointer gap-3 rounded-xl border p-3.5 transition-all duration-200",
                    selected === p.id
                      ? "border-primary/40 bg-primary/[0.08] shadow-glass ring-1 ring-primary/20"
                      : "border-border/70 bg-foreground/[0.02] hover:-translate-y-0.5 hover:bg-foreground/[0.05]",
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
