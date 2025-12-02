'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getPersonas, calculateEligibility } from '@/lib/api';
import { useAppStore } from '@/lib/store';
import { PersonaCard } from './persona-card';
import { Persona } from '@/types';

export function PersonaQuickStart() {
    const router = useRouter();
    const { language, setUserAttributes, setEligibleSchemes } = useAppStore();
    const [loadingId, setLoadingId] = React.useState<string | null>(null);

    const { data: personas, isLoading } = useQuery({
        queryKey: ['personas'],
        queryFn: getPersonas,
    });

    const handlePersonaSelect = async (persona: Persona) => {
        try {
            setLoadingId(persona.id);

            // 1. Set attributes in store
            setUserAttributes(persona.attributes);

            // 2. Calculate eligibility immediately
            const schemes = await calculateEligibility(persona.attributes);
            setEligibleSchemes(schemes);

            // 3. Navigate to results
            await new Promise(resolve => setTimeout(resolve, 100));
            router.push('/results');
        } catch (error) {
            console.error('Demo failed:', error);
            // In a real app, show a toast notification here
        } finally {
            setLoadingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-64 bg-slate-100 rounded-xl"></div>
                ))}
            </div>
        );
    }

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">
                        {language === 'hi' ? 'त्वरित डेमो देखें' : 'Try a Quick Demo'}
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        {language === 'hi'
                            ? 'देखें कि योजनाहब विभिन्न लोगों की मदद कैसे करता है। शुरू करने के लिए एक प्रोफ़ाइल चुनें।'
                            : 'See how YojanaHub helps different people. Select a profile to see their eligible schemes instantly.'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {personas?.map((persona) => (
                        <PersonaCard
                            key={persona.id}
                            persona={persona}
                            onSelect={handlePersonaSelect}
                            isLoading={loadingId === persona.id}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
