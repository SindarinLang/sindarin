import { Phases } from "../phase";
import { FileLocation } from "../phase/reader";

export type PhaseError = {
  phase: Phases;
  message: string;
  location?: FileLocation;
};

export function getError(phase: Phases) {
  return (message: string, location?: FileLocation) => ({
    phase,
    message,
    location
  });
}

export function logErrors(errors: PhaseError[]) {
  errors.forEach((error) => {
    console.error(`${error.phase} error: ${error.message}${error.location ? ` (${error.location})` : ""}`);
  });
}
