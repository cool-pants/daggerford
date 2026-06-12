import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-parchment p-4 text-center">
      <div>
        <h1 className="text-3xl font-black">Location not found</h1>
        <Link className="mt-4 inline-block font-semibold text-tide hover:underline" href="/">
          Return to atlas
        </Link>
      </div>
    </main>
  );
}
