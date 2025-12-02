'use client';

import * as React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Question } from '@/types';
import { useAppStore } from '@/lib/store';

interface SelectQuestionProps {
    question: Question;
    value: any;
    onChange: (value: any) => void;
}

export function SelectQuestion({ question, value, onChange }: SelectQuestionProps) {
    const { language } = useAppStore();

    return (
        <div className="w-full max-w-md">
            <Select value={value?.toString()} onValueChange={onChange}>
                <SelectTrigger className="w-full h-12 text-lg">
                    <SelectValue placeholder={language === 'hi' ? 'चुनें...' : 'Select...'} />
                </SelectTrigger>
                <SelectContent>
                    {question.options?.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value} className="text-lg py-3">
                            {language === 'hi' ? opt.label.hi : opt.label.en}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
