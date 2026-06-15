import { ExploreDataStore } from "./ExploreDataStore";
import { WorkflowSolution } from "./WorkflowTypes";

jest.mock("mobx-persist-store", () => ({
    makePersistable: jest.fn().mockResolvedValue(undefined),
}));

const G0 = "Comet->PeptideProphet->ProteinProphet->protXml2IdList->gProfiler";
const G1 = "XTandem->PeptideProphet->ProteinProphet->protXml2IdList->gProfiler";

function makeSolution(descriptive_name: string): WorkflowSolution {
    return {
        run_id: "run1",
        workflow_length: 5,
        workflow_name: "candidate_workflow_1",
        descriptive_name,
        description: "",
        cwl_name: "candidate_workflow_1.cwl",
        figure_name: "candidate_workflow_1",
        benchmark_file: "candidate_workflow_1.json",
        isSelected: false,
        image: undefined,
        benchmarkData: undefined,
    };
}

function mockFetchWith(solutions: WorkflowSolution[]) {
    global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => solutions,
    } as any);
}

function okResponse(solutions: WorkflowSolution[]) {
    return { ok: true, json: async () => solutions } as any;
}

function errorResponse(status: number, statusText: string, body: string) {
    return { ok: false, status, statusText, text: async () => body } as any;
}

function makeStore() {
    const store = new ExploreDataStore();
    jest.spyOn(store, "loadImage").mockImplementation(() => {});
    jest.spyOn(store, "loadBenchmarkData").mockImplementation(() => {});
    return store;
}

// ── Post-Filter ───────────────────────────────────────────────────────────────

test("testPostFilterRemovesMatchingSequence", async () => {
    const store = makeStore();
    mockFetchWith([makeSolution(G0), makeSolution(G1)]);

    await store.runSynthesisWithRawConfig({}, G0);

    expect(store.workflowSolutions).toHaveLength(1);
    expect(store.workflowSolutions[0].descriptive_name).toBe(G1);
});

test("testPostFilterKeepsNonMatchingWorkflows", async () => {
    const store = makeStore();
    mockFetchWith([makeSolution(G0), makeSolution(G1)]);

    await store.runSynthesisWithRawConfig({}, "Sage->SomeOtherSequence");

    expect(store.workflowSolutions).toHaveLength(2);
});

test("testPostFilterNoopWithoutExcludeParam", async () => {
    const store = makeStore();
    mockFetchWith([makeSolution(G0), makeSolution(G1)]);

    await store.runSynthesisWithRawConfig({});

    expect(store.workflowSolutions).toHaveLength(2);
});

// ── Retry bei transientem 400 (abgebrochener edam.owl-Download) ─────────────────

// Macht den Retry-Delay synchron, damit die Tests nicht real warten muessen.
function stubRetryDelay() {
    return jest.spyOn(global, "setTimeout").mockImplementation(((cb: () => void) => {
        cb();
        return 0 as unknown as NodeJS.Timeout;
    }) as any);
}

test("testRetryRecoversFromTransient400", async () => {
    const timer = stubRetryDelay();
    const store = makeStore();
    global.fetch = jest.fn()
        .mockResolvedValueOnce(errorResponse(400, "Bad Request", "invalid ontology format"))
        .mockResolvedValueOnce(okResponse([makeSolution(G0), makeSolution(G1)]));

    await store.runSynthesisWithRawConfig({});

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(store.workflowSolutions).toHaveLength(2);
    expect(store.generationError).toBe("");
    timer.mockRestore();
});

test("testRetryExhaustedSurfacesResponseBody", async () => {
    const timer = stubRetryDelay();
    const store = makeStore();
    global.fetch = jest.fn()
        .mockResolvedValue(errorResponse(400, "Bad Request", "invalid ontology format"));

    await expect(store.runSynthesisWithRawConfig({})).rejects.toThrow("invalid ontology format");

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(store.generationError).toContain("invalid ontology format");
    expect(store.isGenerating).toBe(false);
    timer.mockRestore();
});
