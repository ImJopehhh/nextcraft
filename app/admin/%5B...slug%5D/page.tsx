import { notFound } from "next/navigation";

/**
 * Catch-all route for the admin section.
 * Any URL under /admin/* that doesn't match a specific file 
 * will fall back here and trigger the admin's local not-found.tsx.
 */
export default function AdminCatchAll() {
    notFound();
}
