"use client";

import { useState, type FormEvent } from "react";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function GMLoginForm() {
  const [uuid, setUuid] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/auth/gm/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uuid, username })
    });
    setMessage(response.ok ? "GM session started for 1 hour." : "Enter a valid GM username and UUID.");
    if (response.ok) {
      window.location.href = "/";
    }
  }

  return (
    <form className="mx-auto w-full max-w-md space-y-4 rounded-lg border border-ink/10 bg-parchment p-6 shadow-atlas" onSubmit={submit}>
      <div>
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-tide text-white">
          <KeyRound className="h-5 w-5" />
        </div>
        <h1 className="mt-4 text-2xl font-black">GM Login</h1>
        <p className="mt-2 text-sm leading-6 text-ink/70">
          Sign in with the username and UUID stored in Supabase. Sessions use an HTTP-only cookie and expire after 1 hour.
        </p>
      </div>
      <Input
        autoComplete="username"
        placeholder="Username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <Input
        autoComplete="off"
        placeholder="00000000-0000-4000-8000-000000000000"
        value={uuid}
        onChange={(event) => setUuid(event.target.value)}
      />
      <Button className="w-full" type="submit" variant="primary">
        Start GM Session
      </Button>
      {message ? <p className="text-sm font-semibold text-tide">{message}</p> : null}
    </form>
  );
}
