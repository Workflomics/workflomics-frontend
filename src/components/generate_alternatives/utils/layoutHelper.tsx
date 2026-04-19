import dagre from "dagre";
import { Node, Edge } from "reactflow";

export const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    // TB = Top to Bottom
    dagreGraph.setGraph({ rankdir: "TB", nodesep: 60, ranksep: 80 });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: 190, height: 60 });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
            ...node,
            position: {
                x: nodeWithPosition.x - 190 / 2,
                y: nodeWithPosition.y - 60 / 2,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
};