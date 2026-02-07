"use client";

import { use } from "react";
import PageEditor from "@/components/Admin/PageEditor";

export default function SupportPageEditor({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    return <PageEditor slug={slug} backUrl="/admin/interface/pages" />;
}
