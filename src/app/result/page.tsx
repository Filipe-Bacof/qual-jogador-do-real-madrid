"use client";

import { players } from "@/utils/players";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Result() {
  const [randomIndex, setRandomIndex] = useState<number | null>(null);

  useEffect(() => {
    const getRandomIndex = () => Math.floor(Math.random() * players.length);

    setRandomIndex(getRandomIndex());
  }, []);

  return (
    <main className="flex flex-col items-center my-8 gap-4">
      {randomIndex !== null ? (
        <>
          <Image
            className="w-60 h-auto rounded-md"
            src={players[randomIndex].picture}
            alt={`Imagem de ${players[randomIndex].nome}`}
            width={1000}
            height={1000}
            priority
          />
          <h1 className="text-center text-lg font-semibold">
            Você tirou: {players[randomIndex].nome}
          </h1>
        </>
      ) : (
        <p>Carregando...</p>
      )}
      <Link
        href="/"
        className="bg-emerald-500 mt-4 rounded font-semibold flex justify-center items-center px-4 py-2 text-zinc-800 h-10 hover:bg-emerald-600"
      >
        Tentar novamente
      </Link>
    </main>
  );
}
