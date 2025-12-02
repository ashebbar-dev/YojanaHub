'use client';

import * as React from 'react';
import { Scheme } from '@/types';
import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, ArrowRight, Scale } from 'lucide-react';

interface ExplainabilityTabProps {
    scheme: Scheme;
}

export function ExplainabilityTab({ scheme }: ExplainabilityTabProps) {
    const { language, userAttributes } = useAppStore();

    const confidencePercent = Math.round((scheme.confidence || 0) * 100);

    return (
        <div className="space-y-6">
            {/* Plain Language Explanation */}
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3 text-blue-900">
                        {language === 'hi' ? 'आप क्यों पात्र हैं' : 'Why You\'re Eligible'}
                    </h3>
                    <p className="text-blue-800 leading-relaxed">
                        {language === 'hi'
                            ? `आप इस योजना के लिए पात्र हैं क्योंकि आपकी प्रोफ़ाइल आवश्यक मानदंडों से मेल खाती है। हमारी प्रणाली ने ${confidencePercent}% विश्वास के साथ ${scheme.matched_conditions?.length || 0} शर्तों का मिलान किया।`
                            : `You are eligible for this scheme because your profile matches the required criteria. Our system matched ${scheme.matched_conditions?.length || 0} conditions with ${confidencePercent}% confidence.`}
                    </p>
                </CardContent>
            </Card>

            {/* Visual Path */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <ArrowRight className="w-5 h-5 text-blue-600" />
                        {language === 'hi' ? 'पात्रता पथ' : 'Eligibility Path'}
                    </h3>

                    <div className="flex flex-col md:flex-row items-center gap-4 justify-center py-4">
                        {/* User Node */}
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                                {language === 'hi' ? 'आप' : 'You'}
                            </div>
                            <span className="text-xs text-slate-500 mt-2">
                                {language === 'hi' ? 'उपयोगकर्ता' : 'User'}
                            </span>
                        </div>

                        <ArrowRight className="w-6 h-6 text-slate-400 rotate-90 md:rotate-0" />

                        {/* Attributes */}
                        <div className="flex flex-col gap-2">
                            {scheme.matched_conditions?.slice(0, 3).map((condition, idx) => (
                                <div key={idx} className="flex items-center gap-2 bg-green-50 border border-green-200 rounded px-3 py-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    <span className="text-sm text-green-800">{condition}</span>
                                </div>
                            ))}
                        </div>

                        <ArrowRight className="w-6 h-6 text-slate-400 rotate-90 md:rotate-0" />

                        {/* Scheme */}
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-2xl">
                                {scheme.icon || '📋'}
                            </div>
                            <span className="text-xs text-slate-500 mt-2 text-center max-w-[100px] truncate">
                                {scheme.name}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Rule Breakdown */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        {language === 'hi' ? 'नियम विवरण' : 'Rule Breakdown'}
                    </h3>

                    <div className="space-y-3">
                        {/* Matched Conditions */}
                        {scheme.matched_conditions?.map((condition, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-green-900">{condition}</p>
                                    <p className="text-xs text-green-700 mt-1">
                                        {language === 'hi' ? 'मेल खाता है ✓' : 'Matched ✓'}
                                    </p>
                                </div>
                                <Badge variant="default" className="bg-green-600">
                                    +{Math.round(100 / (scheme.matched_conditions?.length || 1))}%
                                </Badge>
                            </div>
                        ))}

                        {/* Blocking Conditions (if any) */}
                        {scheme.blocking_conditions?.map((condition, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-red-900">{condition}</p>
                                    <p className="text-xs text-red-700 mt-1">
                                        {language === 'hi' ? 'नहीं मिला' : 'Not met'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Confidence Score */}
                    <div className="mt-6 p-4 bg-slate-50 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700">
                                {language === 'hi' ? 'समग्र विश्वास स्कोर' : 'Overall Confidence Score'}
                            </span>
                            <span className="text-lg font-bold text-blue-600">{confidencePercent}%</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 transition-all"
                                style={{ width: `${confidencePercent}%` }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Legal Basis (Mock) */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Scale className="w-5 h-5 text-slate-600" />
                        {language === 'hi' ? 'कानूनी आधार' : 'Legal Basis'}
                    </h3>
                    <div className="bg-slate-50 p-4 rounded border-l-4 border-slate-400">
                        <p className="text-sm text-slate-700 italic">
                            {language === 'hi'
                                ? '"यह योजना आधिकारिक दिशानिर्देशों के अनुसार पात्र लाभार्थियों को वित्तीय सहायता प्रदान करने के लिए डिज़ाइन की गई है।'
                                : '"This scheme is designed to provide financial assistance to eligible beneficiaries as per official guidelines."'}
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                            {scheme.ministry} - Official Notification 2023
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
