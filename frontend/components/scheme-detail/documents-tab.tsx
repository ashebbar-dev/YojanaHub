'use client';

import * as React from 'react';
import { Scheme } from '@/types';
import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, XCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentsTabProps {
    scheme: Scheme;
}

interface Document {
    name: string;
    nameHi: string;
    required: boolean;
    status: 'have' | 'may_need' | 'missing';
    howToObtain: string;
}

export function DocumentsTab({ scheme }: DocumentsTabProps) {
    const { language } = useAppStore();
    const [expandedDoc, setExpandedDoc] = React.useState<number | null>(null);

    // Mock documents based on scheme type
    const mockDocuments: Document[] = [
        {
            name: 'Aadhaar Card',
            nameHi: 'आधार कार्ड',
            required: true,
            status: 'have',
            howToObtain: language === 'hi'
                ? 'निकटतम आधार केंद्र पर जाएं या uidai.gov.in से डाउनलोड करें'
                : 'Visit nearest Aadhaar center or download from uidai.gov.in'
        },
        {
            name: 'Bank Account Details',
            nameHi: 'बैंक खाता विवरण',
            required: true,
            status: 'have',
            howToObtain: language === 'hi'
                ? 'अपनी बैंक पासबुक या बैंक ऐप से प्राप्त करें'
                : 'Get from your bank passbook or banking app'
        },
        {
            name: 'Income Certificate',
            nameHi: 'आय प्रमाण पत्र',
            required: true,
            status: 'may_need',
            howToObtain: language === 'hi'
                ? 'तहसील कार्यालय से आवेदन करें या ई-डिस्ट्रिक्ट पोर्टल का उपयोग करें'
                : 'Apply at Tehsil office or use e-district portal'
        },
        {
            name: 'Caste Certificate',
            nameHi: 'जाति प्रमाण पत्र',
            required: false,
            status: 'missing',
            howToObtain: language === 'hi'
                ? 'तहसीलदार से प्रमाण पत्र प्राप्त करें'
                : 'Obtain certificate from Tehsildar'
        },
        {
            name: 'Land Records',
            nameHi: 'भूमि रिकॉर्ड',
            required: false,
            status: 'missing',
            howToObtain: language === 'hi'
                ? 'राजस्व विभाग या ऑनलाइन पोर्टल से प्राप्त करें'
                : 'Get from Revenue department or online portal'
        },
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'have':
                return <CheckCircle2 className="w-5 h-5 text-green-600" />;
            case 'may_need':
                return <AlertTriangle className="w-5 h-5 text-orange-500" />;
            case 'missing':
                return <XCircle className="w-5 h-5 text-slate-400" />;
            default:
                return null;
        }
    };

    const getStatusLabel = (status: string, required: boolean) => {
        if (status === 'have') {
            return language === 'hi' ? 'उपलब्ध' : 'Available';
        } else if (status === 'may_need') {
            return language === 'hi' ? 'आवश्यक हो सकता है' : 'May need';
        } else {
            return required
                ? (language === 'hi' ? 'आवश्यक' : 'Required')
                : (language === 'hi' ? 'वैकल्पिक' : 'Optional');
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'have':
                return 'default';
            case 'may_need':
                return 'secondary';
            case 'missing':
                return 'outline';
            default:
                return 'outline';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold text-blue-600">
                                {mockDocuments.filter(d => d.required).length}
                            </div>
                            <div className="text-sm text-slate-600">
                                {language === 'hi' ? 'आवश्यक' : 'Required'}
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-green-600">
                                {mockDocuments.filter(d => d.status === 'have').length}
                            </div>
                            <div className="text-sm text-slate-600">
                                {language === 'hi' ? 'उपलब्ध' : 'Available'}
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-orange-500">
                                {mockDocuments.filter(d => d.status === 'may_need' || d.status === 'missing').length}
                            </div>
                            <div className="text-sm text-slate-600">
                                {language === 'hi' ? 'शेष' : 'Remaining'}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Document List */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        {language === 'hi' ? 'दस्तावेज़ चेकलिस्ट' : 'Document Checklist'}
                    </h3>

                    <div className="space-y-3">
                        {mockDocuments.map((doc, idx) => (
                            <div key={idx} className="border rounded-lg overflow-hidden">
                                <div className="p-4 bg-slate-50 flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        {getStatusIcon(doc.status)}
                                        <div>
                                            <p className="font-medium text-slate-900">
                                                {language === 'hi' ? doc.nameHi : doc.name}
                                            </p>
                                            <div className="flex gap-2 mt-1">
                                                {doc.required && (
                                                    <Badge variant="destructive" className="text-xs">
                                                        {language === 'hi' ? 'अनिवार्य' : 'Mandatory'}
                                                    </Badge>
                                                )}
                                                <Badge variant={getStatusVariant(doc.status)} className="text-xs">
                                                    {getStatusLabel(doc.status, doc.required)}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setExpandedDoc(expandedDoc === idx ? null : idx)}
                                        className="gap-2"
                                    >
                                        {language === 'hi' ? 'कैसे प्राप्त करें' : 'How to obtain'}
                                        <ChevronDown className={`w-4 h-4 transition-transform ${expandedDoc === idx ? 'rotate-180' : ''}`} />
                                    </Button>
                                </div>

                                {expandedDoc === idx && (
                                    <div className="p-4 bg-white border-t">
                                        <p className="text-sm text-slate-700">{doc.howToObtain}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Common Issues */}
            <Card className="border-blue-200">
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3">
                        {language === 'hi' ? 'सामान्य मुद्दे' : 'Common Issues'}
                    </h3>
                    <ul className="space-y-2 text-sm text-slate-700">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600">•</span>
                            {language === 'hi'
                                ? 'सुनिश्चित करें कि सभी दस्तावेज़ स्पष्ट और पठनीय हैं'
                                : 'Ensure all documents are clear and legible'}
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600">•</span>
                            {language === 'hi'
                                ? 'दस्तावेज़ स्व-सत्यापित होने चाहिए'
                                : 'Documents should be self-attested'}
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600">•</span>
                            {language === 'hi'
                                ? 'सभी विवरण आधार कार्ड से मेल खाने चाहिए'
                                : 'All details should match with Aadhaar card'}
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
