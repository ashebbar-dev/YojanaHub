'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';

export function LanguageToggle() {
    const { language, setLanguage } = useAppStore();

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="w-24"
        >
            {language === 'en' ? '🇮🇳 हिंदी' : '🇺🇸 English'}
        </Button>
    );
}
