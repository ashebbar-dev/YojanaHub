'use client';

import * as React from 'react';
import { Scheme } from '@/types';
import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AboutTabProps {
    scheme: Scheme;
}

export function AboutTab({ scheme }: AboutTabProps) {
    const { language } = useAppStore();

    const mockBenefits = [
        language === 'hi' ? 'वित्तीय सहायता प्रदान करता है' : 'Provides financial assistance',
        language === 'hi' ? 'प्रत्यक्ष लाभ हस्तांतरण' : 'Direct benefit transfer',
        language === 'hi' ? 'कोई मध्यस्थ नहीं' : 'No middlemen involved',
    ];

    const mockCriteria = [
        language === 'hi' ? 'भारत का नागरिक होना चाहिए' : 'Must be a citizen of India',
        language === 'hi' ? 'निर्दिष्ट आयु सीमा के भीतर' : 'Within specified age limits',
        language === 'hi' ? 'आय मानदंड पूरे करने चाहिए' : 'Must meet income criteria',
    ];

    return (
        <div className="space-y-6">
            {/* Description */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3">
                        {language === 'hi' ? 'विवरण' : 'Description'}
                    </h3>
                    <p className="text-slate-700 leading-relaxed">
                        {language === 'hi' && scheme.description_hi ? scheme.description_hi : scheme.description}
                    </p>
                </CardContent>
            </Card>

            {/* Key Benefits */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        {language === 'hi' ? 'मुख्य लाभ' : 'Key Benefits'}
                    </h3>
                    <ul className="space-y-2">
                        {mockBenefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                                <span className="text-slate-700">{benefit}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            {/* Eligibility Criteria */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        {language === 'hi' ? 'पात्रता मानदंड' : 'Eligibility Criteria'}
                    </h3>
                    <ul className="space-y-2">
                        {mockCriteria.map((criteria, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                                <span className="text-slate-700">{criteria}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            {/* Application Mode */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3">
                        {language === 'hi' ? 'आवेदन मोड' : 'Application Mode'}
                    </h3>
                    <div className="flex gap-2">
                        <Badge variant="default">
                            {language === 'hi' ? 'ऑनलाइन' : 'Online'}
                        </Badge>
                        <Badge variant="outline">
                            {language === 'hi' ? 'सीएससी' : 'CSC'}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Conflicts Warning */}
            {scheme.conflicts && scheme.conflicts.length > 0 && (
                <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-orange-900 mb-2">
                                    {language === 'hi' ? 'विरोध चेतावनी' : 'Conflict Warning'}
                                </h3>
                                <p className="text-orange-800 text-sm">
                                    {language === 'hi'
                                        ? `यह योजना ${scheme.conflicts.length} अन्य योजना(ओं) के साथ विरोध करती है। आप दोनों के लिए आवेदन नहीं कर सकते।`
                                        : `This scheme conflicts with ${scheme.conflicts.length} other scheme(s). You cannot claim both.`}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Official Portal Link */}
            <Card>
                <CardContent className="p-6">
                    <Button className="w-full gap-2" size="lg">
                        <ExternalLink className="w-5 h-5" />
                        {language === 'hi' ? 'आधिकारिक पोर्टल पर जाएं' : 'Visit Official Portal'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
