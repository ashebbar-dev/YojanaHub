'use client';

import * as React from 'react';
import { Question } from '@/types';
import { SelectQuestion } from './select-question';
import { RadioQuestion } from './radio-question';
import { NumberQuestion } from './number-question';

interface QuestionCardProps {
    question: Question;
    value: any;
    onChange: (value: any) => void;
}

export function QuestionCard({ question, value, onChange }: QuestionCardProps) {
    switch (question.input_type) {
        case 'select':
            return <SelectQuestion question={question} value={value} onChange={onChange} />;
        case 'radio':
            return <RadioQuestion question={question} value={value} onChange={onChange} />;
        case 'number':
            return <NumberQuestion question={question} value={value} onChange={onChange} />;
        default:
            return <div className="text-red-500">Unsupported question type: {question.input_type}</div>;
    }
}
