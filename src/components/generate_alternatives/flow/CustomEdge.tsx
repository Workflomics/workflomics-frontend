import React from "react";
import { BaseEdge, EdgeLabelRenderer, getBezierPath, EdgeProps } from "reactflow";
import { Icons } from "../ui/Icons";


const CustomEdge = ({
                        id,
                        sourceX,
                        sourceY,
                        targetX,
                        targetY,
                        sourcePosition,
                        targetPosition,
                        style = {},
                        markerEnd,
                        data,
                    }: EdgeProps) => {
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });
    const status = data?.status;
    const isInteractable = data?.isInteractable;

    let LabelIcon = null;
    let labelClass = "";

    if (status === "chain") {
        LabelIcon = Icons.Link;
        labelClass = "bg-teal-100 border-teal-300 text-teal-700";
    } else if (status === "break") {
        LabelIcon = Icons.Scissors;
        labelClass = "bg-rose-100 border-rose-300 text-rose-700";
    }

    const hitStrokeWidth = isInteractable ? 20 : 0;
    const cursorClass = isInteractable ? "cursor-pointer" : "cursor-default";

    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
            <path
                d={edgePath}
                strokeWidth={hitStrokeWidth}
                stroke="transparent"
                fill="none"
                className={cursorClass}
            />
            {LabelIcon && (
                <EdgeLabelRenderer>
                    <div
                        style={{
                            position: "absolute",
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                            pointerEvents: "none",
                        }}
                        className={`p-1 rounded-full border shadow-sm ${labelClass} z-20`}
                    >
                        <LabelIcon className="w-3 h-3" />
                    </div>
                </EdgeLabelRenderer>
            )}
        </>
    );
};

export default CustomEdge;