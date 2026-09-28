"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { isOpenedFromArchiveLocation } from "@/features/lifecycle/archiveNavigation";

export function useOpenedFromArchive(): boolean {
  const pathname = usePathname();
  const [openedFromArchive, setOpenedFromArchive] = useState(false);

  useEffect(() => {
    setOpenedFromArchive(isOpenedFromArchiveLocation());
  }, [pathname]);

  return openedFromArchive;
}
