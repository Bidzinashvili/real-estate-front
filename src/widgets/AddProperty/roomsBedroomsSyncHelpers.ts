export function parseOptionalWholeRoomsCount(rawInput: string): number | null {
  const trimmedInput = rawInput.trim();
  if (trimmedInput === "") {
    return null;
  }
  const parsedNumber = parseInt(trimmedInput, 10);
  if (!Number.isFinite(parsedNumber)) {
    return null;
  }
  return parsedNumber;
}

export function syncedBedroomsStringFromRoomsRaw(rawRooms: string): string {
  const roomsCount = parseOptionalWholeRoomsCount(rawRooms);
  if (roomsCount === null) {
    return "";
  }
  return String(Math.max(0, roomsCount - 1));
}

export function normalizeManualBedroomsString(rawInput: string): string {
  const trimmedInput = rawInput.trim();
  if (trimmedInput === "") {
    return "";
  }
  const parsedNumber = parseInt(trimmedInput, 10);
  if (!Number.isFinite(parsedNumber)) {
    return rawInput;
  }
  return String(Math.max(0, parsedNumber));
}
