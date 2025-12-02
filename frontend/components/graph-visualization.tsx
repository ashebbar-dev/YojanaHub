'use client';

import * as React from 'react';
import { Scheme } from '@/types';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Simple graph visualization without React Flow dependency
interface GraphNode {
    id: string;
    type: 'user' | 'attribute' | 'scheme';
    label: string;
    x: number;
    y: number;
    data?: any;
}

interface GraphEdge {
    from: string;
    to: string;
    type: 'qualifies' | 'conflicts';
}

export function GraphVisualization() {
    const { language, eligibleSchemes, userAttributes } = useAppStore();
    const router = useRouter();
    const [hoveredNode, setHoveredNode] = React.useState<string | null>(null);

    // Generate graph data
    const { nodes, edges } = React.useMemo(() => {
        const graphNodes: GraphNode[] = [];
        const graphEdges: GraphEdge[] = [];

        // Center user node
        graphNodes.push({
            id: 'user',
            type: 'user',
            label: language === 'hi' ? 'आप' : 'You',
            x: 400,
            y: 50,
        });

        // Attribute nodes (2nd level)
        const attributes = [
            { id: 'attr_age', label: `${language === 'hi' ? 'आयु' : 'Age'}: ${userAttributes.age || 'N/A'}` },
            { id: 'attr_occupation', label: `${language === 'hi' ? 'व्यवसाय' : 'Occupation'}: ${userAttributes.occupation || 'N/A'}` },
            { id: 'attr_state', label: `${language === 'hi' ? 'राज्य' : 'State'}: ${userAttributes.state || 'N/A'}` },
        ];

        attributes.forEach((attr, idx) => {
            const x = 200 + idx * 200;
            graphNodes.push({
                id: attr.id,
                type: 'attribute',
                label: attr.label,
                x,
                y: 150,
            });
            graphEdges.push({ from: 'user', to: attr.id, type: 'qualifies' });
        });

        // Scheme nodes (3rd level) - arrange in grid
        eligibleSchemes.slice(0, 6).forEach((scheme, idx) => {
            const row = Math.floor(idx / 3);
            const col = idx % 3;
            const x = 150 + col * 250;
            const y = 280 + row * 140;

            graphNodes.push({
                id: scheme.id,
                type: 'scheme',
                label: scheme.name.length > 25 ? scheme.name.substring(0, 25) + '...' : scheme.name,
                x,
                y,
                data: scheme,
            });

            // Connect to random attribute
            const attrIdx = idx % attributes.length;
            graphEdges.push({ from: attributes[attrIdx].id, to: scheme.id, type: 'qualifies' });
        });

        // Add conflict edges
        eligibleSchemes.forEach(scheme => {
            if (scheme.conflicts && scheme.conflicts.length > 0) {
                scheme.conflicts.forEach(conflictId => {
                    if (graphNodes.find(n => n.id === conflictId)) {
                        graphEdges.push({ from: scheme.id, to: conflictId, type: 'conflicts' });
                    }
                });
            }
        });

        return { nodes: graphNodes, edges: graphEdges };
    }, [eligibleSchemes, userAttributes, language]);

    const handleNodeClick = (node: GraphNode) => {
        if (node.type === 'scheme' && node.data) {
            router.push(`/schemes/${node.id}`);
        }
    };

    return (
        <div className="space-y-4">
            {/* Legend */}
            <Card className="p-4">
                <div className="flex flex-wrap gap-6 justify-center text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-blue-600" />
                        <span>{language === 'hi' ? 'आप' : 'You'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-slate-400" />
                        <span>{language === 'hi' ? 'गुण' : 'Attributes'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-green-500" />
                        <span>{language === 'hi' ? 'योजनाएं' : 'Schemes'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-0.5 bg-green-600" />
                        <span>{language === 'hi' ? 'योग्य' : 'Qualifies'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-0.5 bg-red-500 border-dashed border-t-2 border-red-500" style={{ height: 0 }} />
                        <span>{language === 'hi' ? 'विरोध' : 'Conflicts'}</span>
                    </div>
                </div>
            </Card>

            {/* Graph Canvas */}
            <Card className="p-4 bg-slate-50">
                <div className="relative w-full h-[600px] overflow-auto">
                    <svg className="w-full h-full min-w-[800px] min-h-[600px]">
                        {/* Draw edges first */}
                        {edges.map((edge, idx) => {
                            const fromNode = nodes.find(n => n.id === edge.from);
                            const toNode = nodes.find(n => n.id === edge.to);
                            if (!fromNode || !toNode) return null;

                            const isConflict = edge.type === 'conflicts';

                            return (
                                <line
                                    key={idx}
                                    x1={fromNode.x}
                                    y1={fromNode.y}
                                    x2={toNode.x}
                                    y2={toNode.y}
                                    stroke={isConflict ? '#ef4444' : '#16a34a'}
                                    strokeWidth={isConflict ? 2 : 2}
                                    strokeDasharray={isConflict ? '5,5' : 'none'}
                                    opacity={0.6}
                                    markerEnd={isConflict ? 'url(#arrowRed)' : 'url(#arrowGreen)'}
                                />
                            );
                        })}

                        {/* Arrow markers */}
                        <defs>
                            <marker id="arrowGreen" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                                <path d="M0,0 L0,6 L9,3 z" fill="#16a34a" />
                            </marker>
                            <marker id="arrowRed" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                                <path d="M0,0 L0,6 L9,3 z" fill="#ef4444" />
                            </marker>
                        </defs>

                        {/* Draw nodes */}
                        {nodes.map(node => {
                            const isHovered = hoveredNode === node.id;
                            const isClickable = node.type === 'scheme';

                            if (node.type === 'user') {
                                return (
                                    <g key={node.id}>
                                        <circle
                                            cx={node.x}
                                            cy={node.y}
                                            r={30}
                                            fill="#2563eb"
                                            stroke="#1e40af"
                                            strokeWidth={3}
                                            className="drop-shadow-lg"
                                        />
                                        <text
                                            x={node.x}
                                            y={node.y + 5}
                                            textAnchor="middle"
                                            fill="white"
                                            fontSize="16"
                                            fontWeight="bold"
                                        >
                                            {node.label}
                                        </text>
                                    </g>
                                );
                            } else if (node.type === 'attribute') {
                                return (
                                    <g key={node.id}>
                                        <rect
                                            x={node.x - 60}
                                            y={node.y - 20}
                                            width={120}
                                            height={40}
                                            rx={8}
                                            fill="#94a3b8"
                                            stroke="#64748b"
                                            strokeWidth={2}
                                        />
                                        <text
                                            x={node.x}
                                            y={node.y + 5}
                                            textAnchor="middle"
                                            fill="white"
                                            fontSize="12"
                                            fontWeight="500"
                                        >
                                            {node.label}
                                        </text>
                                    </g>
                                );
                            } else {
                                // Scheme node
                                return (
                                    <g
                                        key={node.id}
                                        onMouseEnter={() => setHoveredNode(node.id)}
                                        onMouseLeave={() => setHoveredNode(null)}
                                        onClick={() => handleNodeClick(node)}
                                        className={isClickable ? 'cursor-pointer' : ''}
                                        style={{ transition: 'all 0.2s' }}
                                    >
                                        <rect
                                            x={node.x - 70}
                                            y={node.y - 25}
                                            width={140}
                                            height={50}
                                            rx={8}
                                            fill={isHovered ? '#16a34a' : '#22c55e'}
                                            stroke="#15803d"
                                            strokeWidth={isHovered ? 3 : 2}
                                            className="drop-shadow"
                                            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)', transformOrigin: `${node.x}px ${node.y}px` }}
                                        />
                                        <text
                                            x={node.x}
                                            y={node.y}
                                            textAnchor="middle"
                                            fill="white"
                                            fontSize="11"
                                            fontWeight="600"
                                        >
                                            {node.label}
                                        </text>
                                        {node.data?.annual_value && (
                                            <text
                                                x={node.x}
                                                y={node.y + 15}
                                                textAnchor="middle"
                                                fill="white"
                                                fontSize="10"
                                            >
                                                ₹{(node.data.annual_value / 1000).toFixed(0)}k/yr
                                            </text>
                                        )}
                                    </g>
                                );
                            }
                        })}
                    </svg>
                </div>
            </Card>

            {/* Info */}
            <Card className="p-4 bg-blue-50 border-blue-200">
                <p className="text-sm text-blue-900">
                    {language === 'hi'
                        ? '💡 योजना नोड पर क्लिक करें विवरण देखने के लिए। ग्राफ दिखाता है कि आपके गुण आपको विभिन्न योजनाओं के लिए कैसे योग्य बनाते हैं।'
                        : '💡 Click on scheme nodes to view details. The graph shows how your attributes qualify you for different schemes.'}
                </p>
            </Card>
        </div>
    );
}
