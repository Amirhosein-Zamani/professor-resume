import type { Metadata } from "next";
import SearchBar from "@/components/shared/SearchBar";
import Hero from "./(Home)/components/Hero";
import Faculty from "./(Home)/components/Faculty";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <div className="bg-bg text-text">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <Hero />

        <div>
          <SearchBar />
        </div>

        <Faculty />

      </main>
    </div>
  );
}
