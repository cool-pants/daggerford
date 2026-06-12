"use client";

import { LogIn, LogOut, Settings, Shield } from "lucide-react";
import Link from "next/link";
import { AddLabelControl } from "@/components/map/AddLabelControl";
import { Button } from "@/components/ui/button";

type Props = {
  isGM: boolean;
  isSuperuser: boolean;
  placementMode: boolean;
  onLogout: () => void;
  onTogglePlacement: () => void;
};

export function GMToolbar({ isGM, isSuperuser, placementMode, onLogout, onTogglePlacement }: Props) {
  async function logout() {
    await fetch("/api/auth/gm/logout", { method: "POST" });
    onLogout();
  }

  return (
    <div className="flex items-center gap-2">
      {isGM ? <AddLabelControl active={placementMode} onToggle={onTogglePlacement} /> : null}
      {isSuperuser ? (
        <Link
          className="hidden h-10 items-center justify-center gap-2 rounded-md border border-ink/15 bg-white/80 px-4 text-sm font-semibold text-ink transition hover:bg-white sm:inline-flex"
          href="/gm/manage"
        >
          <Settings className="h-4 w-4" />
          Manage
        </Link>
      ) : null}
      {isGM ? (
        <Button variant="primary" onClick={logout}>
          <LogOut className="h-4 w-4" />
          GM Mode
        </Button>
      ) : (
        <>
          <Button disabled variant="secondary">
            <Shield className="h-4 w-4" />
            Player
          </Button>
          <Link
            className="h-10 items-center justify-center gap-2 rounded-md border border-ink/15 bg-white/80 px-4 text-sm font-semibold text-ink transition hover:bg-white sm:inline-flex"
            href="/gm/login"
          >
            <LogIn className="h-4 w-4" />
            GM Login
          </Link>
        </>
      )}
    </div>
  );
}
