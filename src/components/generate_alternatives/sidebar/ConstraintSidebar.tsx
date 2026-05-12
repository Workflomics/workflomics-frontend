import React, { useMemo, useState } from "react";
import { Icons } from "../ui/Icons";
import { NodeStatus, ParsedWorkflow } from "../types";
import { generateApeConfig } from "../utils/apeConfigBuilder";

interface ConstraintSidebarProps {
    stepStatus: Record<string, NodeStatus>;
    edgeStatus: Record<string, string>;
    edgeEndpoints: Record<string, { source: string; target: string }>;
    nodeLabels: Record<string, string>;
    configParams: {
        timeout: number;
        minLength: number;
        maxLength: number;
        solutions: number;
    };
    onConfigChange: (key: string, value: string) => void;
    parsedWorkflow: ParsedWorkflow;
    onGenerate: () => void;
    isGenerating: boolean;
    generationError: string;
}

export default function ConstraintSidebar({
    stepStatus,
    edgeStatus,
    edgeEndpoints,
    nodeLabels,
    configParams,
    onConfigChange,
    parsedWorkflow,
    onGenerate,
    isGenerating,
    generationError,
}: ConstraintSidebarProps) {
    const [showJson, setShowJson] = useState(false);
    const [copied, setCopied] = useState(false);

    const activeConstraints = useMemo(() => {
        const list: any[] = [];

        Object.entries(stepStatus).forEach(([id, status]) => {
            const label = nodeLabels[id];
            if (!label) return;
            if (status === "Keep") {
                list.push({ id: `node-${id}`, label: `Keep: ${label}`, icon: Icons.Gear, color: "text-slate-600 bg-slate-100 border-slate-200" });
            } else if (status === "Ban") {
                list.push({ id: `node-${id}`, label: `Exclude: ${label}`, icon: Icons.Ban, color: "text-rose-600 bg-rose-50 border-rose-200" });
            }
        });

        Object.entries(edgeStatus).forEach(([edgeId, status]) => {
            const ep = edgeEndpoints[edgeId];
            if (!ep) return;
            const sourceLabel = nodeLabels[ep.source];
            const targetLabel = nodeLabels[ep.target];
            if (!sourceLabel || !targetLabel) return;
            if (status === "chain") {
                list.push({ id: edgeId, label: `Chain: ${sourceLabel} → ${targetLabel}`, icon: Icons.Link, color: "text-teal-700 bg-teal-50 border-teal-200" });
            } else if (status === "break") {
                list.push({ id: edgeId, label: `Break: ${sourceLabel} ↛ ${targetLabel}`, icon: Icons.Scissors, color: "text-rose-600 bg-rose-50 border-rose-200" });
            }
        });

        return list;
    }, [stepStatus, edgeStatus, edgeEndpoints, nodeLabels]);

    const jsonString = useMemo(
        () => showJson
            ? generateApeConfig(stepStatus, edgeStatus, edgeEndpoints, configParams, parsedWorkflow)
            : "",
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [showJson]
    );

    const handleCopy = () => {
        const json = generateApeConfig(stepStatus, edgeStatus, edgeEndpoints, configParams, parsedWorkflow);
        navigator.clipboard.writeText(json).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    };

    return (
        <>
            <div className="w-80 lg:w-96 xl:w-[400px] shrink-0 flex flex-col gap-4 h-full overflow-hidden">

                {/* Active Constraints Panel */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col flex-1 min-h-0">
                    <div className="flex items-center gap-2 mb-4 shrink-0">
                        <div className="p-1.5 bg-[#f06455]/10 rounded text-[#f06455]">
                            <Icons.List className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                            Active Constraints
                        </h3>
                    </div>

                    {activeConstraints.length === 0 ? (
                        <div className="flex flex-col items-center justify-center flex-1 text-slate-400 text-center border-2 border-dashed border-slate-100 rounded-lg min-h-[120px]">
                            <Icons.Sparkles className="w-6 h-6 mb-2 opacity-30" />
                            <p className="text-[11px] font-medium">No active constraints</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-1 min-h-0">
                            {activeConstraints.map((item) => (
                                <div key={item.id} className={`flex items-center gap-3 p-2 rounded-md border text-[11px] font-medium transition-all ${item.color}`}>
                                    <item.icon className="w-3.5 h-3.5 shrink-0 opacity-80" />
                                    <span className="truncate">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* APE Settings Panel */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 shrink-0 flex flex-col gap-4">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                        APE Settings
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {["minLength", "maxLength", "solutions", "timeout"].map((key) => (
                            <div key={key}>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                                    {key}
                                </label>
                                <input
                                    type="number"
                                    value={configParams[key as keyof typeof configParams]}
                                    onChange={(e) => onConfigChange(key, e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-[#f06455] outline-none"
                                />
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={onGenerate}
                        disabled={isGenerating}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-[#f06455] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#d65041] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                    >
                        {isGenerating ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Generating…
                            </>
                        ) : (
                            <>
                                <Icons.Play className="w-4 h-4" />
                                Generate Alternatives
                            </>
                        )}
                    </button>
                    {generationError && (
                        <p className="text-xs text-rose-500 text-center">{generationError}</p>
                    )}
                    <button
                        onClick={() => setShowJson(true)}
                        className="w-full flex items-center justify-center gap-2 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                    >
                        <Icons.Code className="w-3.5 h-3.5" />
                        Show JSON
                    </button>
                </div>
            </div>

            {/* JSON Modal */}
            {showJson && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6"
                    onClick={() => setShowJson(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
                            <div className="flex items-center gap-2">
                                <Icons.Code className="w-4 h-4 text-[#f06455]" />
                                <span className="text-sm font-bold text-slate-800">APE Configuration JSON</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleCopy}
                                    className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all font-medium"
                                >
                                    {copied ? "Copied!" : "Copy"}
                                </button>
                                <button
                                    onClick={() => setShowJson(false)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* JSON body */}
                        <div className="overflow-auto flex-1 p-5">
                            <pre className="text-xs text-slate-700 font-mono leading-relaxed whitespace-pre text-left">
                                {jsonString}
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
