import { NodeStatus, ParsedWorkflow } from "../types";

export const generateApeConfig = (
    stepStatus: Record<string, NodeStatus>,
    edgeStatus: Record<string, string>,
    edgeEndpoints: Record<string, { source: string; target: string }>,
    configParams: { timeout: number; minLength: number; maxLength: number; solutions: number },
    parsedWorkflow: ParsedWorkflow
) => {
    const config: any = {
        ontology_path: "https://raw.githubusercontent.com/Workflomics/tools-and-domains/main/domains/edam.owl",
        ontologyPrefixIRI: "http://edamontology.org/",
        toolsTaxonomyRoot: "operation_0004",
        dataDimensionsTaxonomyRoots: ["data_0006", "format_1915"],
        tool_annotations_path: "https://raw.githubusercontent.com/Workflomics/tools-and-domains/main/domains/proteomics/tools.json",
        constraints_path: "https://raw.githubusercontent.com/Workflomics/tools-and-domains/main/domains/proteomics/constraints.json",
        strict_tool_annotations: "true",
        timeout_sec: parseInt(configParams.timeout as any),
        solution_length: {
            min: parseInt(configParams.minLength as any),
            max: parseInt(configParams.maxLength as any),
        },
        solutions: parseInt(configParams.solutions as any),
        number_of_execution_scripts: parseInt(configParams.solutions as any),
        number_of_generated_graphs: parseInt(configParams.solutions as any),
        debug_mode: "false",
        use_workflow_input: "all",
        use_all_generated_data: "one",
        tool_seq_repeat: "false",
        inputs: [],
        outputs: [],
        constraints: [],
    };

    // 1. I/O aus dem geparsten Workflow — format-URI wird der format_1915-Dimension zugeordnet
    parsedWorkflow.inputs.forEach((input) => {
        config.inputs.push({
            "http://edamontology.org/data_0006": ["http://edamontology.org/data_0006"],
            "http://edamontology.org/format_1915": [input.id],
        });
    });
    parsedWorkflow.outputs.forEach((output) => {
        config.outputs.push({
            "http://edamontology.org/data_0006": ["http://edamontology.org/data_0006"],
            "http://edamontology.org/format_1915": [output.id],
        });
    });

    // 2. Knoten-Constraints (Kap. 4.3): Keep → use_m, Ban → not_use_m, Vary → kein Constraint
    const nodeLabelById = Object.fromEntries(parsedWorkflow.nodes.map((n) => [n.id, n.label]));
    Object.entries(stepStatus).forEach(([id, status]) => {
        const label = nodeLabelById[id];
        if (!label) return;
        if (status === "Keep") {
            config.constraints.push({ constraintid: "use_m", parameters: [{ operation_0004: [label] }] });
        } else if (status === "Ban") {
            config.constraints.push({ constraintid: "not_use_m", parameters: [{ operation_0004: [label] }] });
        }
        // Vary: APE hat freie Wahl, kein Constraint
    });

    // 3. Kanten-Constraints (Chain, Break)
    Object.entries(edgeStatus).forEach(([edgeId, status]) => {
        const ep = edgeEndpoints[edgeId];
        if (!ep) return;
        const sourceLabel = nodeLabelById[ep.source];
        const targetLabel = nodeLabelById[ep.target];
        if (!sourceLabel || !targetLabel) return;
        if (status === "chain") {
            config.constraints.push({
                constraintid: "connected_op",
                parameters: [{ operation_0004: [sourceLabel] }, { operation_0004: [targetLabel] }],
            });
        } else if (status === "break") {
            config.constraints.push({
                constraintid: "not_connected_op",
                parameters: [{ operation_0004: [sourceLabel] }, { operation_0004: [targetLabel] }],
            });
        }
    });

    return JSON.stringify(config, null, 2);
};
