import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, type ReactNode } from "react";

export interface GuidedStep {
  id: string;
  title: string;
  description: string;
  content: ReactNode;
  isComplete?: boolean;
  validationMessage?: string;
}

/**
 * Reusable guided-flow stepper. Flows never edit a source system directly —
 * completing a flow raises an auditable work item.
 */
export function GuidedFlow({
  open,
  onOpenChange,
  title,
  description,
  steps,
  submitLabel,
  onSubmit,
  outcomeNote,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  steps: GuidedStep[];
  submitLabel: string;
  onSubmit: () => void;
  outcomeNote: string;
}) {
  const [index, setIndex] = useState(0);
  const step = steps[index];
  const last = index === steps.length - 1;
  const blocked = step.isComplete === false;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setIndex(0);
      }}
    >
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Step {index + 1} of {steps.length}: {step.title}
              </span>
              <span>Progress saved automatically</span>
            </div>
            <Progress value={((index + 1) / steps.length) * 100} aria-label="Flow progress" />
          </div>

          <ol className="flex flex-wrap gap-1.5" aria-label="Flow steps">
            {steps.map((s, i) => (
              <li
                key={s.id}
                className={cn(
                  "rounded border px-2 py-1 text-xs",
                  i < index && "border-success/30 bg-success/10 text-success",
                  i === index && "border-primary bg-primary/10 font-medium text-primary",
                  i > index && "border-border text-muted-foreground",
                )}
              >
                {i < index && <Check className="mr-1 inline h-3 w-3" aria-hidden="true" />}
                {s.title}
              </li>
            ))}
          </ol>

          <div className="rounded border border-border bg-muted/30 p-4">
            <p className="mb-3 text-sm text-muted-foreground">{step.description}</p>
            {step.content}
            {blocked && step.validationMessage && (
              <p role="alert" className="mt-3 text-sm font-medium text-destructive">
                {step.validationMessage}
              </p>
            )}
          </div>

          <p className="rounded border border-border bg-card p-3 text-xs text-muted-foreground">{outcomeNote}</p>
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button type="button" variant="ghost" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>
            <ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" />
            Back
          </Button>
          {last ? (
            <Button
              type="button"
              disabled={blocked}
              onClick={() => {
                onSubmit();
                onOpenChange(false);
                setIndex(0);
              }}
            >
              {submitLabel}
            </Button>
          ) : (
            <Button type="button" disabled={blocked} onClick={() => setIndex((i) => Math.min(steps.length - 1, i + 1))}>
              Continue
              <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  destructive,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant={destructive ? "destructive" : "default"}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
