'use client';

import * as React from 'react';
import { Scheme } from '@/types';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IndianRupee, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SchemeCardProps {
    scheme: Scheme;
    onClick?: () => void;
    highlightConflict?: boolean;
}

export function SchemeCard({ scheme, onClick, highlightConflict }: SchemeCardProps) {
    const { language } = useAppStore();

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 1.0) return 'bg-green-500';
        if (confidence >= 0.8) return 'bg-green-400';
        return 'bg-yellow-400';
    };

    const getConfidenceLabel = (confidence: number) => {
        if (confidence >= 0.8) return language === 'hi' ? 'पात्र' : 'Eligible';
        return language === 'hi' ? 'संभावित पात्र' : 'Likely Eligible';
    };

    const confidencePercent = (scheme.confidence || 0) * 100;

    return (
        <Card
            className={cn(
                "hover:shadow-lg transition-all cursor-pointer border-l-4",
                highlightConflict ? "border-l-orange-500 bg-orange-50" : "border-l-blue-500",
                "relative"
            )}
            onClick={onClick}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            {scheme.icon && <span className="text-2xl">{scheme.icon}</span>}
                            <h3 className="text-lg font-semibold text-slate-900">
                                {language === 'hi' && scheme.name_hi ? scheme.name_hi : scheme.name}
                            </h3>
                        </div>
                        <p className="text-sm text-slate-500">{scheme.ministry}</p>
                    </div>

                    <div className="flex flex-col gap-2 items-end">
                        <Badge variant={confidencePercent >= 80 ? "default" : "secondary"}>
                            {getConfidenceLabel(scheme.confidence || 0)}
                        </Badge>
                        {scheme.category && (
                            <Badge variant="outline" className="text-xs">
                                {scheme.category}
                            </Badge>
                        )}
                        {scheme.state && (
                            <Badge variant="outline" className="text-xs bg-blue-50">
                                {scheme.state}
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <p className="text-sm text-slate-600 line-clamp-2">
                    {language === 'hi' && scheme.description_hi ? scheme.description_hi : scheme.description}
                </p>

                {/* Confidence Bar */}
                <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-500">
                        <span>{language === 'hi' ? 'पात्रता विश्वास' : 'Eligibility Confidence'}</span>
                        <span>{Math.round(confidencePercent)}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={cn("h-full transition-all", getConfidenceColor(scheme.confidence || 0))}
                            style={{ width: `${confidencePercent}%` }}
                        />
                    </div>
                </div>

                {/* Benefit Value */}
                {scheme.benefit_value && (
                    <div className="flex items-center gap-2 text-lg font-semibold text-green-700">
                        <IndianRupee className="w-5 h-5" />
                        <span>{scheme.benefit_value.toLocaleString('en-IN')}</span>
                        <span className="text-sm font-normal text-slate-500">
                            {scheme.benefit_frequency === 'annual' && (language === 'hi' ? 'प्रति वर्ष' : 'per year')}
                            {scheme.benefit_frequency === 'monthly' && (language === 'hi' ? 'प्रति माह' : 'per month')}
                            {scheme.benefit_frequency === 'quarterly' && (language === 'hi' ? 'प्रति तिमाही' : 'per quarter')}
                            {scheme.benefit_frequency === 'one_time' && (language === 'hi' ? 'एकमुश्त' : 'one-time')}
                        </span>
                    </div>
                )}

                {/* Conflict Warning */}
                {scheme.conflicts && scheme.conflicts.length > 0 && (
                    <div className="flex items-center gap-2 p-2 bg-orange-50 border border-orange-200 rounded text-sm text-orange-800">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        <span>
                            {language === 'hi'
                                ? `${scheme.conflicts.length} योजना(ओं) के साथ विरोध`
                                : `Conflicts with ${scheme.conflicts.length} scheme(s)`}
                        </span>
                    </div>
                )}

                <Button
                    variant="outline"
                    className="w-full"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick?.();
                    }}
                >
                    {language === 'hi' ? 'विवरण देखें' : 'View Details'}
                </Button>
            </CardContent>
        </Card>
    );
}
