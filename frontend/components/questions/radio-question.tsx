'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Question } from '@/types';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface RadioQuestionProps {
    question: Question;
    value: any;
    onChange: (value: any) => void;
}

export function RadioQuestion({ question, value, onChange }: RadioQuestionProps) {
    const { language } = useAppStore();

    if (!question.options) return null;

    return (
        <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
            {question.options.map((opt) => {
                const optionValue = opt.value;
                const isSelected = value === optionValue;

                return (
                    <div
                        key={optionValue}
                        onClick={() => onChange(optionValue)}
                        className={cn(
                            "cursor-pointer rounded-lg border-2 p-4 transition-all hover:bg-slate-50",
                            isSelected
                                ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600 ring-offset-2"
                                : "border-slate-200"
                        )}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-medium text-slate-900">
                                {language === 'hi' ? opt.label.hi : opt.label.en}
                            </span>
                            <div className={cn(
                                "h-5 w-5 rounded-full border-2",
                                isSelected ? "border-blue-600 bg-blue-600" : "border-slate-300"
                            )}>
                                {isSelected && (
                                    <div className="h-full w-full rounded-full border-2 border-white" />
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
