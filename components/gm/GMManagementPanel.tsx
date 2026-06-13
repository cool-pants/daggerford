"use client";

import { useState, type FormEvent } from "react";
import { ShieldPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uuidOrNew } from "@/lib/ids";

type Snapshot = {
  gms: Array<{ id: string; username: string; displayName: string; isSuperuser: boolean; isActive: boolean }>;
  notes: Array<{ id: string; type: string; title: string; body: string; label: string; author: string }>;
  npcs: Array<{ name: string; label: string; author: string }>;
  events: Array<{ name: string; label: string; author: string }>;
};

type Props = {
  initialSnapshot: Snapshot;
};

export function GMManagementPanel({ initialSnapshot }: Props) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [uuid, setUuid] = useState("");
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [message, setMessage] = useState("");

  async function refresh() {
    const response = await fetch("/api/gm/management");
    if (response.ok) {
      setSnapshot((await response.json()) as Snapshot);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/gm/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uuid: uuid || uuidOrNew(undefined),
        username,
        displayName,
        isSuperuser
      })
    });

    if (!response.ok) {
      setMessage("Could not create GM.");
      return;
    }

    setUsername("");
    setDisplayName("");
    setUuid("");
    setIsSuperuser(false);
    setMessage("GM created.");
    await refresh();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <section className="rounded-lg border border-ink/10 bg-parchment p-5 shadow-atlas">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-tide text-white">
            <ShieldPlus className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black">GM Management</h1>
            <p className="text-sm text-ink/60">Only Superusers can create GMs and inspect cross-GM campaign work.</p>
          </div>
        </div>
        <form className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_1.4fr_auto]" onSubmit={submit}>
          <Input placeholder="Username" value={username} onChange={(event) => setUsername(event.target.value)} />
          <Input placeholder="Display name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
          <Input
            placeholder="UUID optional"
            value={uuid}
            onChange={(event) => setUuid(event.target.value)}
          />
          <label className="flex h-10 items-center gap-2 rounded-md border border-ink/15 bg-white/80 px-3 text-sm font-semibold">
            <input checked={isSuperuser} type="checkbox" onChange={(event) => setIsSuperuser(event.target.checked)} />
            Superuser
          </label>
          <Button className="md:col-span-4" type="submit" variant="primary">
            Add GM
          </Button>
        </form>
        {message ? <p className="mt-3 text-sm font-semibold text-tide">{message}</p> : null}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <ManagementList
          items={snapshot.gms.map((gm) => ({
            title: gm.username,
            meta: `${gm.displayName} - ${gm.isSuperuser ? "Superuser" : "GM"} - ${gm.isActive ? "active" : "inactive"}`
          }))}
          title="GMs"
        />
        <ManagementList
          items={snapshot.notes.map((note) => ({
            title: note.title,
            meta: `${note.type} - ${note.label} - ${note.author}`,
            body: note.body
          }))}
          title="Notes By GM"
        />
        <ManagementList
          items={snapshot.npcs.map((npc) => ({
            title: npc.name,
            meta: `${npc.label} - ${npc.author}`
          }))}
          title="NPCs By GM"
        />
        <ManagementList
          items={snapshot.events.map((event) => ({
            title: event.name,
            meta: `${event.label} - ${event.author}`
          }))}
          title="Events By GM"
        />
      </section>
    </div>
  );
}

function ManagementList({
  title,
  items
}: {
  title: string;
  items: Array<{ title: string; meta: string; body?: string }>;
}) {
  return (
    <section className="rounded-lg border border-ink/10 bg-white/70 p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-black">{title}</h2>
        <span className="text-xs font-bold text-ink/45">{items.length}</span>
      </div>
      <div className="mt-3 space-y-2">
        {items.length ? (
          items.map((item) => (
            <article key={`${title}-${item.title}-${item.meta}`} className="rounded-md border border-ink/10 bg-parchment/70 p-3">
              <h3 className="font-bold">{item.title}</h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink/50">{item.meta}</p>
              {item.body ? <p className="mt-2 text-sm leading-5 text-ink/75">{item.body}</p> : null}
            </article>
          ))
        ) : (
          <p className="rounded-md border border-dashed border-ink/15 p-3 text-sm text-ink/50">No records yet.</p>
        )}
      </div>
    </section>
  );
}
