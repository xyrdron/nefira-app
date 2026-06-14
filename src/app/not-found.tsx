// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-2 text-center">
      <h1 className="text-xl font-semibold">Page not found</h1>
      <p className="text-sm text-default-500">Please check the URL, you can return home <Link href="/">here</Link></p>
    </div>
  );
}
