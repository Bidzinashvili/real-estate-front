export function formatGeorgianLocative(place: string): string {
  const trimmedPlace = place.trim();
  if (trimmedPlace === "") {
    return "";
  }
  if (trimmedPlace.endsWith("ი")) {
    return `${trimmedPlace.slice(0, -1)}ში`;
  }
  if (trimmedPlace.endsWith("ო")) {
    return `${trimmedPlace}ზე`;
  }
  return `${trimmedPlace}ში`;
}
