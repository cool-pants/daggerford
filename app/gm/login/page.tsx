import Link from "next/link";
import { GMLoginForm } from "@/components/gm/GMLoginForm";

export default function GMLoginPage() {
  return (
    <main className="grid min-h-dvh place-items-center p-4">
      <div className="w-full">
        <GMLoginForm />
        <Link className="mx-auto mt-5 block w-fit text-sm font-semibold text-tide hover:underline" href="/">
          Return to atlas
        </Link>
      </div>
    </main>
  );
}
