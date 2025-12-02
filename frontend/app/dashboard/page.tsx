'use client';

import * as React from 'react';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { TrendingDown, Users, IndianRupee, AlertCircle } from 'lucide-react';

interface SchemeLeakage {
    schemeId: string;
    schemeName: string;
    eligible: number;
    enrolled: number;
    gap: number;
    gapPercent: number;
    unclaimedValue: number;
}

export default function DashboardPage() {
    const [state, setState] = React.useState('jharkhand');
    const [district, setDistrict] = React.useState('ranchi');

    // Mock leakage data
    const mockLeakageData: SchemeLeakage[] = [
        {
            schemeId: 'pm_kisan',
            schemeName: 'PM-KISAN',
            eligible: 125000,
            enrolled: 89500,
            gap: 35500,
            gapPercent: 28.4,
            unclaimedValue: 7100000
        },
        {
            schemeId: 'pmjay',
            schemeName: 'Ayushman Bharat PM-JAY',
            eligible: 180000,
            enrolled: 145000,
            gap: 35000,
            gapPercent: 19.4,
            unclaimedValue: 0 // Health insurance
        },
        {
            schemeId: 'mkay_jh',
            schemeName: 'Mukhyamantri Krishi Ashirwad Yojana',
            eligible: 95000,
            enrolled: 68000,
            gap: 27000,
            gapPercent: 28.4,
            unclaimedValue: 5400000
        },
        {
            schemeId: 'pmfby',
            schemeName: 'PM Fasal Bima Yojana',
            eligible: 110000,
            enrolled: 72000,
            gap: 38000,
            gapPercent: 34.5,
            unclaimedValue: 0 // Insurance scheme
        },
        {
            schemeId: 'nfsa',
            schemeName: 'National Food Security Act',
            eligible: 450000,
            enrolled: 425000,
            gap: 25000,
            gapPercent: 5.6,
            unclaimedValue: 0 // Food subsidy
        },
    ];

    const totalUnclaimed = mockLeakageData.reduce((sum, s) => sum + s.unclaimedValue, 0);
    const avgGap = mockLeakageData.reduce((sum, s) => sum + s.gapPercent, 0) / mockLeakageData.length;
    const totalEligible = mockLeakageData.reduce((sum, s) => sum + s.eligible, 0);
    const totalEnrolled = mockLeakageData.reduce((sum, s) => sum + s.enrolled, 0);

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        Scheme Leakage Dashboard
                    </h1>
                    <p className="text-slate-600">
                        Track scheme enrollment gaps and identify areas for improvement
                    </p>
                </div>

                {/* Region Selector */}
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <label className="text-sm font-medium text-slate-700 mb-2 block">
                                    State
                                </label>
                                <Select value={state} onValueChange={setState}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="jharkhand">Jharkhand</SelectItem>
                                        <SelectItem value="bihar">Bihar</SelectItem>
                                        <SelectItem value="odisha">Odisha</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                <label className="text-sm font-medium text-slate-700 mb-2 block">
                                    District
                                </label>
                                <Select value={district} onValueChange={setDistrict}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ranchi">Ranchi</SelectItem>
                                        <SelectItem value="dhanbad">Dhanbad</SelectItem>
                                        <SelectItem value="jamshedpur">Jamshedpur</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-slate-600">Total Unclaimed</p>
                                <IndianRupee className="w-5 h-5 text-red-600" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900">
                                ₹{(totalUnclaimed / 10000000).toFixed(1)} Cr
                            </p>
                            <p className="text-xs text-slate-500 mt-1">Annual value</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-slate-600">Avg Gap</p>
                                <TrendingDown className="w-5 h-5 text-orange-600" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900">
                                {avgGap.toFixed(1)}%
                            </p>
                            <p className="text-xs text-slate-500 mt-1">Enrollment gap</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-slate-600">Total Eligible</p>
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900">
                                {(totalEligible / 1000).toFixed(0)}k
                            </p>
                            <p className="text-xs text-slate-500 mt-1">Citizens</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-slate-600">Enrolled</p>
                                <Users className="w-5 h-5 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900">
                                {(totalEnrolled / 1000).toFixed(0)}k
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                {((totalEnrolled / totalEligible) * 100).toFixed(1)}% coverage
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Leakage Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-orange-500" />
                            Scheme-wise Enrollment Gap
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mockLeakageData.map((scheme) => (
                                <div key={scheme.schemeId} className="border rounded-lg p-4 bg-slate-50">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-slate-900 mb-1">
                                                {scheme.schemeName}
                                            </h4>
                                            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                                                <span>Eligible: {scheme.eligible.toLocaleString()}</span>
                                                <span>•</span>
                                                <span>Enrolled: {scheme.enrolled.toLocaleString()}</span>
                                                <span>•</span>
                                                <span className="text-orange-600 font-medium">
                                                    Gap: {scheme.gap.toLocaleString()} ({scheme.gapPercent}%)
                                                </span>
                                            </div>
                                        </div>
                                        {scheme.unclaimedValue > 0 && (
                                            <Badge variant="destructive" className="ml-4">
                                                ₹{(scheme.unclaimedValue / 100000).toFixed(1)}L unclaimed
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs text-slate-500">
                                            <span>Enrollment Progress</span>
                                            <span>{(100 - scheme.gapPercent).toFixed(1)}%</span>
                                        </div>
                                        <Progress
                                            value={100 - scheme.gapPercent}
                                            className="h-3"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Action Recommendations */}
                <Card className="mt-6 border-blue-200 bg-blue-50">
                    <CardHeader>
                        <CardTitle className="text-blue-900">Recommended Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm text-blue-800">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600">•</span>
                                <span>
                                    <strong>PM Fasal Bima Yojana</strong> has highest gap (34.5%). Conduct awareness campaigns in rural blocks.
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600">•</span>
                                <span>
                                    <strong>PM-KISAN</strong> gap represents ₹7.1 Cr unclaimed annually. Deploy field agents to assist with registration.
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600">•</span>
                                <span>
                                    <strong>NFSA</strong> shows best performance (5.6% gap). Replicate this model for other schemes.
                                </span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
