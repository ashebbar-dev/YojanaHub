'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Persona } from '@/types';
import { useAppStore } from '@/lib/store';
import { ArrowRight, MapPin, User } from 'lucide-react';

interface PersonaCardProps {
    persona: Persona;
    onSelect: (persona: Persona) => void;
    isLoading?: boolean;
}

export function PersonaCard({ persona, onSelect, isLoading }: PersonaCardProps) {
    const { language } = useAppStore();

    const displayName = language === 'hi' && persona.name_hindi ? persona.name_hindi : persona.name;
    const displayDesc = language === 'hi' && persona.description_hi ? persona.description_hi : persona.description;

    return (
        <Card className="h-full flex flex-col hover:shadow-lg transition-shadow border-slate-200">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                            {persona.avatar || '👤'}
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg text-slate-900">{displayName}</h3>
                            <div className="flex items-center gap-1 text-sm text-slate-500">
                                <MapPin className="w-3 h-3" />
                                {persona.attributes.state}
                            </div>
                        </div>
                    </div>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                        {persona.age} {language === 'hi' ? 'वर्ष' : 'Years'}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {displayDesc}
                </p>
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs font-normal">
                        {persona.attributes.occupation}
                    </Badge>
                    <Badge variant="outline" className="text-xs font-normal">
                        {persona.attributes.caste_category}
                    </Badge>
                    {persona.attributes.bpl_status && (
                        <Badge variant="outline" className="text-xs font-normal border-amber-200 bg-amber-50 text-amber-700">
                            BPL Card
                        </Badge>
                    )}
                </div>
            </CardContent>
            <CardFooter className="pt-0">
                <Button
                    className="w-full gap-2"
                    onClick={() => onSelect(persona)}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className="animate-pulse">Loading...</span>
                    ) : (
                        <>
                            {language === 'hi' ? 'डेमो देखें' : 'Try Demo'}
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
