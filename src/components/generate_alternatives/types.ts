export type NodeStatus = "Keep" | "Vary" | "Ban";

export interface WorkflowNodeData {
    label: string;
    type: "tool" | "input" | "output";
    status: NodeStatus;
}

export interface ParsedWorkflow {
    nodes: { id: string; label: string; type: "tool" | "input" | "output" }[];
    edges: { source: string; target: string }[];
    inputs: { id: string; label: string }[];
    outputs: { id: string; label: string }[];
}
