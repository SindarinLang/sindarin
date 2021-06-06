import { Phases } from ".";

export type PhaseError = {
  phase: Phases;
  message: string;
};

export function getError(phase: Phases) {
  return (message: string) => ({
    phase,
    message
  });
}

export function logErrors(errors: PhaseError[]) {
  errors.forEach((error) => {
    console.error(`${error.phase} error: ${error.message}`);
  });
}
