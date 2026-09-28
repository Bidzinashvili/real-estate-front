"use client";

import { useEffect, useState, type ComponentProps, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { carryArchiveNavigation } from "@/features/lifecycle/archiveNavigation";

type ArchiveCarryLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

function isPlainLeftClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

export function ArchiveCarryLink({ href, onClick, ...rest }: ArchiveCarryLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [resolvedHref, setResolvedHref] = useState(href);

  useEffect(() => {
    setResolvedHref(carryArchiveNavigation(href));
  }, [href, pathname]);

  return (
    <Link
      {...rest}
      href={resolvedHref}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        const nextHref = carryArchiveNavigation(href);
        if (nextHref === href || !isPlainLeftClick(event)) return;
        event.preventDefault();
        router.push(nextHref);
      }}
    />
  );
}
