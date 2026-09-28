import { ARCHIVE_COPY } from "@/features/lifecycle/archiveCopy";

export const ARCHIVE_NAVIGATION_QUERY_KEY = "from";
export const ARCHIVE_NAVIGATION_SOURCE = "archive";

export type ArchiveRecordKind = "property" | "client";

export function isArchiveNavigationSource(value: string | null | undefined): boolean {
  return value === ARCHIVE_NAVIGATION_SOURCE;
}

function recordPathSegment(pathname: string, prefix: string): string {
  if (!pathname.startsWith(prefix)) return "";
  const segment = pathname.slice(prefix.length).split("/")[0] ?? "";
  return segment;
}

export function isArchiveNavigationRecordPath(pathname: string | null): boolean {
  if (!pathname) return false;

  const propertySegment = recordPathSegment(pathname, "/properties/");
  if (propertySegment.length > 0 && propertySegment !== "new") return true;

  const clientSegment = recordPathSegment(pathname, "/clients/");
  return (
    clientSegment.length > 0 &&
    clientSegment !== "new" &&
    clientSegment !== "invite-links"
  );
}

export function isArchiveNavigationContext(
  pathname: string | null,
  archiveFromValue: string | null,
): boolean {
  return (
    isArchiveNavigationSource(archiveFromValue) &&
    isArchiveNavigationRecordPath(pathname)
  );
}

export function isPropertiesSidebarActive(
  pathname: string | null,
  archiveFromValue: string | null,
): boolean {
  if (pathname?.startsWith("/properties") !== true) return false;
  return !isArchiveNavigationContext(pathname, archiveFromValue);
}

export function isClientsSidebarActive(
  pathname: string | null,
  archiveFromValue: string | null,
): boolean {
  if (pathname?.startsWith("/clients") !== true) return false;
  if (pathname.startsWith("/client-profiles")) return false;
  return !isArchiveNavigationContext(pathname, archiveFromValue);
}

export function isArchiveSidebarActive(
  pathname: string | null,
  archiveFromValue: string | null,
): boolean {
  if (pathname?.startsWith("/archive") === true) return true;
  return isArchiveNavigationContext(pathname, archiveFromValue);
}

function preservedArchiveListScope(): "MINE" | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const openedFromArchive =
    window.location.pathname === "/archive" ||
    window.location.pathname.startsWith("/archive/") ||
    isArchiveNavigationSource(params.get(ARCHIVE_NAVIGATION_QUERY_KEY));
  if (!openedFromArchive) return null;
  return params.get("scope") === "MINE" ? "MINE" : null;
}

export function appendArchiveNavigationSource(href: string): string {
  const hashIndex = href.indexOf("#");
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
  const withoutHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const queryIndex = withoutHash.indexOf("?");
  const path = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;
  const params = new URLSearchParams(
    queryIndex >= 0 ? withoutHash.slice(queryIndex + 1) : "",
  );
  params.set(ARCHIVE_NAVIGATION_QUERY_KEY, ARCHIVE_NAVIGATION_SOURCE);
  if (!params.has("scope")) {
    const archiveScope = preservedArchiveListScope();
    if (archiveScope === "MINE") {
      params.set("scope", archiveScope);
    }
  }
  const query = params.toString();
  return `${path}?${query}${hash}`;
}

export function isOpenedFromArchiveLocation(): boolean {
  if (typeof window === "undefined") return false;
  const archiveFromValue = new URLSearchParams(window.location.search).get(
    ARCHIVE_NAVIGATION_QUERY_KEY,
  );
  return isArchiveNavigationSource(archiveFromValue);
}

export function shouldCarryArchiveNavigation(): boolean {
  if (typeof window === "undefined") return false;
  if (isOpenedFromArchiveLocation()) return true;
  const pathname = window.location.pathname;
  return pathname === "/archive" || pathname.startsWith("/archive/");
}

export function carryArchiveNavigation(href: string): string {
  if (!shouldCarryArchiveNavigation()) return href;
  return appendArchiveNavigationSource(href);
}

export function recordListHref(kind: ArchiveRecordKind, openedFromArchive: boolean): string {
  if (openedFromArchive) {
    const params = new URLSearchParams();
    if (kind === "client") {
      params.set("tab", "clients");
    }
    const archiveScope = preservedArchiveListScope();
    if (archiveScope === "MINE") {
      params.set("scope", archiveScope);
    }
    const query = params.toString();
    return query ? `/archive?${query}` : "/archive";
  }
  return kind === "client" ? "/clients" : "/properties";
}

export function archiveRecordBackLabel(
  kind: ArchiveRecordKind,
  openedFromArchive: boolean,
): string {
  if (openedFromArchive) return ARCHIVE_COPY.navLabel;
  return kind === "client" ? "ყველა კლიენტი" : "განცხადებები";
}
