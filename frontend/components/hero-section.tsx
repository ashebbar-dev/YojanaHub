'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { ArrowRight, CheckCircle2, Search, ShieldCheck } from 'lucide-react';

export function HeroSection() {
    const { language } = useAppStore();

    const content = {
        en: {
            title: 'Find Government Schemes You Are Eligible For',
            subtitle: 'Discover benefits, subsidies, and scholarships tailored to your profile. Simple, fast, and free.',
            cta: 'Find My Schemes',
            stats: [
                { label: 'Schemes Indexed', value: '500+' },
                { label: 'Citizens Helped', value: '10k+' },
                { label: 'Benefits Discovered', value: '₹50Cr+' },
            ],
            features: [
                'Personalized Recommendations',
                'Eligibility Check',
                'Document Assistance',
            ],
        },
        hi: {
            title: 'सरकारी योजनाएं जिनके लिए आप पात्र हैं',
            subtitle: 'अपनी प्रोफ़ाइल के अनुसार लाभ, सब्सिडी और छात्रवृत्ति खोजें। सरल, तेज़ और मुफ़्त।',
            cta: 'मेरी योजनाएं खोजें',
            stats: [
                { label: 'योजनाएं सूचीबद्ध', value: '५००+' },
                { label: 'नागरिकों की मदद', value: '१०हजार+' },
                { label: 'लाभ खोजा गया', value: '₹५०करोड़+' },
            ],
            features: [
                'व्यक्तिगत सिफारिशें',
                'पात्रता जांच',
                'दस्तावेज़ सहायता',
            ],
        },
    };

    const t = content[language];

    return (
        <div className="relative overflow-hidden bg-slate-50 pt-16 pb-24">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        AI-Powered Scheme Discovery
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                        {t.title}
                    </h1>

                    <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                        {t.subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <Link href="/questions">
                            <Button size="lg" className="h-14 px-8 text-lg gap-2 bg-blue-600 hover:bg-blue-700">
                                <Search className="w-5 h-5" />
                                {t.cta}
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-200 pt-12">
                        {t.stats.map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                                <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
