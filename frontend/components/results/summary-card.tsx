'use client';

import * as React from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { IndianRupee, Users, TrendingUp, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SummaryCardProps {
    onShare?: () => void;
}

export function SummaryCard({ onShare }: SummaryCardProps) {
    const { language, eligibleSchemes } = useAppStore();

    const totalAnnualValue = eligibleSchemes.reduce((sum, scheme) => {
        if (!scheme.benefit_value) return sum;
        if (scheme.benefit_frequency === 'annual') return sum + scheme.benefit_value;
        if (scheme.benefit_frequency === 'monthly') return sum + (scheme.benefit_value * 12);
        if (scheme.benefit_frequency === 'quarterly') return sum + (scheme.benefit_value * 4);
        return sum + scheme.benefit_value; // one_time
    }, 0);
    const estimatedYears = 20; // Average benefit duration
    const lifetimeValue = totalAnnualValue * estimatedYears;

    return (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">
                            {language === 'hi' ? 'आपके परिणाम' : 'Your Results'}
                        </h2>
                        <p className="text-slate-600">
                            {language === 'hi'
                                ? 'आपके लिए पात्र सरकारी योजनाएं'
                                : 'Government schemes you are eligible for'}
                        </p>
                    </div>

                    {onShare && (
                        <Button variant="outline" size="sm" onClick={onShare} className="gap-2">
                            <Share2 className="w-4 h-4" />
                            {language === 'hi' ? 'शेयर करें' : 'Share'}
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Schemes Count */}
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">{eligibleSchemes.length}</p>
                                <p className="text-xs text-slate-500">
                                    {language === 'hi' ? 'योजनाएं' : 'Schemes'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Annual Value */}
                    <div className="bg-white rounded-lg p-4 border border-green-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                <IndianRupee className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">
                                    ₹{(totalAnnualValue / 1000).toFixed(0)}k
                                </p>
                                <p className="text-xs text-slate-500">
                                    {language === 'hi' ? 'प्रति वर्ष' : 'Per Year'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Lifetime Potential */}
                    <div className="bg-white rounded-lg p-4 border border-purple-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">
                                    ₹{(lifetimeValue / 100000).toFixed(1)}L
                                </p>
                                <p className="text-xs text-slate-500">
                                    {language === 'hi' ? 'जीवनकाल क्षमता' : 'Lifetime Potential'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
