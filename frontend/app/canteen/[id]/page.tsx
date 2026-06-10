'use client';

import { useParams } from 'next/navigation';
import CanteenMenu from '@/components/canteen-menu';

const canteenMap: Record<string, string> = {
    'goda': 'Goda Canteen',
    'vala': 'Vala Canteen',
    'civil': 'Civil Canteen'
};

export default function CanteenPage() {
    const params = useParams();
    const id = params.id as string;
    const canteenName = canteenMap[id] || 'Canteen';

    return <CanteenMenu canteenId={id} canteenName={canteenName} />;
}
