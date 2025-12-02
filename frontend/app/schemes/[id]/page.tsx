'use client';

import * as React from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, IndianRupee, Info, Eye, FileText, Send } from 'lucide-react';
import { AboutTab } from '@/components/scheme-detail/about-tab';
import { ExplainabilityTab } from '@/components/scheme-detail/explainability-tab';
import { DocumentsTab } from '@/components/scheme-detail/documents-tab';
import { ApplyTab } from '@/components/scheme-detail/apply-tab';

type TabValue = 'about' | 'why' | 'documents' | 'apply';

export async function generateStaticParams() {
    return [];
}

export default function SchemeDetailPage() {
    return (
        <React.Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
            <SchemeDetailContent />
        </React.Suspense>
    );
}

function SchemeDetailContent() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const { language, eligibleSchemes } = useAppStore();
    const [activeTab, setActiveTab] = React.useState<TabValue>('about');

    const schemeId = params.id as string;

    // Find scheme in eligible schemes
    const scheme = eligibleSchemes.find(s => s.id === schemeId);

    // Read tab from URL
    React.useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && ['about', 'why', 'documents', 'apply'].includes(tab)) {
            setActiveTab(tab as TabValue);
        }
    }, [searchParams]);

    // Update URL when tab changes
    const handleTabChange = (value: string) => {
        setActiveTab(value as TabValue);
        router.push(`/schemes/${schemeId}?tab=${value}`, { scroll: false });
    };

    // Show 404 if scheme not found
    if (!scheme) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Header />
                <main className="container mx-auto px-4 py-8 max-w-4xl">
                    <Card>
                        <CardContent className="p-12 text-center">
                            <h1 className="text-2xl font-bold text-slate-900 mb-4">
                                {language === 'hi' ? 'योजना नहीं मिली' : 'Scheme Not Found'}
                            </h1>
                            <p className="text-slate-600 mb-6">
                                {language === 'hi'
                                    ? 'यह योजना आपके पात्र योजनाओं की सूची में नहीं है।'
                                    : 'This scheme is not in your list of eligible schemes.'}
                            </p>
                            <Button onClick={() => router.push('/results')}>
                                {language === 'hi' ? 'परिणामों पर वापस जाएं' : 'Back to Results'}
                            </Button>
                        </CardContent>
                    </Card>
                </main>
            </div>
        );
    }

    const confidencePercent = Math.round((scheme.confidence || 0) * 100);

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            <main className="container mx-auto px-4 py-6 max-w-4xl">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    className="mb-4 gap-2"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="w-4 h-4" />
                    {language === 'hi' ? 'वापस' : 'Back'}
                </Button>

                {/* Scheme Header */}
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            {/* Icon */}
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-4xl flex-shrink-0">
                                {scheme.icon || '📋'}
                            </div>

                            {/* Details */}
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                                    {language === 'hi' && scheme.name_hi ? scheme.name_hi : scheme.name}
                                </h1>
                                <p className="text-slate-600 text-sm mb-3">{scheme.ministry}</p>

                                <div className="flex flex-wrap gap-2">
                                    <Badge
                                        variant={confidencePercent >= 80 ? "default" : "secondary"}
                                        className="px-3 py-1"
                                    >
                                        {confidencePercent >= 80
                                            ? (language === 'hi' ? 'पात्र' : 'Eligible')
                                            : (language === 'hi' ? 'संभावित पात्र' : 'Likely Eligible')}
                                        {' '}({confidencePercent}%)
                                    </Badge>
                                    {scheme.category && (
                                        <Badge variant="outline" className="px-3 py-1">
                                            {scheme.category}
                                        </Badge>
                                    )}
                                    {scheme.state && (
                                        <Badge variant="outline" className="px-3 py-1 bg-blue-50">
                                            {scheme.state}
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Benefit Value */}
                            {/* Benefit Value */}
                            {scheme.benefit_value && (
                                <div className="text-right">
                                    <div className="text-sm text-slate-500 mb-1">
                                        {scheme.benefit_frequency === 'annual' && (language === 'hi' ? 'वार्षिक लाभ' : 'Annual Benefit')}
                                        {scheme.benefit_frequency === 'monthly' && (language === 'hi' ? 'मासिक लाभ' : 'Monthly Benefit')}
                                        {scheme.benefit_frequency === 'quarterly' && (language === 'hi' ? 'त्रैमासिक लाभ' : 'Quarterly Benefit')}
                                        {scheme.benefit_frequency === 'one_time' && (language === 'hi' ? 'एकमुश्त लाभ' : 'One-time Benefit')}
                                    </div>
                                    <div className="flex items-center gap-1 text-2xl font-bold text-green-700">
                                        <IndianRupee className="w-6 h-6" />
                                        <span>{scheme.benefit_value.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={handleTabChange}>
                    <TabsList className="grid w-full grid-cols-4 mb-6">
                        <TabsTrigger value="about" className="gap-2">
                            <Info className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                {language === 'hi' ? 'विवरण' : 'About'}
                            </span>
                        </TabsTrigger>
                        <TabsTrigger value="why" className="gap-2">
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                {language === 'hi' ? 'क्यों' : 'Why'}
                            </span>
                        </TabsTrigger>
                        <TabsTrigger value="documents" className="gap-2">
                            <FileText className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                {language === 'hi' ? 'दस्तावेज़' : 'Docs'}
                            </span>
                        </TabsTrigger>
                        <TabsTrigger value="apply" className="gap-2">
                            <Send className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                {language === 'hi' ? 'आवेदन' : 'Apply'}
                            </span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="about">
                        <AboutTab scheme={scheme} />
                    </TabsContent>

                    <TabsContent value="why">
                        <ExplainabilityTab scheme={scheme} />
                    </TabsContent>

                    <TabsContent value="documents">
                        <DocumentsTab scheme={scheme} />
                    </TabsContent>

                    <TabsContent value="apply">
                        <ApplyTab scheme={scheme} />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
