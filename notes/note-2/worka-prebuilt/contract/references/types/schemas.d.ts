import { z } from '@dsh-workbench/runtime';
export declare const emptyInputSchema: z.ZodObject<{}, z.core.$strip>;
export declare const delegationInputSchema: z.ZodObject<{
    delegationId: z.ZodString;
}, z.core.$strip>;
export declare const workTypeSchema: z.ZodEnum<{
    "code-repair": "code-repair";
    "data-permission": "data-permission";
    investigation: "investigation";
}>;
export declare const inspectionOriginSchema: z.ZodObject<{
    kind: z.ZodLiteral<"inspection">;
    label: z.ZodString;
    noteId: z.ZodString;
    problemId: z.ZodString;
    evidenceVersion: z.ZodString;
}, z.core.$strip>;
export declare const evidenceSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    kind: z.ZodEnum<{
        commit: "commit";
        file: "file";
        record: "record";
        text: "text";
        url: "url";
    }>;
    summary: z.ZodString;
    ref: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const operationSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    repository: z.ZodString;
    targetRef: z.ZodString;
    expectedBase: z.ZodString;
    head: z.ZodString;
    kind: z.ZodLiteral<"git-merge">;
    worktree: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    repository: z.ZodString;
    targetRef: z.ZodString;
    expectedBase: z.ZodString;
    head: z.ZodString;
    kind: z.ZodLiteral<"pr-merge">;
    url: z.ZodString;
}, z.core.$strip>], "kind">;
export declare const proposalSchema: z.ZodObject<{
    id: z.ZodString;
    summary: z.ZodString;
    operations: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        repository: z.ZodString;
        targetRef: z.ZodString;
        expectedBase: z.ZodString;
        head: z.ZodString;
        kind: z.ZodLiteral<"git-merge">;
        worktree: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        repository: z.ZodString;
        targetRef: z.ZodString;
        expectedBase: z.ZodString;
        head: z.ZodString;
        kind: z.ZodLiteral<"pr-merge">;
        url: z.ZodString;
    }, z.core.$strip>], "kind">>;
    evidence: z.ZodArray<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        applied: "applied";
        approved: "approved";
        draft: "draft";
        "pending-approval": "pending-approval";
        rejected: "rejected";
        unknown: "unknown";
    }>>;
}, z.core.$strip>;
export declare const candidateSchema: z.ZodObject<{
    cwd: z.ZodString;
    revision: z.ZodString;
    argv: z.ZodArray<z.ZodString>;
    url: z.ZodString;
    readinessPath: z.ZodOptional<z.ZodString>;
    adapter: z.ZodOptional<z.ZodString>;
    repos: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        repo: z.ZodString;
        commit: z.ZodString;
    }, z.core.$strip>>>;
    options: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
    featureId: z.ZodOptional<z.ZodString>;
    start: z.ZodOptional<z.ZodBoolean>;
    embed: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const candidateInputSchema: z.ZodObject<{
    cwd: z.ZodOptional<z.ZodString>;
    revision: z.ZodOptional<z.ZodString>;
    argv: z.ZodOptional<z.ZodArray<z.ZodString>>;
    url: z.ZodOptional<z.ZodString>;
    readinessPath: z.ZodOptional<z.ZodString>;
    adapter: z.ZodOptional<z.ZodString>;
    repos: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        repo: z.ZodString;
        commit: z.ZodString;
    }, z.core.$strip>>>;
    options: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
    featureId: z.ZodOptional<z.ZodString>;
    start: z.ZodOptional<z.ZodBoolean>;
    embed: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const previewDeliverySchema: z.ZodObject<{
    key: z.ZodString;
    status: z.ZodEnum<{
        delivered: "delivered";
        failed: "failed";
        pending: "pending";
    }>;
    eventKey: z.ZodOptional<z.ZodString>;
    noteId: z.ZodOptional<z.ZodString>;
    requestedAt: z.ZodNumber;
    checkedAt: z.ZodOptional<z.ZodNumber>;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const submitInputSchema: z.ZodObject<{
    origin: z.ZodOptional<z.ZodObject<{
        kind: z.ZodLiteral<"inspection">;
        label: z.ZodString;
        noteId: z.ZodString;
        problemId: z.ZodString;
        evidenceVersion: z.ZodString;
    }, z.core.$strip>>;
    workType: z.ZodOptional<z.ZodEnum<{
        "code-repair": "code-repair";
        "data-permission": "data-permission";
        investigation: "investigation";
    }>>;
    nextAction: z.ZodOptional<z.ZodString>;
    resumePaused: z.ZodOptional<z.ZodBoolean>;
    delegationId: z.ZodOptional<z.ZodString>;
    updateId: z.ZodOptional<z.ZodString>;
    delivery: z.ZodOptional<z.ZodEnum<{
        queue: "queue";
        steer: "steer";
    }>>;
    requirement: z.ZodOptional<z.ZodUnknown>;
    contextOnly: z.ZodOptional<z.ZodBoolean>;
    key: z.ZodOptional<z.ZodString>;
    itemId: z.ZodOptional<z.ZodString>;
    goal: z.ZodOptional<z.ZodString>;
    scope: z.ZodOptional<z.ZodArray<z.ZodString>>;
    cwd: z.ZodOptional<z.ZodString>;
    businessKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const checkpointInputSchema: z.ZodObject<{
    repairTitle: z.ZodOptional<z.ZodString>;
    workType: z.ZodOptional<z.ZodEnum<{
        "code-repair": "code-repair";
        "data-permission": "data-permission";
        investigation: "investigation";
    }>>;
    nextAction: z.ZodOptional<z.ZodString>;
    requirementVersion: z.ZodOptional<z.ZodNumber>;
    delegationId: z.ZodString;
    status: z.ZodOptional<z.ZodEnum<{
        blocked: "blocked";
        cancelled: "cancelled";
        completed: "completed";
        continue: "continue";
        failed: "failed";
        incomplete: "incomplete";
        "needs-input": "needs-input";
        unknown: "unknown";
    }>>;
    remainingWork: z.ZodOptional<z.ZodArray<z.ZodString>>;
    blockers: z.ZodOptional<z.ZodArray<z.ZodString>>;
    replySuggestion: z.ZodOptional<z.ZodString>;
    summary: z.ZodString;
    evidence: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        kind: z.ZodEnum<{
            commit: "commit";
            file: "file";
            record: "record";
            text: "text";
            url: "url";
        }>;
        summary: z.ZodString;
        ref: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    proposals: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        summary: z.ZodString;
        operations: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            repository: z.ZodString;
            targetRef: z.ZodString;
            expectedBase: z.ZodString;
            head: z.ZodString;
            kind: z.ZodLiteral<"git-merge">;
            worktree: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>, z.ZodObject<{
            repository: z.ZodString;
            targetRef: z.ZodString;
            expectedBase: z.ZodString;
            head: z.ZodString;
            kind: z.ZodLiteral<"pr-merge">;
            url: z.ZodString;
        }, z.core.$strip>], "kind">>;
        evidence: z.ZodArray<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<{
            applied: "applied";
            approved: "approved";
            draft: "draft";
            "pending-approval": "pending-approval";
            rejected: "rejected";
            unknown: "unknown";
        }>>;
    }, z.core.$strip>>>;
    proposal: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        summary: z.ZodString;
        operations: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            repository: z.ZodString;
            targetRef: z.ZodString;
            expectedBase: z.ZodString;
            head: z.ZodString;
            kind: z.ZodLiteral<"git-merge">;
            worktree: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>, z.ZodObject<{
            repository: z.ZodString;
            targetRef: z.ZodString;
            expectedBase: z.ZodString;
            head: z.ZodString;
            kind: z.ZodLiteral<"pr-merge">;
            url: z.ZodString;
        }, z.core.$strip>], "kind">>;
        evidence: z.ZodArray<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<{
            applied: "applied";
            approved: "approved";
            draft: "draft";
            "pending-approval": "pending-approval";
            rejected: "rejected";
            unknown: "unknown";
        }>>;
    }, z.core.$strip>>;
    candidate: z.ZodOptional<z.ZodObject<{
        cwd: z.ZodOptional<z.ZodString>;
        revision: z.ZodOptional<z.ZodString>;
        argv: z.ZodOptional<z.ZodArray<z.ZodString>>;
        url: z.ZodOptional<z.ZodString>;
        readinessPath: z.ZodOptional<z.ZodString>;
        adapter: z.ZodOptional<z.ZodString>;
        repos: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            repo: z.ZodString;
            commit: z.ZodString;
        }, z.core.$strip>>>;
        options: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
        featureId: z.ZodOptional<z.ZodString>;
        start: z.ZodOptional<z.ZodBoolean>;
        embed: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const publicDelegationSchema: z.ZodObject<{
    delegationId: z.ZodString;
    sourceKey: z.ZodString;
    requirementVersion: z.ZodNumber;
    handledVersion: z.ZodOptional<z.ZodNumber>;
    updateStatus: z.ZodString;
    status: z.ZodString;
    sessionId: z.ZodOptional<z.ZodString>;
    runId: z.ZodOptional<z.ZodString>;
    requestId: z.ZodOptional<z.ZodString>;
    outcome: z.ZodOptional<z.ZodString>;
    pendingContinuation: z.ZodOptional<z.ZodBoolean>;
    verification: z.ZodOptional<z.ZodBoolean>;
    verificationStarted: z.ZodOptional<z.ZodBoolean>;
    continueRequested: z.ZodOptional<z.ZodBoolean>;
    archived: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const executionResultSchema: z.ZodObject<{
    delegationId: z.ZodString;
    sourceKey: z.ZodString;
    requirementVersion: z.ZodNumber;
    handledVersion: z.ZodOptional<z.ZodNumber>;
    updateStatus: z.ZodString;
    status: z.ZodString;
    sessionId: z.ZodOptional<z.ZodString>;
    runId: z.ZodOptional<z.ZodString>;
    requestId: z.ZodOptional<z.ZodString>;
    outcome: z.ZodOptional<z.ZodString>;
    pendingContinuation: z.ZodOptional<z.ZodBoolean>;
    verification: z.ZodOptional<z.ZodBoolean>;
    verificationStarted: z.ZodOptional<z.ZodBoolean>;
    continueRequested: z.ZodOptional<z.ZodBoolean>;
    archived: z.ZodOptional<z.ZodBoolean>;
    recovery: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const checkpointResultSchema: z.ZodObject<{
    delegationId: z.ZodString;
    sourceKey: z.ZodString;
    requirementVersion: z.ZodNumber;
    handledVersion: z.ZodOptional<z.ZodNumber>;
    updateStatus: z.ZodString;
    status: z.ZodString;
    sessionId: z.ZodOptional<z.ZodString>;
    runId: z.ZodOptional<z.ZodString>;
    requestId: z.ZodOptional<z.ZodString>;
    outcome: z.ZodOptional<z.ZodString>;
    pendingContinuation: z.ZodOptional<z.ZodBoolean>;
    verification: z.ZodOptional<z.ZodBoolean>;
    verificationStarted: z.ZodOptional<z.ZodBoolean>;
    continueRequested: z.ZodOptional<z.ZodBoolean>;
    archived: z.ZodOptional<z.ZodBoolean>;
    recovery: z.ZodOptional<z.ZodString>;
    summary: z.ZodOptional<z.ZodString>;
    evidence: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        kind: z.ZodEnum<{
            commit: "commit";
            file: "file";
            record: "record";
            text: "text";
            url: "url";
        }>;
        summary: z.ZodString;
        ref: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    proposals: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        summary: z.ZodString;
        operations: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            repository: z.ZodString;
            targetRef: z.ZodString;
            expectedBase: z.ZodString;
            head: z.ZodString;
            kind: z.ZodLiteral<"git-merge">;
            worktree: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>, z.ZodObject<{
            repository: z.ZodString;
            targetRef: z.ZodString;
            expectedBase: z.ZodString;
            head: z.ZodString;
            kind: z.ZodLiteral<"pr-merge">;
            url: z.ZodString;
        }, z.core.$strip>], "kind">>;
        evidence: z.ZodArray<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<{
            applied: "applied";
            approved: "approved";
            draft: "draft";
            "pending-approval": "pending-approval";
            rejected: "rejected";
            unknown: "unknown";
        }>>;
    }, z.core.$strip>>>;
    candidate: z.ZodOptional<z.ZodObject<{
        cwd: z.ZodString;
        revision: z.ZodString;
        argv: z.ZodArray<z.ZodString>;
        url: z.ZodString;
        readinessPath: z.ZodOptional<z.ZodString>;
        adapter: z.ZodOptional<z.ZodString>;
        repos: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            repo: z.ZodString;
            commit: z.ZodString;
        }, z.core.$strip>>>;
        options: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
        featureId: z.ZodOptional<z.ZodString>;
        start: z.ZodOptional<z.ZodBoolean>;
        embed: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    preview: z.ZodOptional<z.ZodObject<{
        key: z.ZodString;
        status: z.ZodEnum<{
            delivered: "delivered";
            failed: "failed";
            pending: "pending";
        }>;
        eventKey: z.ZodOptional<z.ZodString>;
        noteId: z.ZodOptional<z.ZodString>;
        requestedAt: z.ZodNumber;
        checkedAt: z.ZodOptional<z.ZodNumber>;
        error: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const manualResultSchema: z.ZodUnion<readonly [z.ZodObject<{
    count: z.ZodNumber;
    contextOnly: z.ZodLiteral<true>;
}, z.core.$strip>, z.ZodObject<{
    delegationId: z.ZodOptional<z.ZodString>;
    sourceKey: z.ZodOptional<z.ZodString>;
    requirementVersion: z.ZodOptional<z.ZodNumber>;
    handledVersion: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    updateStatus: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    runId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    requestId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    outcome: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    pendingContinuation: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    verification: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    verificationStarted: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    continueRequested: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    archived: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    recovery: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    count: z.ZodNumber;
    delegations: z.ZodArray<z.ZodObject<{
        delegationId: z.ZodString;
        sourceKey: z.ZodString;
        requirementVersion: z.ZodNumber;
        handledVersion: z.ZodOptional<z.ZodNumber>;
        updateStatus: z.ZodString;
        status: z.ZodString;
        sessionId: z.ZodOptional<z.ZodString>;
        runId: z.ZodOptional<z.ZodString>;
        requestId: z.ZodOptional<z.ZodString>;
        outcome: z.ZodOptional<z.ZodString>;
        pendingContinuation: z.ZodOptional<z.ZodBoolean>;
        verification: z.ZodOptional<z.ZodBoolean>;
        verificationStarted: z.ZodOptional<z.ZodBoolean>;
        continueRequested: z.ZodOptional<z.ZodBoolean>;
        archived: z.ZodOptional<z.ZodBoolean>;
        recovery: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    desk: z.ZodOptional<z.ZodObject<{
        noteId: z.ZodString;
        stateRef: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>]>;
export declare const requirementInputSchema: z.ZodObject<{
    source: z.ZodObject<{
        noteId: z.ZodString;
        objectId: z.ZodString;
        revision: z.ZodString;
        value: z.ZodUnknown;
    }, z.core.$strip>;
    previousSourceRef: z.ZodOptional<z.ZodObject<{
        noteId: z.ZodString;
        objectId: z.ZodString;
    }, z.core.$strip>>;
    updateId: z.ZodString;
    delegationId: z.ZodOptional<z.ZodString>;
    goal: z.ZodString;
    scope: z.ZodOptional<z.ZodArray<z.ZodString>>;
    cwd: z.ZodOptional<z.ZodString>;
    delivery: z.ZodOptional<z.ZodEnum<{
        queue: "queue";
        steer: "steer";
    }>>;
}, z.core.$strip>;
export declare const previewFeedbackInputSchema: z.ZodObject<{
    id: z.ZodString;
    delegationId: z.ZodString;
    sourceNoteId: z.ZodString;
    originNoteId: z.ZodString;
    status: z.ZodEnum<{
        failed: "failed";
        passed: "passed";
        unchecked: "unchecked";
    }>;
    summary: z.ZodString;
    candidateKey: z.ZodString;
    revision: z.ZodString;
    surface: z.ZodString;
    runId: z.ZodString;
    diagnostics: z.ZodOptional<z.ZodString>;
    repairable: z.ZodOptional<z.ZodString>;
    autoRepair: z.ZodOptional<z.ZodBoolean>;
    commits: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const previewFeedbackResultSchema: z.ZodObject<{
    received: z.ZodBoolean;
    handling: z.ZodString;
    summary: z.ZodOptional<z.ZodString>;
    delegationId: z.ZodString;
    sessionId: z.ZodOptional<z.ZodString>;
    duplicate: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const requirementSchema: z.ZodObject<{
    id: z.ZodString;
    goal: z.ZodString;
    scope: z.ZodArray<z.ZodString>;
    sourceRef: z.ZodObject<{
        noteId: z.ZodString;
        objectId: z.ZodString;
    }, z.core.$strip>;
    source: z.ZodUnknown;
    history: z.ZodArray<z.ZodObject<{
        goal: z.ZodString;
        scope: z.ZodArray<z.ZodString>;
        source: z.ZodOptional<z.ZodUnknown>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const prepareInputSchema: z.ZodObject<{
    noteId: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    cwd: z.ZodOptional<z.ZodString>;
    delegationId: z.ZodOptional<z.ZodString>;
    delegationStateRef: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
