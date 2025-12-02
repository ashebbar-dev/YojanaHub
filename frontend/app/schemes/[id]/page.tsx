import { SchemeDetailClient } from '@/components/scheme-detail-client';

export async function generateStaticParams() {
    return [];
}

export default function SchemeDetailPage() {
    return <SchemeDetailClient />;
}
