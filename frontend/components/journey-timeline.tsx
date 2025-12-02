'use client';

import * as React from 'react';
import { Scheme } from '@/types';
import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IndianRupee, ChevronRight, Sparkles, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JourneyPhase {
    label: string;
    labelHi: string;
    years: string;
    schemes: Scheme[];
    totalValue: number;
    events?: string[];
}

export function JourneyTimeline() {
    const { language, eligibleSchemes } = useAppStore();
    const [expandedPhase, setExpandedPhase] = React.useState<number>(0);

    // Helper to calculate annual value
    const getAnnualValue = (scheme: Scheme) => {
        if (!scheme.benefit_value) return 0;
        if (scheme.benefit_frequency === 'annual') return scheme.benefit_value;
        if (scheme.benefit_frequency === 'monthly') return scheme.benefit_value * 12;
        if (scheme.benefit_frequency === 'quarterly') return scheme.benefit_value * 4;
        return scheme.benefit_value; // one_time
    };

    // Categorize schemes into journey phases
    const phases: JourneyPhase[] = React.useMemo(() => {
        // For demo purposes, we'll distribute schemes across phases
        // In production, this would come from the API /api/v1/journey
        const immediate: Scheme[] = []
            ;
        const shortTerm: Scheme[] = [];
        const mediumTerm: Scheme[] = [];
        const longTerm: Scheme[] = [];

        eligibleSchemes.forEach((scheme, idx) => {
            // Simple distribution logic for demo
            if (idx % 4 === 0) immediate.push(scheme);
            else if (idx % 4 === 1) shortTerm.push(scheme);
            else if (idx % 4 === 2) mediumTerm.push(scheme);
            else longTerm.push(scheme);
        });

        return [
            {
                label: 'Immediate',
                labelHi: 'तत्काल',
                years: 'Now',
                schemes: immediate,
                totalValue: immediate.reduce((sum, s) => sum + getAnnualValue(s), 0),
                events: ['Apply for schemes', 'Gather documents']
            },
            {
                label: 'Short-term',
                labelHi: 'अल्पकालिक',
                years: '1-2 years',
                schemes: shortTerm,
                totalValue: shortTerm.reduce((sum, s) => sum + getAnnualValue(s), 0),
                events: []
            },
            {
                label: 'Medium-term',
                labelHi: 'मध्यम अवधि',
                years: '3-5 years',
                schemes: mediumTerm,
                totalValue: mediumTerm.reduce((sum, s) => sum + getAnnualValue(s), 0),
                events: []
            },
            {
                label: 'Long-term',
                labelHi: 'दीर्घकालिक',
                years: '5+ years',
                schemes: longTerm,
                totalValue: longTerm.reduce((sum, s) => sum + getAnnualValue(s), 0),
                events: []
            }
        ];
    }, [eligibleSchemes]);

    const totalLifetimeValue = phases.reduce((sum, phase) => sum + phase.totalValue, 0) * 10; // Estimated 10 years

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    {language === 'hi' ? 'आपकी जीवन यात्रा' : 'Your Life Journey'}
                </h2>
                <p className="text-slate-600 text-lg">
                    {language === 'hi'
                        ? `जीवन भर अनुमानित लाभ: ₹${(totalLifetimeValue / 100000).toFixed(1)}L`
                        : `Estimated lifetime benefits: ₹${(totalLifetimeValue / 100000).toFixed(1)}L`}
                </p>
            </div>

            {/* Timeline - Desktop */}
            <div className="hidden md:block">
                <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200" />

                    <div className="grid grid-cols-4 gap-6">
                        {phases.map((phase, index) => (
                            <div key={index} className="relative">
                                {/* Phase Marker */}
                                <div className="flex justify-center mb-4">
                                    <div className={cn(
                                        "w-16 h-16 rounded-full flex items-center justify-center border-4 bg-white z-10 transition-all",
                                        index === 0
                                            ? "border-blue-600 shadow-lg scale-110"
                                            : "border-slate-300"
                                    )}>
                                        {index === 0 ? (
                                            <Sparkles className="w-7 h-7 text-blue-600" />
                                        ) : (
                                            <span className="text-2xl font-bold text-slate-400">{index + 1}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Phase Card */}
                                <Card
                                    className={cn(
                                        "p-4 cursor-pointer transition-all hover:shadow-lg",
                                        expandedPhase === index && "ring-2 ring-blue-500"
                                    )}
                                    onClick={() => setExpandedPhase(index)}
                                >
                                    <div className="mb-3">
                                        <h3 className="text-lg font-bold text-slate-900 mb-1">
                                            {language === 'hi' ? phase.labelHi : phase.label}
                                        </h3>
                                        <p className="text-sm text-slate-500">{phase.years}</p>
                                    </div>

                                    {/* Value */}
                                    <div className="flex items-center gap-2 mb-3 text-green-700 font-semibold">
                                        <IndianRupee className="w-4 h-4" />
                                        <span>₹{(phase.totalValue / 1000).toFixed(0)}k/yr</span>
                                    </div>

                                    {/* Schemes Count */}
                                    <div className="text-sm text-slate-600 mb-3">
                                        {phase.schemes.length} {language === 'hi' ? 'योजनाएं' : 'schemes'}
                                    </div>

                                    {/* Events */}
                                    {phase.events && phase.events.length > 0 && (
                                        <div className="space-y-1">
                                            {phase.events.map((event, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs text-blue-600">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{event}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Expanded Content */}
                                    {expandedPhase === index && (
                                        <div className="mt-4 pt-4 border-t space-y-2">
                                            {phase.schemes.slice(0, 3).map((scheme) => (
                                                <div key={scheme.id} className="text-sm text-slate-700 flex items-start gap-2">
                                                    <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                                    <span className="line-clamp-1">{scheme.name}</span>
                                                </div>
                                            ))}
                                            {phase.schemes.length > 3 && (
                                                <Button variant="link" size="sm" className="p-0 h-auto text-xs">
                                                    +{phase.schemes.length - 3} more
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </Card>

                                {index === 0 && (
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                                        <Badge className="bg-blue-600">
                                            {language === 'hi' ? 'यहाँ शुरू करें' : 'Start Here'}
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Timeline - Mobile */}
            <div className="md:hidden space-y-4">
                {phases.map((phase, index) => (
                    <Card key={index} className="p-4">
                        <div className="flex items-start gap-4">
                            <div className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center border-4 flex-shrink-0",
                                index === 0 ? "border-blue-600 bg-blue-50" : "border-slate-300 bg-white"
                            )}>
                                {index === 0 ? (
                                    <Sparkles className="w-5 h-5 text-blue-600" />
                                ) : (
                                    <span className="text-lg font-bold text-slate-400">{index + 1}</span>
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg font-bold text-slate-900">
                                        {language === 'hi' ? phase.labelHi : phase.label}
                                    </h3>
                                    {index === 0 && (
                                        <Badge variant="default" className="text-xs">Start</Badge>
                                    )}
                                </div>
                                <p className="text-sm text-slate-500 mb-2">{phase.years}</p>

                                <div className="flex items-center gap-2 mb-2 text-green-700 font-semibold">
                                    <IndianRupee className="w-4 h-4" />
                                    <span>₹{(phase.totalValue / 1000).toFixed(0)}k/yr</span>
                                </div>

                                <p className="text-sm text-slate-600">
                                    {phase.schemes.length} {language === 'hi' ? 'योजनाएं' : 'schemes'}
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
