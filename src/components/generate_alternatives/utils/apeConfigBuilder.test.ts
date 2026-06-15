import { generateApeConfig } from "./apeConfigBuilder";
import { ParsedWorkflow } from "../types";

const WORKFLOW: ParsedWorkflow = {
    nodes: [
        { id: "input_1", label: "input_1", type: "input" },
        { id: "ToolA_01", label: "ToolA", type: "tool" },
        { id: "ToolB_01", label: "ToolB", type: "tool" },
        { id: "ToolC_01", label: "ToolC", type: "tool" },
        { id: "output_1", label: "output_1", type: "output" },
    ],
    edges: [
        { source: "input_1", target: "ToolA_01" },
        { source: "ToolA_01", target: "ToolB_01" },
        { source: "ToolB_01", target: "ToolC_01" },
        { source: "ToolC_01", target: "output_1" },
    ],
    inputs: [{ id: "http://edamontology.org/format_3728", label: "LocARNA PP" }],
    outputs: [{ id: "http://edamontology.org/format_3244", label: "mzXML" }],
};

const DEFAULT_PARAMS = { timeout: 120, minLength: 3, maxLength: 8, solutions: 10 };
const NO_EDGE_STATUS: Record<string, string> = {};
const NO_EDGE_ENDPOINTS: Record<string, { source: string; target: string }> = {};

function parse(
    stepStatus: Record<string, string>,
    edgeStatus = NO_EDGE_STATUS,
    edgeEndpoints = NO_EDGE_ENDPOINTS
) {
    return JSON.parse(generateApeConfig(
        stepStatus as any,
        edgeStatus,
        edgeEndpoints,
        DEFAULT_PARAMS,
        WORKFLOW
    ));
}

// ── Keep (use_m) ─────────────────────────────────────────────────────────────

test("testKeepGeneratesUseMConstraint", () => {
    const config = parse({ ToolA_01: "Keep" });
    const c = config.constraints.find((x: any) => x.constraintid === "use_m");
    expect(c).toBeDefined();
    expect(c.parameters[0].operation_0004).toContain("ToolA");
});

// ── Ban (not_use_m) ───────────────────────────────────────────────────────────

test("testBanGeneratesNotUseMConstraint", () => {
    const config = parse({ ToolB_01: "Ban" });
    const c = config.constraints.find((x: any) => x.constraintid === "not_use_m");
    expect(c).toBeDefined();
    expect(c.parameters[0].operation_0004).toContain("ToolB");
});

// ── Vary (no constraint) ──────────────────────────────────────────────────────

test("testVaryProducesNoConstraint", () => {
    const config = parse({ ToolA_01: "Vary" });
    expect(config.constraints).toHaveLength(0);
});

// ── Chain (connected_op) ──────────────────────────────────────────────────────

test("testChainGeneratesConnectedOp", () => {
    const edgeId = "e-ToolA_01-ToolB_01";
    const config = parse(
        {},
        { [edgeId]: "chain" },
        { [edgeId]: { source: "ToolA_01", target: "ToolB_01" } }
    );
    const c = config.constraints.find((x: any) => x.constraintid === "connected_op");
    expect(c).toBeDefined();
    expect(c.parameters[0].operation_0004).toContain("ToolA");
    expect(c.parameters[1].operation_0004).toContain("ToolB");
});

// ── Break (not_connected_op) ──────────────────────────────────────────────────

test("testBreakGeneratesNotConnectedOp", () => {
    const edgeId = "e-ToolB_01-ToolC_01";
    const config = parse(
        {},
        { [edgeId]: "break" },
        { [edgeId]: { source: "ToolB_01", target: "ToolC_01" } }
    );
    const c = config.constraints.find((x: any) => x.constraintid === "not_connected_op");
    expect(c).toBeDefined();
    expect(c.parameters[0].operation_0004).toContain("ToolB");
    expect(c.parameters[1].operation_0004).toContain("ToolC");
});

// ── I/O-Mapping ───────────────────────────────────────────────────────────────

test("testInputsMappedFromWorkflow", () => {
    const config = parse({});
    expect(config.inputs).toHaveLength(1);
    expect(config.inputs[0]["http://edamontology.org/format_1915"])
        .toContain("http://edamontology.org/format_3728");
});

test("testOutputsMappedFromWorkflow", () => {
    const config = parse({});
    expect(config.outputs).toHaveLength(1);
    expect(config.outputs[0]["http://edamontology.org/format_1915"])
        .toContain("http://edamontology.org/format_3244");
});

// ── Kombination ───────────────────────────────────────────────────────────────

test("testMultipleConstraintsCombine", () => {
    const edgeId = "e-ToolA_01-ToolB_01";
    const config = parse(
        { ToolA_01: "Keep", ToolC_01: "Ban" },
        { [edgeId]: "chain" },
        { [edgeId]: { source: "ToolA_01", target: "ToolB_01" } }
    );
    expect(config.constraints).toHaveLength(3);
    const ids = config.constraints.map((c: any) => c.constraintid);
    expect(ids).toContain("use_m");
    expect(ids).toContain("not_use_m");
    expect(ids).toContain("connected_op");
});
