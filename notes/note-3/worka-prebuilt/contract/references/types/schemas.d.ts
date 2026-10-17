import { z } from '@dsh-workbench/runtime';
export declare const candidateInputSchema: z.ZodObject<{
    key: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    originNoteId: z.ZodOptional<z.ZodString>;
    delegationId: z.ZodOptional<z.ZodString>;
    featureId: z.ZodOptional<z.ZodString>;
    adapter: z.ZodOptional<z.ZodString>;
    repos: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        repo: z.ZodString;
        commit: z.ZodString;
    }, z.core.$strip>>>;
    options: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    cwd: z.ZodOptional<z.ZodString>;
    revision: z.ZodOptional<z.ZodString>;
    argv: z.ZodOptional<z.ZodArray<z.ZodString>>;
    url: z.ZodOptional<z.ZodString>;
    readinessPath: z.ZodOptional<z.ZodString>;
    embed: z.ZodOptional<z.ZodBoolean>;
    start: z.ZodOptional<z.ZodBoolean>;
    surface: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const candidateSchema: z.ZodObject<{
    key: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    originNoteId: z.ZodOptional<z.ZodString>;
    delegationId: z.ZodOptional<z.ZodString>;
    featureId: z.ZodOptional<z.ZodString>;
    adapter: z.ZodOptional<z.ZodString>;
    repos: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        repo: z.ZodString;
        commit: z.ZodString;
    }, z.core.$strip>>>;
    options: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    cwd: z.ZodOptional<z.ZodString>;
    revision: z.ZodOptional<z.ZodString>;
    argv: z.ZodOptional<z.ZodArray<z.ZodString>>;
    url: z.ZodOptional<z.ZodString>;
    readinessPath: z.ZodOptional<z.ZodString>;
    embed: z.ZodOptional<z.ZodBoolean>;
    receivedAt: z.ZodNumber;
    desired: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodEnum<{
        running: "running";
        stopped: "stopped";
    }>>>;
    surfaces: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        title: z.ZodOptional<z.ZodString>;
        url: z.ZodString;
    }, z.core.$strip>>>;
    status: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        phase: z.ZodEnum<{
            failed: "failed";
            preparing: "preparing";
            queued: "queued";
            ready: "ready";
            starting: "starting";
            stopped: "stopped";
            stopping: "stopping";
            verifying: "verifying";
        }>;
        url: z.ZodOptional<z.ZodString>;
        pass: z.ZodString;
        since: z.ZodNumber;
        updatedAt: z.ZodNumber;
        message: z.ZodOptional<z.ZodString>;
        steps: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            state: z.ZodEnum<{
                completed: "completed";
                failed: "failed";
                pending: "pending";
                running: "running";
                skipped: "skipped";
            }>;
            detail: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
        verified: z.ZodOptional<z.ZodObject<{
            ok: z.ZodBoolean;
            at: z.ZodNumber;
            checks: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                ok: z.ZodBoolean;
                detail: z.ZodOptional<z.ZodString>;
                fix: z.ZodOptional<z.ZodString>;
                owner: z.ZodOptional<z.ZodEnum<{
                    project: "project";
                    user: "user";
                }>>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
        failure: z.ZodOptional<z.ZodObject<{
            message: z.ZodString;
            owner: z.ZodEnum<{
                framework: "framework";
                project: "project";
                user: "user";
            }>;
            step: z.ZodOptional<z.ZodString>;
            log: z.ZodOptional<z.ZodString>;
            attempts: z.ZodNumber;
            handling: z.ZodEnum<{
                agent: "agent";
                "agent-done": "agent-done";
                "awaiting-approval": "awaiting-approval";
                exhausted: "exhausted";
                retrying: "retrying";
                "waiting-user": "waiting-user";
            }>;
            handlingNote: z.ZodOptional<z.ZodString>;
            retryAt: z.ZodOptional<z.ZodNumber>;
            reportId: z.ZodOptional<z.ZodString>;
            session: z.ZodOptional<z.ZodString>;
            delegationId: z.ZodOptional<z.ZodString>;
            at: z.ZodNumber;
        }, z.core.$strip>>;
        source: z.ZodOptional<z.ZodString>;
        logDir: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>;
    repair: z.ZodOptional<z.ZodObject<{
        rounds: z.ZodNumber;
        source: z.ZodString;
        delegationId: z.ZodOptional<z.ZodString>;
        lastFailure: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$loose>;
export declare const feedbackSchema: z.ZodObject<{
    deliveryBlocked: z.ZodOptional<z.ZodString>;
    deliveryAttempt: z.ZodOptional<z.ZodNumber>;
    id: z.ZodString;
    delegationId: z.ZodOptional<z.ZodString>;
    standalone: z.ZodOptional<z.ZodBoolean>;
    autoRepair: z.ZodOptional<z.ZodBoolean>;
    kind: z.ZodLiteral<"delivery-feedback">;
    status: z.ZodEnum<{
        failed: "failed";
        passed: "passed";
        unchecked: "unchecked";
    }>;
    subject: z.ZodString;
    summary: z.ZodString;
    candidateKey: z.ZodString;
    revision: z.ZodString;
    commits: z.ZodOptional<z.ZodArray<z.ZodString>>;
    surface: z.ZodString;
    runId: z.ZodString;
    diagnostics: z.ZodString;
    repairable: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    project: z.ZodOptional<z.ZodString>;
}, z.core.$loose>;
export declare const dataSchema: z.ZodObject<{
    title: z.ZodString;
    candidates: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        title: z.ZodOptional<z.ZodString>;
        originNoteId: z.ZodOptional<z.ZodString>;
        delegationId: z.ZodOptional<z.ZodString>;
        featureId: z.ZodOptional<z.ZodString>;
        adapter: z.ZodOptional<z.ZodString>;
        repos: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            repo: z.ZodString;
            commit: z.ZodString;
        }, z.core.$strip>>>;
        options: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        cwd: z.ZodOptional<z.ZodString>;
        revision: z.ZodOptional<z.ZodString>;
        argv: z.ZodOptional<z.ZodArray<z.ZodString>>;
        url: z.ZodOptional<z.ZodString>;
        readinessPath: z.ZodOptional<z.ZodString>;
        embed: z.ZodOptional<z.ZodBoolean>;
        receivedAt: z.ZodNumber;
        desired: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodEnum<{
            running: "running";
            stopped: "stopped";
        }>>>;
        surfaces: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            title: z.ZodOptional<z.ZodString>;
            url: z.ZodString;
        }, z.core.$strip>>>;
        status: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            phase: z.ZodEnum<{
                failed: "failed";
                preparing: "preparing";
                queued: "queued";
                ready: "ready";
                starting: "starting";
                stopped: "stopped";
                stopping: "stopping";
                verifying: "verifying";
            }>;
            url: z.ZodOptional<z.ZodString>;
            pass: z.ZodString;
            since: z.ZodNumber;
            updatedAt: z.ZodNumber;
            message: z.ZodOptional<z.ZodString>;
            steps: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                label: z.ZodString;
                state: z.ZodEnum<{
                    completed: "completed";
                    failed: "failed";
                    pending: "pending";
                    running: "running";
                    skipped: "skipped";
                }>;
                detail: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>>;
            verified: z.ZodOptional<z.ZodObject<{
                ok: z.ZodBoolean;
                at: z.ZodNumber;
                checks: z.ZodArray<z.ZodObject<{
                    name: z.ZodString;
                    ok: z.ZodBoolean;
                    detail: z.ZodOptional<z.ZodString>;
                    fix: z.ZodOptional<z.ZodString>;
                    owner: z.ZodOptional<z.ZodEnum<{
                        project: "project";
                        user: "user";
                    }>>;
                }, z.core.$strip>>;
            }, z.core.$strip>>;
            failure: z.ZodOptional<z.ZodObject<{
                message: z.ZodString;
                owner: z.ZodEnum<{
                    framework: "framework";
                    project: "project";
                    user: "user";
                }>;
                step: z.ZodOptional<z.ZodString>;
                log: z.ZodOptional<z.ZodString>;
                attempts: z.ZodNumber;
                handling: z.ZodEnum<{
                    agent: "agent";
                    "agent-done": "agent-done";
                    "awaiting-approval": "awaiting-approval";
                    exhausted: "exhausted";
                    retrying: "retrying";
                    "waiting-user": "waiting-user";
                }>;
                handlingNote: z.ZodOptional<z.ZodString>;
                retryAt: z.ZodOptional<z.ZodNumber>;
                reportId: z.ZodOptional<z.ZodString>;
                session: z.ZodOptional<z.ZodString>;
                delegationId: z.ZodOptional<z.ZodString>;
                at: z.ZodNumber;
            }, z.core.$strip>>;
            source: z.ZodOptional<z.ZodString>;
            logDir: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
        repair: z.ZodOptional<z.ZodObject<{
            rounds: z.ZodNumber;
            source: z.ZodString;
            delegationId: z.ZodOptional<z.ZodString>;
            lastFailure: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$loose>>;
    archivedCandidates: z.ZodOptional<z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        title: z.ZodOptional<z.ZodString>;
        originNoteId: z.ZodOptional<z.ZodString>;
        delegationId: z.ZodOptional<z.ZodString>;
        featureId: z.ZodOptional<z.ZodString>;
        adapter: z.ZodOptional<z.ZodString>;
        repos: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            repo: z.ZodString;
            commit: z.ZodString;
        }, z.core.$strip>>>;
        options: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        cwd: z.ZodOptional<z.ZodString>;
        revision: z.ZodOptional<z.ZodString>;
        argv: z.ZodOptional<z.ZodArray<z.ZodString>>;
        url: z.ZodOptional<z.ZodString>;
        readinessPath: z.ZodOptional<z.ZodString>;
        embed: z.ZodOptional<z.ZodBoolean>;
        receivedAt: z.ZodNumber;
        desired: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodEnum<{
            running: "running";
            stopped: "stopped";
        }>>>;
        surfaces: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            title: z.ZodOptional<z.ZodString>;
            url: z.ZodString;
        }, z.core.$strip>>>;
        status: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            phase: z.ZodEnum<{
                failed: "failed";
                preparing: "preparing";
                queued: "queued";
                ready: "ready";
                starting: "starting";
                stopped: "stopped";
                stopping: "stopping";
                verifying: "verifying";
            }>;
            url: z.ZodOptional<z.ZodString>;
            pass: z.ZodString;
            since: z.ZodNumber;
            updatedAt: z.ZodNumber;
            message: z.ZodOptional<z.ZodString>;
            steps: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                label: z.ZodString;
                state: z.ZodEnum<{
                    completed: "completed";
                    failed: "failed";
                    pending: "pending";
                    running: "running";
                    skipped: "skipped";
                }>;
                detail: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>>;
            verified: z.ZodOptional<z.ZodObject<{
                ok: z.ZodBoolean;
                at: z.ZodNumber;
                checks: z.ZodArray<z.ZodObject<{
                    name: z.ZodString;
                    ok: z.ZodBoolean;
                    detail: z.ZodOptional<z.ZodString>;
                    fix: z.ZodOptional<z.ZodString>;
                    owner: z.ZodOptional<z.ZodEnum<{
                        project: "project";
                        user: "user";
                    }>>;
                }, z.core.$strip>>;
            }, z.core.$strip>>;
            failure: z.ZodOptional<z.ZodObject<{
                message: z.ZodString;
                owner: z.ZodEnum<{
                    framework: "framework";
                    project: "project";
                    user: "user";
                }>;
                step: z.ZodOptional<z.ZodString>;
                log: z.ZodOptional<z.ZodString>;
                attempts: z.ZodNumber;
                handling: z.ZodEnum<{
                    agent: "agent";
                    "agent-done": "agent-done";
                    "awaiting-approval": "awaiting-approval";
                    exhausted: "exhausted";
                    retrying: "retrying";
                    "waiting-user": "waiting-user";
                }>;
                handlingNote: z.ZodOptional<z.ZodString>;
                retryAt: z.ZodOptional<z.ZodNumber>;
                reportId: z.ZodOptional<z.ZodString>;
                session: z.ZodOptional<z.ZodString>;
                delegationId: z.ZodOptional<z.ZodString>;
                at: z.ZodNumber;
            }, z.core.$strip>>;
            source: z.ZodOptional<z.ZodString>;
            logDir: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
        repair: z.ZodOptional<z.ZodObject<{
            rounds: z.ZodNumber;
            source: z.ZodString;
            delegationId: z.ZodOptional<z.ZodString>;
            lastFailure: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$loose>>>;
    attached: z.ZodArray<z.ZodString>;
    outbox: z.ZodOptional<z.ZodArray<z.ZodObject<{
        deliveryBlocked: z.ZodOptional<z.ZodString>;
        deliveryAttempt: z.ZodOptional<z.ZodNumber>;
        id: z.ZodString;
        delegationId: z.ZodOptional<z.ZodString>;
        standalone: z.ZodOptional<z.ZodBoolean>;
        autoRepair: z.ZodOptional<z.ZodBoolean>;
        kind: z.ZodLiteral<"delivery-feedback">;
        status: z.ZodEnum<{
            failed: "failed";
            passed: "passed";
            unchecked: "unchecked";
        }>;
        subject: z.ZodString;
        summary: z.ZodString;
        candidateKey: z.ZodString;
        revision: z.ZodString;
        commits: z.ZodOptional<z.ZodArray<z.ZodString>>;
        surface: z.ZodString;
        runId: z.ZodString;
        diagnostics: z.ZodString;
        repairable: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
        project: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>;
    feedbackError: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>;
export declare const renameInputSchema: z.ZodObject<{
    key: z.ZodOptional<z.ZodString>;
    originNoteId: z.ZodOptional<z.ZodString>;
    delegationId: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
}, z.core.$strip>;
export declare const receiveInputSchema: z.ZodUnion<readonly [z.ZodObject<{
    key: z.ZodOptional<z.ZodString>;
    originNoteId: z.ZodOptional<z.ZodString>;
    delegationId: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    operation: z.ZodLiteral<"rename">;
}, z.core.$strip>, z.ZodObject<{
    operation: z.ZodEnum<{
        restart: "restart";
        stop: "stop";
    }>;
    key: z.ZodString;
    originNoteId: z.ZodString;
    delegationId: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    key: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    originNoteId: z.ZodOptional<z.ZodString>;
    delegationId: z.ZodOptional<z.ZodString>;
    featureId: z.ZodOptional<z.ZodString>;
    adapter: z.ZodOptional<z.ZodString>;
    repos: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        repo: z.ZodString;
        commit: z.ZodString;
    }, z.core.$strip>>>;
    options: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    cwd: z.ZodOptional<z.ZodString>;
    revision: z.ZodOptional<z.ZodString>;
    argv: z.ZodOptional<z.ZodArray<z.ZodString>>;
    url: z.ZodOptional<z.ZodString>;
    readinessPath: z.ZodOptional<z.ZodString>;
    embed: z.ZodOptional<z.ZodBoolean>;
    start: z.ZodOptional<z.ZodBoolean>;
    surface: z.ZodOptional<z.ZodString>;
    operation: z.ZodOptional<z.ZodNever>;
}, z.core.$strip>]>;
