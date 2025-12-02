'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Question } from '@/types';
import { useAppStore } from '@/lib/store';

interface NumberQuestionProps {
    question: Question;
    value: any;
    onChange: (value: any) => void;
}

export function NumberQuestion({ question, value, onChange }: NumberQuestionProps) {
    const { language } = useAppStore();

    return (
        <div className="w-full max-w-xs">
            <Input
                type="number"
                value={value || ''}
                onChange={(e) => onChange(Number(e.target.value))}
                className="h-14 text-xl"
                placeholder={language === 'hi' ? 'यहाँ दर्ज करें...' : 'Enter here...'}
                min={0}
            />
        </div>
    );
}
