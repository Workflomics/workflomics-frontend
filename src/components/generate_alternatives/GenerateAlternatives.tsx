import React, { useCallback, useEffect, useMemo, useRef } from "react";
import ReactFlow, { Background, useReactFlow } from "reactflow";
import "reactflow/dist/style.css";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

import WorkflowNode from "./flow/WorkflowNode";
import CustomEdge from "./flow/CustomEdge";
import { useWorkflowState } from "./hooks/useWorkflowState";
import ConstraintSidebar from "./sidebar/ConstraintSidebar";
import { Icons } from "./ui/Icons";
import { InfoTooltip } from "./ui/InfoTooltip";
import { useStore } from "../../store";
import { generateApeConfig } from "./utils/apeConfigBuilder";

function FitViewOnChange({ trigger }: { trigger: number }) {
    const { fitView } = useReactFlow();
    useEffect(() => {
        const id = setTimeout(() => fitView({ duration: 300, padding: 0.15 }), 50);
        return () => clearTimeout(id);
    }, [trigger, fitView]);
    return null;
}

const GenerateAlternatives = observer(() => {
    const { exploreDataStore } = useStore();
    const navigate = useNavigate();
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        handleNodeClick,
        handleNodeContextMenu,
        handleEdgeClick,
        stepStatus,
        edgeStatus,
        edgeEndpoints,
        configParams,
        handleConfigChange,
        parsedWorkflow,
        workflowKey,
        uploadCwlFile,
        uploadedFileName,
        isLoading,
        uploadError,
    } = useWorkflowState();

    const nodeTypes = useMemo(() => ({ custom: WorkflowNode }), []);
    const edgeTypes = useMemo(() => ({ custom: CustomEdge }), []);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const nodeLabels = useMemo(
        () => parsedWorkflow ? Object.fromEntries(parsedWorkflow.nodes.map((n) => [n.id, n.label])) : {},
        [parsedWorkflow]
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) uploadCwlFile(file);
        e.target.value = "";
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) uploadCwlFile(file);
    };

    const handleGenerate = useCallback(async () => {
        if (!parsedWorkflow) return;
        const config = JSON.parse(
            generateApeConfig(stepStatus, edgeStatus, edgeEndpoints, configParams, parsedWorkflow)
        );
        // Tool-Sequenz des Eingabeworkflows als Referenz für Post-Filtering
        const inputToolSequence = parsedWorkflow.nodes
            .filter((n) => (n.type ?? "tool") === "tool")
            .map((n) => n.label)
            .join("->");
        try {
            await exploreDataStore.runSynthesisWithRawConfig(config, inputToolSequence);
            navigate("/explore/results");
        } catch {
            // error shown via exploreDataStore.generationError
        }
    }, [parsedWorkflow, stepStatus, edgeStatus, edgeEndpoints, configParams, exploreDataStore, navigate]);

    return (
        <div className="flex flex-col w-full p-6 bg-slate-50 h-full">
            <input
                ref={fileInputRef}
                type="file"
                accept=".cwl,.yaml,.yml"
                className="hidden"
                onChange={handleFileChange}
            />

            <div className="flex gap-6 h-[calc(100vh-19rem)] min-h-[500px]">
                {/* Graph area */}
                <div className="flex-1 relative">
                    {/* Graph info icon — always visible */}
                    <div className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white/90 border border-slate-200 rounded-lg shadow-sm">
                        <InfoTooltip
                            align="right"
                            side="bottom"
                            text={<>
                                <p className="mb-2">Visualizes the uploaded CWL v1.2 workflow as an interactive graph.</p>
                                <ul className="space-y-1">
                                    <li>Left-click a node: <span className="text-slate-600 font-semibold">Keep</span> → <span className="text-orange-500 font-semibold">Vary</span> → <span className="text-rose-600 font-semibold">Ban</span></li>
                                    <li>Right-click a node: reverse cycle</li>
                                    <li>Click a tool↔tool edge: <span className="text-teal-700 font-semibold">Chain</span> / <span className="text-rose-600 font-semibold">Break</span></li>
                                </ul>
                                <p className="mt-2 text-slate-400">Input and output nodes are not interactive.</p>
                            </>}
                        />
                    </div>

                    {parsedWorkflow ? (
                        <>
                            {/* Filename pill + change-file button */}
                            <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-white/95 border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm max-w-[60%]">
                                <Icons.Data className="w-4 h-4 text-[#f06455] shrink-0" />
                                <span className="text-xs font-semibold text-slate-700 truncate">
                                    {uploadedFileName}
                                </span>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isLoading}
                                    className="ml-1 text-xs text-slate-400 hover:text-slate-700 disabled:opacity-50 transition-colors shrink-0"
                                >
                                    {isLoading ? "Parsing…" : "Change"}
                                </button>
                            </div>

                            <div className="w-full h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                <ReactFlow
                                    nodes={nodes}
                                    edges={edges}
                                    onNodesChange={onNodesChange}
                                    onEdgesChange={onEdgesChange}
                                    onNodeClick={handleNodeClick}
                                    onNodeContextMenu={handleNodeContextMenu}
                                    onEdgeClick={handleEdgeClick}
                                    nodeTypes={nodeTypes}
                                    edgeTypes={edgeTypes}
                                    fitView
                                >
                                    <FitViewOnChange trigger={workflowKey} />
                                    <Background color="#cbd5e1" gap={20} size={1} />
                                </ReactFlow>
                            </div>
                        </>
                    ) : (
                        /* Upload zone */
                        <div
                            className="w-full h-full bg-white border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[#f06455]/60 hover:bg-[#f06455]/5 transition-all group"
                            onClick={() => !isLoading && fileInputRef.current?.click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="w-8 h-8 animate-spin text-[#f06455]" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    <p className="text-sm text-slate-500">Workflow wird geladen…</p>
                                </>
                            ) : (
                                <>
                                    <div className="p-4 bg-slate-100 rounded-2xl group-hover:bg-[#f06455]/10 transition-colors">
                                        <Icons.Data className="w-8 h-8 text-slate-400 group-hover:text-[#f06455] transition-colors" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-semibold text-slate-600">Upload CWL-File</p>
                                        <p className="text-xs text-slate-400 mt-1">Drag here or click to upload</p>
                                    </div>
                                    {uploadError && (
                                        <p className="text-xs text-rose-500 bg-rose-50 px-3 py-1.5 rounded-lg">
                                            {uploadError}
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar only visible after upload */}
                {parsedWorkflow && (
                    <ConstraintSidebar
                        stepStatus={stepStatus}
                        edgeStatus={edgeStatus}
                        edgeEndpoints={edgeEndpoints}
                        nodeLabels={nodeLabels}
                        configParams={configParams}
                        onConfigChange={handleConfigChange}
                        parsedWorkflow={parsedWorkflow}
                        onGenerate={handleGenerate}
                        isGenerating={exploreDataStore.isGenerating}
                        generationError={exploreDataStore.generationError}
                    />
                )}
            </div>
        </div>
    );
});

export default GenerateAlternatives;
