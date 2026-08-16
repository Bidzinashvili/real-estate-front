export const PROPERTY_PRICE_MARKUP_RATIO = 1.03;

export function roundPropertyPrice(value: number): number {
  return Math.round(value);
}

export function calculatePublicPriceFromInternal(internalPrice: number): number {
  return roundPropertyPrice(internalPrice * PROPERTY_PRICE_MARKUP_RATIO);
}

export function calculateInternalPriceFromPublic(publicPrice: number): number {
  return roundPropertyPrice(publicPrice / PROPERTY_PRICE_MARKUP_RATIO);
}

export function formatPropertyPriceForInput(value: number): string {
  return String(roundPropertyPrice(value));
}

export function parsePropertyPriceInput(rawValue: string): number | null {
  const trimmedValue = rawValue.trim();
  if (trimmedValue === "") {
    return null;
  }
  const parsedPrice = Number.parseInt(trimmedValue, 10);
  if (!Number.isFinite(parsedPrice)) {
    return null;
  }
  return parsedPrice;
}

export type LinkedPropertyPrices = {
  priceInternal: number | undefined;
  pricePublic: number | undefined;
};

export type LinkedPropertyPriceInputs = {
  priceInternal: string;
  pricePublic: string;
};

export function applyLinkedPropertyPriceChange(options: {
  changedField: "priceInternal" | "pricePublic";
  nextValue: number | undefined;
  currentInternal: number | undefined;
  currentPublic: number | undefined;
}): LinkedPropertyPrices {
  const { changedField, nextValue, currentInternal, currentPublic } = options;

  if (nextValue === undefined) {
    return {
      priceInternal: changedField === "priceInternal" ? undefined : currentInternal,
      pricePublic: changedField === "pricePublic" ? undefined : currentPublic,
    };
  }

  if (changedField === "priceInternal") {
    return {
      priceInternal: nextValue,
      pricePublic: calculatePublicPriceFromInternal(nextValue),
    };
  }

  return {
    pricePublic: nextValue,
    priceInternal: calculateInternalPriceFromPublic(nextValue),
  };
}

export function applyLinkedPropertyPriceInputChange(options: {
  changedField: "priceInternal" | "pricePublic";
  nextInput: string;
  currentInternal: string;
  currentPublic: string;
}): LinkedPropertyPriceInputs {
  const parsedNextValue = parsePropertyPriceInput(options.nextInput);

  if (parsedNextValue === null) {
    return {
      priceInternal:
        options.changedField === "priceInternal"
          ? options.nextInput
          : options.currentInternal,
      pricePublic:
        options.changedField === "pricePublic"
          ? options.nextInput
          : options.currentPublic,
    };
  }

  const nextPrices = applyLinkedPropertyPriceChange({
    changedField: options.changedField,
    nextValue: parsedNextValue,
    currentInternal: parsePropertyPriceInput(options.currentInternal) ?? undefined,
    currentPublic: parsePropertyPriceInput(options.currentPublic) ?? undefined,
  });

  return {
    priceInternal:
      options.changedField === "priceInternal"
        ? options.nextInput
        : nextPrices.priceInternal === undefined
          ? ""
          : formatPropertyPriceForInput(nextPrices.priceInternal),
    pricePublic:
      options.changedField === "pricePublic"
        ? options.nextInput
        : nextPrices.pricePublic === undefined
          ? ""
          : formatPropertyPriceForInput(nextPrices.pricePublic),
  };
}
