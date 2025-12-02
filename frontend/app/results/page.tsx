'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Header } from '@/components/header';
import { SummaryCard } from '@/components/results/summary-card';
import { SchemeList } from '@/components/results/scheme-list';
import { JourneyView } from '@/components/results/journey-view';
import { GraphView } from '@/components/results/graph-view';
import { OptimizerView } from '@/components/results/optimizer-view';
import { Scheme } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { List, Map, Network, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type TabValue = 'list' | 'journey' | 'graph' | 'optimizer';

export default function ResultsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const { language, eligibleSchemes } = useAppStore();
    const [activeTab, setActiveTab] = React.useState<TabValue>('list');

    // Redirect if no schemes
    React.useEffect(() => {
        if (eligibleSchemes.length === 0) {
            router.push('/');
        }
    }, [eligibleSchemes, router]);

    // Read tab from URL
    React.useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && ['list', 'journey', 'graph', 'optimizer'].includes(tab)) {
            setActiveTab(tab as TabValue);
        }
    }, [searchParams]);

    // Update URL when tab changes
    const handleTabChange = (value: string) => {
        setActiveTab(value as TabValue);
        router.push(`/results?tab=${value}`, { scroll: false });
    };

    const handleSchemeClick = (scheme: Scheme) => {
        router.push(`/schemes/${scheme.id}`);
    };

    const handleShare = async () => {
        const totalValue = eligibleSchemes.reduce((sum, s) => {
            if (!s.benefit_value) return sum;
            if (s.benefit_frequency === 'annual') return sum + s.benefit_value;
            if (s.benefit_frequency === 'monthly') return sum + (s.benefit_value * 12);
            if (s.benefit_frequency === 'quarterly') return sum + (s.benefit_value * 4);
            return sum + s.benefit_value; // one_time
        }, 0);
        const shareText = language === 'hi'
            ? `मैंने YojanaHub का उपयोग करके ${eligibleSchemes.length} सरकारी योजनाओं की खोज की, जो ₹${totalValue.toLocaleString('en-IN')}/वर्ष के लायक हैं!`
            : `I discovered ${eligibleSchemes.length} government schemes worth ₹${totalValue.toLocaleString('en-IN')}/year using YojanaHub!`;

        try {
            // Try Web Share API first
            if (navigator.share) {
                await navigator.share({
                    title: 'YojanaHub Results',
                    text: shareText,
                });
                toast({
                    title: language === 'hi' ? 'साझा किया गया!' : 'Shared!',
                    description: language === 'hi' ? 'परिणाम साझा किए गए' : 'Results shared successfully',
                });
            } else {
                // Fallback to clipboard
                await navigator.clipboard.writeText(shareText);
                toast({
                    title: language === 'hi' ? 'कॉपी किया गया!' : 'Copied!',
                    description: language === 'hi' ? 'क्लिपबोर्ड पर कॉपी किया गया' : 'Copied to clipboard',
                });
            }
        } catch (error) {
            console.error('Share failed:', error);
        }
    };

    if (eligibleSchemes.length === 0) {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            <main className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Summary Card */}
                <div className="mb-8">
                    <SummaryCard onShare={handleShare} />
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
                        <TabsTrigger value="list" className="gap-2">
                            <List className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                {language === 'hi' ? 'सूची' : 'List'}
                            </span>
                        </TabsTrigger>
                        <TabsTrigger value="journey" className="gap-2">
                            <Map className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                {language === 'hi' ? 'यात्रा' : 'Journey'}
                            </span>
                        </TabsTrigger>
                        <TabsTrigger value="graph" className="gap-2">
                            <Network className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                {language === 'hi' ? 'ग्राफ' : 'Graph'}
                            </span>
                        </TabsTrigger>
                        <TabsTrigger value="optimizer" className="gap-2">
                            <Sparkles className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                {language === 'hi' ? 'अनुकूलन' : 'Optimize'}
                            </span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="list" className="space-y-4">
                        <SchemeList schemes={eligibleSchemes} onSchemeClick={handleSchemeClick} />
                    </TabsContent>

                    <TabsContent value="journey">
                        <JourneyView />
                    </TabsContent>

                    <TabsContent value="graph">
                        <GraphView />
                    </TabsContent>

                    <TabsContent value="optimizer">
                        <OptimizerView />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
