'use client';

import * as React from 'react';
import { Scheme } from '@/types';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IndianRupee, AlertTriangle, CheckCircle2, XCircle, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SchemeOptimizer() {
    const { language, eligibleSchemes } = useAppStore();

    // Detect conflicts (schemes with conflicts array)
    const conflictPairs = React.useMemo(() => {
        const pairs: Array<{
            scheme1: Scheme;
            scheme2: Scheme;
            selected: Scheme;
            excluded: Scheme;
        }> = [];

        eligibleSchemes.forEach((scheme) => {
            if (scheme.conflicts && scheme.conflicts.length > 0) {
                scheme.conflicts.forEach((conflictId) => {
                    const conflictingScheme = eligibleSchemes.find(s => s.id === conflictId);
                    if (conflictingScheme) {
                        // Only add if not already added in reverse
                        const exists = pairs.some(p =>
                            (p.scheme1.id === conflictId && p.scheme2.id === scheme.id)
                        );
                        if (!exists) {
                            // Select the one with higher value
                            const selected = (scheme.annual_value || 0) >= (conflictingScheme.annual_value || 0)
                                ? scheme
                                : conflictingScheme;
                            const excluded = selected === scheme ? conflictingScheme : scheme;

                            pairs.push({
                                scheme1: scheme,
                                scheme2: conflictingScheme,
                                selected,
                                excluded
                            });
                        }
                    }
                });
            }
        });

        return pairs;
    }, [eligibleSchemes]);

    // Selected schemes (no conflicts)
    const selectedSchemes = React.useMemo(() => {
        const excluded = new Set(conflictPairs.map(p => p.excluded.id));
        return eligibleSchemes.filter(s => !excluded.has(s.id));
    }, [eligibleSchemes, conflictPairs]);

    // Excluded schemes
    const excludedSchemes = React.useMemo(() => {
        return conflictPairs.map(p => p.excluded);
    }, [conflictPairs]);

    // Organize selected schemes into benefit layers
    const benefitStack = React.useMemo(() => {
        const foundation = selectedSchemes.filter(s =>
            s.category && ['Agriculture', 'Basic Income'].includes(s.category)
        );
        const income = selectedSchemes.filter(s =>
            s.category && ['Employment', 'Skill Development'].includes(s.category)
        );
        const protection = selectedSchemes.filter(s =>
            s.category && ['Health', 'Insurance', 'Pension'].includes(s.category)
        );
        const other = selectedSchemes.filter(s =>
            !foundation.includes(s) && !income.includes(s) && !protection.includes(s)
        );

        return [
            { label: 'Foundation', labelHi: 'नींव', schemes: foundation, color: 'blue' },
            { label: 'Income', labelHi: 'आय', schemes: income, color: 'green' },
            { label: 'Protection', labelHi: 'संरक्षण', schemes: protection, color: 'purple' },
            { label: 'Other', labelHi: 'अन्य', schemes: other, color: 'slate' }
        ].filter(layer => layer.schemes.length > 0);
    }, [selectedSchemes]);

    const totalOptimizedValue = selectedSchemes.reduce((sum, s) => sum + (s.annual_value || 0), 0);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    {language === 'hi' ? 'अनुकूलित योजना पोर्टफोलियो' : 'Optimized Scheme Portfolio'}
                </h2>
                <p className="text-slate-600">
                    {language === 'hi'
                        ? 'विरोधों को हल किया गया और आपके लाभों को अधिकतम किया गया'
                        : 'Conflicts resolved and benefits maximized'}
                </p>
            </div>

            {/* Total Optimized Value */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600 mb-1">
                                {language === 'hi' ? 'अनुकूलित वार्षिक मूल्य' : 'Optimized Annual Value'}
                            </p>
                            <div className="flex items-center gap-2 text-3xl font-bold text-green-700">
                                <IndianRupee className="w-7 h-7" />
                                <span>₹{totalOptimizedValue.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                        <CheckCircle2 className="w-16 h-16 text-green-500" />
                    </div>
                </CardContent>
            </Card>

            {/* Conflicts Resolved */}
            {conflictPairs.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                            {language === 'hi' ? 'विरोध हल किए गए' : 'Conflicts Resolved'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {conflictPairs.map((pair, idx) => (
                            <div key={idx} className="border rounded-lg p-4 bg-slate-50">
                                <div className="grid md:grid-cols-2 gap-4">
                                    {/* Selected Scheme */}
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                                        <div>
                                            <p className="font-semibold text-slate-900">{pair.selected.name}</p>
                                            <div className="flex items-center gap-2 text-green-700 font-medium mt-1">
                                                <IndianRupee className="w-4 h-4" />
                                                <span>₹{(pair.selected.annual_value || 0).toLocaleString('en-IN')}</span>
                                            </div>
                                            <Badge variant="default" className="mt-2 text-xs">
                                                {language === 'hi' ? 'चयनित' : 'Selected'}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Excluded Scheme */}
                                    <div className="flex items-start gap-3 opacity-60">
                                        <XCircle className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1" />
                                        <div>
                                            <p className="font-semibold text-slate-700">{pair.excluded.name}</p>
                                            <div className="flex items-center gap-2 text-slate-600 font-medium mt-1">
                                                <IndianRupee className="w-4 h-4" />
                                                <span>₹{(pair.excluded.annual_value || 0).toLocaleString('en-IN')}</span>
                                            </div>
                                            <Badge variant="outline" className="mt-2 text-xs">
                                                {language === 'hi' ? 'बहिष्कृत' : 'Excluded'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm text-slate-600 mt-3 italic">
                                    {language === 'hi'
                                        ? `उच्च मूल्य के कारण ${pair.selected.name} का चयन किया गया`
                                        : `Selected ${pair.selected.name} due to higher value`}
                                </p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Benefit Stack */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Layers className="w-5 h-5 text-blue-500" />
                        {language === 'hi' ? 'लाभ स्टैक' : 'Benefit Stack'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {benefitStack.map((layer, idx) => {
                            const layerValue = layer.schemes.reduce((sum, s) => sum + (s.annual_value || 0), 0);
                            const colorClasses = {
                                blue: 'bg-blue-50 border-blue-200 text-blue-700',
                                green: 'bg-green-50 border-green-200 text-green-700',
                                purple: 'bg-purple-50 border-purple-200 text-purple-700',
                                slate: 'bg-slate-50 border-slate-200 text-slate-700'
                            };

                            return (
                                <div key={idx} className={cn("border-l-4 rounded-lg p-4", colorClasses[layer.color as keyof typeof colorClasses])}>
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold text-lg">
                                            {language === 'hi' ? layer.labelHi : layer.label}
                                        </h4>
                                        <div className="flex items-center gap-2 font-bold">
                                            <IndianRupee className="w-4 h-4" />
                                            <span>₹{(layerValue / 1000).toFixed(0)}k</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {layer.schemes.map((scheme) => (
                                            <div key={scheme.id} className="flex items-center justify-between text-sm">
                                                <span>{scheme.name}</span>
                                                <span className="text-slate-600">
                                                    ₹{((scheme.annual_value || 0) / 1000).toFixed(0)}k
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Excluded Schemes */}
            {excludedSchemes.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-slate-400" />
                            {language === 'hi' ? 'बहिष्कृत योजनाएं' : 'Excluded Schemes'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {excludedSchemes.map((scheme) => (
                                <div key={scheme.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg opacity-60">
                                    <div>
                                        <p className="font-medium text-slate-700">{scheme.name}</p>
                                        <p className="text-sm text-slate-500">
                                            {language === 'hi' ? 'विरोध के कारण' : 'Due to conflict'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <IndianRupee className="w-4 h-4" />
                                        <span>₹{(scheme.annual_value || 0).toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Action Button */}
            <div className="flex justify-center">
                <Button size="lg" className="gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    {language === 'hi' ? 'इस पोर्टफोलियो को लागू करें' : 'Apply This Portfolio'}
                </Button>
            </div>
        </div>
    );
}
