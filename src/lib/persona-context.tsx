import * as React from "react";
import type { PersonaId } from "./mazda-mock";

type Ctx = {
  persona: PersonaId;
  setPersona: (p: PersonaId) => void;
  reasoningOpen: boolean;
  setReasoningOpen: (v: boolean) => void;
};

const PersonaContext = React.createContext<Ctx | null>(null);

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [persona, setPersona] = React.useState<PersonaId>("field");
  const [reasoningOpen, setReasoningOpen] = React.useState(false);
  return (
    <PersonaContext.Provider value={{ persona, setPersona, reasoningOpen, setReasoningOpen }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  const ctx = React.useContext(PersonaContext);
  if (!ctx) throw new Error("usePersona must be used within PersonaProvider");
  return ctx;
}