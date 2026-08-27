export const PUBLIC_PROPERTY_SHARE_PATH_PREFIX = "/share/property";

const GEORGIAN_LOCAL_MOBILE_PATTERN = /^5\d{8}$/;
const MIN_WHATSAPP_DIGITS = 8;
const MAX_WHATSAPP_DIGITS = 15;

export function getPublicPropertySharePath(propertyId: string): string {
  return `${PUBLIC_PROPERTY_SHARE_PATH_PREFIX}/${propertyId}`;
}

export function getPublicPropertyShareUrl(propertyId: string, origin: string): string {
  const normalizedOrigin = origin.replace(/\/$/, "");
  return `${normalizedOrigin}${getPublicPropertySharePath(propertyId)}`;
}

export function getBrowserOrigin(): string {
  if (typeof window === "undefined") {
    return "";
  }
  return window.location.origin;
}

export function extractWhatsAppDigits(rawPhone: string): string | null {
  const compactInput = rawPhone.trim().replace(/[\s()-]/g, "");
  if (compactInput === "") {
    return null;
  }

  const withoutTrunkPrefix = compactInput.startsWith("00")
    ? compactInput.slice(2)
    : compactInput;
  let digitsOnly = withoutTrunkPrefix.replace(/\D/g, "");

  if (GEORGIAN_LOCAL_MOBILE_PATTERN.test(digitsOnly)) {
    digitsOnly = `995${digitsOnly}`;
  }

  if (digitsOnly.length < MIN_WHATSAPP_DIGITS || digitsOnly.length > MAX_WHATSAPP_DIGITS) {
    return null;
  }

  return digitsOnly;
}

export function isUsableWhatsAppPhone(rawPhone: string): boolean {
  return extractWhatsAppDigits(rawPhone) !== null;
}

export function buildPropertyWhatsAppMessage(params: {
  title: string;
  shareUrl: string;
}): string {
  const trimmedTitle = params.title.trim();
  if (trimmedTitle === "") {
    return `გამარჯობა, გიგზავნით ვარიანტს:\n\n${params.shareUrl}`;
  }
  return `გამარჯობა, გიგზავნით ვარიანტს:\n\n${trimmedTitle}\n${params.shareUrl}`;
}

export function buildWhatsAppChatUrl(phoneDigits: string, message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneDigits}?text=${encodedMessage}`;
}

export function openWhatsAppChat(phoneDigits: string, message: string): void {
  const whatsappUrl = buildWhatsAppChatUrl(phoneDigits, message);
  const popup = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  if (popup === null) {
    window.location.assign(whatsappUrl);
  }
}

export function openPropertyWhatsAppShare(params: {
  rawPhone: string;
  propertyId: string;
  title: string;
}): boolean {
  const phoneDigits = extractWhatsAppDigits(params.rawPhone);
  if (!phoneDigits) {
    return false;
  }
  const origin = getBrowserOrigin();
  const shareUrl = getPublicPropertyShareUrl(params.propertyId, origin);
  const message = buildPropertyWhatsAppMessage({
    title: params.title,
    shareUrl,
  });
  openWhatsAppChat(phoneDigits, message);
  return true;
}
