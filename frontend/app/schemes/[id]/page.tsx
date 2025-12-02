import { SchemeDetailClient } from '@/components/scheme-detail-client';

export async function generateStaticParams() {
    return [{ id: '1' }];
}

export default function SchemeDetailPage() {
    return <SchemeDetailClient />;
}
