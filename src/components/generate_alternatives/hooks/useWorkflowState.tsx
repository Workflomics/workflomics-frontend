import { useState, useEffect, useCallback } from "react";
import { useNodesState, useEdgesState, MarkerType } from "reactflow";
import { getLayoutedElements } from "../utils/layoutHelper";
import { NodeStatus, ParsedWorkflow } from "../types";

const APE_PARSE_URL = "/ape/alternatives/parse";

export const useWorkflowState = () => {
    const [parsedWorkflow, setParsedWorkflow] = useState<ParsedWorkflow | null>(null);
    const [workflowKey, setWorkflowKey] = useState(0);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [stepStatus, setStepStatus] = useState<Record<string, NodeStatus>>({});
    const [edgeStatus, setEdgeStatus] = useState<Record<string, string>>({});
    const [edgeEndpoints, setEdgeEndpoints] = useState<Record<string, { source: string; target: string }>>({});
    const [configParams, setConfigParams] = useState({
        timeout: 120,
        minLength: 3,
        maxLength: 8,
        solutions: 10,
    });

    // Graph neu aufbauen und alle Tools auf Keep initialisieren, sobald ein Workflow geladen wird
    useEffect(() => {
        if (!parsedWorkflow) return;
        const nodeTypeById = Object.fromEntries(parsedWorkflow.nodes.map((n) => [n.id, n.type ?? "tool"]));

        const rfNodes = parsedWorkflow.nodes.map((node) => ({
            id: node.id,
            type: "custom",
            data: { label: node.label, type: node.type ?? "tool", status: "Keep" as NodeStatus },
            position: { x: 0, y: 0 },
        }));

        const rfEdges = parsedWorkflow.edges.map((edge) => ({
            id: `e-${edge.source}-${edge.target}`,
            source: edge.source,
            target: edge.target,
            type: "custom",
            // Nur Tool→Tool-Kanten sind per Klick mit Constraints belegbar
            data: {
                status: null,
                isInteractable: nodeTypeById[edge.source] === "tool" && nodeTypeById[edge.target] === "tool",
                source: edge.source,
                target: edge.target,
            },
            markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
            style: { stroke: "#94a3b8", strokeWidth: 2 },
        }));

        const layouted = getLayoutedElements(rfNodes, rfEdges);
        setNodes(layouted.nodes);
        setEdges(layouted.edges);

        // Nur Tool-Nodes bekommen einen initialen Keep-Status
        const initialStatus: Record<string, NodeStatus> = {};
        parsedWorkflow.nodes
            .filter((n) => (n.type ?? "tool") === "tool")
            .forEach(({ id }) => { initialStatus[id] = "Keep"; });
        setStepStatus(initialStatus);
        setEdgeStatus({});

        // source/target pro Edge-ID für robustes Label-Lookup ohne ID-String-Parsing
        const endpoints: Record<string, { source: string; target: string }> = {};
        parsedWorkflow.edges.forEach(({ source, target }) => {
            endpoints[`e-${source}-${target}`] = { source, target };
        });
        setEdgeEndpoints(endpoints);
    }, [parsedWorkflow, setNodes, setEdges]);

    // Visuelles Update bei Status-Änderungen
    useEffect(() => {
        setNodes((nds) =>
            nds.map((node) => {
                if ((node.data.type ?? "tool") !== "tool") return node;
                const currentStatus = stepStatus[node.id] || "Keep";
                if (node.data.status === currentStatus) return node;
                return { ...node, data: { ...node.data, status: currentStatus } };
            })
        );

        setEdges((eds) =>
            eds.map((edge) => {
                const status = edgeStatus[edge.id];
                let stroke = "#94a3b8";
                let strokeDasharray = "0";
                let zIndex = 0;

                if (status === "chain") {
                    stroke = "#0d9488";
                    zIndex = 10;
                } else if (status === "break") {
                    stroke = "#e11d48";
                    strokeDasharray = "5,5";
                    zIndex = 10;
                }

                return {
                    ...edge,
                    zIndex,
                    data: { ...edge.data, status },
                    style: { ...edge.style, stroke, strokeWidth: status ? 3 : 2, strokeDasharray },
                    markerEnd: { type: MarkerType.ArrowClosed, color: stroke },
                };
            })
        );
    }, [stepStatus, edgeStatus, setNodes, setEdges]);

    // Linksklick: Keep → Vary → Ban → Keep
    const handleNodeClick = useCallback((event: React.MouseEvent, node: any) => {
        event.preventDefault();
        if ((node.data.type ?? "tool") !== "tool") return;
        setStepStatus((prev) => {
            const current = prev[node.id] ?? "Keep";
            const next: NodeStatus = current === "Keep" ? "Vary" : current === "Vary" ? "Ban" : "Keep";
            return { ...prev, [node.id]: next };
        });
    }, []);

    // Rechtsklick: Keep → Ban → Vary → Keep
    const handleNodeContextMenu = useCallback((event: React.MouseEvent, node: any) => {
        event.preventDefault();
        if ((node.data.type ?? "tool") !== "tool") return;
        setStepStatus((prev) => {
            const current = prev[node.id] ?? "Keep";
            const next: NodeStatus = current === "Keep" ? "Ban" : current === "Ban" ? "Vary" : "Keep";
            return { ...prev, [node.id]: next };
        });
    }, []);

    const handleEdgeClick = useCallback((event: React.MouseEvent, edge: any) => {
        if (!edge.data?.isInteractable) return;
        setEdgeStatus((prev) => {
            const next = { ...prev };
            const current = prev[edge.id];
            if (!current) next[edge.id] = "chain";
            else if (current === "chain") next[edge.id] = "break";
            else delete next[edge.id];
            return next;
        });
    }, []);

    const handleConfigChange = (key: string, value: string | number) => {
        setConfigParams((prev) => ({ ...prev, [key]: value }));
    };

    const uploadCwlFile = useCallback(async (file: File) => {
        setIsLoading(true);
        setUploadError(null);
        const formData = new FormData();
        formData.append("cwl_file", file);
        try {
            const response = await fetch(APE_PARSE_URL, { method: "POST", body: formData });
            if (!response.ok) {
                const msg = await response.text();
                throw new Error(msg || `Server error ${response.status}`);
            }
            const data: ParsedWorkflow = await response.json();
            setParsedWorkflow(data);
            setWorkflowKey((k) => k + 1);
            setUploadedFileName(file.name);
        } catch (err: any) {
            setUploadError(err.message ?? "Upload failed");
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        handleNodeClick,
        handleNodeContextMenu,
        handleEdgeClick,
        stepStatus,
        edgeStatus,
        configParams,
        handleConfigChange,
        parsedWorkflow,
        workflowKey,
        edgeEndpoints,
        uploadCwlFile,
        uploadedFileName,
        isLoading,
        uploadError,
    };
};
