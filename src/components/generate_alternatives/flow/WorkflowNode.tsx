import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Icons } from "../ui/Icons";
import { WorkflowNodeData } from "../types";

const WorkflowNode = ({ data }: NodeProps<WorkflowNodeData>) => {
    const { label, type, status } = data;
    const isData = type !== "tool";

    let containerStyle = "bg-white border-slate-200";
    let icon = <Icons.Gear className="w-4 h-4 text-slate-400" />;
    let labelStyle = "text-slate-600";
    let statusIndicator = null;

    if (isData) {
        containerStyle =
            "bg-slate-50 border-slate-200 border-l-4 border-l-slate-300";
        labelStyle = "text-slate-500 font-medium italic";
        icon = <Icons.Data className="w-4 h-4 text-slate-400" />;
    } else {
        if (status === "Keep") {
            containerStyle =
                "bg-white border-slate-300 shadow-sm border-l-4 border-l-slate-600";
            icon = <Icons.Gear className="w-4 h-4 text-slate-600" />;
            labelStyle = "text-slate-800 font-bold";
            statusIndicator = (
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-auto">
                    KEEP
                </span>
            );
        } else if (status === "Vary") {
            containerStyle =
                "bg-[#fff7ed] border-[#f06455] shadow-md border-l-4 border-l-[#f06455]";
            icon = <Icons.Sparkles className="w-4 h-4 text-[#f06455]" />;
            labelStyle = "text-slate-900 font-bold";
            statusIndicator = (
                <span className="bg-[#f06455] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-auto">
                    VARY
                </span>
            );
        } else if (status === "Ban") {
            containerStyle =
                "bg-slate-50 border-slate-200 opacity-60 border-l-4 border-l-rose-400";
            icon = <Icons.Ban className="w-4 h-4 text-rose-400" />;
            labelStyle = "text-slate-400 line-through decoration-slate-400";
            statusIndicator = (
                <span className="text-[9px] font-bold text-rose-400 uppercase tracking-widest ml-auto">
                    BAN
                </span>
            );
        }
    }

    const stripedBg =
        status === "Ban"
            ? {
                backgroundImage:
                    "linear-gradient(135deg, #f1f5f9 25%, #ffffff 25%, #ffffff 50%, #f1f5f9 50%, #f1f5f9 75%, #ffffff 75%, #ffffff 100%)",
                backgroundSize: "20px 20px",
            }
            : {};

    return (
        <div
            className={`relative px-3 py-3 rounded-md border flex items-center gap-3 transition-all w-[190px] ${containerStyle}`}
            style={stripedBg}
        >
            <Handle
                type="target"
                position={Position.Top}
                className="!bg-slate-300 !w-2 !h-2 !-mt-1"
            />
            <div className="shrink-0">{icon}</div>
            <div className="flex-1 flex flex-col overflow-hidden">
                <span className="text-[8px] uppercase font-bold tracking-wider opacity-50 mb-0.5">
                    {type}
                </span>
                <div className="flex items-center justify-between">
                    <span className={`text-xs truncate ${labelStyle}`} title={label}>
                        {label}
                    </span>
                </div>
            </div>
            {statusIndicator && (
                <div className="absolute top-2 right-2">{statusIndicator}</div>
            )}
            <Handle
                type="source"
                position={Position.Bottom}
                className="!bg-slate-300 !w-2 !h-2 !-mb-1"
            />
        </div>
    );
};

export default WorkflowNode;
