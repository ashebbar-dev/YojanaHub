'use client';

import * as React from 'react';
import { Scheme } from '@/types';
import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Download, MapPin, Phone, Clock } from 'lucide-react';

interface ApplyTabProps {
    scheme: Scheme;
}

export function ApplyTab({ scheme }: ApplyTabProps) {
    const { language } = useAppStore();

    const applicationSteps = [
        {
            number: 1,
            title: language === 'hi' ? 'दस्तावेज़ तैयार करें' : 'Prepare Documents',
            description: language === 'hi'
                ? 'सभी आवश्यक दस्तावेज़ एकत्र करें और स्कैन करें'
                : 'Collect and scan all required documents',
            time: language === 'hi' ? '30 मिनट' : '30 mins'
        },
        {
            number: 2,
            title: language === 'hi' ? 'आधिकारिक पोर्टल पर जाएं' : 'Visit Official Portal',
            description: language === 'hi'
                ? 'आधिकारिक वेबसाइट पर पंजीकरण करें या लॉगिन करें'
                : 'Register or login on the official website',
            time: language === 'hi' ? '10 मिनट' : '10 mins'
        },
        {
            number: 3,
            title: language === 'hi' ? 'आवेदन पत्र भरें' : 'Fill Application Form',
            description: language === 'hi'
                ? 'सभी विवरण सही-सही भरें और दस्तावेज़ अपलोड करें'
                : 'Fill all details accurately and upload documents',
            time: language === 'hi' ? '20 मिनट' : '20 mins'
        },
        {
            number: 4,
            title: language === 'hi' ? 'सबमिट करें और पावती लें' : 'Submit and Get Acknowledgment',
            description: language === 'hi'
                ? 'आवेदन सबमिट करें और पावती संख्या सहेजें'
                : 'Submit application and save acknowledgment number',
            time: language === 'hi' ? '5 मिनट' : '5 mins'
        },
    ];

    return (
        <div className="space-y-6">
            {/* Application Mode */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3">
                        {language === 'hi' ? 'आवेदन कैसे करें' : 'How to Apply'}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        <Badge className="bg-green-600 text-white px-4 py-2 text-sm">
                            {language === 'hi' ? '🌐 ऑनलाइन' : '🌐 Online'}
                        </Badge>
                        <Badge variant="outline" className="px-4 py-2 text-sm">
                            {language === 'hi' ? '🏢 सीएससी केंद्र' : '🏢 CSC Center'}
                        </Badge>
                        <Badge variant="outline" className="px-4 py-2 text-sm">
                            {language === 'hi' ? '📄 ऑफलाइन' : '📄 Offline'}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Step-by-Step Guide */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        {language === 'hi' ? 'चरण-दर-चरण मार्गदर्शिका' : 'Step-by-Step Guide'}
                    </h3>

                    <div className="space-y-4">
                        {applicationSteps.map((step, idx) => (
                            <div key={idx} className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                        {step.number}
                                    </div>
                                </div>
                                <div className="flex-1 pb-4 border-b last:border-b-0">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h4 className="font-semibold text-slate-900 mb-1">{step.title}</h4>
                                            <p className="text-sm text-slate-600">{step.description}</p>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-slate-500 flex-shrink-0">
                                            <Clock className="w-3 h-3" />
                                            {step.time}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid md:grid-cols-2 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <h4 className="font-semibold mb-3">
                            {language === 'hi' ? 'आधिकारिक पोर्टल' : 'Official Portal'}
                        </h4>
                        <Button className="w-full gap-2" size="lg">
                            <ExternalLink className="w-5 h-5" />
                            {language === 'hi' ? 'अभी आवेदन करें' : 'Apply Now'}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <h4 className="font-semibold mb-3">
                            {language === 'hi' ? 'पूर्व-भरा फॉर्म' : 'Pre-filled Form'}
                        </h4>
                        <Button variant="outline" className="w-full gap-2" size="lg">
                            <Download className="w-5 h-5" />
                            {language === 'hi' ? 'डाउनलोड करें' : 'Download'}
                        </Button>
                        <p className="text-xs text-slate-500 mt-2 text-center">
                            {language === 'hi' ? 'आपके विवरण के साथ' : 'With your details'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Nearest Service Center */}
            <Card className="border-blue-200">
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        {language === 'hi' ? 'निकटतम सेवा केंद्र' : 'Nearest Service Center'}
                    </h3>

                    <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                            <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-slate-900">
                                    {language === 'hi' ? 'सीएससी सेंटर - मेन रोड' : 'CSC Center - Main Road'}
                                </p>
                                <p className="text-sm text-slate-600">
                                    {language === 'hi' ? '2.5 किमी दूर' : '2.5 km away'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                            <Phone className="w-5 h-5 text-slate-600" />
                            <div>
                                <p className="text-sm text-slate-900">
                                    {language === 'hi' ? 'हेल्पलाइन' : 'Helpline'}: 1800-XXX-XXXX
                                </p>
                                <p className="text-xs text-slate-500">
                                    {language === 'hi' ? 'सोमवार-शुक्रवार, 9 AM - 6 PM' : 'Mon-Fri, 9 AM - 6 PM'}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Need Help */}
            <Card className="bg-slate-50">
                <CardContent className="p-6 text-center">
                    <h4 className="font-semibold mb-2">
                        {language === 'hi' ? 'सहायता चाहिए?' : 'Need Help?'}
                    </h4>
                    <p className="text-sm text-slate-600 mb-4">
                        {language === 'hi'
                            ? 'हमारे सहायता केंद्र पर जाएं या अपने निकटतम सीएससी केंद्र से संपर्क करें'
                            : 'Visit our help center or contact your nearest CSC center'}
                    </p>
                    <Button variant="outline">
                        {language === 'hi' ? 'सहायता केंद्र' : 'Help Center'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
