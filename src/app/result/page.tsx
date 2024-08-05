import Image from "next/image";
import Link from "next/link";

export default function Result() {
  return (
    <main className="flex flex-col items-center my-8 gap-4">
      <Image
        className="w-60 h-auto rounded-md"
        src="/Luka-Modric.jpg"
        alt="Real Madrid Team"
        width={559}
        height={713}
        priority
      />
      <h1 className="text-center text-lg font-semibold">
        Você tirou: Luka Modric
      </h1>
      <Link
        href="/"
        className="bg-emerald-500 mt-4 rounded font-semibold flex justify-center items-center px-4 py-2 text-zinc-800 h-10 hover:bg-emerald-600"
      >
        Tentar novamente
      </Link>
    </main>
  );
}
