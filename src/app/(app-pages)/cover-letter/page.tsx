export const dynamic = 'force-dynamic';
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CoverLetterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-6xl font-bold gradient-title mb-4">Almost done</h1>
      <h2 className="text-2xl font-semibold mb-4">This page will be available soon...</h2>
      <p className="text-gray-600 mb-8">
        {/* Oops! The page you&apos;re looking for doesn&apos;t exist or has been
        moved.
        <br/> */}
        How about, we head back to home for now?
      </p>
      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  );
}