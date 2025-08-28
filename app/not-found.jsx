import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[100vh] px-4">
            <h1 className="text-6xl font-bold bg-gradient-to-b mb-4">404</h1>
            <h2>Page Not Found</h2>
            <p className="text-gray-600 mb-8">
                Oops! The page you&apos;re looking for doesn&apos;t exist or has been
                moved.
            </p>
            <Link href="/">
                <Button>Return Home</Button>
            </Link>
        </div>
    )
}