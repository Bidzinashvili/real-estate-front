import type { KeyboardEvent } from "react";

export function preventImplicitFormSubmitOnEnter(
  event: KeyboardEvent<HTMLFormElement>,
): void {
  if (event.key !== "Enter" || event.nativeEvent.isComposing) {
    return;
  }

  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  if (target.type === "submit" || target.type === "button") {
    return;
  }

  event.preventDefault();
}
