import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Icons } from "../ui/Icons";
import { WorkflowNodeData } from "../types";

const WorkflowNode = ({ data }: NodeProps<WorkflowNodeData>) => {
    const { label, type, status } = data;

    if (type !== "tool") {
        return (
            <div className="relative px-3.5 py-2 rounded-lg bg-slate-50 border border-dashed border-slate-300 flex items-center gap-2 w-[180px]">
                <Handle type="target" position={Position.Top} className="!bg-slate-300 !w-2 !h-2 !-mt-1" />
                <Icons.Data className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-[11px] text-slate-500 italic truncate" title={label}>{label}</span>
                <Handle type="source" position={Position.Bottom} className="!bg-slate-300 !w-2 !h-2 !-mb-1" />
            </div>
        );
    }

    const statusConfig = {
        Keep: {
            card: "bg-white border-slate-200 shadow-sm",
            accent: "bg-slate-400",
            icon: <Icons.Gear className="w-4 h-4 text-slate-500" />,
            labelCls: "text-slate-800",
            badge: (
                <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded tracking-wide uppercase">
                    Keep
                </span>
            ),
        },
        Vary: {
            card: "bg-white border-[#f06455]/30 shadow-md",
            accent: "bg-[#f06455]",
            icon: <Icons.Sparkles className="w-4 h-4 text-[#f06455]" />,
            labelCls: "text-slate-800",
            badge: (
                <span className="text-[9px] font-bold text-white bg-[#f06455] px-1.5 py-0.5 rounded tracking-wide uppercase">
                    Vary
                </span>
            ),
        },
        Ban: {
            card: "bg-slate-50 border-rose-200 opacity-60",
            accent: "bg-rose-400",
            icon: <Icons.Ban className="w-4 h-4 text-rose-400" />,
            labelCls: "text-slate-400 line-through decoration-slate-400",
            badge: (
                <span className="text-[9px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded tracking-wide uppercase">
                    Ban
                </span>
            ),
        },
    };

    const cfg = statusConfig[status as keyof typeof statusConfig] ?? statusConfig.Keep;

    return (
        <div className={`relative pl-4 pr-3 py-2.5 rounded-xl border flex flex-col gap-1.5 transition-all w-[210px] overflow-hidden ${cfg.card}`}>
            {/* Thin accent bar — clipped to card corners by overflow-hidden */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${cfg.accent}`} />

            <Handle type="target" position={Position.Top} className="!bg-slate-300 !w-2 !h-2 !-mt-1" />

            <div className="flex flex-col gap-1">
                <div className="relative flex items-center">
                    <div className="absolute left-0 shrink-0">{cfg.icon}</div>
                    <span className={`w-full text-center text-sm font-bold truncate ${cfg.labelCls}`} title={label}>
                        {label}
                    </span>
                </div>
                <div className="flex justify-end">
                    {cfg.badge}
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} className="!bg-slate-300 !w-2 !h-2 !-mb-1" />
        </div>
    );
};

export default WorkflowNode;
