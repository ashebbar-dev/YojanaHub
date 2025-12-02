'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getQuestions, calculateEligibility } from '@/lib/api';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Header } from '@/components/header';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { QuestionCard } from '@/components/questions/question-card';

export default function QuestionsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const personaId = searchParams.get('persona');

    const {
        language,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        answeredQuestions,
        setAnsweredQuestion,
        setEligibleSchemes,
        userAttributes,
        updateUserAttribute
    } = useAppStore();

    const { data: questions, isLoading } = useQuery({
        queryKey: ['questions'],
        queryFn: getQuestions,
    });

    const currentQuestion = questions?.[currentQuestionIndex];
    const totalQuestions = questions?.length || 0;
    const progress = totalQuestions > 0 ? ((currentQuestionIndex) / totalQuestions) * 100 : 0;

    const handleAnswerChange = (value: any) => {
        if (!currentQuestion) return;
        setAnsweredQuestion(currentQuestion.id, value);
        updateUserAttribute(currentQuestion.attribute, value);
    };

    const handleNext = async () => {
        if (!questions) return;

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Submit and calculate eligibility
            try {
                const schemes = await calculateEligibility(userAttributes);
                setEligibleSchemes(schemes);
                router.push('/results');
            } catch (error) {
                console.error('Failed to calculate eligibility:', error);
            }
        }
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        } else {
            router.push('/');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-pulse text-blue-600">Loading questions...</div>
            </div>
        );
    }

    if (!currentQuestion) {
        return <div>Error loading questions</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            <main className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-slate-500 mb-2">
                        <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                        <span>{Math.round(progress)}% Complete</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 min-h-[400px] flex flex-col">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">
                        {language === 'hi' ? currentQuestion.text.hi : currentQuestion.text.en}
                    </h2>

                    {currentQuestion.help_text && (
                        <p className="text-sm text-slate-500 mb-4 italic">
                            {currentQuestion.help_text}
                        </p>
                    )}

                    <div className="flex-1">
                        <QuestionCard
                            question={currentQuestion}
                            value={answeredQuestions[currentQuestion.id] || ''}
                            onChange={handleAnswerChange}
                        />
                    </div>

                    <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
                        <Button variant="outline" onClick={handleBack} className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                        <Button onClick={handleNext} className="gap-2 bg-blue-600 hover:bg-blue-700">
                            {currentQuestionIndex === totalQuestions - 1 ? 'See Results' : 'Next'}
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
