'use client';

import * as React from 'react';
import { Scheme } from '@/types';
import { useAppStore } from '@/lib/store';
import { SchemeCard } from '@/components/scheme-card';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Filter } from 'lucide-react';

interface SchemeListProps {
    schemes: Scheme[];
    onSchemeClick: (scheme: Scheme) => void;
}

type SortOption = 'relevance' | 'value' | 'name';
type CategoryFilter = 'all' | string;
type ConfidenceFilter = 'all' | 'high';

export function SchemeList({ schemes, onSchemeClick }: SchemeListProps) {
    const { language } = useAppStore();

    const [sortBy, setSortBy] = React.useState<SortOption>('relevance');
    const [categoryFilter, setCategoryFilter] = React.useState<CategoryFilter>('all');
    const [confidenceFilter, setConfidenceFilter] = React.useState<ConfidenceFilter>('all');
    const [highlightedSchemeId, setHighlightedSchemeId] = React.useState<string | null>(null);

    // Get unique categories
    const categories = React.useMemo(() => {
        const cats = new Set(schemes.map(s => s.category).filter(Boolean));
        return Array.from(cats) as string[];
    }, [schemes]);

    // Filter schemes
    const filteredSchemes = React.useMemo(() => {
        return schemes.filter(scheme => {
            // Category filter
            if (categoryFilter !== 'all' && scheme.category !== categoryFilter) {
                return false;
            }

            // Confidence filter
            if (confidenceFilter === 'high' && (scheme.confidence || 0) < 0.8) {
                return false;
            }

            return true;
        });
    }, [schemes, categoryFilter, confidenceFilter]);

    // Sort schemes
    const sortedSchemes = React.useMemo(() => {
        const sorted = [...filteredSchemes];

        if (sortBy === 'relevance') {
            sorted.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
        } else if (sortBy === 'value') {
            // Calculate annual value for comparison
            const getAnnualValue = (scheme: Scheme) => {
                if (!scheme.benefit_value) return 0;
                if (scheme.benefit_frequency === 'annual') return scheme.benefit_value;
                if (scheme.benefit_frequency === 'monthly') return scheme.benefit_value * 12;
                if (scheme.benefit_frequency === 'quarterly') return scheme.benefit_value * 4;
                return scheme.benefit_value; // one_time
            };
            sorted.sort((a, b) => getAnnualValue(b) - getAnnualValue(a));
        } else if (sortBy === 'name') {
            sorted.sort((a, b) => a.name.localeCompare(b.name));
        }

        return sorted;
    }, [filteredSchemes, sortBy]);

    return (
        <div className="space-y-6">
            {/* Filters and Sort */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={categoryFilter === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCategoryFilter('all')}
                    >
                        {language === 'hi' ? 'सभी' : 'All'}
                    </Button>

                    {categories.map(cat => (
                        <Button
                            key={cat}
                            variant={categoryFilter === cat ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCategoryFilter(cat)}
                        >
                            {cat}
                        </Button>
                    ))}

                    <Button
                        variant={confidenceFilter === 'high' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setConfidenceFilter(confidenceFilter === 'high' ? 'all' : 'high')}
                        className="gap-2"
                    >
                        <Filter className="w-3 h-3" />
                        {language === 'hi' ? 'उच्च पात्रता' : 'High Confidence'}
                    </Button>
                </div>

                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="relevance">
                            {language === 'hi' ? 'प्रासंगिकता' : 'Relevance'}
                        </SelectItem>
                        <SelectItem value="value">
                            {language === 'hi' ? 'उच्चतम मूल्य' : 'Highest Value'}
                        </SelectItem>
                        <SelectItem value="name">
                            {language === 'hi' ? 'नाम A-Z' : 'Name A-Z'}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Schemes List */}
            <div className="grid gap-4">
                {sortedSchemes.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed">
                        <p className="text-slate-500">
                            {language === 'hi'
                                ? 'कोई योजना नहीं मिली। फ़िल्टर बदलने का प्रयास करें।'
                                : 'No schemes found. Try changing the filters.'}
                        </p>
                    </div>
                ) : (
                    sortedSchemes.map(scheme => (
                        <div key={scheme.id} id={`scheme-${scheme.id}`}>
                            <SchemeCard
                                scheme={scheme}
                                onClick={() => onSchemeClick(scheme)}
                                highlightConflict={highlightedSchemeId === scheme.id}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
