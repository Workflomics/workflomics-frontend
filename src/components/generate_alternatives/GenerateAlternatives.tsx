import React, { useState, useMemo, useEffect } from "react";
import ReactFlow, {
    Background,
    useNodesState,
    useEdgesState,
    MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";

import WorkflowNode from "./flow/WorkflowNode";
import CustomEdge from "./flow/CustomEdge";
import { getLayoutedElements } from "./utils/layoutHelper";

const initialData = [
    { id: "fasta", label: "Protein sequence", type: "input", inputs: [] },
    { id: "mzml", label: "Mass spectrum", type: "input", inputs: [] },
    { id: "comet", label: "Comet", type: "tool", inputs: ["fasta", "mzml"] },
    { id: "pepprop", label: "PeptideProphet", type: "tool", inputs: ["comet", "fasta", "mzml"] },
    { id: "protprop", label: "ProteinProphet", type: "tool", inputs: ["pepprop", "fasta"] },
    { id: "out1", label: "Over-representation data", type: "output", inputs: ["protprop"] },
];

export default function GenerateAlternatives() {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // Wichtig: Die Registrierung der Custom Types
    const nodeTypes = useMemo(() => ({ custom: WorkflowNode }), []);
    const edgeTypes = useMemo(() => ({ custom: CustomEdge }), []);

    // 3. Graph initialisieren (aus initialData)
    useEffect(() => {
        const rfNodes = initialData.map((item) => ({
            id: item.id,
            type: "custom",
            data: {
                label: item.label,
                type: item.type,
                status: "Fixed", // Standardstatus
            },
            position: { x: 0, y: 0 },
        }));

        const rfEdges = initialData.flatMap((item) =>
            (item.inputs || []).map((parentId) => {
                const sourceNode = initialData.find((d) => d.id === parentId);
                const targetNode = initialData.find((d) => d.id === item.id);
                return {
                    id: `e-${parentId}-${item.id}`,
                    source: parentId,
                    target: item.id,
                    type: "custom",
                    data: {
                        status: null,
                        isInteractable: sourceNode?.type === "tool" && targetNode?.type === "tool",
                    },
                    markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
                    style: { stroke: "#94a3b8", strokeWidth: 2 },
                };
            })
        );

        // Layout berechnen und setzen
        const layouted = getLayoutedElements(rfNodes, rfEdges);
        setNodes(layouted.nodes);
        setEdges(layouted.edges);
    }, [setNodes, setEdges]);

    return (
        // Ein Full-Screen Container für den Test
        <div className="h-[800px] w-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
            >
                <Background color="#cbd5e1" gap={20} size={1} />
            </ReactFlow>
        </div>
    );
}