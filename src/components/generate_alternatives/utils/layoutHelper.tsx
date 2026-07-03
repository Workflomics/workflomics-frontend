import dagre from "dagre";
import { Node, Edge } from "reactflow";

const TOOL_W = 210;
const TOOL_H = 70;
const DATA_W = 180;
const DATA_H = 38;

export const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: "TB", nodesep: 60, ranksep: 80 });

    nodes.forEach((node) => {
        const isTool = node.data?.type === "tool";
        dagreGraph.setNode(node.id, {
            width: isTool ? TOOL_W : DATA_W,
            height: isTool ? TOOL_H : DATA_H,
        });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const pos = dagreGraph.node(node.id);
        const isTool = node.data?.type === "tool";
        const w = isTool ? TOOL_W : DATA_W;
        const h = isTool ? TOOL_H : DATA_H;
        return {
            ...node,
            position: {
                x: pos.x - w / 2,
                y: pos.y - h / 2,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
};
