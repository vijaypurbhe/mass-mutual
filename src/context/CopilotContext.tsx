import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

interface CopilotContextValue {
  contextLabel: string;
  contextText: string;
  setContext: (label: string, text: string) => void;
}

const Ctx = createContext<CopilotContextValue | null>(null);

const DEFAULT_LABEL = "Workspace overview";
const DEFAULT_TEXT =
  "No specific client record is open. The employee is working from a workspace-level view of queues, alerts and tasks.";

export function CopilotContextProvider({ children }: { children: ReactNode }) {
  const [contextLabel, setLabel] = useState(DEFAULT_LABEL);
  const [contextText, setText] = useState(DEFAULT_TEXT);

  const value = useMemo<CopilotContextValue>(
    () => ({
      contextLabel,
      contextText,
      setContext: (label, text) => {
        setLabel(label);
        setText(text);
      },
    }),
    [contextLabel, contextText],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCopilotContextStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCopilotContextStore must be used inside CopilotContextProvider");
  return ctx;
}

/** Pages call this to ground Copilot in the record currently on screen. */
export function useCopilotContext(label: string, text: string) {
  const { setContext } = useCopilotContextStore();
  useEffect(() => {
    setContext(label, text);
    return () => setContext(DEFAULT_LABEL, DEFAULT_TEXT);
  }, [label, text, setContext]);
}
