import {
  type ArchiveRecordKind,
  recordListHref,
} from "@/features/lifecycle/archiveNavigation";

const RECORD_LIST_RETURN_KEY = "realEstate:recordListReturn";

type RecordListRouter = {
  back: () => void;
  push: (href: string) => void;
};

export function rememberRecordListReturn(): void {
  if (typeof window === "undefined") {
    return;
  }
  sessionStorage.setItem(
    RECORD_LIST_RETURN_KEY,
    `${window.location.pathname}${window.location.search}`,
  );
}

function readRecordListReturn(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return sessionStorage.getItem(RECORD_LIST_RETURN_KEY);
}

function clearRecordListReturn(): void {
  if (typeof window === "undefined") {
    return;
  }
  sessionStorage.removeItem(RECORD_LIST_RETURN_KEY);
}

function isPlausibleRecordListReturn(
  href: string,
  kind: ArchiveRecordKind,
  openedFromArchive: boolean,
): boolean {
  try {
    const parsedUrl = new URL(href, window.location.origin);
    if (openedFromArchive) {
      return parsedUrl.pathname === "/archive";
    }
    if (kind === "client") {
      return parsedUrl.pathname === "/clients";
    }
    return parsedUrl.pathname === "/properties";
  } catch {
    return false;
  }
}

export function navigateBackToRecordList(
  router: RecordListRouter,
  kind: ArchiveRecordKind,
  openedFromArchive: boolean,
): void {
  if (typeof window !== "undefined" && window.history.length > 1) {
    clearRecordListReturn();
    router.back();
    return;
  }

  const rememberedReturn = readRecordListReturn();
  clearRecordListReturn();
  if (
    rememberedReturn &&
    isPlausibleRecordListReturn(rememberedReturn, kind, openedFromArchive)
  ) {
    router.push(rememberedReturn);
    return;
  }

  router.push(recordListHref(kind, openedFromArchive));
}
