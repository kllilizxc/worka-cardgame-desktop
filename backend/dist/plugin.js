// plugin.ts
import { isNoteController } from "@realiz3r/worka/host";
import { basename as basename2, dirname as dirname7, resolve as resolve7 } from "node:path";
import { fileURLToPath } from "node:url";

// ../../worka-authoring-desktop-latest-20261017/node_modules/.bun/zod@4.6.1/node_modules/zod/v4/core/util.js
function getEnumValues(entries) {
  const numericValues = Object.values(entries).filter((v) => typeof v === "number");
  const values = Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
  return values;
}
function joinValues(array, separator = "|") {
  return array.map((val) => stringifyPrimitive(val)).join(separator);
}
function jsonStringifyReplacer(_, value) {
  if (typeof value === "bigint")
    return value.toString();
  return value;
}

class Cached {
  constructor(getter) {
    this._getter = getter;
    this._value = undefined;
  }
  get value() {
    const getter = this._getter;
    if (getter !== undefined) {
      this._value = getter();
      this._getter = undefined;
    }
    return this._value;
  }
}
function cached(getter) {
  return new Cached(getter);
}
function nullish(input) {
  return input === null || input === undefined;
}
function cleanRegex(source) {
  const start = source.startsWith("^") ? 1 : 0;
  const end = source.endsWith("$") ? source.length - 1 : source.length;
  return source.slice(start, end);
}
function floatSafeRemainder(val, step) {
  const ratio = val / step;
  const roundedRatio = Math.round(ratio);
  const tolerance = 4 * Number.EPSILON * Math.max(Math.abs(ratio), 1);
  if (Math.abs(ratio - roundedRatio) < tolerance)
    return 0;
  return ratio - roundedRatio;
}
var EVALUATING = /* @__PURE__ */ Symbol("evaluating");
function defineLazy(object, key, getter) {
  let value = undefined;
  Object.defineProperty(object, key, {
    get() {
      if (value === EVALUATING) {
        return;
      }
      if (value === undefined) {
        value = EVALUATING;
        value = getter();
      }
      return value;
    },
    set(v) {
      Object.defineProperty(object, key, {
        value: v
      });
    },
    configurable: true
  });
}
function assignProp(target, prop, value) {
  Object.defineProperty(target, prop, {
    value,
    writable: true,
    enumerable: true,
    configurable: true
  });
}
function rawShape(def) {
  const desc = Object.getOwnPropertyDescriptor(def, "shape");
  return desc?.get ? desc.get.raw : desc?.value;
}
function sourceShape(schema) {
  return rawShape(schema._zod.def) ?? schema._zod.def.shape;
}
function deferProp(target, key, getter) {
  Object.defineProperty(target, key, {
    get() {
      const value = getter();
      assignProp(this, key, value);
      return value;
    },
    enumerable: true,
    configurable: true
  });
}
function putProp(target, key, value) {
  if (key in target)
    assignProp(target, key, value);
  else
    target[key] = value;
}
function mirrorShape(target, source, keys, wrap) {
  const raw = sourceShape(source);
  for (const key of keys) {
    const desc = Object.getOwnPropertyDescriptor(raw, key);
    if (!desc.enumerable)
      continue;
    if (desc.get) {
      deferProp(target, key, () => {
        const value = source._zod.def.shape[key];
        return wrap ? wrap(value, key) : value;
      });
    } else
      putProp(target, key, wrap ? wrap(desc.value, key) : desc.value);
  }
}
function mirrorProps(target, source) {
  for (const key of Reflect.ownKeys(source)) {
    const desc = Object.getOwnPropertyDescriptor(source, key);
    if (!desc.enumerable)
      continue;
    if (desc.get)
      deferProp(target, key, () => source[key]);
    else
      putProp(target, key, desc.value);
  }
}
function mergeDefs(...defs) {
  const mergedDescriptors = {};
  for (const def of defs) {
    const descriptors = Object.getOwnPropertyDescriptors(def);
    Object.assign(mergedDescriptors, descriptors);
  }
  return Object.defineProperties({}, mergedDescriptors);
}
function esc(str) {
  return JSON.stringify(str);
}
function slugify(input) {
  return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
var captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
function isObject(data) {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}
var allowsEval = /* @__PURE__ */ cached(() => {
  if (globalConfig.jitless) {
    return false;
  }
  if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) {
    return false;
  }
  try {
    const F = Function;
    new F("");
    return true;
  } catch (_) {
    return false;
  }
});
function isPlainObject(o) {
  if (isObject(o) === false)
    return false;
  const ctor = o.constructor;
  if (ctor === undefined)
    return true;
  if (typeof ctor !== "function")
    return true;
  const prot = ctor.prototype;
  if (isObject(prot) === false)
    return false;
  if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) {
    return false;
  }
  return true;
}
function shallowClone(o) {
  if (isPlainObject(o))
    return { ...o };
  if (Array.isArray(o))
    return [...o];
  if (o instanceof Map)
    return new Map(o);
  if (o instanceof Set)
    return new Set(o);
  return o;
}
var propertyKeyTypes = /* @__PURE__ */ new Set(["string", "number", "symbol"]);
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone(inst, def, params) {
  const cl = new inst._zod.constr(def ?? inst._zod.def);
  if (!def || params?.parent)
    cl._zod.parent = inst;
  return cl;
}
function normalizeParams(_params) {
  const params = _params;
  if (!params)
    return {};
  if (typeof params === "string")
    return { error: () => params };
  if (params?.message !== undefined) {
    if (params?.error !== undefined)
      throw new Error("Cannot specify both `message` and `error` params");
    params.error = params.message;
  }
  delete params.message;
  if (typeof params.error === "string")
    return { ...params, error: () => params.error };
  return params;
}
function stringifyPrimitive(value) {
  if (typeof value === "bigint")
    return value.toString() + "n";
  if (typeof value === "string")
    return `"${value}"`;
  return `${value}`;
}
function optionalKeys(shape) {
  return Object.keys(shape).filter((k) => {
    return shape[k]._zod.optin !== undefined && shape[k]._zod.optout === "optional";
  });
}
var NUMBER_FORMAT_RANGES = /* @__PURE__ */ (() => ({
  safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  int32: [-2147483648, 2147483647],
  uint32: [0, 4294967295],
  float32: [-340282346638528860000000000000000000000, 340282346638528860000000000000000000000],
  float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
}))();
var BIGINT_FORMAT_RANGES = {
  int64: [/* @__PURE__ */ BigInt("-9223372036854775808"), /* @__PURE__ */ BigInt("9223372036854775807")],
  uint64: [/* @__PURE__ */ BigInt(0), /* @__PURE__ */ BigInt("18446744073709551615")]
};
function pick(schema, mask) {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(".pick() cannot be used on object schemas containing refinements");
  }
  const newShape = {};
  mirrorShape(newShape, schema, maskedKeys(schema, mask));
  return clone(schema, mergeDefs(currDef, { shape: newShape, checks: [] }));
}
function maskedKeys(schema, mask) {
  const raw = sourceShape(schema);
  const keys = [];
  for (const key of Reflect.ownKeys(mask)) {
    if (!Object.getOwnPropertyDescriptor(raw, key)?.enumerable) {
      throw new Error(`Unrecognized key: "${String(key)}"`);
    }
    if (mask[key])
      keys.push(key);
  }
  return keys;
}
function omit(schema, mask) {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(".omit() cannot be used on object schemas containing refinements");
  }
  const omitted = new Set(maskedKeys(schema, mask));
  const newShape = {};
  mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)).filter((key) => !omitted.has(key)));
  return clone(schema, mergeDefs(currDef, { shape: newShape, checks: [] }));
}
function extend(schema, shape) {
  if (!isPlainObject(shape)) {
    throw new Error("Invalid input to extend: expected a plain object");
  }
  const checks = schema._zod.def.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    const existingShape = sourceShape(schema);
    for (const key of Reflect.ownKeys(shape)) {
      if (Object.getOwnPropertyDescriptor(existingShape, key) !== undefined) {
        throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
      }
    }
  }
  return clone(schema, mergeDefs(schema._zod.def, { shape: extended(schema, shape) }));
}
function extended(schema, shape) {
  const newShape = {};
  mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)));
  mirrorProps(newShape, shape);
  return newShape;
}
function safeExtend(schema, shape) {
  if (!isPlainObject(shape)) {
    throw new Error("Invalid input to safeExtend: expected a plain object");
  }
  return clone(schema, mergeDefs(schema._zod.def, { shape: extended(schema, shape) }));
}
function merge(a, b) {
  if (!b?._zod?.def) {
    throw new Error("Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.");
  }
  if (a._zod.def.checks?.length) {
    throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
  }
  const newShape = {};
  mirrorShape(newShape, a, Reflect.ownKeys(sourceShape(a)));
  mirrorShape(newShape, b, Reflect.ownKeys(sourceShape(b)));
  const def = mergeDefs(a._zod.def, {
    shape: newShape,
    get catchall() {
      return b._zod.def.catchall;
    },
    checks: b._zod.def.checks ?? []
  });
  return clone(a, def);
}
function partial(Class, schema, mask, name = "partial") {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(`.${name}() cannot be used on object schemas containing refinements`);
  }
  const selected = mask ? new Set(maskedKeys(schema, mask)) : undefined;
  const newShape = {};
  mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)), Class && ((value, key) => selected && !selected.has(key) ? value : new Class({ type: "optional", innerType: value })));
  return clone(schema, mergeDefs(schema._zod.def, { shape: newShape, checks: [] }));
}
function required(Class, schema, mask) {
  const selected = mask ? new Set(maskedKeys(schema, mask)) : undefined;
  const newShape = {};
  mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)), (value, key) => selected && !selected.has(key) ? value : new Class({ type: "nonoptional", innerType: value }));
  return clone(schema, mergeDefs(schema._zod.def, { shape: newShape }));
}
function aborted(x, startIndex = 0) {
  if (x.aborted === true)
    return true;
  for (let i = startIndex;i < x.issues.length; i++) {
    if (x.issues[i]?.continue !== true) {
      return true;
    }
  }
  return false;
}
function explicitlyAborted(x, startIndex = 0) {
  if (x.aborted === true)
    return true;
  for (let i = startIndex;i < x.issues.length; i++) {
    if (x.issues[i]?.continue === false) {
      return true;
    }
  }
  return false;
}
function prefixIssues(path, issues) {
  return issues.map((iss) => {
    var _a;
    (_a = iss).path ?? (_a.path = []);
    iss.path.unshift(path);
    return iss;
  });
}
function unwrapMessage(message) {
  return typeof message === "string" ? message : message?.message;
}
function attachSchema(issues, start, inst) {
  var _a;
  for (let i = start;i < issues.length; i++) {
    (_a = issues[i]).schema ?? (_a.schema = inst);
  }
}
function finalizeIssue(iss, ctx, config) {
  var _a;
  const traits = iss.inst?._zod?.traits;
  if (traits?.has("$ZodType")) {
    if (traits.has("$ZodCheck"))
      (_a = iss).schema ?? (_a.schema = iss.inst);
    else
      iss.schema = iss.inst;
  }
  const schemaError = iss.schema !== iss.inst ? iss.schema?._zod.def?.error : undefined;
  const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(schemaError?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
  const full = {};
  for (const k of Object.keys(iss)) {
    if (k === "inst" || k === "schema" || k === "continue" || k === "input" || k === "__proto__")
      continue;
    full[k] = iss[k];
  }
  full.path ?? (full.path = []);
  full.message = message;
  if (ctx?.reportInput) {
    full.input = iss.input;
  }
  return full;
}
var highSurrogate = /[\uD800-\uDBFF]/;
function codePointLength(str) {
  const units = str.length;
  if (!highSurrogate.test(str))
    return units;
  let count = units;
  for (let i = 0;i < units - 1; i++) {
    if ((str.charCodeAt(i) & 64512) === 55296 && (str.charCodeAt(i + 1) & 64512) === 56320) {
      count--;
      i++;
    }
  }
  return count;
}
function getLengthableOrigin(input) {
  if (Array.isArray(input))
    return "array";
  if (typeof input === "string")
    return "string";
  return "unknown";
}
function parsedType(data) {
  const t = typeof data;
  switch (t) {
    case "number": {
      return Number.isNaN(data) ? "nan" : "number";
    }
    case "object": {
      if (data === null) {
        return "null";
      }
      if (Array.isArray(data)) {
        return "array";
      }
      const obj = data;
      if (obj && Object.getPrototypeOf(obj) !== Object.prototype && "constructor" in obj && obj.constructor) {
        return obj.constructor.name;
      }
    }
  }
  return t;
}
function issue(...args) {
  const [iss, input, inst] = args;
  if (typeof iss === "string") {
    return {
      message: iss,
      code: "custom",
      input,
      inst
    };
  }
  return { ...iss };
}
function members(proto, table) {
  for (const key in table) {
    const desc = Object.getOwnPropertyDescriptor(table, key);
    if (desc.get)
      Object.defineProperty(proto, key, { ...desc, enumerable: false });
    else
      defineBound(proto, key, desc.value);
  }
  for (const sym of Object.getOwnPropertySymbols(table)) {
    defineBound(proto, sym, table[sym]);
  }
}
function own(inst, key, value, enumerable = true) {
  Object.defineProperty(inst, key, { configurable: true, writable: true, enumerable, value });
  return value;
}
function hide(inst, key, value) {
  return own(inst, key, value, false);
}
function derived(computes, table) {
  for (const key in computes) {
    const compute = computes[key];
    Object.defineProperty(table, key, {
      configurable: true,
      enumerable: true,
      get() {
        return own(this, key, compute(this));
      },
      set(value) {
        own(this, key, value);
      }
    });
  }
  return table;
}
function defineBound(proto, key, fn) {
  Object.defineProperty(proto, key, {
    configurable: true,
    get() {
      return this == null ? fn : own(this, key, fn.bind(this));
    },
    set(value) {
      own(this, key, value);
    }
  });
}
function claim(inst, sentinel) {
  const proto = Object.getPrototypeOf(inst);
  return sentinel in proto ? undefined : proto;
}
var installing;
var broke = false;
var breaker = {
  configurable: true,
  get() {
    broke = true;
    return;
  }
};
function defineLazyInternal(inst, key, compute) {
  const proto = Object.getPrototypeOf(inst._zod);
  if (key in proto && installing !== inst._zod) {
    installing = undefined;
    return;
  }
  installing = inst._zod;
  Object.defineProperty(proto, key, {
    configurable: true,
    get() {
      Object.defineProperty(this, key, breaker);
      const outer = broke;
      broke = false;
      try {
        const value = compute(this);
        if (broke)
          delete this[key];
        else
          Object.defineProperty(this, key, { configurable: true, writable: true, value });
        broke = broke || outer;
        return value;
      } catch (err) {
        delete this[key];
        broke = broke || outer;
        throw err;
      }
    },
    set(value) {
      Object.defineProperty(this, key, { configurable: true, writable: true, value });
    }
  });
}
function installLazyProp(inst, key, make, enumerable) {
  const proto = claim(inst, key);
  if (!proto)
    return;
  Object.defineProperty(proto, key, {
    configurable: true,
    get() {
      const desc = { configurable: true, writable: true, enumerable, value: undefined };
      Object.defineProperty(this, key, desc);
      desc.value = make(this);
      Object.defineProperty(this, key, desc);
      return desc.value;
    },
    set(value) {
      Object.defineProperty(this, key, { configurable: true, writable: true, enumerable, value });
    }
  });
}
var CONSTANT_CATCH = "~constantCatch";
function constantCatch(value) {
  const fn = () => value;
  fn[CONSTANT_CATCH] = true;
  return fn;
}

// ../../worka-authoring-desktop-latest-20261017/node_modules/.bun/zod@4.6.1/node_modules/zod/v4/core/core.js
var _a;
var _zodDesc = { value: undefined, enumerable: false };
var _E = "captureStackTrace" in Error ? Error : null;
function newError(Definition) {
  const E = _E;
  if (E) {
    const saved = E.stackTraceLimit;
    if (typeof saved === "number") {
      try {
        E.stackTraceLimit = 0;
      } catch {
        _E = null;
        return new Definition;
      }
      try {
        return new Definition;
      } finally {
        E.stackTraceLimit = saved;
      }
    }
  }
  return new Definition;
}
function $constructor(name, initializer, proto, params) {
  const zodProto = {};
  function Internals(def) {
    this.def = def;
    this.constr = _;
    this.traits = new Set;
  }
  Internals.prototype = zodProto;
  const protoMembers = proto;
  const initialized = protoMembers && new WeakSet;
  function init(inst, def) {
    if (!inst._zod) {
      _zodDesc.value = new Internals(def);
      try {
        Object.defineProperty(inst, "_zod", _zodDesc);
      } finally {
        _zodDesc.value = undefined;
      }
    }
    if (inst._zod.traits.has(name)) {
      return;
    }
    inst._zod.traits.add(name);
    initializer(inst, def);
    if (initialized) {
      const own = Object.getPrototypeOf(inst);
      const ctorProto = inst._zod.constr.prototype;
      let up = own;
      while (up && up !== ctorProto)
        up = Object.getPrototypeOf(up);
      const target = up ?? own;
      if (!initialized.has(target)) {
        initialized.add(target);
        members(target, protoMembers);
      }
    }
    const proto = _.prototype;
    for (const k in proto) {
      if (!Object.prototype.hasOwnProperty.call(proto, k))
        continue;
      if (!(k in inst)) {
        inst[k] = proto[k].bind(inst);
      }
    }
  }
  const Parent = params?.Parent ?? Object;

  class Definition extends Parent {
  }
  Object.defineProperty(Definition, "name", { value: name });
  function _(def) {
    const inst = params?.Parent ? newError(Definition) : this;
    init(inst, def);
    const deferred = inst._zod.deferred;
    if (deferred) {
      for (const fn of deferred) {
        fn();
      }
      inst._zod.deferred = undefined;
    }
    const pp = globalThis.__zod_globalConfig?.postProcessor;
    if (pp)
      pp(inst);
    return inst;
  }
  Object.defineProperty(_, "init", { value: init });
  Object.defineProperty(_, Symbol.hasInstance, {
    value: (inst) => {
      if (params?.Parent && inst instanceof params.Parent)
        return true;
      return inst?._zod?.traits?.has(name);
    }
  });
  Object.defineProperty(_, "name", { value: name });
  return _;
}
class $ZodAsyncError extends Error {
  constructor() {
    super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
  }
}

class $ZodEncodeError extends Error {
  constructor(name) {
    super(`Encountered unidirectional transform during encode: ${name}`);
    this.name = "ZodEncodeError";
  }
}
(_a = globalThis).__zod_globalConfig ?? (_a.__zod_globalConfig = {});
var globalConfig = globalThis.__zod_globalConfig;
function config(newConfig) {
  if (newConfig)
    Object.assign(globalConfig, newConfig);
  return globalConfig;
}
// ../../worka-authoring-desktop-latest-20261017/node_modules/.bun/zod@4.6.1/node_modules/zod/v4/core/errors.js
function _getMessage() {
  const internals = this._zod;
  internals.message ?? (internals.message = JSON.stringify(internals.def, jsonStringifyReplacer, 2));
  return internals.message;
}
function _setMessage(value) {
  this._zod.message = value;
}
var _messageDesc = {
  get: _getMessage,
  set: _setMessage,
  enumerable: true,
  configurable: true
};
var _issuesDesc = { value: undefined, enumerable: false };
var _installedToString = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
var initializer = (inst, def) => {
  inst.name = "$ZodError";
  _issuesDesc.value = def;
  Object.defineProperty(inst, "issues", _issuesDesc);
  _issuesDesc.value = undefined;
  Object.defineProperty(inst, "message", _messageDesc);
  const proto = Object.getPrototypeOf(inst);
  if (!_installedToString.has(proto)) {
    _installedToString.add(proto);
    Object.defineProperty(proto, "toString", {
      configurable: true,
      enumerable: false,
      get() {
        const value = () => this.message;
        Object.defineProperty(this, "toString", { value, configurable: true, writable: true });
        return value;
      },
      set(value) {
        Object.defineProperty(this, "toString", { value, configurable: true, writable: true });
      }
    });
  }
};
var $ZodError = $constructor("$ZodError", initializer);
var $ZodRealError = $constructor("$ZodError", initializer, undefined, {
  Parent: Error
});
function node(obj, key, make) {
  if (!Object.prototype.hasOwnProperty.call(obj, key)) {
    if (key === "__proto__") {
      Object.defineProperty(obj, key, { value: make(), writable: true, enumerable: true, configurable: true });
    } else {
      obj[key] = make();
    }
  }
  return obj[key];
}
function flattenError(error, mapper = (issue) => issue.message) {
  const fieldErrors = {};
  const formErrors = [];
  for (const sub of error.issues) {
    if (sub.path.length > 0) {
      node(fieldErrors, sub.path[0], () => []).push(mapper(sub));
    } else {
      formErrors.push(mapper(sub));
    }
  }
  return { formErrors, fieldErrors };
}
function formatError(error, mapper = (issue) => issue.message) {
  const fieldErrors = { _errors: [] };
  const processError = (error, path = []) => {
    for (const issue of error.issues) {
      if (issue.code === "invalid_union" && issue.errors.length) {
        issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
      } else if (issue.code === "invalid_key") {
        processError({ issues: issue.issues }, [...path, ...issue.path]);
      } else if (issue.code === "invalid_element") {
        processError({ issues: issue.issues }, [...path, ...issue.path]);
      } else {
        const fullpath = [...path, ...issue.path];
        if (fullpath.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < fullpath.length) {
            const el = fullpath[i];
            const terminal = i === fullpath.length - 1;
            if (el === "_errors") {
              if (terminal)
                curr._errors.push(mapper(issue));
              i++;
              continue;
            }
            if (!Object.prototype.hasOwnProperty.call(curr, el)) {
              Object.defineProperty(curr, el, {
                value: { _errors: [] },
                enumerable: true,
                writable: true,
                configurable: true
              });
            }
            const node = curr[el];
            if (terminal) {
              node._errors.push(mapper(issue));
            }
            curr = node;
            i++;
          }
        }
      }
    }
  };
  processError(error);
  return fieldErrors;
}

// ../../worka-authoring-desktop-latest-20261017/node_modules/.bun/zod@4.6.1/node_modules/zod/v4/core/parse.js
function finalizeParams(callee, params) {
  return { callee: params?.callee ?? callee, Err: params?.Err };
}
var _parse = (_Err) => {
  const fn = (schema, value, _ctx, _params) => {
    const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
    const result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise) {
      throw new $ZodAsyncError;
    }
    if (result.issues.length) {
      const e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
      captureStackTrace(e, _params?.callee ?? fn);
      throw e;
    }
    return result.value;
  };
  return fn;
};
var _parseAsync = (_Err) => {
  const fn = async (schema, value, _ctx, params) => {
    const ctx = _ctx ? { ..._ctx, async: true } : { async: true };
    let result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise)
      result = await result;
    if (result.issues.length) {
      const e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
      captureStackTrace(e, params?.callee ?? fn);
      throw e;
    }
    return result.value;
  };
  return fn;
};
var _safeParse = (_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
  const result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise) {
    throw new $ZodAsyncError;
  }
  return result.issues.length ? failure(_Err, result.issues, ctx) : { success: true, data: result.value };
};
function failure(Err, issues, ctx) {
  let error;
  return {
    success: false,
    get error() {
      if (!error) {
        error = new Err(issues.map((iss) => finalizeIssue(iss, ctx, config())));
        issues = undefined;
        ctx = undefined;
      }
      return error;
    },
    set error(e) {
      error = e;
      issues = undefined;
      ctx = undefined;
    }
  };
}
var _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, async: true } : { async: true };
  let result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  return result.issues.length ? failure(_Err, result.issues, ctx) : { success: true, data: result.value };
};
var COMPILE_INVALID = /* @__PURE__ */ Symbol.for("zod.compile.invalid");
var COMPILE_FALLBACK = /* @__PURE__ */ Symbol.for("zod.compile.fallback");
var validate = (schema, value, _ctx) => {
  const validator = schema._zod.bag.validator;
  if (validator !== undefined) {
    if (validator(value) !== COMPILE_INVALID)
      return true;
    if (validator.definite === true && _ctx === undefined)
      return false;
  }
  return validateFallback(schema, value, _ctx);
};
function validateFallback(schema, value, _ctx) {
  const ctx = _ctx ? { ..._ctx, async: false, abortEarly: true } : { async: false, abortEarly: true };
  const fallbackRun = schema._zod.bag.fallbackRun;
  let result;
  if (fallbackRun) {
    ctx[COMPILE_FALLBACK] = true;
    result = fallbackRun({ value, issues: [] }, ctx);
  } else {
    result = schema._zod.run({ value, issues: [] }, ctx);
  }
  if (result instanceof Promise) {
    throw new $ZodAsyncError;
  }
  return result.issues.length === 0;
}
var validateAsync = async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, async: true, abortEarly: true } : { async: true, abortEarly: true };
  let result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  return result.issues.length === 0;
};
var _encode = (_Err) => {
  const parse = _parse(_Err);
  const fn = (schema, value, _ctx, _params) => {
    const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
    return parse(schema, value, ctx, finalizeParams(fn, _params));
  };
  return fn;
};
var _decode = (_Err) => {
  const parse = _parse(_Err);
  const fn = (schema, value, _ctx, _params) => {
    return parse(schema, value, _ctx, finalizeParams(fn, _params));
  };
  return fn;
};
var _encodeAsync = (_Err) => {
  const parseAsync = _parseAsync(_Err);
  const fn = async (schema, value, _ctx, _params) => {
    const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
    return await parseAsync(schema, value, ctx, finalizeParams(fn, _params));
  };
  return fn;
};
var _decodeAsync = (_Err) => {
  const parseAsync = _parseAsync(_Err);
  const fn = async (schema, value, _ctx, _params) => {
    return await parseAsync(schema, value, _ctx, finalizeParams(fn, _params));
  };
  return fn;
};
var _safeEncode = (_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _safeParse(_Err)(schema, value, ctx);
};
var _safeDecode = (_Err) => (schema, value, _ctx) => {
  return _safeParse(_Err)(schema, value, _ctx);
};
var _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _safeParseAsync(_Err)(schema, value, ctx);
};
var _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
  return _safeParseAsync(_Err)(schema, value, _ctx);
};
// ../../worka-authoring-desktop-latest-20261017/node_modules/.bun/zod@4.6.1/node_modules/zod/v4/core/regexes.js
var cuid = /^[cC][0-9a-z]{6,}$/;
var cuid2 = /^[0-9a-z]+$/;
var ulid = /^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/;
var xid = /^[0-9a-vA-V]{20}$/;
var ksuid = /^[A-Za-z0-9]{27}$/;
var nanoid = /^[a-zA-Z0-9_-]{21}$/;
function nanoidOfLength(length) {
  return new RegExp(`^[a-zA-Z0-9_-]{${length}}$`);
}
var duration = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
var guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
var uuid = (version) => {
  if (!version)
    return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
  return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
};
var email = /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
var _emoji = `^(?=[\\s\\S]*[\\p{Extended_Pictographic}\\p{Regional_Indicator}\\u20E3])[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$`;
function emoji() {
  return new RegExp(_emoji, "u");
}
var ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
var cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
var cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
var base64url = /^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2,3})?$/;
var httpProtocol = /^https?$/;
var e164 = /^\+[1-9]\d{6,14}$/;
var dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
function anchor(source) {
  return new RegExp(`^${source}$`);
}
var date = /* @__PURE__ */ anchor(dateSource);
function timeSource(args) {
  const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
  const regex = typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : args.seconds ? `${hhmm}:[0-5]\\d(?:\\.\\d+)?` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
  return regex;
}
function time(args) {
  return new RegExp(`^${timeSource(args)}$`);
}
function datetime(args) {
  const opts = ["Z"];
  if (args.offset)
    opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
  const qualified = `${timeSource({ precision: args.precision, seconds: true })}(?:${opts.join("|")})`;
  const timeRegex = args.local ? `${qualified}|${timeSource({ precision: args.precision })}` : qualified;
  return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
var anyString = /^[\s\S]{0,}$/;
var integer = /^-?\d+$/;
var number = /^-?\d+(?:\.\d+)?$/;
var boolean = /^(?:true|false)$/i;
var _null = /^null$/i;
var lowercase = /^[^A-Z]*$/;
var uppercase = /^[^a-z]*$/;

// ../../worka-authoring-desktop-latest-20261017/node_modules/.bun/zod@4.6.1/node_modules/zod/v4/core/checks.js
var $ZodCheck = /* @__PURE__ */ $constructor("$ZodCheck", (inst, def) => {
  var _a;
  inst._zod ?? (inst._zod = {});
  inst._zod.def = def;
  (_a = inst._zod).onattach ?? (_a.onattach = []);
});
var _whenHasLength = (payload) => {
  const val = payload.value;
  return !nullish(val) && val.length !== undefined;
};
var numericOriginMap = {
  number: "number",
  bigint: "bigint",
  object: "date"
};
var $ZodCheckLessThan = /* @__PURE__ */ $constructor("$ZodCheckLessThan", (inst, def) => {
  $ZodCheck.init(inst, def);
  const origin = numericOriginMap[typeof def.value];
  inst._zod.check = (payload) => {
    if (def.inclusive ? payload.value <= def.value : payload.value < def.value) {
      return;
    }
    payload.issues.push({
      origin: numericOriginMap[typeof payload.value] ?? origin,
      code: "too_big",
      maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
      input: payload.value,
      inclusive: def.inclusive,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckGreaterThan = /* @__PURE__ */ $constructor("$ZodCheckGreaterThan", (inst, def) => {
  $ZodCheck.init(inst, def);
  const origin = numericOriginMap[typeof def.value];
  inst._zod.check = (payload) => {
    if (def.inclusive ? payload.value >= def.value : payload.value > def.value) {
      return;
    }
    payload.issues.push({
      origin: numericOriginMap[typeof payload.value] ?? origin,
      code: "too_small",
      minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
      input: payload.value,
      inclusive: def.inclusive,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckMultipleOf = /* @__PURE__ */ $constructor("$ZodCheckMultipleOf", (inst, def) => {
  $ZodCheck.init(inst, def);
  inst._zod.check = (payload) => {
    if (typeof payload.value !== typeof def.value)
      throw new Error("Cannot mix number and bigint in multiple_of check.");
    const isMultiple = typeof payload.value === "bigint" ? def.value !== BigInt(0) && payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0;
    if (isMultiple)
      return;
    payload.issues.push({
      origin: typeof payload.value,
      code: "not_multiple_of",
      divisor: def.value,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckNumberFormat = /* @__PURE__ */ $constructor("$ZodCheckNumberFormat", (inst, def) => {
  $ZodCheck.init(inst, def);
  def.format = def.format || "float64";
  const isInt = def.format?.includes("int");
  const origin = isInt ? "int" : "number";
  const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
  inst._zod.check = (payload) => {
    const input = payload.value;
    if (isInt) {
      if (!Number.isInteger(input)) {
        payload.issues.push({
          expected: origin,
          format: def.format,
          code: "invalid_type",
          continue: false,
          input,
          inst
        });
        return;
      }
      if (!Number.isSafeInteger(input)) {
        if (input > 0) {
          payload.issues.push({
            input,
            code: "too_big",
            maximum: Number.MAX_SAFE_INTEGER,
            note: "Integers must be within the safe integer range.",
            inst,
            origin,
            inclusive: true,
            continue: !def.abort
          });
        } else {
          payload.issues.push({
            input,
            code: "too_small",
            minimum: Number.MIN_SAFE_INTEGER,
            note: "Integers must be within the safe integer range.",
            inst,
            origin,
            inclusive: true,
            continue: !def.abort
          });
        }
        return;
      }
    }
    if (input < minimum) {
      payload.issues.push({
        origin: "number",
        input,
        code: "too_small",
        minimum,
        inclusive: true,
        inst,
        continue: !def.abort
      });
    }
    if (input > maximum) {
      payload.issues.push({
        origin: "number",
        input,
        code: "too_big",
        maximum,
        inclusive: true,
        inst,
        continue: !def.abort
      });
    }
  };
});
var $ZodCheckMaxLength = /* @__PURE__ */ $constructor("$ZodCheckMaxLength", (inst, def) => {
  var _a;
  $ZodCheck.init(inst, def);
  (_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
  inst._zod.check = (payload) => {
    const input = payload.value;
    const units = input.length;
    const length = typeof input === "string" && units > def.maximum ? codePointLength(input) : units;
    if (length <= def.maximum)
      return;
    const origin = getLengthableOrigin(input);
    payload.issues.push({
      origin,
      code: "too_big",
      maximum: def.maximum,
      inclusive: true,
      input,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckMinLength = /* @__PURE__ */ $constructor("$ZodCheckMinLength", (inst, def) => {
  var _a;
  $ZodCheck.init(inst, def);
  (_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
  inst._zod.check = (payload) => {
    const input = payload.value;
    const units = input.length;
    const length = typeof input === "string" && units >= def.minimum && units < def.minimum * 2 ? codePointLength(input) : units;
    if (length >= def.minimum)
      return;
    const origin = getLengthableOrigin(input);
    payload.issues.push({
      origin,
      code: "too_small",
      minimum: def.minimum,
      inclusive: true,
      input,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckLengthEquals = /* @__PURE__ */ $constructor("$ZodCheckLengthEquals", (inst, def) => {
  var _a;
  $ZodCheck.init(inst, def);
  (_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
  inst._zod.check = (payload) => {
    const input = payload.value;
    const units = input.length;
    const length = typeof input === "string" && units >= def.length && units <= def.length * 2 ? codePointLength(input) : units;
    if (length === def.length)
      return;
    const origin = getLengthableOrigin(input);
    const tooBig = length > def.length;
    payload.issues.push({
      origin,
      ...tooBig ? { code: "too_big", maximum: def.length } : { code: "too_small", minimum: def.length },
      inclusive: true,
      exact: true,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckStringFormat = /* @__PURE__ */ $constructor("$ZodCheckStringFormat", (inst, def) => {
  var _a, _b;
  $ZodCheck.init(inst, def);
  if (def.pattern)
    (_a = inst._zod).check ?? (_a.check = (payload) => {
      def.pattern.lastIndex = 0;
      if (def.pattern.test(payload.value))
        return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: def.format,
        input: payload.value,
        ...def.pattern ? { pattern: def.pattern.toString() } : {},
        inst,
        continue: !def.abort
      });
    });
  else
    (_b = inst._zod).check ?? (_b.check = () => {});
});
var $ZodCheckRegex = /* @__PURE__ */ $constructor("$ZodCheckRegex", (inst, def) => {
  $ZodCheckStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    def.pattern.lastIndex = 0;
    if (def.pattern.test(payload.value))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "regex",
      input: payload.value,
      pattern: def.pattern.toString(),
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckLowerCase = /* @__PURE__ */ $constructor("$ZodCheckLowerCase", (inst, def) => {
  def.pattern ?? (def.pattern = lowercase);
  $ZodCheckStringFormat.init(inst, def);
});
var $ZodCheckUpperCase = /* @__PURE__ */ $constructor("$ZodCheckUpperCase", (inst, def) => {
  def.pattern ?? (def.pattern = uppercase);
  $ZodCheckStringFormat.init(inst, def);
});
var $ZodCheckIncludes = /* @__PURE__ */ $constructor("$ZodCheckIncludes", (inst, def) => {
  $ZodCheck.init(inst, def);
  const escapedRegex = escapeRegex(def.includes);
  const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position},}${escapedRegex}` : escapedRegex);
  def.pattern = pattern;
  inst._zod.check = (payload) => {
    if (payload.value.includes(def.includes, def.position))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "includes",
      includes: def.includes,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckStartsWith = /* @__PURE__ */ $constructor("$ZodCheckStartsWith", (inst, def) => {
  $ZodCheck.init(inst, def);
  const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
  def.pattern ?? (def.pattern = pattern);
  inst._zod.check = (payload) => {
    if (payload.value.startsWith(def.prefix))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "starts_with",
      prefix: def.prefix,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckEndsWith = /* @__PURE__ */ $constructor("$ZodCheckEndsWith", (inst, def) => {
  $ZodCheck.init(inst, def);
  const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
  def.pattern ?? (def.pattern = pattern);
  inst._zod.check = (payload) => {
    if (payload.value.endsWith(def.suffix))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "ends_with",
      suffix: def.suffix,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckOverwrite = /* @__PURE__ */ $constructor("$ZodCheckOverwrite", (inst, def) => {
  $ZodCheck.init(inst, def);
  inst._zod.check = (payload) => {
    payload.value = def.tx(payload.value);
  };
});

// ../../worka-authoring-desktop-latest-20261017/node_modules/.bun/zod@4.6.1/node_modules/zod/v4/core/doc.js
class Doc {
  constructor(args = [], closed = {}) {
    this.content = [];
    this.indent = 0;
    this.args = args;
    this.closed = closed;
  }
  indented(fn) {
    this.indent += 1;
    try {
      fn(this);
    } finally {
      this.indent -= 1;
    }
  }
  write(arg) {
    if (typeof arg === "function") {
      arg(this, { execution: "sync" });
      arg(this, { execution: "async" });
      return;
    }
    const content = arg;
    const lines = content.split(`
`).filter((x) => x);
    const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
    const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
    for (const line of dedented) {
      this.content.push(line);
    }
  }
  compile() {
    const F = Function;
    const content = this?.content ?? [``];
    const factory = new F(...Object.keys(this.closed), `return function (${this.args.join(", ")}) {
${content.join(`
`)}
};`);
    return factory(...Object.values(this.closed));
  }
}

// ../../worka-authoring-desktop-latest-20261017/node_modules/.bun/zod@4.6.1/node_modules/zod/v4/core/versions.js
var version = {
  major: 4,
  minor: 6,
  patch: 1
};

// ../../worka-authoring-desktop-latest-20261017/node_modules/.bun/zod@4.6.1/node_modules/zod/v4/core/schemas.js
var $ZodType = /* @__PURE__ */ $constructor("$ZodType", (inst, def) => {
  var _a;
  inst ?? (inst = {});
  inst._zod.def = def;
  inst._zod.bag = inst._zod.bag || {};
  inst._zod.version = version;
  const defChecks = inst._zod.def.checks;
  const checks = inst._zod.traits.has("$ZodCheck") ? [inst, ...defChecks ?? []] : defChecks?.length ? [...defChecks] : [];
  for (const ch of checks) {
    for (const fn of ch._zod.onattach) {
      fn(inst);
    }
  }
  if (checks.length === 0) {
    (_a = inst._zod).deferred ?? (_a.deferred = []);
    inst._zod.deferred?.push(() => {
      inst._zod.run = inst._zod.parse;
    });
  } else {
    const runChecks = (payload, checks, ctx) => {
      if (payload.memo)
        return payload;
      let isAborted = aborted(payload);
      let asyncResult;
      for (const ch of checks) {
        if (ch._zod.def.when) {
          if (explicitlyAborted(payload))
            continue;
          const shouldRun = ch._zod.def.when(payload);
          if (!shouldRun)
            continue;
        } else if (isAborted) {
          continue;
        }
        const currLen = payload.issues.length;
        const _ = ch._zod.check(payload);
        if (_ instanceof Promise && ctx?.async === false) {
          throw new $ZodAsyncError;
        }
        if (asyncResult || _ instanceof Promise) {
          asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
            await _;
            const nextLen = payload.issues.length;
            if (nextLen === currLen)
              return;
            attachSchema(payload.issues, currLen, inst);
            if (!isAborted)
              isAborted = aborted(payload, currLen);
          });
        } else {
          const nextLen = payload.issues.length;
          if (nextLen === currLen)
            continue;
          attachSchema(payload.issues, currLen, inst);
          if (!isAborted)
            isAborted = aborted(payload, currLen);
        }
      }
      if (asyncResult) {
        return asyncResult.then(() => {
          return payload;
        });
      }
      return payload;
    };
    const handleCanaryResult = (canary, payload, ctx) => {
      if (aborted(canary)) {
        canary.aborted = true;
        return canary;
      }
      const checkResult = runChecks(payload, checks, ctx);
      if (checkResult instanceof Promise) {
        if (ctx.async === false)
          throw new $ZodAsyncError;
        return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
      }
      return inst._zod.parse(checkResult, ctx);
    };
    inst._zod.run = (payload, ctx) => {
      if (ctx.skipChecks) {
        return inst._zod.parse(payload, ctx);
      }
      if (ctx.direction === "backward") {
        const canary = inst._zod.parse({ value: payload.value, issues: [] }, { ...ctx, skipChecks: true });
        if (canary instanceof Promise) {
          return canary.then((canary) => {
            return handleCanaryResult(canary, payload, ctx);
          });
        }
        return handleCanaryResult(canary, payload, ctx);
      }
      const result = inst._zod.parse(payload, ctx);
      if (result instanceof Promise) {
        if (ctx.async === false)
          throw new $ZodAsyncError;
        return result.then((result) => runChecks(result, checks, ctx));
      }
      return runChecks(result, checks, ctx);
    };
  }
}, {
  get "~standard"() {
    return hide(this, "~standard", standardProps(this));
  },
  set "~standard"(value) {
    own(this, "~standard", value);
  }
});
var toStandardResult = (r, ctx) => r.issues.length ? { issues: r.issues.map((iss) => finalizeIssue(iss, ctx, config())) } : { value: r.value };
async function validateAsync2(inst, value) {
  const ctx = { async: true };
  return toStandardResult(await inst._zod.run({ value, issues: [] }, ctx), ctx);
}
function standardProps(inst) {
  return {
    validate: (value) => {
      const ctx = { async: false };
      try {
        const r = inst._zod.run({ value, issues: [] }, ctx);
        if (!(r instanceof Promise))
          return toStandardResult(r, ctx);
      } catch (_) {}
      return validateAsync2(inst, value);
    },
    vendor: "zod",
    version: 1
  };
}
var $ZodString = /* @__PURE__ */ $constructor("$ZodString", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = def.pattern ?? anyString;
  inst._zod.parse = (payload, _) => {
    if (def.coerce)
      try {
        payload.value = String(payload.value);
      } catch (_) {}
    if (typeof payload.value === "string")
      return payload;
    payload.issues.push({
      expected: "string",
      code: "invalid_type",
      input: payload.value,
      inst
    });
    return payload;
  };
});
var $ZodStringFormat = /* @__PURE__ */ $constructor("$ZodStringFormat", (inst, def) => {
  $ZodCheckStringFormat.init(inst, def);
  $ZodString.init(inst, def);
});
var $ZodGUID = /* @__PURE__ */ $constructor("$ZodGUID", (inst, def) => {
  def.pattern ?? (def.pattern = guid);
  $ZodStringFormat.init(inst, def);
});
var $ZodUUID = /* @__PURE__ */ $constructor("$ZodUUID", (inst, def) => {
  if (def.version) {
    const versionMap = {
      v1: 1,
      v2: 2,
      v3: 3,
      v4: 4,
      v5: 5,
      v6: 6,
      v7: 7,
      v8: 8
    };
    const v = versionMap[def.version];
    if (v === undefined)
      throw new Error(`Invalid UUID version: "${def.version}"`);
    def.pattern ?? (def.pattern = uuid(v));
  } else
    def.pattern ?? (def.pattern = uuid());
  $ZodStringFormat.init(inst, def);
});
var $ZodEmail = /* @__PURE__ */ $constructor("$ZodEmail", (inst, def) => {
  def.pattern ?? (def.pattern = email);
  $ZodStringFormat.init(inst, def);
});
var URL_BAD_FORMAT = 1;
var URL_UNPARSEABLE = 2;
function parseURLObject(trimmed, def) {
  if (!def.normalize && def.protocol?.source === httpProtocol.source && !/^https?:\/\//i.test(trimmed)) {
    return URL_BAD_FORMAT;
  }
  try {
    return new URL(trimmed);
  } catch {
    return URL_UNPARSEABLE;
  }
}
var asciiTabOrNewline = /[\t\n\r]/g;
function stripTabAndNewline(value) {
  return value.replace(asciiTabOrNewline, "");
}
function urlHostnameOk(url, hostname) {
  hostname.lastIndex = 0;
  return hostname.test(url.hostname);
}
function urlProtocolOk(url, protocol) {
  protocol.lastIndex = 0;
  return protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol);
}
var $ZodURL = /* @__PURE__ */ $constructor("$ZodURL", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    try {
      const trimmed = payload.value.trim();
      const url = parseURLObject(trimmed, def);
      if (url === URL_BAD_FORMAT) {
        payload.issues.push({
          code: "invalid_format",
          format: "url",
          note: "Invalid URL format",
          input: payload.value,
          inst,
          continue: !def.abort
        });
        return;
      }
      if (url === URL_UNPARSEABLE) {
        payload.issues.push({
          code: "invalid_format",
          format: "url",
          input: payload.value,
          inst,
          continue: !def.abort
        });
        return;
      }
      if (def.hostname && !urlHostnameOk(url, def.hostname)) {
        payload.issues.push({
          code: "invalid_format",
          format: "url",
          note: "Invalid hostname",
          pattern: def.hostname.source,
          input: payload.value,
          inst,
          continue: !def.abort
        });
      }
      if (def.protocol && !urlProtocolOk(url, def.protocol)) {
        payload.issues.push({
          code: "invalid_format",
          format: "url",
          note: "Invalid protocol",
          pattern: def.protocol.source,
          input: payload.value,
          inst,
          continue: !def.abort
        });
      }
      payload.value = def.normalize ? url.href : stripTabAndNewline(trimmed);
      return;
    } catch (_) {
      payload.issues.push({
        code: "invalid_format",
        format: "url",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
var $ZodEmoji = /* @__PURE__ */ $constructor("$ZodEmoji", (inst, def) => {
  def.pattern ?? (def.pattern = emoji());
  $ZodStringFormat.init(inst, def);
});
var $ZodNanoID = /* @__PURE__ */ $constructor("$ZodNanoID", (inst, def) => {
  if (def.length !== undefined && (!Number.isInteger(def.length) || def.length < 1))
    throw new Error(`Invalid nanoid length: ${def.length}`);
  def.pattern ?? (def.pattern = def.length === undefined ? nanoid : nanoidOfLength(def.length));
  $ZodStringFormat.init(inst, def);
});
var $ZodCUID = /* @__PURE__ */ $constructor("$ZodCUID", (inst, def) => {
  def.pattern ?? (def.pattern = cuid);
  $ZodStringFormat.init(inst, def);
});
var $ZodCUID2 = /* @__PURE__ */ $constructor("$ZodCUID2", (inst, def) => {
  def.pattern ?? (def.pattern = cuid2);
  $ZodStringFormat.init(inst, def);
});
var $ZodULID = /* @__PURE__ */ $constructor("$ZodULID", (inst, def) => {
  def.pattern ?? (def.pattern = ulid);
  $ZodStringFormat.init(inst, def);
});
var $ZodXID = /* @__PURE__ */ $constructor("$ZodXID", (inst, def) => {
  def.pattern ?? (def.pattern = xid);
  $ZodStringFormat.init(inst, def);
});
var $ZodKSUID = /* @__PURE__ */ $constructor("$ZodKSUID", (inst, def) => {
  def.pattern ?? (def.pattern = ksuid);
  $ZodStringFormat.init(inst, def);
});
var $ZodISODateTime = /* @__PURE__ */ $constructor("$ZodISODateTime", (inst, def) => {
  def.pattern ?? (def.pattern = datetime(def));
  $ZodStringFormat.init(inst, def);
});
var $ZodISODate = /* @__PURE__ */ $constructor("$ZodISODate", (inst, def) => {
  def.pattern ?? (def.pattern = date);
  $ZodStringFormat.init(inst, def);
});
var $ZodISOTime = /* @__PURE__ */ $constructor("$ZodISOTime", (inst, def) => {
  def.pattern ?? (def.pattern = time(def));
  $ZodStringFormat.init(inst, def);
});
var $ZodISODuration = /* @__PURE__ */ $constructor("$ZodISODuration", (inst, def) => {
  def.pattern ?? (def.pattern = duration);
  $ZodStringFormat.init(inst, def);
});
var $ZodIPv4 = /* @__PURE__ */ $constructor("$ZodIPv4", (inst, def) => {
  def.pattern ?? (def.pattern = ipv4);
  $ZodStringFormat.init(inst, def);
});
var ipv6Alphabet = /^[0-9a-fA-F:.]+$/;
function isValidIPv6(value) {
  if (!ipv6Alphabet.test(value))
    return false;
  try {
    new URL(`http://[${value}]`);
    return true;
  } catch {
    return false;
  }
}
var $ZodIPv6 = /* @__PURE__ */ $constructor("$ZodIPv6", (inst, def) => {
  def.pattern ?? (def.pattern = ipv6);
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    if (!isValidIPv6(payload.value)) {
      payload.issues.push({
        code: "invalid_format",
        format: "ipv6",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
var $ZodCIDRv4 = /* @__PURE__ */ $constructor("$ZodCIDRv4", (inst, def) => {
  def.pattern ?? (def.pattern = cidrv4);
  $ZodStringFormat.init(inst, def);
});
function isValidCIDRv6(value) {
  const parts = value.split("/");
  if (parts.length !== 2)
    return false;
  const [address, prefix] = parts;
  if (!prefix)
    return false;
  const prefixNum = Number(prefix);
  if (`${prefixNum}` !== prefix)
    return false;
  if (prefixNum < 0 || prefixNum > 128)
    return false;
  return isValidIPv6(address);
}
var $ZodCIDRv6 = /* @__PURE__ */ $constructor("$ZodCIDRv6", (inst, def) => {
  def.pattern ?? (def.pattern = cidrv6);
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    if (!isValidCIDRv6(payload.value)) {
      payload.issues.push({
        code: "invalid_format",
        format: "cidrv6",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
function isValidBase64(data) {
  if (data === "")
    return true;
  if (/\s/.test(data))
    return false;
  if (data.length % 4 !== 0)
    return false;
  try {
    atob(data);
    return true;
  } catch {
    return false;
  }
}
var base64Charset = /^[0-9a-zA-Z+/]*={0,2}$/;
var $ZodBase64 = /* @__PURE__ */ $constructor("$ZodBase64", (inst, def) => {
  def.pattern ?? (def.pattern = base64Charset);
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    if (isValidBase64(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "base64",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var base64urlCharset = /^[A-Za-z0-9_-]*$/;
function isValidBase64URL(data) {
  if (!base64urlCharset.test(data))
    return false;
  const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  return isValidBase64(padded);
}
var $ZodBase64URL = /* @__PURE__ */ $constructor("$ZodBase64URL", (inst, def) => {
  def.pattern ?? (def.pattern = base64urlCharset);
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    if (isValidBase64URL(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "base64url",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodE164 = /* @__PURE__ */ $constructor("$ZodE164", (inst, def) => {
  def.pattern ?? (def.pattern = e164);
  $ZodStringFormat.init(inst, def);
});
function isValidJWT(token, algorithm = null) {
  try {
    const tokensParts = token.split(".");
    if (tokensParts.length !== 3)
      return false;
    const [header] = tokensParts;
    if (!header)
      return false;
    const parsedHeader = JSON.parse(atob(header));
    if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT")
      return false;
    if (!parsedHeader.alg)
      return false;
    if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm))
      return false;
    return true;
  } catch {
    return false;
  }
}
var $ZodJWT = /* @__PURE__ */ $constructor("$ZodJWT", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    if (isValidJWT(payload.value, def.alg))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "jwt",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodNumber = /* @__PURE__ */ $constructor("$ZodNumber", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = number;
  inst._zod.parse = (payload, _ctx) => {
    if (def.coerce)
      try {
        payload.value = Number(payload.value);
      } catch (_) {}
    const input = payload.value;
    if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) {
      return payload;
    }
    const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? String(input) : undefined : undefined;
    payload.issues.push({
      expected: "number",
      code: "invalid_type",
      input,
      inst,
      ...received ? { received } : {}
    });
    return payload;
  };
});
var $ZodNumberFormat = /* @__PURE__ */ $constructor("$ZodNumberFormat", (inst, def) => {
  $ZodCheckNumberFormat.init(inst, def);
  $ZodNumber.init(inst, def);
});
var $ZodBoolean = /* @__PURE__ */ $constructor("$ZodBoolean", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = boolean;
  inst._zod.parse = (payload, _ctx) => {
    if (def.coerce)
      try {
        payload.value = Boolean(payload.value);
      } catch (_) {}
    const input = payload.value;
    if (typeof input === "boolean")
      return payload;
    payload.issues.push({
      expected: "boolean",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
var $ZodNull = /* @__PURE__ */ $constructor("$ZodNull", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = _null;
  inst._zod.values = new Set([null]);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (input === null)
      return payload;
    payload.issues.push({
      expected: "null",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
var $ZodUnknown = /* @__PURE__ */ $constructor("$ZodUnknown", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload) => payload;
});
var $ZodNever = /* @__PURE__ */ $constructor("$ZodNever", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _ctx) => {
    payload.issues.push({
      expected: "never",
      code: "invalid_type",
      input: payload.value,
      inst
    });
    return payload;
  };
});
function handleArrayResult(result, final, index) {
  if (result.issues.length) {
    final.issues.push(...prefixIssues(index, result.issues));
  }
  final.value[index] = result.value;
}
var $ZodArray = /* @__PURE__ */ $constructor("$ZodArray", (inst, def) => {
  $ZodType.init(inst, def);
  const memo = globalConfig.memoizer;
  memo?.attach(inst);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!Array.isArray(input)) {
      payload.issues.push({
        expected: "array",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    payload.value = memo ? memo.alloc(inst, payload, Array(input.length), ctx) : Array(input.length);
    const proms = [];
    const abortEarly = ctx?.abortEarly;
    for (let i = 0;i < input.length; i++) {
      const item = input[i];
      const result = def.element._zod.run({
        value: item,
        issues: []
      }, ctx);
      if (result instanceof Promise) {
        proms.push(result.then((result) => handleArrayResult(result, payload, i)));
      } else {
        handleArrayResult(result, payload, i);
        if (abortEarly && result.issues.length !== 0 && aborted(result))
          break;
      }
    }
    if (proms.length) {
      return Promise.all(proms).then(() => payload);
    }
    return payload;
  };
});
function handlePropertyResult(result, final, key, input, optin, optout) {
  const isPresent = key in input;
  const isOptionalOut = optout === "optional";
  if (!isPresent && isOptionalOut && optin === "optional") {
    return;
  }
  if (result.issues.length) {
    if (optin !== undefined && isOptionalOut && !isPresent) {
      return;
    }
    final.issues.push(...prefixIssues(key, result.issues));
  }
  if (!isPresent && optin === undefined) {
    if (!result.issues.length) {
      final.issues.push({
        code: "invalid_type",
        expected: "nonoptional",
        input: undefined,
        path: [key]
      });
    }
    return;
  }
  if (result.value === undefined) {
    if (isPresent) {
      final.value[key] = undefined;
    }
  } else {
    final.value[key] = result.value;
  }
}
var NO_SYMBOL_KEYS = [];
function normalizeDef(def) {
  const keys = Object.keys(def.shape);
  const ownSymbols = Object.getOwnPropertySymbols(def.shape);
  const symbolKeys = ownSymbols.length ? ownSymbols : NO_SYMBOL_KEYS;
  const allKeys = symbolKeys.length ? [...keys, ...symbolKeys] : keys;
  for (const k of allKeys) {
    if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) {
      throw new Error(`Invalid element at key "${String(k)}": expected a Zod schema`);
    }
  }
  const okeys = optionalKeys(def.shape);
  return {
    ...def,
    allKeys,
    symbolKeys,
    keySet: new Set(keys),
    numKeys: keys.length,
    optionalKeys: new Set(okeys)
  };
}
function handleCatchall(proms, input, payload, ctx, def, inst, abortEarly) {
  const unrecognized = [];
  const keySet = def.keySet;
  const _catchall = def.catchall._zod;
  const t = _catchall.def.type;
  const optin = _catchall.optin;
  const optout = _catchall.optout;
  let seen = 0;
  for (const key in input) {
    if (abortEarly && payload.issues.length !== seen) {
      if (aborted(payload, seen))
        break;
      seen = payload.issues.length;
    }
    if (keySet.has(key))
      continue;
    if (key === "__proto__") {
      if (t === "never")
        unrecognized.push(key);
      continue;
    }
    if (t === "never") {
      unrecognized.push(key);
      continue;
    }
    const r = _catchall.run({ value: input[key], issues: [] }, ctx);
    if (r instanceof Promise) {
      proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, optin, optout)));
    } else {
      handlePropertyResult(r, payload, key, input, optin, optout);
    }
  }
  if (unrecognized.length) {
    payload.issues.push({
      code: "unrecognized_keys",
      keys: unrecognized,
      input,
      inst,
      continue: true
    });
  }
  if (!proms.length)
    return payload;
  return Promise.all(proms).then(() => {
    return payload;
  });
}
var $ZodObject = /* @__PURE__ */ $constructor("$ZodObject", (inst, def) => {
  $ZodType.init(inst, def);
  const desc = Object.getOwnPropertyDescriptor(def, "shape");
  const sh = desc?.get ? desc.get.raw : def.shape ?? {};
  if (sh) {
    const get = () => {
      const newSh = { ...sh };
      Object.defineProperty(def, "shape", { value: newSh });
      get.raw = newSh;
      return newSh;
    };
    get.raw = sh;
    Object.defineProperty(def, "shape", { get });
  }
  const _normalized = cached(() => normalizeDef(def));
  defineLazyInternal(inst, "propValues", (zod) => {
    const shape = zod.def.shape;
    const propValues = {};
    for (const key in shape) {
      const field = shape[key]._zod;
      if (field.values) {
        if (!Object.prototype.hasOwnProperty.call(propValues, key)) {
          assignProp(propValues, key, new Set);
        }
        for (const v of field.values)
          propValues[key].add(v);
        if (field.optin !== undefined)
          propValues[key].add(undefined);
      }
    }
    return propValues;
  });
  const isObject2 = isObject;
  const catchall = def.catchall;
  let value;
  const memo = globalConfig.memoizer;
  memo?.attach(inst);
  inst._zod.parse = (payload, ctx) => {
    value ?? (value = _normalized.value);
    const input = payload.value;
    if (!isObject2(input)) {
      payload.issues.push({
        expected: "object",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    payload.value = memo ? memo.alloc(inst, payload, {}, ctx) : {};
    const proms = [];
    const shape = value.shape;
    const abortEarly = ctx?.abortEarly;
    let seen = payload.issues.length;
    for (const key of value.allKeys) {
      if (abortEarly && payload.issues.length !== seen) {
        if (aborted(payload, seen))
          break;
        seen = payload.issues.length;
      }
      if (key === "__proto__")
        continue;
      const el = shape[key];
      const optin = el._zod.optin;
      const optout = el._zod.optout;
      const r = el._zod.run({ value: input[key], issues: [] }, ctx);
      if (r instanceof Promise) {
        proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, optin, optout)));
      } else {
        handlePropertyResult(r, payload, key, input, optin, optout);
      }
    }
    if (!catchall) {
      return proms.length ? Promise.all(proms).then(() => payload) : payload;
    }
    return handleCatchall(proms, input, payload, ctx, _normalized.value, inst, abortEarly === true);
  };
});
var $ZodObjectJIT = /* @__PURE__ */ $constructor("$ZodObjectJIT", (inst, def) => {
  $ZodObject.init(inst, def);
  const superParse = inst._zod.parse;
  const _normalized = cached(() => normalizeDef(def));
  const memo = globalConfig.memoizer;
  const generateFastpass = (shape) => {
    const normalized = _normalized.value;
    const syms = normalized.symbolKeys;
    const doc = new Doc(["payload", "ctx"], { shape, inst, memo, syms });
    const parseStr = (k) => `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
    const prefixStr = (id, k) => `
          let ${id}_ab = false;
          for (let i = 0; i < ${id}.issues.length; i++) {
            const iss = ${id}.issues[i];
            iss.path = iss.path ? [${k}, ...iss.path] : [${k}];
            payload.issues.push(iss);
            if (iss.continue !== true) ${id}_ab = true;
          }
          if (${id}_ab && ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }`;
    doc.write(`const input = payload.value;`);
    const ids = Object.create(null);
    let counter = 0;
    for (const key of normalized.allKeys) {
      ids[key] = `key_${counter++}`;
    }
    doc.write(memo ? `const newResult = memo.alloc(inst, payload, {}, ctx);` : `const newResult = {};`);
    for (const key of normalized.allKeys) {
      if (key === "__proto__")
        continue;
      const id = ids[key];
      const k = typeof key === "symbol" ? `syms[${syms.indexOf(key)}]` : esc(key);
      const isPresent = `${k} in input`;
      const schema = shape[key];
      const optin = schema?._zod?.optin;
      const isOptionalIn = optin !== undefined;
      const isOptionalOut = schema?._zod?.optout === "optional";
      doc.write(`const ${id} = ${parseStr(k)};`);
      if (isOptionalIn && isOptionalOut) {
        const assign = optin === "optional" ? `${id}_present` : `${id}.value !== undefined || ${id}_present`;
        doc.write(`
        const ${id}_present = ${isPresent};
        if (!${id}.issues.length || ${id}_present) {
          if (${id}.issues.length) {${prefixStr(id, k)}
          }

          if (${assign}) {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
      } else if (!isOptionalIn) {
        doc.write(`
        const ${id}_present = ${isPresent};
        if (${id}.issues.length) {${prefixStr(id, k)}
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
          if (ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }
        }

        if (${id}_present) {
          newResult[${k}] = ${id}.value;
        }

      `);
      } else {
        doc.write(`
        if (${id}.issues.length) {${prefixStr(id, k)}
        }
        
        if (${id}.value === undefined) {
          if (${isPresent}) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }

      `);
      }
    }
    doc.write(`payload.value = newResult;`);
    doc.write(`return payload;`);
    return doc.compile();
  };
  let fastpass;
  const isObject2 = isObject;
  const jit = !globalConfig.jitless;
  const allowsEval2 = allowsEval;
  const fastEnabled = jit && allowsEval2.value;
  const catchall = def.catchall;
  let value;
  inst._zod.parse = (payload, ctx) => {
    value ?? (value = _normalized.value);
    const input = payload.value;
    if (!isObject2(input)) {
      payload.issues.push({
        expected: "object",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
      if (!fastpass)
        fastpass = generateFastpass(def.shape);
      payload = fastpass(payload, ctx);
      if (!catchall)
        return payload;
      return handleCatchall([], input, payload, ctx, value, inst, ctx?.abortEarly === true);
    }
    return superParse(payload, ctx);
  };
});
function handleUnionResults(results, final, inst, ctx) {
  for (const result of results) {
    if (result.issues.length === 0) {
      final.value = result.value;
      return final;
    }
  }
  const nonaborted = results.filter((r) => !aborted(r));
  if (nonaborted.length === 1) {
    final.value = nonaborted[0].value;
    return nonaborted[0];
  }
  final.issues.push({
    code: "invalid_union",
    input: final.value,
    inst,
    errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  });
  return final;
}
var $ZodUnion = /* @__PURE__ */ $constructor("$ZodUnion", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazyInternal(inst, "optin", (zod) => zod.def.options.some((o) => o._zod.optin === "defaulted") ? "defaulted" : zod.def.options.some((o) => o._zod.optin !== undefined) ? "optional" : undefined);
  defineLazyInternal(inst, "optout", (zod) => zod.def.options.some((o) => o._zod.optout === "optional") ? "optional" : undefined);
  defineLazyInternal(inst, "values", (zod) => {
    if (zod.def.options.every((o) => o._zod.values)) {
      return new Set(zod.def.options.flatMap((option) => Array.from(option._zod.values)));
    }
    return;
  });
  defineLazyInternal(inst, "pattern", (zod) => {
    if (zod.def.options.every((o) => o._zod.pattern)) {
      const patterns = zod.def.options.map((o) => o._zod.pattern);
      return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
    }
    return;
  });
  const first = def.options.length === 1 ? def.options[0]._zod.run : null;
  inst._zod.parse = (payload, ctx) => {
    if (first) {
      return first(payload, ctx);
    }
    let async = false;
    const results = [];
    for (const option of def.options) {
      const result = option._zod.run({
        value: payload.value,
        issues: []
      }, ctx);
      if (result instanceof Promise) {
        results.push(result);
        async = true;
      } else {
        if (result.issues.length === 0)
          return result;
        results.push(result);
      }
    }
    if (!async)
      return handleUnionResults(results, payload, inst, ctx);
    return Promise.all(results).then((results) => {
      return handleUnionResults(results, payload, inst, ctx);
    });
  };
});
var $ZodIntersection = /* @__PURE__ */ $constructor("$ZodIntersection", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    const left = def.left._zod.run({ value: input, issues: [] }, ctx);
    const right = def.right._zod.run({ value: input, issues: [] }, ctx);
    const async = left instanceof Promise || right instanceof Promise;
    if (async) {
      return Promise.all([left, right]).then(([left, right]) => {
        return handleIntersectionResults(payload, left, right);
      });
    }
    return handleIntersectionResults(payload, left, right);
  };
});
function mergeValues(a, b) {
  if (a === b) {
    return { valid: true, data: a };
  }
  if (a instanceof Date && b instanceof Date && +a === +b) {
    return { valid: true, data: a };
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const bKeys = Object.keys(b);
    const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    if (Object.prototype.hasOwnProperty.call(newObj, "__proto__"))
      delete newObj.__proto__;
    for (const key of sharedKeys) {
      if (key === "__proto__")
        continue;
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return {
          valid: false,
          mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
        };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return { valid: false, mergeErrorPath: [] };
    }
    const newArray = [];
    for (let index = 0;index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return {
          valid: false,
          mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
        };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  }
  return { valid: false, mergeErrorPath: [] };
}
function handleIntersectionResults(result, left, right) {
  const unrecKeys = new Map;
  let unrecIssue;
  const keyIssues = new Map;
  const collect = (iss, side) => {
    let keys;
    if (iss.code === "unrecognized_keys" && !iss.path?.length) {
      unrecIssue ?? (unrecIssue = iss);
      keys = iss.keys;
    } else if (iss.code === "invalid_key" && iss.origin === "record" && iss.path?.length === 1) {
      const k = String(iss.path[0]);
      if (!keyIssues.has(k))
        keyIssues.set(k, iss);
      keys = [k];
    } else {
      return false;
    }
    for (const k of keys) {
      if (!unrecKeys.has(k))
        unrecKeys.set(k, {});
      unrecKeys.get(k)[side] = true;
    }
    return true;
  };
  for (const iss of left.issues) {
    if (!collect(iss, "l"))
      result.issues.push(iss);
  }
  for (const iss of right.issues) {
    if (!collect(iss, "r"))
      result.issues.push(iss);
  }
  const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
  if (bothKeys.length) {
    const aggregated = unrecIssue ? bothKeys.filter((k) => unrecIssue.keys.includes(k)) : [];
    if (aggregated.length)
      result.issues.push({ ...unrecIssue, keys: aggregated });
    for (const k of bothKeys) {
      if (!aggregated.includes(k) && keyIssues.has(k))
        result.issues.push(keyIssues.get(k));
    }
  }
  const merged = mergeValues(left.value, right.value);
  if (!merged.valid) {
    if (aborted(result))
      return result;
    throw new Error(`Unmergable intersection. Error path: ` + `${JSON.stringify(merged.mergeErrorPath)}`);
  }
  result.value = merged.data;
  return result;
}
var $ZodRecord = /* @__PURE__ */ $constructor("$ZodRecord", (inst, def) => {
  $ZodType.init(inst, def);
  const memo = globalConfig.memoizer;
  memo?.attach(inst);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!isPlainObject(input)) {
      payload.issues.push({
        expected: "record",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    const proms = [];
    const values = def.keyType._zod.values;
    if (values && !def.partial) {
      payload.value = memo ? memo.alloc(inst, payload, {}, ctx) : {};
      const recordKeys = new Set;
      for (const key of values) {
        if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
          recordKeys.add(typeof key === "number" ? key.toString() : key);
          if (key === "__proto__")
            continue;
          const keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
          if (keyResult instanceof Promise) {
            throw new Error("Async schemas not supported in object keys currently");
          }
          if (keyResult.issues.length) {
            payload.issues.push({
              code: "invalid_key",
              origin: "record",
              issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
              input: key,
              path: [key],
              inst
            });
            continue;
          }
          const outKey = keyResult.value;
          if (outKey === "__proto__")
            continue;
          const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
          if (result instanceof Promise) {
            proms.push(result.then((result) => {
              if (result.issues.length) {
                payload.issues.push(...prefixIssues(key, result.issues));
              }
              payload.value[outKey] = result.value;
            }));
          } else {
            if (result.issues.length) {
              payload.issues.push(...prefixIssues(key, result.issues));
            }
            payload.value[outKey] = result.value;
          }
        }
      }
      let unrecognized;
      for (const key in input) {
        if (!recordKeys.has(key)) {
          if (def.mode === "loose") {
            if (key === "__proto__")
              continue;
            payload.value[key] = input[key];
          } else {
            unrecognized = unrecognized ?? [];
            unrecognized.push(key);
          }
        }
      }
      if (unrecognized && unrecognized.length > 0) {
        payload.issues.push({
          code: "unrecognized_keys",
          input,
          inst,
          keys: unrecognized,
          continue: true
        });
      }
    } else {
      payload.value = memo ? memo.alloc(inst, payload, {}, ctx) : {};
      let unrecognized;
      for (const key of Reflect.ownKeys(input)) {
        if (key === "__proto__")
          continue;
        if (!Object.prototype.propertyIsEnumerable.call(input, key))
          continue;
        let keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
        if (keyResult instanceof Promise) {
          throw new Error("Async schemas not supported in object keys currently");
        }
        const checkNumericKey = typeof key === "string" && number.test(key) && keyResult.issues.length;
        if (checkNumericKey) {
          const retryResult = def.keyType._zod.run({ value: Number(key), issues: [] }, ctx);
          if (retryResult instanceof Promise) {
            throw new Error("Async schemas not supported in object keys currently");
          }
          if (retryResult.issues.length === 0) {
            keyResult = retryResult;
          }
        }
        if (keyResult.issues.length) {
          if (def.mode === "loose") {
            payload.value[key] = input[key];
          } else if (values) {
            unrecognized = unrecognized ?? [];
            unrecognized.push(key);
          } else {
            payload.issues.push({
              code: "invalid_key",
              origin: "record",
              issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
              input: key,
              path: [key],
              inst
            });
          }
          continue;
        }
        const outKey = keyResult.value;
        if (outKey === "__proto__")
          continue;
        const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
        if (result instanceof Promise) {
          proms.push(result.then((result) => {
            if (result.issues.length) {
              payload.issues.push(...prefixIssues(key, result.issues));
            }
            payload.value[outKey] = result.value;
          }));
        } else {
          if (result.issues.length) {
            payload.issues.push(...prefixIssues(key, result.issues));
          }
          payload.value[outKey] = result.value;
        }
      }
      if (unrecognized && unrecognized.length > 0) {
        payload.issues.push({
          code: "unrecognized_keys",
          input,
          inst,
          keys: unrecognized,
          continue: true
        });
      }
    }
    if (proms.length) {
      return Promise.all(proms).then(() => payload);
    }
    return payload;
  };
});
var $ZodEnum = /* @__PURE__ */ $constructor("$ZodEnum", (inst, def) => {
  $ZodType.init(inst, def);
  const values = getEnumValues(def.entries);
  const valuesSet = new Set(values);
  inst._zod.values = valuesSet;
  defineLazyInternal(inst, "pattern", (zod) => {
    const patternValues = getEnumValues(zod.def.entries).filter((k) => propertyKeyTypes.has(typeof k));
    return new RegExp(patternValues.length ? `^(${patternValues.map((o) => escapeRegex(o.toString())).join("|")})$` : "^[^\\s\\S]$");
  });
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (valuesSet.has(input)) {
      return payload;
    }
    payload.issues.push({
      code: "invalid_value",
      values,
      input,
      inst
    });
    return payload;
  };
});
var $ZodLiteral = /* @__PURE__ */ $constructor("$ZodLiteral", (inst, def) => {
  $ZodType.init(inst, def);
  const values = new Set(def.values);
  inst._zod.values = values;
  defineLazyInternal(inst, "pattern", (zod) => {
    const vals = zod.def.values;
    return new RegExp(vals.length ? `^(${vals.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$` : "^[^\\s\\S]$");
  });
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (values.has(input)) {
      return payload;
    }
    payload.issues.push({
      code: "invalid_value",
      values: def.values,
      input,
      inst
    });
    return payload;
  };
});
var $ZodTransform = /* @__PURE__ */ $constructor("$ZodTransform", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  globalConfig.memoizer?.guard(inst);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      throw new $ZodEncodeError(inst.constructor.name);
    }
    const _out = def.transform(payload.value, payload);
    if (ctx.async) {
      const output = _out instanceof Promise ? _out : Promise.resolve(_out);
      return output.then((output) => {
        payload.value = output;
        return payload;
      });
    }
    if (_out instanceof Promise) {
      throw new $ZodAsyncError;
    }
    payload.value = _out;
    return payload;
  };
});
function handleOptionalResult(payload, result) {
  payload.value = result.issues.length ? undefined : result.value;
  return payload;
}
var $ZodOptional = /* @__PURE__ */ $constructor("$ZodOptional", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional");
  inst._zod.optout = "optional";
  defineLazyInternal(inst, "values", (zod) => {
    const values = zod.def.innerType._zod.values;
    return values ? new Set([...values, undefined]) : undefined;
  });
  defineLazyInternal(inst, "pattern", (zod) => {
    const pattern = zod.def.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : undefined;
  });
  inst._zod.parse = (payload, ctx) => {
    if (payload.value === undefined) {
      if (def.innerType._zod.optin !== "defaulted")
        return payload;
      const result = def.innerType._zod.run({ value: payload.value, issues: [] }, ctx);
      if (result instanceof Promise)
        return result.then((result) => handleOptionalResult(payload, result));
      return handleOptionalResult(payload, result);
    }
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodExactOptional = /* @__PURE__ */ $constructor("$ZodExactOptional", (inst, def) => {
  $ZodOptional.init(inst, def);
  defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
  defineLazyInternal(inst, "pattern", (zod) => zod.def.innerType._zod.pattern);
  inst._zod.parse = (payload, ctx) => {
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodNullable = /* @__PURE__ */ $constructor("$ZodNullable", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin);
  defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout);
  defineLazyInternal(inst, "pattern", (zod) => {
    const pattern = zod.def.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : undefined;
  });
  defineLazyInternal(inst, "values", (zod) => {
    return zod.def.innerType._zod.values ? new Set([...zod.def.innerType._zod.values, null]) : undefined;
  });
  inst._zod.parse = (payload, ctx) => {
    if (payload.value === null)
      return payload;
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodDefault = /* @__PURE__ */ $constructor("$ZodDefault", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "defaulted";
  defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    if (payload.value === undefined) {
      payload.value = def.defaultValue;
      return payload;
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result) => handleDefaultResult(result, def));
    }
    return handleDefaultResult(result, def);
  };
});
function handleDefaultResult(payload, def) {
  if (payload.value === undefined) {
    payload.value = def.defaultValue;
  }
  return payload;
}
var $ZodPrefault = /* @__PURE__ */ $constructor("$ZodPrefault", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "defaulted";
  defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    if (payload.value === undefined) {
      payload.value = def.defaultValue;
    }
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodNonOptional = /* @__PURE__ */ $constructor("$ZodNonOptional", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazyInternal(inst, "values", (zod) => {
    const v = zod.def.innerType._zod.values;
    return v ? new Set([...v].filter((x) => x !== undefined)) : undefined;
  });
  inst._zod.parse = (payload, ctx) => {
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result) => handleNonOptionalResult(result, inst));
    }
    return handleNonOptionalResult(result, inst);
  };
});
function handleNonOptionalResult(payload, inst) {
  if (!payload.issues.length && payload.value === undefined) {
    payload.issues.push({
      code: "invalid_type",
      expected: "nonoptional",
      input: payload.value,
      inst
    });
  }
  return payload;
}
function handleCatchResult(payload, result, def, ctx) {
  if (!result.issues.length) {
    payload.value = result.value;
    if (result.memo)
      payload.memo = true;
    return payload;
  }
  payload.value = def.catchValue({
    ...result,
    value: payload.value,
    error: {
      issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config()))
    },
    input: payload.value
  });
  return payload;
}
var $ZodCatch = /* @__PURE__ */ $constructor("$ZodCatch", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional");
  defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout);
  defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    const result = def.innerType._zod.run({ value: payload.value, issues: [] }, ctx);
    if (result instanceof Promise) {
      return result.then((result) => handleCatchResult(payload, result, def, ctx));
    }
    return handleCatchResult(payload, result, def, ctx);
  };
});
var $ZodPipe = /* @__PURE__ */ $constructor("$ZodPipe", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazyInternal(inst, "values", (zod) => zod.def.in._zod.values);
  defineLazyInternal(inst, "optin", (zod) => zod.def.in._zod.optin);
  defineLazyInternal(inst, "optout", (zod) => zod.def.out._zod.optout);
  defineLazyInternal(inst, "propValues", (zod) => zod.def.in._zod.propValues);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      const right = def.out._zod.run(payload, ctx);
      if (right instanceof Promise) {
        return right.then((right) => handlePipeResult(right, def.in, ctx));
      }
      return handlePipeResult(right, def.in, ctx);
    }
    const left = def.in._zod.run(payload, ctx);
    if (left instanceof Promise) {
      return left.then((left) => handlePipeResult(left, def.out, ctx));
    }
    return handlePipeResult(left, def.out, ctx);
  };
});
function handlePipeResult(left, next, ctx) {
  if (left.issues.some((iss) => iss.code !== "unrecognized_keys")) {
    left.aborted = true;
    return left;
  }
  return next._zod.run({ value: left.value, issues: left.issues }, ctx);
}
var $ZodReadonly = /* @__PURE__ */ $constructor("$ZodReadonly", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazyInternal(inst, "propValues", (zod) => zod.def.innerType._zod.propValues);
  defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
  defineLazyInternal(inst, "optin", (zod) => zod.def.innerType?._zod?.optin);
  defineLazyInternal(inst, "optout", (zod) => zod.def.innerType?._zod?.optout);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then(handleReadonlyResult);
    }
    return handleReadonlyResult(result);
  };
});
function handleReadonlyResult(payload) {
  if (!payload.memo)
    payload.value = Object.freeze(payload.value);
  return payload;
}
var $ZodLazy = /* @__PURE__ */ $constructor("$ZodLazy", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "innerType", () => {
    const d = def;
    if (!d._cachedInner)
      d._cachedInner = def.getter();
    return d._cachedInner;
  });
  defineLazyInternal(inst, "pattern", (zod) => zod.innerType?._zod?.pattern);
  defineLazyInternal(inst, "propValues", (zod) => zod.innerType?._zod?.propValues);
  defineLazyInternal(inst, "optin", (zod) => zod.innerType?._zod?.optin ?? undefined);
  defineLazyInternal(inst, "optout", (zod) => zod.innerType?._zod?.optout ?? undefined);
  inst._zod.parse = (payload, ctx) => {
    const inner = inst._zod.innerType;
    return inner._zod.run(payload, ctx);
  };
});
var $ZodCustom = /* @__PURE__ */ $constructor("$ZodCustom", (inst, def) => {
  $ZodCheck.init(inst, def);
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _) => {
    return payload;
  };
  inst._zod.check = (payload) => {
    const input = payload.value;
    const r = def.fn(input);
    if (r instanceof Promise) {
      return r.then((r) => handleRefineResult(r, payload, input, inst));
    }
    handleRefineResult(r, payload, input, inst);
    return;
  };
});
function handleRefineResult(result, payload, input, inst) {
  if (!result) {
    const _iss = {
      code: "custom",
      input,
      inst,
      path: [...inst._zod.def.path ?? []],
      continue: !inst._zod.def.abort
    };
    if (inst._zod.def.params)
      _iss.params = inst._zod.def.params;
    payload.issues.push(issue(_iss));
  }
}
function handlePropertiesResult(result, payload, key) {
  if (result.issues.length) {
    payload.issues.push(...prefixIssues(key, result.issues));
  }
}
var $ZodProperties = /* @__PURE__ */ $constructor("$ZodProperties", (inst, def) => {
  $ZodType.init(inst, def);
  $ZodCheck.init(inst, def);
  const memo = globalConfig.memoizer;
  memo?.attach(inst);
  let entries;
  const runShape = (payload, ctx) => {
    entries ?? (entries = Reflect.ownKeys(def.shape).map((key) => [key, def.shape[key]]));
    const input = payload.value;
    let proms;
    for (const [key, schema] of entries) {
      const result = schema._zod.run({ value: input[key], issues: [] }, ctx);
      if (result instanceof Promise) {
        proms ?? (proms = []);
        proms.push(result.then((result) => handlePropertiesResult(result, payload, key)));
      } else {
        handlePropertiesResult(result, payload, key);
      }
    }
    if (proms)
      return Promise.all(proms).then(() => {
        return;
      });
    return;
  };
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (input === null || typeof input !== "object" && typeof input !== "function") {
      payload.issues.push({ expected: "object", code: "invalid_type", input, inst });
      return payload;
    }
    if (ctx.direction === "backward")
      ctx = { ...ctx, direction: "forward" };
    if (memo)
      memo.alloc(inst, payload, input, ctx);
    const result = runShape(payload, ctx);
    return result instanceof Promise ? result.then(() => payload) : payload;
  };
  inst._zod.check = (payload) => {
    if (payload.value == null) {
      payload.issues.push({ expected: "object", code: "invalid_type", input: payload.value, inst });
      return;
    }
    return runShape(payload, {});
  };
}, {
  *[Symbol.iterator]() {
    yield this;
  }
});
// ../../worka-authoring-desktop-latest-20261017/node_modules/.bun/zod@4.6.1/node_modules/zod/v4/core/memoizer.js
class $ZodCyclicError extends Error {
  constructor() {
    super(`Cannot parse a reference cycle that closes through a transform`);
    this.name = "ZodCyclicError";
  }
}
var STATE = "~memo";
var NO_ISSUES = [];
function isRef(value) {
  return value !== null && (typeof value === "object" || typeof value === "function");
}
function cloneIssues(issues) {
  return issues.map((iss) => iss.path ? { ...iss, path: iss.path.slice() } : { ...iss });
}
var recursive = /* @__PURE__ */ new WeakMap;
var NONE = 0;
var ASSUMED = 1;
var PROVEN = 2;
function isRecursive(inst, stack, resolve) {
  const cached = recursive.get(inst);
  if (cached !== undefined)
    return cached ? PROVEN : NONE;
  if (stack.has(inst))
    return PROVEN;
  stack.add(inst);
  let result = NONE;
  const check = (child) => {
    if (result !== PROVEN && child?._zod) {
      const answer = isRecursive(child, stack, resolve);
      if (answer > result)
        result = answer;
    }
  };
  const shape = (sh, spread) => {
    let answer = NONE;
    for (const key of Reflect.ownKeys(sh)) {
      const desc = Object.getOwnPropertyDescriptor(sh, key);
      if (spread && !desc.enumerable)
        continue;
      const child = desc.get ? ASSUMED : desc.value?._zod ? isRecursive(desc.value, stack, resolve) : NONE;
      if (child > answer)
        answer = child;
    }
    return answer;
  };
  const merge = (answer) => {
    if (answer > result)
      result = answer;
  };
  const def = inst._zod.def;
  const kind = def.type;
  switch (kind) {
    case "object": {
      const raw = rawShape(def);
      merge(raw ? shape(raw, true) : ASSUMED);
      check(def.catchall);
      break;
    }
    case "properties":
      merge(shape(def.shape, false));
      break;
    case "array":
      check(def.element);
      break;
    case "tuple":
      for (const el of def.items)
        check(el);
      check(def.rest);
      break;
    case "record":
    case "map":
      check(def.keyType);
      check(def.valueType);
      break;
    case "set":
      check(def.valueType);
      break;
    case "union":
      for (const el of def.options)
        check(el);
      break;
    case "intersection":
      check(def.left);
      check(def.right);
      break;
    case "optional":
    case "nullable":
    case "default":
    case "prefault":
    case "catch":
    case "readonly":
    case "nonoptional":
    case "promise":
    case "success":
      check(def.innerType);
      break;
    case "pipe":
      check(def.in);
      check(def.out);
      break;
    case "function":
      check(def.input);
      check(def.output);
      break;
    case "lazy": {
      const inner = def._cachedInner ?? (resolve ? inst._zod.innerType : undefined);
      merge(inner ? isRecursive(inner, stack, false) : ASSUMED);
      break;
    }
    case "template_literal":
    case "string":
    case "number":
    case "int":
    case "boolean":
    case "bigint":
    case "symbol":
    case "undefined":
    case "null":
    case "void":
    case "never":
    case "any":
    case "unknown":
    case "date":
    case "nan":
    case "enum":
    case "literal":
    case "file":
    case "transform":
    case "custom":
      break;
    default: {
      for (const key in def) {
        const desc = Object.getOwnPropertyDescriptor(def, key);
        if (!desc || desc.get)
          continue;
        const value = desc.value;
        if (!value || typeof value !== "object")
          continue;
        if (value._zod)
          check(value);
        else if (Array.isArray(value))
          for (const el of value)
            check(el);
      }
    }
  }
  stack.delete(inst);
  return settle(inst, result);
}
function settle(inst, answer) {
  if (answer !== ASSUMED)
    recursive.set(inst, answer === PROVEN);
  return answer;
}
function bucketFor(state, inst) {
  let bucket = state.buckets.get(inst);
  if (!bucket) {
    bucket = new WeakMap;
    state.buckets.set(inst, bucket);
  }
  return bucket;
}
var handoff;
var open = [];
var memo = {
  alloc(_inst, payload, empty) {
    const bucket = handoff;
    if (!bucket)
      return empty;
    handoff = undefined;
    const entry = { value: empty, issues: null };
    bucket.set(payload.value, entry);
    open.push(entry);
    return empty;
  },
  guard(inst) {
    var _a;
    (_a = inst._zod).deferred ?? (_a.deferred = []);
    inst._zod.deferred.push(() => {
      const base = inst._zod.parse;
      const wrapped = (payload, ctx) => {
        if (ctx.direction !== "backward" && isBackEdge(ctx, payload.value))
          throw new $ZodCyclicError;
        return base(payload, ctx);
      };
      inst._zod.parse = wrapped;
      if (inst._zod.run === base)
        inst._zod.run = wrapped;
    });
  },
  attach(inst) {
    var _a;
    let isRecursiveInst;
    let rechecked = false;
    let lastCtx;
    let lastBucket;
    (_a = inst._zod).deferred ?? (_a.deferred = []);
    inst._zod.deferred.push(() => {
      const base = inst._zod.parse;
      const wrapped = (payload, ctx) => {
        if (isRecursiveInst === undefined) {
          const walked = isRecursive(inst, new Set, false);
          if (walked === NONE) {
            inst._zod.parse = base;
            if (inst._zod.run === wrapped)
              inst._zod.run = base;
            return base(payload, ctx);
          }
          if (walked === PROVEN || rechecked)
            isRecursiveInst = true;
          else
            rechecked = true;
        }
        const input = payload.value;
        if (!isRef(input))
          return base(payload, ctx);
        let state = ctx[STATE];
        if (!state) {
          state = { buckets: new WeakMap, backEdges: undefined };
          ctx[STATE] = state;
        }
        let bucket;
        if (lastCtx === ctx) {
          bucket = lastBucket;
        } else {
          bucket = bucketFor(state, inst);
          lastCtx = ctx;
          lastBucket = bucket;
        }
        const hit = bucket.get(input);
        if (hit) {
          payload.value = hit.value;
          if (hit.issues) {
            if (hit.issues.length)
              payload.issues.push(...cloneIssues(hit.issues));
          } else {
            payload.memo = true;
            state.backEdges ?? (state.backEdges = new WeakSet);
            state.backEdges.add(hit.value);
          }
          return payload;
        }
        handoff = bucket;
        const depth = open.length;
        const result = base(payload, ctx);
        handoff = undefined;
        const entry = open.length > depth ? open.pop() : undefined;
        if (result instanceof Promise) {
          return result.then((r) => {
            if (entry)
              entry.issues = r.issues.length ? cloneIssues(r.issues) : NO_ISSUES;
            return r;
          });
        }
        if (entry)
          entry.issues = result.issues.length ? cloneIssues(result.issues) : NO_ISSUES;
        return result;
      };
      inst._zod.parse = wrapped;
      if (inst._zod.run === base)
        inst._zod.run = wrapped;
    });
  }
};
function memoizer() {
  return memo;
}
function isBackEdge(ctx, value) {
  const backEdges = ctx[STATE]?.backEdges;
  return backEdges !== undefined && isRef(value) && backEdges.has(value);
}
// ../../worka-authoring-desktop-latest-20261017/node_modules/.bun/zod@4.6.1/node_modules/zod/v4/locales/en.js
var error = () => {
  const Sizable = {
    string: { unit: "characters", verb: "to have" },
    file: { unit: "bytes", verb: "to have" },
    array: { unit: "items", verb: "to have" },
    set: { unit: "items", verb: "to have" },
    map: { unit: "entries", verb: "to have" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "input",
    email: "email address",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datetime",
    date: "ISO date",
    time: "ISO time",
    duration: "ISO duration",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    mac: "MAC address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded string",
    base64url: "base64url-encoded string",
    json_string: "JSON string",
    e164: "E.164 number",
    credit_card: "credit card number",
    iban: "IBAN",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  function getTypeName(type, input) {
    if (type === "number" && typeof input === "number" && !Number.isFinite(input)) {
      return String(input);
    }
    return TypeDictionary[type] ?? type;
  }
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = getTypeName(issue.expected);
        const receivedType = parsedType(issue.input);
        const received = getTypeName(receivedType, issue.input);
        return `Invalid input: expected ${expected}, received ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Invalid input: expected ${stringifyPrimitive(issue.values[0])}`;
        return `Invalid option: expected one of ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.exact ? "exactly " : issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `Too big: expected ${issue.origin ?? "value"} to have ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elements"}`;
        return `Too big: expected ${issue.origin ?? "value"} to be ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.exact ? "exactly " : issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `Too small: expected ${issue.origin} to have ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `Too small: expected ${issue.origin} to be ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return `Invalid string: must start with "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Invalid string: must end with "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Invalid string: must include "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Invalid string: must match pattern ${_issue.pattern}`;
        return `Invalid ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Invalid number: must be a multiple of ${issue.divisor}`;
      case "unrecognized_keys":
        return `Unrecognized key${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Invalid key in ${issue.origin}`;
      case "invalid_union":
        if (issue.options && Array.isArray(issue.options) && issue.options.length > 0) {
          const opts = issue.options.map((o) => `'${o}'`).join(" | ");
          return `Invalid discriminator value. Expected ${opts}`;
        }
        if (issue.inclusive === false) {
          return "Invalid input: more than one option matched";
        }
        return "Invalid input";
      case "invalid_element":
        return `Invalid value in ${issue.origin}`;
      default:
        return `Invalid input`;
    }
  };
};
function en_default() {
  return {
    localeError: error()
  };
}
// ../../worka-authoring-desktop-latest-20261017/node_modules/.bun/zod@4.6.1/node_modules/zod/v4/core/registries.js
var _a2;
class $ZodRegistry {
  constructor() {
    this._map = new WeakMap;
    this._idmap = new Map;
  }
  add(schema, ..._meta) {
    const meta = _meta[0];
    this._map.set(schema, meta);
    if (meta && typeof meta === "object" && "id" in meta) {
      this._idmap.set(meta.id, schema);
    }
    return this;
  }
  clear() {
    this._map = new WeakMap;
    this._idmap = new Map;
    return this;
  }
  remove(schema) {
    const meta = this._map.get(schema);
    if (meta && typeof meta === "object" && "id" in meta) {
      this._idmap.delete(meta.id);
    }
    this._map.delete(schema);
    return this;
  }
  get(schema) {
    const p = schema._zod.parent;
    if (p) {
      const pm = { ...this.get(p) ?? {} };
      delete pm.id;
      const f = { ...pm, ...this._map.get(schema) };
      return Object.keys(f).length ? f : undefined;
    }
    return this._map.get(schema);
  }
  has(schema) {
    return this._map.has(schema);
  }
}
function registry() {
  return new $ZodRegistry;
}
(_a2 = globalThis).__zod_globalRegistry ?? (_a2.__zod_globalRegistry = registry());
var globalRegistry = globalThis.__zod_globalRegistry;
// ../../worka-authoring-desktop-latest-20261017/node_modules/.bun/zod@4.6.1/node_modules/zod/v4/core/api.js
function _string(Class, params) {
  return new Class({
    type: "string",
    ...normalizeParams(params)
  });
}
function _email(Class, params) {
  return new Class({
    type: "string",
    format: "email",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _guid(Class, params) {
  return new Class({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _uuid(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _uuidv4(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v4",
    ...normalizeParams(params)
  });
}
function _uuidv6(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v6",
    ...normalizeParams(params)
  });
}
function _uuidv7(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v7",
    ...normalizeParams(params)
  });
}
function _url(Class, params) {
  return new Class({
    type: "string",
    format: "url",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _emoji2(Class, params) {
  return new Class({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _nanoid(Class, params) {
  return new Class({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _cuid(Class, params) {
  return new Class({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _cuid2(Class, params) {
  return new Class({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _ulid(Class, params) {
  return new Class({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _xid(Class, params) {
  return new Class({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _ksuid(Class, params) {
  return new Class({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _ipv4(Class, params) {
  return new Class({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _ipv6(Class, params) {
  return new Class({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _cidrv4(Class, params) {
  return new Class({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _cidrv6(Class, params) {
  return new Class({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _base64(Class, params) {
  return new Class({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _base64url(Class, params) {
  return new Class({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _e164(Class, params) {
  return new Class({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _jwt(Class, params) {
  return new Class({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _isoDateTime(Class, params) {
  return new Class({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: false,
    local: false,
    precision: null,
    ...normalizeParams(params)
  });
}
function _isoDate(Class, params) {
  return new Class({
    type: "string",
    format: "date",
    check: "string_format",
    ...normalizeParams(params)
  });
}
function _isoTime(Class, params) {
  return new Class({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...normalizeParams(params)
  });
}
function _isoDuration(Class, params) {
  return new Class({
    type: "string",
    format: "duration",
    check: "string_format",
    ...normalizeParams(params)
  });
}
function _number(Class, params) {
  return new Class({
    type: "number",
    checks: [],
    ...normalizeParams(params)
  });
}
function _int(Class, params) {
  return new Class({
    type: "number",
    check: "number_format",
    abort: false,
    format: "safeint",
    ...normalizeParams(params)
  });
}
function _boolean(Class, params) {
  return new Class({
    type: "boolean",
    ...normalizeParams(params)
  });
}
function _null2(Class, params) {
  return new Class({
    type: "null",
    ...normalizeParams(params)
  });
}
function _unknown(Class) {
  return new Class({
    type: "unknown"
  });
}
function _never(Class, params) {
  return new Class({
    type: "never",
    ...normalizeParams(params)
  });
}
function _lt(value, params) {
  return new $ZodCheckLessThan({
    check: "less_than",
    ...normalizeParams(params),
    value,
    inclusive: false
  });
}
function _lte(value, params) {
  return new $ZodCheckLessThan({
    check: "less_than",
    ...normalizeParams(params),
    value,
    inclusive: true
  });
}
function _gt(value, params) {
  return new $ZodCheckGreaterThan({
    check: "greater_than",
    ...normalizeParams(params),
    value,
    inclusive: false
  });
}
function _gte(value, params) {
  return new $ZodCheckGreaterThan({
    check: "greater_than",
    ...normalizeParams(params),
    value,
    inclusive: true
  });
}
function _multipleOf(value, params) {
  return new $ZodCheckMultipleOf({
    check: "multiple_of",
    ...normalizeParams(params),
    value
  });
}
function _maxLength(maximum, params) {
  const ch = new $ZodCheckMaxLength({
    check: "max_length",
    ...normalizeParams(params),
    maximum
  });
  return ch;
}
function _minLength(minimum, params) {
  return new $ZodCheckMinLength({
    check: "min_length",
    ...normalizeParams(params),
    minimum
  });
}
function _length(length, params) {
  return new $ZodCheckLengthEquals({
    check: "length_equals",
    ...normalizeParams(params),
    length
  });
}
function _regex(pattern, params) {
  return new $ZodCheckRegex({
    check: "string_format",
    format: "regex",
    ...normalizeParams(params),
    pattern
  });
}
function _lowercase(params) {
  return new $ZodCheckLowerCase({
    check: "string_format",
    format: "lowercase",
    ...normalizeParams(params)
  });
}
function _uppercase(params) {
  return new $ZodCheckUpperCase({
    check: "string_format",
    format: "uppercase",
    ...normalizeParams(params)
  });
}
function _includes(includes, params) {
  return new $ZodCheckIncludes({
    check: "string_format",
    format: "includes",
    ...normalizeParams(params),
    includes
  });
}
function _startsWith(prefix, params) {
  return new $ZodCheckStartsWith({
    check: "string_format",
    format: "starts_with",
    ...normalizeParams(params),
    prefix
  });
}
function _endsWith(suffix, params) {
  return new $ZodCheckEndsWith({
    check: "string_format",
    format: "ends_with",
    ...normalizeParams(params),
    suffix
  });
}
function _overwrite(tx) {
  return new $ZodCheckOverwrite({
    check: "overwrite",
    tx
  });
}
function _normalize(form) {
  return _overwrite((input) => input.normalize(form));
}
function _trim() {
  return _overwrite((input) => input.trim());
}
function _toLowerCase() {
  return _overwrite((input) => input.toLowerCase());
}
function _toUpperCase() {
  return _overwrite((input) => input.toUpperCase());
}
function _slugify() {
  return _overwrite((input) => slugify(input));
}
function _array(Class, element, params) {
  return new Class({
    type: "array",
    element,
    ...normalizeParams(params)
  });
}
function _refine(Class, fn, _params) {
  const schema = new Class({
    type: "custom",
    check: "custom",
    fn,
    ...normalizeParams(_params)
  });
  return schema;
}
function _superRefine(fn, params) {
  const ch = _check((payload) => {
    payload.addIssue = (issue2) => {
      if (typeof issue2 === "string") {
        payload.issues.push(issue(issue2, payload.value, ch._zod.def));
      } else {
        const _issue = issue2;
        if (_issue.fatal)
          _issue.continue = false;
        _issue.code ?? (_issue.code = "custom");
        if (!("input" in _issue))
          _issue.input = payload.value;
        _issue.inst ?? (_issue.inst = ch);
        _issue.continue ?? (_issue.continue = !ch._zod.def.abort);
        payload.issues.push(issue(_issue));
      }
    };
    return fn(payload.value, payload);
  }, params);
  return ch;
}
function _check(fn, params) {
  const ch = new $ZodCheck({
    check: "custom",
    ...normalizeParams(params)
  });
  ch._zod.check = fn;
  return ch;
}
// ../../worka-authoring-desktop-latest-20261017/node_modules/.bun/zod@4.6.1/node_modules/zod/v4/core/to-json-schema.js
function assignProps(target, ...sources) {
  for (const source of sources) {
    for (const key of Reflect.ownKeys(source)) {
      if (Object.prototype.propertyIsEnumerable.call(source, key)) {
        assignProp(target, key, source[key]);
      }
    }
  }
  return target;
}
function initializeContext(params) {
  let target = params?.target ?? "draft-2020-12";
  if (target === "draft-4")
    target = "draft-04";
  if (target === "draft-7")
    target = "draft-07";
  return {
    processors: params.processors ?? {},
    metadataRegistry: params?.metadata ?? globalRegistry,
    target,
    unrepresentable: params?.unrepresentable ?? "throw",
    override: params?.override ?? (() => {}),
    io: params?.io ?? "output",
    counter: 0,
    seen: new Map,
    sharedDefsExtractedFor: undefined,
    sharedEmitDoneFor: undefined,
    cycles: params?.cycles ?? "ref",
    reused: params?.reused ?? "inline",
    intersections: [],
    deferred: [],
    external: params?.external ?? undefined
  };
}
function handleUnrepresentable(schema, ctx, json, params, message) {
  const result = typeof ctx.unrepresentable === "function" ? ctx.unrepresentable({ zodSchema: schema, path: params.path, message }) : ctx.unrepresentable;
  if (result === "any")
    return false;
  if (result === undefined || result === "throw")
    throw new Error(message);
  Object.assign(json, result);
  return true;
}
function processSchema(schema, ctx, _params = { path: [], schemaPath: [] }) {
  var _a;
  const def = schema._zod.def;
  const seen = ctx.seen.get(schema);
  if (seen) {
    seen.count++;
    const isCycle = _params.schemaPath.includes(schema);
    if (isCycle) {
      seen.cycle = _params.path;
    }
    return seen.schema;
  }
  const result = { schema: {}, count: 1, cycle: undefined, path: _params.path };
  ctx.seen.set(schema, result);
  ctx.sharedDefsExtractedFor = undefined;
  ctx.sharedEmitDoneFor = undefined;
  const overrideSchema = schema._zod.toJSONSchema?.();
  if (overrideSchema) {
    result.schema = overrideSchema;
  } else {
    const params = {
      ..._params,
      schemaPath: [..._params.schemaPath, schema],
      path: _params.path
    };
    if (schema._zod.processJSONSchema) {
      schema._zod.processJSONSchema(ctx, result.schema, params);
    } else {
      const _json = result.schema;
      const processor = ctx.processors[def.type];
      if (!processor) {
        throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
      }
      processor(schema, ctx, _json, params);
    }
    const parent = schema._zod.parent;
    if (parent) {
      if (!result.ref)
        result.ref = parent;
      processSchema(parent, ctx, params);
      ctx.seen.get(parent).isParent = true;
    }
  }
  const meta = ctx.metadataRegistry.get(schema);
  if (meta)
    assignProps(result.schema, meta);
  if (ctx.io === "input" && isTransforming(schema)) {
    delete result.schema.examples;
    delete result.schema.default;
  }
  if (ctx.io === "input" && "_prefault" in result.schema)
    (_a = result.schema).default ?? (_a.default = result.schema._prefault);
  delete result.schema._prefault;
  const _result = ctx.seen.get(schema);
  return _result.schema;
}
function encodeJSONPointerSegment(segment) {
  return segment.replace(/~/g, "~0").replace(/\//g, "~1");
}
function extractDefs(ctx, schema) {
  const root = ctx.seen.get(schema);
  if (!root)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  if (ctx.external && ctx.sharedDefsExtractedFor === ctx.external)
    return;
  const idToSchema = new Map;
  for (const entry of ctx.seen.entries()) {
    const id = ctx.metadataRegistry.get(entry[0])?.id;
    if (id) {
      const existing = idToSchema.get(id);
      if (existing && existing !== entry[0]) {
        throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
      }
      idToSchema.set(id, entry[0]);
    }
  }
  const makeURI = (entry) => {
    const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
    if (ctx.external) {
      const externalId = ctx.external.registry.get(entry[0])?.id;
      const uriGenerator = ctx.external.uri ?? ((id) => id);
      if (externalId) {
        return { ref: uriGenerator(externalId) };
      }
      const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
      entry[1].defId = id;
      return { defId: id, ref: `${uriGenerator("__shared")}#/${defsSegment}/${encodeJSONPointerSegment(id)}` };
    }
    const uriPrefix = `#`;
    const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
    if (entry[1] === root && !entry[1].schema.id) {
      return { ref: uriPrefix };
    }
    const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
    return { defId, ref: defUriPrefix + encodeJSONPointerSegment(defId) };
  };
  const extractToDef = (entry) => {
    if (entry[1].schema.$ref) {
      return;
    }
    const seen = entry[1];
    const { ref, defId } = makeURI(entry);
    seen.def = { ...seen.schema };
    if (defId)
      seen.defId = defId;
    const schema = seen.schema;
    for (const key in schema) {
      delete schema[key];
    }
    schema.$ref = ref;
  };
  if (ctx.cycles === "throw") {
    for (const entry of ctx.seen.entries()) {
      const seen = entry[1];
      if (seen.cycle) {
        throw new Error("Cycle detected: " + `#/${seen.cycle?.join("/")}/<root>` + '\n\nSet the `cycles` parameter to `"ref"` to resolve cyclical schemas with defs.');
      }
    }
  }
  for (const entry of ctx.seen.entries()) {
    const seen = entry[1];
    if (schema === entry[0]) {
      extractToDef(entry);
      continue;
    }
    if (ctx.external) {
      const ext = ctx.external.registry.get(entry[0])?.id;
      if (schema !== entry[0] && ext) {
        extractToDef(entry);
        continue;
      }
    }
    const id = ctx.metadataRegistry.get(entry[0])?.id;
    if (id) {
      extractToDef(entry);
      continue;
    }
    if (seen.cycle) {
      extractToDef(entry);
      continue;
    }
    if (seen.count > 1) {
      if (ctx.reused === "ref") {
        extractToDef(entry);
      }
    }
  }
  if (ctx.external)
    ctx.sharedDefsExtractedFor = ctx.external;
}
function compactTypeUnion(schema) {
  const options = schema.anyOf;
  if (!Array.isArray(options) || options.length === 0 || schema.type !== undefined)
    return;
  const types = [];
  for (const option of options) {
    if (!option || typeof option !== "object")
      return;
    compactTypeUnion(option);
    const keys = Object.keys(option);
    if (keys.length !== 1 || keys[0] !== "type")
      return;
    const type = option.type;
    for (const member of Array.isArray(type) ? type : [type]) {
      if (typeof member !== "string")
        return;
      if (!types.includes(member))
        types.push(member);
    }
  }
  delete schema.anyOf;
  schema.type = types.length === 1 ? types[0] : types;
}
var FOLDABLE_KEYS = new Set(["type", "properties", "required", "additionalProperties"]);
var UNION_KEYS = ["oneOf", "anyOf"];
function undeclaredConstraint(member) {
  const extra = member.additionalProperties;
  if (extra === undefined || extra === false || typeof extra !== "object" || extra === null)
    return null;
  return Object.keys(extra).length ? extra : null;
}
function foldObjects(members) {
  const objects = [];
  for (const member of members) {
    if (typeof member !== "object" || member.type !== "object")
      return null;
    for (const key in member) {
      if (!FOLDABLE_KEYS.has(key))
        return null;
    }
    objects.push(member);
  }
  const properties = {};
  const required = new Set;
  for (const object of objects) {
    for (const key in object.properties) {
      if (Object.prototype.hasOwnProperty.call(properties, key))
        continue;
      const parts = [];
      for (const other of objects) {
        const part = other.properties?.[key] ?? undeclaredConstraint(other);
        if (part === null || part === undefined)
          continue;
        if (!parts.some((seen) => JSON.stringify(seen) === JSON.stringify(part)))
          parts.push(part);
      }
      const merged = parts.length === 1 ? parts[0] : foldObjects(parts) ?? { allOf: parts };
      assignProp(properties, key, merged);
    }
    for (const key of object.required ?? [])
      required.add(key);
  }
  const folded = { type: "object", properties };
  if (required.size)
    folded.required = [...required];
  if (objects.every((object) => object.additionalProperties === false)) {
    folded.additionalProperties = false;
  } else {
    const constraints = [];
    for (const object of objects) {
      const constraint = undeclaredConstraint(object);
      if (constraint && !constraints.some((seen) => JSON.stringify(seen) === JSON.stringify(constraint)))
        constraints.push(constraint);
    }
    if (constraints.length === 1)
      folded.additionalProperties = constraints[0];
    else if (constraints.length > 1)
      folded.additionalProperties = { allOf: constraints };
  }
  return folded;
}
function foldIntersection(json) {
  const allOf = json.allOf;
  if (!Array.isArray(allOf) || allOf.length < 2)
    return;
  for (const key of FOLDABLE_KEYS)
    if (key in json)
      return;
  const unions = allOf.filter((m) => UNION_KEYS.some((k) => Array.isArray(m[k])));
  let folded = null;
  if (!unions.length) {
    folded = foldObjects(allOf);
  } else {
    const union = unions[0];
    const keyword = UNION_KEYS.find((k) => Array.isArray(union[k]));
    if (Object.keys(union).length !== 1)
      return;
    const rest = allOf.filter((m) => m !== union);
    const branches = union[keyword].map((branch) => foldObjects([...rest, branch]));
    if (branches.some((b) => !b))
      return;
    folded = { [keyword]: branches };
  }
  if (!folded)
    return;
  delete json.allOf;
  assignProps(json, folded);
}
function finalize(ctx, schema) {
  const root = ctx.seen.get(schema);
  if (!root)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const flattenRef = (zodSchema) => {
    const seen = ctx.seen.get(zodSchema);
    if (seen.ref === null)
      return;
    const schema = seen.def ?? seen.schema;
    const _cached = { ...schema };
    const ref = seen.ref;
    seen.ref = null;
    if (ref) {
      flattenRef(ref);
      const refSeen = ctx.seen.get(ref);
      const refSchema = refSeen.schema;
      if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
        schema.allOf = schema.allOf ?? [];
        schema.allOf.push(refSchema);
      } else {
        assignProps(schema, refSchema);
      }
      assignProps(schema, _cached);
      const isParentRef = zodSchema._zod.parent === ref;
      if (isParentRef) {
        for (const key in schema) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (!(key in _cached)) {
            delete schema[key];
          }
        }
      }
      if (refSchema.$ref && refSeen.def) {
        for (const key in schema) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) {
            delete schema[key];
          }
        }
      }
    }
    const parent = zodSchema._zod.parent;
    if (parent && parent !== ref) {
      flattenRef(parent);
      const parentSeen = ctx.seen.get(parent);
      if (parentSeen?.schema.$ref) {
        schema.$ref = parentSeen.schema.$ref;
        if (parentSeen.def) {
          for (const key in schema) {
            if (key === "$ref" || key === "allOf")
              continue;
            if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) {
              delete schema[key];
            }
          }
        }
      }
    }
    ctx.override({
      zodSchema,
      jsonSchema: schema,
      path: seen.path ?? []
    });
  };
  if (!ctx.external || ctx.sharedEmitDoneFor !== ctx.external) {
    for (const entry of [...ctx.seen.entries()].reverse()) {
      flattenRef(entry[0]);
    }
    if (ctx.target !== "openapi-3.0") {
      for (const entry of ctx.seen.entries()) {
        compactTypeUnion(entry[1].def ?? entry[1].schema);
      }
    }
    for (const rewrite of ctx.deferred)
      rewrite();
    if (ctx.intersections.length) {
      const carriers = new Map;
      for (const seen of ctx.seen.values()) {
        for (const json of [seen.schema, seen.def]) {
          const allOf = json?.allOf;
          if (!Array.isArray(allOf))
            continue;
          const existing = carriers.get(allOf);
          if (existing)
            existing.push(json);
          else
            carriers.set(allOf, [json]);
        }
      }
      for (const allOf of ctx.intersections) {
        for (const json of carriers.get(allOf) ?? [])
          foldIntersection(json);
      }
    }
  }
  const result = {};
  if (ctx.target === "draft-2020-12") {
    result.$schema = "https://json-schema.org/draft/2020-12/schema";
  } else if (ctx.target === "draft-07") {
    result.$schema = "http://json-schema.org/draft-07/schema#";
  } else if (ctx.target === "draft-04") {
    result.$schema = "http://json-schema.org/draft-04/schema#";
  } else if (ctx.target === "openapi-3.0") {}
  if (ctx.external?.uri) {
    const id = ctx.external.registry.get(schema)?.id;
    if (!id)
      throw new Error("Schema is missing an `id` property");
    result.$id = ctx.external.uri(id);
  }
  assignProps(result, root.defId ? root.schema : root.def ?? root.schema);
  const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
  if (rootMetaId !== undefined && result.id === rootMetaId)
    delete result.id;
  const defs = ctx.external?.defs ?? {};
  if (!ctx.external || ctx.sharedEmitDoneFor !== ctx.external) {
    for (const entry of ctx.seen.entries()) {
      const seen = entry[1];
      if (seen.def && seen.defId) {
        if (seen.def.id === seen.defId)
          delete seen.def.id;
        assignProp(defs, seen.defId, seen.def);
      }
    }
  }
  if (ctx.external)
    ctx.sharedEmitDoneFor = ctx.external;
  if (ctx.external) {} else {
    if (Object.keys(defs).length > 0) {
      if (ctx.target === "draft-2020-12") {
        result.$defs = defs;
      } else {
        result.definitions = defs;
      }
    }
  }
  try {
    const finalized = JSON.parse(JSON.stringify(result));
    Object.defineProperty(finalized, "~standard", {
      value: {
        ...schema["~standard"],
        jsonSchema: {
          input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
          output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
        }
      },
      enumerable: false,
      writable: false
    });
    return finalized;
  } catch (_err) {
    throw new Error("Error converting schema to JSON.");
  }
}
function isTransforming(_schema, _ctx) {
  const ctx = _ctx ?? { seen: new Set };
  if (ctx.seen.has(_schema))
    return false;
  ctx.seen.add(_schema);
  const def = _schema._zod.def;
  if (def.type === "transform")
    return true;
  if (def.type === "array")
    return isTransforming(def.element, ctx);
  if (def.type === "set")
    return isTransforming(def.valueType, ctx);
  if (def.type === "lazy")
    return isTransforming(def.getter(), ctx);
  if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault" || def.type === "catch") {
    return isTransforming(def.innerType, ctx);
  }
  if (def.type === "intersection") {
    return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
  }
  if (def.type === "record" || def.type === "map") {
    return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
  }
  if (def.type === "pipe") {
    if (_schema._zod.traits.has("$ZodCodec"))
      return true;
    return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
  }
  if (def.type === "object") {
    for (const key in def.shape) {
      if (isTransforming(def.shape[key], ctx))
        return true;
    }
    return false;
  }
  if (def.type === "union") {
    for (const option of def.options) {
      if (isTransforming(option, ctx))
        return true;
    }
    return false;
  }
  if (def.type === "tuple") {
    for (const item of def.items) {
      if (isTransforming(item, ctx))
        return true;
    }
    if (def.rest && isTransforming(def.rest, ctx))
      return true;
    return false;
  }
  return false;
}
var createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
  const ctx = initializeContext({ ...params, processors });
  processSchema(schema, ctx);
  extractDefs(ctx, schema);
  return finalize(ctx, schema);
};
var createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
  const { libraryOptions, target } = params ?? {};
  const ctx = initializeContext({ ...libraryOptions ?? {}, target, io, processors });
  processSchema(schema, ctx);
  extractDefs(ctx, schema);
  return finalize(ctx, schema);
};
// ../../worka-authoring-desktop-latest-20261017/node_modules/.bun/zod@4.6.1/node_modules/zod/v4/core/json-schema-processors.js
var narrowMin = (agg, key, value) => {
  if (agg[key] === undefined || value > agg[key])
    agg[key] = value;
};
var narrowMax = (agg, key, value) => {
  if (agg[key] === undefined || value < agg[key])
    agg[key] = value;
};
var narrowBoth = (agg, value) => {
  narrowMin(agg, "minimum", value);
  narrowMax(agg, "maximum", value);
};
var addDivisor = (agg, value) => {
  agg.multipleOf ?? (agg.multipleOf = []);
  if (!agg.multipleOf.includes(value))
    agg.multipleOf.push(value);
};
var addPattern = (agg, pattern) => {
  agg.patterns ?? (agg.patterns = new Set);
  agg.patterns.add(pattern);
};
var intersectMime = (agg, mime) => {
  agg.mime = agg.mime ? agg.mime.filter((m) => mime.includes(m)) : [...mime];
};
var setFormat = (agg, format) => {
  agg.format = format;
  if (format.includes("int"))
    agg.isInt = true;
};
var minContributor = (agg, def) => narrowMin(agg, "minimum", def.minimum);
var maxContributor = (agg, def) => narrowMax(agg, "maximum", def.maximum);
var formatContributor = (ranges) => (agg, def) => {
  setFormat(agg, def.format);
  const [minimum, maximum] = ranges[def.format];
  narrowMin(agg, "minimum", minimum);
  narrowMax(agg, "maximum", maximum);
};
var contributors = {
  greater_than: (agg, def) => narrowMin(agg, def.inclusive ? "minimum" : "exclusiveMinimum", def.value),
  less_than: (agg, def) => narrowMax(agg, def.inclusive ? "maximum" : "exclusiveMaximum", def.value),
  multiple_of: (agg, def) => addDivisor(agg, def.value),
  number_format: formatContributor(NUMBER_FORMAT_RANGES),
  bigint_format: formatContributor(BIGINT_FORMAT_RANGES),
  min_length: minContributor,
  max_length: maxContributor,
  length_equals: (agg, def) => narrowBoth(agg, def.length),
  min_size: minContributor,
  max_size: maxContributor,
  size_equals: (agg, def) => narrowBoth(agg, def.size),
  string_format: (agg, def) => {
    setFormat(agg, def.format);
    if (def.pattern)
      addPattern(agg, def.pattern);
    if (def.format === "base64" || def.format === "base64url")
      agg.contentEncoding = def.format;
    if (def.local || def.precision === -1)
      agg.laxFormat = true;
  },
  mime_type: (agg, def) => intersectMime(agg, def.mime)
};
function aggregateChecks(schema) {
  const agg = {};
  const def = schema._zod.def;
  const list = schema._zod.traits.has("$ZodCheck") ? [schema, ...def.checks ?? []] : def.checks ?? [];
  for (const ch of list)
    contributors[ch._zod.def.check]?.(agg, ch._zod.def);
  const bag = schema._zod.bag;
  if (bag.minimum !== undefined)
    narrowMin(agg, "minimum", bag.minimum);
  if (bag.exclusiveMinimum !== undefined)
    narrowMin(agg, "exclusiveMinimum", bag.exclusiveMinimum);
  if (bag.maximum !== undefined)
    narrowMax(agg, "maximum", bag.maximum);
  if (bag.exclusiveMaximum !== undefined)
    narrowMax(agg, "exclusiveMaximum", bag.exclusiveMaximum);
  if (bag.multipleOf !== undefined)
    addDivisor(agg, bag.multipleOf);
  if (bag.format !== undefined) {
    agg.format ?? (agg.format = bag.format);
    if (bag.format.includes("int"))
      agg.isInt = true;
  }
  if (bag.mime)
    intersectMime(agg, bag.mime);
  for (const pattern of bag.patterns ?? [])
    addPattern(agg, pattern);
  return agg;
}
var formatMap = {
  guid: "uuid",
  url: "uri",
  datetime: "date-time",
  json_string: "json-string",
  regex: ""
};
var exactPatterns = new Map([
  [base64Charset, base64],
  [base64urlCharset, base64url]
]);
var exactPattern = (p) => exactPatterns.get(p) ?? p;
var stringProcessor = (schema, ctx, _json, _params) => {
  const json = _json;
  json.type = "string";
  const { minimum, maximum, format, patterns, contentEncoding, laxFormat } = aggregateChecks(schema);
  if (typeof minimum === "number")
    json.minLength = minimum;
  if (typeof maximum === "number")
    json.maxLength = maximum;
  if (format) {
    json.format = formatMap[format] ?? format;
    if (json.format === "")
      delete json.format;
    if (format === "time" || laxFormat) {
      delete json.format;
    }
  }
  if (contentEncoding)
    json.contentEncoding = contentEncoding;
  if (patterns && patterns.size > 0) {
    const patternList = [...patterns].map(exactPattern);
    if (patternList.length === 1)
      json.pattern = patternList[0].source;
    else if (patternList.length > 1) {
      json.allOf = [
        ...patternList.map((regex) => ({
          ...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
          pattern: regex.source
        }))
      ];
    }
  }
};
var numberProcessor = (schema, ctx, _json, params) => {
  const json = _json;
  const { minimum, maximum, multipleOf, exclusiveMaximum, exclusiveMinimum, isInt } = aggregateChecks(schema);
  json.type = isInt ? "integer" : "number";
  const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
  const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
  const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
  if (exMin) {
    if (legacy) {
      json.minimum = exclusiveMinimum;
      json.exclusiveMinimum = true;
    } else {
      json.exclusiveMinimum = exclusiveMinimum;
    }
  } else if (typeof minimum === "number") {
    json.minimum = minimum;
  }
  if (exMax) {
    if (legacy) {
      json.maximum = exclusiveMaximum;
      json.exclusiveMaximum = true;
    } else {
      json.exclusiveMaximum = exclusiveMaximum;
    }
  } else if (typeof maximum === "number") {
    json.maximum = maximum;
  }
  if (multipleOf) {
    const divisors = new Set;
    for (const divisor of multipleOf) {
      if (Number.isFinite(divisor) && divisor !== 0)
        divisors.add(Math.abs(divisor));
      else
        handleUnrepresentable(schema, ctx, json, params, `A multipleOf divisor of ${divisor} cannot be represented in JSON Schema`);
    }
    const [first, ...rest] = divisors;
    if (first !== undefined)
      json.multipleOf = first;
    if (rest.length)
      json.allOf = [...json.allOf ?? [], ...rest.map((m) => ({ multipleOf: m }))];
  }
};
var booleanProcessor = (_schema, _ctx, json, _params) => {
  json.type = "boolean";
};
var nullProcessor = (_schema, ctx, json, _params) => {
  if (ctx.target === "openapi-3.0") {
    json.type = "string";
    json.nullable = true;
    json.enum = [null];
  } else {
    json.type = "null";
  }
};
var neverProcessor = (_schema, _ctx, json, _params) => {
  json.not = {};
};
var unknownProcessor = (_schema, _ctx, _json, _params) => {};
var enumProcessor = (schema, _ctx, json, _params) => {
  const def = schema._zod.def;
  const values = getEnumValues(def.entries);
  if (values.length === 0) {
    json.not = {};
    return;
  }
  if (values.every((v) => typeof v === "number"))
    json.type = "number";
  if (values.every((v) => typeof v === "string"))
    json.type = "string";
  json.enum = values;
};
var literalProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  if (def.values.length === 0) {
    json.not = {};
    return;
  }
  const vals = [];
  for (const val of def.values) {
    if (val === undefined) {
      if (handleUnrepresentable(schema, ctx, json, params, "Literal `undefined` cannot be represented in JSON Schema"))
        return;
    } else if (typeof val === "bigint") {
      if (handleUnrepresentable(schema, ctx, json, params, "BigInt literals cannot be represented in JSON Schema"))
        return;
      vals.push(Number(val));
    } else {
      vals.push(val);
    }
  }
  if (vals.length === 0) {} else if (vals.length === 1) {
    const val = vals[0];
    json.type = val === null ? "null" : typeof val;
    if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") {
      json.enum = [val];
    } else {
      json.const = val;
    }
  } else {
    if (vals.every((v) => typeof v === "number"))
      json.type = "number";
    if (vals.every((v) => typeof v === "string"))
      json.type = "string";
    if (vals.every((v) => typeof v === "boolean"))
      json.type = "boolean";
    if (vals.every((v) => v === null))
      json.type = "null";
    json.enum = vals;
  }
};
var customProcessor = (schema, ctx, json, params) => {
  handleUnrepresentable(schema, ctx, json, params, "Custom types cannot be represented in JSON Schema");
};
var transformProcessor = (schema, ctx, json, params) => {
  handleUnrepresentable(schema, ctx, json, params, "Transforms cannot be represented in JSON Schema");
};
var arrayProcessor = (schema, ctx, _json, params) => {
  const json = _json;
  const def = schema._zod.def;
  const { minimum, maximum } = aggregateChecks(schema);
  if (typeof minimum === "number")
    json.minItems = minimum;
  if (typeof maximum === "number")
    json.maxItems = maximum;
  json.type = "array";
  json.items = processSchema(def.element, ctx, {
    ...params,
    path: [...params.path, "items"]
  });
};
function inputOptin(schema) {
  const def = schema._zod.def;
  if (def.type === "pipe" && def.in._zod.traits.has("$ZodTransform")) {
    return inputOptin(def.out);
  }
  if (def.type === "catch") {
    return inputOptin(def.innerType);
  }
  return schema._zod.optin;
}
var objectProcessor = (schema, ctx, _json, params) => {
  const json = _json;
  const def = schema._zod.def;
  const shape = def.shape;
  const symbolKeys = Object.getOwnPropertySymbols(shape);
  if (symbolKeys.length && handleUnrepresentable(schema, ctx, json, params, "Symbol keys cannot be represented in JSON Schema")) {
    return;
  }
  json.type = "object";
  json.properties = {};
  for (const key in shape) {
    assignProp(json.properties, key, processSchema(shape[key], ctx, {
      ...params,
      path: [...params.path, "properties", key]
    }));
  }
  const allKeys = new Set(Object.keys(shape));
  const requiredKeys = new Set([...allKeys].filter((key) => {
    const field = def.shape[key];
    if (ctx.io === "input") {
      return inputOptin(field) === undefined;
    } else {
      return field._zod.optout === undefined;
    }
  }));
  if (requiredKeys.size > 0) {
    json.required = Array.from(requiredKeys);
  }
  if (def.catchall?._zod.def.type === "never") {
    json.additionalProperties = false;
  } else if (!def.catchall) {
    if (ctx.io === "output")
      json.additionalProperties = false;
  } else if (def.catchall) {
    json.additionalProperties = processSchema(def.catchall, ctx, {
      ...params,
      path: [...params.path, "additionalProperties"]
    });
  }
};
var unionProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  const isExclusive = def.inclusive === false;
  const options = def.options.map((x, i) => processSchema(x, ctx, {
    ...params,
    path: [...params.path, isExclusive ? "oneOf" : "anyOf", i]
  }));
  if (isExclusive) {
    json.oneOf = options;
  } else {
    json.anyOf = options;
  }
};
var intersectionProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  const a = processSchema(def.left, ctx, {
    ...params,
    path: [...params.path, "allOf", 0]
  });
  const b = processSchema(def.right, ctx, {
    ...params,
    path: [...params.path, "allOf", 1]
  });
  const isSimpleIntersection = (val) => ("allOf" in val) && Object.keys(val).length === 1;
  const allOf = [
    ...isSimpleIntersection(a) ? a.allOf : [a],
    ...isSimpleIntersection(b) ? b.allOf : [b]
  ];
  json.allOf = allOf;
  ctx.intersections.push(allOf);
};
function stringifyKeyNames(bySchema, json, visited) {
  if (json.$ref) {
    if (visited.has(json))
      return json;
    visited.add(json);
    const def = bySchema.get(json)?.def;
    if (!def)
      return json;
    const inlined = stringifyKeyNames(bySchema, def, visited);
    return inlined === def ? json : inlined;
  }
  for (const keyword of ["anyOf", "oneOf"]) {
    const branches = json[keyword];
    if (!Array.isArray(branches))
      continue;
    const mapped = branches.map((branch) => stringifyKeyNames(bySchema, branch, visited));
    if (mapped.some((branch, i) => branch !== branches[i]))
      json = { ...json, [keyword]: mapped };
  }
  const types = Array.isArray(json.type) ? json.type : [json.type];
  const numericType = !types.includes("string") && types.some((t) => t === "number" || t === "integer");
  const values = json.enum ?? (json.const !== undefined ? [json.const] : undefined);
  if (!numericType && !values?.some((v) => typeof v === "number"))
    return json;
  const { minimum, maximum, exclusiveMinimum, exclusiveMaximum, multipleOf, format, id, ...rest } = json;
  if (rest.enum)
    rest.enum = rest.enum.map((v) => typeof v === "number" ? String(v) : v);
  else if (typeof rest.const === "number")
    rest.const = String(rest.const);
  if (!numericType)
    return rest;
  rest.type = "string";
  if (!values)
    rest.pattern = (types.includes("number") ? number : integer).source;
  return rest;
}
var pendingRecords = new WeakMap;
function rewriteKeyNames(ctx) {
  const bySchema = new Map;
  for (const entry of ctx.seen.values()) {
    if (entry.def && !bySchema.has(entry.schema))
      bySchema.set(entry.schema, entry);
  }
  const rewrites = new Map;
  for (const record of pendingRecords.get(ctx) ?? []) {
    const seen = ctx.seen.get(record);
    const names = (seen?.def ?? seen?.schema)?.propertyNames;
    if (!names || names === true || rewrites.has(names))
      continue;
    const rewritten = stringifyKeyNames(bySchema, names, new Set);
    if (rewritten !== names)
      rewrites.set(names, rewritten);
  }
  if (!rewrites.size)
    return;
  for (const entry of ctx.seen.values()) {
    for (const carrier of [entry.schema, entry.def]) {
      const rewritten = carrier && rewrites.get(carrier.propertyNames);
      if (rewritten)
        carrier.propertyNames = rewritten;
    }
  }
}
var recordProcessor = (schema, ctx, _json, params) => {
  const json = _json;
  const def = schema._zod.def;
  json.type = "object";
  const keyType = def.keyType;
  const patterns = aggregateChecks(keyType).patterns;
  if (def.mode === "loose" && patterns && patterns.size > 0) {
    const valueSchema = processSchema(def.valueType, ctx, {
      ...params,
      path: [...params.path, "patternProperties", "*"]
    });
    json.patternProperties = {};
    for (const pattern of patterns) {
      assignProp(json.patternProperties, exactPattern(pattern).source, valueSchema);
    }
  } else {
    if (ctx.target === "draft-07" || ctx.target === "draft-2020-12") {
      json.propertyNames = processSchema(def.keyType, ctx, {
        ...params,
        path: [...params.path, "propertyNames"]
      });
      let pending = pendingRecords.get(ctx);
      if (!pending) {
        pending = [];
        pendingRecords.set(ctx, pending);
        ctx.deferred.push(() => rewriteKeyNames(ctx));
      }
      pending.push(schema);
    }
    json.additionalProperties = processSchema(def.valueType, ctx, {
      ...params,
      path: [...params.path, "additionalProperties"]
    });
  }
  const keyValues = keyType._zod.values;
  const omittableOnInput = ctx.io === "input" && inputOptin(def.valueType) !== undefined;
  if (keyValues && !def.partial && !omittableOnInput) {
    const validKeyValues = [...keyValues].filter((v) => typeof v === "string" || typeof v === "number");
    if (validKeyValues.length > 0) {
      json.required = validKeyValues.map(String);
    }
  }
};
var nullableProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  const inner = processSchema(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  if (ctx.target === "openapi-3.0") {
    seen.ref = def.innerType;
    json.nullable = true;
  } else {
    json.anyOf = [inner, { type: "null" }];
  }
};
var nonoptionalProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
};
var UNREPRESENTABLE_DEFAULT = Symbol();
function serializeDefaultValue(value, schema, ctx, json, params) {
  let unrepresentable = false;
  const serialized = JSON.stringify(value, (_, val) => {
    if (typeof val !== "bigint")
      return val;
    unrepresentable = true;
    return null;
  });
  if (!unrepresentable)
    return JSON.parse(serialized);
  handleUnrepresentable(schema, ctx, json, params, "BigInt defaults cannot be represented in JSON Schema");
  return UNREPRESENTABLE_DEFAULT;
}
var defaultProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  const value = serializeDefaultValue(def.defaultValue, schema, ctx, json, params);
  if (value !== UNREPRESENTABLE_DEFAULT)
    json.default = value;
};
var prefaultProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  if (ctx.io !== "input")
    return;
  const value = serializeDefaultValue(def.defaultValue, schema, ctx, json, params);
  if (value !== UNREPRESENTABLE_DEFAULT)
    json._prefault = value;
};
var catchProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  let catchValue;
  try {
    catchValue = def.catchValue(undefined);
  } catch {
    handleUnrepresentable(schema, ctx, json, params, "Dynamic catch values are not supported in JSON Schema");
    return;
  }
  json.default = catchValue;
};
var pipeProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  const inIsTransform = def.in._zod.traits.has("$ZodTransform");
  const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
  processSchema(innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = innerType;
};
var readonlyProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  json.readOnly = true;
};
var optionalProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
};
var lazyProcessor = (schema, ctx, _json, params) => {
  const innerType = schema._zod.innerType;
  processSchema(innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = innerType;
};
// ../../worka-authoring-desktop-latest-20261017/node_modules/.bun/zod@4.6.1/node_modules/zod/v4/classic/errors.js
var _installedErrorProtos = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
function _lazyMethod(proto, key, make) {
  Object.defineProperty(proto, key, {
    configurable: true,
    enumerable: false,
    get() {
      const value = make(this);
      Object.defineProperty(this, key, { value, configurable: true, writable: true });
      return value;
    },
    set(value) {
      Object.defineProperty(this, key, { value, configurable: true, writable: true });
    }
  });
}
var initializer2 = (inst, issues) => {
  $ZodError.init(inst, issues);
  inst.name = "ZodError";
  const proto = Object.getPrototypeOf(inst);
  if (_installedErrorProtos.has(proto))
    return;
  _installedErrorProtos.add(proto);
  _lazyMethod(proto, "format", (self) => (mapper) => formatError(self, mapper));
  _lazyMethod(proto, "flatten", (self) => (mapper) => flattenError(self, mapper));
  _lazyMethod(proto, "addIssue", (self) => (issue) => {
    self.issues.push(issue);
    self.message = JSON.stringify(self.issues, jsonStringifyReplacer, 2);
  });
  _lazyMethod(proto, "addIssues", (self) => (issues) => {
    self.issues.push(...issues);
    self.message = JSON.stringify(self.issues, jsonStringifyReplacer, 2);
  });
  Object.defineProperty(proto, "isEmpty", {
    configurable: true,
    enumerable: false,
    get() {
      return this.issues.length === 0;
    }
  });
};
var ZodRealError = /* @__PURE__ */ $constructor("ZodError", initializer2, undefined, {
  Parent: Error
});

// ../../worka-authoring-desktop-latest-20261017/node_modules/.bun/zod@4.6.1/node_modules/zod/v4/classic/parse.js
var parse2 = /* @__PURE__ */ _parse(ZodRealError);
var parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
var safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
var safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
var encode = /* @__PURE__ */ _encode(ZodRealError);
var decode = /* @__PURE__ */ _decode(ZodRealError);
var encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
var decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
var safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
var safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
var safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
var safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);

// ../../worka-authoring-desktop-latest-20261017/node_modules/.bun/zod@4.6.1/node_modules/zod/v4/classic/schemas.js
function _ensureDefaultLocale() {
  if (!globalConfig.localeError)
    config(en_default());
}
function _ensureDefaultMemoizer() {
  if (!globalConfig.memoizer)
    config({ memoizer: memoizer() });
}
var ZodType = /* @__PURE__ */ $constructor("ZodType", (inst, def) => {
  _ensureDefaultLocale();
  $ZodType.init(inst, def);
  inst.def = def;
  inst.type = def.type;
  return inst;
}, {
  check(...chks) {
    const def = this.def;
    return this.clone(mergeDefs(def, {
      checks: [
        ...def.checks ?? [],
        ...chks.map((ch) => typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch)
      ]
    }), { parent: true });
  },
  with(...chks) {
    return this.check(...chks);
  },
  clone(def, params) {
    return clone(this, def, params);
  },
  brand() {
    return this;
  },
  register(reg, meta) {
    reg.add(this, meta);
    return this;
  },
  refine(check, params) {
    return this.check(refine(check, params));
  },
  superRefine(refinement, params) {
    return this.check(superRefine(refinement, params));
  },
  overwrite(fn) {
    return this.check(_overwrite(fn));
  },
  optional() {
    return optional(this);
  },
  exactOptional() {
    return exactOptional(this);
  },
  nullable() {
    return nullable(this);
  },
  nullish() {
    return optional(nullable(this));
  },
  nonoptional(params) {
    return nonoptional(this, params);
  },
  array() {
    return array(this);
  },
  or(arg) {
    return union([this, arg]);
  },
  and(arg) {
    return intersection(this, arg);
  },
  transform(tx) {
    return pipe(this, transform(tx));
  },
  default(d) {
    return _default(this, d);
  },
  prefault(d) {
    return prefault(this, d);
  },
  catch(params) {
    return _catch(this, params);
  },
  pipe(target) {
    return pipe(this, target);
  },
  readonly() {
    return readonly(this);
  },
  describe(description) {
    const cl = this.clone();
    globalRegistry.add(cl, { description });
    return cl;
  },
  meta(...args) {
    if (args.length === 0)
      return globalRegistry.get(this);
    const cl = this.clone();
    globalRegistry.add(cl, args[0]);
    return cl;
  },
  isOptional() {
    return this.safeParse(undefined).success;
  },
  isNullable() {
    return this.safeParse(null).success;
  },
  apply(fn, ...args) {
    return args.length === 0 ? fn(this) : fn(this, ...args);
  },
  get "~standard"() {
    return hide(this, "~standard", {
      ...standardProps(this),
      jsonSchema: {
        input: createStandardJSONSchemaMethod(this, "input"),
        output: createStandardJSONSchemaMethod(this, "output")
      }
    });
  },
  set "~standard"(value) {
    own(this, "~standard", value);
  },
  parse: function _parse(data, params) {
    return parse2(this, data, params, { callee: _parse });
  },
  parseAsync: async function _parseAsync(data, params) {
    return await parseAsync(this, data, params, { callee: _parseAsync });
  },
  safeParse(data, params) {
    return safeParse(this, data, params);
  },
  async safeParseAsync(data, params) {
    return safeParseAsync(this, data, params);
  },
  get spa() {
    return this?.safeParseAsync;
  },
  set spa(value) {
    own(this, "spa", value);
  },
  validate(data, params) {
    return validate(this, data, params);
  },
  validateAsync(data, params) {
    return validateAsync(this, data, params);
  },
  encode: function _encode(data, params) {
    return encode(this, data, params, { callee: _encode });
  },
  decode: function _decode(data, params) {
    return decode(this, data, params, { callee: _decode });
  },
  encodeAsync: async function _encodeAsync(data, params) {
    return await encodeAsync(this, data, params, { callee: _encodeAsync });
  },
  decodeAsync: async function _decodeAsync(data, params) {
    return await decodeAsync(this, data, params, { callee: _decodeAsync });
  },
  safeEncode(data, params) {
    return safeEncode(this, data, params);
  },
  safeDecode(data, params) {
    return safeDecode(this, data, params);
  },
  async safeEncodeAsync(data, params) {
    return safeEncodeAsync(this, data, params);
  },
  async safeDecodeAsync(data, params) {
    return safeDecodeAsync(this, data, params);
  },
  toJSONSchema(params) {
    return createToJSONSchemaMethod(this, {})(params);
  },
  get description() {
    return globalRegistry.get(this)?.description;
  },
  get _def() {
    return this._zod.def;
  }
});
var _ZodString = /* @__PURE__ */ $constructor("_ZodString", (inst, def) => {
  $ZodString.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
}, /* @__PURE__ */ derived({
  format: (inst) => aggregateChecks(inst).format ?? null,
  minLength: (inst) => aggregateChecks(inst).minimum ?? null,
  maxLength: (inst) => aggregateChecks(inst).maximum ?? null
}, {
  regex(...args) {
    return this.check(_regex(...args));
  },
  includes(...args) {
    return this.check(_includes(...args));
  },
  startsWith(...args) {
    return this.check(_startsWith(...args));
  },
  endsWith(...args) {
    return this.check(_endsWith(...args));
  },
  min(...args) {
    return this.check(_minLength(...args));
  },
  max(...args) {
    return this.check(_maxLength(...args));
  },
  length(...args) {
    return this.check(_length(...args));
  },
  nonempty(...args) {
    return this.check(_minLength(1, ...args));
  },
  lowercase(params) {
    return this.check(_lowercase(params));
  },
  uppercase(params) {
    return this.check(_uppercase(params));
  },
  trim() {
    return this.check(_trim());
  },
  normalize(...args) {
    return this.check(_normalize(...args));
  },
  toLowerCase() {
    return this.check(_toLowerCase());
  },
  toUpperCase() {
    return this.check(_toUpperCase());
  },
  slugify() {
    return this.check(_slugify());
  }
}));
var ZodString = /* @__PURE__ */ $constructor("ZodString", (inst, def) => {
  $ZodString.init(inst, def);
  _ZodString.init(inst, def);
}, {
  email(params) {
    return this.check(_email(ZodEmail, params));
  },
  url(params) {
    return this.check(_url(ZodURL, params));
  },
  jwt(params) {
    return this.check(_jwt(ZodJWT, params));
  },
  emoji(params) {
    return this.check(_emoji2(ZodEmoji, params));
  },
  guid(params) {
    return this.check(_guid(ZodGUID, params));
  },
  uuid(params) {
    return this.check(_uuid(ZodUUID, params));
  },
  uuidv4(params) {
    return this.check(_uuidv4(ZodUUID, params));
  },
  uuidv6(params) {
    return this.check(_uuidv6(ZodUUID, params));
  },
  uuidv7(params) {
    return this.check(_uuidv7(ZodUUID, params));
  },
  nanoid(params) {
    return this.check(_nanoid(ZodNanoID, params));
  },
  cuid(params) {
    return this.check(_cuid(ZodCUID, params));
  },
  cuid2(params) {
    return this.check(_cuid2(ZodCUID2, params));
  },
  ulid(params) {
    return this.check(_ulid(ZodULID, params));
  },
  base64(params) {
    return this.check(_base64(ZodBase64, params));
  },
  base64url(params) {
    return this.check(_base64url(ZodBase64URL, params));
  },
  xid(params) {
    return this.check(_xid(ZodXID, params));
  },
  ksuid(params) {
    return this.check(_ksuid(ZodKSUID, params));
  },
  ipv4(params) {
    return this.check(_ipv4(ZodIPv4, params));
  },
  ipv6(params) {
    return this.check(_ipv6(ZodIPv6, params));
  },
  cidrv4(params) {
    return this.check(_cidrv4(ZodCIDRv4, params));
  },
  cidrv6(params) {
    return this.check(_cidrv6(ZodCIDRv6, params));
  },
  e164(params) {
    return this.check(_e164(ZodE164, params));
  },
  datetime(params) {
    return this.check(_isoDateTime(ZodISODateTime, params));
  },
  date(params) {
    return this.check(_isoDate(ZodISODate, params));
  },
  time(params) {
    return this.check(_isoTime(ZodISOTime, params));
  },
  duration(params) {
    return this.check(_isoDuration(ZodISODuration, params));
  }
});
function string2(params) {
  return _string(ZodString, params);
}
var ZodStringFormat = /* @__PURE__ */ $constructor("ZodStringFormat", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  _ZodString.init(inst, def);
});
var ZodISODateTime = /* @__PURE__ */ $constructor("ZodISODateTime", (inst, def) => {
  $ZodISODateTime.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodISODate = /* @__PURE__ */ $constructor("ZodISODate", (inst, def) => {
  $ZodISODate.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodISOTime = /* @__PURE__ */ $constructor("ZodISOTime", (inst, def) => {
  $ZodISOTime.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodISODuration = /* @__PURE__ */ $constructor("ZodISODuration", (inst, def) => {
  $ZodISODuration.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodEmail = /* @__PURE__ */ $constructor("ZodEmail", (inst, def) => {
  $ZodEmail.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodGUID = /* @__PURE__ */ $constructor("ZodGUID", (inst, def) => {
  $ZodGUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodUUID = /* @__PURE__ */ $constructor("ZodUUID", (inst, def) => {
  $ZodUUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodURL = /* @__PURE__ */ $constructor("ZodURL", (inst, def) => {
  $ZodURL.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodEmoji = /* @__PURE__ */ $constructor("ZodEmoji", (inst, def) => {
  $ZodEmoji.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodNanoID = /* @__PURE__ */ $constructor("ZodNanoID", (inst, def) => {
  $ZodNanoID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCUID = /* @__PURE__ */ $constructor("ZodCUID", (inst, def) => {
  $ZodCUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCUID2 = /* @__PURE__ */ $constructor("ZodCUID2", (inst, def) => {
  $ZodCUID2.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodULID = /* @__PURE__ */ $constructor("ZodULID", (inst, def) => {
  $ZodULID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodXID = /* @__PURE__ */ $constructor("ZodXID", (inst, def) => {
  $ZodXID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodKSUID = /* @__PURE__ */ $constructor("ZodKSUID", (inst, def) => {
  $ZodKSUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodIPv4 = /* @__PURE__ */ $constructor("ZodIPv4", (inst, def) => {
  $ZodIPv4.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodIPv6 = /* @__PURE__ */ $constructor("ZodIPv6", (inst, def) => {
  $ZodIPv6.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCIDRv4 = /* @__PURE__ */ $constructor("ZodCIDRv4", (inst, def) => {
  $ZodCIDRv4.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCIDRv6 = /* @__PURE__ */ $constructor("ZodCIDRv6", (inst, def) => {
  $ZodCIDRv6.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodBase64 = /* @__PURE__ */ $constructor("ZodBase64", (inst, def) => {
  $ZodBase64.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodBase64URL = /* @__PURE__ */ $constructor("ZodBase64URL", (inst, def) => {
  $ZodBase64URL.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodE164 = /* @__PURE__ */ $constructor("ZodE164", (inst, def) => {
  $ZodE164.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodJWT = /* @__PURE__ */ $constructor("ZodJWT", (inst, def) => {
  $ZodJWT.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodNumber = /* @__PURE__ */ $constructor("ZodNumber", (inst, def) => {
  $ZodNumber.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
  inst.isFinite = true;
}, /* @__PURE__ */ derived({
  minValue: (inst) => {
    const { minimum, exclusiveMinimum } = aggregateChecks(inst);
    return Math.max(minimum ?? Number.NEGATIVE_INFINITY, exclusiveMinimum ?? Number.NEGATIVE_INFINITY);
  },
  maxValue: (inst) => {
    const { maximum, exclusiveMaximum } = aggregateChecks(inst);
    return Math.min(maximum ?? Number.POSITIVE_INFINITY, exclusiveMaximum ?? Number.POSITIVE_INFINITY);
  },
  isInt: (inst) => {
    const { isInt, multipleOf } = aggregateChecks(inst);
    return !!isInt || !!multipleOf?.some(Number.isSafeInteger);
  },
  format: (inst) => aggregateChecks(inst).format ?? null
}, {
  gt(value, params) {
    return this.check(_gt(value, params));
  },
  gte(value, params) {
    return this.check(_gte(value, params));
  },
  min(value, params) {
    return this.check(_gte(value, params));
  },
  lt(value, params) {
    return this.check(_lt(value, params));
  },
  lte(value, params) {
    return this.check(_lte(value, params));
  },
  max(value, params) {
    return this.check(_lte(value, params));
  },
  int(params) {
    return this.check(int(params));
  },
  safe(params) {
    return this.check(int(params));
  },
  positive(params) {
    return this.check(_gt(0, params));
  },
  nonnegative(params) {
    return this.check(_gte(0, params));
  },
  negative(params) {
    return this.check(_lt(0, params));
  },
  nonpositive(params) {
    return this.check(_lte(0, params));
  },
  multipleOf(value, params) {
    return this.check(_multipleOf(value, params));
  },
  step(value, params) {
    return this.check(_multipleOf(value, params));
  },
  finite() {
    return this;
  }
}));
function number2(params) {
  return _number(ZodNumber, params);
}
var ZodNumberFormat = /* @__PURE__ */ $constructor("ZodNumberFormat", (inst, def) => {
  $ZodNumberFormat.init(inst, def);
  ZodNumber.init(inst, def);
});
function int(params) {
  return _int(ZodNumberFormat, params);
}
var ZodBoolean = /* @__PURE__ */ $constructor("ZodBoolean", (inst, def) => {
  $ZodBoolean.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => booleanProcessor(inst, ctx, json, params);
});
function boolean2(params) {
  return _boolean(ZodBoolean, params);
}
var ZodNull = /* @__PURE__ */ $constructor("ZodNull", (inst, def) => {
  $ZodNull.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => nullProcessor(inst, ctx, json, params);
});
function _null3(params) {
  return _null2(ZodNull, params);
}
var ZodUnknown = /* @__PURE__ */ $constructor("ZodUnknown", (inst, def) => {
  $ZodUnknown.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => unknownProcessor(inst, ctx, json, params);
});
function unknown() {
  return _unknown(ZodUnknown);
}
var ZodNever = /* @__PURE__ */ $constructor("ZodNever", (inst, def) => {
  $ZodNever.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
});
function never(params) {
  return _never(ZodNever, params);
}
var ZodArray = /* @__PURE__ */ $constructor("ZodArray", (inst, def) => {
  _ensureDefaultMemoizer();
  $ZodArray.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
  inst.element = def.element;
}, {
  min(n, params) {
    return this.check(_minLength(n, params));
  },
  nonempty(params) {
    return this.check(_minLength(1, params));
  },
  max(n, params) {
    return this.check(_maxLength(n, params));
  },
  length(n, params) {
    return this.check(_length(n, params));
  },
  unwrap() {
    return this.element;
  }
});
function array(element, params) {
  return _array(ZodArray, element, params);
}
var ZodObject = /* @__PURE__ */ $constructor("ZodObject", (inst, def) => {
  _ensureDefaultMemoizer();
  $ZodObjectJIT.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
  installLazyProp(inst, "shape", (self) => self._zod.def.shape, false);
}, {
  keyof() {
    return _enum(Object.keys(this._zod.def.shape));
  },
  catchall(catchall) {
    return this.clone(mergeDefs(this._zod.def, { catchall }));
  },
  passthrough() {
    return this.clone(mergeDefs(this._zod.def, { catchall: unknown() }));
  },
  loose() {
    return this.clone(mergeDefs(this._zod.def, { catchall: unknown() }));
  },
  strict() {
    return this.clone(mergeDefs(this._zod.def, { catchall: never() }));
  },
  strip() {
    return this.clone(mergeDefs(this._zod.def, { catchall: undefined }));
  },
  extend(incoming) {
    return extend(this, incoming);
  },
  safeExtend(incoming) {
    return safeExtend(this, incoming);
  },
  merge(other) {
    return merge(this, other);
  },
  pick(mask) {
    return pick(this, mask);
  },
  omit(mask) {
    return omit(this, mask);
  },
  partial(...args) {
    return partial(ZodOptional, this, args[0]);
  },
  exactPartial(...args) {
    return partial(ZodExactOptional, this, args[0], "exactPartial");
  },
  required(...args) {
    return required(ZodNonOptional, this, args[0]);
  }
});
function object(shape, params) {
  const def = {
    type: "object",
    shape: shape ?? {},
    ...normalizeParams(params)
  };
  return new ZodObject(def);
}
function strictObject(shape, params) {
  return new ZodObject({
    type: "object",
    shape,
    catchall: never(),
    ...normalizeParams(params)
  });
}
var ZodUnion = /* @__PURE__ */ $constructor("ZodUnion", (inst, def) => {
  $ZodUnion.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
  inst.options = def.options;
});
function union(options, params) {
  return new ZodUnion({
    type: "union",
    options,
    ...normalizeParams(params)
  });
}
var ZodIntersection = /* @__PURE__ */ $constructor("ZodIntersection", (inst, def) => {
  $ZodIntersection.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
});
function intersection(left, right) {
  return new ZodIntersection({
    type: "intersection",
    left,
    right
  });
}
var ZodRecord = /* @__PURE__ */ $constructor("ZodRecord", (inst, def) => {
  _ensureDefaultMemoizer();
  $ZodRecord.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => recordProcessor(inst, ctx, json, params);
  inst.keyType = def.keyType;
  inst.valueType = def.valueType;
});
function record(keyType, valueType, params) {
  if (!valueType || !valueType._zod) {
    return new ZodRecord({
      type: "record",
      keyType: string2(),
      valueType: keyType,
      ...normalizeParams(valueType)
    });
  }
  return new ZodRecord({
    type: "record",
    keyType,
    valueType,
    ...normalizeParams(params)
  });
}
var ZodEnum = /* @__PURE__ */ $constructor("ZodEnum", (inst, def) => {
  $ZodEnum.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
  inst.enum = def.entries;
  inst.options = [...inst._zod.values];
  const keys = new Set(Object.keys(def.entries));
  inst.extract = (values, params) => {
    const newEntries = {};
    for (const value of values) {
      if (keys.has(value)) {
        newEntries[value] = def.entries[value];
      } else
        throw new Error(`Key ${value} not found in enum`);
    }
    return new ZodEnum({
      ...def,
      checks: [],
      ...normalizeParams(params),
      entries: newEntries
    });
  };
  inst.exclude = (values, params) => {
    const newEntries = { ...def.entries };
    for (const value of values) {
      if (keys.has(value)) {
        delete newEntries[value];
      } else
        throw new Error(`Key ${value} not found in enum`);
    }
    return new ZodEnum({
      ...def,
      checks: [],
      ...normalizeParams(params),
      entries: newEntries
    });
  };
});
function _enum(values, params) {
  const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
  return new ZodEnum({
    type: "enum",
    entries,
    ...normalizeParams(params)
  });
}
var ZodLiteral = /* @__PURE__ */ $constructor("ZodLiteral", (inst, def) => {
  $ZodLiteral.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => literalProcessor(inst, ctx, json, params);
  inst.values = new Set(def.values);
  Object.defineProperty(inst, "value", {
    get() {
      if (def.values.length > 1) {
        throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
      }
      return def.values[0];
    }
  });
});
function literal(value, params) {
  return new ZodLiteral({
    type: "literal",
    values: Array.isArray(value) ? value : [value],
    ...normalizeParams(params)
  });
}
var ZodTransform = /* @__PURE__ */ $constructor("ZodTransform", (inst, def) => {
  _ensureDefaultMemoizer();
  $ZodTransform.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
  inst._zod.parse = (payload, _ctx) => {
    if (_ctx.direction === "backward") {
      throw new $ZodEncodeError(inst.constructor.name);
    }
    payload.addIssue = (issue2) => {
      if (typeof issue2 === "string") {
        payload.issues.push(issue(issue2, payload.value, def));
      } else {
        const _issue = issue2;
        if (_issue.fatal)
          _issue.continue = false;
        _issue.code ?? (_issue.code = "custom");
        if (!("input" in _issue))
          _issue.input = payload.value;
        _issue.inst ?? (_issue.inst = inst);
        payload.issues.push(issue(_issue));
      }
    };
    const output = def.transform(payload.value, payload);
    if (output instanceof Promise) {
      return output.then((output) => {
        payload.value = output;
        return payload;
      });
    }
    payload.value = output;
    return payload;
  };
});
function transform(fn) {
  return new ZodTransform({
    type: "transform",
    transform: fn
  });
}
var ZodOptional = /* @__PURE__ */ $constructor("ZodOptional", (inst, def) => {
  $ZodOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function optional(innerType) {
  return new ZodOptional({
    type: "optional",
    innerType
  });
}
var ZodExactOptional = /* @__PURE__ */ $constructor("ZodExactOptional", (inst, def) => {
  $ZodExactOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function exactOptional(innerType) {
  return new ZodExactOptional({
    type: "optional",
    innerType
  });
}
var ZodNullable = /* @__PURE__ */ $constructor("ZodNullable", (inst, def) => {
  $ZodNullable.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function nullable(innerType) {
  return new ZodNullable({
    type: "nullable",
    innerType
  });
}
var ZodDefault = /* @__PURE__ */ $constructor("ZodDefault", (inst, def) => {
  $ZodDefault.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
  inst.removeDefault = inst.unwrap;
});
function _default(innerType, defaultValue) {
  return new ZodDefault({
    type: "default",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
    }
  });
}
var ZodPrefault = /* @__PURE__ */ $constructor("ZodPrefault", (inst, def) => {
  $ZodPrefault.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function prefault(innerType, defaultValue) {
  return new ZodPrefault({
    type: "prefault",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
    }
  });
}
var ZodNonOptional = /* @__PURE__ */ $constructor("ZodNonOptional", (inst, def) => {
  $ZodNonOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional(innerType, params) {
  return new ZodNonOptional({
    type: "nonoptional",
    innerType,
    ...normalizeParams(params)
  });
}
var ZodCatch = /* @__PURE__ */ $constructor("ZodCatch", (inst, def) => {
  $ZodCatch.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
  inst.removeCatch = inst.unwrap;
});
function _catch(innerType, catchValue) {
  return new ZodCatch({
    type: "catch",
    innerType,
    catchValue: typeof catchValue === "function" ? catchValue : constantCatch(catchValue)
  });
}
var ZodPipe = /* @__PURE__ */ $constructor("ZodPipe", (inst, def) => {
  $ZodPipe.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
  inst.in = def.in;
  inst.out = def.out;
});
function pipe(in_, out) {
  return new ZodPipe({
    type: "pipe",
    in: in_,
    out
  });
}
var ZodReadonly = /* @__PURE__ */ $constructor("ZodReadonly", (inst, def) => {
  $ZodReadonly.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function readonly(innerType) {
  return new ZodReadonly({
    type: "readonly",
    innerType
  });
}
var ZodLazy = /* @__PURE__ */ $constructor("ZodLazy", (inst, def) => {
  $ZodLazy.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => lazyProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.getter();
});
function lazy(getter) {
  return new ZodLazy({
    type: "lazy",
    getter
  });
}
var ZodCustom = /* @__PURE__ */ $constructor("ZodCustom", (inst, def) => {
  $ZodCustom.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
});
function refine(fn, _params = {}) {
  return _refine(ZodCustom, fn, _params);
}
function superRefine(fn, params) {
  return _superRefine(fn, params);
}
function json(params) {
  const jsonSchema = lazy(() => {
    return union([string2(params), number2(), boolean2(), _null3(), array(jsonSchema), record(string2(), jsonSchema)]);
  });
  return jsonSchema;
}
// ../../worka-runtime-simplification-evidence-20261018/desktop-e812f18/packed/package/dist/extension-contracts.js
function J(t) {
  return Object.freeze({ ...t });
}
function A(t) {
  return Object.freeze({ ...t });
}
class m extends Error {
  limitBytes;
  code = "resource_json_limit";
  constructor(t) {
    super(`Display resource JSON exceeds ${t} bytes; use a smaller projection or pagination`);
    this.limitBytes = t;
    this.name = "JsonLimitError";
  }
}
function E(t) {
  let o = 0;
  for (let i = 0;i < t.length; i++) {
    let a = t.charCodeAt(i);
    if (a < 128)
      o++;
    else if (a < 2048)
      o += 2;
    else if (a >= 55296 && a <= 56319 && i + 1 < t.length && t.charCodeAt(i + 1) >= 56320 && t.charCodeAt(i + 1) <= 57343)
      o += 4, i++;
    else
      o += 3;
  }
  return o;
}
function h(t, o) {
  if (!Number.isSafeInteger(o) || o < 0)
    throw RangeError("Invalid JSON byte limit");
  let i = [], a = "", u = 0, s = (e, r = e.length) => {
    if (u + r > o)
      throw new m(o);
    if (u += r, a += e, a.length >= 4096)
      i.push(a), a = "";
  }, l = (e) => {
    if (e.length + u + 2 > o)
      throw new m(o);
    s('"');
    for (let r = 0;r < e.length; r++) {
      let n = e.charCodeAt(r);
      if (n === 34)
        s("\\\"");
      else if (n === 92)
        s("\\\\");
      else if (n === 8)
        s("\\b");
      else if (n === 9)
        s("\\t");
      else if (n === 10)
        s("\\n");
      else if (n === 12)
        s("\\f");
      else if (n === 13)
        s("\\r");
      else if (n < 32)
        s(`\\u${n.toString(16).padStart(4, "0")}`);
      else if (n < 128)
        s(e[r]);
      else if (n < 2048)
        s(e[r], 2);
      else if (n >= 55296 && n <= 56319 && r + 1 < e.length && e.charCodeAt(r + 1) >= 56320 && e.charCodeAt(r + 1) <= 57343)
        s(e.slice(r, r + 2), 4), r++;
      else if (n >= 55296 && n <= 57343)
        s(`\\u${n.toString(16)}`);
      else
        s(e[r], 3);
    }
    s('"');
  }, b = (e, r) => {
    if (e !== null && (typeof e === "object" || typeof e === "bigint") && typeof e.toJSON === "function")
      e = e.toJSON(r);
    if (e instanceof Number || e instanceof String || e instanceof Boolean)
      e = e.valueOf();
    return e;
  }, y = (e) => e === undefined || typeof e === "function" || typeof e === "symbol", f = [], p = new Set;
  function* x(e, r) {
    if (r) {
      let n = e, g = n.length;
      for (let d = 0;d < g; d++)
        yield [String(d), n[d]];
    } else
      for (let n in e)
        if (Object.hasOwn(e, n))
          yield [n, e[n]];
  }
  let c = (e) => {
    if (e === null || y(e)) {
      s("null");
      return;
    }
    if (typeof e === "string") {
      l(e);
      return;
    }
    if (typeof e === "number") {
      s(Number.isFinite(e) ? String(e) : "null");
      return;
    }
    if (typeof e === "boolean") {
      s(String(e));
      return;
    }
    if (typeof e === "bigint")
      throw TypeError("Cannot serialize BigInt as JSON");
    let r = e;
    if (p.has(r))
      throw TypeError("Cannot serialize circular JSON");
    let n = Array.isArray(r);
    s(n ? "[" : "{"), p.add(r), f.push({ value: r, iterator: x(r, n), array: n, first: true });
  };
  if (t = b(t, ""), y(t))
    throw TypeError("Resource result must be JSON");
  c(t);
  while (f.length) {
    let e = f[f.length - 1], r = e.iterator.next();
    if (r.done) {
      s(e.array ? "]" : "}"), p.delete(e.value), f.pop();
      continue;
    }
    let [n, g] = r.value, d = b(g, n);
    if (!e.array && y(d))
      continue;
    if (!e.first)
      s(",");
    if (e.first = false, !e.array)
      l(n), s(":");
    c(d);
  }
  if (a)
    i.push(a);
  return i.join("");
}
function k(t, o) {
  return btoa(JSON.stringify({ signature: t, position: o })).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}
function P(t, o) {
  if (t === undefined)
    return -1;
  if (typeof t !== "string" || t.length > 32768)
    throw Error("Invalid collection cursor");
  let i;
  try {
    i = JSON.parse(atob(t.replaceAll("-", "+").replaceAll("_", "/")));
  } catch {
    throw Error("Invalid collection cursor");
  }
  if (!i || i.signature !== o || !Number.isSafeInteger(i.position) || i.position < 0)
    throw Object.assign(Error("Collection cursor is stale or belongs to another query; restart pagination"), { code: "collection-stale" });
  return i.position;
}
function O(t, o) {
  return JSON.stringify([t, o], (i, a) => a && typeof a === "object" && !Array.isArray(a) ? Object.fromEntries(Object.entries(a).sort(([u], [s]) => u < s ? -1 : u > s ? 1 : 0)) : a);
}
var v = 1048576;
function C(t = 1048576) {
  return t - Math.min(2048, Math.floor(t / 4));
}
function T() {
  return C(C());
}
async function D(t, o, i) {
  let a = t.length;
  if (!Number.isSafeInteger(a) || a < 0)
    throw Error("Invalid query row count");
  let { cursor: u, limit: s = 50, maxBytes: l = T(), ...b } = o;
  if (!Number.isSafeInteger(s) || s < 1 || s > 100 || !Number.isSafeInteger(l) || l < 256 || l > v)
    throw Error("Invalid query page budget");
  if (typeof i.revision !== "string" || !i.revision)
    throw Error("A query page requires a source revision");
  let y = O("query-page", [i.scope, b, i.revision]), f = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(y)), p = [...new Uint8Array(f)].map((r) => r.toString(16).padStart(2, "0")).join(""), x = P(u, p);
  if (x >= a)
    throw Object.assign(Error("Collection cursor is stale or belongs to another query; restart pagination"), { code: "collection-stale" });
  let c = { items: [], revision: i.revision, total: a }, e = 0;
  for (let r = x + 1;r < a && c.items.length < s; r++) {
    let n = r + 1 < a ? k(p, r) : undefined, g = { items: [], revision: c.revision, total: c.total, ...n ? { next: n } : {} }, d = t.at(r), w;
    try {
      w = E(h(d, l));
    } catch (S) {
      if (!(S instanceof m) || !c.items.length)
        throw S;
      break;
    }
    if (E(h(g, l)) + e + w + c.items.length > l) {
      if (!c.items.length)
        throw new m(l);
      break;
    }
    if (c.items.push(d), e += w, n)
      c.next = n;
    else
      delete c.next;
  }
  return h(c, l), c;
}

// plugins/cardgame-content/src/contract.ts
var textSchema = string2();
var numberSchema = number2();
var booleanSchema = boolean2();
var stringListSchema = array(textSchema);
var emptyInputSchema = object({});
var jsonObject = record(textSchema, json());
var libraryItemSchema = object({
  id: textSchema,
  title: textSchema.optional(),
  name: textSchema.optional(),
  path: textSchema.optional(),
  revision: textSchema.optional()
});
var contentItemSchema = libraryItemSchema.extend({
  title: textSchema,
  path: textSchema,
  revision: textSchema
});
var pageSchema = (item) => object({
  items: array(item),
  next: textSchema.min(1).optional(),
  revision: textSchema.min(1),
  total: numberSchema.int().nonnegative().optional()
});
var documentLinkSchema = object({
  targetPath: textSchema,
  targetKind: _enum(["document", "card", "asset", "unknown", "external"]),
  targetId: textSchema.optional(),
  anchor: textSchema.optional(),
  label: textSchema.optional(),
  line: numberSchema,
  rawTarget: textSchema
});
var documentItemSchema = contentItemSchema.extend({
  title: textSchema,
  path: textSchema,
  revision: textSchema,
  type: literal("document"),
  size: numberSchema,
  links: array(documentLinkSchema),
  updatedAt: textSchema.optional(),
  snippet: textSchema.optional()
});
var documentSchema = documentItemSchema.extend({ content: textSchema });
var documentMetaSchema = object({
  id: textSchema,
  path: textSchema,
  title: textSchema,
  revision: textSchema,
  size: numberSchema,
  isScene: booleanSchema
});
var directorySchema = contentItemSchema.extend({
  type: literal("directory"),
  path: textSchema,
  hasChildren: booleanSchema.optional(),
  parentPath: textSchema.optional()
});
var backlinkSchema = contentItemSchema.extend({
  sourceId: textSchema,
  sourcePath: textSchema,
  targetPath: textSchema,
  line: numberSchema,
  snippet: textSchema.optional(),
  anchor: textSchema.optional(),
  label: textSchema.optional()
});
var graphSchema = object({
  nodes: array(contentItemSchema.extend({ type: _enum(["document", "asset"]), depth: numberSchema })),
  edges: array(object({
    sourceId: textSchema,
    targetId: textSchema.optional(),
    sourcePath: textSchema,
    targetPath: textSchema,
    kind: _enum(["document", "card", "asset", "unknown", "external"]),
    anchor: textSchema.optional()
  })),
  truncated: booleanSchema
});
var movePreviewSchema = object({
  source: documentItemSchema.extend({ content: textSchema.optional() }),
  toPath: textSchema,
  affected: array(object({
    id: textSchema,
    path: textSchema,
    revision: textSchema,
    changed: booleanSchema,
    changedLinks: numberSchema
  })),
  conflicts: stringListSchema,
  canApply: booleanSchema
});
var cardItemSchema = contentItemSchema.extend({
  type: literal("card"),
  name: textSchema,
  kind: textSchema,
  attack: numberSchema.optional(),
  health: numberSchema.optional(),
  description: textSchema.optional(),
  rarity: textSchema.optional(),
  labels: stringListSchema.optional(),
  cost: union([numberSchema, textSchema]).optional(),
  facePreview: textSchema.optional()
});
var cardSchema = cardItemSchema.extend({ json: jsonObject });
var assetVersionSchema = libraryItemSchema.extend({
  assetId: textSchema,
  path: textSchema,
  revision: textSchema,
  mimeType: textSchema,
  size: numberSchema,
  width: numberSchema.nullish(),
  height: numberSchema.nullish(),
  durationMs: numberSchema.nullish(),
  frameCount: numberSchema.nullish(),
  source: _enum(["project", "candidate", "adopted"]),
  candidateId: textSchema.optional(),
  metadata: jsonObject.optional(),
  createdAt: textSchema,
  adopted: booleanSchema
});
var assetSchema = contentItemSchema.extend({
  type: literal("asset"),
  kind: _enum(["image", "audio", "spritesheet", "other"]),
  mimeType: textSchema,
  size: numberSchema,
  name: textSchema.optional(),
  tags: stringListSchema.optional(),
  metadataRevision: textSchema.optional(),
  format: textSchema.optional(),
  status: textSchema.optional(),
  width: numberSchema.nullish(),
  height: numberSchema.nullish(),
  durationMs: numberSchema.nullish(),
  frameCount: numberSchema.nullish(),
  currentVersionId: textSchema.optional(),
  metadata: jsonObject.optional(),
  versions: array(assetVersionSchema).optional()
});
var mediaSchema = object({
  id: textSchema,
  versionId: textSchema.optional(),
  variant: _enum(["thumbnail", "original", "waveform"]),
  mimeType: textSchema,
  size: numberSchema,
  revision: textSchema,
  url: textSchema.optional(),
  data: textSchema.optional(),
  path: textSchema.optional(),
  absolutePath: textSchema.optional(),
  width: numberSchema.nullish(),
  height: numberSchema.nullish(),
  durationMs: numberSchema.nullish(),
  frameCount: numberSchema.nullish(),
  metadata: jsonObject.optional()
});
var statusSchema = object({
  projectId: textSchema,
  phase: _enum(["pending", "indexing", "ready", "error", "closed"]),
  indexedAt: textSchema.optional(),
  documents: numberSchema,
  directories: numberSchema,
  cards: numberSchema,
  assets: numberSchema,
  errors: stringListSchema
});
var recentChangeSchema = object({
  kind: _enum(["document", "card", "asset", "version"]),
  id: textSchema.optional(),
  path: textSchema.optional(),
  name: textSchema.optional(),
  change: _enum(["created", "updated"]),
  at: textSchema
});
var diagnostic = object({
  severity: _enum(["error", "warning"]),
  path: textSchema,
  line: numberSchema.optional(),
  detail: textSchema
});
var storyBuild = object({
  storyId: textSchema,
  entryPath: textSchema,
  outputPath: textSchema,
  sourcePaths: stringListSchema,
  errorCount: numberSchema,
  warningCount: numberSchema,
  nodeCount: numberSchema,
  choiceCount: numberSchema,
  builtAt: textSchema
});
var storyScene = object({
  id: textSchema,
  path: textSchema,
  revision: textSchema,
  nodeId: textSchema,
  title: textSchema,
  chapter: textSchema,
  summary: textSchema,
  dialogueCount: numberSchema,
  offset: numberSchema,
  nextOffset: numberSchema.optional(),
  items: array(object({
    id: textSchema,
    speakerId: textSchema,
    speakerName: textSchema,
    text: textSchema,
    emotion: textSchema.optional(),
    line: numberSchema
  })),
  diagnostics: array(diagnostic)
});
var pinnedIdentity = object({
  key: textSchema,
  projectId: textSchema,
  kind: textSchema,
  id: textSchema,
  revision: textSchema,
  title: textSchema,
  anchor: textSchema.optional(),
  path: textSchema.optional(),
  context: jsonObject.optional(),
  binding: jsonObject.optional(),
  freshness: _enum(["current", "stale", "unavailable"]).optional(),
  currentRevision: textSchema.optional()
});
var candidateBinding = object({
  productionId: textSchema,
  candidateId: textSchema,
  candidateHash: textSchema,
  commit: textSchema,
  productionRevision: numberSchema,
  requirementRevision: numberSchema.nullable(),
  round: numberSchema.nullable(),
  currentRequirementRevision: numberSchema,
  currentRound: numberSchema,
  current: booleanSchema,
  status: textSchema
});
var previewReference = pinnedIdentity.extend({ kind: literal("candidate"), binding: candidateBinding });
var formalPreviewRecordSchema = object({
  projectId: textSchema,
  key: textSchema,
  snapshotId: textSchema,
  createdAt: textSchema,
  commit: textSchema,
  contentRevision: textSchema,
  runtimeRevision: textSchema,
  snapshotRevision: textSchema
});
var formalPreview = object({ record: formalPreviewRecordSchema.nullable(), freshness: _enum(["missing", "current", "stale", "unavailable"]), error: textSchema.optional() });
var pinnedPage = object({ items: array(pinnedIdentity), limit: numberSchema });
var reportRef = object({ experimentId: textSchema, reportId: textSchema });
var candidateRef = object({
  productionId: textSchema,
  candidateId: textSchema,
  candidateHash: textSchema
});
var battleSource = union([object({ kind: literal("registered-project") }), candidateRef.extend({ kind: literal("candidate"), commit: textSchema })]);
var battleSettings = object({
  deckId: textSchema,
  encounterId: textSchema,
  policyVersion: textSchema,
  seeds: array(numberSchema),
  turnLimit: numberSchema,
  actionLimit: numberSchema,
  opening: literal("player-first")
});
var battleOutcome = _enum(["victory", "defeat", "draw", "incomplete"]);
var battleTrial = object({
  outcome: battleOutcome,
  turns: numberSchema,
  actions: numberSchema,
  reason: textSchema.optional(),
  playedCardIds: stringListSchema,
  finalStateHash: textSchema
});
var battleReport = object({
  schemaVersion: literal(1),
  createdAt: textSchema,
  settings: battleSettings,
  settingsHash: textSchema,
  contentRevision: textSchema,
  runtimeRevision: textSchema,
  adapterVersion: textSchema,
  deckCardIds: stringListSchema,
  trials: array(object({
    seed: numberSchema,
    result: battleTrial.optional(),
    error: textSchema.optional(),
    cancelled: literal(true).optional()
  })),
  summary: object({
    requested: numberSchema,
    executed: numberSchema,
    valid: numberSchema,
    decisive: numberSchema,
    victories: numberSchema,
    defeats: numberSchema,
    draws: numberSchema,
    incomplete: numberSchema,
    failed: numberSchema,
    cancelled: booleanSchema,
    victoryRate: numberSchema.nullable()
  })
});
var battleExperiments = object({
  status: textSchema,
  experiment: object({
    id: textSchema,
    snapshotId: textSchema,
    contentRevision: textSchema,
    sourceRevision: textSchema,
    runtimeRevision: textSchema.optional(),
    source: battleSource.optional(),
    createdAt: textSchema,
    error: textSchema.optional(),
    url: textSchema.optional()
  }).optional(),
  reports: array(object({
    experimentId: textSchema,
    reportId: textSchema,
    source: battleSource.optional(),
    report: battleReport,
    projectCheck: object({
      status: textSchema,
      checkedAt: textSchema,
      scope: textSchema,
      error: textSchema.optional()
    })
  })),
  reportScope: literal("historical-snapshot")
});
var battleComparison = object({
  before: reportRef,
  after: reportRef,
  settings: battleSettings,
  pairs: array(object({
    seed: numberSchema,
    before: battleOutcome,
    after: battleOutcome
  })),
  excludedSeeds: array(numberSchema),
  pairedCount: numberSchema,
  beforeVictoryRate: numberSchema.nullable(),
  afterVictoryRate: numberSchema.nullable(),
  beforeVersion: object({ content: textSchema, runtime: textSchema }),
  afterVersion: object({ content: textSchema, runtime: textSchema }),
  interpretation: textSchema
});
var executionReport = object({
  storyId: textSchema,
  storyRevision: textSchema,
  runtimeRevision: textSchema,
  createdAt: textSchema,
  exploredStates: numberSchema,
  totalNodes: numberSchema,
  reachedNodeIds: stringListSchema,
  unvisitedNodeIds: stringListSchema,
  stateLimit: numberSchema,
  depthLimit: numberSchema,
  bounded: booleanSchema,
  depthCutoffs: numberSchema,
  stateCutoffs: numberSchema,
  externalStops: numberSchema,
  errors: numberSchema,
  witnesses: array(object({
    kind: textSchema,
    nodeId: textSchema,
    path: stringListSchema,
    detail: textSchema.optional(),
    state: json()
  })),
  blockedExamples: array(object({
    choiceId: textSchema,
    nodeId: textSchema,
    reason: textSchema,
    path: stringListSchema
  })),
  limits: stringListSchema,
  initialState: json()
});
var executionState = object({
  status: _enum(["idle", "running", "succeeded", "failed", "interrupted"]),
  startedAt: textSchema.optional(),
  finishedAt: textSchema.optional(),
  error: textSchema.optional(),
  report: executionReport.optional(),
  currentStoryRevision: textSchema.optional(),
  contentMatches: booleanSchema.optional(),
  runtimeFreshness: textSchema.optional()
});
var metric = object({
  sample: numberSchema,
  min: numberSchema,
  max: numberSchema,
  mean: numberSchema
}).nullable();
var balance = object({
  revision: textSchema,
  cardCount: numberSchema,
  groups: array(object({
    kind: textSchema,
    count: numberSchema,
    attack: metric,
    health: metric
  })),
  measurement: literal("definitions"),
  battleReport: _null3()
});
var deck = object({
  id: textSchema,
  path: textSchema,
  revision: textSchema,
  name: textSchema,
  description: textSchema,
  cards: array(object({
    id: textSchema,
    count: numberSchema,
    name: textSchema.optional(),
    missing: booleanSchema
  })),
  total: numberSchema
});
var storyNode = object({
  id: textSchema,
  title: textSchema,
  type: textSchema,
  summary: textSchema,
  chapter: textSchema,
  sourceMatch: literal("node-id"),
  sources: array(object({
    id: textSchema,
    path: textSchema,
    title: textSchema,
    revision: textSchema
  })),
  sourceCount: numberSchema
});
var storyAnalysis = union([object({
  id: textSchema,
  path: textSchema,
  revision: textSchema,
  selectedNode: object({
    id: textSchema,
    detail: textSchema,
    onEnter: array(json())
  })
}), object({
  id: textSchema,
  path: textSchema,
  revision: textSchema,
  catalogRevision: textSchema,
  title: textSchema,
  entry: textSchema,
  nodes: array(storyNode),
  edges: array(object({
    id: textSchema,
    from: textSchema,
    to: textSchema,
    text: textSchema,
    conditional: booleanSchema,
    enabledWhen: json().optional(),
    visibleWhen: json().optional(),
    effects: array(json()).optional()
  })),
  findings: array(object({
    kind: textSchema,
    id: textSchema,
    detail: textSchema
  })),
  terminalIds: stringListSchema,
  reachableCount: numberSchema,
  conditionalCount: numberSchema,
  reachability: literal("structural")
})]);
var candidateDiff = object({
  candidateId: textSchema,
  candidateHash: textSchema,
  commit: textSchema,
  status: textSchema,
  targetBaseRevision: textSchema,
  currentBaseRevision: textSchema,
  baseCurrent: booleanSchema,
  comparison: textSchema,
  files: array(object({
    path: textSchema,
    changed: booleanSchema,
    binary: booleanSchema,
    truncated: booleanSchema,
    beforeRevision: textSchema.nullable(),
    afterRevision: textSchema.nullable(),
    beforeBytes: numberSchema,
    afterBytes: numberSchema,
    before: textSchema.nullish(),
    after: textSchema.nullish()
  }))
});
var listInput = object({
  q: textSchema.optional(),
  query: textSchema.optional(),
  directory: textSchema.optional(),
  parentPath: textSchema.optional(),
  kind: textSchema.optional(),
  assetScope: _enum(["art", "audio"]).optional(),
  format: textSchema.optional(),
  mimeType: textSchema.optional(),
  minWidth: numberSchema.optional(),
  maxWidth: numberSchema.optional(),
  minDurationMs: numberSchema.optional(),
  maxDurationMs: numberSchema.optional(),
  status: textSchema.optional(),
  rarity: textSchema.optional(),
  tags: union([textSchema, stringListSchema]).optional(),
  labels: union([textSchema, stringListSchema]).optional(),
  cursor: textSchema.optional(),
  limit: numberSchema.optional(),
  id: textSchema.optional(),
  path: textSchema.optional(),
  assetId: textSchema.optional()
});
var detailInput = object({
  id: textSchema.optional(),
  path: textSchema.optional(),
  assetId: textSchema.optional(),
  versionId: textSchema.optional(),
  freshKind: textSchema.optional()
});
function query(op, input, output) {
  const response = output.and(object({ projectGeneration: textSchema.optional() }));
  return { input: input.strict().nullish(), output: response, resource: A({
    name: "extension.cardgame-content.query",
    input: input.extend({ projectId: textSchema.min(1), projectGeneration: textSchema.optional(), op: literal(op) }).strict(),
    output: response
  }) };
}
var contentQueries = {
  formalPreview: query("formalPreview", emptyInputSchema, formalPreview),
  previewReferenceTarget: query("previewReferenceTarget", object({ key: textSchema, commit: textSchema }), previewReference),
  status: query("status", emptyInputSchema, statusSchema),
  documents: query("documents", listInput, pageSchema(documentItemSchema)),
  directories: query("directories", listInput, pageSchema(directorySchema)),
  document: query("document", detailInput, documentSchema),
  documentMeta: query("documentMeta", detailInput, documentMetaSchema),
  backlinks: query("backlinks", listInput, pageSchema(backlinkSchema)),
  graph: query("graph", detailInput.extend({
    depth: numberSchema.optional(),
    maxNodes: numberSchema.optional(),
    limit: numberSchema.optional()
  }), graphSchema),
  movePreview: query("movePreview", detailInput.extend({ toPath: textSchema.optional(), targetPath: textSchema.optional() }), movePreviewSchema),
  cards: query("cards", listInput, pageSchema(cardItemSchema)),
  card: query("card", detailInput, cardSchema),
  assets: query("assets", listInput, pageSchema(assetSchema)),
  asset: query("asset", detailInput, assetSchema),
  versions: query("versions", listInput, pageSchema(assetVersionSchema)),
  media: query("media", detailInput.extend({
    versionId: textSchema.optional(),
    variant: _enum(["thumbnail", "original", "waveform"]).optional(),
    from: textSchema.optional()
  }), mediaSchema),
  inspection: query("inspection", object({
    kinds: array(_enum(["broken-link", "scene-dead-end", "orphan-asset", "card-missing-art", "asset-missing-metadata"])).optional(),
    cursor: textSchema.optional(),
    limit: numberSchema.optional()
  }), object({
    findings: array(object({
      kind: textSchema,
      severity: _enum(["info", "warning", "high"]),
      ref: object({
        type: _enum(["document", "card", "asset"]),
        id: textSchema.optional(),
        path: textSchema.optional()
      }),
      detail: textSchema
    })),
    counts: record(textSchema, numberSchema),
    nextCursor: textSchema.optional()
  })),
  recentChanges: query("recentChanges", object({
    since: textSchema.optional(),
    cursor: textSchema.optional(),
    limit: numberSchema.optional()
  }), pageSchema(recentChangeSchema)),
  storyBuilds: query("storyBuilds", object({ cursor: textSchema.optional(), limit: numberSchema.optional() }), pageSchema(storyBuild)),
  storyScenePage: query("storyScenePage", detailInput.extend({
    offset: numberSchema.optional(),
    limit: numberSchema.optional(),
    expectedRevision: textSchema.optional()
  }), storyScene),
  pinnedReferenceTarget: query("pinnedReferenceTarget", object({
    kind: textSchema,
    id: textSchema,
    anchor: textSchema.optional(),
    context: jsonObject.optional()
  }), pinnedIdentity),
  pinnedReferences: query("pinnedReferences", emptyInputSchema, pinnedPage),
  battleExperiments: query("battleExperiments", emptyInputSchema, battleExperiments),
  battleSources: query("battleSources", emptyInputSchema, object({ items: array(candidateRef.extend({
    commit: textSchema,
    kind: textSchema,
    targetId: textSchema,
    status: textSchema
  })) })),
  battleComparison: query("battleComparison", object({ before: reportRef, after: reportRef }), battleComparison),
  storyExecutionReport: query("storyExecutionReport", object({ id: textSchema }), executionState),
  candidateDiff: query("gameCandidateDiff", object({ productionId: textSchema, candidateId: textSchema }), candidateDiff),
  balanceOverview: query("balanceOverview", emptyInputSchema, balance),
  gameDeck: query("gameDeck", object({ id: textSchema }), deck),
  gameCatalog: query("gameCatalog", object({
    kind: _enum(["story", "deck", "encounter"]),
    q: textSchema.optional(),
    query: textSchema.optional(),
    cursor: textSchema.optional(),
    limit: numberSchema.optional()
  }), pageSchema(object({
    id: textSchema,
    title: textSchema,
    path: textSchema,
    kind: textSchema
  }))),
  storyAnalysis: query("storyAnalysis", object({
    id: textSchema,
    nodeId: textSchema.optional(),
    expectedRevision: textSchema.optional()
  }), storyAnalysis)
};
var documentDraft = object({
  path: textSchema,
  content: textSchema,
  expectedRevision: textSchema.nullish()
});
var candidate = object({
  id: textSchema,
  projectId: textSchema,
  productionId: textSchema,
  candidateHash: textSchema,
  commit: textSchema,
  status: textSchema
});
var production = object({
  id: textSchema,
  projectId: textSchema,
  revision: numberSchema
});
var staged = object({
  candidate,
  production,
  reused: booleanSchema.optional()
});
var compileResult = object({
  storyId: textSchema,
  outputPath: textSchema,
  catalogUpdated: booleanSchema,
  nodeCount: numberSchema,
  choiceCount: numberSchema,
  diagnostics: array(diagnostic)
});
var registeredCandidate = object({
  id: textSchema,
  title: textSchema,
  path: textSchema,
  revision: textSchema,
  mimeType: textSchema,
  size: numberSchema,
  metadata: jsonObject,
  status: textSchema.optional(),
  assetId: textSchema.optional(),
  versionId: textSchema.optional()
});
var command = (method, input, output) => ({
  input: input.strict(),
  output,
  method: J({ extension: "cardgame-content", method, input: input.extend({ projectId: textSchema.min(1), projectGeneration: textSchema.optional() }).strict(), output })
});
var contentActions = {
  prepareFormalPreview: command("prepareFormalPreview", object({ fresh: booleanSchema.optional() }), formalPreviewRecordSchema),
  pinReference: command("pinReference", object({
    kind: textSchema,
    id: textSchema,
    anchor: textSchema.optional(),
    context: jsonObject.optional(),
    revision: textSchema
  }), pinnedPage),
  removePinnedReference: command("removePinnedReference", object({ key: textSchema }), object({ removed: literal(true) })),
  prepareBattleExperiment: command("prepareBattleExperiment", object({ fresh: booleanSchema.optional(), candidate: candidateRef.optional() }), object({
    id: textSchema,
    url: textSchema,
    snapshotId: textSchema
  })),
  stopBattleExperiment: command("stopBattleExperiment", emptyInputSchema, object({ stopped: literal(true) })),
  analyzeStoryPaths: command("analyzeStoryPaths", object({ id: textSchema, expectedRevision: textSchema }), executionState),
  saveDocument: command("saveDocument", object({
    id: textSchema.optional(),
    path: textSchema.optional(),
    content: textSchema,
    expectedRevision: textSchema.optional(),
    title: textSchema.optional()
  }), documentSchema),
  moveDocument: command("moveDocument", object({
    id: textSchema.optional(),
    path: textSchema.optional(),
    toPath: textSchema,
    expectedRevision: textSchema.optional(),
    expectedRevisions: record(textSchema, textSchema).optional(),
    updateLinks: booleanSchema.optional()
  }), movePreviewSchema),
  updateCard: command("updateCard", object({
    id: textSchema,
    card: jsonObject.optional(),
    patch: jsonObject.optional(),
    expectedRevision: textSchema.optional()
  }), cardSchema),
  updateAsset: command("updateAsset", object({
    id: textSchema,
    name: textSchema.optional(),
    tags: stringListSchema.optional(),
    expectedMetadataRevision: textSchema.optional()
  }), assetSchema),
  registerCandidates: command("registerCandidates", object({ candidates: array(object({
    id: textSchema.optional(),
    name: textSchema.optional(),
    fileName: textSchema.optional(),
    mimeType: textSchema.optional(),
    data: textSchema.optional(),
    base64: textSchema.optional(),
    sourcePath: textSchema.optional(),
    metadata: jsonObject.optional()
  })), autoAdopt: object({
    path: textSchema.optional(),
    assetId: textSchema.optional(),
    metadata: jsonObject.optional()
  }).optional() }), array(registeredCandidate)),
  adoptVersion: command("adoptVersion", object({
    candidateId: textSchema.optional(),
    versionId: textSchema.optional(),
    assetId: textSchema.optional(),
    path: textSchema.optional(),
    fileName: textSchema.optional(),
    metadata: jsonObject.optional()
  }), assetSchema),
  compileStory: command("compileStory", object({
    entry: textSchema,
    storyId: textSchema.optional(),
    dryRun: booleanSchema.optional()
  }), compileResult),
  stageDocumentsCandidate: command("stageDocumentsCandidate", object({
    featureId: textSchema,
    brief: textSchema,
    documents: array(documentDraft)
  }), staged),
  stageStoryCandidate: command("stageStoryCandidate", object({
    featureId: textSchema,
    storyId: textSchema,
    entryPath: textSchema,
    brief: textSchema,
    documents: array(documentDraft),
    referenceDocuments: array(documentDraft).optional(),
    assets: array(object({ candidateId: textSchema, path: textSchema })).optional(),
    npcs: array(jsonObject).optional(),
    items: array(jsonObject).optional(),
    shops: array(jsonObject).optional(),
    recipes: array(jsonObject).optional(),
    quests: array(jsonObject).optional(),
    copyEdits: array(jsonObject).optional(),
    launch: object({
      hubPath: textSchema,
      locationId: textSchema,
      actionId: textSchema,
      label: textSchema
    }).optional()
  }), staged),
  createCardBatch: command("createCardBatch", object({
    cardIds: stringListSchema,
    featureId: textSchema,
    requestId: textSchema.optional(),
    sourceRevisions: record(textSchema, textSchema).optional(),
    brief: textSchema
  }), object({ production })),
  saveCardDraft: command("saveCardDraft", object({
    productionId: textSchema,
    cardId: textSchema,
    baseRevision: numberSchema,
    definition: jsonObject,
    presentation: jsonObject.optional()
  }), object({ production })),
  createTodo: command("createTodo", object({
    title: textSchema,
    description: textSchema,
    priority: textSchema,
    category: textSchema,
    context: jsonObject
  }), object({ item: object({ id: textSchema }) }))
};
var configureProjectContract = J({
  extension: "cardgame-content",
  method: "configureProject",
  input: strictObject({ root: textSchema.trim().min(1), desktopId: textSchema.optional() }),
  output: object({
    configured: literal(true),
    projectId: textSchema,
    projectRoot: textSchema,
    notes: record(textSchema, textSchema)
  })
});
var referenceResourceSchema = object({
  title: textSchema,
  path: textSchema,
  root: textSchema.optional(),
  linkBase: textSchema.optional(),
  revision: textSchema.optional()
});
var referenceDocumentSchema = object({
  content: textSchema,
  path: textSchema.optional(),
  title: textSchema.optional(),
  revision: textSchema.optional(),
  format: textSchema.optional()
});
var featureChoicesSchema = object({ items: array(object({ id: textSchema, title: textSchema })) });
var localActions = {
  discussAudio: { input: emptyInputSchema, output: object({ sessionId: textSchema }) },
  discussSelection: { input: object({ itemIds: stringListSchema.optional() }), output: object({ sessionId: textSchema }) },
  addResource: { input: object({ path: textSchema, title: textSchema.optional() }), output: referenceResourceSchema },
  rejectAssetVersion: { input: object({ assetId: textSchema, reason: textSchema.optional() }), output: object({
    reverted: booleanSchema,
    versionId: textSchema.optional(),
    todoId: textSchema.optional()
  }) },
  createCardWorkflow: { input: object({
    itemIds: stringListSchema,
    featureId: textSchema,
    draft: jsonObject.optional(),
    expectedRevision: textSchema.optional(),
    requestId: textSchema.optional(),
    projectGeneration: textSchema.optional()
  }), output: object({ noteId: textSchema, itemId: textSchema }) },
  switchCardTheme: { input: object({
    id: textSchema,
    themeId: textSchema,
    expectedRevision: textSchema
  }), output: cardSchema }
};
var todoImageSchema = object({ id: textSchema, dataUrl: textSchema, type: _enum(["image/png", "image/jpeg", "image/webp", "image/gif"]).optional(), name: textSchema.optional(), width: numberSchema.optional(), height: numberSchema.optional() });
var todoMetadata = { projectId: textSchema, projectGeneration: textSchema.optional(), id: textSchema, status: _enum(["todo", "in_progress", "done", "blocked"]), completed: booleanSchema.optional(), priority: _enum(["low", "medium", "high"]), category: textSchema.optional(), dueDate: textSchema.optional(), taskId: textSchema.optional(), delegationId: textSchema.optional(), productionId: textSchema.optional(), revision: numberSchema, requirementRevision: numberSchema, createdAt: textSchema, updatedAt: textSchema };
var todoRequirementSchema = object({ ...todoMetadata, title: textSchema, description: textSchema.optional(), images: array(todoImageSchema).optional(), conclusion: textSchema.optional() });
var todoSummarySchema = object({ ...todoMetadata, title: textSchema, titleTruncated: booleanSchema.optional(), description: textSchema.optional(), descriptionTruncated: booleanSchema.optional(), conclusion: textSchema.optional(), conclusionTruncated: booleanSchema.optional(), imageCount: numberSchema, imageNames: stringListSchema, hasDelivery: booleanSchema.optional() });
var todoTextSchema = todoRequirementSchema.omit({ images: true, conclusion: true });
var todoReadSchema = object({ item: todoRequirementSchema, requirementFingerprint: textSchema });
var todoReceiptSchema = object({ projectId: textSchema, projectGeneration: textSchema.optional(), id: textSchema, revision: numberSchema, requirementRevision: numberSchema, requirementFingerprint: textSchema });
var todoHistorySchema = object({ history: array(object({ id: numberSchema, projectId: textSchema, itemId: textSchema, kind: literal("todo"), event: textSchema, revision: numberSchema, payload: json(), createdAt: textSchema })), nextCursor: textSchema.optional(), historyLimit: numberSchema });
var workflowReadContracts = {
  todoHistory: query("todo", object({ projectId: textSchema.optional(), projectGeneration: textSchema.optional(), id: textSchema, view: literal("history"), historyCursor: textSchema.optional(), historyLimit: numberSchema.optional() }), todoHistorySchema),
  todoSummary: query("todo", object({ id: textSchema, view: literal("summary") }), object({ item: todoSummarySchema })),
  todoTexts: query("todos", object({ projectId: textSchema.optional(), view: literal("text"), cursor: textSchema.optional(), limit: numberSchema.optional(), q: textSchema.optional(), category: textSchema.optional(), status: _enum(["todo", "in_progress", "done", "blocked"]).optional() }), object({ items: array(todoTextSchema), next: textSchema.optional(), revision: textSchema, total: numberSchema })),
  workflowStatus: query("workflowStatus", emptyInputSchema, object({ counts: object({ todos: numberSchema, todo: numberSchema, inProgress: numberSchema, done: numberSchema, blocked: numberSchema }) })),
  categories: query("categories", object({ projectId: textSchema.optional(), cursor: textSchema.optional(), limit: numberSchema.optional() }), object({ items: array(object({ category: textSchema, count: numberSchema.int().nonnegative() })), next: textSchema.optional(), revision: textSchema, total: numberSchema.int().nonnegative() })),
  todos: query("todos", object({ projectId: textSchema.optional(), cursor: textSchema.optional(), limit: numberSchema.optional(), q: textSchema.optional(), category: textSchema.optional(), status: _enum(["todo", "in_progress", "done", "blocked"]).optional() }), object({ items: array(todoSummarySchema), next: textSchema.optional(), revision: textSchema, total: numberSchema })),
  todo: query("todo", object({ projectId: textSchema.optional(), projectGeneration: textSchema.optional(), id: textSchema }), todoReadSchema)
};

// project-binding.ts
import { createHash, randomUUID } from "node:crypto";
import { lstat, readFile, realpath } from "node:fs/promises";
import { isAbsolute, join, relative, sep } from "node:path";
var CARDGAME_ROLES = ["cards", "execution", "preview", "production", "tracker", "knowledge", "assets", "audio", "story", "todo", "balance"];
var roles = new Set(CARDGAME_ROLES);
var providerName = "cardgame-content";
var record2 = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
var desktopProjectId = (desktopId) => `cardgame-${createHash("sha256").update(desktopId).digest("hex").slice(0, 32)}`;
async function validateProjectRoot(value) {
  if (typeof value !== "string" || !value.trim() || value.includes("\x00") || !isAbsolute(value))
    throw Error("请选择 CardGame 项目的绝对目录");
  const info = await lstat(value);
  if (!info.isDirectory() || info.isSymbolicLink())
    throw Error("CardGame 项目必须是实际目录，不能是符号链接");
  const root = await realpath(value);
  for (const path of ["package.json", "public/data/cards/units.json"]) {
    const segments = path.split("/");
    for (let index = 1;index <= segments.length; index++) {
      const part = join(root, ...segments.slice(0, index));
      const entry = await lstat(part);
      const actual = await realpath(part), inside = relative(root, actual);
      if (entry.isSymbolicLink() || !inside || inside === ".." || inside.startsWith(".." + sep) || isAbsolute(inside))
        throw Error(`CardGame 项目文件越界：${path}`);
      if (index < segments.length && !entry.isDirectory())
        throw Error(`CardGame 项目目录无效：${path}`);
      if (index === segments.length && (!entry.isFile() || entry.size > (path === "package.json" ? 1024 * 1024 : 16 * 1024 * 1024)))
        throw Error(`CardGame 项目文件无效或过大：${path}`);
    }
    const json = JSON.parse(await readFile(join(root, path), "utf8"));
    if (path === "package.json" ? !record2(json) || typeof json.name !== "string" || !json.name.trim() : !record2(json) || !Array.isArray(json.units))
      throw Error(`CardGame 项目 JSON 无效：${path}`);
  }
  return root;
}
function createProjectBindingManager(options) {
  const { host, media } = options;
  const bindings = host.app.records({ owner: providerName, collection: "desktop-bindings", storagePrefix: "cardgame-content:desktop-bindings:" });
  const epochMigrations = new Map;
  const children = new Map;
  const active = new Set;
  const setups = new Map;
  const listeners = new Map;
  const subscriptions = new Set;
  const transitions = new Set;
  const quarantined = new Set;
  const projectWork = new Map;
  const suspendSubscriptions = new Map;
  const storageKey = (binding) => createHash("sha256").update(binding.root).digest("hex").slice(0, 24);
  async function withChild(binding, operation) {
    if (quarantined.has(binding.desktopId))
      throw Error("CardGame 旧项目服务未能完整关闭，请重启宿主后重试");
    if (transitions.has(binding.desktopId))
      throw Error("CardGame 正在切换项目目录，请稍后重试");
    let release;
    const done = new Promise((resolve) => {
      release = resolve;
    });
    const work = projectWork.get(binding.desktopId) ?? new Set;
    work.add(done);
    projectWork.set(binding.desktopId, work);
    try {
      const current = await bindingByProject(binding.projectId);
      if (!current || current.root !== binding.root || current.generation !== binding.generation)
        throw Error("CardGame 项目目录已变化，请刷新后重试");
      return await operation(await child(binding));
    } finally {
      release();
      work.delete(done);
      if (!work.size)
        projectWork.delete(binding.desktopId);
    }
  }
  let closing = false, closePromise;
  const assertOpen = () => {
    if (closing)
      throw Error("CardGame 服务正在关闭");
  };
  const tracked = (operation) => {
    try {
      assertOpen();
    } catch (error) {
      return Promise.reject(error);
    }
    const work = Promise.resolve().then(operation);
    active.add(work);
    work.finally(() => active.delete(work)).catch(() => {
      return;
    });
    return work;
  };
  const validateRoot = options.validateRoot ?? validateProjectRoot;
  async function trustedNote(noteId) {
    if (typeof noteId !== "string" || !noteId)
      throw Error("CardGame 操作需要当前便笺身份");
    const { value: note } = await host.app.note(noteId);
    if (!note || note.id !== noteId || note.archived || note.draft || typeof note.desktopId !== "string" || !note.desktopId)
      throw Error("CardGame 便笺不属于可用桌面");
    const config = (await host.app.core.readRecord("states", `${noteId}:config`))?.value;
    if (!record2(config) || typeof config.cardgameRole !== "string" || !roles.has(config.cardgameRole))
      throw Error("当前便笺不是 CardGame 桌面角色");
    return { note, config, desktopId: note.desktopId, role: config.cardgameRole };
  }
  function checkedBinding(value, projectId) {
    if (!record2(value) || value.schemaVersion !== 1 || typeof value.desktopId !== "string" || !value.desktopId || value.projectId !== projectId || desktopProjectId(value.desktopId) !== projectId || value.generation !== undefined && (typeof value.generation !== "string" || !value.generation.trim()) || typeof value.root !== "string" || !isAbsolute(value.root) || !record2(value.notes) || !value.notes.cards || !value.notes.preview || Object.entries(value.notes).some(([role, id]) => !roles.has(role) || typeof id !== "string" || !id) || new Set(Object.values(value.notes)).size !== Object.values(value.notes).length)
      throw Error("CardGame 项目绑定无效，请重新核对桌面配置");
    return value;
  }
  async function bindingByProject(projectId) {
    if (!/^cardgame-[a-f0-9]{32}$/.test(projectId))
      throw Error("CardGame 项目身份无效");
    const saved = await bindings.read(projectId);
    if (!saved)
      return;
    const binding = checkedBinding(saved.value, projectId);
    if (binding.generation)
      return binding;
    let migration = epochMigrations.get(projectId);
    if (!migration) {
      migration = (async () => {
        const latest = await bindings.read(projectId);
        if (!latest)
          throw Error("项目绑定已移除");
        const current = checkedBinding(latest.value, projectId);
        if (current.generation)
          return current;
        const generation = randomUUID();
        const migrated = { ...current, generation, legacyGeneration: generation };
        try {
          await bindings.write(projectId, migrated, { expectedRevision: latest.revision });
          return migrated;
        } catch (error) {
          const concurrent = await bindings.read(projectId);
          if (concurrent) {
            const checked = checkedBinding(concurrent.value, projectId);
            if (checked.generation)
              return checked;
          }
          throw error;
        }
      })();
      epochMigrations.set(projectId, migration);
      migration.finally(() => epochMigrations.delete(projectId)).catch(() => {
        return;
      });
    }
    return migration;
  }
  async function scoped(noteId, input) {
    const scope = await trustedNote(noteId), projectId = desktopProjectId(scope.desktopId);
    if (input?.projectId !== undefined && input.projectId !== "" && input.projectId !== projectId)
      throw Error("不能访问另一桌面的 CardGame 项目");
    const binding = await bindingByProject(projectId);
    if (binding && (binding.desktopId !== scope.desktopId || binding.notes[scope.role] !== scope.note.id))
      throw Error("CardGame 角色绑定已变化，请重新配置当前桌面");
    if (input?.projectGeneration !== undefined && input.projectGeneration !== binding?.generation)
      throw Error("CardGame 项目绑定已变化，旧编辑或回执不能写入当前项目");
    return { ...scope, binding, projectId };
  }
  async function previewNote(projectId) {
    const binding = await bindingByProject(projectId);
    if (!binding)
      throw Error("CardGame 项目尚未配置");
    const scope = await trustedNote(binding.notes.preview);
    if (scope.desktopId !== binding.desktopId || scope.role !== "preview")
      throw Error("试玩便笺已移出当前 CardGame 桌面");
    return scope.note.id;
  }
  async function child(binding) {
    assertOpen();
    let pending = children.get(binding.projectId);
    if (!pending) {
      pending = (async () => {
        const root = await validateRoot(binding.root);
        if (root !== binding.root)
          throw Error("CardGame 项目目录身份已变化，请重新核对绑定");
        let resolveMedia;
        const proxy = {
          register(name, resolver) {
            if (name !== providerName || resolveMedia)
              throw Error("CardGame 子服务媒体注册冲突");
            resolveMedia = resolver;
            return () => {
              if (resolveMedia === resolver)
                resolveMedia = undefined;
            };
          },
          issue(name, input) {
            if (name !== providerName || input.projectId !== binding.projectId)
              throw Error("CardGame 媒体项目身份不符");
            return media.issue(providerName, { ...input, projectGeneration: binding.generation });
          }
        };
        const childHost = Object.create(host);
        Object.defineProperty(childHost, "dataRoot", { value: join(host.dataRoot, "cardgame-desktops", binding.projectId, storageKey(binding)) });
        const provider = await options.createProvider(childHost, proxy, options.packageRoot, options.bunPath, [{ id: binding.projectId, root }], previewNote);
        return { provider, get resolveMedia() {
          return resolveMedia;
        } };
      })();
      children.set(binding.projectId, pending);
      pending.catch(() => {
        if (children.get(binding.projectId) === pending)
          children.delete(binding.projectId);
      });
    }
    return pending;
  }
  const removeMedia = media.register(providerName, (input) => tracked(async () => {
    if (typeof input.projectId !== "string")
      throw Error("CardGame 媒体缺少项目身份");
    const binding = await bindingByProject(input.projectId);
    if (!binding)
      throw Error("CardGame 项目尚未配置");
    if (input.projectGeneration !== binding.generation)
      throw Error("CardGame 媒体引用属于旧项目目录，请刷新后重试");
    return withChild(binding, async (entry) => {
      if (!entry.resolveMedia)
        throw Error("CardGame 媒体服务不可用");
      return entry.resolveMedia(input);
    });
  }));
  async function collectRoles(desktopId) {
    const notes = {};
    for (const row of await host.app.core.listNotes({ desktopId })) {
      if (row.value.desktopId !== desktopId || row.value.archived || row.value.draft)
        continue;
      const config = (await host.app.core.readRecord("states", `${row.value.id}:config`))?.value;
      const role = config?.cardgameRole;
      if (typeof role !== "string" || !roles.has(role))
        continue;
      if (notes[role])
        throw Error(`当前桌面有重复 CardGame 角色：${role}`);
      notes[role] = row.value.id;
    }
    if (!notes.cards || !notes.preview)
      throw Error("当前桌面缺少 cards 或 preview 角色便笺");
    return notes;
  }
  async function configure(input, caller) {
    if (!caller.noteId || !["user", "agent"].includes(caller.kind) || caller.readOnly || caller.replay || caller.dryRun || caller.scheduleId || caller.commentSource || !options.isNoteController(caller, caller.noteId))
      throw Error("项目配置仅允许当前便笺的用户或所属 Agent 明确执行");
    const scope = await trustedNote(caller.noteId);
    if (quarantined.has(scope.desktopId))
      throw Error("CardGame 旧项目服务未能完整关闭，请重启宿主后重试");
    if (input.desktopId !== undefined && input.desktopId !== scope.desktopId)
      throw Error("不能配置另一桌面");
    const previous = setups.get(scope.desktopId) ?? Promise.resolve();
    const job = previous.catch(() => {
      return;
    }).then(async () => {
      assertOpen();
      const currentScope = await trustedNote(caller.noteId);
      if (currentScope.desktopId !== scope.desktopId)
        throw Error("便笺桌面已变化");
      const notes = await collectRoles(scope.desktopId);
      if (notes[currentScope.role] !== caller.noteId)
        throw Error("当前便笺角色不属于此桌面");
      const projectId = desktopProjectId(scope.desktopId), saved = await bindings.read(projectId);
      const existing = saved ? checkedBinding(saved.value, projectId) : undefined;
      if (caller.kind === "agent" && (!caller.approve || !await caller.approve(`允许 CardGame 桌面读取并绑定项目目录 ${String(input.root)}？`, "cardgame.configureProject")))
        throw Error("项目目录需要原生确认；请由用户在内容库选择目录");
      const root = await validateRoot(input.root);
      const generation = existing?.root === root && existing.generation ? existing.generation : randomUUID();
      const legacyGeneration = existing?.root === root ? existing.generation ? existing.legacyGeneration : generation : undefined;
      const binding = { schemaVersion: 1, desktopId: scope.desktopId, projectId, root, notes, generation, ...legacyGeneration ? { legacyGeneration } : {} };
      const changing = existing && existing.root !== root;
      const written = [];
      transitions.add(scope.desktopId);
      try {
        if (changing) {
          await Promise.all([...suspendSubscriptions.get(scope.desktopId) ?? []].map((suspend) => suspend()));
          await Promise.all([...projectWork.get(scope.desktopId) ?? []]);
          const running = children.get(projectId);
          if (running) {
            const old = await running;
            try {
              await old.provider.beginClose?.();
              await old.provider.close();
            } catch (error) {
              quarantined.add(scope.desktopId);
              throw error;
            }
            children.delete(projectId);
          }
          if (host.previewProcesses) {
            const ownedNotes = new Set(Object.values(existing.notes));
            for (const preview of await host.previewProcesses.list())
              if (preview.value.noteId && ownedNotes.has(preview.value.noteId))
                await host.previewProcesses.stop(preview.key);
          }
        }
        for (const [role, noteId] of Object.entries(notes)) {
          await host.app.core.updateRecord("states", `${noteId}:config`, async (config) => {
            const current = await trustedNote(noteId);
            if (current.desktopId !== scope.desktopId || current.role !== role || config?.cardgameRole !== role)
              throw Error("配置期间桌面角色已变化，请重试");
            written.push({ noteId, before: { ...config } });
            return { ...config, projectId, projectRoot: root, notes: { ...record2(config?.notes) ? config.notes : {}, ...notes } };
          });
        }
        assertOpen();
        await bindings.write(projectId, binding, { expectedRevision: saved?.revision ?? null });
        return { configured: true, projectId, projectRoot: root, notes: { ...notes } };
      } catch (error) {
        const failures = [];
        for (const { noteId, before } of written.reverse())
          try {
            await host.app.core.updateRecord("states", `${noteId}:config`, (config) => {
              if (config?.projectId !== projectId || config.projectRoot !== root)
                return config ?? {};
              const restored = { ...config };
              for (const key of ["projectId", "projectRoot", "notes"]) {
                if (Object.hasOwn(before, key))
                  restored[key] = before[key];
                else
                  delete restored[key];
              }
              return restored;
            });
          } catch (rollback) {
            failures.push(rollback);
          }
        if (failures.length)
          throw new AggregateError([error, ...failures], "CardGame 项目绑定失败，配置回滚未完成");
        throw error;
      } finally {
        transitions.delete(scope.desktopId);
        for (const invalidate of listeners.get(scope.desktopId) ?? []) {
          try {
            invalidate();
          } catch {}
        }
      }
    });
    setups.set(scope.desktopId, job);
    job.finally(() => {
      if (setups.get(scope.desktopId) === job)
        setups.delete(scope.desktopId);
    }).catch(() => {
      return;
    });
    return job;
  }
  const query = {
    version: "1",
    load(value, context) {
      return tracked(async () => {
        if (!record2(value))
          throw Error("CardGame 查询无效");
        const scope = await scoped(context.scope.noteId, value);
        if (value.op === "projectBinding")
          return scope.binding ? { configured: true, projectId: scope.projectId, projectGeneration: scope.binding.generation, projectRoot: scope.binding.root, notes: { ...scope.binding.notes } } : { configured: false, projectId: scope.projectId, setupRequired: true };
        if (!scope.binding)
          throw Error("CardGame 项目尚未配置，请先从当前桌面选择项目目录");
        return withChild(scope.binding, async ({ provider }) => {
          if (!provider.resources?.query)
            throw Error("CardGame 查询服务不可用");
          const result = await provider.resources.query.load({ ...value, projectId: scope.projectId, projectGeneration: scope.binding.generation, allowLegacyReconciliation: scope.binding.legacyGeneration === scope.binding.generation }, context);
          return record2(result) ? { ...result, projectGeneration: scope.binding.generation } : result;
        });
      });
    },
    async subscribe(value, invalidate, context) {
      assertOpen();
      if (!record2(value))
        throw Error("CardGame 查询无效");
      const scope = await scoped(context.scope.noteId, value);
      assertOpen();
      let disposed = false, release, chain = Promise.resolve();
      const attach = () => {
        chain = chain.then(async () => {
          if (disposed || closing)
            return;
          await release?.();
          release = undefined;
          const current = await scoped(context.scope.noteId, value);
          if (current.desktopId !== scope.desktopId)
            throw Error("便笺已移出当前桌面");
          if (current.binding && value.op !== "projectBinding") {
            const next = await withChild(current.binding, ({ provider }) => Promise.resolve(provider.resources?.query?.subscribe?.({ ...value, projectId: current.projectId, projectGeneration: current.binding.generation, allowLegacyReconciliation: current.binding.legacyGeneration === current.binding.generation }, invalidate, context)));
            if (disposed || closing)
              await next?.();
            else
              release = next;
          }
        }).catch((error) => {
          if (!disposed && !closing)
            invalidate(error);
        });
      };
      const changed = () => {
        invalidate();
        attach();
      };
      const suspend = async () => {
        await chain;
        await release?.();
        release = undefined;
      };
      const suspensions = suspendSubscriptions.get(scope.desktopId) ?? new Set;
      suspensions.add(suspend);
      suspendSubscriptions.set(scope.desktopId, suspensions);
      const set = listeners.get(scope.desktopId) ?? new Set;
      set.add(changed);
      listeners.set(scope.desktopId, set);
      const dispose = async () => {
        if (disposed)
          return;
        disposed = true;
        set.delete(changed);
        suspensions.delete(suspend);
        if (!suspensions.size)
          suspendSubscriptions.delete(scope.desktopId);
        if (!set.size)
          listeners.delete(scope.desktopId);
        subscriptions.delete(dispose);
        await chain;
        await release?.();
        release = undefined;
      };
      subscriptions.add(dispose);
      attach();
      await chain;
      return dispose;
    }
  };
  return {
    resources: { query },
    beforeNativeTool: options.beforeNativeTool && ((input) => tracked(() => options.beforeNativeTool(input))),
    noteContext: (note, binding) => tracked(async () => {
      let scope;
      try {
        scope = await scoped(note.id);
      } catch {
        return [];
      }
      if (!scope.binding)
        return ["CardGame 项目尚未配置。请由用户明确选择项目目录；不要读取导入配置中的旧项目路径。"];
      return withChild(scope.binding, async ({ provider }) => await provider.noteContext?.(scope.note, binding) ?? []);
    }),
    invoke: (method, input, caller) => tracked(async () => {
      if (method === "configureProject")
        return configureProjectContract.output.parseAsync(await configure(await configureProjectContract.input.parseAsync(input), caller));
      if (["bindProduction", "productionResult", "receiveResult", "recordCandidates", "recordAdoption"].includes(method) && typeof input.projectGeneration !== "string")
        throw Error("旧回执缺少项目代次；请在当前制作单重新核对原轮次并重试，不要重建桌面");
      const scope = await scoped(caller.noteId, input);
      if (!scope.binding)
        throw Error("CardGame 项目尚未配置，请先从当前桌面选择项目目录");
      return withChild(scope.binding, ({ provider }) => provider.invoke(method, { ...input, projectId: scope.projectId, projectGeneration: scope.binding.generation, allowLegacyReconciliation: scope.binding.legacyGeneration === scope.binding.generation }, caller));
    }),
    async beginClose() {
      closing = true;
      await Promise.allSettled([...children.values()].map(async (pending) => (await pending).provider.beginClose?.()));
    },
    close() {
      return closePromise ??= (async () => {
        closing = true;
        const errors = [];
        try {
          removeMedia();
        } catch (error) {
          errors.push(error);
        }
        const subscriptionsClosed = await Promise.allSettled([...subscriptions].map((dispose) => dispose()));
        await Promise.allSettled([...active]);
        const results = await Promise.allSettled([...children.values()].map(async (pending) => (await pending).provider.close()));
        listeners.clear();
        children.clear();
        for (const result of [...subscriptionsClosed, ...results])
          if (result.status === "rejected")
            errors.push(result.reason);
        if (errors.length)
          throw new AggregateError(errors, "CardGame 子服务关闭失败");
      })();
    }
  };
}

// plugins/cardgame-content/src/production-events.ts
import { createHash as createHash2 } from "node:crypto";
import { readFile as readFile2, realpath as realpath2, stat } from "node:fs/promises";
import { isAbsolute as isAbsolute2, relative as relative2, sep as sep2 } from "node:path";
var object2 = (value) => value && typeof value === "object" && !Array.isArray(value) ? value : {};
var required2 = (value, label) => {
  if (typeof value !== "string" || !value)
    throw Error(`${label}缺失`);
  return value;
};
var digest = (value) => createHash2("sha256").update(JSON.stringify(value)).digest("hex");
function createProductionEvents(workflow, content) {
  async function detail(input) {
    return (await workflow.query({ ...input, op: "production" })).production;
  }
  function currentRound(production, input) {
    const round = production.rounds.at(-1);
    if (!round || input.round !== undefined && round.round !== input.round || input.sourceRequestId !== undefined && round.requestId !== input.sourceRequestId || round.requirementRevision !== production.requirementRevision)
      throw Error("制作轮次或需求已变化，请核对当前制作单");
    if (input.projectGeneration !== undefined && round.projectGeneration !== input.projectGeneration && !(round.projectGeneration === undefined && input.allowLegacyReconciliation === true))
      throw Error("候选轮次属于旧项目绑定，请核对历史后明确新建一轮");
    return round;
  }
  async function sourceCandidates(round, values) {
    if (!Array.isArray(values) || !values.length || values.length > 100)
      throw Error("候选需要 1–100 个本轮真实文件");
    const root = await realpath2(required2(round.requirement.outputDirectory, "轮次输出目录"));
    return Promise.all(values.map(async (value) => {
      const candidate = object2(value), path = required2(candidate.sourcePath, "候选 sourcePath");
      if (candidate.data !== undefined || candidate.base64 !== undefined)
        throw Error("生产候选只能使用本轮 sourcePath 文件，不能同时提供内联数据");
      if (!isAbsolute2(path))
        throw Error("候选文件需要绝对路径");
      const actual = await realpath2(path), inside = relative2(root, actual);
      if (!inside || inside === ".." || inside.startsWith(".." + sep2) || isAbsolute2(inside))
        throw Error("候选文件不属于当前冻结轮次的输出目录");
      const info = await stat(actual);
      if (!info.isFile() || info.size > 20000000)
        throw Error("候选文件必须是 20 MB 以内的普通文件");
      const bytes = await readFile2(actual);
      if (bytes.length > 20000000)
        throw Error("候选文件过大");
      const revision = createHash2("sha256").update(bytes).digest("hex");
      if (candidate.revision !== undefined && candidate.revision !== revision)
        throw Error("候选文件已变化，请重新核对");
      return { ...candidate, sourcePath: actual, revision };
    }));
  }
  async function prepare(input) {
    const projectId = required2(input.projectId, "项目"), projectGeneration = required2(input.projectGeneration, "项目代次");
    const scope = { projectId, projectGeneration }, productionId = required2(input.productionId, "制作单");
    if (input.kind === "generation") {
      let request = { ...input };
      if (input.retry === true) {
        const p = await detail(input), r = currentRound(p, input);
        request = { ...request, requestId: r.requestId, round: r.round };
      }
      const reserved = object2(await workflow.command("reserveProduction", request));
      const { production, round } = reserved;
      currentRound(production, { round: round.round });
      const requestId = required2(reserved.requestId, "请求"), key = `generation:${projectGeneration}:${requestId}`;
      return { name: "cardgame.production.generationRequested", key, payload: { ...scope, productionId, requestId, round: round.round }, result: reserved };
    }
    const production = await detail(input);
    if (input.kind === "candidates") {
      const round = currentRound(production, input);
      const candidates = await sourceCandidates(round, input.candidates);
      const key = `asset-candidates:${projectGeneration}:${projectId}:${productionId}:${round.round}:${round.requestId}:${digest(candidates).slice(0, 16)}`;
      return { name: "cardgame.production.candidatesRequested", key, payload: { ...scope, productionId, round: round.round, sourceRequestId: round.requestId, requestId: key, candidates }, result: {} };
    }
    if (input.kind === "adoption")
      throw Error("通用素材直接采用尚未开放。请查看或复制候选引用；卡牌与牌组请建立试玩候选，再在功能进展确认。");
    throw Error("未知生产事件");
  }
  async function receiveResult(input) {
    const production = await detail(input), round = production.rounds.find((round) => round.requestId === input.requestId && (input.round === undefined || round.round === input.round));
    const latest = production.rounds.at(-1);
    if (!round || round.requestId !== latest?.requestId || round.requirementRevision !== production.requirementRevision)
      return workflow.command("productionResult", input);
    const result = object2(input.result ?? input), values = result.candidateRefs ?? result.candidates ?? result.assetCandidates;
    if (values !== undefined) {
      const candidates = await sourceCandidates(round, values);
      return workflow.command("productionResult", { ...input, result: { ...result, candidateRefs: candidates } });
    }
    return workflow.command("productionResult", input);
  }
  async function recordCandidates(input) {
    const production = await detail(input), round = currentRound(production, input);
    const sources = await sourceCandidates(round, input.sourceCandidates);
    if (!Array.isArray(input.candidates) || input.candidates.length !== sources.length)
      throw Error("候选回执数量不符");
    const candidates = await Promise.all(input.candidates.map(async (value, index) => {
      const candidate = object2(value), id = required2(candidate.id, "候选身份");
      const asset = await content.query({ projectId: production.projectId, op: "asset", id });
      const media = await content.resolveMedia({ projectId: production.projectId, op: "media", id, variant: "original" });
      if (asset.status !== "candidate" || asset.revision !== sources[index].revision || media.revision !== sources[index].revision)
        throw Error("候选服务回执与本轮真实文件不符");
      return { ...asset, id, revision: asset.revision };
    }));
    return workflow.command("recordCandidates", { ...input, receipt: undefined, candidates }, { assets: { registerCandidates: async () => ({ status: "completed", result: candidates }) } });
  }
  async function recordAdoption(input) {
    const production = await detail(input), assetId = required2(input.assetId, "资源"), versionId = required2(input.versionId, "版本"), candidateId = required2(input.candidateId, "候选");
    const asset = await content.query({ projectId: production.projectId, op: "asset", id: assetId });
    if (asset.currentVersionId !== versionId)
      throw Error("资源服务尚未采用该版本");
    let cursor, revision, version;
    do {
      const page = await content.query({ projectId: production.projectId, op: "versions", assetId, limit: 100, ...cursor ? { cursor } : {} });
      if (revision !== undefined && revision !== page.revision)
        throw Error("资源版本列表已变化，请重新核对采用回执");
      revision = page.revision;
      version = page.items.find((item) => item.id === versionId);
      cursor = page.next;
    } while (!version && cursor);
    if (!version || version.candidateId !== candidateId)
      throw Error("已采用版本不是该候选的真实回执");
    await content.resolveMedia({ projectId: production.projectId, op: "media", id: assetId, versionId, variant: "original" });
    return workflow.command("recordAdoption", { ...input, receipt: undefined }, { assets: { adoptVersion: async () => ({ status: "completed", result: { assetId, versionId } }) } });
  }
  return { prepare, receiveResult, recordCandidates, recordAdoption };
}

// plugins/cardgame-content/src/context.ts
var quote = (value) => JSON.stringify(value);
async function readDetail(host, noteId, projectId, op, id, extra = {}) {
  const value = await host.runtime.resources?.read({ name: "extension.cardgame-content.query", input: { ...extra, projectId, op, ...op === "production" ? { productionId: id } : { id } } }, { access: { noteId, version: (await host.app.note(noteId)).value.codeVersion ?? "", caller: { kind: "system" } } });
  const data = value?.data;
  return data && typeof data === "object" && !Array.isArray(data) ? data : undefined;
}
async function cardgameSelectionLines(host, note) {
  const config = await host.app.core.readRecord("states", `${note.id}:config`).catch(() => {
    return;
  });
  const projectId = config?.value?.projectId;
  if (typeof projectId !== "string" || !projectId.trim())
    return [];
  const state = await host.app.core.readRecord("states", note.stateRef).catch(() => {
    return;
  });
  const mode = config?.value?.mode;
  const kind = config?.value?.catalogRef?.kind;
  const selection = [];
  if (config?.value?.presentation === "changes" && typeof state?.value?.changeSelection === "string")
    selection.push({ op: "production", id: state.value.changeSelection });
  if (config?.value?.presentation === "balance")
    selection.push({ op: "balanceOverview", id: "current-definitions" });
  else if (mode === "cards") {
    for (const id of state?.value?.views?.cardsSelection ?? [])
      if (typeof id === "string")
        selection.push({ op: "card", id });
  }
  if (mode === "assets" && typeof state?.value?.views?.assetsSelection === "string")
    selection.push({ op: "asset", id: state.value.views.assetsSelection });
  if (config?.value?.presentation === "story" && typeof state?.value?.views?.storySelection === "string")
    selection.push({ op: "storyAnalysis", id: state.value.views.storySelection });
  else if (mode === "knowledge" && typeof state?.value?.views?.knowledgeSelection?.path === "string")
    selection.push({ op: "document", id: state.value.views.knowledgeSelection.path });
  if (kind === "production" && typeof state?.value?.selectedId === "string")
    selection.push({ op: "production", id: state.value.selectedId });
  const projectRoot = config?.value?.projectRoot;
  const boundary = `这是已登记的正式项目${typeof projectRoot === "string" ? `，目录 ${quote(projectRoot)}` : ""}；便笺工作目录即使看起来是临时目录也不是创作候选。不要用 Bash、Edit、Write 或 git commit 直接修改它。卡牌改动须调用卡牌库 createCardWorkflow，再通过制作便笺 cardWorkflow 的 saveCardDraft、assembleCardFaces、integrateCard 生成候选；该候选由服务自动登记原试玩便笺。`;
  if (!selection.length)
    return [`CardGame 项目 ${quote(projectId)}；当前便笺尚无选中对象。${boundary}在试玩便笺验证后仅由功能进展确认采用。`];
  const lines = [`CardGame 项目 ${quote(projectId)}；${boundary}当前选中对象（每次发送消息按当前便笺状态重新读取）：`];
  for (const item of selection.slice(0, 3)) {
    const detail = await readDetail(host, note.id, projectId, item.op, item.id).catch(() => {
      return;
    });
    const revision = detail?.revision ?? detail?.production?.revision;
    const candidates = detail?.production?.gameCandidates;
    lines.push(`- ${item.op} ${quote(item.id)}${revision !== undefined ? ` · revision ${quote(String(revision))}` : " · revision 需重新查询"}${candidates?.length ? ` · 候选 ${candidates.slice(-3).map((candidate) => `${candidate.id}@${candidate.commit.slice(0, 8)}(${candidate.status})`).join("、")}` : ""}`);
    if (item.op === "storyAnalysis") {
      const selectedNode = state?.value?.views?.storyNodeSelection;
      const nodes = Array.isArray(detail?.nodes) ? detail.nodes : [];
      if (selectedNode?.storyId === item.id && typeof selectedNode.nodeId === "string") {
        const node = nodes.find((node) => node.id === selectedNode.nodeId);
        lines.push(`  剧情节点 ${quote(selectedNode.nodeId)}${node ? "" : "（当前版本已不存在，修改前重新选择）"}`);
        for (const source of node?.sources ?? [])
          lines.push(`  同 ID 场景原文 ${quote(source.path)} · revision ${quote(source.revision)}；仅按节点 ID 关联，不代表当前运行版本由此原文编译。`);
      }
    }
    if (item.op === "balanceOverview") {
      const selectedMetric = state?.value?.views?.balanceMetricSelection;
      const groups = Array.isArray(detail?.groups) ? detail.groups : [];
      const metric = selectedMetric && ["attack", "health"].includes(selectedMetric.metric) ? selectedMetric.metric : undefined;
      const group = groups.find((group) => group.kind === selectedMetric?.kind);
      if (metric && group)
        lines.push(`  定义统计 ${quote(String(selectedMetric.kind))} / ${metric}：${JSON.stringify(group[metric])}；不包含战斗效果，不是对局胜率。`);
      const comparison = state?.value?.views?.battleComparisonSelection;
      if (comparison) {
        const validRef = (value) => value && typeof value.experimentId === "string" && typeof value.reportId === "string";
        if (!validRef(comparison.before) || !validRef(comparison.after))
          lines.push("  对局比较引用无效，请在数值区重新选择，不能据此推断结果。");
        else {
          const refs = { before: { experimentId: comparison.before.experimentId, reportId: comparison.before.reportId }, after: { experimentId: comparison.after.experimentId, reportId: comparison.after.reportId } };
          lines.push(`  对局报告引用 ${JSON.stringify(refs)}。`);
          const result = await readDetail(host, note.id, projectId, "battleComparison", "selected-comparison", refs).catch(() => {
            return;
          });
          if (!result)
            lines.push("  所选对局比较当前无法读取或设置不兼容；不可使用旧结果，请重新查询报告或选择。");
          else {
            lines.push(`  实验设置 ${JSON.stringify(result.settings)}；版本 ${JSON.stringify({ before: result.beforeVersion, after: result.afterVersion })}。`);
            lines.push(`  成对描述统计 ${JSON.stringify({ pairedCount: result.pairedCount, excludedSeeds: result.excludedSeeds, beforeVictoryRate: result.beforeVictoryRate, afterVictoryRate: result.afterVictoryRate })}。`);
            lines.push("  仅统计相同设置下两侧均完成的种子；失败和未完成不计作败局，不代表玩家胜率或单卡因果效果。样本充分性尚未评估，不可据此判定强弱或平衡。这些是固定历史快照，不自动等于当前项目或最新候选。");
          }
        }
      }
    }
  }
  lines.push("修改前查询对象的当前 revision；旧回执不能覆盖较新的要求。仅在功能进展中确认采用正式源码。");
  return lines;
}

// plugins/cardgame-content/src/pinned-references.ts
import { createHash as createHash3 } from "node:crypto";

// plugins/cardgame-content/src/changes.ts
var gameChangeFilters = {
  draft: ["draft"],
  running: ["running"],
  candidate: ["generated", "checking", "review"],
  attention: ["cancelled", "paused", "interrupted", "needs-input", "failed", "stale"],
  adopted: ["adopted"],
  undone: ["undone"]
};
function projectGameChange(production, verified = new Set) {
  const latest = new Map;
  for (const candidate of production.gameCandidates ?? [])
    latest.set(`${candidate.kind ?? "card"}:${candidate.targetId ?? candidate.cardId}`, candidate.id);
  const candidates = (production.gameCandidates ?? []).map((candidate) => ({
    id: candidate.id,
    kind: candidate.kind ?? "card",
    targetId: candidate.targetId ?? candidate.cardId,
    commit: candidate.commit,
    status: candidate.status,
    current: production.gameCandidateOrigins?.[candidate.id]?.requirementRevision === production.requirementRevision && (production.gameCandidateOrigins?.[candidate.id]?.round ?? 0) === (production.rounds.at(-1)?.round ?? 0) && latest.get(`${candidate.kind ?? "card"}:${candidate.targetId ?? candidate.cardId}`) === candidate.id,
    previewVerified: verified.has(candidate.id)
  }));
  const round = production.rounds.at(-1);
  const currentRound = round?.requirementRevision === production.requirementRevision ? round : undefined;
  const status = currentRound?.status ?? (round ? "stale" : production.status);
  const current = candidates.filter((candidate) => candidate.current);
  let stage;
  if (["reserved", "queued", "running", "pending"].includes(status))
    stage = "running";
  else if (status === "cancelled" || status === "paused" || status === "interrupted")
    stage = status;
  else if (status === "failed")
    stage = "failed";
  else if (status === "needs-input")
    stage = "needs-input";
  else if (current.some((candidate) => candidate.status === "candidate")) {
    stage = current.some((candidate) => candidate.status === "candidate" && candidate.previewVerified) ? "review" : "checking";
  } else if (current.length && current.every((candidate) => candidate.status === "undone"))
    stage = "undone";
  else if (current.some((candidate) => candidate.status === "adopted"))
    stage = "adopted";
  else if (candidates.length || status === "stale")
    stage = "stale";
  else if (status === "completed" || status === "adopted")
    stage = "generated";
  else
    stage = "draft";
  return {
    id: production.id,
    projectId: production.projectId,
    productionId: production.id,
    ...production.featureId ? { featureId: production.featureId } : {},
    ...production.todoId ? { todoId: production.todoId } : {},
    title: production.brief,
    revision: production.revision,
    requirementRevision: production.requirementRevision,
    round: round?.round ?? 0,
    stage,
    ...currentRound?.result?.error || currentRound?.result?.conclusion ? { detail: currentRound.result.error || currentRound.result.conclusion } : {},
    updatedAt: production.updatedAt,
    candidates
  };
}

// plugins/cardgame-content/src/pinned-references.ts
var PINNED_REFERENCE_LIMIT = 8;
var operations = { card: "card", asset: "asset", document: "document", production: "production", candidate: "production", story: "storyAnalysis", balance: "balanceOverview", deck: "gameDeck", battleComparison: "battleComparison" };
var recordKey = (projectId) => `cardgame:pinned-references:${encodeURIComponent(projectId)}`;
function required3(value, name, max = 1024) {
  if (typeof value !== "string" || !value.trim() || value.length > max)
    throw Error(`固定引用的 ${name} 无效`);
  return value;
}
function locator(projectId, input) {
  if (input.projectId !== undefined && input.projectId !== projectId)
    throw Error("不能固定另一项目的对象");
  const kind = required3(input.kind, "kind");
  if (!Object.hasOwn(operations, kind))
    throw Error("不支持这种固定引用");
  const id = required3(kind === "document" ? input.path ?? input.id : input.id, "id");
  const anchor = input.anchor === undefined ? undefined : required3(input.anchor, "anchor");
  if (anchor && kind !== "story")
    throw Error("只有剧情引用支持节点定位");
  let context;
  if (kind === "balance") {
    if (id !== "current-definitions")
      throw Error("定义统计身份无效");
    if (input.context !== undefined) {
      const metric = input.context;
      if (!metric || typeof metric.metric !== "string" || !["attack", "health"].includes(metric.metric))
        throw Error("定义指标无效");
      context = { kind: required3(metric.kind, "指标类别", 80), metric: metric.metric };
    }
  } else if (kind === "candidate") {
    const candidate = input.context;
    const commit = required3(candidate?.commit, "commit", 40);
    if (!/^[a-f0-9]{40}$/.test(commit))
      throw Error("候选提交无效");
    context = { productionId: required3(candidate?.productionId, "productionId"), commit };
  } else if (kind === "battleComparison") {
    if (id !== "paired-reports")
      throw Error("报告比较身份无效");
    const pair = input.context;
    const report = (value) => {
      const ref = value;
      return { experimentId: required3(ref?.experimentId, "experimentId", 64), reportId: required3(ref?.reportId, "reportId", 64) };
    };
    context = { before: report(pair?.before), after: report(pair?.after) };
  } else if (input.context !== undefined)
    throw Error("此类固定引用不支持额外上下文");
  const identity = { projectId, kind, id, ...anchor ? { anchor } : {}, ...context ? { context } : {} };
  const key = createHash3("sha256").update(JSON.stringify(identity)).digest("hex");
  return { ...identity, key, ...kind === "document" ? { path: id } : {} };
}
function createPinnedReferenceService(core, resolve) {
  async function inspect(ref) {
    const raw = await resolve({ projectId: ref.projectId, op: operations[ref.kind], ...ref.kind === "battleComparison" ? ref.context : {}, ...ref.kind === "candidate" ? { productionId: ref.context?.productionId } : ref.kind === "production" ? { productionId: ref.id } : { id: ref.id } });
    if (!raw || typeof raw !== "object" || Array.isArray(raw))
      throw Error("对象暂时无法读取");
    const detail = raw;
    if (ref.kind === "candidate") {
      const production = detail.production;
      const candidate = production?.gameCandidates?.find((candidate) => candidate.id === ref.id);
      if (!production || production.id !== ref.context?.productionId || production.projectId !== ref.projectId || !candidate || candidate.projectId !== ref.projectId || candidate.productionId !== production.id || candidate.commit !== ref.context?.commit || !/^[a-f0-9]{64}$/.test(candidate.candidateHash))
        throw Error("候选身份已变化或无法读取");
      const origin = production.gameCandidateOrigins?.[candidate.id];
      const binding = {
        productionId: production.id,
        candidateId: candidate.id,
        candidateHash: candidate.candidateHash,
        commit: candidate.commit,
        productionRevision: production.revision,
        requirementRevision: origin?.requirementRevision ?? null,
        round: origin?.round ?? null,
        currentRequirementRevision: production.requirementRevision,
        currentRound: production.rounds.at(-1)?.round ?? 0,
        current: projectGameChange(production).candidates.find((item) => item.id === candidate.id)?.current ?? false,
        status: candidate.status
      };
      return { revision: createHash3("sha256").update(JSON.stringify(binding)).digest("hex"), title: `候选 ${candidate.targetId ?? candidate.cardId} · ${candidate.commit.slice(0, 8)}`, binding };
    }
    if (ref.kind === "battleComparison") {
      if (!detail.beforeVersion || !detail.afterVersion || !detail.settings)
        throw Error("比较报告身份不完整");
      return { revision: createHash3("sha256").update(JSON.stringify(detail)).digest("hex"), title: `对局报告比较 · ${String(ref.context?.before?.reportId).slice(0, 8)} → ${String(ref.context?.after?.reportId).slice(0, 8)}` };
    }
    const object = ref.kind === "production" ? detail.production : detail;
    if (!object || !["string", "number"].includes(typeof object.revision))
      throw Error("对象没有可核对的修订");
    if (ref.anchor && (!Array.isArray(detail.nodes) || !detail.nodes.some((node) => node.id === ref.anchor)))
      throw Error("剧情节点已不存在");
    if (ref.kind === "balance" && ref.context && (!Array.isArray(detail.groups) || !detail.groups.some((group) => group.kind === ref.context?.kind && group[String(ref.context?.metric)] !== undefined)))
      throw Error("定义指标已不存在");
    const title = ref.kind === "balance" ? `正式定义统计${ref.context ? ` · ${ref.context.kind} / ${ref.context.metric}` : ""}` : String(object.title ?? object.name ?? (ref.kind === "production" ? object.brief : undefined) ?? ref.id).slice(0, 200);
    return { revision: String(object.revision), title };
  }
  async function stored(projectId) {
    const row = await core.readRecord("states", recordKey(projectId));
    return row?.value.items ?? [];
  }
  return {
    async describe(projectId, input) {
      const ref = locator(projectId, input);
      return { ...ref, ...await inspect(ref) };
    },
    async pin(projectId, input) {
      const ref = locator(projectId, input);
      const expected = required3(input.revision, "revision");
      const row = await core.updateRecord("states", recordKey(projectId), async (value) => {
        const items = value?.items ?? [];
        const current = await inspect(ref);
        if (current.revision !== expected)
          throw Error("对象版本已变化，请刷新后重新固定");
        const existing = items.find((item) => item.key === ref.key);
        if (existing) {
          if (existing.revision !== expected)
            throw Error("已固定旧版本，请先移除再固定当前版本");
          return { items };
        }
        if (items.length >= PINNED_REFERENCE_LIMIT)
          throw Error(`最多固定 ${PINNED_REFERENCE_LIMIT} 项，请先移除一项`);
        return { items: [...items, { ...ref, ...current }] };
      });
      return { items: row.value.items, limit: PINNED_REFERENCE_LIMIT };
    },
    async remove(projectId, key) {
      const target = required3(key, "key", 64);
      await core.updateRecord("states", recordKey(projectId), (value) => ({ items: (value?.items ?? []).filter((item) => item.key !== target) }));
      return { removed: true };
    },
    async query(projectId) {
      const items = await Promise.all((await stored(projectId)).map(async (ref) => {
        try {
          const current = await inspect(ref);
          return { ...ref, currentRevision: current.revision, freshness: current.revision === ref.revision ? "current" : "stale" };
        } catch {
          return { ...ref, freshness: "unavailable" };
        }
      }));
      return { items, limit: PINNED_REFERENCE_LIMIT };
    },
    subscribe(projectId, invalidate) {
      return core.subscribe("states", recordKey(projectId), invalidate);
    }
  };
}
function pinnedReferenceLines(items) {
  if (!items.length)
    return [];
  return ["本项目跨区域固定引用（仅附加上下文，不代表已授权改动；每次发送重新核对）：", ...items.map((item) => {
    const ref = { projectId: item.projectId, kind: item.kind, id: item.id, ...item.path ? { path: item.path } : {}, ...item.anchor ? { anchor: item.anchor } : {}, revision: item.revision, ...item.context ? { context: item.context } : {}, ...item.binding ? { binding: item.binding } : {} };
    return `- ${JSON.stringify(ref)}${item.kind === "battleComparison" ? " · 历史报告比较，仅同设置下双方完成种子的描述统计，不代表当前项目、玩家胜率或单卡因果效果；样本充分性未评估" : item.kind === "balance" ? " · 正式定义统计，不是对局测量" : ""} · ${item.freshness === "current" ? "版本一致；读取内容后再使用" : item.freshness === "stale" ? `版本已变化，当前 revision ${JSON.stringify(item.currentRevision)}；不可把固定的旧修订当成当前内容` : "当前无法读取或定位；不可沿用旧内容推断"}。`;
  })];
}

// plugins/cardgame-content/src/path-safety.ts
import path from "node:path";
function isPathDescendant(root, target, paths = path) {
  const relative = paths.relative(paths.resolve(root), paths.resolve(target));
  return Boolean(relative) && relative !== ".." && !relative.startsWith(`..${paths.sep}`) && !paths.isAbsolute(relative);
}

// plugins/cardgame-content/src/battle-execution-service.ts
import { createHash as createHash5, randomUUID as randomUUID3 } from "node:crypto";
import { mkdir as mkdir2, readFile as readFile4, writeFile as writeFile2, rename as rename2, readdir as readdir2, stat as stat2, realpath as realpath4, lstat as lstat3 } from "node:fs/promises";
import { watch } from "node:fs";
import { join as join3 } from "node:path";

// plugins/cardgame-content/src/battle-snapshot.ts
import { createHash as createHash4, randomUUID as randomUUID2 } from "node:crypto";
import { lstat as lstat2, mkdir, readFile as readFile3, readdir, realpath as realpath3, rename, rm, writeFile } from "node:fs/promises";
import { dirname, join as join2, resolve, sep as sep3 } from "node:path";
var digest2 = (bytes) => createHash4("sha256").update(bytes).digest("hex");
var roots = ["src", "public", "package.json", "bun.lock", "bun.lockb", "package-lock.json", "pnpm-lock.yaml", "tsconfig.json", "tsconfig.node.json"];
var limit = 512 * 1024 * 1024;
var previewRoots = [...roots, "index.html", "vite", "vite.config.ts", "vite.config.mjs", "tsconfig.app.json", "knowledge"];
async function filesIn(root, scope = "battle") {
  const files = [];
  async function walk(path, optional = false) {
    const absolute = join2(root, path);
    const info = await lstat2(absolute).catch((error) => {
      if (optional && error.code === "ENOENT")
        return;
      throw error;
    });
    if (!info)
      return;
    if (info.isSymbolicLink() || !(await realpath3(absolute)).startsWith(root + sep3))
      throw Error(`实验快照不接受符号链接或越界文件：${path}`);
    if (info.isDirectory())
      for (const child of (await readdir(absolute)).sort())
        await walk(`${path}/${child}`);
    else if (info.isFile()) {
      files.push(path);
      if (files.length > 20000)
        throw Error("实验快照超过 20000 个文件");
    } else
      throw Error(`实验快照包含非普通文件：${path}`);
  }
  for (const path of scope === "game-preview" ? previewRoots : roots)
    await walk(path, !["src", "public", "package.json"].includes(path));
  return files.sort();
}
async function readBattleProjectRevision(projectRoot, scope = "battle") {
  const root = await realpath3(projectRoot);
  async function scan() {
    const paths = await filesIn(root, scope), files = [];
    let total = 0;
    for (const path of paths) {
      const absolute = join2(root, path), info = await lstat2(absolute);
      if (!info.isFile() || info.isSymbolicLink() || !(await realpath3(absolute)).startsWith(root + sep3))
        throw Error(`核对期间文件身份变化：${path}`);
      if (info.size > limit - total)
        throw Error("项目核对超过 512 MiB");
      const bytes = await readFile3(absolute);
      total += bytes.length;
      if (total > limit)
        throw Error("项目核对超过 512 MiB");
      files.push({ path, sha256: digest2(bytes), bytes: bytes.length });
    }
    return files;
  }
  const first = await scan(), second = await scan();
  if (JSON.stringify(first) !== JSON.stringify(second))
    throw Error("核对期间项目发生变化，请刷新重试");
  return {
    contentRevision: digest2(JSON.stringify(first.filter((file) => file.path.startsWith("public/")))),
    runtimeRevision: digest2(JSON.stringify(first.filter((file) => !file.path.startsWith("public/"))))
  };
}
async function createBattleSnapshot(projectRoot, destinationRoot, scope = "battle") {
  const source = await realpath3(projectRoot), destination = resolve(destinationRoot);
  async function futureRealpath(path) {
    try {
      return await realpath3(path);
    } catch (error) {
      if (error.code !== "ENOENT")
        throw error;
      return join2(await futureRealpath(dirname(path)), path.slice(dirname(path).length + 1));
    }
  }
  const canonicalDestination = await futureRealpath(destination);
  if (canonicalDestination === source || canonicalDestination.startsWith(source + sep3))
    throw Error("实验快照必须保存在游戏项目之外");
  await mkdir(destination, { recursive: true, mode: 448 });
  const id = randomUUID2(), staging = join2(destination, `.${id}.pending`), final = join2(destination, id);
  await mkdir(staging, { mode: 448 });
  try {
    for (const path of ["src", "public"])
      await mkdir(join2(staging, "project", path), { recursive: true, mode: 448 });
    const paths = await filesIn(source, scope), files = [];
    let total = 0;
    for (const path of paths) {
      const info = await lstat2(join2(source, path));
      if (!info.isFile() || info.isSymbolicLink() || !(await realpath3(join2(source, path))).startsWith(source + sep3))
        throw Error(`快照期间文件身份变化：${path}`);
      if (info.size > limit - total)
        throw Error("实验快照超过 512 MiB");
      const bytes = await readFile3(join2(source, path));
      total += bytes.length;
      if (total > limit)
        throw Error("实验快照超过 512 MiB");
      files.push({ path, sha256: digest2(bytes), bytes: bytes.length });
      const target = join2(staging, "project", path);
      await mkdir(dirname(target), { recursive: true, mode: 448 });
      await writeFile(target, bytes, { mode: 384, flag: "wx" });
    }
    if (JSON.stringify(await filesIn(source, scope)) !== JSON.stringify(paths))
      throw Error("生成快照期间项目文件列表发生变化，请重试");
    for (const file of files)
      if (digest2(await readFile3(join2(source, file.path))) !== file.sha256)
        throw Error(`生成快照期间内容发生变化：${file.path}`);
    const revision = (entries) => digest2(JSON.stringify(entries));
    const manifest = {
      schemaVersion: 1,
      ...scope === "game-preview" ? { scope } : {},
      id,
      createdAt: new Date().toISOString(),
      files,
      contentRevision: revision(files.filter((file) => file.path.startsWith("public/"))),
      runtimeRevision: revision(files.filter((file) => !file.path.startsWith("public/"))),
      snapshotRevision: revision(files)
    };
    await writeFile(join2(staging, "manifest.json"), JSON.stringify(manifest, null, 2), { mode: 384 });
    await rename(staging, final);
    return { directory: final, projectRoot: join2(final, "project"), manifest };
  } catch (error) {
    await rm(staging, { recursive: true, force: true });
    throw error;
  }
}
async function verifyBattleSnapshot(directory) {
  const manifest = JSON.parse(await readFile3(join2(directory, "manifest.json"), "utf8"));
  if (manifest.schemaVersion !== 1 || manifest.scope !== undefined && manifest.scope !== "game-preview" || !Array.isArray(manifest.files))
    throw Error("无效实验快照清单");
  const root = await realpath3(join2(directory, "project"));
  const paths = await filesIn(root, manifest.scope ?? "battle");
  if (JSON.stringify(paths) !== JSON.stringify(manifest.files.map((file) => file.path)))
    throw Error("实验快照文件列表已变化");
  for (const file of manifest.files) {
    const bytes = await readFile3(join2(root, file.path));
    if (bytes.length !== file.bytes || digest2(bytes) !== file.sha256)
      throw Error(`实验快照已变化：${file.path}`);
  }
  const revision = (entries) => digest2(JSON.stringify(entries));
  if (manifest.snapshotRevision !== revision(manifest.files) || manifest.contentRevision !== revision(manifest.files.filter((file) => file.path.startsWith("public/"))) || manifest.runtimeRevision !== revision(manifest.files.filter((file) => !file.path.startsWith("public/"))))
    throw Error("实验快照指纹不一致");
  return manifest;
}
var createGamePreviewSnapshot = (projectRoot, destinationRoot) => createBattleSnapshot(projectRoot, destinationRoot, "game-preview");
var readGamePreviewProjectRevision = (projectRoot) => readBattleProjectRevision(projectRoot, "game-preview");

// plugins/cardgame-content/src/battle-experiment.ts
var digest3 = async (value) => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(value))))].map((byte) => byte.toString(16).padStart(2, "0")).join("");
function validateBattleSettings(input) {
  if (!input.deckId?.trim() || !input.encounterId?.trim() || !input.policyVersion?.trim())
    throw Error("需要牌组、遭遇和策略版本");
  if (input.opening !== "player-first")
    throw Error("当前游戏只支持玩家先行动的非对称遭遇");
  if (!Array.isArray(input.seeds) || input.seeds.length < 1 || input.seeds.length > 200 || input.seeds.some((seed) => !Number.isInteger(seed) || seed < 0 || seed > 4294967295) || new Set(input.seeds).size !== input.seeds.length)
    throw Error("需要 1–200 个不同的无符号 32 位种子");
  if (!Number.isInteger(input.turnLimit) || input.turnLimit < 1 || input.turnLimit > 200 || !Number.isInteger(input.actionLimit) || input.actionLimit < 1 || input.actionLimit > 1e4)
    throw Error("对局预算超出范围");
  return { deckId: input.deckId, encounterId: input.encounterId, policyVersion: input.policyVersion, opening: input.opening, seeds: [...input.seeds], turnLimit: input.turnLimit, actionLimit: input.actionLimit };
}
function validateTrial(trial, settings) {
  if (!["victory", "defeat", "draw", "incomplete"].includes(trial.outcome) || !Number.isInteger(trial.turns) || trial.turns < 0 || trial.turns > settings.turnLimit || !Number.isInteger(trial.actions) || trial.actions < 0 || trial.actions > settings.actionLimit || !Array.isArray(trial.playedCardIds) || trial.playedCardIds.some((id) => typeof id !== "string" || !id) || !/^[a-f0-9]{64}$/.test(trial.finalStateHash) || trial.outcome === "incomplete" && !trial.reason?.trim())
    throw Error("执行器返回了无效对局结果");
}
async function compareBattleExperiments(before, after) {
  if (await digest3(validateBattleSettings(before.settings)) !== before.settingsHash || await digest3(validateBattleSettings(after.settings)) !== after.settingsHash)
    throw Error("报告实验设置指纹不一致");
  if (before.settingsHash !== after.settingsHash || before.adapterVersion !== after.adapterVersion)
    throw Error("仅能比较相同种子、牌组、遭遇、策略、先手和预算的报告");
  const left = new Map(before.trials.map((trial) => [trial.seed, trial])), right = new Map(after.trials.map((trial) => [trial.seed, trial]));
  if (left.size !== before.trials.length || right.size !== after.trials.length)
    throw Error("报告含重复种子");
  if ([...left.keys(), ...right.keys()].some((seed) => !before.settings.seeds.includes(seed)))
    throw Error("报告含实验设置之外的种子");
  const pairs = [];
  const excluded = [];
  for (const seed of before.settings.seeds) {
    const a = left.get(seed)?.result, b = right.get(seed)?.result;
    if (!a || !b || a.outcome === "incomplete" || b.outcome === "incomplete") {
      excluded.push(seed);
      continue;
    }
    validateTrial(a, before.settings);
    validateTrial(b, after.settings);
    pairs.push({ seed, before: a.outcome, after: b.outcome });
  }
  const rate = (side) => pairs.length ? pairs.filter((pair) => pair[side] === "victory").length / pairs.length : null;
  return {
    pairs,
    excludedSeeds: excluded,
    pairedCount: pairs.length,
    beforeVictoryRate: rate("before"),
    afterVictoryRate: rate("after"),
    beforeVersion: { content: before.contentRevision, runtime: before.runtimeRevision },
    afterVersion: { content: after.contentRevision, runtime: after.runtimeRevision },
    interpretation: "同一自动策略与设置下的成对描述统计；不代表玩家胜率或单张卡牌的因果效果。"
  };
}

// plugins/cardgame-content/src/battle-execution-service.ts
var uuid2 = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
async function createBattleExecutionService(options) {
  const directory = join3(options.dataRoot, "battle-experiments");
  await mkdir2(directory, { recursive: true, mode: 448 });
  const live = new Map, pending = new Map, stopping = new Set, listeners = new Set;
  const pendingSelections = new Map;
  let closed = false;
  const invalidate = () => {
    for (const listener of listeners) {
      try {
        listener();
      } catch {}
    }
  };
  const watcher = watch(directory, { recursive: true }, invalidate);
  watcher.on("error", () => invalidate());
  const rootFor = (projectId) => {
    const project = options.projects.find((item) => item.id === projectId);
    if (!project)
      throw Error("未登记的游戏项目");
    return { project, root: join3(directory, createHash5("sha256").update(projectId).digest("hex")) };
  };
  async function load(projectId) {
    const { root } = rootFor(projectId);
    try {
      return JSON.parse(await readFile4(join3(root, "current.json"), "utf8"));
    } catch (error) {
      if (error.code === "ENOENT")
        return;
      throw error;
    }
  }
  async function save(record) {
    const { root } = rootFor(record.projectId);
    await mkdir2(root, { recursive: true, mode: 448 });
    const temp = join3(root, randomUUID3() + ".tmp");
    await writeFile2(temp, JSON.stringify(record), { mode: 384 });
    await rename2(temp, join3(root, "current.json"));
    invalidate();
    const runRoot = join3(root, "runs", record.id), runTemp = join3(runRoot, randomUUID3() + ".tmp");
    await writeFile2(runTemp, JSON.stringify(record), { mode: 384 });
    await rename2(runTemp, join3(runRoot, "experiment.json"));
  }
  async function query(projectId) {
    const { root, project } = rootFor(projectId), record = await load(projectId);
    const sources = new Map, records = new Map;
    const reportFiles = [];
    const entries = await readdir2(join3(root, "runs")).catch((error) => {
      if (error.code === "ENOENT")
        return [];
      throw error;
    });
    for (const id of entries.filter((id) => /^[a-f0-9-]{36}$/.test(id))) {
      const saved = await readFile4(join3(root, "runs", id, "experiment.json"), "utf8").then((value) => JSON.parse(value), (error) => {
        if (error.code === "ENOENT")
          return;
        throw error;
      });
      if (saved)
        records.set(id, saved);
      if (saved?.source)
        sources.set(id, saved.source);
      const reports = join3(root, "runs", id, "output/reports");
      const files = await readdir2(reports).catch((error) => {
        if (error.code === "ENOENT")
          return [];
        throw error;
      });
      for (const name of files.filter((name) => uuid2.test(name.replace(/\.json$/, "")) && name.endsWith(".json"))) {
        const path = join3(reports, name);
        reportFiles.push({ path, modified: (await stat2(path)).mtimeMs, experimentId: id, reportId: name.slice(0, -5) });
      }
    }
    reportFiles.sort((a, b) => b.modified - a.modified);
    const current = reportFiles.length ? await readBattleProjectRevision(project.root).then((revision) => ({ revision, error: "" }), (error) => ({ revision: undefined, error: error instanceof Error ? error.message : String(error) })) : undefined;
    const checkedAt = new Date().toISOString();
    const reports = await Promise.all(reportFiles.slice(0, 30).map(async (file) => {
      const report = JSON.parse(await readFile4(file.path, "utf8")), saved = records.get(file.experimentId);
      const known = current?.revision && saved?.sourceRevision && saved.contentRevision === report.contentRevision && saved.runtimeRevision === report.runtimeRevision;
      const projectStatus = !known ? "unknown" : current.revision.contentRevision === report.contentRevision && current.revision.runtimeRevision === saved.sourceRevision ? "matches-project" : "different-project";
      return {
        experimentId: file.experimentId,
        reportId: file.reportId,
        ...sources.has(file.experimentId) ? { source: sources.get(file.experimentId) } : {},
        report,
        projectCheck: { status: projectStatus, checkedAt, scope: "project-files", ...current?.error ? { error: current.error } : {} }
      };
    }));
    const status = pending.has(projectId) ? "preparing" : record && ["running", "preparing"].includes(record.status) && !live.has(projectId) ? "interrupted" : record?.status ?? "idle";
    return { status, ...record ? { experiment: { id: record.id, snapshotId: record.snapshotId, contentRevision: record.contentRevision, sourceRevision: record.sourceRevision, ...record.source ? { source: record.source } : {}, ...record.runtimeRevision ? { runtimeRevision: record.runtimeRevision } : {}, createdAt: record.createdAt, ...record.error ? { error: record.error } : {}, ...live.has(projectId) && record.url ? { url: record.url } : {} } } : {}, reports, reportScope: "historical-snapshot" };
  }
  async function compare(projectId, before, after) {
    const { root } = rootFor(projectId);
    async function read(ref) {
      if (!ref || !uuid2.test(ref.experimentId) || !uuid2.test(ref.reportId))
        throw Error("需要有效的实验和报告 ID");
      const path = join3(root, "runs", ref.experimentId, "output/reports", ref.reportId + ".json");
      const info = await lstat3(path).catch((error) => {
        if (error.code === "ENOENT")
          throw Error("当前项目中找不到所选报告，请刷新后重新选择");
        throw error;
      });
      if (!info.isFile() || info.size > 2 * 1024 * 1024)
        throw Error("对局报告文件无效或过大");
      if (!isPathDescendant(await realpath4(root), await realpath4(path)))
        throw Error("对局报告路径越界");
      const report = JSON.parse(await readFile4(path, "utf8"));
      if (report.schemaVersion !== 1 || !Array.isArray(report.trials) || report.trials.length > 200 || ![report.contentRevision, report.runtimeRevision].every((value) => /^[a-f0-9]{64}$/.test(value)) || !report.adapterVersion)
        throw Error("对局报告格式无效");
      return report;
    }
    if (before?.experimentId === after?.experimentId && before?.reportId === after?.reportId)
      throw Error("请选择两份不同的报告");
    const [left, right] = await Promise.all([read(before), read(after)]);
    return { before: { ...before }, after: { ...after }, settings: { ...left.settings }, ...await compareBattleExperiments(left, right) };
  }
  function start(projectId, fresh, candidate) {
    if (closed)
      return Promise.reject(Error("自动对局服务正在关闭"));
    if (candidate && (!fresh || !candidate.productionId || !candidate.candidateId || !candidate.candidateHash))
      return Promise.reject(Error("候选实验需要明确身份并准备新快照"));
    const selection = JSON.stringify({ fresh, candidate: candidate ?? null });
    if (pending.has(projectId))
      return pendingSelections.get(projectId) === selection ? pending.get(projectId) : Promise.reject(Error("当前实验仍在准备，请完成后再选择版本"));
    const job = execute();
    pending.set(projectId, job);
    pendingSelections.set(projectId, selection);
    job.finally(() => {
      pending.delete(projectId);
      pendingSelections.delete(projectId);
      invalidate();
    }).catch(() => {
      return;
    });
    return job;
    async function execute() {
      const { project, root } = rootFor(projectId);
      const existingProcess = live.get(projectId);
      if (existingProcess) {
        if (fresh)
          throw Error("请先停止当前实验，再准备新版本");
        const existing = await load(projectId);
        if (existing?.status === "running" && existing.url)
          return existing;
        await existingProcess.done;
      }
      const phaser = project.battlePhaserModule ?? join3(project.root, "node_modules/phaser/dist/phaser.esm.js");
      if (!(await stat2(phaser).catch(() => {
        return;
      }))?.isFile())
        throw Error("游戏 Phaser 依赖尚未准备。请在本机项目配置 battlePhaserModule，或安装游戏依赖后重试");
      let record = fresh ? undefined : await load(projectId);
      if (!record) {
        const selected = candidate ? await options.resolveCandidate?.(projectId, candidate) : undefined;
        if (candidate && !selected)
          throw Error("候选实验来源尚未接通");
        const id = randomUUID3(), runRoot = join3(root, "runs", id);
        await mkdir2(runRoot, { recursive: true, mode: 448 });
        const snapshot = await createBattleSnapshot(selected?.root ?? project.root, join3(runRoot, "snapshots"));
        await selected?.verify();
        record = { id, projectId, snapshotId: snapshot.manifest.id, snapshotDirectory: snapshot.directory, output: join3(runRoot, "output"), contentRevision: snapshot.manifest.contentRevision, sourceRevision: snapshot.manifest.runtimeRevision, source: selected?.source ?? { kind: "registered-project" }, createdAt: new Date().toISOString(), status: "preparing" };
      }
      record.status = "preparing";
      delete record.error;
      delete record.url;
      await save(record);
      let process2;
      try {
        if (closed)
          throw Error("自动对局服务正在关闭");
        await mkdir2(record.output, { recursive: true, mode: 448 });
        process2 = await options.subprocess.spawn({ command: options.bunPath, args: [join3(options.packageRoot, "plugins/cardgame-content/analysis/battle-server.ts"), "--snapshot", record.snapshotDirectory, "--phaser", phaser, "--output", record.output], cwd: join3(root, "runs", record.id) });
        if (closed) {
          await process2.kill();
          throw Error("自动对局服务正在关闭");
        }
        let stdout = "", stderr = "", exited = false;
        let ready, rejectReady;
        const readiness = new Promise((resolve, reject) => {
          ready = resolve;
          rejectReady = reject;
        });
        const releaseOut = subscribe(process2.stdout, (chunk) => {
          stdout = (stdout + Buffer.from(chunk).toString("utf8")).slice(-16384);
          for (const line of stdout.split(`
`))
            try {
              const value = JSON.parse(line);
              if (value.snapshotId === record.snapshotId && /^http:\/\/127\.0\.0\.1:\d+\/$/.test(value.url) && /^[a-f0-9]{64}$/.test(value.runtimeRevision))
                ready(value);
            } catch {}
        });
        const releaseError = subscribe(process2.stderr, (chunk) => {
          stderr = (stderr + Buffer.from(chunk).toString("utf8")).slice(-16384);
        });
        const done = process2.wait().then(async (exit) => {
          exited = true;
          rejectReady(Error(stderr.trim() || `实验进程退出：${exit.code ?? exit.signal}`));
          record.status = stopping.has(projectId) || closed ? "stopped" : "failed";
          delete record.url;
          if (record.status === "failed")
            record.error = stderr.trim() || "实验进程意外退出";
          await save(record);
        }, async (error) => {
          exited = true;
          rejectReady(error instanceof Error ? error : Error(String(error)));
          record.status = "failed";
          record.error = String(error);
          delete record.url;
          await save(record);
        }).finally(() => {
          if (live.get(projectId)?.process === process2)
            live.delete(projectId);
          releaseOut();
          releaseError();
          invalidate();
        });
        done.catch(() => {
          return;
        });
        live.set(projectId, { process: process2, done });
        const timer = setTimeout(() => rejectReady(Error("准备自动对局超时")), options.startupTimeoutMs ?? 45000);
        try {
          const value = await readiness;
          if (closed || exited)
            throw Error("实验进程已关闭");
          record.status = "running";
          record.url = value.url;
          record.runtimeRevision = value.runtimeRevision;
          await save(record);
          return record;
        } finally {
          clearTimeout(timer);
        }
      } catch (error) {
        if (process2) {
          await process2.kill();
          await live.get(projectId)?.done.catch(() => {
            return;
          });
        }
        record.status = "failed";
        record.error = error instanceof Error ? error.message : String(error);
        delete record.url;
        await save(record);
        throw error;
      }
    }
  }
  async function stop(projectId) {
    rootFor(projectId);
    if (pending.has(projectId))
      throw Error("实验仍在准备，请稍后停止");
    const running = live.get(projectId);
    if (!running)
      return;
    stopping.add(projectId);
    try {
      await running.process.kill();
      await running.done;
    } finally {
      stopping.delete(projectId);
    }
  }
  return {
    query,
    compare,
    start,
    stop,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    async close() {
      closed = true;
      await Promise.allSettled([...live.values()].map(async (entry) => {
        await entry.process.kill();
        await entry.done;
      }));
      await Promise.allSettled([...pending.values()]);
      watcher.close();
      listeners.clear();
    }
  };
}
function subscribe(stream, callback) {
  if (stream?.onData)
    return stream.onData(callback);
  stream?.on?.("data", callback);
  return () => {
    stream?.off?.("data", callback);
  };
}

// plugins/cardgame-content/src/formal-preview.ts
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { devNull } from "node:os";
import { mkdir as mkdir3, readFile as readFile5, rename as rename3, writeFile as writeFile3 } from "node:fs/promises";
import { join as join4 } from "node:path";
var run = promisify(execFile);
var git = async (cwd, ...args) => (await run("git", ["-c", `core.hooksPath=${devNull}`, "-c", "commit.gpgsign=false", ...args], {
  cwd,
  timeout: 120000,
  maxBuffer: 1024 * 1024,
  env: { ...process.env, GIT_CONFIG_GLOBAL: devNull, GIT_CONFIG_NOSYSTEM: "1", GIT_TERMINAL_PROMPT: "0" }
})).stdout.trim();
function createFormalPreviewService(options) {
  const projects = new Map(options.projects.map((project) => [project.id, project]));
  const pending = new Map;
  let closed = false;
  function paths(projectId) {
    const project = projects.get(projectId);
    if (!project)
      throw Error("未登记的 CardGame 项目");
    const root = join4(options.dataRoot, "formal-previews", projectId);
    return { project, root, snapshots: join4(root, "snapshots"), latest: join4(root, "latest.json") };
  }
  async function read(projectId) {
    const { latest } = paths(projectId);
    const value = await readFile5(latest, "utf8").catch((error) => {
      if (error.code === "ENOENT")
        return;
      throw error;
    });
    if (!value)
      return;
    const record = JSON.parse(value);
    if (record.projectId !== projectId || !/^[a-f0-9-]{36}$/.test(record.snapshotId) || record.key !== `formal-${record.snapshotId}` || !/^[a-f0-9]{40}$/.test(record.commit))
      throw Error("正式试玩快照记录无效");
    return record;
  }
  async function validate(record) {
    const { snapshots } = paths(record.projectId);
    const directory = join4(snapshots, record.snapshotId), repo = join4(directory, "project");
    const manifest = await verifyBattleSnapshot(directory);
    if (manifest.scope !== "game-preview" || manifest.snapshotRevision !== record.snapshotRevision || manifest.contentRevision !== record.contentRevision || manifest.runtimeRevision !== record.runtimeRevision)
      throw Error("正式试玩快照身份已变化");
    if (await git(repo, "rev-parse", "HEAD") !== record.commit || await git(repo, "status", "--porcelain", "--untracked-files=all"))
      throw Error("正式试玩提交已变化");
    return repo;
  }
  return {
    async query(projectId) {
      const record = await read(projectId);
      if (!record)
        return { record: null, freshness: "missing" };
      try {
        await validate(record);
        const current = await readGamePreviewProjectRevision(paths(projectId).project.root);
        return { record, freshness: current.contentRevision === record.contentRevision && current.runtimeRevision === record.runtimeRevision ? "current" : "stale" };
      } catch (error) {
        return { record, freshness: "unavailable", error: error instanceof Error ? error.message : String(error) };
      }
    },
    prepare(projectId, fresh = false) {
      if (closed)
        return Promise.reject(Error("正式试玩服务已关闭"));
      if (pending.has(projectId))
        return Promise.reject(Error("该项目正在准备正式试玩，请等待完成"));
      const operation = (async () => {
        const { project, root, snapshots, latest } = paths(projectId);
        let record = fresh ? undefined : await read(projectId);
        if (!record) {
          const snapshot = await createGamePreviewSnapshot(project.root, snapshots);
          await git(snapshot.projectRoot, "init", "--quiet");
          await git(snapshot.projectRoot, "add", "-A");
          await git(snapshot.projectRoot, "-c", "user.name=Worka Preview", "-c", "user.email=worka-preview@local.invalid", "commit", "--quiet", "-m", "Snapshot current formal game");
          record = {
            projectId,
            key: `formal-${snapshot.manifest.id}`,
            snapshotId: snapshot.manifest.id,
            createdAt: snapshot.manifest.createdAt,
            commit: await git(snapshot.projectRoot, "rev-parse", "HEAD"),
            contentRevision: snapshot.manifest.contentRevision,
            runtimeRevision: snapshot.manifest.runtimeRevision,
            snapshotRevision: snapshot.manifest.snapshotRevision
          };
          await mkdir3(root, { recursive: true });
          const temporary = join4(root, `${record.snapshotId}.json.pending`);
          await writeFile3(temporary, JSON.stringify(record), { mode: 384 });
          await rename3(temporary, latest);
        }
        const repo = await validate(record);
        await options.register(record, repo);
        return record;
      })();
      pending.set(projectId, operation);
      operation.finally(() => pending.delete(projectId)).catch(() => {});
      return operation;
    },
    async close() {
      closed = true;
      await Promise.allSettled([...pending.values()]);
    }
  };
}

// plugins/cardgame-content/src/story-execution-service.ts
import { createHash as createHash6, randomUUID as randomUUID4 } from "node:crypto";
import { mkdir as mkdir4, readFile as readFile6, writeFile as writeFile4, rename as rename4 } from "node:fs/promises";
import { join as join5 } from "node:path";
var hash = (value) => createHash6("sha256").update(value).digest("hex");
function createStoryExecutionService(options) {
  const active = new Map, processes = new Set, listeners = new Set;
  let closed = false;
  const directory = join5(options.dataRoot, "story-execution");
  const identity = (projectId, id) => {
    const project = options.projects.find((project) => project.id === projectId);
    if (!project || typeof id !== "string" || !id.trim() || id.length > 256)
      throw Error("未登记的剧情项目或剧情 ID");
    return { project, key: hash(JSON.stringify([projectId, id])) };
  };
  const read = async (key) => {
    try {
      return JSON.parse(await readFile6(join5(directory, `${key}.json`), "utf8"));
    } catch (error) {
      if (error.code === "ENOENT")
        return;
      throw error;
    }
  };
  const save = async (key, state) => {
    await mkdir4(directory, { recursive: true });
    const temporary = join5(directory, `${key}.${randomUUID4()}.tmp`);
    await writeFile4(temporary, JSON.stringify(state), { mode: 384 });
    await rename4(temporary, join5(directory, `${key}.json`));
    for (const invalidate of listeners) {
      try {
        invalidate();
      } catch {}
    }
  };
  async function query(projectId, id) {
    const { key } = identity(projectId, id);
    const current = await options.content.query({ projectId, op: "storyAnalysis", id });
    const saved = await read(key);
    return {
      ...saved,
      status: saved?.status === "running" && !active.has(key) ? "interrupted" : saved?.status ?? "idle",
      currentStoryRevision: current.revision,
      contentMatches: saved?.report ? saved.report.storyRevision === current.revision && saved.report.catalogRevision === current.catalogRevision : false,
      runtimeFreshness: "snapshot-only"
    };
  }
  function run(projectId, id, expectedRevision, access) {
    if (closed)
      return Promise.reject(Error("剧情分析服务正在关闭"));
    const { project, key } = identity(projectId, id);
    if (active.has(key))
      return Promise.reject(Error("这份剧情正在检查，请等待当前报告"));
    const job = execute();
    active.set(key, job);
    job.finally(() => {
      active.delete(key);
    }).catch(() => {
      return;
    });
    return job;
    async function execute() {
      const current = await options.content.query({ projectId, op: "storyAnalysis", id });
      if (!expectedRevision || expectedRevision !== current.revision)
        throw Error("剧情已变化，请刷新后重新检查");
      const previous = await read(key);
      const state = { status: "running", startedAt: new Date().toISOString(), ...previous?.report ? { report: previous.report } : {} };
      await save(key, state);
      let process2, timer, release, releaseOutput;
      let stderr = "", timedOut = false, oversized = false;
      const stdout = [];
      let outputBytes = 0;
      try {
        if (closed)
          throw Error("剧情分析服务正在关闭");
        process2 = await options.subprocess.spawn({
          command: options.bunPath,
          args: [join5(options.packageRoot, "plugins/cardgame-content/analysis/story-runner.ts"), "--project", project.root, "--story", id, "--output", "-"],
          cwd: project.root
        }, { access });
        processes.add(process2);
        if (closed) {
          await process2.kill("SIGTERM");
          await process2.wait();
          throw Error("剧情分析服务已关闭");
        }
        const append = (chunk) => {
          stderr = (stderr + (typeof chunk === "string" ? chunk : Buffer.from(chunk).toString("utf8"))).slice(-16384);
        };
        release = subscribe2(process2.stderr, append);
        releaseOutput = subscribe2(process2.stdout, (chunk) => {
          const bytes = Buffer.from(chunk);
          outputBytes += bytes.length;
          if (outputBytes > 8 * 1024 * 1024) {
            oversized = true;
            Promise.resolve(process2?.kill("SIGKILL")).catch(() => {
              return;
            });
          } else if (!oversized)
            stdout.push(bytes);
        });
        timer = setTimeout(() => {
          timedOut = true;
          Promise.resolve(process2?.kill("SIGKILL")).catch(() => {
            return;
          });
        }, options.timeoutMs ?? 45000);
        const exit = await process2.wait();
        if (closed)
          throw Error("剧情分析服务已关闭");
        if (timedOut)
          throw Error("剧情检查超时，保留上次报告；请减少剧情规模或核对运行规则");
        if (oversized)
          throw Error("剧情报告超过 8 MiB");
        if (exit.code !== 0)
          throw Error(stderr.trim() || `剧情检查进程退出：${exit.code ?? exit.signal}`);
        const report = JSON.parse(Buffer.concat(stdout).toString("utf8"));
        if (report.schemaVersion !== 1 || report.storyId !== id || report.storyRevision !== expectedRevision || !Array.isArray(report.witnesses) || !/^[a-f0-9]{64}$/.test(report.runtimeRevision))
          throw Error("剧情报告身份或版本不一致");
        const latest = await options.content.query({ projectId, op: "storyAnalysis", id, expectedRevision });
        if (latest.catalogRevision !== report.catalogRevision)
          throw Error("剧情目录已变化，请重新检查");
        state.status = "succeeded";
        state.report = report;
        state.finishedAt = new Date().toISOString();
        await save(key, state);
        return state;
      } catch (error) {
        state.status = closed ? "interrupted" : "failed";
        state.error = error instanceof Error ? error.message : String(error);
        state.finishedAt = new Date().toISOString();
        await save(key, state);
        throw error;
      } finally {
        if (timer)
          clearTimeout(timer);
        release?.();
        releaseOutput?.();
        if (process2)
          processes.delete(process2);
      }
    }
  }
  return {
    query,
    run,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    async close() {
      closed = true;
      await Promise.allSettled([...processes].map((process2) => process2.kill("SIGTERM")));
      await Promise.allSettled([...active.values()]);
      listeners.clear();
    }
  };
}
function subscribe2(stream, listener) {
  if (stream?.onData)
    return stream.onData(listener);
  stream?.on?.("data", listener);
  return () => {
    if (stream?.off)
      stream.off("data", listener);
    else
      stream?.removeListener?.("data", listener);
  };
}

// plugins/cardgame-content/src/native-guard.ts
var fileTools = new Set(["bash", "shell", "terminal", "exec", "exec_command", "edit", "write", "multi_edit", "apply_patch", "notebook_edit", "python"]);
var contentModes = new Set(["cards", "knowledge", "assets"]);
var contentKinds = new Set(["production", "todo", "execution", "preview"]);
async function cardgameNativeWriteDenial(core, sessionId, tool, nativeParentId) {
  if (!sessionId || !fileTools.has(tool.toLowerCase()))
    return;
  let current = sessionId;
  const seen = new Set;
  for (let depth = 0;current && depth < 8 && !seen.has(current); depth++) {
    seen.add(current);
    const session = await core.getSession(current);
    const noteId = session?.value.noteId;
    if (noteId) {
      const note = await core.getNote(noteId);
      const config = await core.readRecord("states", `${noteId}:config`);
      const value = config?.value;
      const mode = value?.mode;
      const kind = value?.catalogRef?.kind;
      const isCardgameContent = typeof value?.projectId === "string" && value.projectId.trim() && (contentModes.has(String(mode)) || contentKinds.has(String(kind)));
      if (isCardgameContent || note?.value.actions?.includes("confirmGameCandidate")) {
        return "CardGame 内容会话不能用文件编辑或命令工具改项目源码。当前工作目录可能是已登记的正式项目；请先建立独立候选：卡牌制作沿用卡牌库或制作便笺的候选动作，知识库资料与剧情从知识库会话调用已登记的 cardgame-content 候选方法，再在原试玩便笺验证。直接工程开发请另开工程会话。";
      }
    }
    current = session?.value.parentSessionId ?? (depth === 0 ? nativeParentId : undefined);
  }
  return;
}

// plugins/cardgame-content/src/registration.ts
import { join as join11, resolve as resolve6 } from "node:path";

// plugins/cardgame-content/src/content.ts
import { watch as watch2 } from "node:fs";
import {
  mkdir as mkdir6,
  link,
  readdir as readdir3,
  readFile as readFile8,
  realpath as realpath6,
  rename as rename6,
  rm as rm2,
  stat as stat4,
  lstat as lstat4,
  writeFile as writeFile5,
  open as open3
} from "node:fs/promises";
import {
  basename,
  dirname as dirname3,
  extname as extname2,
  isAbsolute as isAbsolute4,
  posix,
  relative as relative4,
  resolve as resolve3,
  sep as sep5
} from "node:path";
import { createHash as createHash8, randomUUID as randomUUID6 } from "node:crypto";

// plugins/cardgame-content/src/story-analysis.ts
function analyzeStory(value) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("剧情必须是 JSON 对象");
  const story = value;
  if (!Array.isArray(story.nodes) || !Array.isArray(story.choices))
    throw new Error("剧情缺少 nodes 或 choices");
  const findings = [];
  const seen = new Set;
  const nodes = story.nodes.map((node, index) => {
    if (!node || typeof node.id !== "string" || !node.id)
      throw new Error(`节点 ${index + 1} 缺少 ID`);
    if (seen.has(node.id))
      findings.push({ kind: "duplicate", id: node.id, detail: "节点 ID 重复" });
    seen.add(node.id);
    return { id: node.id, title: String(node.title || node.id), type: String(node.type || "story"), summary: String(node.summary || ""), chapter: String(node.chapter || "") };
  });
  const choiceIds = new Set;
  const edges = story.choices.map((choice, index) => {
    if (!choice || typeof choice.id !== "string" || typeof choice.from !== "string" || typeof choice.to !== "string")
      throw new Error(`选项 ${index + 1} 缺少 ID、起点或终点`);
    if (choiceIds.has(choice.id))
      findings.push({ kind: "duplicate", id: choice.id, detail: "选项 ID 重复" });
    choiceIds.add(choice.id);
    if (!seen.has(choice.from) || !seen.has(choice.to))
      findings.push({ kind: "broken", id: choice.id, detail: `分支目标缺失：${choice.from} → ${choice.to}` });
    return {
      id: choice.id,
      from: choice.from,
      to: choice.to,
      text: String(choice.text || choice.id),
      conditional: Boolean(choice.enabledWhen || choice.visibleWhen),
      ...choice.enabledWhen ? { enabledWhen: choice.enabledWhen } : {},
      ...choice.visibleWhen ? { visibleWhen: choice.visibleWhen } : {},
      ...Array.isArray(choice.effects) && choice.effects.length ? { effects: choice.effects } : {}
    };
  });
  const entry = typeof story.entryNodeId === "string" ? story.entryNodeId : "";
  if (!seen.has(entry))
    findings.push({ kind: "entry", id: entry, detail: "入口节点不存在" });
  const outgoing = new Map;
  for (const edge of edges) {
    const list = outgoing.get(edge.from);
    if (list)
      list.push(edge);
    else
      outgoing.set(edge.from, [edge]);
  }
  const reachable = new Set;
  const queue = seen.has(entry) ? [entry] : [];
  for (let index = 0;index < queue.length; index++) {
    const id = queue[index];
    if (reachable.has(id))
      continue;
    reachable.add(id);
    for (const edge of outgoing.get(id) || [])
      if (seen.has(edge.to) && !reachable.has(edge.to))
        queue.push(edge.to);
  }
  for (const node of nodes) {
    if (!reachable.has(node.id))
      findings.push({ kind: "unreachable", id: node.id, detail: "从入口没有结构路径" });
  }
  return {
    title: String(story.title || story.storyId || "剧情"),
    entry,
    nodes,
    edges,
    findings,
    terminalIds: nodes.filter((node) => !outgoing.get(node.id)?.length).map((node) => node.id),
    reachableCount: reachable.size,
    conditionalCount: edges.filter((edge) => edge.conditional).length,
    reachability: "structural"
  };
}

// plugins/cardgame-content/src/card-collections.ts
var CARD_COLLECTIONS = {
  unit: { path: "public/data/cards/units.json", key: "units", inDeck: true },
  artifact: { path: "public/data/cards/artifacts.json", key: "artifacts", inDeck: true },
  talisman: { path: "public/data/cards/talismans.json", key: "talismans", inDeck: true },
  field: { path: "public/data/cards/fields.json", key: "fields", inDeck: true },
  skill: { path: "public/data/cards/skills.json", key: "skills", inDeck: false },
  pill: { path: "public/data/cards/pills.json", key: "pills", inDeck: false }
};
function cardCollection(kind) {
  if (typeof kind !== "string" || !Object.hasOwn(CARD_COLLECTIONS, kind))
    throw Error(`不支持的卡牌类别：${String(kind)}`);
  return CARD_COLLECTIONS[kind];
}

// plugins/cardgame-content/src/story-rules.ts
function record3(value, label) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} 必须是对象。`);
  }
  return value;
}
function string3(value, label) {
  if (typeof value !== "string" || !value.trim())
    throw new Error(`${label} 必须是非空文本。`);
  return value;
}
function number3(value, label) {
  if (typeof value !== "number" || !Number.isFinite(value))
    throw new Error(`${label} 必须是有限数值。`);
  return value;
}
function optionalBoolean(value, label) {
  if (value === undefined)
    return;
  if (typeof value !== "boolean")
    throw new Error(`${label} 必须是布尔值。`);
  return value;
}
function requiredArray(value, label) {
  if (!Array.isArray(value))
    throw new Error(`${label} 必须是数组。`);
  return value;
}
function parseStoryRuleJson(source, label) {
  try {
    return JSON.parse(source);
  } catch {
    throw new Error(`${label} 不是有效 JSON。`);
  }
}
function validateStoryCondition(value, label) {
  const input = record3(value, label);
  const kind = string3(input.kind, `${label}.kind`);
  switch (kind) {
    case "always":
      return { kind };
    case "attribute":
    case "relation": {
      const operator = string3(input.operator, `${label}.operator`);
      if (![">", ">=", "<", "<=", "==", "!="].includes(operator))
        throw new Error(`${label}.operator 不受支持。`);
      return { kind, [kind === "attribute" ? "attribute" : "relationId"]: string3(input[kind === "attribute" ? "attribute" : "relationId"], `${label}.${kind === "attribute" ? "attribute" : "relationId"}`), operator, value: number3(input.value, `${label}.value`) };
    }
    case "actorAbility": {
      const operator = string3(input.operator, `${label}.operator`);
      if (![">", ">=", "<", "<=", "==", "!="].includes(operator))
        throw new Error(`${label}.operator 不受支持。`);
      return { kind, actorId: string3(input.actorId, `${label}.actorId`), ability: string3(input.ability, `${label}.ability`), operator, value: number3(input.value, `${label}.value`) };
    }
    case "itemCount": {
      const operator = string3(input.operator, `${label}.operator`);
      const value = number3(input.value, `${label}.value`);
      if (![">", ">=", "<", "<=", "==", "!="].includes(operator))
        throw new Error(`${label}.operator 不受支持。`);
      if (!Number.isSafeInteger(value) || value < 0)
        throw new Error(`${label}.value 必须是非负整数。`);
      return { kind, itemId: string3(input.itemId, `${label}.itemId`), operator, value };
    }
    case "knowledge":
      return { kind, actorId: string3(input.actorId, `${label}.actorId`), knowledgeId: string3(input.knowledgeId, `${label}.knowledgeId`), ...optionalBoolean(input.expected, `${label}.expected`) === undefined ? {} : { expected: input.expected } };
    case "questStage":
      return { kind, questId: string3(input.questId, `${label}.questId`), stage: string3(input.stage, `${label}.stage`) };
    case "flag":
      return { kind, flag: string3(input.flag, `${label}.flag`), ...optionalBoolean(input.expected, `${label}.expected`) === undefined ? {} : { expected: input.expected } };
    case "visitedNode":
      return { kind, nodeId: string3(input.nodeId, `${label}.nodeId`), ...optionalBoolean(input.expected, `${label}.expected`) === undefined ? {} : { expected: input.expected } };
    case "triggeredDialogue":
      return { kind, dialogueId: string3(input.dialogueId, `${label}.dialogueId`), ...optionalBoolean(input.expected, `${label}.expected`) === undefined ? {} : { expected: input.expected } };
    case "all":
    case "any": {
      const conditions = requiredArray(input.conditions, `${label}.conditions`);
      if (!conditions.length)
        throw new Error(`${label}.conditions 不能为空。`);
      return { kind, conditions: conditions.map((condition, index) => validateStoryCondition(condition, `${label}.conditions[${index}]`)) };
    }
    case "not":
      return { kind, condition: validateStoryCondition(input.condition, `${label}.condition`) };
    default:
      throw new Error(`${label}.kind 不受支持：${kind}。`);
  }
}
function validateBattle(value, label) {
  const input = record3(value, label);
  const output = {
    battleId: string3(input.battleId, `${label}.battleId`),
    encounterId: string3(input.encounterId, `${label}.encounterId`),
    encounterFile: string3(input.encounterFile, `${label}.encounterFile`),
    deckFile: string3(input.deckFile, `${label}.deckFile`),
    onVictoryNodeId: string3(input.onVictoryNodeId, `${label}.onVictoryNodeId`),
    onDefeatNodeId: string3(input.onDefeatNodeId, `${label}.onDefeatNodeId`)
  };
  for (const field of ["encounterResourceId", "deckResourceId", "launchText"]) {
    if (input[field] !== undefined)
      output[field] = string3(input[field], `${label}.${field}`);
  }
  if (input.deterministicBattleSetup !== undefined) {
    const setup = record3(input.deterministicBattleSetup, `${label}.deterministicBattleSetup`);
    if (setup.deckOrder !== "preserve-json-order")
      throw new Error(`${label}.deterministicBattleSetup.deckOrder 不受支持。`);
    output.deterministicBattleSetup = { deckOrder: setup.deckOrder };
  }
  return output;
}
function validateStoryEffects(value, label) {
  return requiredArray(value, label).map((entry, index) => {
    const at = `${label}[${index}]`;
    const input = record3(entry, at);
    const kind = string3(input.kind, `${at}.kind`);
    switch (kind) {
      case "setFlag":
        return { kind, flag: string3(input.flag, `${at}.flag`), ...optionalBoolean(input.value, `${at}.value`) === undefined ? {} : { value: input.value } };
      case "clearFlag":
        return { kind, flag: string3(input.flag, `${at}.flag`) };
      case "recordVisitedNode":
      case "goToNode":
        return { kind, nodeId: string3(input.nodeId, `${at}.nodeId`) };
      case "recordDialogue":
        return { kind, dialogueId: string3(input.dialogueId, `${at}.dialogueId`) };
      case "setAttribute":
        return { kind, attribute: string3(input.attribute, `${at}.attribute`), value: number3(input.value, `${at}.value`) };
      case "adjustAttribute":
        return { kind, attribute: string3(input.attribute, `${at}.attribute`), delta: number3(input.delta, `${at}.delta`) };
      case "setRelation":
        return { kind, relationId: string3(input.relationId, `${at}.relationId`), value: number3(input.value, `${at}.value`) };
      case "adjustRelation":
        return { kind, relationId: string3(input.relationId, `${at}.relationId`), delta: number3(input.delta, `${at}.delta`) };
      case "moveTo":
        return { kind, locationId: string3(input.locationId, `${at}.locationId`), sublocationId: string3(input.sublocationId, `${at}.sublocationId`), ...input.nodeId === undefined ? {} : { nodeId: string3(input.nodeId, `${at}.nodeId`) } };
      case "setLocationLabel":
        return { kind, location: string3(input.location, `${at}.location`) };
      case "learnKnowledge":
        return { kind, actorId: string3(input.actorId, `${at}.actorId`), knowledgeId: string3(input.knowledgeId, `${at}.knowledgeId`) };
      case "setQuestStage":
        return { kind, questId: string3(input.questId, `${at}.questId`), stage: string3(input.stage, `${at}.stage`) };
      case "grantCard": {
        const count = number3(input.count, `${at}.count`);
        if (!Number.isSafeInteger(count) || count < 1)
          throw new Error(`${at}.count 必须是正整数。`);
        return { kind, grantId: string3(input.grantId, `${at}.grantId`), cardId: string3(input.cardId, `${at}.cardId`), count };
      }
      case "grantItem":
      case "consumeItem": {
        const count = number3(input.count, `${at}.count`);
        const itemType = string3(input.itemType, `${at}.itemType`);
        if (!Number.isSafeInteger(count) || count < 1)
          throw new Error(`${at}.count 必须是正整数。`);
        if (!["artifact", "tool", "consumable", "material", "quest"].includes(itemType))
          throw new Error(`${at}.itemType 不受支持。`);
        return { kind, transactionId: string3(input.transactionId, `${at}.transactionId`), itemId: string3(input.itemId, `${at}.itemId`), itemType, count };
      }
      case "once":
        return { kind, eventId: string3(input.eventId, `${at}.eventId`), effects: validateStoryEffects(input.effects, `${at}.effects`) };
      case "startBattle":
        return { kind, battle: validateBattle(input.battle, `${at}.battle`) };
      default:
        throw new Error(`${at}.kind 不受支持：${kind}。`);
    }
  });
}
function validateStoryChoiceMetadata(value, label) {
  const input = record3(value, label);
  const output = { id: string3(input.id, `${label}.id`) };
  if (input.description !== undefined)
    output.description = string3(input.description, `${label}.description`);
  if (input.visibleWhen !== undefined)
    output.visibleWhen = validateStoryCondition(input.visibleWhen, `${label}.visibleWhen`);
  if (input.enabledWhen !== undefined)
    output.enabledWhen = validateStoryCondition(input.enabledWhen, `${label}.enabledWhen`);
  if (input.effects !== undefined)
    output.effects = validateStoryEffects(input.effects, `${label}.effects`);
  if (input.flags !== undefined)
    output.flags = requiredArray(input.flags, `${label}.flags`).map((flag, index) => string3(flag, `${label}.flags[${index}]`));
  return output;
}
function validateInitialStoryState(value, label) {
  const input = record3(value, label);
  const output = {};
  for (const field of ["attributes", "relations"]) {
    if (input[field] === undefined)
      continue;
    const values = record3(input[field], `${label}.${field}`);
    output[field] = Object.fromEntries(Object.entries(values).map(([key, entry]) => [key, number3(entry, `${label}.${field}.${key}`)]));
  }
  if (input.flags !== undefined) {
    const values = record3(input.flags, `${label}.flags`);
    output.flags = Object.fromEntries(Object.entries(values).map(([key, entry]) => {
      if (typeof entry !== "boolean")
        throw new Error(`${label}.flags.${key} 必须是布尔值。`);
      return [key, entry];
    }));
  }
  if (input.knowledge !== undefined) {
    const knowledge = record3(input.knowledge, `${label}.knowledge`);
    output.knowledge = Object.fromEntries(Object.entries(knowledge).map(([actorId, ids]) => [actorId, requiredArray(ids, `${label}.knowledge.${actorId}`).map((id, index) => string3(id, `${label}.knowledge.${actorId}[${index}]`))]));
  }
  if (input.questStages !== undefined) {
    const stages = record3(input.questStages, `${label}.questStages`);
    output.questStages = Object.fromEntries(Object.entries(stages).map(([questId, stage]) => [questId, string3(stage, `${label}.questStages.${questId}`)]));
  }
  if (input.settledEventIds !== undefined)
    output.settledEventIds = requiredArray(input.settledEventIds, `${label}.settledEventIds`).map((id, index) => string3(id, `${label}.settledEventIds[${index}]`));
  return output;
}

// plugins/cardgame-content/src/media.ts
import { mkdir as mkdir5, open as open2, readFile as readFile7, realpath as realpath5, rename as rename5, stat as stat3 } from "node:fs/promises";
import { createHash as createHash7, randomUUID as randomUUID5 } from "node:crypto";
import { tmpdir } from "node:os";
import sharp from "sharp";
import { parseFile } from "music-metadata";
import { dirname as dirname2, extname, isAbsolute as isAbsolute3, relative as relative3, resolve as resolve2, sep as sep4 } from "node:path";
var MIME_BY_EXTENSION = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".bmp": "image/bmp",
  ".ico": "image/x-icon",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  ".oga": "audio/ogg",
  ".m4a": "audio/mp4",
  ".aac": "audio/aac",
  ".flac": "audio/flac",
  ".json": "application/json"
};
function mediaTypeFromPath(filePath) {
  return MIME_BY_EXTENSION[extname(filePath).toLowerCase()] ?? "application/octet-stream";
}
function sniffMediaMime(bytes) {
  const ascii = (start, length) => String.fromCharCode(...bytes.subarray(start, start + length));
  if (bytes.length >= 4 && bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71)
    return "image/png";
  if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255)
    return "image/jpeg";
  if (bytes.length >= 6 && (ascii(0, 6) === "GIF87a" || ascii(0, 6) === "GIF89a"))
    return "image/gif";
  if (bytes.length >= 12 && ascii(0, 4) === "RIFF" && ascii(8, 4) === "WEBP")
    return "image/webp";
  if (bytes.length >= 2 && ascii(0, 2) === "BM")
    return "image/bmp";
  if (bytes.length >= 4 && bytes[0] === 0 && bytes[1] === 0 && bytes[2] === 1 && bytes[3] === 0)
    return "image/x-icon";
  if (bytes.length >= 12 && ascii(0, 4) === "RIFF" && ascii(8, 4) === "WAVE")
    return "audio/wav";
  if (bytes.length >= 4 && ascii(0, 4) === "OggS")
    return "audio/ogg";
  if (bytes.length >= 4 && ascii(0, 4) === "fLaC")
    return "audio/flac";
  if (bytes.length >= 3 && (ascii(0, 3) === "ID3" || bytes[0] === 255 && (bytes[1] & 224) === 224))
    return "audio/mpeg";
  if (bytes.length >= 12 && ascii(4, 4) === "ftyp") {
    const brand = ascii(8, 4);
    if (brand === "avif" || brand === "avis")
      return "image/avif";
    if (brand.startsWith("M4A") || brand.startsWith("M4B"))
      return "audio/mp4";
  }
  return;
}
function mediaKindFromMime(mimeType, filePath = "", frameCount) {
  if (mimeType.startsWith("image/"))
    return frameCount && frameCount > 1 ? "spritesheet" : "image";
  if (mimeType.startsWith("audio/"))
    return "audio";
  if (filePath.toLowerCase().endsWith(".json") && frameCount && frameCount > 0)
    return "spritesheet";
  return "other";
}
function readUint24LittleEndian(bytes, offset) {
  return bytes[offset] + (bytes[offset + 1] << 8) + (bytes[offset + 2] << 16);
}
function parsePng(bytes) {
  if (bytes.length >= 24 && bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    return { width: view.getUint32(16), height: view.getUint32(20) };
  }
  return;
}
function parseGif(bytes) {
  if (bytes.length >= 10 && bytes[0] === 71 && bytes[1] === 73 && bytes[2] === 70 && bytes[3] === 56) {
    return {
      width: bytes[6] | bytes[7] << 8,
      height: bytes[8] | bytes[9] << 8
    };
  }
  return;
}
function parseWebp(bytes) {
  if (bytes.length < 30 || String.fromCharCode(...bytes.slice(0, 4)) !== "RIFF" || String.fromCharCode(...bytes.slice(8, 12)) !== "WEBP") {
    return;
  }
  const chunk = String.fromCharCode(...bytes.slice(12, 16));
  if (chunk === "VP8X" && bytes.length >= 30) {
    return {
      width: 1 + readUint24LittleEndian(bytes, 24),
      height: 1 + readUint24LittleEndian(bytes, 27)
    };
  }
  if (chunk === "VP8 " && bytes.length >= 30) {
    for (let i = 20;i + 9 < bytes.length; i += 1) {
      if (bytes[i] === 157 && bytes[i + 1] === 1 && bytes[i + 2] === 42) {
        return {
          width: (bytes[i + 3] | bytes[i + 4] << 8) & 16383,
          height: (bytes[i + 5] | bytes[i + 6] << 8) & 16383
        };
      }
    }
  }
  return;
}
function parseJpeg(bytes) {
  if (bytes.length < 4 || bytes[0] !== 255 || bytes[1] !== 216)
    return;
  let offset = 2;
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 255) {
      offset += 1;
      continue;
    }
    const marker = bytes[offset + 1];
    offset += 2;
    if (marker === 216 || marker === 217)
      continue;
    if (offset + 2 > bytes.length)
      break;
    const length = bytes[offset] << 8 | bytes[offset + 1];
    if (length < 2 || offset + length > bytes.length)
      break;
    const isFrame = marker >= 192 && marker <= 207 && ![196, 200, 204].includes(marker);
    if (isFrame && offset + 7 < bytes.length) {
      return {
        height: bytes[offset + 3] << 8 | bytes[offset + 4],
        width: bytes[offset + 5] << 8 | bytes[offset + 6]
      };
    }
    offset += length;
  }
  return;
}
function parseWav(bytes) {
  if (bytes.length < 44 || String.fromCharCode(...bytes.slice(0, 4)) !== "RIFF" || String.fromCharCode(...bytes.slice(8, 12)) !== "WAVE") {
    return;
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 12;
  let byteRate;
  let dataSize;
  while (offset + 8 <= bytes.length) {
    const id = String.fromCharCode(...bytes.slice(offset, offset + 4));
    const size = view.getUint32(offset + 4, true);
    offset += 8;
    if (id === "fmt " && size >= 12 && offset + size <= bytes.length) {
      byteRate = view.getUint32(offset + 8, true);
    } else if (id === "data") {
      dataSize = Math.min(size, bytes.length - offset);
      break;
    }
    offset += size + size % 2;
  }
  return byteRate && dataSize !== undefined ? { durationMs: Math.round(dataSize / byteRate * 1000) } : undefined;
}
function parseOgg(bytes) {
  if (bytes.length >= 4 && String.fromCharCode(...bytes.slice(0, 4)) === "OggS")
    return;
  return;
}
function inspectMediaBytes(bytes, filePath, indexed) {
  const mimeType = indexed?.mimeType ?? mediaTypeFromPath(filePath);
  const dimensions = parsePng(bytes) ?? parseGif(bytes) ?? parseWebp(bytes) ?? parseJpeg(bytes);
  const audio = parseWav(bytes) ?? parseOgg(bytes);
  const frameCount = indexed?.frameCount;
  return {
    mimeType,
    kind: indexed?.kind ?? mediaKindFromMime(mimeType, filePath, frameCount),
    size: bytes.byteLength,
    ...dimensions ?? {},
    ...audio ?? {},
    ...frameCount === undefined ? {} : { frameCount },
    ...indexed?.metadata ? { metadata: indexed.metadata } : {}
  };
}
async function inspectMediaFile(filePath, indexed) {
  const info = await stat3(filePath);
  const mimeType = indexed?.mimeType ?? mediaTypeFromPath(filePath);
  const result = { ...indexed, mimeType, kind: indexed?.kind ?? mediaKindFromMime(mimeType, filePath, indexed?.frameCount), size: info.size };
  if (mimeType.startsWith("image/")) {
    try {
      const metadata = await sharp(filePath, { limitInputPixels: 64 * 1024 * 1024 }).metadata();
      result.width = metadata.width;
      result.height = metadata.pageHeight ?? metadata.height;
      result.frameCount = indexed?.frameCount ?? metadata.pages;
    } catch {
      const file = await open2(filePath, "r");
      try {
        const buffer = Buffer.alloc(Math.min(info.size, 64 * 1024));
        const { bytesRead } = await file.read(buffer, 0, buffer.length, 0);
        const header = inspectMediaBytes(buffer.subarray(0, bytesRead), filePath, indexed);
        result.width = header.width;
        result.height = header.height;
      } finally {
        await file.close();
      }
    }
  } else if (mimeType.startsWith("audio/")) {
    try {
      const metadata = await parseFile(filePath, { duration: true, skipCovers: true });
      if (metadata.format.duration !== undefined)
        result.durationMs = Math.round(metadata.format.duration * 1000);
    } catch {}
  }
  return result;
}
sharp.cache({ memory: 32, files: 16, items: 64 });
sharp.concurrency(2);
var thumbnails = new Map;
async function thumbnail(source, options, mtime, size) {
  const cacheRoot = options.cacheRoot ?? resolve2(tmpdir(), "worka-cardgame-media");
  const key = createHash7("sha256").update(`${source}\x00${options.revision}\x00${mtime}\x00${size}\x00thumbnail-v1`).digest("hex");
  const destination = resolve2(cacheRoot, `${key}.png`);
  try {
    await stat3(destination);
    return destination;
  } catch (error) {
    if (error.code !== "ENOENT")
      throw error;
  }
  const pending = thumbnails.get(destination);
  if (pending)
    return pending;
  const work = (async () => {
    await mkdir5(cacheRoot, { recursive: true });
    const temporary = `${destination}.${randomUUID5()}.tmp`;
    await sharp(source, { animated: false, limitInputPixels: 64 * 1024 * 1024 }).resize(256, 256, { fit: "inside", withoutEnlargement: true, kernel: "nearest" }).png().toFile(temporary);
    await rename5(temporary, destination);
    return destination;
  })();
  thumbnails.set(destination, work);
  try {
    return await work;
  } finally {
    thumbnails.delete(destination);
  }
}
async function resolveMediaFile(options) {
  const root = await realpath5(options.root);
  const absolutePath = resolve2(options.absolutePath);
  const lexicalRelative = relative3(root, absolutePath);
  if (isAbsolute3(lexicalRelative) || lexicalRelative === ".." || lexicalRelative.startsWith(`..${sep4}`)) {
    throw new Error("media path escapes project root");
  }
  const resolved = await realpath5(absolutePath);
  const actualRelative = relative3(root, resolved);
  if (isAbsolute3(actualRelative) || actualRelative === ".." || actualRelative.startsWith(`..${sep4}`)) {
    throw new Error("media symlink escapes project root");
  }
  const fileStat = await stat3(resolved);
  if (!fileStat.isFile())
    throw new Error("media path is not a regular file");
  const indexed = options.indexed;
  const completeInspection = indexed?.size !== undefined && indexed.mimeType && (!indexed.mimeType.startsWith("image/") || indexed.width !== undefined && indexed.height !== undefined) && (!indexed.mimeType.startsWith("audio/") || indexed.durationMs !== undefined);
  const inspection = completeInspection ? { ...indexed, size: fileStat.size, mimeType: indexed.mimeType } : await inspectMediaFile(resolved, options.indexed);
  const variant = options.variant ?? "original";
  if (variant === "waveform")
    throw new Error("Waveforms are decoded on demand in the selected audio preview");
  const servedPath = variant === "thumbnail" && inspection.mimeType.startsWith("image/") ? await thumbnail(resolved, options, fileStat.mtimeMs, fileStat.size) : resolved;
  const servedStat = servedPath === resolved ? fileStat : await stat3(servedPath);
  const response = {
    id: options.id,
    path: actualRelative.split(sep4).join("/"),
    ...options.versionId ? { versionId: options.versionId } : {},
    variant,
    mimeType: servedPath === resolved ? inspection.mimeType : "image/png",
    size: servedStat.size,
    revision: options.revision,
    ...inspection.width === undefined ? {} : { width: inspection.width },
    ...inspection.height === undefined ? {} : { height: inspection.height },
    ...inspection.durationMs === undefined ? {} : { durationMs: inspection.durationMs },
    ...inspection.frameCount === undefined ? {} : { frameCount: inspection.frameCount },
    ...inspection.metadata ? { metadata: inspection.metadata } : {},
    absolutePath: servedPath
  };
  if (variant === "original" && options.inlineLimit !== undefined && inspection.size <= options.inlineLimit) {
    const bytes = await readFile7(resolved);
    response.data = `data:${inspection.mimeType};base64,${Buffer.from(bytes).toString("base64")}`;
  }
  return response;
}
function candidateSpriteMetadataPath(filePath) {
  const ext = extname(filePath);
  const base = ext ? filePath.slice(0, -ext.length) : filePath;
  return [`${filePath}.json`, `${base}.json`];
}

// plugins/cardgame-content/src/types.ts
class ContentServiceError extends Error {
  code;
  details;
  constructor(code, message, details) {
    super(message);
    this.name = "ContentServiceError";
    this.code = code;
    this.details = details;
  }
}

// plugins/cardgame-content/src/content.ts
var PAGE_OPERATIONS = new Set(["documents", "directories", "backlinks", "cards", "assets", "versions", "recentChanges", "storyBuilds", "gameCatalog"]);
function pageQueryIdentity(input) {
  const { cursor: _cursor, projectGeneration: _generation, allowLegacyReconciliation: _legacy, ...query } = input;
  return hashBytes(JSON.stringify({ ...query, limit: clampLimit("limit" in input ? input.limit : undefined) }, (_key, value) => value && typeof value === "object" && !Array.isArray(value) ? Object.fromEntries(Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)) : value));
}
function decodePageCursor(cursor) {
  if (cursor === undefined)
    return;
  if (typeof cursor !== "string" || !cursor || cursor.length > 16384 || !/^[A-Za-z0-9_-]+$/.test(cursor))
    throw new ContentServiceError("INVALID_INPUT", "page cursor is malformed.");
  try {
    const value = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8"));
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw Error();
    const item = value;
    if (Object.keys(item).sort().join(",") !== "after,query,revision,version" || item.version !== 1 || typeof item.query !== "string" || !/^[a-f0-9]{64}$/.test(item.query) || typeof item.revision !== "string" || !item.revision || item.revision.length > 256 || typeof item.after !== "string" || !item.after || item.after.length > 8192)
      throw Error();
    return item;
  } catch {
    throw new ContentServiceError("INVALID_INPUT", "page cursor is malformed.");
  }
}
var MAX_PAGE_SIZE = 100;
var DEFAULT_INLINE_MEDIA_LIMIT = 0;
var MANIFEST_FILE_NAME = "asset-manifest.json";
var CARD_DIRECTORY = "public/data/cards";
var ASSET_DIRECTORY = "public/assets";
var STORY_DIRECTORY = "public/data/story";
var CONTENT_CATALOG_PATH = "public/data/content-catalog.json";
var IGNORED_DIRECTORY_NAMES = new Set([".git", ".workbench", "node_modules", "dist", "build"]);
var CARD_KINDS = new Set(["unit", "artifact", "talisman", "field", "skill", "pill"]);
var CARD_RARITIES = new Set(["common", "uncommon", "rare", "epic", "legendary"]);
var INSPECTION_KINDS = ["broken-link", "scene-dead-end", "orphan-asset", "card-missing-art", "asset-missing-metadata"];
var CARD_ART_FIELDS = ["image", "art", "illustration", "icon", "sprite", "portrait"];
function dynamicImport(specifier) {
  return Function("specifier", "return import(specifier)")(specifier);
}
async function openSqlite(path) {
  const runningInBun = typeof globalThis.Bun !== "undefined";
  const module = await dynamicImport(runningInBun ? "bun:sqlite" : "node:sqlite");
  const Database = runningInBun ? module.Database : module.DatabaseSync;
  if (!Database)
    throw new Error("SQLite runtime is unavailable");
  const db = new Database(path);
  db.exec("PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
  return db;
}
function nowIso() {
  return new Date().toISOString();
}
function hashBytes(value) {
  return createHash8("sha256").update(value).digest("hex");
}
function fileFingerprint(info) {
  return `${info.dev}:${info.ino}:${info.size}:${info.mtimeNs}:${info.ctimeNs}`;
}
async function hashFile(filePath) {
  const file = await open3(filePath, "r");
  const hash = createHash8("sha256");
  const buffer = Buffer.allocUnsafe(1024 * 1024);
  try {
    while (true) {
      const { bytesRead } = await file.read(buffer, 0, buffer.byteLength, null);
      if (bytesRead === 0)
        break;
      hash.update(buffer.subarray(0, bytesRead));
    }
    return hash.digest("hex");
  } finally {
    await file.close();
  }
}
function stableId(prefix, projectId, path) {
  return `${prefix}:${projectId}:${path}`;
}
function jsonStringify(value) {
  return JSON.stringify(value);
}
function parseJson(value, fallback) {
  if (value === undefined)
    return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}
function asRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value : undefined;
}
function asString(value) {
  return typeof value === "string" ? value : undefined;
}
function toPosixPath(value) {
  return value.replaceAll("\\", "/");
}
function normalizeRelativePath(value, label = "path") {
  const replaced = toPosixPath(value.trim());
  if (!replaced || replaced.startsWith("/") || /^[A-Za-z]:\//.test(replaced) || replaced.includes("\x00")) {
    throw new ContentServiceError("PATH_ESCAPE", `${label} must be a non-empty relative path.`);
  }
  const normalized = posix.normalize(replaced);
  if (normalized === "." || normalized === ".." || normalized.startsWith("../")) {
    throw new ContentServiceError("PATH_ESCAPE", `${label} escapes its project root.`);
  }
  return normalized.replace(/^\.\//, "");
}
function isContained(root, child) {
  const childRelative = relative4(root, child);
  return !isAbsolute4(childRelative) && childRelative !== ".." && !childRelative.startsWith(`..${sep5}`);
}
function clampLimit(limit) {
  if (typeof limit !== "number" || !Number.isFinite(limit))
    return 50;
  return Math.max(1, Math.min(MAX_PAGE_SIZE, Math.floor(limit)));
}
function encodeCursor(path) {
  return Buffer.from(JSON.stringify({ path }), "utf8").toString("base64url");
}
function decodeCursor(cursor) {
  if (typeof cursor !== "string" || cursor.length === 0)
    return;
  try {
    const parsed = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8"));
    if (!parsed || typeof parsed.path !== "string" || !parsed.path)
      throw Error("cursor lacks a seek key");
    return parsed.path;
  } catch {
    throw new ContentServiceError("INVALID_INPUT", "cursor is malformed.");
  }
}
function normalizedSearch(value) {
  return value.normalize("NFKC").toLocaleLowerCase();
}
function queryTerms(query) {
  if (typeof query !== "string")
    return [];
  const normalized = normalizedSearch(query);
  const terms = [];
  for (const match of normalized.matchAll(/"([^"\n]*)"|([^\s"]+)/gu)) {
    const value = (match[1] ?? match[2] ?? "").trim();
    if (value)
      terms.push(value);
  }
  return terms;
}
function escapeLikeTerm(value) {
  return value.replace(/[\\%_]/gu, (character) => `\\${character}`);
}
function addSearchSql(clauses, parameters, column, query) {
  for (const term of queryTerms(query)) {
    clauses.push(`${column} LIKE ? ESCAPE '\\'`);
    parameters.push(`%${escapeLikeTerm(term)}%`);
  }
}
function stringFilterValues(value) {
  const values = Array.isArray(value) ? value : [value];
  return [...new Set(values.filter((item) => typeof item === "string").map((item) => item.trim()).filter(Boolean))];
}
function addCardFilterSql(clauses, parameters, input) {
  if (typeof input.kind === "string" && input.kind.trim()) {
    clauses.push("kind = ?");
    parameters.push(input.kind.trim());
  }
  if (typeof input.rarity === "string" && input.rarity.trim()) {
    clauses.push("rarity = ?");
    parameters.push(input.rarity.trim());
  }
  const tags = stringFilterValues(input.tags ?? input.labels);
  for (const tag of tags) {
    clauses.push("labels_json LIKE ? ESCAPE '\\'");
    parameters.push(`%"${escapeLikeTerm(tag)}"%`);
  }
}
function makeSnippet(content, q) {
  const terms = queryTerms(q);
  if (terms.length === 0)
    return;
  const normalized = normalizedSearch(content);
  const index = terms.map((term) => normalized.indexOf(term)).filter((item) => item >= 0).sort((a, b) => a - b)[0];
  if (index === undefined)
    return;
  const start = Math.max(0, index - 70);
  const end = Math.min(content.length, index + 150);
  return `${start > 0 ? "…" : ""}${content.slice(start, end).replace(/\s+/gu, " ")}${end < content.length ? "…" : ""}`;
}
function titleFromMarkdown(path, content) {
  const frontmatter = content.match(/^---\s*\n(?:.|\n)*?^title:\s*["']?(.+?)["']?\s*\n(?:.|\n)*?^---\s*$/mu);
  if (frontmatter?.[1])
    return frontmatter[1].trim();
  const heading = content.match(/^#{1,6}\s+(.+?)\s*#*\s*$/mu);
  if (heading?.[1])
    return heading[1].trim();
  return basename(path, extname2(path));
}
function parseMarkdownTarget(rawTarget) {
  const target = rawTarget.trim();
  if (!target || /^(?:[a-z][a-z\d+.-]*:|\/\/)/iu.test(target)) {
    return { local: false, targetPath: target };
  }
  const hashIndex = target.indexOf("#");
  const withoutAnchor = hashIndex >= 0 ? target.slice(0, hashIndex) : target;
  const anchor = hashIndex >= 0 ? target.slice(hashIndex + 1) : undefined;
  const queryIndex = withoutAnchor.indexOf("?");
  const pathPart = queryIndex >= 0 ? withoutAnchor.slice(0, queryIndex) : withoutAnchor;
  const query = queryIndex >= 0 ? withoutAnchor.slice(queryIndex + 1) : undefined;
  return {
    local: true,
    targetPath: pathPart,
    ...anchor ? { anchor } : {},
    ...query ? { query } : {}
  };
}
function parseMarkdownLinks(content) {
  const result = [];
  const pattern = /(!?\[[^\]]*\]\(\s*)(<[^>]+>|[^)\s]+)(\s*(?:["'][^)]*["'])?\s*\))/gu;
  for (const match of content.matchAll(pattern)) {
    const full = match[0] ?? "";
    const prefix = match[1] ?? "";
    const target = match[2] ?? "";
    const suffix = match[3] ?? "";
    const labelMatch = prefix.match(/^!?\[([^\]]*)\]/u);
    result.push({
      prefix,
      target,
      suffix,
      label: labelMatch?.[1] ?? "",
      index: match.index ?? content.indexOf(full)
    });
  }
  return result;
}
function linkTargetForSource(sourcePath, rawTarget) {
  const parsed = parseMarkdownTarget(rawTarget.replace(/^<|>$/gu, ""));
  if (!parsed.local)
    return { ...parsed, path: parsed.targetPath };
  const rawPath = toPosixPath(parsed.targetPath);
  const combined = rawPath.startsWith("/") ? posix.normalize(rawPath.slice(1)) : posix.normalize(posix.join(posix.dirname(sourcePath), rawPath || posix.basename(sourcePath)));
  return { ...parsed, path: combined.replace(/^\.\//, "") };
}
function sameDocumentTarget(resolvedPath, rawPath, expectedPath) {
  if (resolvedPath === expectedPath)
    return true;
  if (extname2(rawPath))
    return false;
  return `${resolvedPath}.md` === expectedPath || `${resolvedPath}.markdown` === expectedPath;
}
function relativeLinkPath(sourcePath, targetPath, keepExtensionless, keepDotSlash) {
  let value = posix.relative(posix.dirname(sourcePath), targetPath);
  if (!value)
    value = posix.basename(targetPath);
  if (keepExtensionless && extname2(value).toLowerCase() === ".md")
    value = value.slice(0, -3);
  if (keepDotSlash && !value.startsWith("../") && !value.startsWith("./"))
    value = `./${value}`;
  return value;
}
function parseSpriteMetadata(value) {
  const record = asRecord(value);
  if (!record)
    return {};
  const frames = record.frames;
  if (Array.isArray(frames))
    return { frameCount: frames.length, metadata: { frames: frames.length } };
  const frameRecord = asRecord(frames);
  if (frameRecord)
    return { frameCount: Object.keys(frameRecord).length, metadata: { frames: Object.keys(frameRecord).length } };
  return {};
}
function frontmatterHasScene(content) {
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---/u);
  if (!frontmatter)
    return false;
  return /^\s*scene:\s*true\s*$/mu.test(frontmatter[1] ?? "");
}
function optionSectionRanges(content) {
  const lines = content.split(`
`);
  const ranges = [];
  let open;
  for (const [index, line] of lines.entries()) {
    const heading = line.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/u);
    if (!heading)
      continue;
    const lineNumber = index + 1;
    const level = heading[1].length;
    if (open !== undefined && level <= 2) {
      ranges.push({ start: open, end: lineNumber - 1 });
      open = undefined;
    }
    if (level === 2 && heading[2] === "选项")
      open = lineNumber;
  }
  if (open !== undefined)
    ranges.push({ start: open, end: lines.length });
  return ranges;
}
var SCENE_FRONTMATTER_FIELDS = ["chapter", "location", "sublocation", "locationId", "sublocationId", "timeHint"];
function sceneFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/u);
  const fields = {};
  if (!match)
    return fields;
  for (const line of (match[1] ?? "").split(/\r?\n/u)) {
    const entry = line.match(/^([A-Za-z][A-Za-z0-9_-]*):\s*(.*?)\s*$/u);
    if (!entry)
      continue;
    const value = (entry[2] ?? "").replace(/^["']|["']$/gu, "");
    if (value)
      fields[entry[1]] = value;
  }
  return fields;
}
function sceneTags(content) {
  const fields = sceneFrontmatter(content);
  const raw = fields.tags;
  if (!raw)
    return [];
  const inner = raw.startsWith("[") && raw.endsWith("]") ? raw.slice(1, -1) : raw;
  return inner.split(",").map((tag) => tag.trim().replace(/^["']|["']$/gu, "")).filter(Boolean);
}
function kebabCase(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/gu, "-").replace(/^-+|-+$/gu, "");
}
function storyNodeId(path, fields = {}) {
  if (fields.nodeId)
    return fields.nodeId;
  const relative = path.startsWith("knowledge/") ? path.slice("knowledge/".length) : path;
  return `n:${relative}`;
}
function storyChoiceMetadata(lines, line) {
  const sourceLine = lines[line - 1] ?? "";
  const marker = sourceLine.match(/<!--\s*story-choice:\s*([\s\S]*?)\s*-->/u);
  if (!marker)
    return;
  return validateStoryChoiceMetadata(parseStoryRuleJson(marker[1] ?? "", `第 ${line} 行 story-choice`), `第 ${line} 行 story-choice`);
}
function sceneNarrative(content, title) {
  const body = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/u, "");
  const lines = body.split(/\r?\n/u);
  const ranges = optionSectionRanges(body);
  const dialogueStart = lines.findIndex((line) => /^##\s+对话\s*$/u.test(line.trim()));
  const cut = Math.min(ranges.length > 0 ? ranges[0].start - 1 : lines.length, dialogueStart < 0 ? lines.length : dialogueStart);
  const prose = lines.slice(0, cut).filter((line) => !/^#{1,6}\s/u.test(line)).join(`
`).replace(/\n{3,}/gu, `

`).trim();
  const detail = prose || title;
  const summary = (prose.split(/\n\s*\n/u).find((paragraph) => paragraph.trim()) ?? "").trim() || detail;
  return { summary, detail };
}
function sceneDialogues(content, path, fail) {
  const lines = content.split(/\r?\n/u);
  const headings = lines.flatMap((line, index) => /^##\s+对话\s*$/u.test(line.trim()) ? [index] : []);
  const heading = headings[0] ?? -1;
  if (heading < 0)
    return [];
  for (const extra of headings.slice(1))
    fail(path, "一个场景只能有一个 ## 对话 章节。", extra + 1);
  const options = lines.findIndex((line) => /^##\s+选项\s*$/u.test(line.trim()));
  if (options >= 0 && heading > options)
    fail(path, "## 对话 必须写在 ## 选项 之前。", heading + 1);
  const result = [];
  for (let index = heading + 1;index < lines.length && !/^##\s+/u.test(lines[index].trim()); index++) {
    const line = lines[index].trim();
    if (!line)
      continue;
    const match = line.match(/^-\s*([^：:]+)[：:]\s*(.*?)\s*<!--\s*story-line:\s*(.*?)\s*-->\s*$/u);
    if (!match) {
      fail(path, '对白需独占一行，格式为 - 说话者：台词 <!-- story-line: {"id":"...","speakerId":"..."} -->。', index + 1);
      continue;
    }
    try {
      const metadata = parseStoryRuleJson(match[3], `第 ${index + 1} 行 story-line`);
      if (!metadata || typeof metadata !== "object" || Array.isArray(metadata))
        throw Error("story-line 需要 JSON 对象");
      const fields = metadata;
      const { id, speakerId, emotion } = fields;
      const speakerName = match[1].trim(), text = match[2].trim();
      if (typeof id !== "string" || !/^[A-Za-z0-9][A-Za-z0-9._:-]*$/u.test(id) || typeof speakerId !== "string" || !/^[A-Za-z0-9][A-Za-z0-9._:-]*$/u.test(speakerId) || !speakerName || !text || text.length > 500 || emotion !== undefined && (typeof emotion !== "string" || emotion.length > 80)) {
        throw Error("对白 ID、speakerId、说话者或台词无效（单条台词最多 500 字）");
      }
      result.push({ id, speakerId, speakerName, text, ...emotion ? { emotion } : {}, line: index + 1 });
    } catch (error) {
      fail(path, error instanceof Error ? error.message : String(error), index + 1);
    }
  }
  return result;
}
async function inspectCandidateFile(filePath, declaredMime, size) {
  const reasons = [];
  if (size === 0)
    reasons.push("candidate bytes are empty.");
  let sniffed;
  if (size > 0) {
    const file = await open3(filePath, "r");
    try {
      const buffer = Buffer.alloc(Math.min(size, 64 * 1024));
      const { bytesRead } = await file.read(buffer, 0, buffer.length, 0);
      sniffed = sniffMediaMime(buffer.subarray(0, bytesRead));
    } finally {
      await file.close();
    }
  }
  const mime = declaredMime || sniffed || mediaTypeFromPath(filePath);
  if (sniffed && declaredMime && sniffed !== declaredMime) {
    reasons.push(`declared mimeType ${declaredMime} does not match sniffed ${sniffed}.`);
  }
  if (mime.startsWith("image/")) {
    const inspection = await inspectMediaFile(filePath, { mimeType: mime }).catch(() => {
      return;
    });
    if (!inspection || inspection.width === undefined || inspection.height === undefined) {
      reasons.push("image candidate is not decodable or lacks dimensions.");
    }
  } else if (mime.startsWith("audio/")) {
    const inspection = await inspectMediaFile(filePath, { mimeType: mime }).catch(() => {
      return;
    });
    if (!inspection || inspection.durationMs === undefined) {
      reasons.push("audio candidate is not decodable or lacks a duration.");
    }
  }
  return { passed: reasons.length === 0, reasons };
}
function ensureString(value, label) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ContentServiceError("INVALID_INPUT", `${label} must be a non-empty string.`);
  }
  return value;
}
function contentDocumentFromRow(row, links, q, includeContent = true) {
  const source = row.content ?? "";
  const snippet = makeSnippet(`${row.title}
${row.path}
${source}`, q);
  return {
    id: row.id,
    title: row.title,
    path: row.path,
    revision: row.revision,
    type: "document",
    ...includeContent ? { content: source } : {},
    links,
    size: row.size,
    updatedAt: row.updated_at,
    ...snippet ? { snippet } : {}
  };
}
function cardFromRow(row) {
  const json = parseJson(row.json, {});
  const rarity = row.rarity || (typeof json.rarity === "string" ? json.rarity : undefined);
  const labels = row.labels_json ? parseJson(row.labels_json, []).filter((label) => typeof label === "string") : Array.isArray(json.labels) ? json.labels.filter((label) => typeof label === "string") : [];
  return {
    id: row.id,
    title: row.name,
    path: row.path,
    revision: row.revision,
    type: "card",
    kind: row.kind,
    name: row.name,
    description: row.description,
    ...rarity ? { rarity } : {},
    ...labels.length > 0 ? { labels } : {},
    ...typeof row.face_preview === "string" && row.face_preview.startsWith("/assets/card-faces/") ? { facePreview: row.face_preview } : {},
    ...Object.fromEntries(["attack", "health"].flatMap((field) => {
      const value = row[field] ?? json[field];
      return typeof value === "number" && Number.isFinite(value) ? [[field, value]] : [];
    })),
    ...row.json ? { json } : {}
  };
}
function assetVersionFromRow(row) {
  return {
    id: row.id,
    assetId: row.asset_id,
    path: row.path,
    revision: row.revision,
    mimeType: row.mime_type,
    size: row.size,
    ...row.width === undefined ? {} : { width: row.width },
    ...row.height === undefined ? {} : { height: row.height },
    ...row.duration_ms === undefined ? {} : { durationMs: row.duration_ms },
    ...row.frame_count === undefined ? {} : { frameCount: row.frame_count },
    source: row.source,
    ...row.candidate_id ? { candidateId: row.candidate_id } : {},
    metadata: parseJson(row.metadata_json, {}),
    createdAt: row.created_at,
    adopted: row.adopted !== 0
  };
}
function assetFromRow(row, versions) {
  const storedMetadata = parseJson(row.metadata_json, {});
  const metadataName = typeof storedMetadata.name === "string" ? storedMetadata.name : undefined;
  const metadataTags = Array.isArray(storedMetadata.tags) ? storedMetadata.tags.filter((tag) => typeof tag === "string") : [];
  const name = row.name?.trim() || metadataName;
  const tags = row.tags_json ? parseJson(row.tags_json, metadataTags).filter((tag) => typeof tag === "string") : metadataTags;
  const { name: _storedName, tags: _storedTags, ...metadata } = storedMetadata;
  const metadataRevision = row.metadata_revision || hashBytes(row.metadata_json);
  return {
    id: row.id,
    title: name || basename(row.path, extname2(row.path)),
    path: row.path,
    revision: row.revision,
    type: "asset",
    ...name ? { name } : {},
    ...tags.length > 0 ? { tags } : {},
    metadataRevision,
    kind: row.kind,
    mimeType: row.mime_type,
    size: row.size,
    ...row.width === undefined ? {} : { width: row.width },
    ...row.height === undefined ? {} : { height: row.height },
    ...row.duration_ms === undefined ? {} : { durationMs: row.duration_ms },
    ...row.frame_count === undefined ? {} : { frameCount: row.frame_count },
    ...row.current_version_id ? { currentVersionId: row.current_version_id } : {},
    format: extname2(row.path).replace(/^\./u, "").toLowerCase() || undefined,
    status: "ready",
    metadata,
    ...versions ? { versions } : {}
  };
}
function addAssetScopeSql(clauses, scope, kindColumn = "kind") {
  if (scope === undefined)
    return;
  if (scope !== "art" && scope !== "audio")
    throw new ContentServiceError("INVALID_INPUT", "assetScope must be art or audio.");
  const audio = `(lower(coalesce(mime_type, '')) LIKE 'audio/%' OR lower(coalesce(${kindColumn}, '')) = 'audio')`;
  clauses.push(scope === "audio" ? audio : `NOT ${audio}`);
}
function addAssetFilterSql(clauses, parameters, input) {
  addAssetScopeSql(clauses, input.assetScope);
  if (typeof input.kind === "string" && input.kind.trim()) {
    clauses.push("(kind = ? OR mime_type = ?)");
    parameters.push(input.kind.trim(), input.kind.trim());
  }
  if (typeof input.mimeType === "string" && input.mimeType.trim()) {
    clauses.push("lower(mime_type) = lower(?)");
    parameters.push(input.mimeType.trim());
  }
  if (typeof input.format === "string" && input.format.trim()) {
    const format = input.format.trim().replace(/^\.+/u, "").toLowerCase();
    if (format) {
      clauses.push("lower(path) LIKE ? ESCAPE '\\'");
      parameters.push(`%.${escapeLikeTerm(format)}`);
    }
  }
  const ranges = [
    [input.minWidth, "width >= ?"],
    [input.maxWidth, "width <= ?"],
    [input.minDurationMs, "duration_ms >= ?"],
    [input.maxDurationMs, "duration_ms <= ?"]
  ];
  for (const [value, clause] of ranges) {
    if (typeof value !== "number" || !Number.isFinite(value))
      continue;
    const column = clause.startsWith("width") ? "width" : "duration_ms";
    clauses.push(`${column} IS NOT NULL AND ${clause}`);
    parameters.push(value);
  }
}
function candidateAssetFromRow(row, dataRoot) {
  const metadata = parseJson(row.metadata_json, {});
  const frameCount = readNumber(metadata.frameCount ?? metadata.frames);
  const metadataKind = typeof metadata.kind === "string" && ["image", "audio", "spritesheet", "other"].includes(metadata.kind) ? metadata.kind : undefined;
  const path = toPosixPath(relative4(dataRoot, row.file_path));
  const kind = metadataKind ?? mediaKindFromMime(row.mime_type, row.file_path, frameCount);
  const name = row.name || basename(row.file_path);
  return {
    id: row.id,
    title: name,
    path,
    revision: row.revision,
    type: "asset",
    name,
    format: extname2(row.file_path).replace(/^\./u, "").toLowerCase() || undefined,
    status: "candidate",
    kind,
    mimeType: row.mime_type,
    size: row.size,
    ...readNumber(metadata.width) === undefined ? {} : { width: readNumber(metadata.width) },
    ...readNumber(metadata.height) === undefined ? {} : { height: readNumber(metadata.height) },
    ...readNumber(metadata.durationMs) === undefined ? {} : { durationMs: readNumber(metadata.durationMs) },
    ...frameCount === undefined ? {} : { frameCount },
    metadata
  };
}
function toErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
function readNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}
var SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  root TEXT NOT NULL,
  title TEXT
);
CREATE TABLE IF NOT EXISTS documents (
  project_id TEXT NOT NULL,
  id TEXT NOT NULL,
  path TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  revision TEXT NOT NULL,
  mtime_ms REAL NOT NULL DEFAULT 0,
  size INTEGER NOT NULL DEFAULT 0,
  deleted INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  search_text TEXT NOT NULL DEFAULT '',
  PRIMARY KEY (project_id, id),
  UNIQUE (project_id, path)
);
CREATE INDEX IF NOT EXISTS documents_path_idx ON documents(project_id, deleted, path);
CREATE INDEX IF NOT EXISTS documents_search_idx ON documents(project_id, deleted, search_text);
CREATE TABLE IF NOT EXISTS story_scene_index (
  project_id TEXT NOT NULL,
  path TEXT NOT NULL,
  revision TEXT NOT NULL,
  file_fingerprint TEXT NOT NULL,
  node_id TEXT NOT NULL,
  chapter TEXT NOT NULL,
  summary TEXT NOT NULL,
  dialogue_count INTEGER NOT NULL,
  diagnostics_json TEXT NOT NULL,
  PRIMARY KEY(project_id, path)
);
CREATE TABLE IF NOT EXISTS story_dialogue_lines (
  project_id TEXT NOT NULL,
  path TEXT NOT NULL,
  ordinal INTEGER NOT NULL,
  id TEXT NOT NULL,
  speaker_id TEXT NOT NULL,
  speaker_name TEXT NOT NULL,
  text TEXT NOT NULL,
  emotion TEXT,
  source_line INTEGER NOT NULL,
  PRIMARY KEY(project_id, path, ordinal)
);
CREATE INDEX IF NOT EXISTS story_dialogue_speaker_idx ON story_dialogue_lines(project_id, speaker_id, path);
CREATE TABLE IF NOT EXISTS document_revisions (
  project_id TEXT NOT NULL,
  document_id TEXT NOT NULL,
  revision TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY(project_id, document_id, revision)
);
CREATE TABLE IF NOT EXISTS document_links (
  project_id TEXT NOT NULL,
  source_id TEXT NOT NULL,
  target_path TEXT NOT NULL,
  target_kind TEXT NOT NULL,
  target_id TEXT,
  anchor TEXT,
  label TEXT,
  line INTEGER NOT NULL,
  raw_target TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS document_links_target_idx ON document_links(project_id, target_path);
CREATE INDEX IF NOT EXISTS document_links_source_idx ON document_links(project_id, source_id);
CREATE TABLE IF NOT EXISTS directories (
  project_id TEXT NOT NULL,
  path TEXT NOT NULL,
  revision TEXT NOT NULL,
  deleted INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(project_id, path)
);
CREATE TABLE IF NOT EXISTS cards (
  project_id TEXT NOT NULL,
  id TEXT NOT NULL,
  path TEXT NOT NULL,
  collection TEXT NOT NULL,
  kind TEXT NOT NULL,
  rarity TEXT NOT NULL DEFAULT '',
  labels_json TEXT NOT NULL DEFAULT '[]',
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  json TEXT NOT NULL,
  source_revision TEXT NOT NULL DEFAULT '',
  revision TEXT NOT NULL,
  mtime_ms REAL NOT NULL DEFAULT 0,
  deleted INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  PRIMARY KEY(project_id, id)
);
CREATE INDEX IF NOT EXISTS cards_path_idx ON cards(project_id, path, deleted);
CREATE INDEX IF NOT EXISTS cards_search_idx ON cards(project_id, deleted, name, kind);
CREATE TABLE IF NOT EXISTS card_revisions (
  project_id TEXT NOT NULL,
  card_id TEXT NOT NULL,
  revision TEXT NOT NULL,
  json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY(project_id, card_id, revision)
);
CREATE TABLE IF NOT EXISTS assets (
  project_id TEXT NOT NULL,
  id TEXT NOT NULL,
  path TEXT NOT NULL,
  kind TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  tags_json TEXT NOT NULL DEFAULT '[]',
  metadata_revision TEXT NOT NULL DEFAULT '',
  revision TEXT NOT NULL,
  size INTEGER NOT NULL DEFAULT 0,
  width REAL,
  height REAL,
  duration_ms REAL,
  frame_count REAL,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  current_version_id TEXT,
  deleted INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  PRIMARY KEY(project_id, id),
  UNIQUE(project_id, path)
);
CREATE INDEX IF NOT EXISTS assets_path_idx ON assets(project_id, deleted, path);
CREATE TABLE IF NOT EXISTS asset_versions (
  project_id TEXT NOT NULL,
  id TEXT NOT NULL,
  asset_id TEXT NOT NULL,
  path TEXT NOT NULL,
  revision TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL DEFAULT 0,
  width REAL,
  height REAL,
  duration_ms REAL,
  frame_count REAL,
  source TEXT NOT NULL,
  candidate_id TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  adopted INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(project_id, id)
);
CREATE INDEX IF NOT EXISTS asset_versions_asset_idx ON asset_versions(project_id, asset_id, created_at DESC);
CREATE TABLE IF NOT EXISTS candidates (
  project_id TEXT NOT NULL,
  id TEXT NOT NULL,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  revision TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL DEFAULT 0,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  PRIMARY KEY(project_id, id)
);
CREATE TABLE IF NOT EXISTS story_builds (
  project_id TEXT NOT NULL,
  story_id TEXT NOT NULL,
  entry_path TEXT NOT NULL DEFAULT '',
  output_path TEXT NOT NULL,
  source_paths_json TEXT NOT NULL DEFAULT '[]',
  diagnostics_json TEXT NOT NULL DEFAULT '[]',
  error_count INTEGER NOT NULL DEFAULT 0,
  warning_count INTEGER NOT NULL DEFAULT 0,
  node_count INTEGER NOT NULL DEFAULT 0,
  choice_count INTEGER NOT NULL DEFAULT 0,
  built_at TEXT NOT NULL,
  PRIMARY KEY(project_id, story_id)
);
`;

class ContentServiceImpl {
  options;
  dataRoot;
  pageEpoch = randomUUID6();
  projects = new Map;
  listeners = new Set;
  pendingStoryRebuilds = new Set;
  inlineMediaLimit;
  dbReady;
  ready;
  writeQueue = Promise.resolve();
  db;
  closed = false;
  manifestCache = new Map;
  constructor(options) {
    if (!options || typeof options.dataRoot !== "string" || !Array.isArray(options.projects)) {
      throw new ContentServiceError("INVALID_INPUT", "dataRoot and projects are required.");
    }
    this.options = options;
    this.dataRoot = resolve3(options.dataRoot);
    this.inlineMediaLimit = options.inlineMediaLimit ?? DEFAULT_INLINE_MEDIA_LIMIT;
    for (const project of options.projects) {
      if (!project || typeof project.id !== "string" || project.id.trim().length === 0 || typeof project.root !== "string") {
        throw new ContentServiceError("INVALID_INPUT", "each project requires a non-empty id and root.");
      }
      if (this.projects.has(project.id)) {
        throw new ContentServiceError("INVALID_INPUT", `duplicate project id: ${project.id}`);
      }
      this.projects.set(project.id, {
        input: { ...project },
        phase: "pending",
        errors: [],
        watchers: [],
        watchDirectories: [],
        watchedDirectories: new Set,
        pendingEvents: new Map
      });
    }
    const dbPath = options.dbPath === ":memory:" ? options.dbPath : resolve3(options.dbPath ?? `${this.dataRoot}/content.sqlite`);
    this.dbReady = this.openDatabase(dbPath);
    this.ready = this.initialize();
    this.ready.catch(() => {});
  }
  async openDatabase(dbPath) {
    if (dbPath !== ":memory:")
      await mkdir6(dirname3(dbPath), { recursive: true });
    const db = await openSqlite(dbPath);
    db.exec(SCHEMA_SQL);
    try {
      db.exec("ALTER TABLE cards ADD COLUMN source_revision TEXT NOT NULL DEFAULT ''");
    } catch {}
    try {
      db.exec("ALTER TABLE story_builds ADD COLUMN entry_path TEXT NOT NULL DEFAULT ''");
    } catch {}
    for (const statement of [
      "ALTER TABLE cards ADD COLUMN rarity TEXT NOT NULL DEFAULT ''",
      "ALTER TABLE cards ADD COLUMN labels_json TEXT NOT NULL DEFAULT '[]'"
    ]) {
      try {
        db.exec(statement);
      } catch {}
    }
    for (const statement of [
      "ALTER TABLE assets ADD COLUMN name TEXT NOT NULL DEFAULT ''",
      "ALTER TABLE assets ADD COLUMN tags_json TEXT NOT NULL DEFAULT '[]'",
      "ALTER TABLE assets ADD COLUMN metadata_revision TEXT NOT NULL DEFAULT ''"
    ]) {
      try {
        db.exec(statement);
      } catch {}
    }
    db.exec("CREATE INDEX IF NOT EXISTS cards_filter_idx ON cards(project_id, deleted, rarity, kind, path, id)");
    this.db = db;
    return db;
  }
  async initialize() {
    const db = await this.dbReady;
    if (this.closed)
      return;
    for (const state of this.projects.values()) {
      try {
        state.root = await realpath6(resolve3(state.input.root));
        db.prepare("INSERT INTO projects(id, root, title) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET root=excluded.root, title=excluded.title").run(state.input.id, state.root, state.input.title ?? null);
        state.phase = "indexing";
      } catch (error) {
        state.phase = "error";
        state.errors.push(`Unable to register project ${state.input.id}: ${toErrorMessage(error)}`);
      }
    }
    for (const state of this.projects.values()) {
      if (!state.root || state.phase === "error" || this.closed)
        continue;
      try {
        await this.indexProject(state);
        state.phase = "ready";
        state.indexedAt = nowIso();
        this.startWatcher(state);
        this.notify({ projectId: state.input.id, reason: "index", kinds: ["status", "document", "directory", "card", "asset"] });
      } catch (error) {
        state.phase = "error";
        state.errors.push(toErrorMessage(error));
      }
    }
  }
  getDatabase() {
    if (!this.db)
      throw new ContentServiceError("SERVICE_CLOSED", "content database is not ready.");
    return this.db;
  }
  project(projectId) {
    const state = this.projects.get(projectId);
    if (!state)
      throw new ContentServiceError("NOT_FOUND", `unknown content project: ${projectId}`);
    return state;
  }
  async requireReady() {
    if (this.closed)
      throw new ContentServiceError("SERVICE_CLOSED", "content service is closed.");
    await this.dbReady;
    await this.ready;
    await this.writeQueue;
  }
  async requireInitialized() {
    if (this.closed)
      throw new ContentServiceError("SERVICE_CLOSED", "content service is closed.");
    await this.dbReady;
    await this.ready;
  }
  enqueue(operation) {
    const run = this.writeQueue.then(async () => operation());
    this.writeQueue = run.then(() => {
      return;
    }, () => {
      return;
    });
    return run;
  }
  notify(event) {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch {}
    }
  }
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  async query(input) {
    if (!input || typeof input !== "object")
      throw new ContentServiceError("INVALID_INPUT", "query input must be an object.");
    const projectId = ensureString(input.projectId, "projectId");
    this.project(projectId);
    if (input.op === "status")
      return this.queryStatus(projectId);
    await this.requireReady();
    if (PAGE_OPERATIONS.has(input.op)) {
      return this.enqueue(() => this.queryPage(input));
    }
    return this.queryValue(input);
  }
  async pageRevision(input) {
    const database = this.getDatabase();
    const local = database.prepare("SELECT CAST(total_changes() AS TEXT) AS changes").get();
    const external = database.prepare("PRAGMA data_version").get();
    const counter = `${this.pageEpoch}:${local.changes}:${external.data_version}`;
    if (input.op === "gameCatalog") {
      const catalog = await this.gameCatalog(input.projectId);
      return { revision: `content-page:${counter}:${catalog.revision}`, catalog: catalog.revision };
    }
    return { revision: `content-page:${counter}` };
  }
  async queryPage(input) {
    if (this.closed)
      throw new ContentServiceError("SERVICE_CLOSED", "content service is closed.");
    const identity = pageQueryIdentity(input);
    const cursor = decodePageCursor("cursor" in input ? input.cursor : undefined);
    if (cursor && cursor.query !== identity)
      throw new ContentServiceError("INVALID_INPUT", "page cursor belongs to another project or query.");
    const before = await this.pageRevision(input);
    const activeCursor = cursor?.revision === before.revision ? encodeCursor(cursor.after) : undefined;
    const page = await this.queryValue({ ...input, cursor: activeCursor });
    const after = await this.pageRevision(input);
    if (before.revision !== after.revision || before.catalog !== undefined && page.revision !== before.catalog)
      throw new ContentServiceError("CONTENT_CONFLICT", "content changed while reading a page; restart from the first page.");
    const afterKey = page.nextCursor === undefined ? undefined : decodeCursor(page.nextCursor);
    return {
      items: page.items,
      revision: before.revision,
      ...afterKey === undefined ? {} : { next: Buffer.from(JSON.stringify({ version: 1, query: identity, revision: before.revision, after: afterKey })).toString("base64url") },
      ...page.total === undefined ? {} : { total: page.total }
    };
  }
  async queryValue(input) {
    switch (input.op) {
      case "documents":
        return this.queryDocuments(input);
      case "directories":
        return this.queryDirectories(input);
      case "document":
        return this.queryDocument(input);
      case "documentMeta":
        return this.queryDocumentMeta(input);
      case "backlinks":
        return this.queryBacklinks(input);
      case "graph":
        return this.queryGraph(input);
      case "movePreview":
        return this.queryMovePreview(input);
      case "cards":
        return this.queryCards(input);
      case "card":
        return this.queryCard(input);
      case "assets":
        return this.queryAssets(input);
      case "asset":
        return this.queryAsset(input);
      case "versions":
        return this.queryVersions(input);
      case "inspection":
        return this.queryInspection(input);
      case "recentChanges":
        return this.queryRecentChanges(input);
      case "storyBuilds":
        return this.queryStoryBuilds(input);
      case "storyScenePage":
        return this.queryStoryScenePage(input);
      case "gameDeck":
        return this.queryGameDeck(input);
      case "gameCatalog":
        return this.queryGameCatalog(input);
      case "storyAnalysis":
        return this.queryStoryAnalysis(input);
      case "balanceOverview":
        return this.queryBalanceOverview(input.projectId);
      case "media":
        return this.queryMedia(input);
      default:
        throw new ContentServiceError("INVALID_INPUT", `unknown content query operation: ${input.op}`);
    }
  }
  async command(method, input) {
    if (this.closed)
      throw new ContentServiceError("SERVICE_CLOSED", "content service is closed.");
    await this.requireInitialized();
    switch (method) {
      case "saveDocument":
        return this.enqueue(() => this.saveDocument(input));
      case "moveDocument":
        return this.enqueue(() => this.moveDocument(input));
      case "updateCard":
        return this.enqueue(() => this.updateCard(input));
      case "savePipelineCard":
        return this.enqueue(() => this.savePipelineCard(input));
      case "updateAsset":
        return this.enqueue(() => this.updateAsset(input));
      case "registerCandidates":
        return this.enqueue(() => this.registerCandidates(input));
      case "adoptVersion":
        return this.enqueue(() => this.adoptVersion(input));
      case "compileStory":
        return this.enqueue(() => this.compileStory(input));
      default:
        throw new ContentServiceError("INVALID_INPUT", `unknown content command: ${method}`);
    }
  }
  async resolveMedia(input) {
    if (!input || input.op !== "media")
      throw new ContentServiceError("INVALID_INPUT", "resolveMedia requires a media query.");
    const projectId = ensureString(input.projectId, "projectId");
    await this.requireInitialized();
    return this.resolveMediaQuery(input, projectId);
  }
  async close() {
    if (this.closed)
      return;
    this.closed = true;
    for (const state of this.projects.values()) {
      for (const watcher of state.watchers)
        watcher.close();
      state.watchers.length = 0;
      state.watchedDirectories.clear();
      for (const timer of state.pendingEvents.values())
        clearTimeout(timer);
      state.pendingEvents.clear();
      state.phase = "closed";
    }
    await this.ready.catch(() => {
      return;
    });
    await this.writeQueue.catch(() => {
      return;
    });
    await this.dbReady.then((db) => db.close(), () => {
      return;
    });
    this.db = undefined;
    this.listeners.clear();
  }
  async queryStatus(projectId) {
    const state = this.project(projectId);
    await this.dbReady.catch(() => {
      return;
    });
    const db = this.db;
    if (!db) {
      return { projectId, phase: state.phase, indexedAt: state.indexedAt, documents: 0, directories: 0, cards: 0, assets: 0, errors: [...state.errors] };
    }
    const count = (table) => {
      const row = db.prepare(`SELECT COUNT(*) AS count FROM ${table} WHERE project_id = ? AND deleted = 0`).get(projectId);
      return Number(row?.count ?? 0);
    };
    return {
      projectId,
      phase: state.phase,
      ...state.indexedAt ? { indexedAt: state.indexedAt } : {},
      documents: count("documents"),
      directories: count("directories"),
      cards: count("cards"),
      assets: count("assets"),
      errors: [...state.errors]
    };
  }
  async listProjectFiles(root) {
    const directories = [];
    const documents = [];
    const cards = [];
    const assets = [];
    const walk = async (absolute, relativeDirectory) => {
      let entries;
      try {
        entries = await readdir3(absolute, { withFileTypes: true });
      } catch {
        return;
      }
      for (const entry of entries) {
        if (entry.name === "." || entry.name === ".." || IGNORED_DIRECTORY_NAMES.has(entry.name))
          continue;
        const childAbsolute = resolve3(absolute, entry.name);
        const childRelative = relativeDirectory ? `${relativeDirectory}/${entry.name}` : entry.name;
        if (entry.isSymbolicLink()) {
          continue;
        }
        if (entry.isDirectory()) {
          directories.push(childRelative);
          await walk(childAbsolute, childRelative);
          continue;
        }
        if (!entry.isFile())
          continue;
        const normalized = toPosixPath(childRelative);
        if (/\.(?:md|markdown)$/iu.test(normalized))
          documents.push(normalized);
        if (normalized.startsWith(`${CARD_DIRECTORY}/`) && extname2(normalized).toLowerCase() === ".json")
          cards.push(normalized);
        if (normalized.startsWith(`${ASSET_DIRECTORY}/`) && normalized !== `${ASSET_DIRECTORY}/${MANIFEST_FILE_NAME}`)
          assets.push(normalized);
      }
    };
    await walk(root, "");
    return { directories, documents, cards, assets };
  }
  async indexProject(state) {
    if (!state.root)
      return;
    const db = this.getDatabase();
    const files = await this.listProjectFiles(state.root);
    state.watchDirectories = files.directories;
    db.exec("BEGIN IMMEDIATE");
    try {
      db.prepare("UPDATE documents SET deleted = 1 WHERE project_id = ?").run(state.input.id);
      db.prepare("UPDATE directories SET deleted = 1 WHERE project_id = ?").run(state.input.id);
      db.prepare("UPDATE cards SET deleted = 1 WHERE project_id = ?").run(state.input.id);
      db.prepare("UPDATE assets SET deleted = 1 WHERE project_id = ?").run(state.input.id);
      for (const path of files.directories) {
        const revision = hashBytes(path);
        db.prepare(`
          INSERT INTO directories(project_id, path, revision, deleted)
          VALUES (?, ?, ?, 0)
          ON CONFLICT(project_id, path) DO UPDATE SET revision=excluded.revision, deleted=0
        `).run(state.input.id, path, revision);
      }
      for (const path of files.documents)
        await this.indexDocumentFile(state, path);
      db.prepare("DELETE FROM story_dialogue_lines WHERE project_id = ? AND path NOT IN (SELECT path FROM documents WHERE project_id = ? AND deleted = 0)").run(state.input.id, state.input.id);
      db.prepare("DELETE FROM story_scene_index WHERE project_id = ? AND path NOT IN (SELECT path FROM documents WHERE project_id = ? AND deleted = 0)").run(state.input.id, state.input.id);
      for (const path of files.cards)
        await this.indexCardFile(state, path);
      await this.loadManifest(state.input.id);
      for (const path of files.assets)
        await this.indexAssetFile(state, path);
      this.rebuildAllLinks(state.input.id);
      db.exec("COMMIT");
    } catch (error) {
      try {
        db.exec("ROLLBACK");
      } catch {}
      throw error;
    }
  }
  async indexDocumentFile(state, path) {
    if (!state.root)
      return;
    const safePath = normalizeRelativePath(path);
    const absolute = await this.safeExistingPath(state, safePath);
    if (!absolute) {
      this.markDocumentDeleted(state.input.id, safePath);
      return;
    }
    for (let attempt = 0;attempt < 3; attempt += 1) {
      const beforeRead = await stat4(absolute, { bigint: true });
      if (!beforeRead.isFile())
        return;
      const content = await readFile8(absolute, "utf8");
      const afterRead = await stat4(absolute, { bigint: true });
      if (afterRead.isFile() && fileFingerprint(beforeRead) === fileFingerprint(afterRead)) {
        return this.upsertDocument(state.input.id, safePath, content, afterRead);
      }
    }
    throw new ContentServiceError("CONTENT_CONFLICT", `document changed during indexing: ${safePath}`);
  }
  upsertDocument(projectId, path, content, fileStat) {
    const db = this.getDatabase();
    const existing = db.prepare("SELECT * FROM documents WHERE project_id = ? AND path = ?").get(projectId, path);
    const id = existing?.id ?? stableId("document", projectId, path);
    const revision = hashBytes(content);
    const mtimeMs = Number(fileStat.mtimeNs) / 1e6;
    const size = Number(fileStat.size);
    const title = titleFromMarkdown(path, content);
    const updatedAt = nowIso();
    const searchText = normalizedSearch(`${path}
${title}
${content}`);
    db.prepare(`
      INSERT INTO documents(project_id, id, path, title, content, revision, mtime_ms, size, deleted, updated_at, search_text)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
      ON CONFLICT(project_id, id) DO UPDATE SET
        path=excluded.path, title=excluded.title, content=excluded.content,
        revision=excluded.revision, mtime_ms=excluded.mtime_ms, size=excluded.size,
        deleted=0, updated_at=excluded.updated_at, search_text=excluded.search_text
    `).run(projectId, id, path, title, content, revision, mtimeMs, size, updatedAt, searchText);
    if (!existing || existing.revision !== revision) {
      db.prepare("INSERT OR IGNORE INTO document_revisions(project_id, document_id, revision, content, created_at) VALUES (?, ?, ?, ?, ?)").run(projectId, id, revision, content, updatedAt);
    }
    this.updateStorySceneIndex(projectId, path, content, revision, title, fileStat);
    return db.prepare("SELECT * FROM documents WHERE project_id = ? AND id = ?").get(projectId, id);
  }
  updateStorySceneIndex(projectId, path, content, revision, title, fileStat) {
    const db = this.getDatabase();
    if (!frontmatterHasScene(content)) {
      this.deleteStorySceneIndex(projectId, path);
      return;
    }
    const fingerprint = fileFingerprint(fileStat);
    const previous = db.prepare("SELECT revision, file_fingerprint FROM story_scene_index WHERE project_id = ? AND path = ?").get(projectId, path);
    if (previous?.revision === revision && previous.file_fingerprint === fingerprint)
      return;
    const fields = sceneFrontmatter(content);
    const diagnostics = [];
    const lines = sceneDialogues(content, path, (sourcePath, detail, line) => {
      diagnostics.push({ severity: "error", path: sourcePath, ...line !== undefined ? { line } : {}, detail });
    });
    const narrative = sceneNarrative(content, title);
    db.exec("SAVEPOINT story_scene_index_update");
    try {
      db.prepare("DELETE FROM story_dialogue_lines WHERE project_id = ? AND path = ?").run(projectId, path);
      const insert = db.prepare(`
        INSERT INTO story_dialogue_lines(project_id, path, ordinal, id, speaker_id, speaker_name, text, emotion, source_line)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const [ordinal, line] of lines.entries()) {
        insert.run(projectId, path, ordinal, line.id, line.speakerId, line.speakerName, line.text, line.emotion ?? null, line.line);
      }
      db.prepare(`
        INSERT INTO story_scene_index(project_id, path, revision, file_fingerprint, node_id, chapter, summary, dialogue_count, diagnostics_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(project_id, path) DO UPDATE SET
          revision=excluded.revision, file_fingerprint=excluded.file_fingerprint, node_id=excluded.node_id,
          chapter=excluded.chapter, summary=excluded.summary, dialogue_count=excluded.dialogue_count,
          diagnostics_json=excluded.diagnostics_json
      `).run(projectId, path, revision, fingerprint, storyNodeId(path, fields), fields.chapter ?? "", narrative.summary.slice(0, 240), lines.length, jsonStringify(diagnostics));
      db.exec("RELEASE SAVEPOINT story_scene_index_update");
    } catch (error) {
      db.exec("ROLLBACK TO SAVEPOINT story_scene_index_update");
      db.exec("RELEASE SAVEPOINT story_scene_index_update");
      throw error;
    }
  }
  deleteStorySceneIndex(projectId, path) {
    const db = this.getDatabase();
    db.prepare("DELETE FROM story_dialogue_lines WHERE project_id = ? AND path = ?").run(projectId, path);
    db.prepare("DELETE FROM story_scene_index WHERE project_id = ? AND path = ?").run(projectId, path);
  }
  markDocumentDeleted(projectId, path) {
    const db = this.getDatabase();
    db.prepare("UPDATE documents SET deleted = 1, updated_at = ? WHERE project_id = ? AND path = ?").run(nowIso(), projectId, path);
    this.deleteStorySceneIndex(projectId, path);
  }
  async indexCardFile(state, path) {
    if (!state.root)
      return;
    const absolute = await this.safeExistingPath(state, path);
    if (!absolute) {
      this.markCardsDeletedByPath(state.input.id, path);
      return;
    }
    let parsed;
    let sourceRevision;
    try {
      const sourceText = await readFile8(absolute, "utf8");
      sourceRevision = hashBytes(sourceText);
      parsed = JSON.parse(sourceText);
    } catch (error) {
      state.errors.push(`${path}: invalid JSON: ${toErrorMessage(error)}`);
      this.markCardsDeletedByPath(state.input.id, path);
      return;
    }
    const rootRecord = asRecord(parsed);
    if (!rootRecord) {
      state.errors.push(`${path}: card collection must be an object.`);
      return;
    }
    const collections = Object.entries(rootRecord).filter(([, value]) => Array.isArray(value));
    const fileStat = await stat4(absolute);
    const seen = new Set;
    for (const [collection, values] of collections) {
      for (const value of values) {
        try {
          validateCard(value);
        } catch (error) {
          state.errors.push(`${path} ${collection}: ${toErrorMessage(error)}`);
          continue;
        }
        const card = value;
        const id = String(card.id);
        seen.add(id);
        const cardJson = jsonStringify(card);
        const rarity = typeof card.rarity === "string" ? card.rarity : "";
        const labels = Array.isArray(card.labels) ? card.labels.filter((label) => typeof label === "string") : [];
        const revision = hashBytes(cardJson);
        const existing = this.getDatabase().prepare("SELECT revision FROM cards WHERE project_id = ? AND id = ?").get(state.input.id, id);
        this.getDatabase().prepare(`
          INSERT INTO cards(project_id, id, path, collection, kind, rarity, labels_json, name, description, json, source_revision, revision, mtime_ms, deleted, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
          ON CONFLICT(project_id, id) DO UPDATE SET
            path=excluded.path, collection=excluded.collection, kind=excluded.kind,
            rarity=excluded.rarity, labels_json=excluded.labels_json,
            name=excluded.name, description=excluded.description, json=excluded.json,
            source_revision=excluded.source_revision, revision=excluded.revision, mtime_ms=excluded.mtime_ms, deleted=0, updated_at=excluded.updated_at
        `).run(state.input.id, id, path, collection, String(card.kind), rarity, jsonStringify(labels), String(card.name), typeof card.description === "string" ? card.description : "", cardJson, sourceRevision, revision, fileStat.mtimeMs, nowIso());
        if (!existing || existing.revision !== revision) {
          this.getDatabase().prepare("INSERT OR IGNORE INTO card_revisions(project_id, card_id, revision, json, created_at) VALUES (?, ?, ?, ?, ?)").run(state.input.id, id, revision, cardJson, nowIso());
        }
      }
    }
    const db = this.getDatabase();
    const stale = db.prepare("SELECT id FROM cards WHERE project_id = ? AND path = ? AND deleted = 0").all(state.input.id, path);
    for (const row of stale)
      if (!seen.has(row.id))
        db.prepare("UPDATE cards SET deleted = 1 WHERE project_id = ? AND id = ?").run(state.input.id, row.id);
  }
  markCardsDeletedByPath(projectId, path) {
    this.getDatabase().prepare("UPDATE cards SET deleted = 1 WHERE project_id = ? AND path = ?").run(projectId, path);
  }
  async indexAssetFile(state, path) {
    if (!state.root)
      return;
    const manifest = this.manifestCache.get(state.input.id);
    const manifestEntry = manifest?.entriesByFilePath.get(path);
    if (manifestEntry?.currentPath && path !== manifestEntry.currentPath)
      return;
    const absolute = await this.safeExistingPath(state, path);
    if (!absolute) {
      this.getDatabase().prepare("UPDATE assets SET deleted = 1 WHERE project_id = ? AND path = ?").run(state.input.id, path);
      return;
    }
    const fileStat = await stat4(absolute);
    if (!fileStat.isFile())
      return;
    const revision = await hashFile(absolute);
    const isJsonAsset = extname2(path).toLowerCase() === ".json";
    const jsonBytes = isJsonAsset ? await readFile8(absolute) : undefined;
    let spriteInfo = {};
    if (extname2(path).toLowerCase() !== ".json") {
      for (const metadataPath of candidateSpriteMetadataPath(absolute)) {
        try {
          const metadata = JSON.parse(await readFile8(metadataPath, "utf8"));
          spriteInfo = parseSpriteMetadata(metadata);
          if (spriteInfo.frameCount)
            break;
        } catch {}
      }
    } else if (jsonBytes) {
      try {
        spriteInfo = parseSpriteMetadata(JSON.parse(jsonBytes.toString()));
      } catch {}
    }
    const inspection = await inspectMediaFile(absolute, spriteInfo.frameCount ? spriteInfo : undefined);
    if (spriteInfo.frameCount && inspection.kind !== "spritesheet")
      inspection.kind = "spritesheet";
    const assetPath = manifestEntry?.path ?? path;
    const existing = manifestEntry?.id ? this.getDatabase().prepare("SELECT * FROM assets WHERE project_id = ? AND id = ?").get(state.input.id, manifestEntry.id) : this.getDatabase().prepare("SELECT * FROM assets WHERE project_id = ? AND path = ?").get(state.input.id, assetPath);
    const id = existing?.id ?? manifestEntry?.id ?? stableId("asset", state.input.id, assetPath);
    const manifestCurrent = manifestEntry?.versions?.find((version) => version.id === manifestEntry.currentVersionId);
    const versionId = manifestCurrent?.revision === revision && manifestEntry?.currentVersionId ? manifestEntry.currentVersionId : `version:${state.input.id}:${hashBytes(`${id}:${revision}`)}`;
    const existingMetadata = existing ? parseJson(existing.metadata_json, {}) : {};
    const manifestMetadata = manifestEntry?.metadata ?? {};
    const name = existing?.name?.trim() || manifestEntry?.name || "";
    const tags = existing?.tags_json ? parseJson(existing.tags_json, []).filter((tag) => typeof tag === "string") : manifestEntry?.tags ?? [];
    const metadata = {
      ...inspection.metadata ?? {},
      ...spriteInfo.metadata ?? {},
      ...manifestMetadata,
      ...existingMetadata,
      ...name ? { name } : {},
      ...tags.length > 0 ? { tags } : {}
    };
    const metadataJson = jsonStringify(metadata);
    const metadataRevision = hashBytes(metadataJson);
    const unchanged = existing != null && existing.revision === revision && existing.metadata_revision === metadataRevision && existing.path === assetPath && existing.current_version_id === versionId;
    const updatedAt = unchanged ? existing.updated_at : nowIso();
    const db = this.getDatabase();
    db.prepare(`
      INSERT INTO assets(project_id, id, path, kind, mime_type, name, tags_json, metadata_revision, revision, size, width, height, duration_ms, frame_count, metadata_json, current_version_id, deleted, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
      ON CONFLICT(project_id, id) DO UPDATE SET
        path=excluded.path, kind=excluded.kind, mime_type=excluded.mime_type, revision=excluded.revision,
        size=excluded.size, width=excluded.width, height=excluded.height, duration_ms=excluded.duration_ms,
        frame_count=excluded.frame_count, metadata_json=excluded.metadata_json, metadata_revision=excluded.metadata_revision,
        name=excluded.name, tags_json=excluded.tags_json, current_version_id=excluded.current_version_id,
        deleted=0, updated_at=excluded.updated_at
    `).run(state.input.id, id, assetPath, inspection.kind, inspection.mimeType, name, jsonStringify(tags), metadataRevision, revision, inspection.size, inspection.width ?? null, inspection.height ?? null, inspection.durationMs ?? null, inspection.frameCount ?? null, metadataJson, versionId, updatedAt);
    db.prepare(`
      INSERT INTO asset_versions(project_id, id, asset_id, path, revision, mime_type, size, width, height, duration_ms, frame_count, source, candidate_id, metadata_json, created_at, adopted)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, ?)
      ON CONFLICT(project_id, id) DO NOTHING
    `).run(state.input.id, versionId, id, path, revision, inspection.mimeType, inspection.size, inspection.width ?? null, inspection.height ?? null, inspection.durationMs ?? null, inspection.frameCount ?? null, manifestCurrent?.id === versionId ? "adopted" : "project", metadataJson, updatedAt, manifestCurrent?.id === versionId ? 1 : 0);
    for (const historic of manifestEntry?.versions ?? []) {
      if (historic.id === versionId)
        continue;
      db.prepare(`
        INSERT OR IGNORE INTO asset_versions(project_id, id, asset_id, path, revision, mime_type, size, width, height, duration_ms, frame_count, source, candidate_id, metadata_json, created_at, adopted)
        VALUES (?, ?, ?, ?, ?, ?, 0, NULL, NULL, NULL, NULL, 'adopted', NULL, ?, ?, 1)
      `).run(state.input.id, historic.id, id, historic.path, historic.revision ?? historic.id, historic.mimeType ?? inspection.mimeType, jsonStringify(historic.metadata ?? {}), updatedAt);
    }
  }
  rebuildAllLinks(projectId) {
    const db = this.getDatabase();
    db.prepare("DELETE FROM document_links WHERE project_id = ?").run(projectId);
    const documents = db.prepare("SELECT * FROM documents WHERE project_id = ? AND deleted = 0").all(projectId);
    for (const document of documents)
      this.rebuildLinksForDocument(projectId, document);
  }
  rebuildLinksForDocument(projectId, document) {
    const db = this.getDatabase();
    db.exec("SAVEPOINT document_links_update");
    try {
      db.prepare("DELETE FROM document_links WHERE project_id = ? AND source_id = ?").run(projectId, document.id);
      const content = document.content ?? "";
      const matches = parseMarkdownLinks(content);
      const insert = db.prepare("INSERT INTO document_links(project_id, source_id, target_path, target_kind, target_id, anchor, label, line, raw_target) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
      for (const match of matches) {
        const target = linkTargetForSource(document.path, match.target);
        const parsed = parseMarkdownTarget(match.target.replace(/^<|>$/gu, ""));
        if (!parsed.local) {
          insert.run(projectId, document.id, target.path, "external", null, null, match.label, content.slice(0, match.index).split(`
`).length, match.target);
          continue;
        }
        const normalizedTarget = this.resolveKnownTarget(projectId, target.path, target.targetPath);
        const targetPath = normalizedTarget.path;
        const targetDoc = db.prepare("SELECT id FROM documents WHERE project_id = ? AND path = ? AND deleted = 0").get(projectId, targetPath);
        const targetAsset = db.prepare("SELECT id FROM assets WHERE project_id = ? AND path = ? AND deleted = 0").get(projectId, targetPath);
        const cardFile = db.prepare("SELECT 1 FROM cards WHERE project_id = ? AND path = ? AND deleted = 0 LIMIT 1").get(projectId, targetPath);
        const targetCard = parsed.anchor ? db.prepare("SELECT id FROM cards WHERE project_id = ? AND path = ? AND id = ? AND deleted = 0").get(projectId, targetPath, parsed.anchor) : undefined;
        const extension = extname2(targetPath).toLowerCase();
        const targetKind = targetDoc?.id ? "document" : targetAsset?.id ? "asset" : cardFile ? "card" : extension === ".md" || extension === ".markdown" ? "document" : "unknown";
        insert.run(projectId, document.id, targetPath, targetKind, targetDoc?.id ?? targetAsset?.id ?? targetCard?.id ?? null, parsed.anchor ?? null, match.label, content.slice(0, match.index).split(`
`).length, match.target);
      }
      db.exec("RELEASE SAVEPOINT document_links_update");
    } catch (error) {
      db.exec("ROLLBACK TO SAVEPOINT document_links_update");
      db.exec("RELEASE SAVEPOINT document_links_update");
      throw error;
    }
  }
  resolveKnownTarget(projectId, path, rawPath) {
    const db = this.getDatabase();
    if (!extname2(path)) {
      const markdown = `${path}.md`;
      const found = db.prepare("SELECT 1 FROM documents WHERE project_id = ? AND path = ? AND deleted = 0").get(projectId, markdown);
      if (found)
        return { path: markdown };
    }
    return { path: path || rawPath };
  }
  async safeExistingPath(state, path) {
    if (!state.root)
      return;
    const lexical = resolve3(state.root, ...normalizeRelativePath(path).split("/"));
    if (!isContained(state.root, lexical))
      throw new ContentServiceError("PATH_ESCAPE", `path escapes project root: ${path}`);
    try {
      const info = await lstat4(lexical);
      if (info.isSymbolicLink())
        return;
      const resolved = await realpath6(lexical);
      return isContained(state.root, resolved) ? resolved : undefined;
    } catch {
      return;
    }
  }
  startWatcher(state) {
    if (!state.root || this.closed)
      return;
    const directories = ["", ...state.watchDirectories];
    for (const directory of directories)
      this.watchDirectory(state, directory);
  }
  watchDirectory(state, relativeDirectory) {
    if (!state.root || this.closed || state.watchedDirectories.has(relativeDirectory))
      return;
    const normalized = relativeDirectory ? normalizeRelativePath(relativeDirectory, "watch directory") : "";
    const absolute = normalized ? resolve3(state.root, ...normalized.split("/")) : state.root;
    if (!isContained(state.root, absolute))
      return;
    try {
      const watcher = watch2(absolute, { recursive: false }, (_event, filename) => {
        if (!filename || this.closed)
          return;
        const name = toPosixPath(String(filename));
        if (!name || name === "." || name === "..")
          return;
        const relativePath = normalized ? `${normalized}/${name}` : name;
        if (this.isIgnoredPath(relativePath))
          return;
        const previous = state.pendingEvents.get(relativePath);
        if (previous)
          clearTimeout(previous);
        const timer = setTimeout(() => {
          state.pendingEvents.delete(relativePath);
          this.enqueue(() => this.reindexChangedPath(state, relativePath));
        }, 80);
        state.pendingEvents.set(relativePath, timer);
      });
      state.watchers.push(watcher);
      state.watchedDirectories.add(normalized);
      watcher.on("error", (error) => {
        state.errors.push(`watcher ${normalized || "."}: ${toErrorMessage(error)}`);
      });
    } catch (error) {
      state.errors.push(`watcher unavailable ${normalized || "."}: ${toErrorMessage(error)}`);
    }
  }
  isIgnoredPath(path) {
    return path.split("/").some((part) => IGNORED_DIRECTORY_NAMES.has(part));
  }
  async reindexChangedPath(state, relativePath) {
    if (!state.root || this.closed)
      return;
    const path = normalizeRelativePath(relativePath);
    const existing = await this.safeExistingPath(state, path);
    if (existing) {
      const info = await lstat4(existing);
      if (info.isDirectory()) {
        const previouslyWatched = state.watchedDirectories.has(path);
        const hasIndexedContent = await this.indexChangedDirectory(state, path);
        if (previouslyWatched || hasIndexedContent) {
          this.rebuildAllLinks(state.input.id);
          this.queueStoryRebuilds(state.input.id, [path]);
        }
        this.notify({
          projectId: state.input.id,
          paths: [path],
          kinds: previouslyWatched || hasIndexedContent ? ["document", "directory", "card", "asset", "status"] : ["directory", "status"],
          reason: "index"
        });
        return;
      }
    } else if (!extname2(path)) {
      this.markDeletedSubtree(state.input.id, path);
      this.rebuildAllLinks(state.input.id);
      this.notify({ projectId: state.input.id, paths: [path], kinds: ["document", "directory", "card", "asset", "status"], reason: "index" });
      this.queueStoryRebuilds(state.input.id, [path]);
      return;
    }
    if (path === `${ASSET_DIRECTORY}/${MANIFEST_FILE_NAME}`) {
      this.manifestCache.delete(state.input.id);
      await this.loadManifest(state.input.id);
      this.notify({ projectId: state.input.id, paths: [path], kinds: ["asset", "status"], reason: "index" });
      return;
    }
    if (/\.(?:md|markdown)$/iu.test(path)) {
      const document = await this.indexDocumentFile(state, path);
      if (document)
        this.rebuildLinksForDocument(state.input.id, document);
      else
        this.rebuildAllLinks(state.input.id);
      this.notify({ projectId: state.input.id, paths: [path], kinds: ["document", "status"], reason: "index" });
      this.queueStoryRebuilds(state.input.id, [path]);
      return;
    }
    if (path.startsWith(`${CARD_DIRECTORY}/`) && extname2(path).toLowerCase() === ".json") {
      await this.indexCardFile(state, path);
      this.notify({ projectId: state.input.id, paths: [path], kinds: ["card", "status"], reason: "index" });
      return;
    }
    if (path.startsWith(`${ASSET_DIRECTORY}/`)) {
      await this.indexAssetFile(state, path);
      this.rebuildAllLinks(state.input.id);
      this.notify({ projectId: state.input.id, paths: [path], kinds: ["asset", "status"], reason: "index" });
    }
  }
  async indexChangedDirectory(state, relativeDirectory) {
    if (!state.root)
      return false;
    const absolute = await this.safeExistingPath(state, relativeDirectory);
    if (!absolute)
      return false;
    this.watchDirectory(state, relativeDirectory);
    const db = this.getDatabase();
    db.prepare(`
      INSERT INTO directories(project_id, path, revision, deleted)
      VALUES (?, ?, ?, 0)
      ON CONFLICT(project_id, path) DO UPDATE SET revision=excluded.revision, deleted=0
    `).run(state.input.id, relativeDirectory, hashBytes(relativeDirectory));
    let entries;
    try {
      entries = await readdir3(absolute, { withFileTypes: true });
    } catch {
      return false;
    }
    let hasIndexedContent = false;
    for (const entry of entries) {
      if (entry.name === "." || entry.name === ".." || IGNORED_DIRECTORY_NAMES.has(entry.name) || entry.isSymbolicLink())
        continue;
      const child = `${relativeDirectory}/${entry.name}`;
      if (entry.isDirectory()) {
        hasIndexedContent = await this.indexChangedDirectory(state, child) || hasIndexedContent;
        continue;
      }
      if (!entry.isFile())
        continue;
      const normalized = toPosixPath(child);
      if (/\.(?:md|markdown)$/iu.test(normalized)) {
        await this.indexDocumentFile(state, normalized);
        hasIndexedContent = true;
      } else if (normalized.startsWith(`${CARD_DIRECTORY}/`) && extname2(normalized).toLowerCase() === ".json") {
        await this.indexCardFile(state, normalized);
        hasIndexedContent = true;
      } else if (normalized.startsWith(`${ASSET_DIRECTORY}/`) && normalized !== `${ASSET_DIRECTORY}/${MANIFEST_FILE_NAME}`) {
        await this.indexAssetFile(state, normalized);
        hasIndexedContent = true;
      }
    }
    return hasIndexedContent;
  }
  markDeletedSubtree(projectId, path) {
    const db = this.getDatabase();
    const prefix = `${path}/%`;
    db.prepare("UPDATE documents SET deleted = 1 WHERE project_id = ? AND (path = ? OR path LIKE ?)").run(projectId, path, prefix);
    db.prepare("DELETE FROM story_dialogue_lines WHERE project_id = ? AND (path = ? OR path LIKE ?)").run(projectId, path, prefix);
    db.prepare("DELETE FROM story_scene_index WHERE project_id = ? AND (path = ? OR path LIKE ?)").run(projectId, path, prefix);
    db.prepare("UPDATE directories SET deleted = 1 WHERE project_id = ? AND (path = ? OR path LIKE ?)").run(projectId, path, prefix);
    db.prepare("UPDATE cards SET deleted = 1 WHERE project_id = ? AND (path = ? OR path LIKE ?)").run(projectId, path, prefix);
    db.prepare("UPDATE assets SET deleted = 1 WHERE project_id = ? AND (path = ? OR path LIKE ?)").run(projectId, path, prefix);
  }
  documentLinks(projectId, documentId) {
    const rows = this.getDatabase().prepare("SELECT target_path, target_kind, target_id, anchor, label, line, raw_target FROM document_links WHERE project_id = ? AND source_id = ? ORDER BY line, rowid").all(projectId, documentId);
    return rows.map((row) => ({
      targetPath: row.target_path,
      targetKind: row.target_kind,
      ...row.target_id ? { targetId: row.target_id } : {},
      ...row.anchor ? { anchor: row.anchor } : {},
      ...row.label ? { label: row.label } : {},
      line: row.line,
      rawTarget: row.raw_target
    }));
  }
  page(items, cursor, limit) {
    const after = decodeCursor(cursor);
    const filtered = after === undefined ? items : items.filter((item) => item.path > after);
    const pageLimit = clampLimit(limit);
    const pageItems = filtered.slice(0, pageLimit);
    return {
      items: pageItems,
      ...filtered.length > pageItems.length && pageItems.length > 0 ? { nextCursor: encodeCursor(pageItems[pageItems.length - 1].path) } : {},
      total: items.length
    };
  }
  pageSql(items, cursor, limit, total) {
    const pageLimit = clampLimit(limit);
    const hasMore = items.length > pageLimit;
    const pageItems = items.slice(0, pageLimit);
    return {
      items: pageItems,
      ...hasMore && pageItems.length > 0 ? { nextCursor: encodeCursor(pageItems[pageItems.length - 1].path) } : {},
      total
    };
  }
  pageSqlKey(items, limit, total, key) {
    const pageLimit = clampLimit(limit);
    const hasMore = items.length > pageLimit;
    const pageItems = items.slice(0, pageLimit);
    return {
      items: pageItems,
      ...hasMore && pageItems.length > 0 ? { nextCursor: encodeCursor(key(pageItems[pageItems.length - 1])) } : {},
      total
    };
  }
  async queryDocuments(input) {
    const directory = input.directory ? normalizeRelativePath(input.directory, "directory") : undefined;
    const after = decodeCursor(input.cursor);
    const clauses = ["project_id = ?", "deleted = 0"];
    const parameters = [input.projectId];
    if (directory) {
      clauses.push("(path = ? OR path LIKE ?)");
      parameters.push(directory, `${directory}/%`);
    }
    addSearchSql(clauses, parameters, "search_text", input.q);
    if (after) {
      clauses.push("path > ?");
      parameters.push(after);
    }
    const where = clauses.join(" AND ");
    const db = this.getDatabase();
    const pageLimit = clampLimit(input.limit);
    const rows = db.prepare(`SELECT id, path, title, revision, size, updated_at, substr(content, 1, 360) AS content FROM documents WHERE ${where} ORDER BY path, id LIMIT ?`).all(...parameters, pageLimit + 1);
    const countParameters = [input.projectId];
    const countClauses = ["project_id = ?", "deleted = 0"];
    if (directory) {
      countClauses.push("(path = ? OR path LIKE ?)");
      countParameters.push(directory, `${directory}/%`);
    }
    addSearchSql(countClauses, countParameters, "search_text", input.q);
    const count = db.prepare(`SELECT COUNT(*) AS count FROM documents WHERE ${countClauses.join(" AND ")}`).get(...countParameters);
    const items = rows.map((row) => contentDocumentFromRow(row, this.documentLinks(input.projectId, row.id), input.q, false));
    return this.pageSql(items, input.cursor, input.limit, Number(count?.count ?? 0));
  }
  async queryDirectories(input) {
    const directory = input.directory ? normalizeRelativePath(input.directory, "directory") : undefined;
    const after = decodeCursor(input.cursor);
    const clauses = ["project_id = ?", "deleted = 0"];
    const parameters = [input.projectId];
    if (directory) {
      clauses.push("(path = ? OR path LIKE ?)");
      parameters.push(directory, `${directory}/%`);
    }
    addSearchSql(clauses, parameters, "path", input.q);
    if (after) {
      clauses.push("path > ?");
      parameters.push(after);
    }
    const db = this.getDatabase();
    const pageLimit = clampLimit(input.limit);
    const rows = db.prepare(`SELECT path, revision FROM directories WHERE ${clauses.join(" AND ")} ORDER BY path LIMIT ?`).all(...parameters, pageLimit + 1);
    const countParameters = [input.projectId];
    const countClauses = ["project_id = ?", "deleted = 0"];
    if (directory) {
      countClauses.push("(path = ? OR path LIKE ?)");
      countParameters.push(directory, `${directory}/%`);
    }
    addSearchSql(countClauses, countParameters, "path", input.q);
    const count = db.prepare(`SELECT COUNT(*) AS count FROM directories WHERE ${countClauses.join(" AND ")}`).get(...countParameters);
    const items = rows.map((row) => ({
      id: stableId("directory", input.projectId, row.path),
      title: basename(row.path),
      path: row.path,
      revision: row.revision,
      type: "directory"
    }));
    return this.pageSql(items, input.cursor, input.limit, Number(count?.count ?? 0));
  }
  resolveDocument(projectId, id, path) {
    const db = this.getDatabase();
    let row;
    if (id)
      row = db.prepare("SELECT * FROM documents WHERE project_id = ? AND id = ? AND deleted = 0").get(projectId, id);
    if (!row && path) {
      const normalized = normalizeRelativePath(path);
      row = db.prepare("SELECT * FROM documents WHERE project_id = ? AND path = ? AND deleted = 0").get(projectId, normalized);
    }
    if (!row)
      throw new ContentServiceError("NOT_FOUND", "document was not found.");
    return row;
  }
  resolveDocumentHeader(projectId, id, path) {
    const db = this.getDatabase();
    let row;
    if (id)
      row = db.prepare("SELECT id, path, title, revision, size FROM documents WHERE project_id = ? AND id = ? AND deleted = 0").get(projectId, id);
    if (!row && path)
      row = db.prepare("SELECT id, path, title, revision, size FROM documents WHERE project_id = ? AND path = ? AND deleted = 0").get(projectId, normalizeRelativePath(path));
    if (!row)
      throw new ContentServiceError("NOT_FOUND", "document was not found.");
    return row;
  }
  async queryDocument(input) {
    const row = this.resolveDocument(input.projectId, input.id, input.path);
    return contentDocumentFromRow(row, this.documentLinks(input.projectId, row.id));
  }
  async queryDocumentMeta(input) {
    const row = this.resolveDocumentHeader(input.projectId, input.id, input.path);
    const scene = this.getDatabase().prepare("SELECT revision FROM story_scene_index WHERE project_id = ? AND path = ?").get(input.projectId, row.path);
    return { ...row, isScene: scene?.revision === row.revision };
  }
  async queryBacklinks(input) {
    let targetPath = input.path ? normalizeRelativePath(input.path) : undefined;
    if (input.id) {
      const target = this.resolveDocument(input.projectId, input.id);
      targetPath = target.path;
    }
    if (!targetPath)
      throw new ContentServiceError("INVALID_INPUT", "backlinks requires id or path.");
    const after = decodeCursor(input.cursor);
    const pageLimit = clampLimit(input.limit);
    let afterLink;
    if (after !== undefined) {
      try {
        const parsed = JSON.parse(after);
        if (!Array.isArray(parsed) || parsed.length !== 3 || typeof parsed[0] !== "string" || !Number.isSafeInteger(parsed[1]) || !Number.isSafeInteger(parsed[2]))
          throw Error();
        afterLink = parsed;
      } catch {
        throw new ContentServiceError("INVALID_INPUT", "backlink cursor is malformed.");
      }
    }
    const cursorClause = afterLink ? "AND (d.path > ? OR (d.path = ? AND (l.line > ? OR (l.line = ? AND l.rowid > ?))))" : "";
    const rowsParameters = [input.projectId, targetPath];
    if (afterLink)
      rowsParameters.push(afterLink[0], afterLink[0], afterLink[1], afterLink[1], afterLink[2]);
    const rows = this.getDatabase().prepare(`
      SELECT l.rowid AS link_rowid, l.*, d.path AS source_path, d.title AS source_title, d.revision AS source_revision, d.content AS source_content
      FROM document_links l JOIN documents d ON d.project_id = l.project_id AND d.id = l.source_id
      WHERE l.project_id = ? AND l.target_path = ? AND d.deleted = 0
        ${cursorClause}
      ORDER BY d.path, l.line, l.rowid
      LIMIT ?
    `).all(...rowsParameters, pageLimit + 1);
    const items = rows.map((row) => ({
      id: `${row.source_id}:${row.link_rowid}`,
      title: row.source_title,
      path: row.source_path,
      revision: row.source_revision,
      type: "backlink",
      sourceId: row.source_id,
      sourcePath: row.source_path,
      targetPath: row.target_path,
      line: row.line,
      ...row.label ? { label: row.label } : {},
      ...row.anchor ? { anchor: row.anchor } : {},
      snippet: row.source_content.split(`
`).slice(Math.max(0, row.line - 2), row.line + 1).join(" ").slice(0, 220)
    }));
    const count = this.getDatabase().prepare(`SELECT COUNT(*) AS count FROM document_links l JOIN documents d ON d.project_id = l.project_id AND d.id = l.source_id WHERE l.project_id = ? AND l.target_path = ? AND d.deleted = 0`).get(input.projectId, targetPath);
    const page = this.pageSqlKey(rows, input.limit, Number(count?.count ?? 0), (row) => JSON.stringify([row.source_path, row.line, row.link_rowid]));
    return { ...page, items: items.slice(0, pageLimit) };
  }
  async queryGraph(input) {
    const root = this.resolveDocument(input.projectId, input.id, input.path);
    const depthLimit = Math.max(0, Math.min(4, Math.floor(input.depth ?? 2)));
    const maxNodes = Math.max(1, Math.min(200, Math.floor(input.maxNodes ?? 100)));
    const maxEdges = Math.min(800, Math.max(8, maxNodes * 8));
    const db = this.getDatabase();
    const nodes = new Map;
    const edges = [];
    const queue = [{ id: root.id, path: root.path, depth: 0 }];
    let truncated = false;
    while (queue.length > 0) {
      const current = queue.shift();
      if (nodes.has(current.id))
        continue;
      if (nodes.size >= maxNodes) {
        truncated = true;
        break;
      }
      const doc = db.prepare("SELECT id, path, title, revision FROM documents WHERE project_id = ? AND id = ? AND deleted = 0").get(input.projectId, current.id);
      const asset = db.prepare("SELECT * FROM assets WHERE project_id = ? AND id = ? AND deleted = 0").get(input.projectId, current.id);
      if (doc) {
        nodes.set(doc.id, { id: doc.id, title: doc.title, path: doc.path, revision: doc.revision, type: "document", depth: current.depth });
      } else if (asset) {
        nodes.set(asset.id, { id: asset.id, title: basename(asset.path), path: asset.path, revision: asset.revision, type: "asset", depth: current.depth });
      } else {
        continue;
      }
      if (current.depth >= depthLimit || !doc)
        continue;
      const links = db.prepare("SELECT target_path, target_kind, target_id, anchor FROM document_links WHERE project_id = ? AND source_id = ? ORDER BY rowid LIMIT ?").all(input.projectId, doc.id, maxEdges);
      for (const link of links) {
        if (edges.length >= maxEdges) {
          truncated = true;
          break;
        }
        edges.push({ sourceId: doc.id, sourcePath: doc.path, targetPath: link.target_path, kind: link.target_kind, ...link.target_id ? { targetId: link.target_id } : {}, ...link.anchor ? { anchor: link.anchor } : {} });
        if (link.target_id && (link.target_kind === "document" || link.target_kind === "asset")) {
          queue.push({ id: link.target_id, path: link.target_path, depth: current.depth + 1 });
        }
      }
    }
    return { nodes: [...nodes.values()], edges, truncated };
  }
  async queryMovePreview(input) {
    const source = this.resolveDocument(input.projectId, input.id, input.path);
    const toPath = normalizeRelativePath(input.toPath, "toPath");
    const db = this.getDatabase();
    const destination = db.prepare("SELECT id FROM documents WHERE project_id = ? AND path = ? AND deleted = 0").get(input.projectId, toPath);
    const conflicts = [];
    if (destination && destination.id !== source.id)
      conflicts.push(`destination already exists: ${toPath}`);
    const affected = [];
    const incoming = db.prepare("SELECT DISTINCT source_id FROM document_links WHERE project_id = ? AND target_path = ?").all(input.projectId, source.path);
    const affectedIds = new Set([source.id, ...incoming.map((row) => row.source_id)]);
    const allDocuments = [...affectedIds].map((id) => db.prepare("SELECT * FROM documents WHERE project_id = ? AND id = ? AND deleted = 0").get(input.projectId, id)).filter((document) => Boolean(document));
    for (const document of allDocuments) {
      const rewrite = document.id === source.id ? this.rewriteMovedDocumentOutboundLinks(document.content ?? "", source.path, toPath) : this.rewriteDocumentLinks(document.content ?? "", document.path, source.path, toPath);
      if (rewrite.changed)
        affected.push({ id: document.id, path: document.path, revision: document.revision, changed: true, changedLinks: rewrite.changedLinks });
    }
    affected.unshift({ id: source.id, path: source.path, revision: source.revision, changed: true, changedLinks: affected.find((item) => item.id === source.id)?.changedLinks ?? 0 });
    return {
      source: contentDocumentFromRow(source, this.documentLinks(input.projectId, source.id)),
      toPath,
      affected: affected.filter((item, index, list) => list.findIndex((candidate) => candidate.id === item.id) === index),
      conflicts,
      canApply: conflicts.length === 0
    };
  }
  async queryCards(input) {
    const after = decodeCursor(input.cursor);
    const clauses = ["project_id = ?", "deleted = 0"];
    const parameters = [input.projectId];
    addCardFilterSql(clauses, parameters, input);
    addSearchSql(clauses, parameters, "(id || char(10) || path || char(10) || name || char(10) || kind || char(10) || description || char(10) || rarity || char(10) || labels_json)", input.q);
    if (after) {
      const [afterPath, afterId = ""] = after.split("|");
      clauses.push("(path > ? OR (path = ? AND id > ?))");
      parameters.push(afterPath, afterPath, afterId);
    }
    const db = this.getDatabase();
    const pageLimit = clampLimit(input.limit);
    const rows = db.prepare(`SELECT id, path, collection, kind, rarity, labels_json, name, description, revision,
      CASE WHEN json_type(json, '$.attack') IN ('integer', 'real') THEN json_extract(json, '$.attack') END AS attack,
      CASE WHEN json_type(json, '$.health') IN ('integer', 'real') THEN json_extract(json, '$.health') END AS health,
      json_extract(json, '$.cardFace.variants.' || json_extract(json, '$.cardFace.themeId') || '.preview') AS face_preview
      FROM cards WHERE ${clauses.join(" AND ")} ORDER BY path, id LIMIT ?`).all(...parameters, pageLimit + 1);
    const countParameters = [input.projectId];
    const countClauses = ["project_id = ?", "deleted = 0"];
    addCardFilterSql(countClauses, countParameters, input);
    addSearchSql(countClauses, countParameters, "(id || char(10) || path || char(10) || name || char(10) || kind || char(10) || description || char(10) || rarity || char(10) || labels_json)", input.q);
    const count = db.prepare(`SELECT COUNT(*) AS count FROM cards WHERE ${countClauses.join(" AND ")}`).get(...countParameters);
    const items = rows.map(cardFromRow);
    return this.pageSqlKey(items, input.limit, Number(count?.count ?? 0), (item) => `${item.path}|${item.id}`);
  }
  async queryCard(input) {
    if (input.freshKind)
      await this.enqueue(() => this.indexCardFile(this.project(input.projectId), cardCollection(input.freshKind).path));
    const id = ensureString(input.id, "card id");
    const row = this.getDatabase().prepare("SELECT * FROM cards WHERE project_id = ? AND id = ? AND deleted = 0").get(input.projectId, id);
    if (!row)
      throw new ContentServiceError("NOT_FOUND", `card was not found: ${id}`);
    return cardFromRow(row);
  }
  async queryAssets(input) {
    if (input.status === "candidate")
      return this.queryCandidateAssets(input);
    if (input.status && input.status !== "ready")
      return { items: [], total: 0 };
    const after = decodeCursor(input.cursor);
    const clauses = ["project_id = ?", "deleted = 0"];
    const parameters = [input.projectId];
    addAssetFilterSql(clauses, parameters, input);
    addSearchSql(clauses, parameters, "(path || char(10) || name || char(10) || tags_json || char(10) || kind || char(10) || mime_type || char(10) || metadata_json)", input.q);
    if (after) {
      clauses.push("path > ?");
      parameters.push(after);
    }
    const db = this.getDatabase();
    const pageLimit = clampLimit(input.limit);
    const rows = db.prepare(`SELECT project_id, id, path, kind, mime_type, name, tags_json, metadata_revision, revision, size, width, height, duration_ms, frame_count, metadata_json, current_version_id, deleted, updated_at FROM assets WHERE ${clauses.join(" AND ")} ORDER BY path, id LIMIT ?`).all(...parameters, pageLimit + 1);
    const countParameters = [input.projectId];
    const countClauses = ["project_id = ?", "deleted = 0"];
    addAssetFilterSql(countClauses, countParameters, input);
    addSearchSql(countClauses, countParameters, "(path || char(10) || name || char(10) || tags_json || char(10) || kind || char(10) || mime_type || char(10) || metadata_json)", input.q);
    const count = db.prepare(`SELECT COUNT(*) AS count FROM assets WHERE ${countClauses.join(" AND ")}`).get(...countParameters);
    const items = rows.map((row) => assetFromRow(row));
    return this.pageSql(items, input.cursor, input.limit, Number(count?.count ?? 0));
  }
  async queryCandidateAssets(input) {
    const after = decodeCursor(input.cursor);
    const clauses = ["project_id = ?"];
    const parameters = [input.projectId];
    addAssetScopeSql(clauses, input.assetScope, "json_extract(metadata_json, '$.kind')");
    if (typeof input.kind === "string" && input.kind.trim()) {
      const kind = input.kind.trim().toLowerCase();
      clauses.push("(lower(mime_type) LIKE ? ESCAPE '\\' OR lower(metadata_json) LIKE ? ESCAPE '\\')");
      parameters.push(`${escapeLikeTerm(kind)}/%`, `%"kind":"${escapeLikeTerm(kind)}"%`);
    }
    if (typeof input.mimeType === "string" && input.mimeType.trim()) {
      clauses.push("lower(mime_type) = lower(?)");
      parameters.push(input.mimeType.trim());
    }
    if (typeof input.format === "string" && input.format.trim()) {
      const format = input.format.trim().replace(/^\.+/u, "").toLowerCase();
      if (format) {
        clauses.push("lower(file_path) LIKE ? ESCAPE '\\'");
        parameters.push(`%.${escapeLikeTerm(format)}`);
      }
    }
    for (const [value, expression, field] of [
      [input.minWidth, "CAST(json_extract(metadata_json, '$.width') AS REAL) >= ?", "width"],
      [input.maxWidth, "CAST(json_extract(metadata_json, '$.width') AS REAL) <= ?", "width"],
      [input.minDurationMs, "CAST(json_extract(metadata_json, '$.durationMs') AS REAL) >= ?", "durationMs"],
      [input.maxDurationMs, "CAST(json_extract(metadata_json, '$.durationMs') AS REAL) <= ?", "durationMs"]
    ]) {
      if (typeof value !== "number" || !Number.isFinite(value))
        continue;
      clauses.push(`${expression} AND json_extract(metadata_json, '$.${field}') IS NOT NULL`);
      parameters.push(value);
    }
    addSearchSql(clauses, parameters, "(id || char(10) || name || char(10) || mime_type || char(10) || file_path || char(10) || metadata_json)", input.q);
    if (after) {
      clauses.push("file_path > ?");
      parameters.push(resolve3(this.dataRoot, ...after.split("/")));
    }
    const db = this.getDatabase();
    const pageLimit = clampLimit(input.limit);
    const rows = db.prepare(`SELECT project_id, id, name, file_path, revision, mime_type, size, metadata_json, created_at FROM candidates WHERE ${clauses.join(" AND ")} ORDER BY file_path, id LIMIT ?`).all(...parameters, pageLimit + 1);
    const countParameters = parameters.slice(0, after ? -1 : undefined);
    const countClauses = clauses.slice(0, after ? -1 : undefined);
    const count = db.prepare(`SELECT COUNT(*) AS count FROM candidates WHERE ${countClauses.join(" AND ")}`).get(...countParameters);
    const items = rows.map((row) => candidateAssetFromRow(row, this.dataRoot));
    return this.pageSql(items, input.cursor, input.limit, Number(count?.count ?? 0));
  }
  async queryAsset(input) {
    let id = input.id ?? input.assetId;
    if (input.versionId !== undefined) {
      const versionId = ensureString(input.versionId, "versionId");
      const version = this.getDatabase().prepare("SELECT asset_id FROM asset_versions WHERE project_id = ? AND id = ?").get(input.projectId, versionId);
      if (!version)
        throw new ContentServiceError("NOT_FOUND", "asset version was not found in this project.");
      if (id !== undefined && id !== version.asset_id)
        throw new ContentServiceError("INVALID_INPUT", "asset and version identities do not match.");
      id = version.asset_id;
    }
    if (!id)
      throw new ContentServiceError("INVALID_INPUT", "asset query requires id or versionId.");
    const row = this.getDatabase().prepare("SELECT * FROM assets WHERE project_id = ? AND id = ? AND deleted = 0").get(input.projectId, id);
    if (!row) {
      const candidate = this.getDatabase().prepare("SELECT * FROM candidates WHERE project_id = ? AND id = ?").get(input.projectId, id);
      if (candidate)
        return candidateAssetFromRow(candidate, this.dataRoot);
      throw new ContentServiceError("NOT_FOUND", `asset was not found: ${id}`);
    }
    return assetFromRow(row);
  }
  async queryVersions(input) {
    const assetId = input.assetId ?? input.id;
    if (!assetId)
      throw new ContentServiceError("INVALID_INPUT", "versions query requires assetId.");
    const after = decodeCursor(input.cursor);
    const db = this.getDatabase();
    const pageLimit = clampLimit(input.limit);
    const cursorClause = after ? "AND (path || '|' || id) > ?" : "";
    const params = [input.projectId, assetId];
    if (after)
      params.push(after);
    const rows = db.prepare(`SELECT * FROM asset_versions WHERE project_id = ? AND asset_id = ? ${cursorClause} ORDER BY path, id LIMIT ?`).all(...params, pageLimit + 1);
    const count = db.prepare("SELECT COUNT(*) AS count FROM asset_versions WHERE project_id = ? AND asset_id = ?").get(input.projectId, assetId);
    const items = rows.map(assetVersionFromRow);
    return this.pageSqlKey(items, input.limit, Number(count?.count ?? 0), (item) => `${item.path}|${item.id}`);
  }
  async linkTargetExists(state, targetPath) {
    const candidates = extname2(targetPath) ? [targetPath] : [targetPath, `${targetPath}.md`, `${targetPath}.markdown`];
    for (const candidate of candidates) {
      try {
        if (await this.safeExistingPath(state, normalizeRelativePath(candidate)))
          return true;
      } catch {}
    }
    return false;
  }
  async queryInspection(input) {
    const requested = input.kinds === undefined ? INSPECTION_KINDS : input.kinds;
    if (!Array.isArray(requested))
      throw new ContentServiceError("INVALID_INPUT", "inspection kinds must be an array.");
    const kinds = new Set;
    for (const kind of requested) {
      if (!INSPECTION_KINDS.includes(kind))
        throw new ContentServiceError("INVALID_INPUT", `unknown inspection kind: ${String(kind)}`);
      kinds.add(kind);
    }
    const state = this.project(input.projectId);
    const db = this.getDatabase();
    const keyed = [];
    const push = (order, finding, discriminator) => {
      keyed.push({ key: `${order}|${finding.ref.path ?? ""}|${finding.ref.id ?? ""}|${discriminator}|${finding.detail}`, finding });
    };
    if (kinds.has("broken-link") || kinds.has("scene-dead-end")) {
      const scenes = new Map;
      const sceneCandidates = db.prepare("SELECT id, content FROM documents WHERE project_id = ? AND deleted = 0 AND content LIKE '%scene:%'").all(input.projectId);
      for (const row of sceneCandidates) {
        if (frontmatterHasScene(row.content))
          scenes.set(row.id, optionSectionRanges(row.content));
      }
      const links = db.prepare(`
        SELECT l.rowid AS row_id, l.source_id, l.raw_target, l.target_path, l.line, d.path AS source_path
        FROM document_links l JOIN documents d ON d.project_id = l.project_id AND d.id = l.source_id
        WHERE l.project_id = ? AND l.target_id IS NULL AND l.target_kind != 'external' AND d.deleted = 0
        ORDER BY d.path, l.line, l.rowid
      `).all(input.projectId);
      const existence = new Map;
      for (const link of links) {
        let exists = existence.get(link.target_path);
        if (exists === undefined) {
          exists = await this.linkTargetExists(state, link.target_path);
          existence.set(link.target_path, exists);
        }
        if (exists)
          continue;
        const inOptionSection = (scenes.get(link.source_id) ?? []).some((range) => link.line >= range.start && link.line <= range.end);
        if (inOptionSection) {
          if (kinds.has("scene-dead-end")) {
            push(1, {
              kind: "scene-dead-end",
              severity: "high",
              ref: { type: "document", id: link.source_id, path: link.source_path },
              detail: `unresolved option link at line ${link.line}: ${link.raw_target}`
            }, link.row_id);
          }
        } else if (kinds.has("broken-link")) {
          push(0, {
            kind: "broken-link",
            severity: "warning",
            ref: { type: "document", id: link.source_id, path: link.source_path },
            detail: `unresolved link at line ${link.line}: ${link.raw_target}`
          }, link.row_id);
        }
      }
    }
    if (kinds.has("orphan-asset")) {
      const rows = db.prepare(`
        SELECT a.id, a.path FROM assets a
        WHERE a.project_id = ? AND a.deleted = 0
          AND NOT EXISTS (SELECT 1 FROM document_links l WHERE l.project_id = a.project_id AND l.target_id = a.id)
          AND NOT EXISTS (
            SELECT 1 FROM cards c WHERE c.project_id = a.project_id AND c.deleted = 0 AND (
              c.json LIKE '%' || REPLACE(REPLACE(REPLACE(a.path, '\\', '\\\\'), '%', '\\%'), '_', '\\_') || '%' ESCAPE '\\'
              OR c.json LIKE '%' || REPLACE(REPLACE(REPLACE(a.id, '\\', '\\\\'), '%', '\\%'), '_', '\\_') || '%' ESCAPE '\\'
            )
          )
        ORDER BY a.path, a.id
      `).all(input.projectId);
      for (const row of rows) {
        push(2, {
          kind: "orphan-asset",
          severity: "info",
          ref: { type: "asset", id: row.id, path: row.path },
          detail: "asset is not referenced by any document or card."
        }, row.id);
      }
    }
    if (kinds.has("card-missing-art")) {
      const artExpression = CARD_ART_FIELDS.map((field) => `json_extract(c.json, '$.${field}')`).join(", ");
      const rows = db.prepare(`
        SELECT * FROM (
          SELECT c.id AS card_id, c.path AS card_path, c.name AS card_name, COALESCE(${artExpression}) AS art
          FROM cards c WHERE c.project_id = ? AND c.deleted = 0
        )
        WHERE typeof(art) = 'text' AND NOT EXISTS (
          SELECT 1 FROM assets a WHERE a.project_id = ? AND a.deleted = 0
            AND (a.id = art OR a.path = art OR a.path = '${ASSET_DIRECTORY}/' || art)
        )
        ORDER BY card_path, card_id
      `).all(input.projectId, input.projectId);
      for (const row of rows) {
        push(3, {
          kind: "card-missing-art",
          severity: "warning",
          ref: { type: "card", id: row.card_id, path: row.card_path },
          detail: `card ${row.card_name} references missing art: ${row.art}`
        }, row.card_id);
      }
    }
    if (kinds.has("asset-missing-metadata")) {
      const rows = db.prepare(`
        SELECT id, path, kind, width, height, duration_ms FROM assets
        WHERE project_id = ? AND deleted = 0 AND (
          (kind IN ('image', 'spritesheet') AND (width IS NULL OR height IS NULL))
          OR (kind = 'audio' AND duration_ms IS NULL)
        )
        ORDER BY path, id
      `).all(input.projectId);
      for (const row of rows) {
        const missing = row.kind === "audio" ? ["durationMs"] : [...row.width == null ? ["width"] : [], ...row.height == null ? ["height"] : []];
        push(4, {
          kind: "asset-missing-metadata",
          severity: "info",
          ref: { type: "asset", id: row.id, path: row.path },
          detail: `asset is missing metadata: ${missing.join(", ")}`
        }, row.id);
      }
    }
    keyed.sort((a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0);
    const after = decodeCursor(input.cursor);
    const filtered = after === undefined ? keyed : keyed.filter((item) => item.key > after);
    const pageLimit = clampLimit(input.limit);
    const pageItems = filtered.slice(0, pageLimit);
    const counts = {};
    for (const kind of kinds)
      counts[kind] = keyed.filter((item) => item.finding.kind === kind).length;
    return {
      findings: pageItems.map((item) => item.finding),
      counts,
      ...filtered.length > pageItems.length && pageItems.length > 0 ? { nextCursor: encodeCursor(pageItems[pageItems.length - 1].key) } : {}
    };
  }
  async queryRecentChanges(input) {
    let since;
    if (input.since !== undefined) {
      if (typeof input.since !== "string" || Number.isNaN(Date.parse(input.since))) {
        throw new ContentServiceError("INVALID_INPUT", "recentChanges since must be a valid timestamp.");
      }
      since = new Date(input.since).toISOString();
    }
    let after;
    const afterKey = decodeCursor(input.cursor);
    if (afterKey !== undefined) {
      const parts = afterKey.split("|");
      if (parts.length < 3)
        throw new ContentServiceError("INVALID_INPUT", "cursor is malformed.");
      after = { at: parts[0], kind: parts[1], id: parts.slice(2).join("|") };
    }
    const union = `
      SELECT 'document' AS kind, d.id AS id, d.path AS path, d.title AS name,
        CASE WHEN r.created_at = f.first_at THEN 'created' ELSE 'updated' END AS change, r.created_at AS at
      FROM document_revisions r
      JOIN (SELECT document_id, MIN(created_at) AS first_at FROM document_revisions WHERE project_id = ? GROUP BY document_id) f ON f.document_id = r.document_id
      JOIN documents d ON d.project_id = r.project_id AND d.id = r.document_id AND d.deleted = 0
      WHERE r.project_id = ?
      UNION ALL
      SELECT 'card', c.id, c.path, c.name,
        CASE WHEN r.created_at = f.first_at THEN 'created' ELSE 'updated' END, r.created_at
      FROM card_revisions r
      JOIN (SELECT card_id, MIN(created_at) AS first_at FROM card_revisions WHERE project_id = ? GROUP BY card_id) f ON f.card_id = r.card_id
      JOIN cards c ON c.project_id = r.project_id AND c.id = r.card_id AND c.deleted = 0
      WHERE r.project_id = ?
      UNION ALL
      SELECT 'asset', a.id, a.path, a.name, 'created', f.first_at
      FROM assets a
      JOIN (SELECT asset_id, MIN(created_at) AS first_at FROM asset_versions WHERE project_id = ? GROUP BY asset_id) f ON f.asset_id = a.id
      WHERE a.project_id = ? AND a.deleted = 0
      UNION ALL
      SELECT 'asset', a.id, a.path, a.name, 'updated', a.updated_at
      FROM assets a
      JOIN (SELECT asset_id, MIN(created_at) AS first_at FROM asset_versions WHERE project_id = ? GROUP BY asset_id) f ON f.asset_id = a.id
      WHERE a.project_id = ? AND a.deleted = 0 AND a.updated_at > f.first_at
      UNION ALL
      SELECT 'version', v.id, v.path, NULL, 'created', v.created_at
      FROM asset_versions v
      WHERE v.project_id = ?
    `;
    const baseParameters = Array.from({ length: 9 }, () => input.projectId);
    const filters = [];
    const filterParameters = [];
    if (since) {
      filters.push("at > ?");
      filterParameters.push(since);
    }
    if (after) {
      filters.push("(at < ? OR (at = ? AND (kind > ? OR (kind = ? AND id > ?))))");
      filterParameters.push(after.at, after.at, after.kind, after.kind, after.id);
    }
    const where = filters.length > 0 ? ` WHERE ${filters.join(" AND ")}` : "";
    const db = this.getDatabase();
    const pageLimit = clampLimit(input.limit);
    const rows = db.prepare(`SELECT * FROM (${union})${where} ORDER BY at DESC, kind ASC, id ASC LIMIT ?`).all(...baseParameters, ...filterParameters, pageLimit + 1);
    const count = db.prepare(`SELECT COUNT(*) AS count FROM (${union})${since ? " WHERE at > ?" : ""}`).get(...baseParameters, ...since ? [since] : []);
    const items = rows.map((row) => ({
      kind: row.kind,
      id: row.id,
      ...row.path ? { path: row.path } : {},
      ...row.name ? { name: row.name } : {},
      change: row.change,
      at: row.at
    }));
    return this.pageSqlKey(items, input.limit, Number(count?.count ?? 0), (item) => `${item.at}|${item.kind}|${item.id}`);
  }
  async queryMedia(input) {
    return this.resolveMediaQuery(input, input.projectId);
  }
  async resolveMediaQuery(input, projectId) {
    const db = this.getDatabase();
    let row;
    if (input.id)
      row = db.prepare("SELECT * FROM assets WHERE project_id = ? AND id = ? AND deleted = 0").get(projectId, input.id);
    if (!row && input.id) {
      const candidate = db.prepare("SELECT * FROM candidates WHERE project_id = ? AND id = ?").get(projectId, input.id);
      if (candidate)
        return this.resolveCandidateMedia(candidate, input);
    }
    if (!row && input.path) {
      const requestedPath = input.from ? linkTargetForSource(normalizeRelativePath(input.from, "from"), input.path).path : normalizeRelativePath(input.path);
      row = db.prepare("SELECT * FROM assets WHERE project_id = ? AND path = ? AND deleted = 0").get(projectId, requestedPath);
      if (!row && requestedPath.startsWith(`candidates/${projectId}/`)) {
        const candidatePath = resolve3(this.dataRoot, ...requestedPath.split("/"));
        const candidate = db.prepare("SELECT * FROM candidates WHERE project_id = ? AND file_path = ?").get(projectId, candidatePath);
        if (candidate)
          return this.resolveCandidateMedia(candidate, input);
      }
    }
    const state = this.project(projectId);
    if (!row && input.path) {
      const requestedPath = input.from ? linkTargetForSource(normalizeRelativePath(input.from, "from"), input.path).path : normalizeRelativePath(input.path);
      if (!state.root)
        throw new ContentServiceError("NOT_FOUND", "project root is unavailable.");
      const unresolved = await this.safeExistingPath(state, requestedPath);
      if (unresolved) {
        const info = await stat4(unresolved);
        if (info.isFile()) {
          return resolveMediaFile({
            root: state.root,
            absolutePath: unresolved,
            id: stableId("media", projectId, requestedPath),
            revision: await hashFile(unresolved),
            variant: input.variant,
            inlineLimit: this.inlineMediaLimit,
            cacheRoot: resolve3(this.dataRoot, "media-cache")
          });
        }
      }
    }
    if (!row)
      throw new ContentServiceError("NOT_FOUND", "media asset was not found.");
    let path = row.path;
    let versionId = row.current_version_id;
    let revision = row.revision;
    let selectedVersion;
    if (input.versionId || row.current_version_id) {
      const requestedVersionId = input.versionId ?? row.current_version_id;
      selectedVersion = db.prepare("SELECT * FROM asset_versions WHERE project_id = ? AND id = ? AND asset_id = ?").get(projectId, requestedVersionId, row.id);
    }
    if (input.versionId) {
      const version = selectedVersion;
      if (!version)
        throw new ContentServiceError("NOT_FOUND", "media version was not found.");
      path = version.path;
      versionId = version.id;
      revision = version.revision;
    } else if (selectedVersion) {
      path = selectedVersion.path;
      versionId = selectedVersion.id;
      revision = selectedVersion.revision;
    }
    if (!state.root)
      throw new ContentServiceError("NOT_FOUND", "project root is unavailable.");
    const resolvedPath = await this.safeExistingPath(state, path);
    if (!resolvedPath)
      throw new ContentServiceError("NOT_FOUND", `media file is unavailable: ${path}`);
    if (selectedVersion) {
      const actualRevision = await hashFile(resolvedPath);
      if (actualRevision !== selectedVersion.revision) {
        throw new ContentServiceError("NOT_FOUND", `media version is unavailable or has changed: ${selectedVersion.id}`, {
          expected: selectedVersion.revision,
          actual: actualRevision
        });
      }
    }
    return resolveMediaFile({
      root: state.root,
      absolutePath: resolvedPath,
      id: row.id,
      revision,
      ...versionId ? { versionId } : {},
      variant: input.variant,
      inlineLimit: this.inlineMediaLimit,
      cacheRoot: resolve3(this.dataRoot, "media-cache"),
      indexed: {
        mimeType: row.mime_type,
        kind: row.kind,
        size: row.size,
        width: row.width,
        height: row.height,
        durationMs: row.duration_ms,
        frameCount: row.frame_count,
        metadata: parseJson(row.metadata_json, {})
      }
    });
  }
  async resolveCandidateMedia(candidate, input) {
    const candidateRoot = await realpath6(this.candidateRoot(candidate.project_id)).catch(() => {
      return;
    });
    const candidateReal = await realpath6(candidate.file_path).catch(() => {
      return;
    });
    const dataRootReal = await realpath6(this.dataRoot);
    if (!candidateRoot || !candidateReal || !isContained(dataRootReal, candidateReal) || !isContained(candidateRoot, candidateReal)) {
      throw new ContentServiceError("PATH_ESCAPE", "candidate media path escapes the authorized candidate root.");
    }
    const actualRevision = await hashFile(candidateReal);
    if (actualRevision !== candidate.revision) {
      throw new ContentServiceError("NOT_FOUND", `candidate media changed: ${candidate.id}`, {
        expected: candidate.revision,
        actual: actualRevision
      });
    }
    return resolveMediaFile({
      root: dataRootReal,
      absolutePath: candidateReal,
      id: candidate.id,
      revision: candidate.revision,
      variant: input.variant,
      inlineLimit: this.inlineMediaLimit,
      cacheRoot: resolve3(this.dataRoot, "media-cache"),
      indexed: {
        mimeType: candidate.mime_type,
        size: candidate.size,
        metadata: parseJson(candidate.metadata_json, {})
      }
    });
  }
  rewriteDocumentLinks(content, sourcePath, oldPath, newPath) {
    let changedLinks = 0;
    const matches = parseMarkdownLinks(content);
    if (matches.length === 0)
      return { content, changed: false, changedLinks: 0 };
    let output = "";
    let cursor = 0;
    for (const match of matches) {
      const rawTarget = match.target.replace(/^<|>$/gu, "");
      const resolved = linkTargetForSource(sourcePath, rawTarget);
      const parsed = parseMarkdownTarget(rawTarget);
      if (!resolved.local || !sameDocumentTarget(resolved.path, parsed.targetPath, oldPath))
        continue;
      const targetWithoutAnchor = rawTarget.split("#", 1)[0]?.split("?", 1)[0] ?? rawTarget;
      const extensionless = !extname2(targetWithoutAnchor);
      const replacementPath = relativeLinkPath(sourcePath, newPath, extensionless, targetWithoutAnchor.startsWith("./"));
      const replacementTarget = `${replacementPath}${parsed.query ? `?${parsed.query}` : ""}${parsed.anchor ? `#${parsed.anchor}` : ""}`;
      const wrapped = match.target.startsWith("<") ? `<${replacementTarget}>` : replacementTarget;
      output += content.slice(cursor, match.index);
      output += `${match.prefix}${wrapped}${match.suffix}`;
      cursor = match.index + match.prefix.length + match.target.length + match.suffix.length;
      changedLinks += 1;
    }
    if (changedLinks === 0)
      return { content, changed: false, changedLinks: 0 };
    output += content.slice(cursor);
    return { content: output, changed: true, changedLinks };
  }
  rewriteMovedDocumentOutboundLinks(content, oldSourcePath, newSourcePath) {
    const matches = parseMarkdownLinks(content);
    if (matches.length === 0)
      return { content, changed: false, changedLinks: 0 };
    let output = "";
    let cursor = 0;
    let changedLinks = 0;
    for (const match of matches) {
      const rawTarget = match.target.replace(/^<|>$/gu, "");
      const parsed = parseMarkdownTarget(rawTarget);
      if (!parsed.local || rawTarget.startsWith("#") || rawTarget.startsWith("?"))
        continue;
      const resolved = linkTargetForSource(oldSourcePath, rawTarget);
      const isSelfTarget = sameDocumentTarget(resolved.path, parsed.targetPath, oldSourcePath);
      let replacementPath;
      if (parsed.targetPath.startsWith("/")) {
        const movedTarget = isSelfTarget ? newSourcePath : resolved.path;
        replacementPath = `/${movedTarget}`;
      } else {
        const movedTarget = isSelfTarget ? newSourcePath : resolved.path;
        replacementPath = relativeLinkPath(newSourcePath, movedTarget, !extname2(parsed.targetPath), parsed.targetPath.startsWith("./"));
      }
      const replacementTarget = `${replacementPath}${parsed.query ? `?${parsed.query}` : ""}${parsed.anchor ? `#${parsed.anchor}` : ""}`;
      const wrapped = match.target.startsWith("<") ? `<${replacementTarget}>` : replacementTarget;
      if (wrapped === match.target)
        continue;
      output += content.slice(cursor, match.index);
      output += `${match.prefix}${wrapped}${match.suffix}`;
      cursor = match.index + match.prefix.length + match.target.length + match.suffix.length;
      changedLinks += 1;
    }
    if (changedLinks === 0)
      return { content, changed: false, changedLinks: 0 };
    output += content.slice(cursor);
    return { content: output, changed: true, changedLinks };
  }
  async safeWriteText(state, path, content, exclusive = false) {
    return this.safeWriteBytes(state, path, Buffer.from(content, "utf8"), exclusive);
  }
  async safeWriteBytes(state, path, bytes, exclusive = false) {
    if (!state.root)
      throw new ContentServiceError("NOT_FOUND", "project root is unavailable.");
    const normalized = normalizeRelativePath(path);
    const absolute = resolve3(state.root, ...normalized.split("/"));
    if (!isContained(state.root, absolute))
      throw new ContentServiceError("PATH_ESCAPE", "write path escapes project root.");
    await mkdir6(dirname3(absolute), { recursive: true });
    const parent = await realpath6(dirname3(absolute));
    if (!isContained(state.root, parent))
      throw new ContentServiceError("PATH_ESCAPE", "write parent escapes project root.");
    try {
      const existing = await lstat4(absolute);
      if (existing.isSymbolicLink())
        throw new ContentServiceError("PATH_ESCAPE", "refusing to write through a symlink.");
    } catch (error) {
      if (error instanceof ContentServiceError)
        throw error;
      if (error.code !== "ENOENT")
        throw error;
    }
    const temporary = `${absolute}.workbench-${randomUUID6()}.tmp`;
    try {
      await writeFile5(temporary, bytes, { mode: 384 });
      if (exclusive) {
        try {
          await link(temporary, absolute);
        } catch (error) {
          if (error.code === "EEXIST") {
            throw new ContentServiceError("CONTENT_CONFLICT", `destination already exists: ${normalized}`);
          }
          throw error;
        }
        await rm2(temporary, { force: true });
      } else {
        await rename6(temporary, absolute);
      }
    } finally {
      await rm2(temporary, { force: true }).catch(() => {
        return;
      });
    }
    const resolved = await realpath6(absolute);
    if (!isContained(state.root, resolved))
      throw new ContentServiceError("PATH_ESCAPE", "written path escapes project root.");
    return resolved;
  }
  checkExpectedRevision(actual, expected, label) {
    if (expected !== undefined && expected !== actual) {
      throw new ContentServiceError("CONTENT_CONFLICT", `${label} changed since it was read.`, { expected, actual });
    }
  }
  async readFreshDocument(state, row) {
    const absolute = await this.safeExistingPath(state, row.path);
    if (!absolute) {
      throw new ContentServiceError("CONTENT_CONFLICT", `document disappeared or is unsafe: ${row.path}`, { expected: row.revision });
    }
    let content;
    try {
      content = await readFile8(absolute, "utf8");
    } catch (error) {
      throw new ContentServiceError("CONTENT_CONFLICT", `document changed or disappeared: ${row.path}`, { cause: toErrorMessage(error) });
    }
    const actual = hashBytes(content);
    if (actual !== row.revision) {
      throw new ContentServiceError("CONTENT_CONFLICT", `document changed since it was read: ${row.path}`, {
        expected: row.revision,
        actual
      });
    }
    return content;
  }
  async queryStoryScenePage(input) {
    if (!input.id && !input.path)
      throw new ContentServiceError("INVALID_INPUT", "storyScenePage requires id or path.");
    const offset = input.offset ?? 0;
    const limit = input.limit ?? 24;
    if (!Number.isSafeInteger(offset) || offset < 0 || !Number.isSafeInteger(limit) || limit < 1) {
      throw new ContentServiceError("INVALID_INPUT", "storyScenePage offset and limit must be non-negative integer positions.");
    }
    const row = this.resolveDocumentHeader(input.projectId, input.id, input.path);
    this.checkExpectedRevision(row.revision, input.expectedRevision, row.path);
    const db = this.getDatabase();
    const scene = db.prepare("SELECT * FROM story_scene_index WHERE project_id = ? AND path = ?").get(input.projectId, row.path);
    if (!scene)
      throw new ContentServiceError("VALIDATION_ERROR", `${row.path} is not a story scene.`);
    if (scene.revision !== row.revision)
      throw new ContentServiceError("CONTENT_CONFLICT", `story scene index is stale: ${row.path}`);
    const absolute = await this.safeExistingPath(this.project(input.projectId), row.path);
    if (!absolute)
      throw new ContentServiceError("CONTENT_CONFLICT", `document disappeared or is unsafe: ${row.path}`);
    const assertFreshFile = async () => {
      let info;
      try {
        info = await stat4(absolute, { bigint: true });
      } catch {
        throw new ContentServiceError("CONTENT_CONFLICT", `document changed or disappeared: ${row.path}`);
      }
      if (!info.isFile() || fileFingerprint(info) !== scene.file_fingerprint) {
        throw new ContentServiceError("CONTENT_CONFLICT", `document changed since it was indexed: ${row.path}`, { expected: row.revision });
      }
    };
    await assertFreshFile();
    const pageLimit = Math.min(limit, 50);
    const lines = db.prepare(`
      SELECT id, speaker_id, speaker_name, text, emotion, source_line FROM story_dialogue_lines
      WHERE project_id = ? AND path = ? ORDER BY ordinal LIMIT ? OFFSET ?
    `).all(input.projectId, row.path, pageLimit, Math.min(offset, scene.dialogue_count));
    await assertFreshFile();
    const nextOffset = offset + pageLimit;
    return {
      id: row.id,
      path: row.path,
      revision: row.revision,
      nodeId: scene.node_id,
      title: row.title,
      chapter: scene.chapter,
      summary: scene.summary,
      dialogueCount: scene.dialogue_count,
      offset,
      ...nextOffset < scene.dialogue_count ? { nextOffset } : {},
      items: lines.map((line) => ({
        id: line.id,
        speakerId: line.speaker_id,
        speakerName: line.speaker_name,
        text: line.text,
        ...line.emotion ? { emotion: line.emotion } : {},
        line: line.source_line
      })),
      diagnostics: parseJson(scene.diagnostics_json, [])
    };
  }
  async queryStoryBuilds(input) {
    const db = this.getDatabase();
    const after = decodeCursor(input.cursor);
    const clauses = ["project_id = ?"];
    const parameters = [input.projectId];
    if (after) {
      clauses.push("story_id > ?");
      parameters.push(after);
    }
    const pageLimit = clampLimit(input.limit);
    const rows = db.prepare(`SELECT * FROM story_builds WHERE ${clauses.join(" AND ")} ORDER BY story_id LIMIT ?`).all(...parameters, pageLimit + 1);
    const count = db.prepare("SELECT COUNT(*) AS count FROM story_builds WHERE project_id = ?").get(input.projectId);
    const items = rows.map((row) => {
      const sourcePaths = parseJson(row.source_paths_json, []).filter((path) => typeof path === "string");
      return {
        storyId: row.story_id,
        entryPath: row.entry_path || sourcePaths[0] || "",
        outputPath: row.output_path,
        sourcePaths,
        errorCount: row.error_count,
        warningCount: row.warning_count,
        nodeCount: row.node_count,
        choiceCount: row.choice_count,
        builtAt: row.built_at
      };
    });
    return this.pageSqlKey(items, input.limit, Number(count?.count ?? 0), (item) => item.storyId);
  }
  async queryBalanceOverview(projectId) {
    const rows = this.getDatabase().prepare("SELECT id, kind, name, revision, json FROM cards WHERE project_id = ? AND deleted = 0 ORDER BY id").all(projectId);
    const groups = new Map;
    const revision = createHash8("sha256");
    for (const row of rows) {
      revision.update(JSON.stringify([row.id, row.revision]));
      const group = groups.get(row.kind) || { kind: row.kind, count: 0, attack: [], health: [] };
      group.count++;
      const card = JSON.parse(row.json);
      for (const metric of ["attack", "health"])
        if (typeof card[metric] === "number" && Number.isFinite(card[metric]))
          group[metric].push(card[metric]);
      groups.set(row.kind, group);
    }
    const summarize = (values) => values.length ? { sample: values.length, min: values.reduce((a, b) => Math.min(a, b)), max: values.reduce((a, b) => Math.max(a, b)), mean: values.reduce((a, b) => a + b, 0) / values.length } : null;
    return { revision: revision.digest("hex"), cardCount: rows.length, groups: [...groups.values()].map((group) => ({ kind: group.kind, count: group.count, attack: summarize(group.attack), health: summarize(group.health) })), measurement: "definitions", battleReport: null };
  }
  async gameCatalog(projectId) {
    const absolute = await this.safeExistingPath(this.project(projectId), "public/data/content-catalog.json");
    if (!absolute)
      throw new ContentServiceError("NOT_FOUND", "游戏内容目录尚不存在");
    const bytes = await readFile8(absolute);
    const catalog = JSON.parse(bytes.toString("utf8"));
    if (!Array.isArray(catalog.resources))
      throw new ContentServiceError("VALIDATION_ERROR", "游戏内容目录缺少 resources");
    return { revision: hashBytes(bytes), resources: catalog.resources };
  }
  async queryGameCatalog(input) {
    if (!["story", "deck", "encounter"].includes(input.kind))
      throw new ContentServiceError("INVALID_INPUT", "未知游戏目录类型");
    const catalog = await this.gameCatalog(input.projectId);
    const search = String(input.q || "").toLocaleLowerCase();
    const items = catalog.resources.filter((row) => row.kind === input.kind && typeof row.resourceId === "string" && typeof row.publicPath === "string").map((row) => ({ id: row.resourceId, title: row.resourceId, path: `public/${row.publicPath}`, kind: row.kind })).filter((row) => !search || `${row.id}
${row.path}`.toLocaleLowerCase().includes(search)).sort((a, b) => a.id.localeCompare(b.id, "en"));
    const after = decodeCursor(input.cursor);
    const start = after ? items.findIndex((item) => item.id === after) + 1 : 0;
    if (after && start === 0)
      throw new ContentServiceError("CONTENT_CONFLICT", "目录已变化，请从第一页重新读取");
    return { ...this.pageSqlKey(items.slice(start), input.limit, items.length, (item) => item.id), revision: catalog.revision };
  }
  async queryGameDeck(input) {
    const catalog = await this.gameCatalog(input.projectId);
    const matches = catalog.resources.filter((row) => row.kind === "deck" && row.resourceId === input.id);
    if (matches.length !== 1)
      throw new ContentServiceError("NOT_FOUND", "卡组未登记或 ID 不唯一");
    const publicPath = matches[0].publicPath;
    if (typeof publicPath !== "string" || !publicPath.startsWith("data/") || publicPath.split("/").some((part) => part === ".." || part === "."))
      throw new ContentServiceError("PATH_ESCAPE", "卡组目录路径无效");
    const path = `public/${publicPath}`;
    const absolute = await this.safeExistingPath(this.project(input.projectId), path);
    if (!absolute)
      throw new ContentServiceError("NOT_FOUND", "卡组文件不存在");
    const info = await stat4(absolute);
    if (!info.isFile() || info.size > 1024 * 1024)
      throw new ContentServiceError("VALIDATION_ERROR", "卡组文件不是普通文件或超过 1 MiB");
    const bytes = await readFile8(absolute);
    const deck = JSON.parse(bytes.toString("utf8"));
    if (!deck || !Array.isArray(deck.cards) || deck.cards.length > 1000)
      throw new ContentServiceError("VALIDATION_ERROR", "卡组 cards 格式无效或超过 1000 项");
    const lookup = this.getDatabase().prepare("SELECT name FROM cards WHERE project_id = ? AND id = ? AND deleted = 0");
    const cards = deck.cards.map((entry) => {
      const row = entry;
      if (!row || typeof row.id !== "string" || !row.id.trim() || !Number.isSafeInteger(row.count) || Number(row.count) <= 0 || Number(row.count) > 1e4)
        throw new ContentServiceError("VALIDATION_ERROR", "卡组条目需要卡牌 ID 和 1–10000 的整数数量");
      const card = lookup.get(input.projectId, row.id);
      return { id: row.id, count: Number(row.count), name: card?.name, missing: !card };
    });
    return {
      id: input.id,
      path,
      revision: hashBytes(bytes),
      name: typeof deck.name === "string" ? deck.name : input.id,
      description: typeof deck.description === "string" ? deck.description : "",
      cards,
      total: cards.reduce((sum, card) => sum + card.count, 0)
    };
  }
  async queryStoryAnalysis(input) {
    const catalog = await this.gameCatalog(input.projectId);
    const matches = catalog.resources.filter((row) => row.kind === "story" && row.resourceId === input.id);
    if (matches.length !== 1)
      throw new ContentServiceError("NOT_FOUND", "剧情未登记或 ID 不唯一");
    const publicPath = matches[0].publicPath;
    if (typeof publicPath !== "string" || !publicPath.startsWith("data/") || publicPath.split("/").some((part) => part === ".." || part === "."))
      throw new ContentServiceError("PATH_ESCAPE", "剧情目录路径无效");
    const path = `public/${publicPath}`;
    const absolute = await this.safeExistingPath(this.project(input.projectId), path);
    if (!absolute)
      throw new ContentServiceError("NOT_FOUND", "剧情文件不存在");
    const info = await stat4(absolute);
    if (!info.isFile() || info.size > 8 * 1024 * 1024)
      throw new ContentServiceError("VALIDATION_ERROR", "剧情文件不是普通文件或超过 8 MiB");
    const bytes = await readFile8(absolute);
    const revision = hashBytes(bytes);
    if (input.expectedRevision && input.expectedRevision !== revision)
      throw new ContentServiceError("CONTENT_CONFLICT", "剧情已变化，请重新读取");
    const story = JSON.parse(bytes.toString("utf8"));
    const report = analyzeStory(story);
    const selectedNodes = input.nodeId ? story.nodes.filter((node) => node.id === input.nodeId) : [];
    if (input.nodeId && selectedNodes.length !== 1)
      throw new ContentServiceError("NOT_FOUND", "剧情节点不存在或 ID 不唯一");
    const selectedNode = selectedNodes[0];
    if (selectedNode)
      return { id: input.id, path, revision, selectedNode: { id: selectedNode.id, detail: typeof selectedNode.body === "string" ? selectedNode.body : typeof selectedNode.detail === "string" ? selectedNode.detail : "", onEnter: Array.isArray(selectedNode.onEnter) ? selectedNode.onEnter : [] } };
    const sources = this.getDatabase().prepare(`
      SELECT s.node_id, d.id, d.path, d.title, d.revision
      FROM story_scene_index s JOIN documents d ON d.project_id = s.project_id AND d.path = s.path
      WHERE s.project_id = ? AND d.deleted = 0 AND s.revision = d.revision
      ORDER BY d.path, d.id
    `).all(input.projectId);
    const byNode = new Map;
    for (const { node_id, ...source } of sources) {
      const matches = byNode.get(node_id) ?? [];
      matches.push(source);
      byNode.set(node_id, matches);
    }
    return {
      id: input.id,
      path,
      revision,
      catalogRevision: catalog.revision,
      ...report,
      nodes: report.nodes.map((node) => ({ ...node, sourceMatch: "node-id", sources: (byNode.get(node.id) ?? []).slice(0, 5), sourceCount: byNode.get(node.id)?.length ?? 0 }))
    };
  }
  async compileStory(input) {
    const projectId = ensureString(input?.projectId, "projectId");
    const state = this.project(projectId);
    await this.requireInitialized();
    const entryPath = normalizeRelativePath(ensureString(input?.entry, "entry"), "entry");
    const dryRun = input?.dryRun === true;
    const db = this.getDatabase();
    const diagnostics = [];
    const warn = (path, detail, line) => {
      diagnostics.push({ severity: "warning", path, ...line !== undefined ? { line } : {}, detail });
    };
    const fail = (path, detail, line) => {
      diagnostics.push({ severity: "error", path, ...line !== undefined ? { line } : {}, detail });
    };
    const entry = this.resolveDocument(projectId, undefined, entryPath);
    const entryFields = sceneFrontmatter(entry.content ?? "");
    const requiresStableIds = entryFields.shareFactsAcrossStories === "true";
    const entryBase = (entryPath.startsWith("knowledge/") ? entryPath.slice("knowledge/".length) : entryPath).replace(/\.(?:md|markdown)$/iu, "");
    const requestedStoryId = typeof input?.storyId === "string" ? input.storyId.trim() : "";
    if (requiresStableIds && !requestedStoryId && !entryFields.storyId) {
      fail(entry.path, "共享剧情入口必须声明稳定 storyId，不能使用随文档路径变化的默认 ID。");
    }
    if (requestedStoryId && entryFields.storyId && requestedStoryId !== entryFields.storyId) {
      fail(entry.path, `入口 storyId ${entryFields.storyId} 与编译请求 ${requestedStoryId} 不一致。`);
    }
    const storyId = requestedStoryId ? requestedStoryId : entryFields.storyId ?? `story.${kebabCase(entryBase) || hashBytes(entryPath).slice(0, 12)}`;
    const outputName = storyId.replace(/^story\./u, "").replace(/[^A-Za-z0-9._-]+/gu, "-") || "story";
    const outputPath = `${STORY_DIRECTORY}/${outputName}.json`;
    const nodes = [];
    const choices = [];
    const sourcePaths = [];
    const visited = new Set;
    const nodeIds = new Map;
    const choiceIds = new Map;
    const dialogueIds = new Map;
    const targetDocuments = new Map;
    const queue = [];
    if (!frontmatterHasScene(entry.content ?? "")) {
      fail(entry.path, "入口文档缺少 frontmatter 标记 scene: true，不能作为剧情入口。");
    } else {
      queue.push(entry);
    }
    while (queue.length > 0) {
      const row = queue.shift();
      if (visited.has(row.path))
        continue;
      visited.add(row.path);
      sourcePaths.push(row.path);
      const content = row.content ?? "";
      const fields = sceneFrontmatter(content);
      const nodeId = storyNodeId(row.path, fields);
      if (requiresStableIds && !fields.nodeId) {
        fail(row.path, "共享剧情场景必须声明稳定 nodeId，不能使用随文档路径变化的默认 ID。");
      }
      if (fields.nodeId && !/^[A-Za-z0-9][A-Za-z0-9._:-]*$/u.test(fields.nodeId)) {
        fail(row.path, `nodeId 格式无效：${fields.nodeId}。`);
      }
      const priorNode = nodeIds.get(nodeId);
      if (priorNode)
        fail(row.path, `nodeId ${nodeId} 已用于 ${priorNode}。`);
      else
        nodeIds.set(nodeId, row.path);
      const missing = SCENE_FRONTMATTER_FIELDS.filter((field) => !fields[field]);
      if (missing.length > 0) {
        warn(row.path, `场景缺少 frontmatter 字段：${missing.join(", ")}，编译结果以空字符串占位。`);
      }
      const { summary, detail } = sceneNarrative(content, row.title);
      const dialogues = sceneDialogues(content, row.path, fail).map(({ line: _line, ...dialogue }) => dialogue);
      for (const dialogue of dialogues) {
        const prior = dialogueIds.get(dialogue.id);
        if (prior)
          fail(row.path, `对白 ID ${dialogue.id} 已用于 ${prior}。`);
        else
          dialogueIds.set(dialogue.id, row.path);
      }
      const backgroundAsset = fields.backgroundAsset;
      if (backgroundAsset) {
        if (!/^assets\/story\/(?:[A-Za-z0-9._-]+\/)*[A-Za-z0-9._-]+\.png$/u.test(backgroundAsset) || backgroundAsset.split("/").some((part) => part === "." || part === "..")) {
          fail(row.path, `场景背景路径无效：${backgroundAsset}。`);
        } else if (!await this.safeExistingPath(state, `public/${backgroundAsset}`)) {
          fail(row.path, `场景背景文件不存在：public/${backgroundAsset}。`);
        }
      }
      let onEnter = [];
      if (fields.onEnter) {
        try {
          onEnter = validateStoryEffects(parseStoryRuleJson(fields.onEnter, "onEnter"), "onEnter");
        } catch (error) {
          fail(row.path, error instanceof Error ? error.message : String(error));
        }
      }
      nodes.push({
        id: nodeId,
        type: "story",
        title: row.title,
        summary,
        detail,
        ...dialogues.length ? { dialogues } : {},
        tags: sceneTags(content),
        chapter: fields.chapter ?? "",
        location: fields.location ?? "",
        sublocation: fields.sublocation ?? "",
        locationId: fields.locationId ?? "",
        sublocationId: fields.sublocationId ?? "",
        timeHint: fields.timeHint ?? "",
        ...backgroundAsset ? { backgroundAsset } : {},
        onEnter
      });
      const ranges = optionSectionRanges(content);
      const options = this.documentLinks(projectId, row.id).filter((link) => ranges.some((range) => link.line >= range.start && link.line <= range.end));
      const sourceLines = content.split(/\r?\n/u);
      const optionLineCounts = new Map;
      for (const option of options)
        optionLineCounts.set(option.line, (optionLineCounts.get(option.line) ?? 0) + 1);
      if (options.length === 0) {
        warn(row.path, "场景没有任何 ## 选项 分支，游玩到此结束。");
      }
      let ordinal = 0;
      for (const option of options) {
        ordinal += 1;
        let metadata;
        try {
          metadata = storyChoiceMetadata(sourceLines, option.line);
          if (metadata && optionLineCounts.get(option.line) !== 1) {
            fail(row.path, "带 story-choice 规则的选项必须独占一行。", option.line);
            continue;
          }
        } catch (error) {
          fail(row.path, error instanceof Error ? error.message : String(error), option.line);
          continue;
        }
        if (option.targetKind === "external") {
          fail(row.path, `选项指向外部链接：${option.rawTarget}`, option.line);
          continue;
        }
        let target = option.targetId ? targetDocuments.get(option.targetId) : undefined;
        if (option.targetId && !target) {
          target = db.prepare("SELECT * FROM documents WHERE project_id = ? AND id = ? AND deleted = 0").get(projectId, option.targetId);
          if (target)
            targetDocuments.set(option.targetId, target);
        }
        if (!target) {
          fail(row.path, `选项指向不存在的文档：${option.rawTarget}`, option.line);
          continue;
        }
        if (!frontmatterHasScene(target.content ?? "")) {
          fail(row.path, `选项目标缺少 scene: true 标记：${target.path}`, option.line);
          continue;
        }
        const text = option.label?.trim() || target.title;
        if (requiresStableIds && typeof metadata?.id !== "string") {
          fail(row.path, "共享剧情选项必须在 story-choice 中声明稳定 id，不能使用随选项顺序变化的默认 ID。", option.line);
          continue;
        }
        const choiceId = typeof metadata?.id === "string" ? metadata.id : `c:${nodeId}#${ordinal}`;
        if (metadata && !/^[A-Za-z0-9][A-Za-z0-9._:-]*$/u.test(choiceId)) {
          fail(row.path, `选项 ID 格式无效：${choiceId}。`, option.line);
          continue;
        }
        const priorChoice = choiceIds.get(choiceId);
        if (priorChoice) {
          fail(row.path, `选项 ID ${choiceId} 已用于 ${priorChoice}。`, option.line);
          continue;
        }
        choiceIds.set(choiceId, `${row.path}:${option.line}`);
        choices.push({
          id: choiceId,
          from: nodeId,
          to: storyNodeId(target.path, sceneFrontmatter(target.content ?? "")),
          text,
          description: typeof metadata?.description === "string" ? metadata.description : text,
          ...metadata?.visibleWhen ? { visibleWhen: metadata.visibleWhen } : {},
          ...metadata?.enabledWhen ? { enabledWhen: metadata.enabledWhen } : {},
          effects: metadata?.effects ?? [],
          flags: metadata?.flags ?? []
        });
        if (!visited.has(target.path))
          queue.push(target);
      }
    }
    let initialState = {
      locationId: entryFields.locationId ?? "",
      sublocationId: entryFields.sublocationId ?? ""
    };
    if (entryFields.initialState) {
      try {
        initialState = {
          ...initialState,
          ...validateInitialStoryState(parseStoryRuleJson(entryFields.initialState, "initialState"), "initialState")
        };
      } catch (error) {
        fail(entry.path, error instanceof Error ? error.message : String(error));
      }
    }
    if (entryFields.shareFactsAcrossStories && !["true", "false"].includes(entryFields.shareFactsAcrossStories)) {
      fail(entry.path, "shareFactsAcrossStories 必须是 true 或 false。");
    }
    const priorBuildOwner = db.prepare("SELECT story_id FROM story_builds WHERE project_id = ? AND output_path = ? AND story_id <> ? LIMIT 1").get(projectId, outputPath, storyId);
    if (priorBuildOwner) {
      fail(entry.path, `剧情产物 ${outputPath} 已属于 ${priorBuildOwner.story_id}，请使用不会映射到同一文件名的 storyId。`);
    }
    const errorCount = diagnostics.filter((diagnostic) => diagnostic.severity === "error").length;
    const result = {
      storyId,
      outputPath,
      catalogUpdated: false,
      nodeCount: nodes.length,
      choiceCount: choices.length,
      diagnostics
    };
    const recordBuild = () => {
      const errors = diagnostics.filter((diagnostic) => diagnostic.severity === "error").length;
      db.prepare(`
        INSERT INTO story_builds(project_id, story_id, entry_path, output_path, source_paths_json, diagnostics_json, error_count, warning_count, node_count, choice_count, built_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(project_id, story_id) DO UPDATE SET
          entry_path=excluded.entry_path, output_path=excluded.output_path, source_paths_json=excluded.source_paths_json,
          diagnostics_json=excluded.diagnostics_json, error_count=excluded.error_count,
          warning_count=excluded.warning_count, node_count=excluded.node_count,
          choice_count=excluded.choice_count, built_at=excluded.built_at
      `).run(projectId, storyId, entryPath, outputPath, jsonStringify(sourcePaths), jsonStringify(diagnostics), errors, diagnostics.length - errors, nodes.length, choices.length, nowIso());
    };
    if (priorBuildOwner || errorCount > 0) {
      if (!dryRun && !priorBuildOwner)
        recordBuild();
      return result;
    }
    const graph = {
      storyId,
      title: entry.title,
      entryNodeId: storyNodeId(entry.path, entryFields),
      initialState,
      nodes,
      choices,
      ...entryFields.shareFactsAcrossStories === "true" ? { shareFactsAcrossStories: true } : {}
    };
    let catalog = { schemaVersion: 1, resources: [] };
    const catalogAbsolute = await this.safeExistingPath(state, CONTENT_CATALOG_PATH);
    if (catalogAbsolute) {
      try {
        catalog = JSON.parse(await readFile8(catalogAbsolute, "utf8"));
      } catch {
        throw new ContentServiceError("VALIDATION_ERROR", `${CONTENT_CATALOG_PATH} is not valid JSON; refusing to update it.`);
      }
    }
    const resources = Array.isArray(catalog.resources) ? catalog.resources : [];
    const publicPath = `data/story/${outputName}.json`;
    const catalogOwner = resources.find((resource) => asRecord(resource)?.publicPath === publicPath && asRecord(resource)?.resourceId !== storyId);
    if (catalogOwner) {
      fail(entry.path, `剧情产物 ${outputPath} 已在内容目录中属于 ${String(asRecord(catalogOwner)?.resourceId)}，请使用不会映射到同一文件名的 storyId。`);
    }
    const existingOutput = await this.safeExistingPath(state, outputPath);
    const existingStoryJson = existingOutput ? await readFile8(existingOutput, "utf8") : undefined;
    if (existingStoryJson) {
      try {
        const existingGraph = asRecord(JSON.parse(existingStoryJson));
        if (existingGraph?.storyId && existingGraph.storyId !== storyId) {
          fail(entry.path, `剧情产物 ${outputPath} 已属于 ${String(existingGraph.storyId)}，请使用不会映射到同一文件名的 storyId。`);
        }
      } catch {}
    }
    if (diagnostics.some((diagnostic) => diagnostic.severity === "error") || dryRun)
      return result;
    const storyJson = `${JSON.stringify(graph, null, 2)}
`;
    if (existingStoryJson !== storyJson) {
      await this.safeWriteText(state, outputPath, storyJson);
    }
    const index = resources.findIndex((resource) => asRecord(resource)?.resourceId === storyId);
    const current = index >= 0 ? asRecord(resources[index]) : undefined;
    if (!current || current.kind !== "story" || current.schemaVersion !== 1 || current.publicPath !== publicPath) {
      const entry2 = { resourceId: storyId, kind: "story", schemaVersion: 1, publicPath };
      if (index >= 0)
        resources[index] = entry2;
      else
        resources.push(entry2);
      await this.safeWriteText(state, CONTENT_CATALOG_PATH, `${JSON.stringify({ ...catalog, schemaVersion: 1, resources }, null, 2)}
`);
      result.catalogUpdated = true;
    }
    recordBuild();
    this.notify({ projectId, paths: [outputPath, CONTENT_CATALOG_PATH], kinds: ["status"], reason: "save" });
    return result;
  }
  queueStoryRebuilds(projectId, changedPaths) {
    if (this.closed || changedPaths.length === 0)
      return;
    this.enqueue(async () => {
      try {
        await this.rebuildStoriesForDocuments(projectId, changedPaths);
      } catch {}
    });
  }
  async rebuildStoriesForDocuments(projectId, changedPaths) {
    const db = this.getDatabase();
    const rows = db.prepare("SELECT * FROM story_builds WHERE project_id = ?").all(projectId);
    for (const row of rows) {
      const sources = parseJson(row.source_paths_json, []).filter((path) => typeof path === "string");
      const affected = sources.some((source) => changedPaths.some((changed) => source === changed || source.startsWith(`${changed}/`)));
      if (!affected)
        continue;
      const key = `${projectId}:${row.story_id}`;
      if (this.pendingStoryRebuilds.has(key))
        continue;
      this.pendingStoryRebuilds.add(key);
      try {
        const entry = row.entry_path || sources[0];
        if (!entry)
          continue;
        await this.compileStory({ projectId, entry, storyId: row.story_id });
      } catch (error) {
        const diagnostics = [{ severity: "error", path: row.entry_path || row.output_path, detail: `自动重编译失败：${toErrorMessage(error)}` }];
        db.prepare("UPDATE story_builds SET diagnostics_json = ?, error_count = ?, warning_count = 0, built_at = ? WHERE project_id = ? AND story_id = ?").run(jsonStringify(diagnostics), 1, nowIso(), projectId, row.story_id);
        this.notify({ projectId, paths: [row.output_path], kinds: ["status"], reason: "save" });
      } finally {
        this.pendingStoryRebuilds.delete(key);
      }
    }
  }
  remapStoryBuildPaths(projectId, fromPath, toPath) {
    const db = this.getDatabase();
    const rows = db.prepare("SELECT * FROM story_builds WHERE project_id = ?").all(projectId);
    for (const row of rows) {
      const sources = parseJson(row.source_paths_json, []).filter((path) => typeof path === "string");
      const remapped = sources.map((path) => path === fromPath ? toPath : path);
      const entryPath = row.entry_path === fromPath ? toPath : row.entry_path;
      if (remapped.every((path, index) => path === sources[index]) && entryPath === row.entry_path)
        continue;
      db.prepare("UPDATE story_builds SET source_paths_json = ?, entry_path = ? WHERE project_id = ? AND story_id = ?").run(jsonStringify(remapped), entryPath, projectId, row.story_id);
    }
  }
  async saveDocument(input) {
    const projectId = ensureString(input?.projectId, "projectId");
    const state = this.project(projectId);
    await this.requireInitialized();
    if (typeof input.content !== "string")
      throw new ContentServiceError("INVALID_INPUT", "content must be a string.");
    let existing;
    if (input.id || input.path) {
      try {
        existing = this.resolveDocument(projectId, input.id, input.path);
      } catch (error) {
        if (!(error instanceof ContentServiceError) || error.code !== "NOT_FOUND")
          throw error;
      }
    }
    const path = normalizeRelativePath(input.path ?? existing?.path ?? "notes/new.md");
    if (existing) {
      if (input.expectedRevision === undefined) {
        throw new ContentServiceError("CONTENT_CONFLICT", `document ${existing.path} requires expectedRevision for an existing file.`);
      }
      this.checkExpectedRevision(existing.revision, input.expectedRevision, `document ${existing.path}`);
      await this.readFreshDocument(state, existing);
    } else if (input.expectedRevision) {
      throw new ContentServiceError("CONTENT_CONFLICT", "new document cannot have an expected revision.");
    }
    const oldPath = existing?.path;
    if (oldPath && oldPath !== path) {
      const destination = this.getDatabase().prepare("SELECT id FROM documents WHERE project_id = ? AND path = ? AND deleted = 0").get(projectId, path);
      if (destination && destination.id !== existing?.id)
        throw new ContentServiceError("CONTENT_CONFLICT", `destination already exists: ${path}`);
    }
    if (!existing) {
      const destinationAbsolute = resolve3(state.root, ...path.split("/"));
      try {
        const destinationInfo = await lstat4(destinationAbsolute);
        if (destinationInfo.isSymbolicLink())
          throw new ContentServiceError("PATH_ESCAPE", "refusing to overwrite a symlink.");
        if (destinationInfo.isFile())
          throw new ContentServiceError("CONTENT_CONFLICT", `destination already exists: ${path}`);
        if (destinationInfo.isDirectory())
          throw new ContentServiceError("CONTENT_CONFLICT", `destination is a directory: ${path}`);
      } catch (error) {
        if (error instanceof ContentServiceError)
          throw error;
        if (error.code !== "ENOENT")
          throw error;
      }
    }
    await this.safeWriteText(state, path, input.content, !existing);
    const info = await stat4(resolve3(state.root, ...path.split("/")), { bigint: true });
    const row = this.upsertDocument(projectId, path, input.content, info);
    if (oldPath && oldPath !== path) {
      this.getDatabase().prepare("UPDATE documents SET deleted = 1 WHERE project_id = ? AND id = ? AND path = ?").run(projectId, existing.id, oldPath);
      this.deleteStorySceneIndex(projectId, oldPath);
    }
    if (input.title && input.title.trim()) {
      this.getDatabase().prepare("UPDATE documents SET title = ?, search_text = ? WHERE project_id = ? AND id = ?").run(input.title.trim(), normalizedSearch(`${path}
${input.title.trim()}
${input.content}`), projectId, row.id);
    }
    if (existing && oldPath === path)
      this.rebuildLinksForDocument(projectId, row);
    else
      this.rebuildAllLinks(projectId);
    const outputRow = this.getDatabase().prepare("SELECT * FROM documents WHERE project_id = ? AND id = ? AND deleted = 0").get(projectId, row.id);
    this.notify({ projectId, paths: [path, ...oldPath && oldPath !== path ? [oldPath] : []], kinds: ["document", "directory", "status"], reason: "save" });
    if (oldPath && oldPath !== path)
      this.remapStoryBuildPaths(projectId, oldPath, path);
    this.queueStoryRebuilds(projectId, oldPath && oldPath !== path ? [path, oldPath] : [path]);
    return contentDocumentFromRow(outputRow, this.documentLinks(projectId, row.id));
  }
  async moveDocument(input) {
    const projectId = ensureString(input?.projectId, "projectId");
    const state = this.project(projectId);
    await this.requireInitialized();
    const source = this.resolveDocument(projectId, input.id, input.path);
    const toPath = normalizeRelativePath(input.toPath, "toPath");
    this.checkExpectedRevision(source.revision, input.expectedRevision, `document ${source.path}`);
    const destination = this.getDatabase().prepare("SELECT id FROM documents WHERE project_id = ? AND path = ? AND deleted = 0").get(projectId, toPath);
    if (destination && destination.id !== source.id)
      throw new ContentServiceError("CONTENT_CONFLICT", `destination already exists: ${toPath}`);
    const preview = await this.queryMovePreview({ projectId, op: "movePreview", id: source.id, toPath });
    if (!preview.canApply)
      throw new ContentServiceError("CONTENT_CONFLICT", "document move has conflicts.", preview.conflicts);
    const expectedRevisions = input.expectedRevisions ?? {};
    for (const affected of preview.affected) {
      if (expectedRevisions[affected.id] !== undefined && expectedRevisions[affected.id] !== affected.revision) {
        throw new ContentServiceError("CONTENT_CONFLICT", `linked document changed: ${affected.path}`);
      }
      const current = this.getDatabase().prepare("SELECT revision FROM documents WHERE project_id = ? AND id = ? AND deleted = 0").get(projectId, affected.id);
      if (!current || current.revision !== affected.revision)
        throw new ContentServiceError("CONTENT_CONFLICT", `linked document changed: ${affected.path}`);
    }
    const affectedIds = new Set(preview.affected.map((item) => item.id));
    const allDocuments = [...affectedIds].map((id) => this.getDatabase().prepare("SELECT * FROM documents WHERE project_id = ? AND id = ? AND deleted = 0").get(projectId, id)).filter((document) => Boolean(document));
    for (const document of allDocuments) {
      document.content = await this.readFreshDocument(state, document);
    }
    const rewritten = new Map;
    for (const document of allDocuments) {
      const result = document.id === source.id ? this.rewriteMovedDocumentOutboundLinks(document.content ?? "", source.path, toPath) : this.rewriteDocumentLinks(document.content ?? "", document.path, source.path, toPath);
      rewritten.set(document.id, {
        path: document.id === source.id ? toPath : document.path,
        content: result.content,
        changedLinks: result.changedLinks
      });
    }
    const sourceAbsolute = resolve3(state.root, ...source.path.split("/"));
    const destinationAbsolute = resolve3(state.root, ...toPath.split("/"));
    const sourceResolved = await realpath6(sourceAbsolute).catch(() => {
      return;
    });
    if (!sourceResolved || !isContained(state.root, sourceResolved))
      throw new ContentServiceError("PATH_ESCAPE", "source path is outside project root.");
    await mkdir6(dirname3(destinationAbsolute), { recursive: true });
    const destinationParent = await realpath6(dirname3(destinationAbsolute));
    if (!isContained(state.root, destinationParent))
      throw new ContentServiceError("PATH_ESCAPE", "destination parent escapes project root.");
    try {
      const destinationInfo = await lstat4(destinationAbsolute);
      if (destinationInfo.isSymbolicLink())
        throw new ContentServiceError("PATH_ESCAPE", "refusing to replace a destination symlink.");
      throw new ContentServiceError("CONTENT_CONFLICT", `destination already exists: ${toPath}`);
    } catch (error) {
      if (error instanceof ContentServiceError)
        throw error;
      if (error.code !== "ENOENT")
        throw error;
    }
    await rename6(sourceResolved, destinationAbsolute);
    try {
      for (const document of allDocuments) {
        const change = rewritten.get(document.id);
        if (!change.content || change.content === document.content)
          continue;
        await this.safeWriteText(state, change.path, change.content);
      }
    } catch (error) {
      await rename6(destinationAbsolute, sourceResolved).catch(() => {
        return;
      });
      throw error;
    }
    for (const document of allDocuments) {
      const change = rewritten.get(document.id);
      const targetPath = change.path;
      const info = await stat4(resolve3(state.root, ...targetPath.split("/")), { bigint: true });
      this.upsertDocument(projectId, targetPath, change.content, info);
      if (document.id !== source.id && change.content === document.content)
        continue;
    }
    this.getDatabase().prepare("UPDATE documents SET deleted = 1 WHERE project_id = ? AND id = ? AND path = ?").run(projectId, source.id, source.path);
    this.deleteStorySceneIndex(projectId, source.path);
    const moved = this.getDatabase().prepare("SELECT * FROM documents WHERE project_id = ? AND path = ? AND deleted = 0").get(projectId, toPath);
    if (moved && moved.id !== source.id) {
      this.getDatabase().prepare("DELETE FROM documents WHERE project_id = ? AND id = ?").run(projectId, moved.id);
    }
    if (!moved || moved.id !== source.id) {
      const sourceRevision = hashBytes(rewritten.get(source.id).content);
      this.getDatabase().prepare("UPDATE documents SET path = ?, content = ?, revision = ?, title = ?, deleted = 0, size = ?, updated_at = ?, search_text = ? WHERE project_id = ? AND id = ?").run(toPath, rewritten.get(source.id).content, sourceRevision, titleFromMarkdown(toPath, rewritten.get(source.id).content), rewritten.get(source.id).content.length, nowIso(), normalizedSearch(`${toPath}
${rewritten.get(source.id).content}`), projectId, source.id);
    }
    this.rebuildAllLinks(projectId);
    this.notify({ projectId, paths: [source.path, toPath, ...preview.affected.map((item) => item.path)], kinds: ["document", "status"], reason: "move" });
    this.remapStoryBuildPaths(projectId, source.path, toPath);
    this.queueStoryRebuilds(projectId, [toPath, source.path]);
    const movedRow = this.resolveDocument(projectId, source.id);
    return {
      ...preview,
      source: contentDocumentFromRow(movedRow, this.documentLinks(projectId, movedRow.id)),
      toPath
    };
  }
  async savePipelineCard(input) {
    await this.requireInitialized();
    const card = validateCard(input.card);
    const projectId = ensureString(input.projectId, "projectId");
    const id = String(card.id);
    const state = this.project(projectId);
    const existing = this.getDatabase().prepare("SELECT * FROM cards WHERE project_id = ? AND id = ? AND deleted = 0").get(projectId, id);
    if (existing) {
      if (typeof input.expectedRevision !== "string")
        throw new ContentServiceError("CONTENT_CONFLICT", `card ${id} already exists; import it before editing.`);
      return this.updateCard({ projectId, id, card, expectedRevision: input.expectedRevision });
    }
    if (input.expectedRevision !== null)
      throw new ContentServiceError("CONTENT_CONFLICT", `card ${id} disappeared since this draft was created.`);
    await this.validateCardReferences(state, card);
    const { path, key } = cardCollection(card.kind);
    const absolute = await this.safeExistingPath(state, path);
    const source = absolute ? JSON.parse(await readFile8(absolute, "utf8")) : { [key]: [] };
    if (!Array.isArray(source[key]))
      throw new ContentServiceError("VALIDATION_ERROR", `${path} needs a ${key} array.`);
    if (source[key].some((item) => item?.id === id))
      throw new ContentServiceError("CONTENT_CONFLICT", `card ${id} already exists on disk.`);
    await this.safeWriteText(state, path, JSON.stringify({ ...source, [key]: [...source[key], card] }, null, 2) + `
`);
    await this.indexCardFile(state, path);
    this.notify({ projectId, paths: [path], kinds: ["card", "status"], reason: "card" });
    const row = this.getDatabase().prepare("SELECT * FROM cards WHERE project_id = ? AND id = ? AND deleted = 0").get(projectId, id);
    return cardFromRow(row);
  }
  async updateCard(input) {
    const projectId = ensureString(input?.projectId, "projectId");
    const id = ensureString(input?.id, "card id");
    const state = this.project(projectId);
    await this.requireInitialized();
    const db = this.getDatabase();
    const row = db.prepare("SELECT * FROM cards WHERE project_id = ? AND id = ? AND deleted = 0").get(projectId, id);
    if (!row)
      throw new ContentServiceError("NOT_FOUND", `card was not found: ${id}`);
    this.checkExpectedRevision(row.revision, input.expectedRevision, `card ${id}`);
    const current = parseJson(row.json, {});
    const updated = input.card ?? { ...current, ...input.patch ?? {} };
    if (updated.id !== id)
      throw new ContentServiceError("VALIDATION_ERROR", "card id is immutable.");
    if (!updated.kind || updated.kind !== row.kind)
      throw new ContentServiceError("VALIDATION_ERROR", "card kind is immutable and must remain valid.");
    validateCard(updated);
    await this.validateCardReferences(state, updated);
    const sourceAbsolute = resolve3(state.root, ...row.path.split("/"));
    let sourceText;
    try {
      sourceText = await readFile8(sourceAbsolute, "utf8");
    } catch (error) {
      throw new ContentServiceError("CONTENT_CONFLICT", `card source changed or disappeared: ${row.path}`, { cause: toErrorMessage(error) });
    }
    const currentSourceRevision = hashBytes(sourceText);
    if (row.source_revision && currentSourceRevision !== row.source_revision) {
      throw new ContentServiceError("CONTENT_CONFLICT", `card source changed since it was read: ${row.path}`, {
        expected: row.source_revision,
        actual: currentSourceRevision
      });
    }
    let collectionJson;
    try {
      collectionJson = JSON.parse(sourceText);
    } catch (error) {
      throw new ContentServiceError("CONTENT_CONFLICT", `card source is no longer valid JSON: ${row.path}`, { cause: toErrorMessage(error) });
    }
    const collection = asRecord(collectionJson);
    const values = collection?.[row.collection];
    if (!Array.isArray(values))
      throw new ContentServiceError("VALIDATION_ERROR", `${row.path} no longer contains collection ${row.collection}.`);
    const index = values.findIndex((value) => asRecord(value)?.id === id);
    if (index < 0)
      throw new ContentServiceError("CONTENT_CONFLICT", `card ${id} is missing from its source file.`);
    const nextValues = values.slice();
    nextValues[index] = updated;
    const nextCollection = { ...collection, [row.collection]: nextValues };
    await this.safeWriteText(state, row.path, `${JSON.stringify(nextCollection, null, 2)}
`);
    await this.indexCardFile(state, row.path);
    const output = db.prepare("SELECT * FROM cards WHERE project_id = ? AND id = ? AND deleted = 0").get(projectId, id);
    this.notify({ projectId, paths: [row.path], kinds: ["card", "status"], reason: "card" });
    return cardFromRow(output);
  }
  async updateAsset(input) {
    const projectId = ensureString(input?.projectId, "projectId");
    const id = ensureString(input?.id, "asset id");
    await this.requireInitialized();
    const db = this.getDatabase();
    const row = db.prepare("SELECT * FROM assets WHERE project_id = ? AND id = ? AND deleted = 0").get(projectId, id);
    if (!row)
      throw new ContentServiceError("NOT_FOUND", `asset was not found: ${id}`);
    const actualMetadataRevision = row.metadata_revision || hashBytes(row.metadata_json);
    if (input.expectedMetadataRevision === undefined) {
      throw new ContentServiceError("CONTENT_CONFLICT", `asset ${id} requires expectedMetadataRevision.`);
    }
    if (input.expectedMetadataRevision !== actualMetadataRevision) {
      throw new ContentServiceError("CONTENT_CONFLICT", `asset metadata changed since it was read: ${id}`, {
        expected: input.expectedMetadataRevision,
        actual: actualMetadataRevision
      });
    }
    if (input.name !== undefined && typeof input.name !== "string")
      throw new ContentServiceError("INVALID_INPUT", "asset.name must be a string.");
    if (input.tags !== undefined && (!Array.isArray(input.tags) || input.tags.some((tag) => typeof tag !== "string"))) {
      throw new ContentServiceError("INVALID_INPUT", "asset.tags must be an array of strings.");
    }
    const storedMetadata = parseJson(row.metadata_json, {});
    const currentName = row.name?.trim() || (typeof storedMetadata.name === "string" ? storedMetadata.name : "");
    const currentTags = row.tags_json ? parseJson(row.tags_json, []) : Array.isArray(storedMetadata.tags) ? storedMetadata.tags.filter((tag) => typeof tag === "string") : [];
    const name = input.name === undefined ? currentName : input.name.trim();
    const tags = input.tags === undefined ? currentTags : [...input.tags];
    const metadata = { ...storedMetadata, name, tags };
    const metadataJson = jsonStringify(metadata);
    const metadataRevision = hashBytes(metadataJson);
    db.prepare("UPDATE assets SET name = ?, tags_json = ?, metadata_json = ?, metadata_revision = ?, updated_at = ? WHERE project_id = ? AND id = ? AND deleted = 0").run(name, jsonStringify(tags), metadataJson, metadataRevision, nowIso(), projectId, id);
    await this.writeManifest(projectId);
    const output = db.prepare("SELECT * FROM assets WHERE project_id = ? AND id = ? AND deleted = 0").get(projectId, id);
    this.notify({ projectId, paths: [output.path], kinds: ["asset", "status"], reason: "adopt" });
    return assetFromRow(output);
  }
  async validateCardReferences(state, card) {
    const readRegistry = async (path, collection) => {
      const absolute = await this.safeExistingPath(state, path);
      if (!absolute)
        return;
      let parsed;
      try {
        parsed = JSON.parse(await readFile8(absolute, "utf8"));
      } catch (error) {
        throw new ContentServiceError("VALIDATION_ERROR", `${path} is not valid JSON: ${toErrorMessage(error)}`);
      }
      const record = asRecord(parsed);
      const entries = record?.[collection];
      if (!Array.isArray(entries)) {
        throw new ContentServiceError("VALIDATION_ERROR", `${path} must contain a ${collection} array.`);
      }
      const ids = new Set;
      for (const entry of entries) {
        const id = asRecord(entry)?.id;
        if (typeof id === "string" && id.trim())
          ids.add(id);
      }
      return ids;
    };
    const requireRegistryId = (registry, id, field, registryPath) => {
      if (registry === undefined || typeof id !== "string" || id.trim().length === 0)
        return;
      if (!registry.has(id)) {
        throw new ContentServiceError("VALIDATION_ERROR", `card.${field} references unknown id ${id} in ${registryPath}.`, { field, id, registryPath });
      }
    };
    const kind = asString(card.kind);
    if (kind === "unit") {
      const registry = await readRegistry("public/data/config/combat-baseline.json", "realms");
      requireRegistryId(registry, card.realmId, "realmId", "public/data/config/combat-baseline.json");
    }
    if (kind === "artifact") {
      const registry = await readRegistry("public/data/config/artifact-grade.json", "grades");
      requireRegistryId(registry, card.gradeId, "gradeId", "public/data/config/artifact-grade.json");
    }
    if (card.gongfaIds !== undefined && Array.isArray(card.gongfaIds)) {
      const registry = await readRegistry("public/data/gongfa/gongfa-list.json", "gongfa");
      if (registry !== undefined) {
        for (const [index, id] of card.gongfaIds.entries()) {
          requireRegistryId(registry, id, `gongfaIds[${index}]`, "public/data/gongfa/gongfa-list.json");
        }
      }
    }
    const statusRegistry = await readRegistry("public/data/config/status-definitions.json", "statuses");
    if (statusRegistry === undefined)
      return;
    const visitActions = (value, context) => {
      const record = asRecord(value);
      if (!record)
        return;
      const actions = record.actions;
      if (Array.isArray(actions)) {
        for (const [index, action] of actions.entries()) {
          const actionRecord = asRecord(action);
          if (actionRecord?.type === "applyStatus") {
            requireRegistryId(statusRegistry, actionRecord.statusId, `${context}.actions[${index}].statusId`, "public/data/config/status-definitions.json");
          }
        }
      }
      const schema = asRecord(record.schema);
      if (schema)
        visitActions(schema, `${context}.schema`);
    };
    if (Array.isArray(card.effects)) {
      for (const [index, effect] of card.effects.entries())
        visitActions(effect, `card.effects[${index}]`);
    }
  }
  candidateRoot(projectId) {
    return resolve3(this.dataRoot, "candidates", projectId);
  }
  async registerCandidates(input) {
    const projectId = ensureString(input?.projectId, "projectId");
    this.project(projectId);
    await this.requireInitialized();
    if (!Array.isArray(input.candidates))
      throw new ContentServiceError("INVALID_INPUT", "candidates must be an array.");
    const candidateRoot = this.candidateRoot(projectId);
    await mkdir6(candidateRoot, { recursive: true });
    const results = [];
    for (const candidate of input.candidates) {
      const candidateInput = candidate;
      const name = String(candidateInput.name ?? candidateInput.fileName ?? "candidate.bin").trim() || "candidate.bin";
      const fileName = basename(name).replace(/[^\p{L}\p{N}._-]+/gu, "_");
      let bytes;
      if (candidateInput.data !== undefined || candidateInput.base64 !== undefined) {
        const encoded = candidateInput.base64 ?? candidateInput.data;
        const source = encoded.startsWith("data:") ? encoded.slice(encoded.indexOf(",") + 1) : encoded;
        bytes = Buffer.from(source, "base64");
      } else if (candidateInput.sourcePath) {
        const sourcePath = resolve3(candidateInput.sourcePath);
        const dataRootReal = await realpath6(this.dataRoot);
        const sourceReal = await realpath6(sourcePath).catch(() => {
          return;
        });
        if (!sourceReal || !isContained(dataRootReal, sourceReal))
          throw new ContentServiceError("PATH_ESCAPE", "candidate source must be inside dataRoot.");
        bytes = await readFile8(sourceReal);
      } else {
        throw new ContentServiceError("INVALID_INPUT", `candidate ${name} requires data, base64, or sourcePath.`);
      }
      const revision = hashBytes(bytes);
      const id = candidateInput.id?.trim() || `candidate:${projectId}:${revision}`;
      const previous = this.getDatabase().prepare("SELECT * FROM candidates WHERE project_id = ? AND id = ?").get(projectId, id);
      let row;
      if (previous) {
        if (previous.revision !== revision) {
          throw new ContentServiceError("CONTENT_CONFLICT", `candidate ${id} already contains different bytes.`, {
            expected: previous.revision,
            actual: revision
          });
        }
        row = previous;
      } else {
        const candidateDir = resolve3(candidateRoot, id.replace(/[^\p{L}\p{N}._-]+/gu, "_"));
        await mkdir6(candidateDir, { recursive: true });
        const filePath = resolve3(candidateDir, fileName);
        await writeFile5(filePath, bytes, { mode: 384 });
        const mimeType = candidateInput.mimeType ?? mediaTypeFromPath(fileName);
        const metadata = candidateInput.metadata ?? {};
        const createdAt = nowIso();
        this.getDatabase().prepare(`
          INSERT INTO candidates(project_id, id, name, file_path, revision, mime_type, size, metadata_json, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(project_id, id) DO UPDATE SET name=excluded.name, file_path=excluded.file_path,
            revision=excluded.revision, mime_type=excluded.mime_type, size=excluded.size,
            metadata_json=excluded.metadata_json, created_at=excluded.created_at
        `).run(projectId, id, name, filePath, revision, mimeType, bytes.byteLength, jsonStringify(metadata), createdAt);
        row = this.getDatabase().prepare("SELECT * FROM candidates WHERE project_id = ? AND id = ?").get(projectId, id);
      }
      const base = {
        id: row.id,
        title: row.name,
        path: toPosixPath(relative4(this.dataRoot, row.file_path)),
        revision: row.revision,
        mimeType: row.mime_type,
        size: row.size,
        metadata: parseJson(row.metadata_json, {})
      };
      results.push(input.autoAdopt ? await this.autoAdoptCandidate(projectId, row, input.autoAdopt, base) : base);
    }
    this.notify({ projectId, kinds: ["asset", "status"], reason: "candidate" });
    return results;
  }
  async autoAdoptCandidate(projectId, row, options, base) {
    const db = this.getDatabase();
    const metadata = parseJson(row.metadata_json, {});
    const storedInspection = (value) => {
      const record = asRecord(value);
      if (!record || typeof record.passed !== "boolean" || !Array.isArray(record.reasons))
        return;
      return { passed: record.passed, reasons: record.reasons.filter((reason) => typeof reason === "string") };
    };
    const adopted = db.prepare("SELECT * FROM asset_versions WHERE project_id = ? AND candidate_id = ? ORDER BY created_at DESC LIMIT 1").get(projectId, row.id);
    if (adopted) {
      const inspection = storedInspection(metadata.inspection) ?? { passed: true, reasons: [] };
      return { ...base, metadata, status: "adopted", inspection, assetId: adopted.asset_id, assetPath: adopted.path, versionId: adopted.id };
    }
    const inspection = storedInspection(metadata.inspection) ?? await inspectCandidateFile(row.file_path, row.mime_type, row.size);
    if (!inspection.passed) {
      const nextMetadata = { ...metadata, inspection };
      db.prepare("UPDATE candidates SET metadata_json = ? WHERE project_id = ? AND id = ?").run(jsonStringify(nextMetadata), projectId, row.id);
      return { ...base, metadata: nextMetadata, status: "candidate", inspection };
    }
    const path = asString(options.path) ?? asString(metadata.path);
    const assetId = asString(options.assetId) ?? asString(metadata.assetId);
    const asset = await this.adoptVersion({
      projectId,
      candidateId: row.id,
      ...path ? { path } : {},
      ...assetId ? { assetId } : {},
      ...options.metadata ? { metadata: options.metadata } : {}
    });
    const nextMetadata = { ...metadata, inspection };
    db.prepare("UPDATE candidates SET metadata_json = ? WHERE project_id = ? AND id = ?").run(jsonStringify(nextMetadata), projectId, row.id);
    return {
      ...base,
      metadata: nextMetadata,
      status: "adopted",
      inspection,
      assetId: asset.id,
      assetPath: asset.path,
      ...asset.currentVersionId ? { versionId: asset.currentVersionId } : {}
    };
  }
  async adoptVersion(input) {
    const projectId = ensureString(input?.projectId, "projectId");
    const state = this.project(projectId);
    await this.requireInitialized();
    const db = this.getDatabase();
    let candidate;
    if (input.candidateId)
      candidate = db.prepare("SELECT * FROM candidates WHERE project_id = ? AND id = ?").get(projectId, input.candidateId);
    let existingVersion;
    if (input.versionId)
      existingVersion = db.prepare("SELECT * FROM asset_versions WHERE project_id = ? AND id = ?").get(projectId, input.versionId);
    if (!candidate && !existingVersion)
      throw new ContentServiceError("NOT_FOUND", "candidate or version was not found.");
    if (candidate && !existingVersion) {
      const source = await realpath6(candidate.file_path).catch(() => {
        return;
      });
      const dataRootReal = await realpath6(this.dataRoot);
      if (!source || !isContained(dataRootReal, source))
        throw new ContentServiceError("PATH_ESCAPE", "candidate path escapes dataRoot.");
    }
    const sourcePath = candidate?.file_path ?? existingVersion.path;
    const bytes = candidate ? await readFile8(sourcePath) : await this.readVersionBytes(state, existingVersion);
    const desiredPath = normalizeAssetDestination(input.path ?? input.fileName ?? candidate?.name ?? basename(existingVersion?.path ?? "asset.bin"));
    const revision = hashBytes(bytes);
    const existingById = input.assetId ? db.prepare("SELECT * FROM assets WHERE project_id = ? AND id = ? AND deleted = 0").get(projectId, input.assetId) : undefined;
    if (input.assetId && !existingById)
      throw new ContentServiceError("NOT_FOUND", `asset was not found: ${input.assetId}`);
    const existingAtPath = db.prepare("SELECT * FROM assets WHERE project_id = ? AND path = ? AND deleted = 0").get(projectId, desiredPath);
    const logicalAsset = existingById ?? existingAtPath;
    const assetId = input.assetId ?? existingAtPath?.id ?? `asset:${projectId}:${desiredPath}`;
    let existingVersionByHash = db.prepare("SELECT * FROM asset_versions WHERE project_id = ? AND asset_id = ? AND revision = ? ORDER BY created_at DESC LIMIT 1").get(projectId, assetId, revision);
    if (existingVersionByHash) {
      const reusablePath = await this.safeExistingPath(state, existingVersionByHash.path);
      if (!reusablePath || await hashFile(reusablePath) !== revision)
        existingVersionByHash = undefined;
    }
    const adoptedPath = existingVersionByHash?.path ?? await this.chooseAdoptPath(state, desiredPath, revision, logicalAsset?.path);
    const versionId = existingVersionByHash?.id ?? `version:${projectId}:${hashBytes(`${assetId}:${revision}`)}`;
    if (!existingVersionByHash)
      await this.safeWriteBytes(state, adoptedPath, bytes, true);
    const inspection = await inspectMediaFile(resolve3(state.root, ...adoptedPath.split("/")));
    const existingMetadata = logicalAsset ? parseJson(logicalAsset.metadata_json, {}) : {};
    const name = logicalAsset?.name?.trim() ?? "";
    const tags = logicalAsset?.tags_json ? parseJson(logicalAsset.tags_json, []) : [];
    const metadata = {
      ...existingMetadata,
      ...inspection.metadata ?? {},
      ...candidate ? parseJson(candidate.metadata_json, {}) : {},
      ...input.metadata ?? {},
      ...name ? { name } : {},
      ...tags.length > 0 ? { tags } : {}
    };
    const metadataJson = jsonStringify(metadata);
    const metadataRevision = hashBytes(metadataJson);
    const createdAt = nowIso();
    const logicalPath = logicalAsset?.path ?? desiredPath;
    db.prepare(`
      INSERT INTO assets(project_id, id, path, kind, mime_type, name, tags_json, metadata_revision, revision, size, width, height, duration_ms, frame_count, metadata_json, current_version_id, deleted, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
      ON CONFLICT(project_id, id) DO UPDATE SET path=excluded.path, kind=excluded.kind, mime_type=excluded.mime_type,
        revision=excluded.revision, size=excluded.size, width=excluded.width, height=excluded.height,
        duration_ms=excluded.duration_ms, frame_count=excluded.frame_count, metadata_json=excluded.metadata_json,
        metadata_revision=excluded.metadata_revision,
        current_version_id=excluded.current_version_id, deleted=0, updated_at=excluded.updated_at
    `).run(projectId, assetId, logicalPath, inspection.kind, inspection.mimeType, name, jsonStringify(tags), metadataRevision, revision, inspection.size, inspection.width ?? null, inspection.height ?? null, inspection.durationMs ?? null, inspection.frameCount ?? null, metadataJson, versionId, createdAt);
    db.prepare(`
      INSERT INTO asset_versions(project_id, id, asset_id, path, revision, mime_type, size, width, height, duration_ms, frame_count, source, candidate_id, metadata_json, created_at, adopted)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'adopted', ?, ?, ?, 1)
      ON CONFLICT(project_id, id) DO NOTHING
    `).run(projectId, versionId, assetId, adoptedPath, revision, inspection.mimeType, inspection.size, inspection.width ?? null, inspection.height ?? null, inspection.durationMs ?? null, inspection.frameCount ?? null, candidate?.id ?? null, metadataJson, createdAt);
    await this.writeManifest(projectId);
    const output = db.prepare("SELECT * FROM assets WHERE project_id = ? AND id = ? AND deleted = 0").get(projectId, assetId);
    this.notify({ projectId, paths: [logicalPath, adoptedPath], kinds: ["asset", "status"], reason: "adopt" });
    return assetFromRow(output);
  }
  async chooseAdoptPath(state, desiredPath, revision, logicalPath) {
    if (!state.root)
      throw new ContentServiceError("NOT_FOUND", "project root is unavailable.");
    const exists = async (path) => {
      const absolute = resolve3(state.root, ...path.split("/"));
      try {
        const info = await lstat4(absolute);
        if (info.isSymbolicLink())
          throw new ContentServiceError("PATH_ESCAPE", `refusing to adopt through a symlink: ${path}`);
        return true;
      } catch (error) {
        if (error instanceof ContentServiceError)
          throw error;
        if (error.code === "ENOENT")
          return false;
        throw error;
      }
    };
    if (!await exists(desiredPath) && desiredPath !== logicalPath)
      return desiredPath;
    const extension = extname2(desiredPath);
    const stem = extension ? desiredPath.slice(0, -extension.length) : desiredPath;
    const suffix = `.${revision.slice(0, 16)}`;
    for (let index = 0;index < 1000; index += 1) {
      const candidate = `${stem}${suffix}${index === 0 ? "" : `-${index}`}${extension}`;
      if (!await exists(candidate))
        return candidate;
    }
    throw new ContentServiceError("CONTENT_CONFLICT", `unable to allocate an immutable path for ${desiredPath}.`);
  }
  async readVersionBytes(state, version) {
    if (!state.root)
      throw new ContentServiceError("NOT_FOUND", "project root is unavailable.");
    const absolute = await this.safeExistingPath(state, version.path);
    if (!absolute)
      throw new ContentServiceError("NOT_FOUND", "asset version file is unavailable.");
    return readFile8(absolute);
  }
  async loadManifest(projectId) {
    const cached = this.manifestCache.get(projectId);
    if (cached)
      return cached;
    const project = this.project(projectId);
    const projectPath = project.root ? resolve3(project.root, ASSET_DIRECTORY, MANIFEST_FILE_NAME) : undefined;
    const workaPath = resolve3(this.dataRoot, `${projectId}-${MANIFEST_FILE_NAME}`);
    const sharedPath = resolve3(this.dataRoot, MANIFEST_FILE_NAME);
    let parsed;
    try {
      parsed = projectPath ? JSON.parse(await readFile8(projectPath, "utf8")) : undefined;
    } catch {
      try {
        parsed = JSON.parse(await readFile8(workaPath, "utf8"));
      } catch {
        try {
          parsed = JSON.parse(await readFile8(sharedPath, "utf8"));
        } catch {
          parsed = undefined;
        }
      }
    }
    const record = asRecord(parsed);
    const assets = Array.isArray(record?.assets) ? record.assets.filter((value) => {
      const item = asRecord(value);
      return typeof item?.id === "string" && typeof item.path === "string";
    }) : [];
    const manifest = {
      schemaVersion: 1,
      assets,
      entriesByPath: new Map(assets.map((asset) => [asset.path, asset])),
      entriesByFilePath: new Map
    };
    for (const asset of assets) {
      manifest.entriesByFilePath.set(asset.path, asset);
      if (asset.currentPath)
        manifest.entriesByFilePath.set(asset.currentPath, asset);
      for (const version of asset.versions ?? []) {
        if (!manifest.entriesByFilePath.has(version.path))
          manifest.entriesByFilePath.set(version.path, asset);
      }
    }
    this.manifestCache.set(projectId, manifest);
    return manifest;
  }
  async writeManifest(projectId) {
    const manifest = await this.loadManifest(projectId);
    const db = this.getDatabase();
    const rows = db.prepare("SELECT * FROM assets WHERE project_id = ? AND deleted = 0 ORDER BY path").all(projectId);
    manifest.assets = rows.map((row) => ({
      id: row.id,
      path: row.path,
      ...row.name ? { name: row.name } : {},
      ...row.tags_json ? { tags: parseJson(row.tags_json, []) } : {},
      metadata: parseJson(row.metadata_json, {}),
      ...row.metadata_revision ? { metadataRevision: row.metadata_revision } : {},
      ...row.current_version_id ? (() => {
        const current = db.prepare("SELECT path FROM asset_versions WHERE project_id = ? AND id = ?").get(projectId, row.current_version_id);
        return current?.path && current.path !== row.path ? { currentPath: current.path } : {};
      })() : {},
      ...row.current_version_id ? { currentVersionId: row.current_version_id } : {},
      versions: db.prepare("SELECT id, path, revision, mime_type, metadata_json FROM asset_versions WHERE project_id = ? AND asset_id = ? ORDER BY created_at").all(projectId, row.id).map((version) => ({
        id: version.id,
        path: version.path,
        revision: version.revision,
        mimeType: version.mime_type,
        metadata: parseJson(version.metadata_json, {})
      }))
    }));
    manifest.entriesByPath = new Map(manifest.assets.map((asset) => [asset.path, asset]));
    manifest.entriesByFilePath = new Map;
    for (const asset of manifest.assets) {
      manifest.entriesByFilePath.set(asset.path, asset);
      if (asset.currentPath)
        manifest.entriesByFilePath.set(asset.currentPath, asset);
      for (const version of asset.versions ?? []) {
        if (!manifest.entriesByFilePath.has(version.path))
          manifest.entriesByFilePath.set(version.path, asset);
      }
    }
    const project = this.project(projectId);
    if (!project.root)
      throw new ContentServiceError("NOT_FOUND", "project root is unavailable.");
    await this.safeWriteText(project, `${ASSET_DIRECTORY}/${MANIFEST_FILE_NAME}`, `${JSON.stringify(manifest, null, 2)}
`);
  }
}
function normalizeAssetDestination(value) {
  const normalized = normalizeRelativePath(value, "asset path");
  if (normalized === ASSET_DIRECTORY || !normalized.startsWith(`${ASSET_DIRECTORY}/`)) {
    return `${ASSET_DIRECTORY}/${basename(normalized)}`;
  }
  return normalized;
}
function requireCardRecord(value) {
  const record = asRecord(value);
  if (!record)
    throw new ContentServiceError("VALIDATION_ERROR", "card must be an object.");
  return record;
}
function requireCardString(record, field) {
  const value = record[field];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ContentServiceError("VALIDATION_ERROR", `card.${field} must be a non-empty string.`);
  }
  return value;
}
function requireFiniteNumber(record, field) {
  if (typeof record[field] !== "number" || !Number.isFinite(record[field])) {
    throw new ContentServiceError("VALIDATION_ERROR", `card.${field} must be a finite number.`);
  }
}
function requireBoolean(record, field) {
  if (typeof record[field] !== "boolean")
    throw new ContentServiceError("VALIDATION_ERROR", `card.${field} must be boolean.`);
}
function requireArray(record, field, required = false) {
  const value = record[field];
  if (value === undefined && !required)
    return;
  if (!Array.isArray(value))
    throw new ContentServiceError("VALIDATION_ERROR", `card.${field} must be an array.`);
  return value;
}
function validateEffect(value, context) {
  const effect = asRecord(value);
  if (!effect)
    throw new ContentServiceError("VALIDATION_ERROR", `${context} must be an object.`);
  const actions = effect.actions;
  if (actions !== undefined && !Array.isArray(actions))
    throw new ContentServiceError("VALIDATION_ERROR", `${context}.actions must be an array.`);
  const conditions = effect.conditions;
  if (conditions !== undefined && !Array.isArray(conditions))
    throw new ContentServiceError("VALIDATION_ERROR", `${context}.conditions must be an array.`);
  const schema = asRecord(effect.schema);
  if (effect.schema !== undefined && !schema)
    throw new ContentServiceError("VALIDATION_ERROR", `${context}.schema must be an object.`);
  if (schema) {
    if (!asRecord(schema.event))
      throw new ContentServiceError("VALIDATION_ERROR", `${context}.schema.event must be an object.`);
    if (!Array.isArray(schema.actions))
      throw new ContentServiceError("VALIDATION_ERROR", `${context}.schema.actions must be an array.`);
  }
}
function validateCard(value) {
  const card = requireCardRecord(value);
  const id = requireCardString(card, "id");
  if (!/^[A-Za-z0-9_.:-]+$/u.test(id))
    throw new ContentServiceError("VALIDATION_ERROR", "card.id contains unsupported characters.");
  requireCardString(card, "name");
  requireCardString(card, "description");
  const kind = requireCardString(card, "kind");
  if (!CARD_KINDS.has(kind))
    throw new ContentServiceError("VALIDATION_ERROR", `card.kind must be one of ${[...CARD_KINDS].join(", ")}.`);
  const rarity = requireCardString(card, "rarity");
  if (!CARD_RARITIES.has(rarity))
    throw new ContentServiceError("VALIDATION_ERROR", `card.rarity is not recognized: ${rarity}`);
  if (card.labels !== undefined && (!Array.isArray(card.labels) || card.labels.some((label) => typeof label !== "string"))) {
    throw new ContentServiceError("VALIDATION_ERROR", "card.labels must be an array of strings.");
  }
  if (card.limitPerDeck !== undefined && (typeof card.limitPerDeck !== "number" || !Number.isInteger(card.limitPerDeck) || card.limitPerDeck < 1)) {
    throw new ContentServiceError("VALIDATION_ERROR", "card.limitPerDeck must be a positive integer.");
  }
  switch (kind) {
    case "unit":
      requireCardString(card, "realmId");
      requireCardString(card, "race");
      requireFiniteNumber(card, "attack");
      requireFiniteNumber(card, "health");
      requireArray(card, "linggen");
      requireArray(card, "gongfaIds");
      break;
    case "artifact":
      requireCardString(card, "gradeId");
      if (card.equipTarget !== "unit" && card.equipTarget !== "player" && card.equipTarget !== "field")
        throw new ContentServiceError("VALIDATION_ERROR", "artifact.equipTarget must be unit, player, or field.");
      requireArray(card, "elements", true);
      if (card.attackBonus !== undefined)
        requireFiniteNumber(card, "attackBonus");
      if (card.healthBonus !== undefined)
        requireFiniteNumber(card, "healthBonus");
      break;
    case "talisman":
      requireBoolean(card, "isInstant");
      requireCardString(card, "target");
      requireArray(card, "effects", true);
      break;
    case "field":
      requireBoolean(card, "symmetric");
      requireArray(card, "effects", true);
      break;
    case "skill":
      requireCardString(card, "cooldownType");
      requireArray(card, "effects", true);
      break;
    case "pill":
      if (typeof card.grade !== "number" || !Number.isInteger(card.grade) || card.grade < 1 || card.grade > 9)
        throw new ContentServiceError("VALIDATION_ERROR", "pill.grade must be an integer from 1 to 9.");
      requireBoolean(card, "isInstant");
      requireCardString(card, "target");
      requireArray(card, "effects", true);
      break;
  }
  for (const [field, value] of Object.entries(card)) {
    if (field === "effects" && Array.isArray(value))
      value.forEach((effect, index) => validateEffect(effect, `card.effects[${index}]`));
  }
  return card;
}
function createContentService(options) {
  return new ContentServiceImpl(options);
}

// plugins/cardgame-content/src/workflow.ts
import { createHash as createHash9, randomUUID as randomUUID7 } from "node:crypto";
import { mkdir as mkdir7, readFile as readFile9, rename as rename7, writeFile as writeFile6 } from "node:fs/promises";
import { join as join6 } from "node:path";
var WORKFLOW_SCHEMA_VERSION = 1;
var WORKFLOW_PAGE_SIZE = 100;
var WORKFLOW_SCALE_TARGETS = { todos: 1e4, productions: 1e4 };

class WorkflowError extends Error {
  code;
  details;
  constructor(code, message, details) {
    super(message);
    this.name = "WorkflowError";
    this.code = code;
    this.details = details;
  }
}

class WorkflowConflictError extends WorkflowError {
  constructor(message = "工作流记录已被修改，请重新读取", details) {
    super("conflict", message, details);
    this.name = "WorkflowConflictError";
  }
}

class WorkflowRequestIdReuseError extends WorkflowError {
  constructor(message = "requestId 已用于另一份请求", details) {
    super("request-id-reuse", message, details);
    this.name = "WorkflowRequestIdReuseError";
  }
}
var DATABASE_FILE = "cardgame-workflow.sqlite";
var FALLBACK_FILE = "cardgame-workflow.json";
function key(projectId, id) {
  return `${projectId}\x00${id}`;
}
function clone2(value) {
  if (value === undefined)
    return value;
  return JSON.parse(JSON.stringify(value));
}
function stable(value) {
  if (value === null || typeof value !== "object") {
    if (typeof value === "number" && !Number.isFinite(value))
      throw new Error("JSON 数字无效");
    return JSON.stringify(value);
  }
  if (Array.isArray(value))
    return `[${value.map(stable).join(",")}]`;
  const object = value;
  return `{${Object.keys(object).sort().map((name) => `${JSON.stringify(name)}:${stable(object[name])}`).join(",")}}`;
}
function digest4(value) {
  return createHash9("sha256").update(stable(value)).digest("hex");
}
function iso(now) {
  return new Date(now).toISOString();
}
function text(value, name, required = true) {
  if (typeof value !== "string" || !value.trim()) {
    if (!required)
      return "";
    throw new WorkflowError("invalid-input", `${name} 不能为空`);
  }
  return value.trim();
}
function optionalText(value) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
function normalizeTodoImages(value) {
  if (value == null)
    return [];
  if (!Array.isArray(value) || value.length > 3)
    throw new WorkflowError("invalid-input", "最多添加 3 张图片");
  let totalLength = 0;
  return value.map((candidate, index) => {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate))
      throw new WorkflowError("invalid-input", "图片附件格式无效");
    const raw = candidate;
    const dataUrl = typeof raw.dataUrl === "string" ? raw.dataUrl : "";
    if (!/^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(dataUrl))
      throw new WorkflowError("invalid-input", "仅支持 PNG、JPG、WebP 或 GIF 图片");
    if (dataUrl.length > 600000)
      throw new WorkflowError("invalid-input", "图片压缩后仍然过大，请换一张图片");
    totalLength += dataUrl.length;
    if (totalLength > 900000)
      throw new WorkflowError("invalid-input", "图片附件总大小过大，请减少图片数量或换小图");
    const id = optionalText(raw.id)?.slice(0, 120) ?? `image-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`;
    const type = dataUrl.slice(5, dataUrl.indexOf(";"));
    const name = optionalText(raw.name)?.slice(0, 128);
    const width = typeof raw.width === "number" && Number.isFinite(raw.width) && raw.width > 0 ? Math.min(4096, Math.round(raw.width)) : undefined;
    const height = typeof raw.height === "number" && Number.isFinite(raw.height) && raw.height > 0 ? Math.min(4096, Math.round(raw.height)) : undefined;
    return { id, dataUrl, type, ...name ? { name } : {}, ...width ? { width } : {}, ...height ? { height } : {} };
  });
}
function integer2(value, fallback) {
  if (value === undefined && fallback !== undefined)
    return fallback;
  const result = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(result) || result < 0)
    throw new WorkflowError("invalid-input", "revision 必须是非负整数");
  return result;
}
function limitOf(value) {
  if (value === undefined)
    return WORKFLOW_PAGE_SIZE;
  const result = Number(value);
  if (!Number.isInteger(result) || result < 1)
    throw new WorkflowError("invalid-input", "limit 必须是正整数");
  return Math.min(WORKFLOW_PAGE_SIZE, result);
}
function encodeCursor2(value) {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
}
function decodeCursor2(value) {
  if (value === undefined || value === null || value === "")
    return;
  if (typeof value !== "string")
    throw new WorkflowError("invalid-input", "cursor 无效");
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      throw new Error("cursor");
    return parsed;
  } catch {
    throw new WorkflowError("invalid-input", "cursor 无效");
  }
}
function normalizeRefs(value) {
  if (value === undefined || value === null)
    return [];
  if (!Array.isArray(value))
    throw new WorkflowError("invalid-input", "pinnedRefs 必须是数组");
  return value.map((entry, index) => {
    if (typeof entry === "string")
      return { path: entry };
    if (!entry || typeof entry !== "object" || Array.isArray(entry))
      throw new WorkflowError("invalid-input", `pinnedRefs[${index}] 无效`);
    return clone2(entry);
  });
}
function normalizeCandidates(value, identitySeed) {
  if (value === undefined || value === null)
    return [];
  if (!Array.isArray(value))
    throw new WorkflowError("invalid-input", "candidateRefs 必须是数组");
  return value.map((entry, index) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry))
      throw new WorkflowError("invalid-input", `candidateRefs[${index}] 无效`);
    const candidate = clone2(entry);
    if (!candidate.id && !candidate.key && !candidate.assetId) {
      const source = optionalText(candidate.sourcePath ?? candidate.path ?? candidate.name ?? candidate.fileName);
      if (!source)
        throw new WorkflowError("invalid-input", `candidateRefs[${index}] 缺少稳定 id 或 sourcePath`);
      candidate.id = `candidate:${digest4({ seed: identitySeed ?? "candidate", index, source }).slice(0, 32)}`;
    }
    return candidate;
  });
}
function normalizeStatus(value) {
  if (value === "todo" || value === "in_progress" || value === "done" || value === "blocked")
    return value;
  if (value === "in-progress" || value === "in progress")
    return "in_progress";
  throw new WorkflowError("invalid-input", "Todo status 无效");
}
function normalizePriority(value) {
  if (value === undefined || value === null || value === "")
    return "medium";
  if (value === "low" || value === "medium" || value === "high")
    return value;
  throw new WorkflowError("invalid-input", "Todo priority 无效");
}
function requestId(value, fallback) {
  const result = optionalText(value);
  if (!result)
    return fallback;
  if (result.length > 300)
    throw new WorkflowError("invalid-input", "requestId 过长");
  return result;
}
function connectionCompleted(receipt) {
  return receipt.status === "completed";
}
function defaultScope(value) {
  if (value === undefined || value === null)
    return ["仅处理当前目标和明确范围", "保留可核对结论", "不要自动合并、发布或扩大范围"];
  if (!Array.isArray(value))
    throw new WorkflowError("invalid-input", "scope 必须是数组");
  const result = value.filter((item) => typeof item === "string" && Boolean(item.trim())).map((item) => item.trim());
  return result.length ? [...new Set(result)] : ["仅处理当前目标和明确范围"];
}
function deepLinkPart(value) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new WorkflowError("invalid-input", "深链接对象无效");
  const context = clone2(value);
  text(context.projectId, "projectId");
  if (!["knowledge", "card", "asset", "production", "todo", "preview"].includes(context.kind))
    throw new WorkflowError("invalid-input", "深链接 kind 无效");
  return context;
}
class DurableWorkflowStore {
  dataRoot;
  dbPath;
  fallbackPath;
  native;
  state;
  constructor(dataRoot, dbPath, fallbackPath, native, state) {
    this.dataRoot = dataRoot;
    this.dbPath = dbPath;
    this.fallbackPath = fallbackPath;
    this.native = native;
    this.state = state;
  }
  static async open(dataRoot) {
    const dbPath = dataRoot === ":memory:" ? ":memory:" : join6(dataRoot, DATABASE_FILE);
    const fallbackPath = dataRoot === ":memory:" ? ":memory:" : join6(dataRoot, FALLBACK_FILE);
    if (dataRoot !== ":memory:")
      await mkdir7(dataRoot, { recursive: true });
    const store = new DurableWorkflowStore(dataRoot, dbPath, fallbackPath);
    try {
      let DatabaseCtor;
      let bunDatabase = false;
      try {
        const bunSqlite = await import("bun:sqlite");
        DatabaseCtor = bunSqlite.Database;
        bunDatabase = true;
      } catch {
        const sqlite = await import("node:sqlite");
        DatabaseCtor = sqlite.DatabaseSync;
      }
      store.native = bunDatabase ? new DatabaseCtor(dbPath) : new DatabaseCtor(dbPath, { timeout: 5000, enableForeignKeyConstraints: true });
      store.native.exec(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS todos (
          project_id TEXT NOT NULL,
          id TEXT NOT NULL,
          title TEXT NOT NULL,
          status TEXT NOT NULL,
          priority TEXT NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          revision INTEGER NOT NULL,
          payload_json TEXT NOT NULL,
          PRIMARY KEY (project_id, id)
        );
        CREATE INDEX IF NOT EXISTS todos_page ON todos(project_id, updated_at DESC, id DESC);
        CREATE INDEX IF NOT EXISTS todos_status_page ON todos(project_id, status, updated_at DESC, id DESC);
        CREATE TABLE IF NOT EXISTS productions (
          project_id TEXT NOT NULL,
          id TEXT NOT NULL,
          todo_id TEXT,
          brief TEXT NOT NULL,
          status TEXT NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          revision INTEGER NOT NULL,
          requirement_revision INTEGER NOT NULL DEFAULT 1,
          round_count INTEGER NOT NULL DEFAULT 0,
          current_round INTEGER,
          candidate_count INTEGER NOT NULL DEFAULT 0,
          payload_json TEXT NOT NULL,
          PRIMARY KEY (project_id, id)
        );
        CREATE INDEX IF NOT EXISTS productions_page ON productions(project_id, updated_at DESC, id DESC);
        CREATE INDEX IF NOT EXISTS productions_status_page ON productions(project_id, status, updated_at DESC, id DESC);
        CREATE INDEX IF NOT EXISTS productions_todo ON productions(project_id, todo_id);
        CREATE TABLE IF NOT EXISTS workflow_history (
          event_id INTEGER PRIMARY KEY AUTOINCREMENT,
          project_id TEXT NOT NULL,
          item_id TEXT NOT NULL,
          kind TEXT NOT NULL,
          event TEXT NOT NULL,
          revision INTEGER NOT NULL,
          payload_json TEXT NOT NULL,
          created_at TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS workflow_history_page ON workflow_history(project_id, kind, item_id, event_id DESC);
        CREATE TABLE IF NOT EXISTS workflow_requests (
          project_id TEXT NOT NULL,
          request_id TEXT NOT NULL,
          operation TEXT NOT NULL,
          fingerprint TEXT NOT NULL,
          production_id TEXT,
          todo_id TEXT,
          round INTEGER,
          requirement_revision INTEGER,
          status TEXT NOT NULL,
          payload_json TEXT,
          result_json TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          PRIMARY KEY (project_id, request_id)
        );
      `);
      for (const statement of [
        "ALTER TABLE productions ADD COLUMN requirement_revision INTEGER NOT NULL DEFAULT 1",
        "ALTER TABLE productions ADD COLUMN round_count INTEGER NOT NULL DEFAULT 0",
        "ALTER TABLE productions ADD COLUMN current_round INTEGER",
        "ALTER TABLE productions ADD COLUMN candidate_count INTEGER NOT NULL DEFAULT 0"
      ]) {
        try {
          store.native.exec(statement);
        } catch {}
      }
      store.native.exec("CREATE INDEX IF NOT EXISTS productions_round_page ON productions(project_id, round_count, updated_at DESC, id DESC)");
    } catch {
      store.native = undefined;
      store.state = await store.readFallback();
    }
    if (!store.native && !store.state)
      store.state = await store.readFallback();
    return store;
  }
  async readFallback() {
    if (this.fallbackPath === ":memory:")
      return emptyState();
    try {
      const parsed = JSON.parse(await readFile9(this.fallbackPath, "utf8"));
      return {
        schemaVersion: WORKFLOW_SCHEMA_VERSION,
        nextHistoryId: Number(parsed.nextHistoryId) || 1,
        todos: parsed.todos ?? {},
        productions: parsed.productions ?? {},
        history: parsed.history ?? [],
        requests: parsed.requests ?? {}
      };
    } catch (error) {
      if (error.code === "ENOENT")
        return emptyState();
      throw error;
    }
  }
  ensureFallback() {
    if (!this.state)
      throw new Error("workflow fallback 未打开");
    return this.state;
  }
  statement(sql) {
    if (!this.native)
      throw new Error("workflow sqlite 未打开");
    return this.native.prepare(sql);
  }
  async flush() {
    if (this.native || this.fallbackPath === ":memory:")
      return;
    const temporary = `${this.fallbackPath}.${process.pid}.${randomUUID7()}.tmp`;
    await writeFile6(temporary, JSON.stringify(this.ensureFallback()), "utf8");
    await rename7(temporary, this.fallbackPath);
  }
  getTodo(projectId, id) {
    if (this.native) {
      const row = this.statement("SELECT payload_json FROM todos WHERE project_id = ? AND id = ?").get(projectId, id);
      return row?.payload_json ? JSON.parse(row.payload_json) : undefined;
    }
    return clone2(this.ensureFallback().todos[key(projectId, id)]);
  }
  listTodos(projectId) {
    if (this.native) {
      return this.statement("SELECT payload_json FROM todos WHERE project_id = ?").all(projectId).map((row) => JSON.parse(String(row.payload_json)));
    }
    return Object.values(this.ensureFallback().todos).filter((row) => row.projectId === projectId).map(clone2);
  }
  todoFilter(projectId, input) {
    const status = input.status === undefined ? undefined : normalizeStatus(input.status), q = optionalText(input.q ?? input.search)?.replace(/[A-Z]/g, (char) => char.toLowerCase()), category = optionalText(input.category);
    const clauses = ["project_id = ?"], params = [projectId];
    if (status) {
      clauses.push("status = ?");
      params.push(status);
    }
    if (category) {
      clauses.push("json_extract(payload_json,'$.category') = ?");
      params.push(category);
    }
    if (input.id) {
      clauses.push("id = ?");
      params.push(input.id);
    }
    if (q) {
      clauses.push("(instr(lower(title),?) > 0 OR instr(lower(COALESCE(json_extract(payload_json,'$.description'),'')),?) > 0)");
      params.push(q, q);
    }
    const matches = (item) => (!status || item.status === status) && (!category || item.category === category) && (!input.id || item.id === input.id) && (!q || [item.title, item.description ?? ""].some((value) => value.replace(/[A-Z]/g, (char) => char.toLowerCase()).includes(q)));
    return { where: clauses.join(" AND "), params, matches };
  }
  listTodoSummaries(projectId, input) {
    const filter = this.todoFilter(projectId, input);
    if (!this.native)
      return Object.values(this.ensureFallback().todos).filter(filter.matches).filter((item) => item.projectId === projectId).sort(todoOrder).map(todoSummary);
    const rows = this.statement(`SELECT project_id AS projectId,id,substr(title,1,160) AS title,length(title)>160 AS titleTruncated,status,priority,created_at AS createdAt,updated_at AS updatedAt,revision,
      json_extract(payload_json,'$.requirementRevision') AS requirementRevision,json_extract(payload_json,'$.completed') AS completed,
      substr(json_extract(payload_json,'$.description'),1,240) AS description,length(json_extract(payload_json,'$.description'))>240 AS descriptionTruncated,
      substr(json_extract(payload_json,'$.conclusion'),1,240) AS conclusion,length(json_extract(payload_json,'$.conclusion'))>240 AS conclusionTruncated,
      json_extract(payload_json,'$.category') AS category,json_extract(payload_json,'$.dueDate') AS dueDate,json_extract(payload_json,'$.taskId') AS taskId,json_extract(payload_json,'$.execution.delegationId') AS delegationId,json_extract(payload_json,'$.productionId') AS productionId,
      COALESCE(json_array_length(payload_json,'$.images'),0) AS imageCount,
      (SELECT json_group_array(json_extract(value,'$.name')) FROM json_each(payload_json,'$.images') WHERE json_extract(value,'$.name') IS NOT NULL) AS imageNames,
      json_type(payload_json,'$.delivery') IS NOT NULL AS hasDelivery
      FROM todos WHERE ${filter.where} ORDER BY updated_at DESC,id DESC`).all(...filter.params);
    return rows.map((row) => todoSummarySchema.parse(cleanTodoProjection({ ...row, imageNames: JSON.parse(String(row.imageNames ?? "[]")), ...Object.fromEntries(["completed", "titleTruncated", "descriptionTruncated", "conclusionTruncated", "hasDelivery"].map((name) => [name, row[name] == null ? undefined : Boolean(row[name])])) })));
  }
  todoTexts(projectId, input) {
    const filter = this.todoFilter(projectId, input);
    const index = this.native ? this.statement(`SELECT id,revision,updated_at AS updatedAt FROM todos WHERE ${filter.where} ORDER BY updated_at DESC,id DESC`).all(...filter.params) : Object.values(this.ensureFallback().todos).filter((item) => item.projectId === projectId && filter.matches(item)).sort(todoOrder).map(({ id, revision, updatedAt }) => ({ id, revision, updatedAt }));
    const revision = digest4(index.map((item) => [item.id, item.revision, item.updatedAt]));
    const read = this.native ? this.statement(`SELECT project_id AS projectId,id,title,status,priority,created_at AS createdAt,updated_at AS updatedAt,revision,
      json_extract(payload_json,'$.requirementRevision') AS requirementRevision,json_extract(payload_json,'$.completed') AS completed,json_extract(payload_json,'$.description') AS description,
      json_extract(payload_json,'$.category') AS category,json_extract(payload_json,'$.dueDate') AS dueDate,json_extract(payload_json,'$.taskId') AS taskId,json_extract(payload_json,'$.execution.delegationId') AS delegationId,json_extract(payload_json,'$.productionId') AS productionId
      FROM todos WHERE project_id = ? AND id = ?`) : undefined;
    return { revision, rows: { length: index.length, at: (position) => {
      const expected = index[position];
      if (!expected)
        return;
      const row = read ? read.get(projectId, expected.id) : this.ensureFallback().todos[key(projectId, expected.id)];
      if (!row || row.revision !== expected.revision || row.updatedAt !== expected.updatedAt)
        throw Object.assign(new Error("Todo collection changed; restart pagination"), { code: "collection-stale" });
      const item = todoTextSchema.parse(cleanTodoProjection({ ...row, ...!read && typeof row.execution?.delegationId === "string" ? { delegationId: row.execution.delegationId } : {}, ...row.completed == null ? {} : { completed: Boolean(row.completed) } }));
      return { ...item, ...typeof input.projectGeneration === "string" ? { projectGeneration: input.projectGeneration } : {} };
    } } };
  }
  todoCategories(projectId) {
    const rows = this.native ? this.statement("SELECT json_extract(payload_json,'$.category') AS category,COUNT(*) AS count FROM todos WHERE project_id = ? AND json_type(payload_json,'$.category') = 'text' AND json_extract(payload_json,'$.category') <> '' GROUP BY category").all(projectId) : (() => {
      const counts = new Map;
      for (const item of Object.values(this.ensureFallback().todos))
        if (item.projectId === projectId && typeof item.category === "string" && item.category)
          counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
      return [...counts].map(([category, count]) => ({ category, count }));
    })();
    return rows.map((row) => ({ category: row.category, count: Number(row.count) })).sort((left, right) => left.category < right.category ? -1 : left.category > right.category ? 1 : 0);
  }
  countTodos(projectId) {
    if (this.native)
      return Number(this.statement("SELECT COUNT(*) AS count FROM todos WHERE project_id = ?").get(projectId).count);
    return this.listTodos(projectId).length;
  }
  countTodosByStatus(projectId, status) {
    if (this.native)
      return Number(this.statement("SELECT COUNT(*) AS count FROM todos WHERE project_id = ? AND status = ?").get(projectId, status).count);
    return this.listTodos(projectId).filter((item) => item.status === status).length;
  }
  putTodo(todo) {
    if (this.native) {
      this.statement(`INSERT INTO todos(project_id,id,title,status,priority,created_at,updated_at,revision,payload_json)
        VALUES(?,?,?,?,?,?,?,?,?) ON CONFLICT(project_id,id) DO UPDATE SET title=excluded.title,status=excluded.status,priority=excluded.priority,updated_at=excluded.updated_at,revision=excluded.revision,payload_json=excluded.payload_json`).run(todo.projectId, todo.id, todo.title, todo.status, todo.priority, todo.createdAt, todo.updatedAt, todo.revision, JSON.stringify(todo));
      return;
    }
    this.ensureFallback().todos[key(todo.projectId, todo.id)] = clone2(todo);
  }
  deleteTodo(projectId, id) {
    if (this.native) {
      const result = this.statement("DELETE FROM todos WHERE project_id = ? AND id = ?").run(projectId, id);
      return Number(result.changes ?? 0) > 0;
    }
    const todos = this.ensureFallback().todos;
    const todoKey = key(projectId, id);
    if (!todos[todoKey])
      return false;
    delete todos[todoKey];
    return true;
  }
  getProduction(projectId, id) {
    if (this.native) {
      const row = this.statement("SELECT payload_json FROM productions WHERE project_id = ? AND id = ?").get(projectId, id);
      return row?.payload_json ? JSON.parse(row.payload_json) : undefined;
    }
    return clone2(this.ensureFallback().productions[key(projectId, id)]);
  }
  listProductions(projectId) {
    if (this.native) {
      return this.statement("SELECT payload_json FROM productions WHERE project_id = ?").all(projectId).map((row) => JSON.parse(String(row.payload_json)));
    }
    return Object.values(this.ensureFallback().productions).filter((row) => row.projectId === projectId).map(clone2);
  }
  listProductionsPage(projectId, input) {
    const limit = limitOf(input.limit);
    const cursor = decodeCursor2(input.cursor);
    const status = optionalText(input.status);
    const todoId = optionalText(input.todoId);
    const q = optionalText(input.q ?? input.search)?.toLocaleLowerCase();
    if (this.native) {
      const clauses = ["project_id = ?"];
      const params = [projectId];
      if (status) {
        clauses.push("status = ?");
        params.push(status);
      }
      if (todoId) {
        clauses.push("todo_id = ?");
        params.push(todoId);
      }
      if (q) {
        clauses.push("(lower(brief) LIKE ? OR lower(id) LIKE ? OR lower(todo_id) LIKE ?)");
        params.push(`%${q}%`, `%${q}%`, `%${q}%`);
      }
      if (cursor?.updatedAt !== undefined && cursor.id !== undefined) {
        clauses.push("(updated_at < ? OR (updated_at = ? AND id < ?))");
        params.push(String(cursor.updatedAt), String(cursor.updatedAt), String(cursor.id));
      }
      const rows = this.statement(`SELECT project_id,id,todo_id,brief,status,created_at,updated_at,revision,requirement_revision,round_count,current_round,candidate_count,json_array_length(payload_json,'$.gameCandidates') AS game_candidate_count,json_extract(payload_json,'$.batch.kind') AS workflow_kind,json_extract(payload_json,'$.batch.progress') AS card_progress,json_extract(payload_json,'$.batch.deck') AS deck_plan FROM productions WHERE ${clauses.join(" AND ")} ORDER BY updated_at DESC,id DESC LIMIT ?`).all(...params, limit + 1);
      const hasNext = rows.length > limit;
      const items = rows.slice(0, limit).map((row) => productionListItemFromSql(row));
      const totalParams = [projectId, ...status ? [status] : [], ...todoId ? [todoId] : [], ...q ? [`%${q}%`, `%${q}%`, `%${q}%`] : []];
      const snapshot = this.statement(`SELECT COUNT(*) AS count,(SELECT COALESCE(SUM(revision),0) FROM productions WHERE project_id = ?) AS revisions FROM productions WHERE ${clauses.filter((clause) => !clause.startsWith("(updated_at")).join(" AND ")}`).get(projectId, ...totalParams);
      const total = Number(snapshot.count), revision = String(snapshot.revisions);
      return { projectId, items, limit, total, revision, ...hasNext && items.length ? { nextCursor: encodeCursor2({ updatedAt: items.at(-1).updatedAt, id: items.at(-1).id }) } : {} };
    }
    const all = this.listProductions(projectId);
    const items = all.filter((item) => (!status || item.status === status) && (!todoId || item.todoId === todoId) && (!q || `${item.brief}
${item.id}
${item.todoId ?? ""}`.toLocaleLowerCase().includes(q))).map(productionListItemFromRecord);
    return { ...pageRecords(items, input), revision: String(all.reduce((sum, item) => sum + item.revision, 0)) };
  }
  countProductions(projectId) {
    if (this.native)
      return Number(this.statement("SELECT COUNT(*) AS count FROM productions WHERE project_id = ?").get(projectId).count);
    return this.listProductions(projectId).length;
  }
  countProductionsByStatus(projectId, status) {
    if (this.native)
      return Number(this.statement("SELECT COUNT(*) AS count FROM productions WHERE project_id = ? AND status = ?").get(projectId, status).count);
    return this.listProductions(projectId).filter((item) => item.status === status).length;
  }
  putProduction(production) {
    if (this.native) {
      this.statement(`INSERT INTO productions(project_id,id,todo_id,brief,status,created_at,updated_at,revision,requirement_revision,round_count,current_round,candidate_count,payload_json)
        VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(project_id,id) DO UPDATE SET todo_id=excluded.todo_id,brief=excluded.brief,status=excluded.status,updated_at=excluded.updated_at,revision=excluded.revision,requirement_revision=excluded.requirement_revision,round_count=excluded.round_count,current_round=excluded.current_round,candidate_count=excluded.candidate_count,payload_json=excluded.payload_json`).run(production.projectId, production.id, production.todoId ?? null, production.brief, production.status, production.createdAt, production.updatedAt, production.revision, production.requirementRevision, production.rounds.length, production.rounds.at(-1)?.round ?? null, production.candidateRefs.length, JSON.stringify(production));
      return;
    }
    this.ensureFallback().productions[key(production.projectId, production.id)] = clone2(production);
  }
  findProductionForTodo(projectId, todoId) {
    if (this.native) {
      const row = this.statement("SELECT payload_json FROM productions WHERE project_id = ? AND todo_id = ? ORDER BY updated_at DESC, id DESC LIMIT 1").get(projectId, todoId);
      return row?.payload_json ? JSON.parse(row.payload_json) : undefined;
    }
    return this.listProductions(projectId).filter((item) => item.todoId === todoId).sort(compareRecords)[0];
  }
  addHistory(event) {
    if (this.native) {
      const result = this.statement("INSERT INTO workflow_history(project_id,item_id,kind,event,revision,payload_json,created_at) VALUES(?,?,?,?,?,?,?)").run(event.projectId, event.itemId, event.kind, event.event, event.revision, JSON.stringify(event.payload), event.createdAt);
      return { ...clone2(event), id: Number(result.lastInsertRowid) };
    }
    const state = this.ensureFallback();
    const row = { ...clone2(event), id: state.nextHistoryId++ };
    state.history.push(row);
    return row;
  }
  listHistory(projectId, kind, itemId) {
    if (this.native) {
      return this.statement("SELECT event_id,project_id,item_id,kind,event,revision,payload_json,created_at FROM workflow_history WHERE project_id = ? AND kind = ? AND item_id = ? ORDER BY event_id DESC").all(projectId, kind, itemId).map((row) => {
        const value = row;
        return { id: Number(value.event_id), projectId: value.project_id, itemId: value.item_id, kind: value.kind, event: value.event, revision: Number(value.revision), payload: JSON.parse(value.payload_json), createdAt: value.created_at };
      });
    }
    return this.ensureFallback().history.filter((item) => item.projectId === projectId && item.kind === kind && item.itemId === itemId).sort((a, b) => b.id - a.id).map(clone2);
  }
  listHistoryPage(projectId, kind, itemId, input) {
    const limit = limitOf(input.historyLimit ?? input.limit);
    const cursor = decodeCursor2(input.historyCursor);
    if (this.native) {
      const params = [projectId, kind, itemId];
      const cursorClause = cursor?.id !== undefined ? " AND event_id < ?" : "";
      if (cursor?.id !== undefined)
        params.push(Number(cursor.id));
      const rows = this.statement(`SELECT event_id,project_id,item_id,kind,event,revision,payload_json,created_at FROM workflow_history WHERE project_id = ? AND kind = ? AND item_id = ?${cursorClause} ORDER BY event_id DESC LIMIT ?`).all(...params, limit + 1);
      const hasNext = rows.length > limit;
      const items = rows.slice(0, limit).map((row) => {
        return { id: Number(row.event_id), projectId: String(row.project_id), itemId: String(row.item_id), kind: row.kind, event: String(row.event), revision: Number(row.revision), payload: JSON.parse(String(row.payload_json)), createdAt: String(row.created_at) };
      });
      return { items, limit, ...hasNext && items.length ? { nextCursor: encodeCursor2({ id: items.at(-1).id }) } : {} };
    }
    return pageHistory(this.listHistory(projectId, kind, itemId), input);
  }
  getRequest(projectId, requestId) {
    if (this.native) {
      const row = this.statement(`SELECT project_id,request_id,operation,fingerprint,production_id,todo_id,round,requirement_revision,status,payload_json,result_json,created_at,updated_at
        FROM workflow_requests WHERE project_id = ? AND request_id = ?`).get(projectId, requestId);
      return row ? requestFromSql(row) : undefined;
    }
    return clone2(this.ensureFallback().requests[key(projectId, requestId)]);
  }
  putRequest(row) {
    if (this.native) {
      this.statement(`INSERT INTO workflow_requests(project_id,request_id,operation,fingerprint,production_id,todo_id,round,requirement_revision,status,payload_json,result_json,created_at,updated_at)
        VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(project_id,request_id) DO UPDATE SET operation=excluded.operation,fingerprint=excluded.fingerprint,production_id=excluded.production_id,todo_id=excluded.todo_id,round=excluded.round,requirement_revision=excluded.requirement_revision,status=excluded.status,payload_json=excluded.payload_json,result_json=excluded.result_json,updated_at=excluded.updated_at`).run(row.projectId, row.requestId, row.operation, row.fingerprint, row.productionId ?? null, row.todoId ?? null, row.round ?? null, row.requirementRevision ?? null, row.status, row.payload === undefined ? null : JSON.stringify(row.payload), row.result === undefined ? null : JSON.stringify(row.result), row.createdAt, row.updatedAt);
      return;
    }
    this.ensureFallback().requests[key(row.projectId, row.requestId)] = clone2(row);
  }
  begin() {
    this.native?.exec("BEGIN IMMEDIATE");
  }
  commit() {
    this.native?.exec("COMMIT");
  }
  rollback() {
    this.native?.exec("ROLLBACK");
  }
  async close() {
    await this.flush();
    this.native?.close();
    this.native = undefined;
    this.state = undefined;
  }
}
function emptyState() {
  return { schemaVersion: WORKFLOW_SCHEMA_VERSION, nextHistoryId: 1, todos: {}, productions: {}, history: [], requests: {} };
}
function requestFromSql(row) {
  return {
    projectId: String(row.project_id),
    requestId: String(row.request_id),
    operation: String(row.operation),
    fingerprint: String(row.fingerprint),
    ...row.production_id ? { productionId: String(row.production_id) } : {},
    ...row.todo_id ? { todoId: String(row.todo_id) } : {},
    ...row.round !== null && row.round !== undefined ? { round: Number(row.round) } : {},
    ...row.requirement_revision !== null && row.requirement_revision !== undefined ? { requirementRevision: Number(row.requirement_revision) } : {},
    status: String(row.status),
    ...row.payload_json ? { payload: JSON.parse(String(row.payload_json)) } : {},
    ...row.result_json ? { result: JSON.parse(String(row.result_json)) } : {},
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at)
  };
}
function compareRecords(a, b) {
  if (a.updatedAt !== b.updatedAt)
    return a.updatedAt < b.updatedAt ? 1 : -1;
  return a.id < b.id ? 1 : a.id > b.id ? -1 : 0;
}
function productionListItemFromRecord(production) {
  return {
    ...production.batch?.kind === "card-generation" ? { workflowKind: "card-generation" } : {},
    ...production.batch?.deck ? { deckProgress: { distinctCards: production.batch.deck.entries.length, totalCopies: production.batch.deck.entries.reduce((sum, entry) => sum + entry.count, 0), targetSize: production.batch.deck.targetSize, title: production.batch.deck.title } } : {},
    ...production.batch?.progress ? { cardProgress: production.batch.progress } : {},
    projectId: production.projectId,
    id: production.id,
    brief: production.brief,
    status: production.status,
    ...production.todoId ? { todoId: production.todoId } : {},
    roundCount: production.rounds.length,
    ...production.rounds.at(-1)?.round !== undefined ? { currentRound: production.rounds.at(-1).round } : {},
    candidateCount: production.candidateRefs.length,
    gameCandidateCount: production.gameCandidates?.length ?? 0,
    requirementRevision: production.requirementRevision,
    revision: production.revision,
    createdAt: production.createdAt,
    updatedAt: production.updatedAt
  };
}
function productionListItemFromSql(row) {
  const status = String(row.status);
  return {
    ...row.workflow_kind === "card-generation" ? { workflowKind: "card-generation" } : {},
    ...typeof row.deck_plan === "string" ? (() => {
      const deck = JSON.parse(row.deck_plan);
      return { deckProgress: { distinctCards: deck.entries.length, totalCopies: deck.entries.reduce((sum, entry) => sum + entry.count, 0), targetSize: deck.targetSize, title: deck.title } };
    })() : {},
    ...typeof row.card_progress === "string" ? { cardProgress: JSON.parse(row.card_progress) } : {},
    projectId: String(row.project_id),
    id: String(row.id),
    brief: String(row.brief),
    status,
    ...row.todo_id ? { todoId: String(row.todo_id) } : {},
    roundCount: Number(row.round_count ?? 0),
    ...row.current_round !== null && row.current_round !== undefined ? { currentRound: Number(row.current_round) } : {},
    candidateCount: Number(row.candidate_count ?? 0),
    gameCandidateCount: Number(row.game_candidate_count ?? 0),
    requirementRevision: Number(row.requirement_revision ?? 1),
    revision: Number(row.revision),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at)
  };
}
function pageRecords(items, input) {
  const limit = limitOf(input.limit);
  const cursor = decodeCursor2(input.cursor);
  const sorted = [...items].sort(compareRecords);
  const after = cursor && typeof cursor.updatedAt === "string" && typeof cursor.id === "string" ? sorted.filter((item) => item.updatedAt < cursor.updatedAt || item.updatedAt === cursor.updatedAt && item.id < cursor.id) : sorted;
  const page = after.slice(0, limit);
  const nextCursor = after.length > limit && page.length ? encodeCursor2({ updatedAt: page.at(-1).updatedAt, id: page.at(-1).id }) : undefined;
  return { projectId: String(input.projectId), items: page.map(clone2), ...nextCursor ? { nextCursor } : {}, limit, total: sorted.length };
}
function pageHistory(items, input) {
  const limit = limitOf(input.historyLimit ?? input.limit);
  const cursor = decodeCursor2(input.historyCursor);
  const after = cursor?.id !== undefined ? items.filter((item) => item.id < Number(cursor.id)) : items;
  const page = after.slice(0, limit);
  return { items: page.map(clone2), ...after.length > limit && page.length ? { nextCursor: encodeCursor2({ id: page.at(-1).id }) } : {}, limit };
}
function asRecord2(value) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new WorkflowError("invalid-input", "输入必须是对象");
  return value;
}
function executionBindingFromReceipt(receipt) {
  const result = receipt.result && typeof receipt.result === "object" && !Array.isArray(receipt.result) ? receipt.result : {};
  const raw = receipt.binding ?? receipt.delegation ?? receipt.execution ?? result.binding ?? result.delegation ?? result.execution;
  const binding = raw && typeof raw === "object" && !Array.isArray(raw) ? clone2(raw) : {};
  const deskRaw = receipt.desk ?? result.desk;
  const desk = deskRaw && typeof deskRaw === "object" && !Array.isArray(deskRaw) ? deskRaw : {};
  const deskNoteId = optionalText(binding.deskNoteId ?? binding.noteId ?? receipt.deskNoteId ?? result.deskNoteId ?? desk.noteId ?? receipt.noteId ?? result.noteId);
  const stateRef = optionalText(binding.stateRef ?? binding.delegationStateRef ?? receipt.stateRef ?? result.stateRef ?? desk.stateRef);
  const delegationId = optionalText(binding.delegationId ?? receipt.delegationId ?? result.delegationId);
  const taskId = optionalText(binding.taskId ?? receipt.taskId ?? result.taskId ?? delegationId);
  return {
    ...binding,
    ...deskNoteId ? { deskNoteId } : {},
    ...stateRef ? { stateRef } : {},
    ...delegationId ? { delegationId } : {},
    ...taskId ? { taskId } : {}
  };
}
function statusFromReceipt(receipt) {
  if (receipt.status === "completed")
    return "running";
  if (["queued", "started", "accepted", "running"].includes(receipt.status))
    return receipt.status === "queued" ? "queued" : "running";
  return receipt.status;
}
function taskStatusFromReceipt(receipt) {
  const result = receipt.result && typeof receipt.result === "object" && !Array.isArray(receipt.result) ? receipt.result : {};
  const candidate = result.taskStatus ?? result.executionStatus ?? result.state ?? result.status;
  const value = optionalText(candidate);
  if (!value || value === "completed")
    return;
  return value;
}
var todoMetadataFields = ["projectId", "id", "status", "completed", "priority", "category", "dueDate", "taskId", "productionId", "revision", "requirementRevision", "createdAt", "updatedAt"];
function todoMetadata2(item) {
  return { ...Object.fromEntries(todoMetadataFields.filter((field) => item[field] !== undefined).map((field) => [field, item[field]])), ...typeof item.execution?.delegationId === "string" ? { delegationId: item.execution.delegationId } : {} };
}
function todoOrder(a, b) {
  return Buffer.compare(Buffer.from(b.updatedAt), Buffer.from(a.updatedAt)) || Buffer.compare(Buffer.from(b.id), Buffer.from(a.id));
}
function cleanTodoProjection(row) {
  return Object.fromEntries(Object.entries(row).filter(([, value]) => value !== null && value !== undefined));
}
function todoSummary(item) {
  const excerpt = (name, limit) => {
    if (typeof item[name] !== "string")
      return {};
    const points = Array.from(item[name]);
    return { [name]: points.slice(0, limit).join(""), [name + "Truncated"]: points.length > limit };
  };
  return todoSummarySchema.parse({ ...todoMetadata2(item), ...excerpt("title", 160), ...excerpt("description", 240), ...excerpt("conclusion", 240), imageCount: item.images?.length ?? 0, imageNames: (item.images ?? []).flatMap((image) => image.name ? [image.name] : []), hasDelivery: Boolean(item.delivery) });
}
function todoRequirementFingerprint(item) {
  return digest4([item.title, item.description ?? "", (item.images ?? []).map((image) => [image.id, image.dataUrl, image.type ?? null, image.name ?? null, image.width ?? null, image.height ?? null])]);
}
function projectTodoRequirement(item, projectGeneration) {
  return todoRequirementSchema.parse({ ...todoMetadata2(item), ...typeof projectGeneration === "string" ? { projectGeneration } : {}, title: item.title, ...item.description !== undefined ? { description: item.description } : {}, ...item.images ? { images: item.images } : {}, ...item.conclusion !== undefined ? { conclusion: item.conclusion } : {} });
}
function createWorkflowService(options) {
  const projects = new Map;
  for (const project of options.projects) {
    if (!project || typeof project.id !== "string" || !project.id.trim())
      throw new Error("CardGame project id 不能为空");
    if (projects.has(project.id))
      throw new Error(`重复的 CardGame project id：${project.id}`);
    projects.set(project.id, { ...project, id: project.id.trim() });
  }
  const now = options.now ?? Date.now;
  const makeId = options.idFactory ?? randomUUID7;
  const listeners = new Set;
  const ready = DurableWorkflowStore.open(options.dataRoot);
  let closed = false;
  let queue = Promise.resolve();
  const assertProject = (input) => {
    const projectId = text(input.projectId, "projectId");
    if (!projects.has(projectId))
      throw new WorkflowError("unknown-project", `未知项目：${projectId}`);
    return projectId;
  };
  const emit = (change) => {
    for (const listener of listeners) {
      try {
        listener(change);
      } catch {}
    }
  };
  function enqueue(operation) {
    const run = queue.then(async () => {
      if (closed)
        throw new WorkflowError("closed", "工作流服务已关闭");
      const store = await ready;
      const result = await operation(store);
      await store.flush();
      return result;
    });
    queue = run.catch(() => {
      return;
    });
    return run;
  }
  function touchTodo(store, todo, event, payload, at) {
    store.putTodo(todo);
    store.addHistory({ projectId: todo.projectId, itemId: todo.id, kind: "todo", event, revision: todo.revision, payload, createdAt: at });
    return todo;
  }
  function touchProduction(store, production, event, payload, at) {
    store.putProduction(production);
    store.addHistory({ projectId: production.projectId, itemId: production.id, kind: "production", event, revision: production.revision, payload, createdAt: at });
    return production;
  }
  function checkRevision(actual, expected, current) {
    if (expected === undefined || expected === null || expected === "")
      throw new WorkflowConflictError("需要 baseRevision 才能修改此记录", current);
    if (integer2(expected) !== actual)
      throw new WorkflowConflictError(undefined, current);
  }
  function checkCapacity(store, projectId, kind) {}
  async function createTodo(input) {
    return enqueue((store) => {
      const projectId = assertProject(input);
      checkCapacity(store, projectId, "todo");
      const id = optionalText(input.id) ?? `todo-${makeId()}`;
      if (store.getTodo(projectId, id))
        throw new WorkflowError("already-exists", `Todo 已存在：${id}`);
      const at = iso(now());
      const status = normalizeStatus(input.status ?? "todo");
      const title = text(input.title, "title");
      const item = {
        projectId,
        id,
        title,
        ...optionalText(input.description) ? { description: optionalText(input.description) } : {},
        ...input.images !== undefined ? { images: normalizeTodoImages(input.images) } : {},
        status,
        completed: status === "done",
        priority: normalizePriority(input.priority),
        ...optionalText(input.category) ? { category: optionalText(input.category) } : {},
        ...optionalText(input.dueDate) ? { dueDate: optionalText(input.dueDate) } : {},
        ...input.context ? { context: deepLinkPart(input.context) } : {},
        requirementRevision: 1,
        revision: 1,
        createdAt: at,
        updatedAt: at
      };
      touchTodo(store, item, "created", { title: item.title }, at);
      emit({ projectId, kind: "todo", id, revision: item.revision });
      return { item: clone2(item), revision: item.revision };
    });
  }
  async function updateTodo(input) {
    return enqueue((store) => {
      const projectId = assertProject(input);
      const id = text(input.id ?? input.itemId, "id");
      const current = store.getTodo(projectId, id);
      if (!current)
        throw new WorkflowError("not-found", `找不到 Todo：${id}`);
      checkRevision(current.revision, input.baseRevision, current);
      const patch = asRecord2(input.patch ?? input);
      const next = clone2(current);
      let requirementChanged = false;
      if (patch.title !== undefined) {
        next.title = text(patch.title, "title");
        requirementChanged = true;
      }
      if (patch.description !== undefined) {
        next.description = optionalText(patch.description) ?? "";
        requirementChanged = true;
      }
      if (patch.images !== undefined) {
        const images = normalizeTodoImages(patch.images);
        if (images.length)
          next.images = images;
        else
          delete next.images;
        requirementChanged = true;
      }
      if (patch.status !== undefined) {
        next.status = normalizeStatus(patch.status);
        next.completed = next.status === "done";
      }
      if (patch.completed !== undefined && patch.status === undefined) {
        next.completed = Boolean(patch.completed);
        next.status = next.completed ? "done" : "todo";
      }
      if (patch.priority !== undefined) {
        next.priority = normalizePriority(patch.priority);
        requirementChanged = true;
      }
      if (patch.category !== undefined) {
        next.category = optionalText(patch.category);
        requirementChanged = true;
      }
      if (patch.dueDate !== undefined) {
        next.dueDate = optionalText(patch.dueDate);
        requirementChanged = true;
      }
      if (patch.context !== undefined)
        next.context = deepLinkPart(patch.context);
      if (patch.conclusion !== undefined)
        next.conclusion = optionalText(patch.conclusion);
      if (requirementChanged)
        next.requirementRevision += 1;
      next.revision += 1;
      next.updatedAt = iso(now());
      touchTodo(store, next, "updated", { fields: Object.keys(patch), requirementChanged }, next.updatedAt);
      emit({ projectId, kind: "todo", id, revision: next.revision });
      return { item: clone2(next), revision: next.revision };
    });
  }
  function hasActiveDelegation(item) {
    const active = new Set(["pending", "queued", "started", "accepted", "running", "in_progress", "in-progress", "resuming"]);
    const execution = item.execution;
    const executionStatus = optionalText(execution?.status ?? execution?.state ?? execution?.executionStatus)?.toLocaleLowerCase();
    if (executionStatus ? active.has(executionStatus) : Boolean(execution && (execution.delegationId || execution.executionId || execution.taskId)))
      return true;
    const deliveryStatus = optionalText(item.delivery?.status)?.toLocaleLowerCase();
    return Boolean(deliveryStatus && active.has(deliveryStatus));
  }
  async function deleteTodo(input) {
    return enqueue((store) => {
      const projectId = assertProject(input);
      const id = text(input.id ?? input.itemId, "id");
      const current = store.getTodo(projectId, id);
      if (!current)
        throw new WorkflowError("not-found", `找不到 Todo：${id}`);
      checkRevision(current.revision, input.baseRevision, current);
      if (hasActiveDelegation(current))
        throw new WorkflowError("active-delegation", "仍有执行中的交办任务，无法删除", current.execution ?? current.delivery);
      const revision = current.revision + 1;
      if (!store.deleteTodo(projectId, id))
        throw new WorkflowError("not-found", `找不到 Todo：${id}`);
      const at = iso(now());
      store.addHistory({ projectId, itemId: id, kind: "todo", event: "deleted", revision, payload: { baseRevision: current.revision, item: clone2(current) }, createdAt: at });
      emit({ projectId, kind: "todo", id, revision });
      return { deleted: true, projectId, id, revision };
    });
  }
  async function todoFeedback(input) {
    return enqueue((store) => {
      const projectId = assertProject(input);
      const id = text(input.itemId ?? input.id, "itemId");
      const current = store.getTodo(projectId, id);
      if (!current)
        throw new WorkflowError("not-found", `找不到 Todo：${id}`);
      const expectedRequirement = input.requirementRevision === undefined ? undefined : integer2(input.requirementRevision);
      const requirementChanged = expectedRequirement !== undefined && expectedRequirement !== current.requirementRevision;
      const next = clone2(current);
      if (input.status !== undefined) {
        next.status = normalizeStatus(input.status);
        next.completed = next.status === "done";
      }
      if (input.conclusion !== undefined)
        next.conclusion = text(input.conclusion, "conclusion");
      if (input.execution && typeof input.execution === "object" && !Array.isArray(input.execution))
        next.execution = { ...next.execution ?? {}, ...clone2(input.execution) };
      if (input.taskId !== undefined)
        next.taskId = optionalText(input.taskId);
      next.revision += 1;
      next.updatedAt = iso(now());
      touchTodo(store, next, "feedback", { status: next.status, requirementChanged, ...optionalText(input.requestId) ? { requestId: optionalText(input.requestId) } : {} }, next.updatedAt);
      emit({ projectId, kind: "todo", id, revision: next.revision });
      return { item: clone2(next), revision: next.revision, requirementChanged };
    });
  }
  async function importTodos(input) {
    return enqueue((store) => {
      const projectId = assertProject(input);
      if (!Array.isArray(input.items))
        throw new WorkflowError("invalid-input", "items 必须是数组");
      const imported = [];
      let updated = 0;
      let skipped = 0;
      store.begin();
      try {
        for (let index = 0;index < input.items.length; index += 1) {
          const source = asRecord2(input.items[index]);
          const sourceId = optionalText(source.id ?? source.itemId ?? source.key);
          const id = sourceId ?? `legacy-${digest4({ projectId, title: source.title, description: source.description, index }).slice(0, 24)}`;
          const existing = store.getTodo(projectId, id);
          const title = text(source.title ?? source.name ?? `待办 ${id}`, "title");
          const incomingRequirement = {
            title,
            description: optionalText(source.description) ?? "",
            priority: normalizePriority(source.priority),
            category: optionalText(source.category) ?? "",
            dueDate: optionalText(source.dueDate) ?? "",
            images: source.images === undefined ? undefined : normalizeTodoImages(source.images)
          };
          if (!existing) {
            checkCapacity(store, projectId, "todo");
            const at = iso(now());
            const status = normalizeStatus(source.status ?? (source.completed ? "done" : "todo"));
            const item = {
              projectId,
              id,
              title,
              ...incomingRequirement.description ? { description: incomingRequirement.description } : {},
              status,
              completed: status === "done",
              priority: incomingRequirement.priority,
              ...incomingRequirement.category ? { category: incomingRequirement.category } : {},
              ...incomingRequirement.dueDate ? { dueDate: incomingRequirement.dueDate } : {},
              ...incomingRequirement.images?.length ? { images: incomingRequirement.images } : {},
              ...optionalText(source.conclusion) ? { conclusion: optionalText(source.conclusion) } : {},
              requirementRevision: 1,
              revision: 1,
              createdAt: optionalText(source.createdAt) ?? at,
              updatedAt: at
            };
            touchTodo(store, item, "imported", { sourceId: id }, at);
            imported.push(clone2(item));
            emit({ projectId, kind: "todo", id, revision: 1 });
            continue;
          }
          const next = clone2(existing);
          let changed = false;
          if (!next.description && incomingRequirement.description) {
            next.description = incomingRequirement.description;
            changed = true;
          }
          if (!next.category && incomingRequirement.category) {
            next.category = incomingRequirement.category;
            changed = true;
          }
          if (!next.dueDate && incomingRequirement.dueDate) {
            next.dueDate = incomingRequirement.dueDate;
            changed = true;
          }
          if (!next.images?.length && incomingRequirement.images?.length) {
            next.images = incomingRequirement.images;
            changed = true;
          }
          if (!next.conclusion && optionalText(source.conclusion)) {
            next.conclusion = optionalText(source.conclusion);
            changed = true;
          }
          if (!changed) {
            skipped += 1;
            continue;
          }
          next.revision += 1;
          next.updatedAt = iso(now());
          touchTodo(store, next, "import-merge", { sourceId: id }, next.updatedAt);
          updated += 1;
          imported.push(clone2(next));
          emit({ projectId, kind: "todo", id, revision: next.revision });
        }
        store.commit();
      } catch (error) {
        store.rollback();
        throw error;
      }
      return { imported: imported.length - updated, updated, skipped, items: imported };
    });
  }
  function todoRequirement(item) {
    return {
      itemId: item.id,
      title: item.title,
      description: item.description ?? "",
      images: item.images ?? [],
      priority: item.priority,
      category: item.category ?? "",
      dueDate: item.dueDate ?? null,
      requirementRevision: item.requirementRevision
    };
  }
  async function delegateTodo(input) {
    const projectId = text(input.projectId, "projectId");
    assertProject(input);
    const id = text(input.itemId ?? input.id, "itemId");
    const initial = await enqueue((store) => {
      const item = store.getTodo(projectId, id);
      if (!item)
        throw new WorkflowError("not-found", `找不到 Todo：${id}`);
      const requirement = todoRequirement(item);
      const projectGeneration = typeof input.projectGeneration === "string" ? input.projectGeneration : undefined;
      const identity = projectGeneration ? `${projectId}:${projectGeneration}:${id}` : `${projectId}:${id}`;
      const businessKey = text(input.businessKey ?? `todo:${identity}`, "businessKey");
      const scope = defaultScope(input.scope);
      const previousRequest = item.delivery?.payload.projectGeneration === projectGeneration ? item.delivery?.requestId : undefined;
      const request = requestId(input.requestId ?? previousRequest, `todo-repair:${identity}:${item.requirementRevision}`);
      const requestKey = projectGeneration ? `cardgame-todo-request:${projectGeneration}:${request}` : request;
      const payload = {
        projectId,
        ...projectGeneration ? { projectGeneration, todoObjectId: `cardgame-todo:${JSON.stringify([projectId, projectGeneration, id])}` } : {},
        itemId: id,
        requestId: request,
        requestKey,
        businessKey,
        goal: optionalText(input.goal) ?? `处理待办：${item.title}`,
        scope,
        requirement,
        cwd: optionalText(input.cwd),
        resumePaused: true,
        delegationId: item.execution?.delegationId
      };
      const fingerprint = digest4({ operation: "repair", payload: { ...payload, delegationId: undefined } });
      const prior = store.getRequest(projectId, requestKey);
      if (prior && prior.fingerprint !== fingerprint)
        throw new WorkflowRequestIdReuseError(undefined, { requestId: request, previous: prior });
      const at = iso(now());
      const sameDelivery = item.delivery?.requestId === request && item.delivery.fingerprint === fingerprint;
      const transportPayload = sameDelivery ? item.delivery.payload : payload;
      if (!sameDelivery || item.delivery?.status !== "pending") {
        const next = clone2(item);
        next.delivery = { requestId: request, businessKey, fingerprint, status: "pending", payload: transportPayload, updatedAt: at };
        next.revision += 1;
        next.updatedAt = at;
        touchTodo(store, next, "delegation-prepared", { requestId: request, businessKey }, at);
        store.putRequest({ projectId, requestId: requestKey, operation: "repair", fingerprint, todoId: id, status: "pending", payload: transportPayload, createdAt: prior?.createdAt ?? at, updatedAt: at });
        emit({ projectId, kind: "todo", id, revision: next.revision });
        return { item: next, payload: transportPayload, requestId: request, fingerprint };
      }
      return { item, payload: transportPayload, requestId: request, fingerprint };
    });
    return { ...clone2(initial), pending: true };
  }
  function productionRequirement(input, current) {
    const brief = text(input.brief ?? current?.brief, "brief");
    const target = input.targetAsset ?? input.target ?? current?.targetAsset;
    const targetAsset = target && typeof target === "object" && !Array.isArray(target) ? clone2(target) : undefined;
    const pinnedRefs = input.pinnedRefs === undefined && input.contentRefs === undefined && current ? clone2(current.pinnedRefs) : normalizeRefs(input.pinnedRefs ?? input.contentRefs);
    const todoId = optionalText(input.todoId ?? current?.todoId);
    const featureId = optionalText(input.featureId ?? current?.featureId);
    return { brief, ...targetAsset ? { targetAsset } : {}, pinnedRefs, ...input.batch !== undefined ? { batch: clone2(input.batch) } : current?.batch !== undefined ? { batch: clone2(current.batch) } : {}, ...todoId ? { todoId } : {}, ...featureId ? { featureId } : {} };
  }
  function createProductionRecord(projectId, id, requirement, at) {
    return {
      projectId,
      id,
      brief: requirement.brief,
      ...requirement.targetAsset ? { targetAsset: requirement.targetAsset } : {},
      pinnedRefs: requirement.pinnedRefs,
      ...requirement.batch !== undefined ? { batch: requirement.batch } : {},
      rounds: [],
      candidateRefs: [],
      ...requirement.todoId ? { todoId: requirement.todoId } : {},
      ...requirement.featureId ? { featureId: requirement.featureId } : {},
      status: "draft",
      requirementRevision: 1,
      revision: 1,
      createdAt: at,
      updatedAt: at
    };
  }
  async function upsertProduction(input) {
    return enqueue((store) => {
      const projectId = assertProject(input);
      const requestedId = optionalText(input.id ?? input.productionId);
      const todoId = optionalText(input.todoId);
      const current = requestedId ? store.getProduction(projectId, requestedId) : todoId ? store.findProductionForTodo(projectId, todoId) : undefined;
      if (!current)
        checkCapacity(store, projectId, "production");
      const at = iso(now());
      if (!current) {
        const id = requestedId ?? `production-${makeId()}`;
        const requirement = productionRequirement(input);
        if (requirement.todoId) {
          const existingForTodo = store.findProductionForTodo(projectId, requirement.todoId);
          if (existingForTodo)
            return { production: clone2(existingForTodo), revision: existingForTodo.revision, created: false };
        }
        const production = createProductionRecord(projectId, id, requirement, at);
        touchProduction(store, production, "created", { draft: true }, at);
        emit({ projectId, kind: "production", id, revision: production.revision });
        return { production: clone2(production), revision: production.revision, created: true };
      }
      if (input.baseRevision !== undefined)
        checkRevision(current.revision, input.baseRevision, current);
      const requirement = productionRequirement(input, current);
      const next = clone2(current);
      const changed = stable(productionRequirement({}, next)) !== stable(requirement);
      next.brief = requirement.brief;
      next.targetAsset = requirement.targetAsset;
      next.pinnedRefs = requirement.pinnedRefs;
      next.batch = requirement.batch;
      next.todoId = requirement.todoId;
      next.featureId = requirement.featureId;
      if (changed)
        next.requirementRevision += 1;
      if (changed)
        next.revision += 1;
      next.updatedAt = changed ? at : next.updatedAt;
      if (changed)
        touchProduction(store, next, "updated", { requirementChanged: true }, at);
      return { production: clone2(next), revision: next.revision, created: false };
    });
  }
  async function importProductions(input) {
    return enqueue((store) => {
      const projectId = assertProject(input);
      if (!Array.isArray(input.items))
        throw new WorkflowError("invalid-input", "items 必须是数组");
      const imported = [];
      let updated = 0;
      let skipped = 0;
      store.begin();
      try {
        for (let index = 0;index < input.items.length; index += 1) {
          const source = asRecord2(input.items[index]);
          const id = text(source.id ?? source.productionId ?? `legacy-production-${digest4({ projectId, index, brief: source.brief }).slice(0, 24)}`, "productionId");
          const todoId = optionalText(source.todoId);
          const current = store.getProduction(projectId, id) ?? (todoId ? store.findProductionForTodo(projectId, todoId) : undefined);
          const requirement = productionRequirement({ ...source, projectId, id, ...todoId ? { todoId } : {} }, current);
          if (!current) {
            checkCapacity(store, projectId, "production");
            const at = iso(now());
            const production = createProductionRecord(projectId, id, requirement, at);
            touchProduction(store, production, "imported", { sourceId: id }, at);
            imported.push(clone2(production));
            emit({ projectId, kind: "production", id, revision: production.revision });
            continue;
          }
          const changed = stable(productionRequirement({}, current)) !== stable(requirement);
          if (!changed) {
            skipped += 1;
            continue;
          }
          const at = iso(now());
          const next = clone2(current);
          next.brief = requirement.brief;
          next.targetAsset = requirement.targetAsset;
          next.pinnedRefs = requirement.pinnedRefs;
          next.batch = requirement.batch;
          next.todoId = requirement.todoId;
          next.featureId = requirement.featureId;
          next.requirementRevision += 1;
          next.revision += 1;
          next.updatedAt = at;
          touchProduction(store, next, "import-merge", { sourceId: id }, at);
          imported.push(clone2(next));
          updated += 1;
          emit({ projectId, kind: "production", id: next.id, revision: next.revision });
        }
        store.commit();
      } catch (error) {
        store.rollback();
        throw error;
      }
      return { imported: imported.length - updated, updated, skipped, items: imported };
    });
  }
  async function updateProduction(input) {
    return enqueue((store) => {
      const projectId = assertProject(input);
      const id = text(input.id ?? input.productionId, "productionId");
      const current = store.getProduction(projectId, id);
      if (!current)
        throw new WorkflowError("not-found", `找不到制作请求：${id}`);
      checkRevision(current.revision, input.baseRevision, current);
      const patch = asRecord2(input.patch ?? input);
      const next = clone2(current);
      let changed = false;
      if (patch.brief !== undefined) {
        next.brief = text(patch.brief, "brief");
        changed = true;
      }
      if (patch.targetAsset !== undefined) {
        next.targetAsset = patch.targetAsset && typeof patch.targetAsset === "object" && !Array.isArray(patch.targetAsset) ? clone2(patch.targetAsset) : undefined;
        changed = true;
      }
      if (patch.pinnedRefs !== undefined) {
        next.pinnedRefs = normalizeRefs(patch.pinnedRefs);
        changed = true;
      }
      if (patch.batch !== undefined) {
        next.batch = clone2(patch.batch);
        changed = true;
      }
      if (patch.todoId !== undefined) {
        next.todoId = optionalText(patch.todoId);
        changed = true;
      }
      if (patch.featureId !== undefined) {
        if (next.gameCandidates?.length)
          throw new WorkflowError("conflict", "已有游戏候选的制作单不能更换功能项");
        next.featureId = optionalText(patch.featureId);
        changed = true;
      }
      if (!changed)
        return { production: clone2(next), revision: next.revision };
      next.requirementRevision += 1;
      next.revision += 1;
      next.updatedAt = iso(now());
      touchProduction(store, next, "updated", { fields: Object.keys(patch), requirementChanged: true }, next.updatedAt);
      emit({ projectId, kind: "production", id, revision: next.revision });
      return { production: clone2(next), revision: next.revision };
    });
  }
  async function recordGameCandidate(input) {
    return enqueue((store) => {
      const projectId = assertProject(input);
      const productionId = text(input.productionId, "productionId");
      const current = store.getProduction(projectId, productionId);
      if (!current)
        throw new WorkflowError("not-found", `找不到制作请求：${productionId}`);
      checkRevision(current.revision, input.baseRevision, current);
      const candidate = clone2(asRecord2(input.candidate));
      if (candidate.projectId !== projectId || candidate.productionId !== productionId || !candidate.id || !candidate.featureId || !/^[0-9a-f]{40}$/.test(candidate.commit))
        throw new WorkflowError("invalid-input", "候选身份或确切提交无效");
      const previous = current.gameCandidates?.find((item) => item.id === candidate.id);
      if (previous) {
        if (stable(previous) !== stable(candidate))
          throw new WorkflowError("conflict", "同一候选 ID 的内容已经变化");
        return { production: clone2(current), candidate: clone2(previous) };
      }
      const next = clone2(current);
      next.gameCandidates = [...next.gameCandidates ?? [], candidate];
      next.gameCandidateOrigins = { ...next.gameCandidateOrigins, [candidate.id]: { requirementRevision: current.requirementRevision, round: current.rounds.at(-1)?.round ?? 0 } };
      next.revision += 1;
      next.updatedAt = iso(now());
      touchProduction(store, next, "game-candidate", { candidateId: candidate.id, featureId: candidate.featureId, commit: candidate.commit }, next.updatedAt);
      emit({ projectId, kind: "production", id: productionId, revision: next.revision });
      return { production: clone2(next), candidate: clone2(candidate) };
    });
  }
  async function recordGameAdoption(input) {
    return enqueue((store) => {
      const projectId = assertProject(input);
      const productionId = text(input.productionId, "productionId");
      const candidateId = text(input.candidateId, "candidateId");
      const current = store.getProduction(projectId, productionId);
      if (!current)
        throw new WorkflowError("not-found", `找不到制作请求：${productionId}`);
      const prior = current.gameCandidates?.find((item) => item.id === candidateId);
      if (!prior)
        throw new WorkflowError("not-found", `找不到游戏候选：${candidateId}`);
      const status = input.status;
      if (status !== "adopted" && status !== "undone")
        throw new WorkflowError("invalid-input", "采用状态无效");
      if (prior.status === status)
        return { production: clone2(current), candidate: clone2(prior) };
      if (status === "undone" && prior.status !== "adopted")
        throw new WorkflowError("conflict", "只能撤销已采用的候选");
      if (status === "adopted" && prior.status !== "candidate")
        throw new WorkflowError("conflict", "只能采用未采用的候选");
      if (status === "adopted" && !projectGameChange(current).candidates.some((item) => item.id === candidateId && item.current))
        throw new WorkflowError("conflict", "候选已过期，请确认当前需求对应的候选");
      const next = clone2(current);
      const candidate = next.gameCandidates.find((item) => item.id === candidateId);
      candidate.status = status;
      candidate.updatedAt = iso(now());
      if (status === "adopted") {
        candidate.adoptedAt = candidate.updatedAt;
        candidate.adoptionId = text(input.adoptionId, "adoptionId");
      } else
        candidate.undoneAt = candidate.updatedAt;
      next.revision += 1;
      next.updatedAt = candidate.updatedAt;
      touchProduction(store, next, status === "adopted" ? "game-adopted" : "game-undone", { candidateId, adoptionId: candidate.adoptionId }, next.updatedAt);
      emit({ projectId, kind: "production", id: productionId, revision: next.revision });
      return { production: clone2(next), candidate: clone2(candidate) };
    });
  }
  function productionRound(input, current) {
    const request = optionalText(input.requestId);
    if (request)
      return current.rounds.find((round) => round.requestId === request);
    const round = input.round === undefined ? undefined : integer2(input.round);
    if (round !== undefined)
      return current.rounds.find((item) => item.round === round);
    return current.rounds.at(-1);
  }
  function assertRoundScope(round, input) {
    if (input.projectGeneration === undefined)
      return;
    if (round.projectGeneration === input.projectGeneration)
      return;
    if (!round.projectGeneration && input.allowLegacyReconciliation === true)
      return;
    throw new WorkflowError("conflict", "原轮次属于旧项目绑定，不能重试或写回；请核对历史后明确新建一轮");
  }
  function requirementForRound(current) {
    return {
      brief: current.brief,
      ...current.targetAsset ? { targetAsset: clone2(current.targetAsset) } : {},
      pinnedRefs: clone2(current.pinnedRefs),
      ...current.batch !== undefined ? { batch: clone2(current.batch) } : {},
      ...current.todoId ? { todoId: current.todoId } : {},
      requirementRevision: current.requirementRevision
    };
  }
  function outputDirectoryFor(projectId, productionId, round) {
    const projectPart = projectId.replace(/[^a-zA-Z0-9._-]/g, "_");
    return join6(options.dataRoot, "incoming", projectPart, digest4(productionId).slice(0, 24), String(round));
  }
  function dispatchInput(production, round) {
    return {
      projectId: production.projectId,
      productionId: production.id,
      round: round.round,
      requestId: round.requestId,
      businessKey: round.businessKey,
      goal: round.requirement.brief,
      requirement: clone2(round.requirement),
      requirementSnapshot: clone2(round.requirement),
      scope: [...round.scope],
      ...round.requirement.outputDirectory ? { outputDirectory: round.requirement.outputDirectory } : {},
      ...round.cwd ? { cwd: round.cwd } : {},
      ...round.requirement.todoId ? { todoId: round.requirement.todoId } : {}
    };
  }
  function productionDispatchFingerprint(production, round) {
    return digest4({ operation: "production", input: dispatchInput(production, round) });
  }
  async function reserveProduction(input) {
    return enqueue(async (store) => {
      const projectId = assertProject(input);
      const id = text(input.productionId ?? input.id, "productionId");
      const current = store.getProduction(projectId, id);
      if (!current)
        throw new WorkflowError("not-found", `找不到制作请求：${id}`);
      const previous = productionRound(input, current);
      if (current.batch?.kind === "card-generation")
        throw new WorkflowError("invalid-input", "卡牌批次请使用分阶段工作流，插画由 Codex 回填");
      const isNewRound = input.newRound === true || !previous && input.round !== undefined;
      if (previous && !isNewRound) {
        assertRoundScope(previous, input);
        if (previous.requirement.outputDirectory)
          await mkdir7(previous.requirement.outputDirectory, { recursive: true });
        const expectedRequest = requestId(input.requestId, previous.requestId);
        if (expectedRequest !== previous.requestId)
          throw new WorkflowError("invalid-input", "当前轮次 requestId 不一致");
        const fingerprint = productionDispatchFingerprint(current, previous);
        const prior = store.getRequest(projectId, previous.requestId);
        if (prior && prior.fingerprint !== fingerprint)
          throw new WorkflowRequestIdReuseError(undefined, { requestId: previous.requestId, previous: prior });
        return { production: clone2(current), round: clone2(previous), requestId: previous.requestId, businessKey: previous.businessKey, requirementSnapshot: clone2(previous.requirement), scope: [...previous.scope], ...previous.cwd ? { cwd: previous.cwd } : {}, input: dispatchInput(current, previous), submit: dispatchInput(current, previous), deduplicated: true };
      }
      const roundNumber = input.round === undefined ? (current.rounds.at(-1)?.round ?? 0) + 1 : integer2(input.round);
      if (current.rounds.some((round) => round.round === roundNumber))
        throw new WorkflowError("already-exists", `制作轮次已存在：${roundNumber}`);
      const businessKey = text(input.businessKey ?? (current.rounds.at(-1)?.businessKey ?? `production:${projectId}:${id}`), "businessKey");
      const outputDirectory = outputDirectoryFor(projectId, id, roundNumber);
      const scope = [...new Set([...defaultScope(input.scope), outputDirectory])];
      const cwd = optionalText(input.cwd);
      const requirement = { ...requirementForRound(current), outputDirectory };
      const provisional = { projectId, productionId: id, round: roundNumber, businessKey, requirement, scope, cwd: cwd ?? null };
      const fallbackId = `production:${projectId}:${id}:round:${roundNumber}:${makeId()}`;
      const rid = requestId(input.requestId, fallbackId);
      const dispatchRevision = current.revision + 1;
      const fingerprint = productionDispatchFingerprint(current, { round: roundNumber, requestId: rid, businessKey, requirementRevision: current.requirementRevision, dispatchRevision, requirement, scope, ...cwd ? { cwd } : {}, status: "reserved", createdAt: "", updatedAt: "" });
      const prior = store.getRequest(projectId, rid);
      if (prior) {
        if (prior.fingerprint !== fingerprint)
          throw new WorkflowRequestIdReuseError(undefined, { requestId: rid, previous: prior });
        const existingRound = current.rounds.find((round) => round.requestId === rid);
        if (existingRound)
          return { production: clone2(current), round: clone2(existingRound), requestId: rid, businessKey: existingRound.businessKey, requirementSnapshot: clone2(existingRound.requirement), scope: [...existingRound.scope], ...existingRound.cwd ? { cwd: existingRound.cwd } : {}, input: dispatchInput(current, existingRound), submit: dispatchInput(current, existingRound), deduplicated: true };
      }
      const at = iso(now());
      await mkdir7(outputDirectory, { recursive: true });
      const round = { ...typeof input.projectGeneration === "string" ? { projectGeneration: input.projectGeneration } : {}, round: roundNumber, requestId: rid, businessKey, requirementRevision: current.requirementRevision, dispatchRevision, requirement, scope, ...cwd ? { cwd } : {}, status: "reserved", createdAt: at, updatedAt: at };
      const next = clone2(current);
      next.rounds.push(round);
      next.status = "reserved";
      next.generation = { status: "reserved", requestId: rid, round: roundNumber, updatedAt: at };
      next.revision += 1;
      next.updatedAt = at;
      touchProduction(store, next, "round-reserved", { requestId: rid, round: roundNumber, businessKey }, at);
      store.putRequest({ projectId, requestId: rid, operation: "production", fingerprint, productionId: id, todoId: current.todoId, round: roundNumber, requirementRevision: current.requirementRevision, status: "reserved", payload: dispatchInput(next, round), createdAt: at, updatedAt: at });
      emit({ projectId, kind: "production", id, revision: next.revision });
      const inputValue = dispatchInput(next, round);
      return { production: clone2(next), round: clone2(round), requestId: rid, businessKey, requirementSnapshot: clone2(requirement), scope: [...scope], ...cwd ? { cwd } : {}, input: inputValue, submit: inputValue, deduplicated: false };
    });
  }
  async function bindProduction(input) {
    return enqueue((store) => {
      const projectId = assertProject(input);
      const id = text(input.productionId ?? input.id, "productionId");
      const current = store.getProduction(projectId, id);
      if (!current)
        throw new WorkflowError("not-found", `找不到制作请求：${id}`);
      const round = productionRound(input, current);
      if (!round)
        throw new WorkflowError("not-found", "找不到制作轮次");
      assertRoundScope(round, input);
      const receipt = input.receipt && typeof input.receipt === "object" ? asRecord2(input.receipt) : input;
      const receiptStatus = optionalText(receipt.status) ?? "accepted";
      const taskStatus = taskStatusFromReceipt(receipt);
      const boundStatus = taskStatus && ["queued", "running", "failed", "needs-input", "stale", "cancelled", "paused", "interrupted"].includes(taskStatus) ? taskStatus : statusFromReceipt({ status: receiptStatus });
      const fingerprint = digest4(receipt);
      if (round.dispatchReceiptFingerprint === fingerprint)
        return { production: clone2(current), revision: current.revision };
      const newest = current.rounds.at(-1);
      const terminal = Boolean(round.result) || current.status === "adopted";
      if (round.requestId !== newest.requestId || round.requirementRevision !== current.requirementRevision || terminal) {
        const next = clone2(current), at = iso(now()), target = next.rounds.find((value) => value.requestId === round.requestId);
        target.dispatchReceiptFingerprint = fingerprint;
        target.dispatchReceipt = clone2(receipt);
        next.revision += 1;
        next.updatedAt = at;
        touchProduction(store, next, "late-binding-receipt", { requestId: round.requestId, round: round.round, receipt: clone2(receipt) }, at);
        emit({ projectId, kind: "production", id, revision: next.revision });
        return { production: clone2(next), revision: next.revision };
      }
      const binding = executionBindingFromReceipt(receipt);
      const nextExecution = { ...current.execution ?? {}, requestId: round.requestId, status: boundStatus, transportStatus: receiptStatus, ...binding };
      const at = iso(now());
      const next = clone2(current);
      const targetRound = next.rounds.find((item) => item.requestId === round.requestId);
      targetRound.dispatchReceiptFingerprint = fingerprint;
      targetRound.dispatchReceipt = clone2(receipt);
      targetRound.status = boundStatus;
      targetRound.updatedAt = at;
      next.execution = nextExecution;
      next.generation = { ...next.generation ?? { status: targetRound.status, updatedAt: at }, status: boundStatus, requestId: round.requestId, round: targetRound.round, updatedAt: at };
      next.status = targetRound.status;
      next.revision += 1;
      next.updatedAt = at;
      touchProduction(store, next, "bound", { requestId: round.requestId, status: receiptStatus }, at);
      const prior = store.getRequest(projectId, round.requestId);
      if (prior)
        store.putRequest({ ...prior, status: receiptStatus, result: receipt.result, updatedAt: at });
      emit({ projectId, kind: "production", id, revision: next.revision });
      return { production: clone2(next), revision: next.revision };
    });
  }
  async function productionResult(input) {
    return enqueue((store) => {
      const projectId = assertProject(input);
      const id = text(input.productionId ?? input.id, "productionId");
      const current = store.getProduction(projectId, id);
      if (!current)
        throw new WorkflowError("not-found", `找不到制作请求：${id}`);
      const rid = text(input.requestId, "requestId");
      const round = current.rounds.find((item) => item.requestId === rid && (input.round === undefined || item.round === integer2(input.round)));
      if (round)
        assertRoundScope(round, input);
      const prior = store.getRequest(projectId, rid);
      const resultStatus = optionalText(input.status ?? (input.result && typeof input.result === "object" ? input.result.status : undefined)) ?? "completed";
      const resultPayload = input.result && typeof input.result === "object" && !Array.isArray(input.result) ? asRecord2(input.result) : input;
      const candidatesValue = resultPayload.candidateRefs ?? resultPayload.candidates ?? resultPayload.assetCandidates;
      const candidateRefs = candidatesValue === undefined ? undefined : normalizeCandidates(candidatesValue, `${rid}:${round?.round ?? input.round ?? 0}`);
      const resultRevision = integer2(input.revision ?? input.requirementRevision ?? input.requestRevision ?? prior?.requirementRevision ?? 0);
      const fingerprint = digest4({ status: resultStatus, conclusion: resultPayload.conclusion, error: resultPayload.error, candidateRefs, raw: resultPayload });
      if (!round || prior && prior.productionId !== id) {
        if (prior)
          store.putRequest({ ...prior, status: "stale", result: resultPayload, updatedAt: iso(now()) });
        return { accepted: false, duplicate: false, stale: true, reason: "unknown-or-old-round", production: clone2(current), requestId: rid, round: round?.round ?? prior?.round };
      }
      const newestRound = current.rounds.at(-1);
      if (round.round !== newestRound.round || ![round.requirementRevision, round.dispatchRevision].includes(resultRevision) || current.requirementRevision !== round.requirementRevision) {
        const at = iso(now());
        const next = clone2(current);
        const target = next.rounds.find((item) => item.requestId === rid);
        target.staleResultCount = (target.staleResultCount ?? 0) + 1;
        target.updatedAt = at;
        next.revision += 1;
        next.updatedAt = at;
        touchProduction(store, next, "stale-result", { requestId: rid, round: round.round, resultRevision, expectedRevision: round.requirementRevision }, at);
        store.putRequest({ ...prior ?? { projectId, requestId: rid, operation: "production", fingerprint, productionId: id, round: round.round, status: "stale", createdAt: at }, fingerprint, status: "stale", result: resultPayload, updatedAt: at });
        emit({ projectId, kind: "production", id, revision: next.revision });
        return { accepted: false, duplicate: false, stale: true, reason: round.round !== newestRound.round ? "newer-round" : "requirement-changed", production: clone2(next), requestId: rid, round: round.round };
      }
      if (round.resultFingerprint === fingerprint)
        return { accepted: false, duplicate: true, stale: false, production: clone2(current), requestId: rid, round: round.round };
      const at = iso(now());
      const next = clone2(current);
      const target = next.rounds.find((item) => item.requestId === rid);
      const fact = { status: resultStatus, ...optionalText(resultPayload.conclusion) ? { conclusion: optionalText(resultPayload.conclusion) } : {}, ...optionalText(resultPayload.error) ? { error: optionalText(resultPayload.error) } : {}, ...candidateRefs ? { candidateRefs: clone2(candidateRefs) } : {}, raw: clone2(resultPayload), receivedAt: at, requestId: rid, round: target.round, revision: resultRevision };
      target.result = fact;
      target.resultFingerprint = fingerprint;
      target.status = resultStatus === "completed" ? "completed" : resultStatus;
      target.updatedAt = at;
      if (candidateRefs)
        next.candidateRefs = mergeCandidates(next.candidateRefs, candidateRefs);
      next.execution = next.execution ? { ...next.execution, status: resultStatus, resultAt: at } : next.execution;
      next.generation = { ...next.generation ?? { status: target.status, updatedAt: at }, status: resultStatus, requestId: rid, round: target.round, updatedAt: at, resultAt: at, ...optionalText(resultPayload.error) ? { error: optionalText(resultPayload.error) } : {} };
      next.status = resultStatus === "completed" ? "completed" : resultStatus;
      next.revision += 1;
      next.updatedAt = at;
      touchProduction(store, next, "result-received", { requestId: rid, round: target.round, status: resultStatus }, at);
      if (prior)
        store.putRequest({ ...prior, status: resultStatus, result: resultPayload, updatedAt: at });
      else
        store.putRequest({ projectId, requestId: rid, operation: "production", fingerprint, productionId: id, todoId: current.todoId, round: target.round, requirementRevision: target.requirementRevision, status: resultStatus, result: resultPayload, createdAt: at, updatedAt: at });
      if (next.todoId) {
        const todo = store.getTodo(projectId, next.todoId);
        if (todo) {
          const todoNext = clone2(todo);
          todoNext.productionId = id;
          todoNext.lastProductionResult = { productionId: id, requestId: rid, round: target.round, status: resultStatus, receivedAt: at };
          todoNext.revision += 1;
          todoNext.updatedAt = at;
          touchTodo(store, todoNext, "production-result", { productionId: id, requestId: rid, status: resultStatus }, at);
          emit({ projectId, kind: "todo", id: todoNext.id, revision: todoNext.revision });
        }
      }
      emit({ projectId, kind: "production", id, revision: next.revision });
      return { accepted: true, duplicate: false, stale: false, production: clone2(next), requestId: rid, round: target.round, revision: next.revision };
    });
  }
  function mergeCandidates(existing, incoming) {
    const result = [...existing.map(clone2)];
    for (const candidate of incoming) {
      const candidateKey = candidate.id ?? candidate.key ?? candidate.assetId;
      const index = result.findIndex((item) => (item.id ?? item.key ?? item.assetId) === candidateKey);
      if (index < 0)
        result.push(clone2(candidate));
      else
        result[index] = clone2(candidate);
    }
    return result;
  }
  async function bindTodo(input) {
    return enqueue((store) => {
      const projectId = assertProject(input);
      const todoId = text(input.todoId ?? input.itemId, "todoId");
      const todo = store.getTodo(projectId, todoId);
      if (!input.productionId) {
        if (!todo)
          throw new WorkflowError("not-found", `找不到 Todo：${todoId}`);
        const receipt = input.receipt && typeof input.receipt === "object" ? asRecord2(input.receipt) : undefined;
        if (!receipt)
          throw new WorkflowError("invalid-input", "bindTodo 需要 productionId 或 receipt");
        const status = optionalText(receipt.status) ?? "accepted";
        const at = iso(now());
        const next = clone2(todo);
        next.delivery = next.delivery ? { ...next.delivery, status, updatedAt: at } : next.delivery;
        const binding = executionBindingFromReceipt(receipt);
        const taskStatus = taskStatusFromReceipt(receipt) ?? statusFromReceipt({ status });
        if (Object.keys(binding).length || taskStatus)
          next.execution = { ...next.execution ?? {}, status: taskStatus, transportStatus: status, ...binding };
        if (optionalText(binding.taskId))
          next.taskId = optionalText(binding.taskId);
        next.revision += 1;
        next.updatedAt = at;
        touchTodo(store, next, "delegated", { requestId: optionalText(input.requestId), status }, at);
        if (next.delivery) {
          const prior = store.getRequest(projectId, optionalText(next.delivery.payload.requestKey) ?? next.delivery.requestId);
          if (prior)
            store.putRequest({ ...prior, status, result: receipt.result, updatedAt: at });
        }
        emit({ projectId, kind: "todo", id: todoId, revision: next.revision });
        return { todo: clone2(next), todoRevision: next.revision, receipt };
      }
      const productionId = text(input.productionId, "productionId");
      const production = store.getProduction(projectId, productionId);
      if (!todo)
        throw new WorkflowError("not-found", `找不到 Todo：${todoId}`);
      if (!production)
        throw new WorkflowError("not-found", `找不到制作请求：${productionId}`);
      if (input.todoBaseRevision !== undefined)
        checkRevision(todo.revision, input.todoBaseRevision, todo);
      if (input.productionBaseRevision !== undefined)
        checkRevision(production.revision, input.productionBaseRevision, production);
      const at = iso(now());
      const nextTodo = clone2(todo);
      const nextProduction = clone2(production);
      let todoChanged = nextTodo.productionId !== productionId;
      let productionChanged = nextProduction.todoId !== todoId;
      nextTodo.productionId = productionId;
      nextProduction.todoId = todoId;
      if (todoChanged) {
        nextTodo.revision += 1;
        nextTodo.updatedAt = at;
        touchTodo(store, nextTodo, "production-bound", { productionId }, at);
      }
      if (productionChanged) {
        nextProduction.revision += 1;
        nextProduction.updatedAt = at;
        touchProduction(store, nextProduction, "todo-bound", { todoId }, at);
      }
      if (todoChanged)
        emit({ projectId, kind: "todo", id: todoId, revision: nextTodo.revision });
      if (productionChanged)
        emit({ projectId, kind: "production", id: productionId, revision: nextProduction.revision });
      return { todo: clone2(nextTodo), production: clone2(nextProduction), todoRevision: nextTodo.revision, productionRevision: nextProduction.revision };
    });
  }
  async function registerCandidates(input, context) {
    const projectId = text(input.projectId, "projectId");
    assertProject(input);
    const suppliedReceipt = input.receipt && typeof input.receipt === "object" && !Array.isArray(input.receipt) ? input.receipt : undefined;
    if (suppliedReceipt && !connectionCompleted(suppliedReceipt))
      throw new WorkflowError("delivery-pending", `候选登记尚未完成：${suppliedReceipt.status}`, suppliedReceipt);
    const productionId = text(input.productionId, "productionId");
    const candidates = normalizeCandidates(input.candidates ?? input.candidateRefs);
    const current = await enqueue((store) => {
      const production = store.getProduction(projectId, productionId);
      if (!production)
        throw new WorkflowError("not-found", `找不到制作请求：${productionId}`);
      const round = productionRound({ requestId: input.sourceRequestId, round: input.round }, production);
      if (!round)
        throw new WorkflowError("not-found", "找不到候选所属轮次");
      return { production, round };
    });
    const round = current.round;
    const rid = requestId(input.requestId, `asset-candidates:${projectId}:${productionId}:${round?.round ?? 0}:${digest4(candidates).slice(0, 16)}`);
    const payload = { projectId, candidates: clone2(candidates) };
    let external;
    if (suppliedReceipt)
      external = suppliedReceipt;
    else if (context?.assets?.registerCandidates)
      external = await context.assets.registerCandidates(payload);
    if (!external)
      throw new WorkflowError("delivery-pending", "缺少资源服务的真实回执");
    if (external && typeof external === "object" && !Array.isArray(external) && "status" in external && !connectionCompleted(external)) {
      throw new WorkflowError("delivery-pending", `候选登记尚未完成：${String(external.status)}`, external);
    }
    return enqueue((store) => {
      const production = store.getProduction(projectId, productionId);
      if (!production)
        throw new WorkflowError("not-found", `找不到制作请求：${productionId}`);
      const latest = production.rounds.at(-1);
      if (round && (latest?.requestId !== round.requestId || production.requirementRevision !== round.requirementRevision))
        throw new WorkflowError("conflict", "候选回执属于旧轮次");
      if (production.candidateRegistration?.requestId === rid && production.candidateRegistration.status === "completed")
        return { production: clone2(production), candidates: clone2(candidates), requestId: rid, result: external };
      const at = iso(now());
      const next = clone2(production);
      next.candidateRefs = mergeCandidates(next.candidateRefs, candidates);
      next.candidateRegistration = { status: "completed", requestId: rid, updatedAt: at };
      next.revision += 1;
      next.updatedAt = at;
      touchProduction(store, next, "candidates-registered", { requestId: rid, count: candidates.length }, at);
      emit({ projectId, kind: "production", id: productionId, revision: next.revision });
      return { production: clone2(next), candidates: clone2(candidates), requestId: rid, result: external };
    });
  }
  async function adoptAsset(input, context) {
    const projectId = text(input.projectId, "projectId");
    assertProject(input);
    const suppliedReceipt = input.receipt && typeof input.receipt === "object" && !Array.isArray(input.receipt) ? input.receipt : undefined;
    if (suppliedReceipt && !connectionCompleted(suppliedReceipt))
      throw new WorkflowError("delivery-pending", `资源采用尚未完成：${suppliedReceipt.status}`, suppliedReceipt);
    const productionId = text(input.productionId, "productionId");
    const candidateId = text(input.candidateId ?? input.assetCandidateId, "candidateId");
    const production = await enqueue((store) => {
      const item = store.getProduction(projectId, productionId);
      if (!item)
        throw new WorkflowError("not-found", `找不到制作请求：${productionId}`);
      const candidate = item.candidateRefs.find((value) => (value.id ?? value.key ?? value.assetId) === candidateId);
      if (!candidate)
        throw new WorkflowError("not-found", `找不到候选：${candidateId}`);
      return { item, candidate };
    });
    const rid = requestId(input.requestId, `adopt-asset:${projectId}:${productionId}:${candidateId}`);
    const assetId = optionalText(input.assetId) ?? optionalText(production.candidate.assetId);
    const versionId = optionalText(input.versionId) ?? optionalText(production.candidate.versionId) ?? optionalText(production.candidate.version);
    const payload = {
      projectId,
      ...assetId ? { assetId } : {},
      candidateId,
      ...versionId ? { versionId } : {}
    };
    let external;
    if (suppliedReceipt)
      external = suppliedReceipt;
    else if (context?.assets?.adoptVersion)
      external = await context.assets.adoptVersion(payload);
    if (!external)
      throw new WorkflowError("delivery-pending", "缺少资源服务的真实回执");
    if (external && typeof external === "object" && !Array.isArray(external) && "status" in external && !connectionCompleted(external)) {
      throw new WorkflowError("delivery-pending", `资源采用尚未完成：${String(external.status)}`, external);
    }
    const externalRecord = external && typeof external === "object" && !Array.isArray(external) ? external : {};
    const externalResult = externalRecord.result && typeof externalRecord.result === "object" && !Array.isArray(externalRecord.result) ? externalRecord.result : externalRecord;
    const externalAsset = externalResult.asset && typeof externalResult.asset === "object" && !Array.isArray(externalResult.asset) ? externalResult.asset : {};
    const externalVersion = externalResult.version && typeof externalResult.version === "object" && !Array.isArray(externalResult.version) ? externalResult.version : {};
    const adoptedAssetId = optionalText(externalResult.assetId ?? externalAsset.id) ?? assetId;
    const adoptedVersionId = optionalText(externalResult.versionId ?? externalVersion.id) ?? versionId;
    return enqueue((store) => {
      const current = store.getProduction(projectId, productionId);
      if (!current)
        throw new WorkflowError("not-found", `找不到制作请求：${productionId}`);
      if (current.candidateRefs.find((candidate) => (candidate.id ?? candidate.key ?? candidate.assetId) === candidateId)?.rejectedAt)
        throw new WorkflowError("conflict", "候选已被否决；资源回执已保留，请人工核对实际采用结果", { candidateId, assetId: adoptedAssetId, versionId: adoptedVersionId, receipt: external });
      if (current.adoption?.candidateId === candidateId && current.adoption.assetId === adoptedAssetId && current.adoption.version === adoptedVersionId)
        return { production: clone2(current), candidateId, requestId: rid, result: external };
      const at = iso(now());
      const next = clone2(current);
      next.adoption = { status: "adopted", candidateId, ...adoptedAssetId ? { assetId: adoptedAssetId } : {}, ...adoptedVersionId ? { version: adoptedVersionId } : {}, updatedAt: at, result: clone2(external) };
      next.status = "adopted";
      next.revision += 1;
      next.updatedAt = at;
      touchProduction(store, next, "asset-adopted", { candidateId, requestId: rid }, at);
      emit({ projectId, kind: "production", id: productionId, revision: next.revision });
      return { production: clone2(next), candidateId, requestId: rid, result: external };
    });
  }
  async function rejectCandidate(input) {
    return enqueue((store) => {
      const projectId = assertProject(input);
      const productionId = text(input.productionId, "productionId");
      const candidateId = text(input.candidateId ?? input.assetCandidateId, "candidateId");
      const reason = optionalText(input.reason);
      const production = store.getProduction(projectId, productionId);
      if (!production)
        throw new WorkflowError("not-found", `找不到制作请求：${productionId}`);
      checkRevision(production.revision, input.baseRevision, production);
      const rid = requestId(input.requestId, `reject-candidate:${projectId}:${productionId}:${candidateId}`);
      const fingerprint = digest4({ operation: "reject-candidate", productionId, candidateId, reason: reason ?? "" });
      const prior = store.getRequest(projectId, rid);
      if (prior && prior.fingerprint !== fingerprint)
        throw new WorkflowRequestIdReuseError(undefined, { requestId: rid, previous: prior });
      if (prior?.todoId)
        return { todoId: prior.todoId, production: clone2(production) };
      if (!production.candidateRefs.some((value) => (value.id ?? value.key ?? value.assetId) === candidateId))
        throw new WorkflowError("not-found", `找不到候选：${candidateId}`);
      const at = iso(now());
      const next = clone2(production);
      const marked = next.candidateRefs.find((value) => (value.id ?? value.key ?? value.assetId) === candidateId);
      marked.rejectedAt = at;
      if (reason)
        marked.rejectReason = reason;
      else
        delete marked.rejectReason;
      checkCapacity(store, projectId, "todo");
      const todoId = `todo-${makeId()}`;
      const assetId = optionalText(marked.assetId);
      const todo = {
        projectId,
        id: todoId,
        title: `返修：${production.brief}`,
        description: [`候选 ${candidateId} 被否决`, ...assetId ? [`关联资产 ${assetId}`] : [], ...reason ? [`原因：${reason}`] : []].join("；"),
        status: "todo",
        completed: false,
        priority: "high",
        category: "返修",
        productionId,
        context: { projectId, kind: "production", id: productionId },
        requirementRevision: 1,
        revision: 1,
        createdAt: at,
        updatedAt: at
      };
      next.revision += 1;
      next.updatedAt = at;
      touchProduction(store, next, "candidate-rejected", { candidateId, todoId, requestId: rid }, at);
      touchTodo(store, todo, "created", { title: todo.title, productionId, candidateId }, at);
      store.putRequest({ projectId, requestId: rid, operation: "reject-candidate", fingerprint, productionId, todoId, status: "completed", createdAt: prior?.createdAt ?? at, updatedAt: at });
      emit({ projectId, kind: "production", id: productionId, revision: next.revision });
      emit({ projectId, kind: "todo", id: todoId, revision: todo.revision });
      return { todoId, production: clone2(next) };
    });
  }
  async function query(input, context) {
    const store = await ready;
    if (closed)
      throw new WorkflowError("closed", "工作流服务已关闭");
    const op = text(input.op ?? input.name ?? input.query, "query");
    const projectId = assertProject(input);
    if (op === "todos") {
      if (input.view !== undefined && input.view !== "text")
        throw new WorkflowError("invalid-input", "未知 Todo 列表视图");
      if (input.view === "text") {
        const source = store.todoTexts(projectId, input);
        return D(source.rows, input, { revision: source.revision, scope: { projectId, projectGeneration: typeof input.projectGeneration === "string" ? input.projectGeneration : null, query: "todos", view: "text" } });
      }
      const summaries = store.listTodoSummaries(projectId, input).map((item) => ({ ...item, ...typeof input.projectGeneration === "string" ? { projectGeneration: input.projectGeneration } : {} }));
      const revision = digest4(summaries.map((item) => [item.id, item.revision, item.updatedAt]));
      return D(summaries, input, { revision, scope: { projectId, projectGeneration: typeof input.projectGeneration === "string" ? input.projectGeneration : null, query: "todos", view: input.view === "text" ? "text" : "summary" } });
    }
    if (op === "categories") {
      const categories = store.todoCategories(projectId);
      return D(categories, input, { revision: digest4(categories), scope: { projectId, projectGeneration: typeof input.projectGeneration === "string" ? input.projectGeneration : null, query: "categories" } });
    }
    if (op === "todo") {
      const id = text(input.id ?? input.itemId, "id");
      if (input.view === "summary") {
        const item = store.listTodoSummaries(projectId, { id })[0];
        if (!item)
          throw new WorkflowError("not-found", `找不到 Todo：${id}`);
        return { item: { ...item, ...typeof input.projectGeneration === "string" ? { projectGeneration: input.projectGeneration } : {} } };
      }
      const item = store.getTodo(projectId, id);
      if (!item)
        throw new WorkflowError("not-found", `找不到 Todo：${id}`);
      if (input.view === "history") {
        const history = store.listHistoryPage(projectId, "todo", id, input);
        return { history: history.items, ...history.nextCursor ? { nextCursor: history.nextCursor } : {}, historyLimit: history.limit };
      }
      if (input.view !== undefined)
        throw new WorkflowError("invalid-input", "未知 Todo 详情视图");
      return { item: projectTodoRequirement(item, input.projectGeneration), requirementFingerprint: todoRequirementFingerprint(item) };
    }
    if (op === "productions") {
      return store.listProductionsPage(projectId, input);
    }
    if (op === "changes") {
      const filter = optionalText(input.filter);
      if (filter) {
        if (!Object.hasOwn(gameChangeFilters, filter))
          throw new WorkflowError("invalid-input", "未知改动状态筛选");
        const stages = gameChangeFilters[filter];
        const q = optionalText(input.q ?? input.search)?.toLocaleLowerCase();
        const items = store.listProductions(projectId).filter((item) => !q || `${item.brief}
${item.id}
${item.todoId ?? ""}`.toLocaleLowerCase().includes(q)).map((item) => projectGameChange(item)).filter((item) => stages.includes(item.stage));
        return { ...pageRecords(items, input), projectId };
      }
      const page = store.listProductionsPage(projectId, input);
      return { ...page, items: page.items.map((item) => projectGameChange(store.getProduction(projectId, item.id))) };
    }
    if (op === "productionDispatch") {
      const production = store.getProduction(projectId, text(input.productionId, "productionId"));
      if (!production)
        throw new WorkflowError("not-found", "找不到制作单");
      const round = production.rounds.at(-1);
      if (!round || round.requestId !== input.requestId || round.round !== input.round || round.requirementRevision !== production.requirementRevision)
        throw new WorkflowError("conflict", "制作轮次或需求已变化，未交办执行");
      assertRoundScope(round, input);
      if (round.result || production.status === "adopted")
        return { completed: true, production: clone2(production) };
      return { production: clone2(production), round: clone2(round), submit: dispatchInput(production, round), legacyReconciliation: !round.projectGeneration };
    }
    if (op === "production") {
      const id = text(input.id ?? input.productionId, "productionId");
      const production = store.getProduction(projectId, id);
      if (!production)
        throw new WorkflowError("not-found", `找不到制作请求：${id}`);
      const history = store.listHistoryPage(projectId, "production", id, input);
      const execution = context?.execution && production.execution ? await context.execution(clone2(production.execution)) : undefined;
      return { production: clone2(production), history: history.items, ...history.nextCursor ? { nextCursor: history.nextCursor } : {}, historyLimit: history.limit, ...execution !== undefined ? { execution } : {} };
    }
    if (op === "gameCandidates") {
      const featureId = optionalText(input.featureId);
      const candidates = store.listProductions(projectId).flatMap((item) => item.gameCandidates ?? []).filter((item) => !featureId || item.featureId === featureId);
      return { projectId, items: candidates.map(clone2), total: candidates.length };
    }
    if (op === "workflowStatus") {
      const counts = {
        todos: store.countTodos(projectId),
        todo: store.countTodosByStatus(projectId, "todo"),
        inProgress: store.countTodosByStatus(projectId, "in_progress"),
        done: store.countTodosByStatus(projectId, "done"),
        blocked: store.countTodosByStatus(projectId, "blocked"),
        productions: store.countProductions(projectId),
        productionDrafts: store.countProductionsByStatus(projectId, "draft"),
        productionRunning: store.countProductionsByStatus(projectId, "reserved") + store.countProductionsByStatus(projectId, "queued") + store.countProductionsByStatus(projectId, "running"),
        productionCompleted: store.countProductionsByStatus(projectId, "completed") + store.countProductionsByStatus(projectId, "adopted")
      };
      return { projectId, project: projects.get(projectId), counts, scaleTargets: { ...WORKFLOW_SCALE_TARGETS }, limits: { pageSize: WORKFLOW_PAGE_SIZE }, generationCapability: "unknown" };
    }
    throw new WorkflowError("unknown-query", `未知工作流查询：${op}`);
  }
  async function withRequirementFingerprint(pending) {
    const result = await pending;
    return { ...result, requirementFingerprint: todoRequirementFingerprint(result.item) };
  }
  async function command(method, input, context) {
    if (typeof method !== "string" || !method.trim())
      throw new WorkflowError("invalid-input", "command method 不能为空");
    const name = method.trim();
    switch (name) {
      case "createTodo":
        return withRequirementFingerprint(createTodo(input));
      case "updateTodo":
        return withRequirementFingerprint(updateTodo(input));
      case "deleteTodo":
        return deleteTodo(input);
      case "todoFeedback":
      case "feedback":
        return withRequirementFingerprint(todoFeedback(input));
      case "importTodos":
        return importTodos(input);
      case "importProductions":
        return importProductions(input);
      case "delegateTodo":
        return delegateTodo(input);
      case "upsertProduction":
      case "createProduction":
        return upsertProduction(input);
      case "updateProduction":
        return updateProduction(input);
      case "reserveProduction":
        return reserveProduction(input);
      case "bindProduction":
        return bindProduction(input);
      case "productionResult":
      case "receiveResult":
        return productionResult(input);
      case "bindTodo":
        return bindTodo(input);
      case "recordCandidates":
      case "registerCandidates":
        return registerCandidates(input, context);
      case "recordAdoption":
      case "adoptAsset":
        return adoptAsset(input, context);
      case "rejectCandidate":
        return rejectCandidate(input);
      case "recordGameCandidate":
        return recordGameCandidate(input);
      case "recordGameAdoption":
        return recordGameAdoption(input);
      default:
        throw new WorkflowError("unknown-command", `未知工作流命令：${name}`);
    }
  }
  return {
    query,
    command,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    async close() {
      if (closed)
        return;
      await queue;
      closed = true;
      const store = await ready;
      await store.close();
      listeners.clear();
    }
  };
}

// plugins/cardgame-content/src/deck-plan.ts
import { createHash as createHash10 } from "node:crypto";
var stable2 = (value) => JSON.stringify(value, (_key, item) => item && typeof item === "object" && !Array.isArray(item) ? Object.fromEntries(Object.entries(item).sort(([a], [b]) => a.localeCompare(b))) : item);
var deckHash = (value) => createHash10("sha256").update(stable2(value)).digest("hex");
var deckPath = (plan) => `public/data/decks/worka-${plan.id}.json`;
function validDeckTargetPath(path) {
  return /^public\/data\/cards\/(units|artifacts|talismans|fields)\.json$/.test(path) || /^public\/data\/decks\/worka-[A-Za-z0-9][A-Za-z0-9_-]{0,63}\.json$/.test(path) || path === "public/data/decks/starter-deck.json" || path === "public/assets/asset-manifest.json" || /^public\/assets\/card-faces\/[A-Za-z0-9][A-Za-z0-9._-]{0,127}\/[A-Za-z0-9._-]+\.png$/.test(path);
}
function deckCandidateHash(item) {
  return deckHash({
    kind: "deck",
    targetId: item.targetId,
    deckPath: item.deckPath,
    deckCardIds: item.deckCardIds,
    deckCardFingerprints: item.deckCardFingerprints,
    placeholderCardIds: item.placeholderCardIds,
    ...item.deckArtFingerprints ? { deckLogicFingerprint: item.deckLogicFingerprint, deckArtFingerprints: item.deckArtFingerprints } : {},
    commit: item.commit,
    fingerprint: item.fingerprint,
    sourceTree: item.sourceSnapshotTree,
    sourceSnapshotScope: item.sourceSnapshotScope,
    targetBaseRevision: item.targetBaseRevision,
    validationManifest: item.validationManifest,
    dependencies: item.dependencies,
    baseDependencies: item.baseDependencies,
    changedPaths: item.changedPaths
  });
}
function normalizeDeckPlan(value, brief, previous) {
  const raw = value;
  if (!raw || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(raw.id ?? "") || typeof raw.title !== "string" || !raw.title.trim())
    throw Error("牌组需要安全的独立 ID 和名称");
  if (previous && previous.id !== raw.id)
    throw Error("已有牌组 ID 不可修改；另建制作单可设计新牌组");
  if (!Number.isInteger(raw.targetSize) || raw.targetSize < 20 || raw.targetSize > 30)
    throw Error("独立牌组目标需要 20–30 张");
  if (!Array.isArray(raw.entries) || raw.entries.length > 30)
    throw Error("牌组需要最多 30 种卡牌的数量方案");
  const seen = new Set;
  const entries = raw.entries.map((entry) => {
    if (!entry || typeof entry.cardId !== "string" || !entry.cardId.trim() || seen.has(entry.cardId))
      throw Error("牌组条目需要唯一卡牌 ID");
    if (!Number.isInteger(entry.count) || entry.count < 1 || entry.count > 3)
      throw Error("每种卡牌需要 1–3 张副本");
    seen.add(entry.cardId);
    return { cardId: entry.cardId, count: entry.count };
  });
  return {
    id: raw.id,
    title: raw.title.trim(),
    targetSize: raw.targetSize,
    entries,
    basisBrief: brief,
    ...previous?.approvedFingerprint ? { approvedFingerprint: previous.approvedFingerprint } : {}
  };
}
function deckCardFingerprints(cards, plan) {
  return Object.fromEntries(plan.entries.map((entry) => {
    const card = cards.find((card) => card.definition.id === entry.cardId);
    return [entry.cardId, deckHash(card ? { definition: card.definition, sourceRevision: card.sourceRevision } : null)];
  }));
}
function deckArtFingerprints(cards, plan) {
  return Object.fromEntries(plan.entries.map((entry) => {
    const card = cards.find((item) => item.definition.id === entry.cardId);
    return [entry.cardId, deckHash(card ? { artBrief: card.artBrief, art: card.art, assembly: card.assembly, presentation: card.presentation } : null)];
  }));
}
function deckFingerprint(cards, plan, brief) {
  return deckHash({ id: plan.id, title: plan.title, targetSize: plan.targetSize, entries: [...plan.entries].sort((a, b) => a.cardId.localeCompare(b.cardId)), brief, cards: deckCardFingerprints(cards, plan) });
}
function inspectDeck(cards, plan, brief, candidates = []) {
  const errors = [], warnings = [];
  const totalCopies = plan.entries.reduce((total, entry) => total + entry.count, 0);
  const used = plan.entries.map((entry) => cards.find((card) => card.definition.id === entry.cardId));
  if (totalCopies !== plan.targetSize)
    errors.push(`当前 ${totalCopies} 张，目标 ${plan.targetSize} 张`);
  for (const [index, entry] of plan.entries.entries()) {
    const card = used[index]?.definition;
    if (!card) {
      errors.push(`未找到卡牌 ${entry.cardId} 的草稿`);
      continue;
    }
    if (!["unit", "artifact", "talisman", "field"].includes(card.kind))
      errors.push(`${card.name} 属于战斗槽位，不能计入牌组`);
    if (entry.count > Math.min(3, card.limitPerDeck ?? 3))
      errors.push(`${card.name} 超过单卡副本上限`);
  }
  const units = used.filter((card) => card?.definition.kind === "unit");
  if (!units.length)
    errors.push("牌组至少需要一张单位卡");
  for (const card of used)
    for (const effect of card?.definition.effects ?? []) {
      const required = effect.target?.requiredLabelsAllOf;
      if (["singleAlly", "allAllies"].includes(effect.target?.scope) && Array.isArray(required) && required.length && !units.some((unit) => required.every((label) => unit?.definition.labels?.includes(label))))
        warnings.push(`${card.definition.name} 的己方标签目标在本牌组中不存在：${required.join("、")}`);
    }
  const fingerprint = deckFingerprint(cards, plan, brief);
  const latest = candidates.filter((item) => item.kind === "deck" && item.targetId === plan.id && item.status !== "undone").at(-1);
  const current = latest?.deckArtFingerprints ? latest.deckLogicFingerprint === fingerprint && deckHash(latest.deckArtFingerprints) === deckHash(deckArtFingerprints(cards, plan)) : latest?.fingerprint === fingerprint;
  const hashes = deckCardFingerprints(cards, plan);
  const changedCardIds = latest ? Object.keys(hashes).filter((id) => hashes[id] !== latest.deckCardFingerprints?.[id]) : [];
  const basisChanged = plan.basisBrief !== brief;
  const confirmed = !basisChanged && plan.approvedFingerprint === fingerprint;
  const adopted = current && latest?.status === "adopted";
  const status = basisChanged ? "basis-changed" : errors.length ? "incomplete" : !confirmed ? "needs-review" : adopted ? "adopted" : current ? "candidate" : latest ? "stale" : "ready";
  const next = status === "basis-changed" ? "上游简报已变化：核对草稿并保存牌组方案，再重新确认" : errors.length ? "补齐卡牌草稿与数量方案" : !confirmed ? "确认整套卡牌草案" : adopted ? "已加入正式游戏，可在牌组试炼中选择并开局" : current ? "在试玩便笺验证整套候选，再决定调整" : "建立当前整套试玩候选";
  return {
    totalCopies,
    distinctCards: plan.entries.length,
    targetSize: plan.targetSize,
    errors,
    warnings,
    legal: errors.length === 0,
    fingerprint,
    confirmed,
    basisChanged,
    status,
    next,
    changedCardIds,
    candidateId: current ? latest.id : undefined,
    staleCandidateId: latest && !current ? latest.id : undefined,
    checkScope: "数量、副本与组合目标引用；不代表实战平衡验证"
  };
}
function assertDeckWriteAccess(method, input, callerKind) {
  if (method === "confirmDeckDraft" && callerKind !== "user")
    throw Error("整套卡牌草案需要用户明确确认");
  if (["updateProduction", "upsertProduction"].includes(method) && (input.batch?.kind === "card-generation" || input.patch?.batch?.kind === "card-generation"))
    throw Error("卡牌批次内容与确认状态只能通过 cardWorkflow 专用动作更新");
}

// ../notes/note-4/card-operations.ts
var CARD_OPERATIONS = ["createCardBatch", "setCardDrafts", "saveCardDraft", "approveCardDrafts", "requestCardArt", "reuseCardArt", "attachCardArt", "assembleCardFaces", "integrateCard", "saveDeckPlan", "confirmDeckDraft", "prepareDeckArt", "stageDeckCandidate"];

// plugins/cardgame-content/src/card-pipeline.ts
import { createHash as createHash11, randomUUID as randomUUID8 } from "node:crypto";
import { readFile as readFile10, realpath as realpath7, stat as stat5 } from "node:fs/promises";
import { homedir } from "node:os";
import { isAbsolute as isAbsolute5, join as join7, relative as relative5, sep as sep6 } from "node:path";
import sharp2 from "sharp";

// ../notes/note-4/card-face.ts
var CARD_FACE_VERSION = 4;
var CARD_FACE_THEMES = [
  { id: "jade", name: "青玉", description: "青玉牌框 · 大幅插画", version: 1 },
  { id: "scroll", name: "宣纸", description: "宣纸卷轴 · 题签与留白", version: 1 }
];
var CARD_KIND_LABELS = { unit: "单位", artifact: "法器", talisman: "符箓", field: "场地", skill: "技能", pill: "丹药" };
var DEFAULT_FACE = { themeId: "jade", zoom: 1, focus: 0.5 };
function normalizeFace(value = {}) {
  const face = { ...DEFAULT_FACE, ...value };
  if (!CARD_FACE_THEMES.some((theme) => theme.id === face.themeId))
    throw Error("未知卡面主题");
  if (!Number.isFinite(face.zoom) || face.zoom < 1 || face.zoom > 2 || !Number.isFinite(face.focus) || face.focus < 0 || face.focus > 1)
    throw Error("裁切范围无效");
  return face;
}
var escape = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[ch]);
function cardRules(card) {
  const rules = (card.effects ?? []).map((effect) => effect.text).filter(Boolean).join(`
`);
  return rules || String(card.description ?? "");
}
function lines(value, units) {
  const result = [];
  for (const paragraph of value.split(`
`)) {
    let line = "", width = 0;
    for (const ch of paragraph) {
      const next = /[\u0000-\u00ff]/.test(ch) ? 0.6 : 1;
      if (line && width + next > units && !/[，。！？、；：）》」』】]/u.test(ch)) {
        result.push(line);
        line = "";
        width = 0;
      }
      line += ch;
      width += next;
    }
    if (line)
      result.push(line);
  }
  return result;
}
function faceDiagnostics(card) {
  const errors = [];
  if (!String(card.name ?? "").trim() || [...String(card.name)].length > 12)
    errors.push("卡名需要 1–12 个字");
  if (lines(cardRules(card), 19).length > 5)
    errors.push("效果文案超过五行，请精简后组装");
  return errors;
}
function renderCardFace(card, art, presentation, includeStats = true, fontFamily = "KaiTi, Noto Serif CJK SC, Noto Serif SC, serif") {
  const face = normalizeFace(presentation);
  const diagnostics = faceDiagnostics(card);
  if (diagnostics.length)
    throw Error(diagnostics.join("；"));
  if (!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(art))
    throw Error("卡图必须是已读取的位图");
  const scroll = face.themeId === "scroll";
  const shell = scroll ? "#e8dfc8" : "#152c27", ink = scroll ? "#333b34" : "#eee3bd", gold = scroll ? "#796d50" : "#c3a977";
  const x = scroll ? 42 : 24, y = scroll ? 132 : 94, w = scroll ? 456 : 492, h = scroll ? 350 : 416;
  const artW = w * face.zoom, artH = h * face.zoom;
  const name = scroll ? 84 : 61;
  const ruleLines = lines(cardRules(card), 19);
  const text = (x, y, value, size, color, anchor = "middle") => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="${anchor}">${escape(value)}</text>`;
  const rarity = { common: "普通", uncommon: "精良", rare: "稀有", epic: "史诗", legendary: "传说" };
  const meta = [card.race ?? CARD_KIND_LABELS[card.kind ?? ""] ?? card.kind, (card.linggen ?? []).join("·"), rarity[card.rarity ?? ""] ?? card.rarity].filter(Boolean).join(" · ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="540" height="780" viewBox="0 0 540 780">
  <defs><clipPath id="art"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${scroll ? 2 : 3}"/></clipPath></defs>
  <rect x="3" y="3" width="534" height="774" rx="${scroll ? 5 : 20}" fill="${shell}" stroke="${gold}" stroke-width="4"/>
  <rect x="15" y="15" width="510" height="750" rx="${scroll ? 1 : 14}" fill="none" stroke="${gold}" stroke-width="1"/>
  <g font-family="${escape(fontFamily)}">
  ${scroll ? `<path d="M34 112H506M34 122H506" stroke="${gold}"/><rect x="477" y="42" width="20" height="43" fill="#934c3e"/>` : ""}
  ${text(270, name, card.name, 42, ink)}
  <g clip-path="url(#art)"><image href="${art}" x="${x - (artW - w) / 2}" y="${y - (artH - h) * face.focus}" width="${artW}" height="${artH}" preserveAspectRatio="xMidYMid meet"/></g>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${gold}"/>
  <rect x="24" y="520" width="492" height="174" fill="${scroll ? "#f3ecd9" : "#eee6ce"}"/>
  ${text(270, scroll ? 512 : 538, meta, 20, scroll ? "#655f4c" : "#465741")}
  ${ruleLines.map((line, index) => text(52, 566 + index * 23, line, 22, "#2f3829", "start")).join("")}
  <path d="M54 692H486" stroke="${gold}" stroke-width="1"/>
  ${card.kind === "unit" ? `<rect x="45" y="707" width="132" height="43" rx="7" fill="#553426"/><rect x="363" y="707" width="132" height="43" rx="7" fill="#254936"/>${includeStats ? text(111, 738, `攻 ${card.attack}`, 29, "#f3cd9b") + text(429, 738, `命 ${card.health}`, 29, "#d7e6b4") : ""}` : text(270, 725, CARD_KIND_LABELS[card.kind ?? ""] ?? card.kind, 23, ink)}
  ${text(270, card.kind === "unit" ? 735 : 751, card.id, 14, scroll ? "#756e5c" : "#a0b5a2")}
  </g></svg>`;
}

// plugins/cardgame-content/src/card-pipeline.ts
function stable3(value) {
  if (Array.isArray(value))
    return `[${value.map(stable3).join(",")}]`;
  if (value && typeof value === "object")
    return `{${Object.keys(value).sort().filter((key) => value[key] !== undefined).map((key) => JSON.stringify(key) + ":" + stable3(value[key])).join(",")}}`;
  return JSON.stringify(value);
}
var hash2 = (value) => createHash11("sha256").update(stable3(value)).digest("hex");
var text2 = (value, label) => {
  if (typeof value !== "string" || !value.trim())
    throw Error(`${label}不能为空`);
  return value.trim();
};
var reviewFingerprint = (card) => hash2(card.definition);
var artFingerprint = (card) => hash2({ id: card.definition.id, brief: card.artBrief });
var faceFingerprint = (card) => hash2({ definition: card.definition, art: card.art, zoom: card.presentation.zoom, focus: card.presentation.focus, templates: CARD_FACE_THEMES, version: CARD_FACE_VERSION });
var candidateFingerprint = (card, featureId) => hash2({ definition: card.definition, art: card.art, assembly: card.assembly, presentation: card.presentation, sourceRevision: card.sourceRevision, featureId });
function cardStage(card, candidates = []) {
  if (card.reviewed !== reviewFingerprint(card))
    return "review";
  if (!card.art || card.art.fingerprint !== artFingerprint(card))
    return "art";
  if (card.assembly?.fingerprint !== faceFingerprint(card))
    return "assemble";
  if (!candidates.some((candidate) => candidate.cardId === card.definition.id && candidate.fingerprint === candidateFingerprint(card, candidate.featureId) && candidate.status !== "undone"))
    return "integrate";
  return "done";
}
function cardBatch(value) {
  const batch = value;
  return batch?.kind === "card-generation" && batch.schemaVersion === 1 && Array.isArray(batch.cards) ? batch : undefined;
}
function createCardPipeline(content, workflow, fonts = {}, candidates, options = {}) {
  const generatedImagesRoot = options.generatedImagesRoot ?? join7(process.env.CODEX_HOME || join7(homedir(), ".codex"), "generated_images");
  let queue = Promise.resolve(undefined);
  const serial = (operation) => {
    const next = queue.then(operation);
    queue = next.catch(() => {
      return;
    });
    return next;
  };
  const generationJobs = new Map;
  let systemFont;
  const faceFont = (projectId) => fonts[projectId] ? Promise.resolve(fonts[projectId]) : systemFont ??= (async () => {
    const choices = [
      { file: "/mnt/c/Windows/Fonts/simkai.ttf", family: "KaiTi" },
      { file: "/usr/share/fonts/opentype/noto/NotoSerifCJK-Regular.ttc", family: "Noto Serif CJK SC" },
      { file: "/usr/share/fonts/truetype/arphic/ukai.ttc", family: "AR PL UKai CN" },
      ...process.platform === "win32" ? [{ file: join7(process.env.WINDIR || "C:\\Windows", "Fonts", "simkai.ttf"), family: "KaiTi" }] : []
    ];
    for (const item of choices)
      if (await stat5(item.file).then((info) => info.isFile(), () => false))
        return item;
    return;
  })();
  const generationKey = (projectId, productionId, cardId, requestId) => `${projectId}:${productionId}:${cardId}:${requestId}`;
  async function detail(input) {
    const { production } = await workflow.query({ projectId: input.projectId, op: "production", id: input.productionId });
    const batch = cardBatch(production.batch);
    if (!batch)
      throw Error("这不是卡牌生成批次");
    if (input.baseRevision !== undefined && input.baseRevision !== production.revision)
      throw Error("制作单已变化，请刷新后重试");
    return { production, batch: structuredClone(batch) };
  }
  async function save(production, batch) {
    batch.progress = { total: batch.cards.length, done: batch.cards.filter((card) => cardStage(card, production.gameCandidates) === "done").length };
    return workflow.command("updateProduction", { projectId: production.projectId, productionId: production.id, baseRevision: production.revision, patch: { batch } });
  }
  async function candidate(projectId, bytes, name, provider = "card-template") {
    const results = await content.command("registerCandidates", { projectId, candidates: [{ name, mimeType: "image/png", base64: bytes.toString("base64"), metadata: { purpose: "card-face", provider } }] });
    return results[0];
  }
  async function readGeneratedImage(pathInput) {
    const path = text2(pathInput, "Codex 生图文件路径");
    if (!isAbsolute5(path))
      throw Error("Codex 生图文件必须使用绝对路径");
    let root;
    let resolved;
    try {
      [root, resolved] = await Promise.all([realpath7(generatedImagesRoot), realpath7(path)]);
    } catch {
      throw Error("Codex 生图文件不存在或输出目录不可用");
    }
    const within = relative5(root, resolved);
    if (!within || within === ".." || within.startsWith(`..${sep6}`) || isAbsolute5(within)) {
      throw Error("仅接受 Codex generated_images 目录中的文件");
    }
    const file = await stat5(resolved);
    if (!file.isFile() || file.size > 20000000)
      throw Error("Codex 生图文件必须是 20 MB 以内的普通文件");
    const bytes = await readFile10(resolved);
    if (bytes.length > 20000000)
      throw Error("Codex 生图文件超过 20 MB");
    return bytes;
  }
  async function currentGeneration(projectId, productionId, cardId, requestId) {
    const current = await detail({ projectId, productionId });
    const card = current.batch.cards.find((item) => item.definition.id === cardId);
    return card?.artRequest?.id === requestId && card.artRequest.fingerprint === artFingerprint(card) ? { ...current, card } : undefined;
  }
  function startGeneration(projectId, productionId, cardId, request) {
    const generator = options.imageGenerator;
    if (!generator)
      return;
    const key = generationKey(projectId, productionId, cardId, request.id);
    if (generationJobs.has(key))
      return;
    const controller = new AbortController;
    const done = (async () => {
      try {
        const generatedImagePath = await generator.generate(request.prompt, controller.signal);
        const attached = await serial(async () => {
          const current = await currentGeneration(projectId, productionId, cardId, request.id);
          if (!current || current.card.art?.fingerprint === artFingerprint(current.card))
            return false;
          await execute("attachCardArt", { projectId, productionId, cardId, requestId: request.id, baseRevision: current.production.revision, generatedImagePath });
          return true;
        });
        if (!attached)
          return;
        const assembled = await serial(async () => {
          const current = await currentGeneration(projectId, productionId, cardId, request.id);
          if (!current)
            return false;
          await execute("assembleCardFaces", { projectId, productionId, cardId, baseRevision: current.production.revision });
          return true;
        });
        if (!assembled || !candidates)
          return;
        await serial(async () => {
          const current = await currentGeneration(projectId, productionId, cardId, request.id);
          if (current && !current.batch.deck)
            await execute("integrateCard", { projectId, productionId, cardId, baseRevision: current.production.revision });
        });
      } catch (cause) {
        await serial(async () => {
          const current = await currentGeneration(projectId, productionId, cardId, request.id).catch(() => {
            return;
          });
          if (!current || current.card.artGeneration?.requestId !== request.id)
            return;
          current.card.artGeneration = { ...current.card.artGeneration, status: "failed", error: cause instanceof Error ? cause.message : String(cause) };
          await save(current.production, current.batch);
        }).catch(() => {
          return;
        });
      }
    })();
    generationJobs.set(key, { controller, done });
    done.finally(() => generationJobs.delete(key));
  }
  async function create(input) {
    if (input.productionId)
      throw Error("新建批次由服务生成 ID；修改请使用现有批次动作");
    const requested = typeof input.requestId === "string" && input.requestId.trim() ? input.requestId.trim() : undefined;
    const creation = requested ? { requestId: requested, fingerprint: hash2({ projectId: input.projectId, brief: input.brief, featureId: input.featureId, todoId: input.todoId, cards: input.cards, cardIds: input.cardIds, companion: input.companion, deckPlan: input.deckPlan }) } : undefined;
    const requestedId = requested ? `production-card-${hash2({ projectId: input.projectId, requestId: requested }).slice(0, 32)}` : undefined;
    let prior;
    if (requestedId) {
      try {
        prior = (await workflow.query({ projectId: input.projectId, op: "production", id: requestedId })).production;
      } catch (error) {
        if (error.code !== "not-found")
          throw error;
      }
      if (prior && cardBatch(prior.batch)?.creation?.fingerprint !== creation?.fingerprint)
        throw Error("这个创建请求已经用于另一份需求，请重新发起创建");
    }
    let todo;
    if (input.todoId) {
      todo = (await workflow.query({ projectId: input.projectId, op: "todo", view: "summary", id: text2(input.todoId, "待办") })).item;
      if (todo.productionId && todo.productionId !== requestedId)
        throw Error("该待办已关联制作单，请打开已有制作单");
    }
    if (prior) {
      if (todo)
        await workflow.command("bindTodo", { projectId: input.projectId, todoId: todo.id, productionId: prior.id, todoBaseRevision: todo.revision, productionBaseRevision: prior.revision });
      return { production: prior, revision: prior.revision, created: false, reused: true };
    }
    let companion;
    if (input.companion) {
      const source = await content.query({ projectId: input.projectId, op: "card", id: text2(input.companion.cardId, "配套单位") });
      if (source.json?.kind !== "unit" || source.revision !== input.companion.revision)
        throw Error("配套单位已变化，请刷新后重新设计");
      companion = { cardId: source.id, revision: source.revision };
    }
    const cards = [];
    for (const id of input.cardIds ?? []) {
      const source = await content.query({ projectId: input.projectId, op: "card", id });
      if (input.sourceRevisions?.[id] && input.sourceRevisions[id] !== source.revision)
        throw Error(`卡牌 ${id} 已变化，请刷新后建立候选`);
      const { cardFace: _face, ...definition } = source.json;
      const card = { definition, sourceRevision: source.revision, artBrief: String(input.artBrief || `为「${source.name}」绘制修仙像素插画，主体清晰，无文字、无边框、无数值。`), presentation: normalizeFace({ themeId: source.json?.cardFace?.themeId ?? DEFAULT_FACE.themeId }) };
      const artwork = source.json?.cardFace?.artwork;
      if (typeof artwork === "string" && artwork.startsWith("/assets/card-faces/")) {
        try {
          const asset = await content.resolveMedia({ projectId: input.projectId, op: "media", path: "public" + artwork, variant: "original" });
          card.art = { id: asset.id, revision: asset.revision, fingerprint: artFingerprint(card), provider: "codex" };
        } catch (error) {
          if (error.code !== "NOT_FOUND")
            throw error;
        }
      }
      cards.push(card);
    }
    for (const raw of input.cards ?? []) {
      const definition = validateCard(raw);
      cardCollection(definition.kind);
      cards.push({ definition, artBrief: `为「${definition.name}」绘制修仙像素插画，无文字、无边框、无数值。`, presentation: { ...DEFAULT_FACE } });
    }
    if (cards.length > 30 || new Set(cards.map((card) => card.definition.id)).size !== cards.length)
      throw Error("每批最多 30 张，卡牌 ID 不能重复");
    for (const card of cards)
      cardCollection(card.definition.kind);
    const batch = { kind: "card-generation", schemaVersion: 1, provider: "codex", cards, ...cards.length ? { draftOrigin: ["agent", "user"].includes(input._draftOrigin) ? input._draftOrigin : "unknown", ...input._draftOrigin === "agent" && input._draftSource ? { draftSource: input._draftSource } : {} } : {}, ...creation ? { creation } : {}, ...companion ? { companion } : {}, progress: { total: cards.length, done: 0 }, ...input.deckPlan ? { deck: normalizeDeckPlan(input.deckPlan, input.brief) } : {} };
    const result = await workflow.command("upsertProduction", { projectId: input.projectId, ...requestedId ? { id: requestedId } : {}, ...todo ? { todoId: todo.id } : {}, brief: text2(input.brief, "制作目标"), featureId: text2(input.featureId, "功能项"), batch });
    if (todo)
      await workflow.command("bindTodo", { projectId: input.projectId, todoId: todo.id, productionId: result.production.id, todoBaseRevision: todo.revision, productionBaseRevision: result.revision });
    return result;
  }
  async function execute(method, input) {
    if (method === "createCardBatch")
      return create(input);
    if (!Number.isInteger(input.baseRevision))
      throw Error("需要当前制作单 baseRevision，请先读取 cardBatch");
    const { production, batch } = await detail(input);
    if (method === "setCardDrafts") {
      if (batch.cards.some((card) => card.reviewed))
        throw Error("已确认的卡组不能被 AI 整批覆盖，请逐张修改");
      if (!Array.isArray(input.cards) || !input.cards.length || input.cards.length > 30)
        throw Error("需要 1–30 张卡牌定义");
      const ids = new Set;
      batch.cards = input.cards.map((raw) => {
        const definition = validateCard(raw);
        cardCollection(definition.kind);
        if (ids.has(String(definition.id)))
          throw Error("卡牌 ID 不可重复");
        ids.add(String(definition.id));
        const prior = batch.cards.find((card) => card.definition.id === definition.id);
        return { ...prior, definition, artBrief: prior?.artBrief ?? `为「${definition.name}」绘制修仙像素插画，无文字、无边框、无数值。`, presentation: prior?.presentation ?? { ...DEFAULT_FACE } };
      });
      if (input.deckPlan)
        batch.deck = normalizeDeckPlan(input.deckPlan, production.brief, batch.deck);
      batch.draftOrigin = ["agent", "user"].includes(input._draftOrigin) ? input._draftOrigin : "unknown";
      batch.draftSource = batch.draftOrigin === "agent" ? input._draftSource : undefined;
      return save(production, batch);
    }
    if (method === "linkCardCompanion") {
      const source = await content.query({ projectId: input.projectId, op: "card", id: text2(input.sourceCardId, "配套单位") });
      const { item: todo } = await workflow.query({ projectId: input.projectId, op: "todo", view: "summary", id: text2(input.todoId, "待办") });
      if (source.kind !== "unit" || source.revision !== input.sourceRevision)
        throw Error("配套单位已变化，请刷新后重试");
      if (todo.productionId && todo.productionId !== production.id)
        throw Error("待办已关联另一制作单");
      batch.companion = { cardId: source.id, revision: source.revision };
      const saved = await save(production, batch);
      return workflow.command("bindTodo", { projectId: input.projectId, productionId: production.id, todoId: todo.id, todoBaseRevision: todo.revision, productionBaseRevision: saved.revision });
    }
    if (method === "saveDeckPlan") {
      batch.deck = normalizeDeckPlan(input.deckPlan, production.brief, batch.deck);
      return save(production, batch);
    }
    if (method === "confirmDeckDraft") {
      if (!batch.deck)
        throw Error("没有独立牌组方案");
      const report = inspectDeck(batch.cards, batch.deck, production.brief, production.gameCandidates);
      if (!report.legal || report.basisChanged)
        throw Error("请先补齐数量、合法定义及当前简报对应的牌组方案");
      batch.deck.approvedFingerprint = report.fingerprint;
      return save(production, batch);
    }
    if (method === "prepareDeckArt") {
      if (!batch.deck)
        throw Error("没有独立牌组方案");
      const report = inspectDeck(batch.cards, batch.deck, production.brief, production.gameCandidates);
      if (!report.confirmed || !production.gameCandidates?.some((item) => item.kind === "deck" && item.targetId === batch.deck.id && item.status === "adopted"))
        throw Error("请先正式采用当前牌组，再更新整套插画");
      const cardRevisions = {};
      for (const entry of batch.deck.entries) {
        const card = batch.cards.find((item) => item.definition.id === entry.cardId);
        const source = await content.query({ projectId: input.projectId, op: "card", id: entry.cardId, freshKind: String(card.definition.kind) });
        const { cardFace: _face, ...definition } = source.json;
        if (stable3(definition) !== stable3(card.definition))
          throw Error(`正式卡牌 ${entry.cardId} 的规则或数值已变化，请先核对当前草稿`);
        cardRevisions[entry.cardId] = source.revision;
      }
      batch.artBaseline = { cardRevisions };
      return save(production, batch);
    }
    if (method === "stageDeckCandidate") {
      if (!candidates?.stageDeck)
        throw Error("整套候选服务不可用；不会写入正式游戏");
      return candidates.stageDeck({ projectId: input.projectId, productionId: production.id, featureId: text2(production.featureId, "制作单功能项"), baseRevision: production.revision });
    }
    if (method === "approveCardDrafts") {
      if (!batch.cards.length)
        throw Error("请先生成卡组草稿");
      for (const card of batch.cards.filter((card) => !input.cardId || card.definition.id === input.cardId)) {
        validateCard(card.definition);
        card.reviewed = reviewFingerprint(card);
      }
      return save(production, batch);
    }
    const card = batch.cards.find((card) => card.definition.id === input.cardId);
    if (!card)
      throw Error("找不到批次中的卡牌");
    if (method === "saveCardDraft") {
      const previousArtFingerprint = artFingerprint(card);
      if (input.definition) {
        const definition = validateCard(input.definition);
        if (definition.id !== card.definition.id || definition.kind !== card.definition.kind)
          throw Error("卡牌 ID 和类别不可修改");
        card.definition = definition;
      }
      if (input.artBrief !== undefined)
        card.artBrief = text2(input.artBrief, "生图要求");
      if (artFingerprint(card) !== previousArtFingerprint) {
        card.artRequest = undefined;
        card.artGeneration = undefined;
      }
      if (input.presentation)
        card.presentation = normalizeFace({ ...card.presentation, ...input.presentation });
      return save(production, batch);
    }
    if (card.reviewed !== reviewFingerprint(card)) {
      if (method === "requestCardArt" || method === "reuseCardArt" || method === "assembleCardFaces")
        card.reviewed = reviewFingerprint(card);
      else
        throw Error("卡牌定义已变化，请从当前草稿重新制作");
    }
    if (method === "reuseCardArt") {
      if (card.artGeneration?.status === "running")
        throw Error("当前卡牌正在生图，请等待该任务结束再选择复用");
      const sourceId = text2(input.sourceCardId, "插画来源卡牌");
      const source = await content.query({ projectId: input.projectId, op: "card", id: sourceId });
      if (typeof input.sourceRevision !== "string" || source.revision !== input.sourceRevision)
        throw Error("来源卡牌已变化，请刷新后重新选择插画");
      const artwork = source.json?.cardFace?.artwork;
      if (typeof artwork !== "string" || !artwork.startsWith("/assets/card-faces/"))
        throw Error("这张卡没有可复用的插画");
      const media = await content.resolveMedia({ projectId: input.projectId, op: "media", path: "public" + artwork, variant: "original" });
      const metadata = await sharp2(await readFile10(media.absolutePath), { limitInputPixels: 24000000 }).metadata();
      if (!["png", "jpeg", "webp"].includes(metadata.format ?? "") || (metadata.width ?? 0) < 256 || (metadata.height ?? 0) < 256)
        throw Error("来源需要至少 256×256 的 PNG、JPEG 或 WebP");
      const art = { id: media.id, revision: media.revision, fingerprint: artFingerprint(card), provider: "existing", sourceCardId: sourceId };
      if (stable3(card.art) === stable3(art) && cardBatch(production.batch)?.cards.find((item) => item.definition.id === card.definition.id)?.reviewed === reviewFingerprint(card))
        return { production, reused: true };
      card.art = art;
      card.artRequest = undefined;
      card.artGeneration = undefined;
      return save(production, batch);
    }
    if (method === "requestCardArt") {
      if (card.art?.fingerprint === artFingerprint(card)) {
        const result = await save(production, batch);
        return { ...result, reusedArt: true };
      }
      const fingerprint = artFingerprint(card);
      if (card.artRequest?.fingerprint !== fingerprint)
        card.artRequest = {
          id: randomUUID8(),
          fingerprint,
          prompt: `${card.artBrief}
只生成独立插画；不要卡名、规则、数字、边框或水印。保留四周裁切余量，主体放在中央。卡牌定义：${JSON.stringify(card.definition)}。`
        };
      const key = generationKey(input.projectId, production.id, card.definition.id, card.artRequest.id);
      if (generationJobs.has(key))
        return { production, batch, request: card.artRequest, automaticGeneration: true, generation: "running" };
      const automaticGeneration = await options.imageGenerator?.available() ?? false;
      card.artGeneration = { requestId: card.artRequest.id, status: automaticGeneration ? "running" : "unavailable", startedAt: new Date().toISOString(), ...!automaticGeneration ? { error: "当前宿主没有可用的 Codex CLI 内置生图能力" } : {} };
      const result = await save(production, batch);
      if (automaticGeneration)
        startGeneration(input.projectId, production.id, card.definition.id, card.artRequest);
      return { ...result, request: card.artRequest, automaticGeneration, ...automaticGeneration ? { generation: "running" } : { handoff: `当前宿主没有可用的 Codex CLI。请在 Codex 会话用 $imagegen 为当前请求生成插画，再把 $CODEX_HOME/generated_images 下的原始文件路径通过 attachCardArt 回填。请求：${card.artRequest.id}
${card.artRequest.prompt}` } };
    }
    if (method === "attachCardArt") {
      if (!card.artRequest || input.requestId !== card.artRequest.id || card.artRequest.fingerprint !== artFingerprint(card))
        throw Error("生图回执已过期，请使用当前生图请求");
      if (input.base64 !== undefined === (input.generatedImagePath !== undefined))
        throw Error("请只提供图片 base64 或 Codex 生图文件路径之一");
      let imageBytes;
      if (input.generatedImagePath !== undefined)
        imageBytes = await readGeneratedImage(input.generatedImagePath);
      else {
        const encoded = text2(input.base64, "图片");
        if (encoded.length > 28000000)
          throw Error("图片过大，请使用 20 MB 以内的素材");
        imageBytes = Buffer.from(encoded.replace(/^data:image\/\w+;base64,/, ""), "base64");
      }
      const image = sharp2(imageBytes, { limitInputPixels: 24000000 });
      const metadata = await image.metadata();
      if (!["png", "jpeg", "webp"].includes(metadata.format ?? "") || (metadata.width ?? 0) < 256 || (metadata.height ?? 0) < 256)
        throw Error("需要至少 256×256 的 PNG、JPEG 或 WebP");
      const bytes = await image.rotate().resize(2048, 2048, { fit: "inside", withoutEnlargement: true }).png().toBuffer();
      const asset = await candidate(input.projectId, bytes, `${card.definition.id}-art.png`, "codex");
      card.art = { id: String(asset.id), revision: String(asset.revision), fingerprint: artFingerprint(card), provider: "codex" };
      if (card.artGeneration?.requestId === card.artRequest.id)
        card.artGeneration = { ...card.artGeneration, status: "ready", error: undefined };
      return save(production, batch);
    }
    if (!card.art || card.art.fingerprint !== artFingerprint(card))
      throw Error("需要当前要求对应的插画");
    if (method === "assembleCardFaces") {
      const fingerprint = faceFingerprint(card);
      if (card.assembly?.fingerprint === fingerprint)
        return { production, reused: true };
      const media = await content.resolveMedia({ projectId: input.projectId, op: "media", id: card.art.id, variant: "original" });
      const art = `data:image/png;base64,${(await readFile10(media.absolutePath)).toString("base64")}`;
      const font = await faceFont(input.projectId);
      if (font)
        await sharp2({ text: { text: "卡牌", font: font.family, fontfile: font.file, rgba: true } }).png().toBuffer();
      const variants = {};
      for (const theme of CARD_FACE_THEMES) {
        const face = { ...card.presentation, themeId: theme.id };
        const preview = await sharp2(Buffer.from(renderCardFace(card.definition, art, face, true, font?.family))).png().toBuffer();
        const runtime = await sharp2(Buffer.from(renderCardFace(card.definition, art, face, false, font?.family))).png().toBuffer();
        const a = await candidate(input.projectId, preview, `${card.definition.id}-${theme.id}-preview.png`);
        const b = await candidate(input.projectId, runtime, `${card.definition.id}-${theme.id}-runtime.png`);
        variants[theme.id] = { previewId: String(a.id), runtimeId: String(b.id) };
      }
      card.assembly = { fingerprint, variants };
      return save(production, batch);
    }
    if (method === "integrateCard") {
      if (!candidates)
        throw Error("候选制作服务不可用；不会写入正式游戏");
      if (card.assembly?.fingerprint !== faceFingerprint(card))
        throw Error("牌面已过期，请重新组装");
      const featureId = text2(production.featureId, "制作单功能项");
      return candidates.stageCard({ projectId: input.projectId, productionId: production.id, cardId: card.definition.id, featureId, baseRevision: production.revision });
    }
    throw Error(`未知卡牌流程动作：${method}`);
  }
  return {
    command: (method, input) => serial(() => execute(method, input)),
    async query(input) {
      if (input.op === "cardFaceThemes")
        return { items: CARD_FACE_THEMES, provider: "codex", automaticGeneration: await options.imageGenerator?.available() ?? false };
      const { production, batch } = await detail(input);
      for (const card of batch.cards)
        if (card.artGeneration?.status === "running" && !generationJobs.has(generationKey(input.projectId, production.id, card.definition.id, card.artGeneration.requestId)))
          card.artGeneration = { ...card.artGeneration, status: "failed", error: "上次生图任务已中断，可重新发起当前请求" };
      return { production, batch, ...batch.deck ? { deckInspection: inspectDeck(batch.cards, batch.deck, production.brief, production.gameCandidates) } : {}, stages: Object.fromEntries(batch.cards.map((card) => [card.definition.id, cardStage(card, production.gameCandidates)])) };
    },
    async close() {
      for (const job of generationJobs.values())
        job.controller.abort();
      await Promise.allSettled([...generationJobs.values()].map((job) => job.done));
      await queue;
    }
  };
}
var CARD_PIPELINE_COMMANDS = new Set([...CARD_OPERATIONS, "linkCardCompanion"]);

// plugins/cardgame-content/src/codex-imagegen.ts
import { spawn } from "node:child_process";
import { readdir as readdir4, mkdtemp, rm as rm3 } from "node:fs/promises";
import { homedir as homedir2, tmpdir as tmpdir2 } from "node:os";
import { join as join8 } from "node:path";
var THREAD_ID = /^[0-9a-f-]{36}$/u;
var DEFAULT_TIMEOUT_MS = 10 * 60000;
function createCodexImageGenerator(options = {}) {
  const binary = options.binary ?? process.env.CODEX_EXECUTABLE ?? "codex";
  const generatedImagesRoot = options.generatedImagesRoot ?? join8(process.env.CODEX_HOME || join8(homedir2(), ".codex"), "generated_images");
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  let availability;
  const available = () => availability ??= new Promise((resolve) => {
    const child = spawn(binary, ["--version"], { stdio: "ignore" });
    const timer = setTimeout(() => {
      child.kill();
      resolve(false);
    }, 5000);
    child.once("error", () => {
      clearTimeout(timer);
      resolve(false);
    });
    child.once("close", (code) => {
      clearTimeout(timer);
      resolve(code === 0);
    });
  });
  async function generate(prompt, signal) {
    if (!await available())
      throw Error("Codex CLI 不可用，插画仍待生成");
    const directory = await mkdtemp(join8(tmpdir2(), "worka-codex-art-"));
    try {
      const instruction = `$imagegen
${prompt}

Generate exactly one original image with a transparent background. Use the built-in image generation tool. Do not run shell commands, edit project files, call a separate API, or copy the image. Reply with the generated image path only.`;
      const args = ["exec", "--json", "--skip-git-repo-check", "--ephemeral", "-C", directory, "-s", "workspace-write", "-"];
      const child = spawn(binary, args, { cwd: directory, stdio: ["pipe", "pipe", "pipe"] });
      let output = "";
      let stderr = "";
      child.stdout.setEncoding("utf8");
      child.stderr.setEncoding("utf8");
      child.stdout.on("data", (chunk) => {
        if (output.length < 256000)
          output += String(chunk).slice(0, 256000 - output.length);
      });
      child.stderr.on("data", (chunk) => {
        stderr = (stderr + String(chunk)).slice(-8000);
      });
      child.stdin.end(instruction);
      await new Promise((resolve, reject) => {
        let settled = false;
        const finish = (error) => {
          if (settled)
            return;
          settled = true;
          clearTimeout(timer);
          signal?.removeEventListener("abort", abort);
          if (error)
            reject(error);
          else
            resolve();
        };
        const abort = () => {
          child.kill();
          finish(Error("Codex 生图已中断，可重新发起当前请求"));
        };
        const timer = setTimeout(() => {
          child.kill();
          finish(Error("Codex 生图超时，可重新发起当前请求"));
        }, timeoutMs);
        signal?.addEventListener("abort", abort, { once: true });
        if (signal?.aborted) {
          abort();
          return;
        }
        child.once("error", (error) => finish(Error(`无法启动 Codex 生图：${error.message}`)));
        child.once("close", (code) => finish(code === 0 ? undefined : Error(`Codex 生图失败（退出码 ${code ?? "未知"}）${stderr.includes("rate limit") ? "：使用额度暂不可用" : ""}`)));
      });
      const threadId = output.match(/"type":"thread\.started","thread_id":"([0-9a-f-]{36})"/u)?.[1];
      if (!threadId || !THREAD_ID.test(threadId))
        throw Error("Codex 生图没有返回可核验的会话 ID");
      const outputDirectory = join8(generatedImagesRoot, threadId);
      const files = (await readdir4(outputDirectory, { withFileTypes: true })).filter((entry) => entry.isFile() && /^exec-[0-9a-f-]+\.png$/u.test(entry.name));
      if (files.length !== 1)
        throw Error(`Codex 生图需要恰好一张 PNG，实际找到 ${files.length} 张`);
      return join8(outputDirectory, files[0].name);
    } finally {
      await rm3(directory, { recursive: true, force: true });
    }
  }
  return { available, generate };
}

// plugins/cardgame-content/src/game-candidates.ts
import { createHash as createHash12, randomUUID as randomUUID9 } from "node:crypto";
import { execFile as execFile2 } from "node:child_process";
import { cp, lstat as lstat5, mkdir as mkdir8, mkdtemp as mkdtemp2, readFile as readFile11, realpath as realpath8, rm as rm4, writeFile as writeFile7 } from "node:fs/promises";
import { tmpdir as tmpdir3 } from "node:os";
import { dirname as dirname5, join as join9, resolve as resolve4 } from "node:path";
import { promisify as promisify2 } from "node:util";

// plugins/cardgame-content/src/story-copy-edits.ts
var hubPath = /^public\/data\/hub\/(?:[A-Za-z0-9._-]+\/)*[A-Za-z0-9._-]+\.json$/u;
var worldMapPath = "public/data/world/world-map.json";
var idPattern = /^[A-Za-z][A-Za-z0-9._-]{1,127}$/u;
var revisionPattern = /^[0-9a-f]{64}$/u;
var fields = {
  root: new Set(["description"]),
  location: new Set(["summary", "detail"]),
  action: new Set(["label", "description", "statusText"]),
  destination: new Set(["label", "description", "statusText"])
};
var record4 = (value) => !!value && typeof value === "object" && !Array.isArray(value);
function validStoryCopyPath(path) {
  return (hubPath.test(path) || path === worldMapPath) && !path.split("/").some((part) => part === "." || part === "..");
}
function validateStoryCopyEdits(copyEdits) {
  if (copyEdits === undefined)
    return;
  if (!Array.isArray(copyEdits) || copyEdits.length < 1 || copyEdits.length > 8)
    throw Error("剧情文案候选每批需包含 1–8 份已有地图或据点文件");
  const paths = new Set;
  for (const edit of copyEdits) {
    if (!record4(edit) || typeof edit.path !== "string" || !validStoryCopyPath(edit.path) || paths.has(edit.path) || typeof edit.expectedRevision !== "string" || !revisionPattern.test(edit.expectedRevision) || !Array.isArray(edit.edits) || edit.edits.length < 1 || edit.edits.length > 32)
      throw Error(`剧情文案目标或源版本无效：${edit?.path}`);
    paths.add(edit.path);
    const changedFields = new Set;
    for (const change of edit.edits) {
      if (!record4(change) || typeof change.targetId !== "string" || !idPattern.test(change.targetId) || typeof change.field !== "string" || !["description", "summary", "detail", "label", "statusText"].includes(change.field) || typeof change.value !== "string" || !change.value.trim() || change.value.length > 600 || /[\u0000-\u001f\u007f]/u.test(change.value) || changedFields.has(`${change.targetId}:${change.field}`)) {
        throw Error(`剧情文案修改无效：${edit.path}`);
      }
      changedFields.add(`${change.targetId}:${change.field}`);
    }
  }
}
function applyStoryCopyEdits(path, content, edits) {
  if (!validStoryCopyPath(path))
    throw Error(`剧情文案路径无效：${path}`);
  const document = JSON.parse(content);
  if (!record4(document))
    throw Error(`剧情文案文件格式无效：${path}`);
  const targets = new Map;
  const add = (id, value, kind) => {
    if (typeof id !== "string" || !record4(value) || targets.has(id))
      throw Error(`剧情文案对象 ID 无效或重复：${path}/${id}`);
    targets.set(id, { value, kind });
  };
  if (path === worldMapPath) {
    add(document.id, document, "root");
    if (!Array.isArray(document.destinations))
      throw Error(`世界地图目的地无效：${path}`);
    for (const destination of document.destinations)
      add(record4(destination) ? destination.id : undefined, destination, "destination");
  } else {
    add(document.hubId, document, "root");
    if (!Array.isArray(document.locations))
      throw Error(`据点地点无效：${path}`);
    for (const location of document.locations) {
      add(record4(location) ? location.id : undefined, location, "location");
      if (!record4(location) || !Array.isArray(location.actions))
        throw Error(`据点行动无效：${path}`);
      for (const action of location.actions)
        add(record4(action) ? action.id : undefined, action, "action");
    }
  }
  for (const edit of edits) {
    const target = targets.get(edit.targetId);
    if (!target || !fields[target.kind].has(edit.field) || typeof target.value[edit.field] !== "string") {
      throw Error(`剧情文案字段不存在或不可修改：${path}/${edit.targetId}/${edit.field}`);
    }
    const value = edit.value.trim();
    if (target.value[edit.field] === value)
      throw Error(`剧情文案没有变化：${path}/${edit.targetId}/${edit.field}`);
    target.value[edit.field] = value;
  }
  return JSON.stringify(document, null, 2) + `
`;
}

// plugins/cardgame-content/src/game-candidates.ts
var run2 = promisify2(execFile2);
var digest5 = (value) => createHash12("sha256").update(value).digest("hex");
var stable4 = (value) => JSON.stringify(value, (_key, item) => item && typeof item === "object" && !Array.isArray(item) ? Object.fromEntries(Object.entries(item).sort(([a], [b]) => a.localeCompare(b))) : item);
var safe = (value) => value.replace(/[^A-Za-z0-9._-]+/g, "_").slice(0, 80);
var git2 = async (cwd, ...args) => (await run2("git", args, {
  cwd,
  timeout: 120000,
  maxBuffer: 16 * 1024 * 1024,
  env: { ...process.env, GIT_TERMINAL_PROMPT: "0", GIT_CONFIG_NOSYSTEM: "1" }
})).stdout.trim();
var fileHash = async (path) => {
  try {
    return digest5(await readFile11(path));
  } catch (error) {
    if (error.code === "ENOENT")
      return null;
    throw error;
  }
};
async function candidateFile(checkout, path) {
  const absolute = join9(checkout, path);
  if ((await lstat5(absolute)).isSymbolicLink() || !isPathDescendant(await realpath8(checkout), await realpath8(absolute))) {
    throw Error(`候选依赖文件越界：${path}`);
  }
  return absolute;
}
async function sourceSnapshot(source, target) {
  await git2(dirname5(target), "clone", "--local", "--quiet", "--no-hardlinks", source, target);
  for (const path of ["src", "public", "knowledge", "vite", "package.json", "bun.lock", "bun.lockb", "index.html"]) {
    const from = join9(source, path), to = join9(target, path);
    const info = await lstat5(from).catch((error) => {
      if (error.code === "ENOENT")
        return;
      throw error;
    });
    if (!info) {
      await rm4(to, { recursive: true, force: true });
      continue;
    }
    if (info.isSymbolicLink())
      throw Error(`候选源码包含未核验的符号链接：${path}`);
    await rm4(to, { recursive: true, force: true });
    await cp(from, to, { recursive: true, force: true, errorOnExist: false });
  }
}
async function gameSourceSnapshotTree(source) {
  const directory = await mkdtemp2(join9(tmpdir3(), "worka-game-source-"));
  try {
    const checkout = join9(directory, "repo");
    await sourceSnapshot(source, checkout);
    await git2(checkout, "add", "-A");
    return await git2(checkout, "write-tree");
  } finally {
    await rm4(directory, { recursive: true, force: true });
  }
}
async function gameRuntimeSnapshotTree(source) {
  const directory = await mkdtemp2(join9(tmpdir3(), "worka-game-runtime-"));
  try {
    const checkout = join9(directory, "repo");
    await sourceSnapshot(source, checkout);
    return await runtimeTree(checkout);
  } finally {
    await rm4(directory, { recursive: true, force: true });
  }
}
async function runtimeTree(checkout) {
  await git2(checkout, "add", "-A");
  await git2(checkout, "rm", "-r", "--cached", "--ignore-unmatch", "--", "knowledge", "public/data", "public/assets/asset-manifest.json", "public/assets/card-faces", "public/assets/story");
  return git2(checkout, "write-tree");
}
function candidateSlot(baseId, candidates) {
  const versions = (candidates ?? []).filter((item) => item.id === baseId || item.id.startsWith(`${baseId}-r`) && /^\d+$/u.test(item.id.slice(baseId.length + 2)));
  const previous = [...versions].reverse().find((item) => item.status !== "undone");
  if (previous)
    return { id: previous.id, previous };
  const last = Math.max(-1, ...versions.map((item) => item.id === baseId ? 0 : Number(item.id.slice(baseId.length + 2))));
  return { id: last < 0 ? baseId : `${baseId}-r${last + 1}` };
}
var CARD_UNITS_PATH = CARD_COLLECTIONS.unit.path;
var CARD_ASSET_MANIFEST_PATH = "public/assets/asset-manifest.json";
var CARD_STARTER_DECK_PATH = "public/data/decks/starter-deck.json";
var CARD_BATTLE_LOADOUT_PATH = "public/data/config/battle-loadout.json";
var STORY_CATALOG_PATH = "public/data/content-catalog.json";
var STORY_ASSET_MANIFEST_PATH = "public/assets/asset-manifest.json";
var STORY_NPC_CATALOG_PATH = "public/data/world/npcs.json";
var STORY_ITEM_CATALOG_PATH = "public/data/world/items.artifacts.json";
var STORY_QUEST_CATALOG_PATH = "public/data/world/quests.json";
var isRecord = (value) => !!value && typeof value === "object" && !Array.isArray(value);
var validShopId = (value) => typeof value === "string" && /^[A-Za-z][A-Za-z0-9._-]{1,127}$/u.test(value);
var validAmount = (value, min) => typeof value === "number" && Number.isSafeInteger(value) && value >= min;
function validateStoryShops(shops) {
  if (shops === undefined)
    return;
  if (!Array.isArray(shops) || shops.length < 1 || shops.length > 8)
    throw Error("剧情候选每批最多修改 8 个商店节点");
  const nodes = new Set;
  for (const shop of shops) {
    if (!isRecord(shop) || !validShopId(shop.resourceId) || !validShopId(shop.nodeId) || !Array.isArray(shop.offers) || shop.offers.length < 1 || shop.offers.length > 16 || nodes.has(`${shop.resourceId}:${shop.nodeId}`))
      throw Error("商店候选节点无效或重复");
    nodes.add(`${shop.resourceId}:${shop.nodeId}`);
    const offerIds = new Set;
    for (const offer of shop.offers) {
      const cost = offer?.cost, rewards = offer?.rewards;
      const validItems = (value) => Array.isArray(value) && value.length <= 8 && value.every((item) => isRecord(item) && validShopId(item.id) && ["artifact", "tool", "consumable", "material", "quest"].includes(String(item.itemType)) && validAmount(item.count, 1)) && new Set(value.map((item) => item.id)).size === value.length;
      const validCards = (value) => Array.isArray(value) && value.length <= 8 && value.every((card) => isRecord(card) && validShopId(card.id) && validAmount(card.count, 1)) && new Set(value.map((card) => card.id)).size === value.length;
      if (!isRecord(offer) || !/^offer[._][A-Za-z0-9._-]{1,126}$/u.test(String(offer.id)) || offerIds.has(offer.id) || typeof offer.label !== "string" || !offer.label.trim() || offer.label.length > 80 || typeof offer.description !== "string" || !offer.description.trim() || offer.description.length > 1000 || !isRecord(cost) || !validAmount(cost.spiritStones, 0) || !validItems(cost.items ?? []) || !isRecord(rewards) || !validCards(rewards.cards) || !validItems(rewards.items) || !validAmount(rewards.spiritStones, 0))
        throw Error(`商店报价定义无效：${offer?.id}`);
      offerIds.add(offer.id);
    }
  }
}
function validateStoryRecipes(recipes) {
  if (recipes === undefined)
    return;
  if (!Array.isArray(recipes) || recipes.length < 1 || recipes.length > 16)
    throw Error("剧情候选每批需包含 1–16 个制作配方");
  const ids = new Set;
  const validItems = (value) => Array.isArray(value) && value.length <= 8 && value.every((item) => isRecord(item) && validShopId(item.id) && ["artifact", "tool", "consumable", "material", "quest"].includes(String(item.itemType)) && validAmount(item.count, 1)) && new Set(value.map((item) => item.id)).size === value.length;
  for (const recipe of recipes) {
    if (!isRecord(recipe) || !/^recipe[._][A-Za-z0-9._-]{1,126}$/u.test(String(recipe.id)) || ids.has(recipe.id) || typeof recipe.name !== "string" || !recipe.name.trim() || recipe.name.length > 80 || recipe.description !== undefined && (typeof recipe.description !== "string" || recipe.description.length > 500) || !isRecord(recipe.cost) || !validAmount(recipe.cost.spiritStones, 0) || !validItems(recipe.cost.items) || !isRecord(recipe.rewards) || !validItems(recipe.rewards.items) || !recipe.cost.items.length && recipe.cost.spiritStones === 0 || !recipe.rewards.items.length) {
      throw Error(`制作配方定义无效：${recipe?.id}`);
    }
    ids.add(recipe.id);
  }
}
function validateStoryQuests(quests) {
  if (quests === undefined)
    return;
  if (!Array.isArray(quests) || quests.length < 1 || quests.length > 16)
    throw Error("剧情候选每批需包含 1–16 个任务");
  const ids = new Set;
  for (const quest of quests) {
    if (!isRecord(quest) || !/^quest[._][A-Za-z0-9._-]{1,126}$/u.test(String(quest.id)) || ids.has(quest.id) || typeof quest.title !== "string" || !quest.title.trim() || quest.title.length > 40 || typeof quest.summary !== "string" || !quest.summary.trim() || quest.summary.length > 500 || !Array.isArray(quest.actorIds) || quest.actorIds.length > 16 || quest.actorIds.some((id) => typeof id !== "string" || !/^npc[._][A-Za-z0-9._-]{1,126}$/u.test(id)) || new Set(quest.actorIds).size !== quest.actorIds.length || !Array.isArray(quest.stages) || quest.stages.length < 1 || quest.stages.length > 32)
      throw Error(`游戏任务定义无效：${quest?.id}`);
    const stageIds = new Set;
    for (const stage of quest.stages) {
      if (!isRecord(stage) || !validShopId(stage.id) || stageIds.has(stage.id) || !["available", "active", "completed", "failed"].includes(String(stage.status)) || typeof stage.label !== "string" || !stage.label.trim() || stage.label.length > 40 || typeof stage.objective !== "string" || !stage.objective.trim() || stage.objective.length > 80) {
        throw Error(`游戏任务阶段无效：${quest.id}/${stage?.id}`);
      }
      stageIds.add(stage.id);
    }
    ids.add(quest.id);
  }
}
function validStoryAssetPath(path) {
  return /^public\/assets\/story\/(?:[A-Za-z0-9._-]+\/)*[A-Za-z0-9._-]+\.png$/u.test(path) && !path.split("/").some((part) => part === "." || part === "..");
}
function validItemIconAssetPath(path) {
  return /^public\/assets\/items\/(?:[A-Za-z0-9._-]+\/)*[A-Za-z0-9._-]+\.png$/u.test(path) && !path.split("/").some((part) => part === "." || part === "..");
}
function validStorySourcePath(path) {
  return /^knowledge\/(?:[A-Za-z0-9._-]+\/)*[A-Za-z0-9._-]+\.md$/u.test(path) && !path.split("/").some((part) => part === "." || part === "..");
}
function validStoryBattlePath(path, kind) {
  return new RegExp(`^public/data/${kind === "encounter" ? "encounters" : "decks"}/(?:[A-Za-z0-9._-]+/)*[A-Za-z0-9._-]+\\.json$`, "u").test(path) && !path.split("/").some((part) => part === "." || part === "..");
}
function validStoryTargetPath(path) {
  return validStorySourcePath(path) || /^public\/data\/(?:story|hub)\/(?:[A-Za-z0-9._-]+\/)*[A-Za-z0-9._-]+\.json$/u.test(path) || validStoryCopyPath(path) || /^public\/data\/mijing\/(?:[A-Za-z0-9._-]+\/)*[A-Za-z0-9._-]+\.json$/u.test(path) || validStoryAssetPath(path) || validItemIconAssetPath(path) || validStoryBattlePath(path, "encounter") || validStoryBattlePath(path, "deck") || path === STORY_ASSET_MANIFEST_PATH || path === STORY_CATALOG_PATH || path === CARD_UNITS_PATH || path === STORY_NPC_CATALOG_PATH || path === STORY_ITEM_CATALOG_PATH || path === STORY_QUEST_CATALOG_PATH;
}
async function storyTargetBaseRevision(root, baseDependencies) {
  return digest5(stable4(await Promise.all(baseDependencies.map(async (item) => ({ path: item.path, revision: await fileHash(join9(root, item.path)) })))));
}
function candidateAssetPaths(candidate) {
  const cardPaths = new Set(Object.values(CARD_COLLECTIONS).map((item) => item.path));
  return candidate.dependencies.map((item) => item.path).filter((path) => !cardPaths.has(path) && path !== CARD_ASSET_MANIFEST_PATH && path !== CARD_STARTER_DECK_PATH && path !== CARD_BATTLE_LOADOUT_PATH);
}
function candidateCardKind(candidate) {
  const kinds = Object.entries(CARD_COLLECTIONS).filter(([, collection]) => candidate.dependencies.some((item) => item.path === collection.path)).map(([kind]) => kind);
  if (kinds.length !== 1)
    throw Error("候选卡牌定义依赖不唯一");
  return kinds[0];
}
async function cardTargetBaseRevision(root, cardId, assetPaths, kind = "unit") {
  const collection = cardCollection(kind);
  const source = JSON.parse(await readFile11(join9(root, collection.path), "utf8"));
  const card = source[collection.key]?.find((item) => item.id === cardId);
  const manifest = JSON.parse(await readFile11(join9(root, CARD_ASSET_MANIFEST_PATH), "utf8").catch((error) => {
    if (error.code === "ENOENT")
      return '{"assets":[]}';
    throw error;
  }));
  const deck = collection.inDeck ? JSON.parse(await readFile11(join9(root, CARD_STARTER_DECK_PATH), "utf8")) : undefined;
  const loadout = collection.inDeck ? undefined : await readFile11(join9(root, CARD_BATTLE_LOADOUT_PATH));
  if (deck && !Array.isArray(deck.cards))
    throw Error("默认卡组格式无效");
  return digest5(stable4({
    card: card ? digest5(JSON.stringify(card)) : null,
    deckCard: deck?.cards?.find((item) => item.id === cardId) ?? null,
    ...loadout ? { loadout: digest5(loadout) } : {},
    assets: await Promise.all(assetPaths.map(async (path) => ({ path, file: await fileHash(join9(root, path)), entry: manifest.assets?.find((item) => item.path === path) ?? null })))
  }));
}
function createGameCandidateService(options) {
  const roots = new Map(options.projects.map((project) => [project.id, resolve4(project.root)]));
  const root = resolve4(options.dataRoot, "game-candidates");
  let queue = Promise.resolve();
  const serial = (operation) => {
    const next = queue.then(operation);
    queue = next.catch(() => {
      return;
    });
    return next;
  };
  const registerPreview = async (candidate) => {
    if (!options.registerPreview)
      return;
    try {
      await options.registerPreview(candidate);
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      throw Error(`候选 ${candidate.id}（提交 ${candidate.commit}）已保存，但试玩登记失败：${reason}。核对试玩便笺后，用新的请求标识重试同一内容可复用候选。`);
    }
  };
  const project = (projectId) => {
    const path = roots.get(projectId);
    if (!path)
      throw Error(`未登记的游戏项目：${projectId}`);
    return path;
  };
  const candidatePath = (projectId, id) => resolve4(root, safe(projectId), safe(id));
  async function stageCard(input) {
    const { projectId, productionId, cardId } = input;
    const featureId = input.featureId?.trim();
    if (!featureId || !/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(featureId))
      throw Error("制作候选需要已有功能项的 featureId");
    const detail = await options.workflow.query({ projectId, op: "production", productionId });
    const production = detail.production;
    if (production.revision !== input.baseRevision)
      throw Error("制作单已变化，请刷新后重试");
    const batch = production.batch;
    const card = batch?.kind === "card-generation" ? batch.cards.find((item) => item.definition.id === cardId) : undefined;
    if (!card?.assembly || card.assembly.fingerprint !== faceFingerprint(card) || !card.art || card.art.fingerprint !== artFingerprint(card))
      throw Error("卡牌与两套主题尚未完成当前版本组装");
    const collection = cardCollection(card.definition.kind);
    if (production.featureId !== featureId)
      throw Error("制作单绑定的功能项与候选要求不一致");
    const fingerprint = candidateFingerprint(card, featureId);
    const source = project(projectId);
    const sourceTree = await gameRuntimeSnapshotTree(source);
    const slot = candidateSlot(`card-${digest5(stable4({ projectId, productionId, cardId, fingerprint, sourceTree })).slice(0, 36)}`, production.gameCandidates);
    const { id, previous } = slot;
    if (previous) {
      await registerPreview(previous);
      return { candidate: previous, production, reused: true };
    }
    const directory = candidatePath(projectId, id);
    const checkout = join9(directory, "repo");
    await mkdir8(dirname5(directory), { recursive: true });
    await rm4(directory, { recursive: true, force: true });
    await mkdir8(directory, { recursive: true });
    let persisted = false;
    try {
      await sourceSnapshot(source, checkout);
      if (await runtimeTree(checkout) !== sourceTree)
        throw Error("游戏源码在建立候选时已变化，请重试");
      const scoped = createContentService({ dataRoot: join9(directory, "content"), projects: [{ id: projectId, root: checkout }] });
      const paths = [];
      try {
        const adopt = async (sourceId, name) => {
          const original = await options.content.resolveMedia({ projectId, op: "media", id: sourceId, variant: "original" });
          const bytes = await readFile11(original.absolutePath);
          const [registered] = await scoped.command("registerCandidates", { projectId, candidates: [{ name: `${cardId}-${name}.png`, mimeType: "image/png", base64: bytes.toString("base64"), metadata: { purpose: "card-face", provider: "codex" } }] });
          const asset = await scoped.command("adoptVersion", {
            projectId,
            candidateId: registered.id,
            path: `public/assets/card-faces/${cardId}/${card.assembly.fingerprint.slice(0, 20)}-${name}.png`
          });
          paths.push(asset.path);
          return "/" + asset.path.replace(/^public\//, "");
        };
        const variants = {};
        for (const [themeId, variant] of Object.entries(card.assembly.variants))
          variants[themeId] = {
            texture: await adopt(variant.runtimeId, `${themeId}-runtime`),
            preview: await adopt(variant.previewId, `${themeId}-preview`),
            templateVersion: CARD_FACE_VERSION
          };
        const cardFace = { schemaVersion: 1, themeId: card.presentation.themeId, artwork: await adopt(card.art.id, "art"), fingerprint: card.assembly.fingerprint, variants };
        const desired = { ...card.definition, cardFace };
        let existing;
        try {
          existing = await scoped.query({ projectId, op: "card", id: cardId });
        } catch (error) {
          if (error.code !== "NOT_FOUND")
            throw error;
        }
        if ((existing?.revision ?? null) !== (card.sourceRevision ?? null))
          throw Error("正式卡牌基线已变化，请重新建立候选");
        await scoped.command("savePipelineCard", { projectId, card: desired, expectedRevision: existing?.revision ?? null });
        if (collection.inDeck) {
          const deckPath = join9(checkout, CARD_STARTER_DECK_PATH);
          const deck = JSON.parse(await readFile11(deckPath, "utf8"));
          if (!Array.isArray(deck.cards))
            throw Error("默认卡组格式无效");
          if (batch?.companion) {
            const paired = await scoped.query({ projectId, op: "card", id: batch.companion.cardId });
            if (paired.kind !== "unit" || paired.revision !== batch.companion.revision)
              throw Error("配套单位在建立候选前已变化，请重新核对");
            const desiredCounts = [
              { id: paired.id, count: Math.min(3, Number(paired.json?.limitPerDeck ?? 3)) },
              { id: cardId, count: Math.min(3, Number(card.definition.limitPerDeck ?? 3)) }
            ];
            const otherCount = deck.cards.filter((item) => !desiredCounts.some((entry) => entry.id === item.id)).reduce((sum, item) => sum + item.count, 0);
            if (otherCount + desiredCounts.reduce((sum, item) => sum + item.count, 0) > 30)
              throw Error("加入配套卡后超过 30 张，请先调整现有起始牌组");
            for (const entry of desiredCounts) {
              const current = deck.cards.find((item) => item.id === entry.id);
              if (current)
                current.count = Math.max(current.count, entry.count);
              else
                deck.cards.push(entry);
            }
            await writeFile7(deckPath, JSON.stringify(deck, null, 2) + `
`);
          } else if (!deck.cards.some((item) => item.id === cardId)) {
            deck.cards.push({ id: cardId, count: 1 });
            await writeFile7(deckPath, JSON.stringify(deck, null, 2) + `
`);
          }
        } else {
          const loadoutPath = join9(checkout, CARD_BATTLE_LOADOUT_PATH);
          const loadout = JSON.parse(await readFile11(loadoutPath, "utf8"));
          const key = card.definition.kind === "pill" ? "pillIds" : "skillIds";
          const ids = loadout[key];
          if (loadout.schemaVersion !== 1 || !Array.isArray(ids) || ids.length > 3 || ids.some((id) => typeof id !== "string" || !id.trim()) || new Set(ids).size !== ids.length)
            throw Error("战斗初始配置格式无效");
          if (!ids.includes(cardId)) {
            if (ids.length === 3)
              throw Error(`${key} 已满，请先在游戏配置中释放槽位`);
            ids.push(cardId);
            await writeFile7(loadoutPath, JSON.stringify(loadout, null, 2) + `
`);
          }
        }
      } finally {
        await scoped.close();
      }
      const cardPath = collection.path;
      const manifestPath = CARD_ASSET_MANIFEST_PATH;
      const entryPath = collection.inDeck ? CARD_STARTER_DECK_PATH : CARD_BATTLE_LOADOUT_PATH;
      const dependencies = await Promise.all([...new Set([cardPath, manifestPath, entryPath, ...paths])].map(async (path) => ({ path, revision: await fileHash(join9(checkout, path)) })));
      await git2(checkout, "add", "-A");
      if (await git2(checkout, "status", "--porcelain"))
        await git2(checkout, "-c", "user.name=Worka Candidate", "-c", "user.email=worka-candidate@local.invalid", "-c", "commit.gpgsign=false", "commit", "--quiet", "-m", `CardGame candidate ${cardId}`);
      const commit = await git2(checkout, "rev-parse", "HEAD");
      if (!/^[0-9a-f]{40}$/.test(commit))
        throw Error("候选没有确切提交");
      const targetBaseRevision = await cardTargetBaseRevision(source, cardId, paths, card.definition.kind);
      const validationManifest = digest5(stable4({ commit, checks: ["game-shell", "content-catalog", "card-definition", "card-themes", collection.inDeck ? "playable-deck" : "playable-loadout"] }));
      const candidateHash = digest5(stable4({ commit, fingerprint, sourceTree, sourceSnapshotScope: "runtime", targetBaseRevision, validationManifest, dependencies }));
      const at = new Date().toISOString();
      const candidate = { id, projectId, productionId, cardId, featureId, fingerprint, sourceSnapshotTree: sourceTree, sourceSnapshotScope: "runtime", candidateHash, commit, repo: checkout, targetBaseRevision, validationManifest, dependencies, status: "candidate", createdAt: at, updatedAt: at };
      const recorded = await options.workflow.command("recordGameCandidate", { projectId, productionId, baseRevision: production.revision, candidate });
      persisted = true;
      await registerPreview(recorded.candidate);
      return recorded;
    } catch (error) {
      if (!persisted)
        await rm4(directory, { recursive: true, force: true });
      throw error;
    }
  }
  async function stageDeck(input) {
    const { projectId, productionId } = input;
    const { production } = await options.workflow.query({ projectId, op: "production", productionId });
    if (production.revision !== input.baseRevision)
      throw Error("制作单已变化，请刷新后重试");
    const batch = production.batch;
    if (!batch?.deck)
      throw Error("制作单没有独立牌组方案");
    const plan = batch.deck;
    const report = inspectDeck(batch.cards, plan, production.brief, production.gameCandidates);
    if (!report.legal || !report.confirmed)
      throw Error("请先补齐并由用户确认当前整套草案；上游修改后需要重新核对");
    if (!input.featureId || input.featureId !== production.featureId)
      throw Error("整套候选需要制作单对应的功能项");
    const cards = plan.entries.map((entry) => batch.cards.find((card) => card.definition.id === entry.cardId));
    cards.forEach((card) => validateCard(card.definition));
    const artMode = cards.some((card) => Boolean(card.art || card.artRequest || card.assembly));
    if (artMode && cards.some((card) => !card.art || card.art.fingerprint !== artFingerprint(card) || card.assembly?.fingerprint !== faceFingerprint(card)))
      throw Error("整套插画和两套卡面尚未全部完成当前版本组装");
    const artHashes = artMode ? deckArtFingerprints(batch.cards, plan) : undefined;
    const fingerprint = artMode ? digest5(stable4({ logic: report.fingerprint, art: artHashes })) : report.fingerprint;
    const adopted = production.gameCandidates?.filter((item) => item.kind === "deck" && item.targetId === plan.id).at(-1);
    if (adopted?.status === "adopted" && adopted.fingerprint === fingerprint)
      return { candidate: adopted, production, reused: true };
    const source = project(projectId);
    for (const card of cards) {
      let existing;
      try {
        existing = await options.content.query({ projectId, op: "card", id: String(card.definition.id), freshKind: String(card.definition.kind) });
      } catch (error) {
        if (!["NOT_FOUND", "not-found"].includes(error.code))
          throw error;
      }
      const revision = artMode ? batch.artBaseline?.cardRevisions[card.definition.id] ?? card.sourceRevision : card.sourceRevision;
      if (revision ? existing?.revision !== revision : Boolean(existing))
        throw Error(`卡牌 ${card.definition.id} 的来源已变化或新 ID 已存在`);
    }
    const entryPath = deckPath(plan);
    const collections = [...new Set(cards.map((card) => cardCollection(card.definition.kind).path))];
    const assetPaths = artMode ? cards.flatMap((card) => ["jade-runtime", "jade-preview", "scroll-runtime", "scroll-preview", "art"].map((name) => `public/assets/card-faces/${card.definition.id}/${card.assembly.fingerprint.slice(0, 20)}-${name}.png`)) : [];
    const paths = [...collections, entryPath, CARD_STARTER_DECK_PATH, ...artMode ? [CARD_ASSET_MANIFEST_PATH, ...assetPaths] : []];
    const baseDependencies = await Promise.all(paths.map(async (path) => ({ path, revision: await fileHash(join9(source, path)) })));
    if (baseDependencies.find((item) => item.path === entryPath)?.revision) {
      if (!artMode || !batch.artBaseline)
        throw Error("独立牌组目标已存在，请在新制作单使用另一个 ID");
      const existingDeck = JSON.parse(await readFile11(join9(source, entryPath), "utf8"));
      if (existingDeck.id !== plan.id || stable4(existingDeck.cards) !== stable4(plan.entries.map((entry) => ({ id: entry.cardId, count: entry.count }))))
        throw Error("正式牌组的副本计划已变化，请先核对");
    }
    const targetBaseRevision = await storyTargetBaseRevision(source, baseDependencies);
    const sourceTree = await gameRuntimeSnapshotTree(source);
    const { id, previous } = candidateSlot(`deck-${digest5(stable4({ projectId, productionId, fingerprint, sourceTree, targetBaseRevision })).slice(0, 36)}`, production.gameCandidates);
    if (previous) {
      await registerPreview(previous);
      return { candidate: previous, production, reused: true };
    }
    const directory = candidatePath(projectId, id), checkout = join9(directory, "repo");
    await mkdir8(dirname5(directory), { recursive: true });
    await rm4(directory, { recursive: true, force: true });
    await mkdir8(directory, { recursive: true });
    let persisted = false;
    try {
      await sourceSnapshot(source, checkout);
      if (await runtimeTree(checkout) !== sourceTree || await storyTargetBaseRevision(checkout, baseDependencies) !== targetBaseRevision)
        throw Error("游戏或牌组来源在建立候选时变化，请刷新重试");
      const scoped = createContentService({ dataRoot: join9(directory, "content"), projects: [{ id: projectId, root: checkout }] });
      try {
        for (const card of cards) {
          let existing;
          try {
            existing = await scoped.query({ projectId, op: "card", id: String(card.definition.id) });
          } catch (error) {
            if (!["NOT_FOUND", "not-found"].includes(error.code))
              throw error;
          }
          const { cardFace: _face, ...definition } = card.definition;
          let desired = definition;
          if (artMode) {
            const adopt = async (sourceId, name) => {
              const original = await options.content.resolveMedia({ projectId, op: "media", id: sourceId, variant: "original" });
              const [registered] = await scoped.command("registerCandidates", { projectId, candidates: [{ name: `${card.definition.id}-${name}.png`, mimeType: "image/png", base64: (await readFile11(original.absolutePath)).toString("base64"), metadata: { purpose: "card-face", provider: "codex" } }] });
              const asset = await scoped.command("adoptVersion", { projectId, candidateId: registered.id, path: `public/assets/card-faces/${card.definition.id}/${card.assembly.fingerprint.slice(0, 20)}-${name}.png` });
              return "/" + asset.path.replace(/^public\//, "");
            };
            const variants = {};
            for (const [themeId, variant] of Object.entries(card.assembly.variants))
              variants[themeId] = { texture: await adopt(variant.runtimeId, `${themeId}-runtime`), preview: await adopt(variant.previewId, `${themeId}-preview`), templateVersion: CARD_FACE_VERSION };
            desired = { ...definition, cardFace: { schemaVersion: 1, themeId: card.presentation.themeId, artwork: await adopt(card.art.id, "art"), fingerprint: card.assembly.fingerprint, variants } };
          }
          await scoped.command("savePipelineCard", { projectId, card: desired, expectedRevision: existing?.revision ?? null });
        }
      } finally {
        await scoped.close();
      }
      if (options.deckPreviewAdapter) {
        const path = join9(checkout, "knowledge/tools/preview/preview.config.mjs");
        await mkdir8(dirname5(path), { recursive: true });
        await cp(options.deckPreviewAdapter, path);
        await cp(join9(dirname5(options.deckPreviewAdapter), "serve-static.mjs"), join9(dirname5(path), "serve-static.mjs"));
      }
      const starter = JSON.parse(await readFile11(join9(checkout, CARD_STARTER_DECK_PATH), "utf8"));
      const deck = {
        ...starter,
        id: plan.id,
        name: plan.title,
        description: production.brief,
        cards: plan.entries.map((entry) => ({ id: entry.cardId, count: entry.count }))
      };
      await writeFile7(join9(checkout, entryPath), JSON.stringify(deck, null, 2) + `
`);
      await writeFile7(join9(checkout, CARD_STARTER_DECK_PATH), JSON.stringify(deck, null, 2) + `
`);
      const dependencies = await Promise.all(paths.map(async (path) => ({ path, revision: await fileHash(join9(checkout, path)) })));
      const changedPaths = dependencies.filter((item) => item.path !== CARD_STARTER_DECK_PATH && item.revision !== baseDependencies.find((base) => base.path === item.path)?.revision).map((item) => item.path);
      await git2(checkout, "add", "-A");
      await git2(checkout, "-c", "user.name=Worka Candidate", "-c", "user.email=worka-candidate@local.invalid", "-c", "commit.gpgsign=false", "commit", "--quiet", "-m", `CardGame independent deck ${plan.id}`);
      const commit = await git2(checkout, "rev-parse", "HEAD");
      const at = new Date().toISOString();
      const candidate = {
        id,
        projectId,
        productionId,
        cardId: plan.id,
        kind: "deck",
        targetId: plan.id,
        deckPath: entryPath,
        deckCardIds: plan.entries.map((entry) => entry.cardId),
        deckCardFingerprints: deckCardFingerprints(batch.cards, plan),
        placeholderCardIds: artMode ? [] : plan.entries.map((entry) => entry.cardId),
        ...artMode ? { deckLogicFingerprint: report.fingerprint, deckArtFingerprints: artHashes } : {},
        featureId: input.featureId,
        fingerprint,
        sourceSnapshotTree: sourceTree,
        sourceSnapshotScope: "runtime",
        candidateHash: "",
        commit,
        repo: checkout,
        targetBaseRevision,
        validationManifest: digest5(stable4({ commit, checks: ["game-shell", "content-catalog", "deck-definition", "deck-composition", ...artMode ? ["deck-art"] : []] })),
        dependencies,
        baseDependencies,
        changedPaths,
        status: "candidate",
        createdAt: at,
        updatedAt: at
      };
      candidate.candidateHash = deckCandidateHash(candidate);
      const recorded = await options.workflow.command("recordGameCandidate", { projectId, productionId, baseRevision: production.revision, candidate });
      persisted = true;
      await registerPreview(recorded.candidate);
      return recorded;
    } catch (error) {
      if (!persisted)
        await rm4(directory, { recursive: true, force: true });
      throw error;
    }
  }
  async function stageStory(input) {
    const projectId = input.projectId;
    const source = project(projectId);
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/u.test(input.featureId ?? ""))
      throw Error("剧情候选需要已有功能项的 featureId");
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/u.test(input.storyId ?? ""))
      throw Error("剧情 storyId 格式无效");
    if (!validStorySourcePath(input.entryPath))
      throw Error("剧情入口必须是 knowledge/ 下的 Markdown 场景");
    if (!input.brief?.trim())
      throw Error("剧情候选需要创作目标");
    if (!Array.isArray(input.documents) || input.documents.length > 64)
      throw Error("场景文档清单无效");
    if (input.referenceDocuments !== undefined && !Array.isArray(input.referenceDocuments))
      throw Error("资料文档清单无效");
    const referenceDocuments = input.referenceDocuments ?? [];
    if (input.documents.length + referenceDocuments.length < 1 || input.documents.length + referenceDocuments.length > 64)
      throw Error("剧情与资料文档每批合计需有 1–64 篇");
    const unique = new Set;
    for (const doc of [...input.documents, ...referenceDocuments]) {
      if (!doc || typeof doc.path !== "string" || !validStorySourcePath(doc.path) || unique.has(doc.path) || typeof doc.content !== "string" || doc.content.length > 1e6)
        throw Error(`剧情文档路径、内容或大小无效：${doc?.path}`);
      unique.add(doc.path);
    }
    for (const doc of referenceDocuments)
      if (frontmatterHasScene(doc.content))
        throw Error(`资料文档不能包含 scene: true：${doc.path}`);
    if (input.npcs && (!Array.isArray(input.npcs) || input.npcs.length > 16))
      throw Error("剧情候选每批最多新增 16 位人物");
    const npcIds = new Set;
    for (const npc of input.npcs ?? []) {
      if (!npc || !/^npc[._][A-Za-z0-9._-]{1,126}$/u.test(npc.id) || npcIds.has(npc.id) || typeof npc.name !== "string" || !npc.name.trim() || npc.name.length > 80 || npc.description !== undefined && (typeof npc.description !== "string" || npc.description.length > 5000) || npc.goal !== undefined && (typeof npc.goal !== "string" || npc.goal.length > 500) || npc.portraitAsset !== undefined && (typeof npc.portraitAsset !== "string" || !validStoryAssetPath(`public/${npc.portraitAsset}`)) || [npc.roles, npc.tags].some((list) => list !== undefined && (!Array.isArray(list) || list.length > 16 || list.some((value) => typeof value !== "string" || !value.trim() || value.length > 80))) || npc.abilities !== undefined && (!npc.abilities || typeof npc.abilities !== "object" || Array.isArray(npc.abilities) || Object.entries(npc.abilities).some(([key, value]) => !key.trim() || !Number.isFinite(value))))
        throw Error(`新增人物定义无效：${npc?.id}`);
      npcIds.add(npc.id);
    }
    if (input.items && (!Array.isArray(input.items) || input.items.length > 16))
      throw Error("剧情候选每批最多新增 16 件道具");
    const newItemIds = new Set;
    for (const item of input.items ?? []) {
      if (!item || !/^[A-Za-z][A-Za-z0-9._-]{1,127}$/u.test(item.id) || newItemIds.has(item.id) || !["artifact", "tool", "consumable", "material", "quest"].includes(item.itemType) || typeof item.name !== "string" || !item.name.trim() || item.name.length > 80 || [item.grade, item.type].some((value) => value !== undefined && (typeof value !== "string" || !value.trim() || value.length > 80)) || item.description !== undefined && (typeof item.description !== "string" || item.description.length > 5000) || item.iconAsset !== undefined && (typeof item.iconAsset !== "string" || !validItemIconAssetPath(`public/${item.iconAsset}`)) || item.droppable !== undefined && typeof item.droppable !== "boolean" || item.equipSlot !== undefined && (item.itemType !== "artifact" && item.itemType !== "tool" || typeof item.equipSlot !== "string" || !/^[A-Za-z][A-Za-z0-9._-]{0,63}$/u.test(item.equipSlot) || ["__proto__", "constructor", "prototype"].includes(item.equipSlot)) || item.attributeModifiers !== undefined && (item.equipSlot === undefined || !item.attributeModifiers || typeof item.attributeModifiers !== "object" || Array.isArray(item.attributeModifiers) || Object.keys(item.attributeModifiers).length === 0 || Object.entries(item.attributeModifiers).some(([attribute, delta]) => !attribute.trim() || ["__proto__", "constructor", "prototype"].includes(attribute) || !Number.isFinite(delta) || Math.abs(delta) > 100)) || item.useEffect !== undefined && (item.itemType !== "consumable" || !item.useEffect || typeof item.useEffect !== "object" || Array.isArray(item.useEffect) || Object.keys(item.useEffect).length !== 2 || item.useEffect.kind !== "heal" || !Number.isSafeInteger(item.useEffect.amount) || item.useEffect.amount < 1 || item.useEffect.amount > 100))
        throw Error(`新增道具定义无效：${item?.id}`);
      newItemIds.add(item.id);
    }
    validateStoryShops(input.shops);
    validateStoryRecipes(input.recipes);
    validateStoryQuests(input.quests);
    validateStoryCopyEdits(input.copyEdits);
    const copyPaths = input.copyEdits?.map((edit) => edit.path) ?? [];
    for (const edit of input.copyEdits ?? []) {
      if (await fileHash(await candidateFile(source, edit.path)) !== edit.expectedRevision) {
        throw Error(`剧情文案源文件已变化：${edit.path}`);
      }
    }
    if (input.assets && (!Array.isArray(input.assets) || input.assets.length > 8))
      throw Error("剧情素材每批最多 8 个");
    const assetPaths = new Set;
    for (const asset of input.assets ?? []) {
      if (!asset?.candidateId?.trim() || !(validStoryAssetPath(asset.path) || validItemIconAssetPath(asset.path)) || assetPaths.has(asset.path))
        throw Error(`剧情素材来源或目标路径无效：${asset?.path}`);
      assetPaths.add(asset.path);
      if (await fileHash(join9(source, asset.path)))
        throw Error(`剧情素材目标路径已存在，请使用新的版本路径：${asset.path}`);
    }
    if (input.launch && (!/^public\/data\/hub\/(?:[A-Za-z0-9._-]+\/)*[A-Za-z0-9._-]+\.json$/u.test(input.launch.hubPath) || !/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/u.test(input.launch.actionId) || !input.launch.locationId?.trim() || !input.launch.label?.trim()))
      throw Error("剧情 Hub 入口无效");
    const productionId = `story-${digest5(stable4({ projectId, featureId: input.featureId, storyId: input.storyId })).slice(0, 24)}`;
    const created = await options.workflow.command("createProduction", { projectId, id: productionId, brief: input.brief, featureId: input.featureId });
    if (created.production.featureId !== input.featureId)
      throw Error("剧情制作单属于另一个功能项");
    const tempDirectory = candidatePath(projectId, `building-${randomUUID9()}`);
    const tempCheckout = join9(tempDirectory, "repo");
    await mkdir8(dirname5(tempDirectory), { recursive: true });
    let moved = false;
    try {
      await mkdir8(tempDirectory, { recursive: true });
      await sourceSnapshot(source, tempCheckout);
      const sourceTree = await runtimeTree(tempCheckout);
      for (const edit of input.copyEdits ?? []) {
        if (await fileHash(await candidateFile(tempCheckout, edit.path)) !== edit.expectedRevision) {
          throw Error(`隔离副本与剧情文案源文件不一致：${edit.path}`);
        }
      }
      if (input.npcs?.length) {
        const path = join9(tempCheckout, STORY_NPC_CATALOG_PATH);
        const catalog = JSON.parse(await readFile11(path, "utf8"));
        if (!Array.isArray(catalog.npcs))
          throw Error("游戏人物目录格式无效");
        for (const npc of input.npcs) {
          if (catalog.npcs.some((item) => item.id === npc.id))
            throw Error(`人物 ID 已存在：${npc.id}`);
          catalog.npcs.push({
            id: npc.id,
            name: npc.name.trim(),
            ...npc.description ? { description: npc.description } : {},
            ...npc.goal ? { goal: npc.goal } : {},
            ...npc.roles ? { roles: [...npc.roles] } : {},
            ...npc.tags ? { tags: [...npc.tags] } : {},
            ...npc.abilities ? { abilities: { ...npc.abilities } } : {},
            ...npc.portraitAsset ? { portraitAsset: npc.portraitAsset } : {}
          });
        }
        await writeFile7(path, JSON.stringify(catalog, null, 2) + `
`);
      }
      if (input.items?.length) {
        const path = join9(tempCheckout, STORY_ITEM_CATALOG_PATH);
        const catalog = JSON.parse(await readFile11(path, "utf8"));
        const fields = { artifact: "artifacts", tool: "tools", consumable: "consumables", material: "materials", quest: "questItems" };
        const known = new Set;
        for (const field of ["artifacts", "tools", "consumables", "materials", "quests", "questItems"]) {
          const entries = catalog[field];
          if (entries !== undefined && !Array.isArray(entries))
            throw Error("游戏道具目录格式无效");
          for (const entry of entries ?? []) {
            if (typeof entry?.id !== "string" || known.has(entry.id))
              throw Error(`游戏道具 ID 重复或无效：${entry?.id}`);
            known.add(entry.id);
          }
        }
        for (const item of input.items) {
          if (known.has(item.id))
            throw Error(`道具 ID 已存在：${item.id}`);
          const field = fields[item.itemType];
          const entries = catalog[field] ??= [];
          entries.push({
            id: item.id,
            name: item.name.trim(),
            ...item.grade ? { grade: item.grade.trim() } : {},
            ...item.type ? { type: item.type.trim() } : {},
            ...item.description ? { description: item.description } : {},
            ...item.iconAsset ? { iconAsset: item.iconAsset } : {},
            ...item.droppable !== undefined ? { droppable: item.droppable } : {},
            ...item.equipSlot ? { equipSlot: item.equipSlot } : {},
            ...item.attributeModifiers ? { attributeModifiers: { ...item.attributeModifiers } } : {}
          });
          if (item.useEffect)
            entries[entries.length - 1].useEffect = { kind: "heal", amount: item.useEffect.amount };
          known.add(item.id);
        }
        await writeFile7(path, JSON.stringify(catalog, null, 2) + `
`);
      }
      if (input.recipes?.length) {
        const path = await candidateFile(tempCheckout, STORY_ITEM_CATALOG_PATH);
        const catalog = JSON.parse(await readFile11(path, "utf8"));
        const known = new Map;
        for (const [field, kind] of [["artifacts", "artifact"], ["tools", "tool"], ["consumables", "consumable"], ["materials", "material"], ["quests", "quest"], ["questItems", "quest"]]) {
          const entries = catalog[field];
          if (entries !== undefined && !Array.isArray(entries))
            throw Error("游戏道具目录格式无效");
          for (const item of entries ?? []) {
            if (!item?.id || known.has(item.id))
              throw Error(`游戏道具 ID 重复或无效：${item?.id}`);
            known.set(item.id, kind);
          }
        }
        if (catalog.recipes !== undefined && !Array.isArray(catalog.recipes))
          throw Error("游戏制作配方目录格式无效");
        const recipes = catalog.recipes ??= [];
        const recipeIds = new Set;
        for (const recipe of recipes) {
          if (!recipe?.id || recipeIds.has(recipe.id))
            throw Error(`游戏制作配方 ID 重复或无效：${recipe?.id}`);
          recipeIds.add(recipe.id);
        }
        for (const recipe of input.recipes) {
          for (const item of [...recipe.cost.items, ...recipe.rewards.items]) {
            if (known.get(item.id) !== item.itemType)
              throw Error(`制作配方引用不存在或类型不符的道具：${item.id}`);
          }
          const next = {
            ...recipe,
            name: recipe.name.trim(),
            cost: { spiritStones: recipe.cost.spiritStones, items: recipe.cost.items.map((item) => ({ ...item })) },
            rewards: { items: recipe.rewards.items.map((item) => ({ ...item })) }
          };
          const index = recipes.findIndex((item) => item.id === recipe.id);
          if (index < 0)
            recipes.push(next);
          else
            recipes[index] = next;
        }
        await writeFile7(path, JSON.stringify(catalog, null, 2) + `
`);
      }
      if (input.quests?.length) {
        const path = await candidateFile(tempCheckout, STORY_QUEST_CATALOG_PATH);
        const catalog = JSON.parse(await readFile11(path, "utf8"));
        if (catalog.schemaVersion !== 1 || !Array.isArray(catalog.quests))
          throw Error("游戏任务目录格式无效");
        const known = new Set;
        for (const quest of catalog.quests) {
          if (!quest?.id || known.has(quest.id))
            throw Error(`游戏任务 ID 重复或无效：${quest?.id}`);
          known.add(quest.id);
        }
        for (const quest of input.quests) {
          const next = {
            id: quest.id,
            title: quest.title.trim(),
            summary: quest.summary.trim(),
            actorIds: [...quest.actorIds],
            stages: quest.stages.map((stage) => ({ ...stage, label: stage.label.trim(), objective: stage.objective.trim() }))
          };
          const index = catalog.quests.findIndex((item) => item.id === quest.id);
          if (index < 0)
            catalog.quests.push(next);
          else
            catalog.quests[index] = next;
        }
        await writeFile7(path, JSON.stringify(catalog, null, 2) + `
`);
      }
      const scoped = createContentService({ dataRoot: join9(tempDirectory, "content"), projects: [{ id: projectId, root: tempCheckout }] });
      let build;
      let sources;
      try {
        for (const asset of input.assets ?? []) {
          const original = await options.content.resolveMedia({ projectId, op: "media", id: asset.candidateId, variant: "original" });
          if (original.mimeType !== "image/png")
            throw Error(`剧情素材必须为 PNG：${asset.path}`);
          const bytes = await readFile11(original.absolutePath);
          const purpose = validItemIconAssetPath(asset.path) ? "item-icon" : input.npcs?.some((npc) => `public/${npc.portraitAsset}` === asset.path) ? "story-portrait" : "story-scene";
          const [registered] = await scoped.command("registerCandidates", { projectId, candidates: [{ name: asset.path.split("/").at(-1), mimeType: "image/png", base64: bytes.toString("base64"), metadata: { ...original.metadata, purpose } }] });
          const adopted = await scoped.command("adoptVersion", { projectId, candidateId: registered.id, path: asset.path });
          if (adopted.path !== asset.path || !await fileHash(join9(tempCheckout, asset.path)))
            throw Error(`剧情素材未写入预期路径：${asset.path}`);
        }
        for (const doc of [...input.documents, ...referenceDocuments]) {
          const original = await options.content.query({ projectId, op: "document", path: doc.path }).catch((error) => {
            if (error.code === "NOT_FOUND")
              return null;
            throw error;
          });
          if ((original?.revision ?? null) !== (doc.expectedRevision ?? null))
            throw Error(`剧情源文档已变化：${doc.path}`);
          if (referenceDocuments.includes(doc) && original?.content && frontmatterHasScene(original.content))
            throw Error(`已有场景不能作为普通资料修改：${doc.path}`);
          const cloneDoc = await scoped.query({ projectId, op: "document", path: doc.path }).catch((error) => {
            if (error.code === "NOT_FOUND")
              return null;
            throw error;
          });
          if ((cloneDoc?.revision ?? null) !== (doc.expectedRevision ?? null))
            throw Error(`隔离副本与剧情源文档不一致：${doc.path}`);
          await scoped.command("saveDocument", { projectId, path: doc.path, content: doc.content, expectedRevision: cloneDoc?.revision ?? null });
        }
        build = await scoped.command("compileStory", { projectId, entry: input.entryPath, storyId: input.storyId });
        if (build.diagnostics.some((item) => item.severity === "error"))
          throw Error(`剧情编译未通过：${build.diagnostics.filter((item) => item.severity === "error").map((item) => `${item.path}: ${item.detail}`).join("；")}`);
        const builds = await scoped.query({ projectId, op: "storyBuilds", limit: 100 });
        sources = builds.items.find((item) => item.storyId === input.storyId)?.sourcePaths ?? [];
        if (!sources.length)
          throw Error("剧情编译没有登记源文件");
        const reachable = new Set(sources);
        const unrelated = input.documents.find((doc) => !reachable.has(doc.path));
        if (unrelated)
          throw Error(`剧情文档不属于本次可达场景：${unrelated.path}`);
      } finally {
        await scoped.close();
      }
      const publicPath = build.outputPath.replace(/^public\//u, "");
      let hubPath;
      let entryHubId;
      let entryActionId;
      const catalog = JSON.parse(await readFile11(join9(tempCheckout, STORY_CATALOG_PATH), "utf8"));
      if (input.launch) {
        hubPath = input.launch.hubPath;
        const path = join9(tempCheckout, hubPath);
        const hub = JSON.parse(await readFile11(path, "utf8"));
        if (!hub.hubId || !catalog.resources?.some((item) => item.kind === "hub" && item.resourceId === hub.hubId && item.publicPath === hubPath.slice("public/".length)))
          throw Error("剧情 Hub 入口未登记或 ID 不一致");
        entryHubId = hub.hubId;
        entryActionId = input.launch.actionId;
        const location = hub.locations?.find((item) => item.id === input.launch.locationId);
        if (!location || !Array.isArray(location.actions))
          throw Error("Hub 中找不到剧情入口地点");
        if (hub.locations?.some((item) => item !== location && item.actions?.some((action) => action.id === input.launch.actionId)))
          throw Error("Hub 行动 ID 已用于其他地点");
        const action = { id: input.launch.actionId, kind: "startStory", label: input.launch.label, description: input.brief, storyResourceId: input.storyId, storyGraphFile: publicPath, statusText: `已进入${input.launch.label}。` };
        const index = location.actions.findIndex((item) => item.id === input.launch.actionId);
        if (index >= 0)
          location.actions[index] = action;
        else
          location.actions.push(action);
        await writeFile7(path, JSON.stringify(hub, null, 2) + `
`);
      } else {
        const hubs = (catalog.resources ?? []).filter((item) => item.kind === "hub" && typeof item.resourceId === "string" && typeof item.publicPath === "string" && /^data\/hub\/(?:[A-Za-z0-9._-]+\/)*[A-Za-z0-9._-]+\.json$/u.test(item.publicPath));
        const reachable = await Promise.all(hubs.map(async (item) => {
          const hub = JSON.parse(await readFile11(join9(tempCheckout, "public", item.publicPath), "utf8"));
          if (hub.hubId !== item.resourceId)
            return null;
          const action = hub.locations?.flatMap((location) => location.actions ?? []).find((action) => action.kind === "startStory" && typeof action.id === "string" && /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/u.test(action.id) && action.storyResourceId === input.storyId && action.storyGraphFile === publicPath);
          return action ? { hubId: item.resourceId, actionId: action.id, path: `public/${item.publicPath}` } : null;
        }));
        const entry = reachable.find((item) => item !== null);
        if (!entry)
          throw Error("新剧情没有游戏入口；请指定 launch 的 Hub 地点与行动");
        hubPath = entry.path;
        entryHubId = entry.hubId;
        entryActionId = entry.actionId;
      }
      for (const edit of input.copyEdits ?? []) {
        const path = await candidateFile(tempCheckout, edit.path);
        await writeFile7(path, applyStoryCopyEdits(edit.path, await readFile11(path, "utf8"), edit.edits));
      }
      const graph = JSON.parse(await readFile11(join9(tempCheckout, build.outputPath), "utf8"));
      if (input.quests?.length && graph.shareFactsAcrossStories !== true) {
        throw Error("剧情任务必须启用 shareFactsAcrossStories，才能在据点与大地图查看进度");
      }
      const speakers = new Set((graph.nodes ?? []).flatMap((node) => node.dialogues?.map((line) => line.speakerId) ?? []));
      const abilityReads = [];
      const portraits = new Set;
      const itemIconPaths = new Set;
      const itemReads = new Set;
      const questRefs = new Map;
      const noteQuest = (id, stage) => {
        if (!questRefs.has(id))
          questRefs.set(id, new Set);
        questRefs.get(id).add(stage);
      };
      for (const [id, stage] of Object.entries(graph.initialState?.questStages ?? {}))
        noteQuest(id, stage);
      const collectAbilityReads = (value) => {
        if (!value || typeof value !== "object" || Array.isArray(value))
          return;
        const condition = value;
        if (condition.kind === "actorAbility")
          abilityReads.push({ actorId: String(condition.actorId), ability: String(condition.ability) });
        else if (condition.kind === "itemCount")
          itemReads.add(String(condition.itemId));
        else if (condition.kind === "questStage")
          noteQuest(String(condition.questId), String(condition.stage));
        else if (condition.kind === "all" || condition.kind === "any") {
          for (const child of Array.isArray(condition.conditions) ? condition.conditions : [])
            collectAbilityReads(child);
        } else if (condition.kind === "not")
          collectAbilityReads(condition.condition);
      };
      for (const choice of graph.choices ?? []) {
        collectAbilityReads(choice.visibleWhen);
        collectAbilityReads(choice.enabledWhen);
      }
      if (speakers.size || input.npcs?.length || abilityReads.length || input.quests?.some((quest) => quest.actorIds.length)) {
        const npcCatalog = JSON.parse(await readFile11(join9(tempCheckout, STORY_NPC_CATALOG_PATH), "utf8"));
        if (!Array.isArray(npcCatalog.npcs))
          throw Error("游戏人物目录格式无效");
        const known = new Set(npcCatalog.npcs.map((npc) => npc.id));
        for (const id of speakers)
          if (id !== "player" && !known.has(id))
            throw Error(`剧情对白引用不存在的人物：${id}`);
        for (const npc of npcCatalog.npcs) {
          if (!speakers.has(npc.id) || !npc.portraitAsset)
            continue;
          const path = `public/${npc.portraitAsset}`;
          if (!validStoryAssetPath(path) || !await fileHash(join9(tempCheckout, path)))
            throw Error(`人物立绘不存在或路径无效：${npc.id}`);
          portraits.add(path);
        }
        for (const read of abilityReads) {
          const value = npcCatalog.npcs.find((npc) => npc.id === read.actorId)?.abilities?.[read.ability];
          if (!Number.isFinite(value))
            throw Error(`剧情条件引用不存在的人物能力：${read.actorId}.${read.ability}`);
        }
        for (const quest of input.quests ?? [])
          for (const id of quest.actorIds)
            if (!known.has(id))
              throw Error(`游戏任务引用不存在的人物：${id}`);
        for (const id of npcIds)
          if (!speakers.has(id))
            throw Error(`新增人物未出现在当前剧情对白：${id}`);
      }
      const grants = [];
      const itemEffects = [];
      const battles = [];
      const collectEffects = (effects) => {
        for (const entry of effects ?? []) {
          if (!entry || typeof entry !== "object" || Array.isArray(entry))
            continue;
          const effect = entry;
          if (effect.kind === "grantCard")
            grants.push(effect);
          if (effect.kind === "grantItem" || effect.kind === "consumeItem")
            itemEffects.push(effect);
          if (effect.kind === "setQuestStage")
            noteQuest(String(effect.questId), String(effect.stage));
          if (effect.kind === "startBattle" && effect.battle && typeof effect.battle === "object" && !Array.isArray(effect.battle)) {
            battles.push(effect.battle);
          }
          if (effect.kind === "once" && Array.isArray(effect.effects))
            collectEffects(effect.effects);
        }
      };
      for (const node of graph.nodes ?? [])
        collectEffects(node.onEnter);
      for (const choice of graph.choices ?? [])
        collectEffects(choice.effects);
      if (input.quests?.length) {
        const catalog = JSON.parse(await readFile11(join9(tempCheckout, STORY_QUEST_CATALOG_PATH), "utf8"));
        if (!Array.isArray(catalog.quests))
          throw Error("游戏任务目录格式无效");
        for (const [id, stages] of questRefs) {
          const quest = catalog.quests.find((item) => item.id === id);
          if (!quest || [...stages].some((stage) => !quest.stages.some((item) => item.id === stage))) {
            throw Error(`剧情引用不存在的任务或阶段：${id}`);
          }
        }
        for (const quest of input.quests)
          if (!questRefs.has(quest.id))
            throw Error(`新增任务未被当前剧情使用：${quest.id}`);
      }
      if ((grants.length || itemEffects.length) && graph.shareFactsAcrossStories !== true)
        throw Error("剧情仓库变更必须启用 shareFactsAcrossStories");
      if (itemReads.size || itemEffects.length || input.items?.length || input.recipes?.length) {
        const catalog = JSON.parse(await readFile11(join9(tempCheckout, STORY_ITEM_CATALOG_PATH), "utf8"));
        const known = new Map;
        const definitions = new Map;
        for (const [field, kind] of [["artifacts", "artifact"], ["tools", "tool"], ["consumables", "consumable"], ["materials", "material"], ["quests", "quest"], ["questItems", "quest"]]) {
          for (const item of catalog[field] ?? []) {
            if (known.has(item.id))
              throw Error(`游戏道具 ID 重复：${item.id}`);
            known.set(item.id, kind);
            definitions.set(item.id, item);
          }
        }
        for (const id of itemReads)
          if (!known.has(id))
            throw Error(`剧情条件引用不存在的道具：${id}`);
        const transactionIds = new Set;
        for (const effect of itemEffects) {
          if (known.get(effect.itemId) !== effect.itemType)
            throw Error(`剧情效果引用不存在或类型不符的道具：${effect.itemId}`);
          if (transactionIds.has(effect.transactionId))
            throw Error(`剧情道具结算 ID 重复：${effect.transactionId}`);
          transactionIds.add(effect.transactionId);
        }
        for (const id of new Set([...itemReads, ...itemEffects.map((effect) => effect.itemId), ...(input.items ?? []).map((item) => item.id)])) {
          const icon = definitions.get(id)?.iconAsset;
          if (!icon)
            continue;
          const path = `public/${icon}`;
          if (!validItemIconAssetPath(path) || !await fileHash(join9(tempCheckout, path)))
            throw Error(`道具图标不存在或路径无效：${id}`);
          itemIconPaths.add(path);
        }
        for (const id of newItemIds) {
          const recipeOutput = input.recipes?.some((recipe) => recipe.rewards.items.some((item) => item.id === id)) ?? false;
          if (!itemReads.has(id) && !itemEffects.some((effect) => effect.itemId === id) && !recipeOutput)
            throw Error(`新增道具未被当前剧情引用：${id}`);
          if (!itemEffects.some((effect) => effect.kind === "grantItem" && effect.itemId === id) && !recipeOutput)
            throw Error(`新增道具没有当前剧情中的获得途径：${id}`);
        }
      }
      if (grants.length) {
        const units = JSON.parse(await readFile11(join9(tempCheckout, CARD_UNITS_PATH), "utf8"));
        const ids = new Set(units.units?.map((unit) => unit.id) ?? []);
        if (grants.some((grant) => !ids.has(grant.cardId)))
          throw Error(`剧情奖励引用不存在的卡牌：${grants.find((grant) => !ids.has(grant.cardId))?.cardId}`);
        const uniqueGrants = new Map;
        for (const grant of grants) {
          const value = `${grant.cardId}:${grant.count}`;
          if (uniqueGrants.has(grant.grantId) && uniqueGrants.get(grant.grantId) !== value)
            throw Error(`剧情奖励 ID 指向不同卡牌：${grant.grantId}`);
          uniqueGrants.set(grant.grantId, value);
        }
      }
      const battlePaths = new Set;
      if (battles.length) {
        const catalog = JSON.parse(await readFile11(join9(tempCheckout, STORY_CATALOG_PATH), "utf8"));
        for (const battle of battles) {
          for (const [kind, resourceId, path] of [
            ["encounter", battle.encounterResourceId, battle.encounterFile],
            ["deck", battle.deckResourceId, battle.deckFile]
          ]) {
            if (!resourceId || typeof path !== "string" || !validStoryBattlePath(`public/${path}`, kind) || !catalog.resources?.some((item) => item.kind === kind && item.resourceId === resourceId && item.publicPath === path)) {
              throw Error(`剧情战斗引用未登记的${kind === "encounter" ? "遭遇" : "卡组"}：${resourceId ?? path}`);
            }
            battlePaths.add(`public/${path}`);
          }
          const encounter = JSON.parse(await readFile11(join9(tempCheckout, "public", battle.encounterFile), "utf8"));
          if (encounter.id !== battle.encounterId)
            throw Error(`剧情战斗遭遇 ID 不一致：${battle.battleId}`);
        }
      }
      const shopDependencies = new Set;
      const shopTargets = [];
      if (input.shops?.length) {
        const catalog = JSON.parse(await readFile11(join9(tempCheckout, STORY_CATALOG_PATH), "utf8"));
        const resources = catalog.resources ?? [];
        const itemCatalog = JSON.parse(await readFile11(await candidateFile(tempCheckout, STORY_ITEM_CATALOG_PATH), "utf8"));
        const knownItems = new Map;
        for (const [field, kind] of [["artifacts", "artifact"], ["tools", "tool"], ["consumables", "consumable"], ["materials", "material"], ["quests", "quest"], ["questItems", "quest"]]) {
          const entries = itemCatalog[field];
          if (entries !== undefined && !Array.isArray(entries))
            throw Error("游戏道具目录格式无效");
          for (const item of entries ?? []) {
            if (!item?.id || knownItems.has(item.id))
              throw Error(`游戏道具 ID 重复或无效：${item?.id}`);
            knownItems.set(item.id, kind);
          }
        }
        const cardOwners = new Map;
        for (const collection of Object.values(CARD_COLLECTIONS)) {
          const sourcePath = await candidateFile(tempCheckout, collection.path).catch((error) => {
            if (error.code === "ENOENT")
              return null;
            throw error;
          });
          if (!sourcePath)
            continue;
          const definitions = JSON.parse(await readFile11(sourcePath, "utf8"));
          const cards = definitions[collection.key];
          if (!Array.isArray(cards))
            throw Error(`游戏卡牌目录格式无效：${collection.path}`);
          for (const card of cards) {
            if (!card?.id || cardOwners.has(card.id))
              throw Error(`游戏卡牌 ID 重复或无效：${card?.id}`);
            cardOwners.set(card.id, collection.path);
          }
        }
        for (const shop of input.shops) {
          const entry = resources.find((item) => item.kind === "expeditionShop" && item.resourceId === shop.resourceId);
          const shopPath = entry?.publicPath ? `public/${entry.publicPath}` : "";
          if (!entry || !validStoryTargetPath(shopPath) || !shopPath.startsWith("public/data/mijing/")) {
            throw Error(`商店未登记或路径无效：${shop.resourceId}`);
          }
          const shopFile = await candidateFile(tempCheckout, shopPath);
          const collection = JSON.parse(await readFile11(shopFile, "utf8"));
          const definition = collection.shopsByNodeId?.[shop.nodeId];
          if (collection.id !== shop.resourceId || !Object.hasOwn(collection.shopsByNodeId ?? {}, shop.nodeId) || definition?.nodeId !== shop.nodeId || !Array.isArray(definition.offers)) {
            throw Error(`商店节点不存在或 ID 不一致：${shop.resourceId}.${shop.nodeId}`);
          }
          const mapResourceIds = [];
          for (const mapEntry of resources.filter((item) => item.kind === "expeditionMap")) {
            const mapPath = mapEntry.publicPath ? `public/${mapEntry.publicPath}` : "";
            if (!mapEntry.resourceId || !validStoryTargetPath(mapPath) || !mapPath.startsWith("public/data/mijing/"))
              continue;
            const map = JSON.parse(await readFile11(await candidateFile(tempCheckout, mapPath), "utf8"));
            if (!Array.isArray(map.nodes))
              continue;
            const nodes = new Map(map.nodes.map((node) => [node.id, node]));
            const reachable = new Set;
            const pending = map.entryNodeId ? [map.entryNodeId] : [];
            while (pending.length) {
              const id = pending.shift();
              if (reachable.has(id))
                continue;
              reachable.add(id);
              pending.push(...nodes.get(id)?.outgoingNodeIds ?? []);
            }
            if (map.nodes.some((node) => reachable.has(node.id) && node.id === shop.nodeId && node.type === "shop" && node.payloadRef?.ref === shop.nodeId && node.payloadRef.contentFile === entry.publicPath)) {
              mapResourceIds.push(mapEntry.resourceId);
              shopDependencies.add(mapPath);
            }
          }
          if (!mapResourceIds.length)
            throw Error(`商店节点没有可达的已登记秘境地图：${shop.nodeId}`);
          let changed = false;
          for (const offer of shop.offers) {
            for (const stack of [...offer.cost.items ?? [], ...offer.rewards.items]) {
              if (knownItems.get(stack.id) !== stack.itemType)
                throw Error(`商店报价引用不存在或类型不符的道具：${stack.id}`);
            }
            for (const stack of offer.rewards.cards) {
              const path = cardOwners.get(stack.id);
              if (!path)
                throw Error(`商店报价引用不存在的卡牌：${stack.id}`);
              shopDependencies.add(path);
            }
            const index = definition.offers.findIndex((item) => item.id === offer.id);
            if (index < 0) {
              definition.offers.push(offer);
              changed = true;
            } else if (stable4(definition.offers[index]) !== stable4(offer)) {
              definition.offers[index] = offer;
              changed = true;
            }
          }
          shopDependencies.add(shopPath);
          shopTargets.push({
            resourceId: shop.resourceId,
            nodeId: shop.nodeId,
            offerIds: shop.offers.map((offer) => offer.id),
            mapResourceIds
          });
          if (changed)
            await writeFile7(shopFile, JSON.stringify(collection, null, 2) + `
`);
        }
        if (input.shops.some((shop) => shop.offers.some((offer) => (offer.cost.items?.length ?? 0) || offer.rewards.items.length))) {
          shopDependencies.add(STORY_ITEM_CATALOG_PATH);
        }
      }
      const backgrounds = (graph.nodes ?? []).flatMap((node) => node.backgroundAsset ? [`public/${node.backgroundAsset}`] : []);
      if (backgrounds.some((path) => !validStoryAssetPath(path)))
        throw Error("剧情编译图包含不允许的背景路径");
      if ([...assetPaths].some((path) => !backgrounds.includes(path) && !portraits.has(path) && !itemIconPaths.has(path)))
        throw Error("剧情素材没有被当前场景、对白人物或道具引用");
      const paths = [...new Set([
        ...sources,
        ...input.documents.map((doc) => doc.path),
        ...referenceDocuments.map((doc) => doc.path),
        build.outputPath,
        STORY_CATALOG_PATH,
        ...grants.length ? [CARD_UNITS_PATH] : [],
        ...itemReads.size || itemEffects.length || input.items?.length || input.recipes?.length ? [STORY_ITEM_CATALOG_PATH] : [],
        ...speakers.size || abilityReads.length || input.quests?.some((quest) => quest.actorIds.length) ? [STORY_NPC_CATALOG_PATH] : [],
        ...input.quests?.length ? [STORY_QUEST_CATALOG_PATH] : [],
        ...backgrounds,
        ...portraits,
        ...itemIconPaths,
        ...battlePaths,
        ...shopDependencies,
        ...copyPaths,
        ...input.assets?.length ? [STORY_ASSET_MANIFEST_PATH, ...assetPaths] : [],
        ...hubPath ? [hubPath] : []
      ])];
      if (paths.some((path) => !validStoryTargetPath(path)))
        throw Error("剧情候选包含不允许的文件路径");
      const baseDependencies = await Promise.all(paths.map(async (path) => ({ path, revision: await fileHash(join9(source, path)) })));
      for (const doc of [...input.documents, ...referenceDocuments]) {
        if (baseDependencies.find((item) => item.path === doc.path)?.revision !== (doc.expectedRevision ?? null)) {
          throw Error(`剧情源文档在建立候选时已变化：${doc.path}`);
        }
      }
      const dependencies = await Promise.all(paths.map(async (path) => ({ path, revision: await fileHash(join9(tempCheckout, path)) })));
      if (dependencies.some((item) => !item.revision))
        throw Error("剧情候选依赖文件缺失");
      const changedPaths = paths.filter((path, index) => baseDependencies[index].revision !== dependencies[index].revision);
      if (!changedPaths.length)
        throw Error("剧情候选没有文件变化");
      const targetBaseRevision = digest5(stable4(baseDependencies));
      const fingerprint = digest5(stable4({ storyId: input.storyId, entryPath: input.entryPath, dependencies, changedPaths }));
      const baseId = `story-${digest5(stable4({ projectId, productionId, fingerprint, targetBaseRevision, sourceTree })).slice(0, 36)}`;
      const detail = await options.workflow.query({ projectId, op: "production", productionId });
      const { id, previous } = candidateSlot(baseId, detail.production.gameCandidates);
      if (previous) {
        await registerPreview(previous);
        return { candidate: previous, production: detail.production, reused: true };
      }
      await git2(tempCheckout, "add", "-A");
      if (await git2(tempCheckout, "status", "--porcelain"))
        await git2(tempCheckout, "-c", "user.name=Worka Candidate", "-c", "user.email=worka-candidate@local.invalid", "-c", "commit.gpgsign=false", "commit", "--quiet", "-m", `CardGame story candidate ${input.storyId}`);
      const commit = await git2(tempCheckout, "rev-parse", "HEAD");
      if (!/^[0-9a-f]{40}$/u.test(commit))
        throw Error("剧情候选没有确切提交");
      const validationManifest = digest5(stable4({ commit, checks: [
        "game-shell",
        "content-catalog",
        "story-resource",
        "story-route",
        ...speakers.size ? ["story-speakers"] : [],
        ...abilityReads.length ? ["story-abilities"] : [],
        ...itemReads.size || itemEffects.length || input.items?.length ? ["story-items"] : [],
        ...input.recipes?.length ? ["story-recipes"] : [],
        ...input.quests?.length ? ["story-quests"] : [],
        ...battles.length ? ["story-battles"] : [],
        ...shopTargets.length ? ["story-shops"] : [],
        ...backgrounds.length ? ["story-backgrounds"] : [],
        ...portraits.size ? ["story-portraits"] : [],
        ...itemIconPaths.size ? ["story-item-icons"] : [],
        ...copyPaths.length ? ["story-copy"] : []
      ], storyId: input.storyId }));
      const recipeIds = input.recipes?.map((recipe) => recipe.id) ?? [];
      const itemUseIds = input.items?.filter((item) => item.useEffect).map((item) => item.id) ?? [];
      const questIds = input.quests?.map((quest) => quest.id) ?? [];
      const portraitPaths = [...portraits].sort();
      const itemIconPathsSorted = [...itemIconPaths].sort();
      const candidateHash = digest5(stable4({ kind: "story", targetId: input.storyId, entryHubId, entryActionId, ...shopTargets.length ? { shopTargets } : {}, ...recipeIds.length ? { recipeIds } : {}, ...itemUseIds.length ? { itemUseIds } : {}, ...questIds.length ? { questIds } : {}, ...copyPaths.length ? { copyPaths } : {}, ...portraitPaths.length ? { portraitPaths } : {}, ...itemIconPathsSorted.length ? { itemIconPaths: itemIconPathsSorted } : {}, commit, fingerprint, sourceTree, sourceSnapshotScope: "runtime", targetBaseRevision, validationManifest, dependencies, baseDependencies, changedPaths }));
      const finalDirectory = candidatePath(projectId, id);
      await rm4(finalDirectory, { recursive: true, force: true });
      await mkdir8(dirname5(finalDirectory), { recursive: true });
      const { rename } = await import("node:fs/promises");
      await rename(tempDirectory, finalDirectory);
      moved = true;
      const at = new Date().toISOString();
      const candidate = {
        id,
        projectId,
        productionId,
        cardId: "CR_001",
        kind: "story",
        targetId: input.storyId,
        entryHubId,
        entryActionId,
        ...shopTargets.length ? { shopTargets } : {},
        changedPaths,
        baseDependencies,
        ...copyPaths.length ? { copyPaths } : {},
        ...portraitPaths.length ? { portraitPaths } : {},
        ...itemIconPathsSorted.length ? { itemIconPaths: itemIconPathsSorted } : {},
        ...recipeIds.length ? { recipeIds } : {},
        ...itemUseIds.length ? { itemUseIds } : {},
        ...questIds.length ? { questIds } : {},
        featureId: input.featureId,
        fingerprint,
        sourceSnapshotTree: sourceTree,
        sourceSnapshotScope: "runtime",
        candidateHash,
        commit,
        repo: join9(finalDirectory, "repo"),
        targetBaseRevision,
        validationManifest,
        dependencies: dependencies.map((item) => ({ path: item.path, revision: item.revision })),
        status: "candidate",
        createdAt: at,
        updatedAt: at
      };
      const recorded = await options.workflow.command("recordGameCandidate", { projectId, productionId, baseRevision: detail.production.revision, candidate });
      await registerPreview(recorded.candidate);
      return recorded;
    } finally {
      if (!moved)
        await rm4(tempDirectory, { recursive: true, force: true });
    }
  }
  async function stageDocuments(input) {
    const projectId = input.projectId;
    const source = project(projectId);
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/u.test(input.featureId ?? ""))
      throw Error("资料候选需要已有功能项的 featureId");
    if (!input.brief?.trim())
      throw Error("资料候选需要创作目标");
    if (!Array.isArray(input.documents) || input.documents.length < 1 || input.documents.length > 64)
      throw Error("资料候选每批需有 1–64 篇文档");
    const unique = new Set;
    for (const doc of input.documents) {
      if (!doc || typeof doc.path !== "string" || !validStorySourcePath(doc.path) || unique.has(doc.path) || typeof doc.content !== "string" || doc.content.length > 1e6)
        throw Error(`资料文档路径、内容或大小无效：${doc?.path}`);
      if (frontmatterHasScene(doc.content))
        throw Error(`资料文档不能包含 scene: true：${doc.path}`);
      unique.add(doc.path);
    }
    const paths = [...unique].sort();
    const productionId = `documents-${digest5(stable4({ projectId, featureId: input.featureId, paths })).slice(0, 24)}`;
    const created = await options.workflow.command("createProduction", { projectId, id: productionId, brief: input.brief, featureId: input.featureId });
    if (created.production.featureId !== input.featureId)
      throw Error("资料制作单属于另一个功能项");
    const tempDirectory = candidatePath(projectId, `building-${randomUUID9()}`);
    const tempCheckout = join9(tempDirectory, "repo");
    await mkdir8(dirname5(tempDirectory), { recursive: true });
    let moved = false;
    try {
      await mkdir8(tempDirectory, { recursive: true });
      await sourceSnapshot(source, tempCheckout);
      const sourceTree = await runtimeTree(tempCheckout);
      const scoped = createContentService({ dataRoot: join9(tempDirectory, "content"), projects: [{ id: projectId, root: tempCheckout }] });
      try {
        for (const doc of input.documents) {
          const original = await options.content.query({ projectId, op: "document", path: doc.path }).catch((error) => {
            if (error.code === "NOT_FOUND")
              return null;
            throw error;
          });
          if ((original?.revision ?? null) !== (doc.expectedRevision ?? null))
            throw Error(`资料源文档已变化：${doc.path}`);
          if (original?.content && frontmatterHasScene(original.content))
            throw Error(`已有场景不能作为普通资料修改：${doc.path}`);
          const cloneDoc = await scoped.query({ projectId, op: "document", path: doc.path }).catch((error) => {
            if (error.code === "NOT_FOUND")
              return null;
            throw error;
          });
          if ((cloneDoc?.revision ?? null) !== (doc.expectedRevision ?? null))
            throw Error(`隔离副本与资料源文档不一致：${doc.path}`);
          await scoped.command("saveDocument", { projectId, path: doc.path, content: doc.content, expectedRevision: cloneDoc?.revision ?? null });
        }
      } finally {
        await scoped.close();
      }
      const baseDependencies = await Promise.all(paths.map(async (path) => ({ path, revision: await fileHash(join9(source, path)) })));
      for (const doc of input.documents) {
        if (baseDependencies.find((item) => item.path === doc.path)?.revision !== (doc.expectedRevision ?? null)) {
          throw Error(`资料源文档在建立候选时已变化：${doc.path}`);
        }
      }
      const dependencies = await Promise.all(paths.map(async (path) => ({ path, revision: await fileHash(join9(tempCheckout, path)) })));
      if (dependencies.some((item) => !item.revision))
        throw Error("资料候选依赖文件缺失");
      const changedPaths = paths.filter((path, index) => baseDependencies[index].revision !== dependencies[index].revision);
      if (!changedPaths.length)
        throw Error("资料候选没有文件变化");
      const targetBaseRevision = digest5(stable4(baseDependencies));
      const fingerprint = digest5(stable4({ paths, dependencies, changedPaths }));
      const baseId = `documents-${digest5(stable4({ projectId, productionId, fingerprint, targetBaseRevision, sourceTree })).slice(0, 36)}`;
      const detail = await options.workflow.query({ projectId, op: "production", productionId });
      const { id, previous } = candidateSlot(baseId, detail.production.gameCandidates);
      if (previous) {
        await registerPreview(previous);
        return { candidate: previous, production: detail.production, reused: true };
      }
      await git2(tempCheckout, "add", "-A");
      if (await git2(tempCheckout, "status", "--porcelain"))
        await git2(tempCheckout, "-c", "user.name=Worka Candidate", "-c", "user.email=worka-candidate@local.invalid", "-c", "commit.gpgsign=false", "commit", "--quiet", "-m", "CardGame document candidate");
      const commit = await git2(tempCheckout, "rev-parse", "HEAD");
      if (!/^[0-9a-f]{40}$/u.test(commit))
        throw Error("资料候选没有确切提交");
      const validationManifest = digest5(stable4({ commit, checks: ["game-shell", "content-catalog", "knowledge-documents"], paths }));
      const targetId = paths[0];
      const candidateHash = digest5(stable4({ kind: "documents", targetId, commit, fingerprint, sourceTree, sourceSnapshotScope: "runtime", targetBaseRevision, validationManifest, dependencies, baseDependencies, changedPaths }));
      const finalDirectory = candidatePath(projectId, id);
      await rm4(finalDirectory, { recursive: true, force: true });
      await mkdir8(dirname5(finalDirectory), { recursive: true });
      const { rename } = await import("node:fs/promises");
      await rename(tempDirectory, finalDirectory);
      moved = true;
      const at = new Date().toISOString();
      const candidate = {
        id,
        projectId,
        productionId,
        cardId: "",
        kind: "documents",
        targetId,
        changedPaths,
        baseDependencies,
        featureId: input.featureId,
        fingerprint,
        sourceSnapshotTree: sourceTree,
        sourceSnapshotScope: "runtime",
        candidateHash,
        commit,
        repo: join9(finalDirectory, "repo"),
        targetBaseRevision,
        validationManifest,
        dependencies: dependencies.map((item) => ({ path: item.path, revision: item.revision })),
        status: "candidate",
        createdAt: at,
        updatedAt: at
      };
      const recorded = await options.workflow.command("recordGameCandidate", { projectId, productionId, baseRevision: detail.production.revision, candidate });
      await registerPreview(recorded.candidate);
      return recorded;
    } finally {
      if (!moved)
        await rm4(tempDirectory, { recursive: true, force: true });
    }
  }
  return {
    stageDeck: (input) => serial(() => stageDeck(input)),
    stageCard: (input) => serial(() => stageCard(input)),
    stageStory: (input) => serial(() => stageStory(input)),
    stageDocuments: (input) => serial(() => stageDocuments(input)),
    async close() {
      await queue;
    }
  };
}

// plugins/cardgame-content/src/game-adoption.ts
import { createHash as createHash13, randomUUID as randomUUID10 } from "node:crypto";
import { execFile as execFile3 } from "node:child_process";
import { lstat as lstat6, mkdir as mkdir9, readFile as readFile12, readdir as readdir5, realpath as realpath9, rename as rename8, rm as rm5, writeFile as writeFile8 } from "node:fs/promises";
import { dirname as dirname6, join as join10, resolve as resolve5 } from "node:path";
import { promisify as promisify3 } from "node:util";
var run3 = promisify3(execFile3);
var hash3 = (value) => createHash13("sha256").update(value).digest("hex");
var stable5 = (value) => JSON.stringify(value, (_key, item) => item && typeof item === "object" && !Array.isArray(item) ? Object.fromEntries(Object.entries(item).sort(([a], [b]) => a.localeCompare(b))) : item);
var eq = (a, b) => stable5(a) === stable5(b);
var bytes = async (path) => readFile12(path).catch((error) => {
  if (error.code === "ENOENT")
    return null;
  throw error;
});
var json2 = async (path, fallback) => {
  const value = await bytes(path);
  return value ? JSON.parse(value.toString("utf8")) : fallback;
};
var encode2 = (value) => value?.toString("base64") ?? null;
var decode2 = (value) => value === null ? null : Buffer.from(value, "base64");
var format = (value) => Buffer.from(JSON.stringify(value, null, 2) + `
`);
var same = (a, b) => a === null || b === null ? a === b : a.equals(b);
function createGameAdoptionService(options) {
  const roots = new Map(options.projects.map((project) => [project.id, resolve5(project.root)]));
  const journals = resolve5(options.dataRoot, "game-adoptions");
  let queue = Promise.resolve();
  const serial = (fn) => {
    const next = queue.then(fn);
    queue = next.catch(() => {
      return;
    });
    return next;
  };
  const root = (projectId) => {
    const path = roots.get(projectId);
    if (!path)
      throw Error("项目未登记");
    return path;
  };
  const journalPath = (journal) => join10(journals, journal.projectId, `${journal.id}.json`);
  const writeJournal = async (journal) => {
    const path = journalPath(journal);
    await mkdir9(dirname6(path), { recursive: true });
    const temp = `${path}.${randomUUID10()}.tmp`;
    await writeFile8(temp, JSON.stringify(journal));
    await rename8(temp, path);
  };
  const candidate = async (input, requireCurrent = false) => {
    const projectId = String(input.projectId ?? "");
    const productionId = String(input.productionId ?? "");
    const detail = await options.workflow.query({ projectId, op: "production", productionId });
    const item = detail.production.gameCandidates?.find((value) => value.id === input.candidateId);
    if (!item)
      throw Error("找不到制作单对应的确切候选");
    if (item.featureId !== input.featureId || item.candidateHash !== input.candidateHash || item.targetBaseRevision !== input.targetBaseRevision || item.validationManifest !== input.validationManifest)
      throw Error("确认资料与候选不一致，请刷新功能进展");
    if (requireCurrent && item.status === "candidate" && !projectGameChange(detail.production).candidates.some((value) => value.id === item.id && value.current))
      throw Error("候选已过期，请刷新并确认当前需求对应的候选");
    return item;
  };
  const checkSnapshot = async (item) => {
    if (!/^[0-9a-f]{40}$/.test(item.commit) || !isPathDescendant(resolve5(options.dataRoot, "game-candidates"), item.repo))
      throw Error("候选快照无效");
    const candidateRoot = await realpath9(resolve5(options.dataRoot, "game-candidates"));
    const checkout = await realpath9(item.repo);
    if (!isPathDescendant(candidateRoot, checkout))
      throw Error("候选快照目录越界");
    const actual = (await run3("git", ["rev-parse", "HEAD"], { cwd: item.repo })).stdout.trim();
    if (actual !== item.commit || (await run3("git", ["status", "--porcelain"], { cwd: item.repo })).stdout.trim())
      throw Error("候选快照已改变");
    const sourceTree = item.sourceSnapshotTree ? { sourceTree: item.sourceSnapshotTree, ...item.sourceSnapshotScope ? { sourceSnapshotScope: item.sourceSnapshotScope } : {} } : {};
    const expected = item.kind === "deck" ? deckCandidateHash(item) : item.kind === "story" ? hash3(stable5({ kind: "story", targetId: item.targetId, ...item.entryHubId && item.entryActionId ? { entryHubId: item.entryHubId, entryActionId: item.entryActionId } : {}, ...item.shopTargets?.length ? { shopTargets: item.shopTargets } : {}, ...item.recipeIds?.length ? { recipeIds: item.recipeIds } : {}, ...item.itemUseIds?.length ? { itemUseIds: item.itemUseIds } : {}, ...item.questIds?.length ? { questIds: item.questIds } : {}, ...item.copyPaths?.length ? { copyPaths: item.copyPaths } : {}, ...item.portraitPaths?.length ? { portraitPaths: item.portraitPaths } : {}, ...item.itemIconPaths?.length ? { itemIconPaths: item.itemIconPaths } : {}, commit: item.commit, fingerprint: item.fingerprint, ...sourceTree, targetBaseRevision: item.targetBaseRevision, validationManifest: item.validationManifest, dependencies: item.dependencies, baseDependencies: item.baseDependencies, changedPaths: item.changedPaths })) : item.kind === "documents" ? hash3(stable5({ kind: "documents", targetId: item.targetId, commit: item.commit, fingerprint: item.fingerprint, ...sourceTree, targetBaseRevision: item.targetBaseRevision, validationManifest: item.validationManifest, dependencies: item.dependencies, baseDependencies: item.baseDependencies, changedPaths: item.changedPaths })) : hash3(stable5({ commit: item.commit, fingerprint: item.fingerprint, ...sourceTree, targetBaseRevision: item.targetBaseRevision, validationManifest: item.validationManifest, dependencies: item.dependencies }));
    if (expected !== item.candidateHash)
      throw Error("候选身份校验失败");
    if (item.kind === "story" || item.kind === "documents" || item.kind === "deck") {
      const validPath = item.kind === "deck" ? validDeckTargetPath : item.kind === "documents" ? validStorySourcePath : validStoryTargetPath;
      if (item.kind === "deck" && (!item.deckPath || !validDeckTargetPath(item.deckPath) || item.deckPath === CARD_STARTER_DECK_PATH || !item.dependencies.some((dep) => dep.path === item.deckPath) || !item.changedPaths?.length || item.changedPaths.includes(CARD_STARTER_DECK_PATH)))
        throw Error("整套牌组候选不能覆盖正式默认牌组");
      if (!item.targetId || !item.changedPaths?.length || !item.baseDependencies?.length || item.changedPaths.some((path) => !validPath(path)) || item.copyPaths?.some((path) => !validStoryCopyPath(path) || !item.changedPaths?.includes(path)) || item.dependencies.some((dep) => !validPath(dep.path)) || item.baseDependencies.some((dep) => !validPath(dep.path)))
        throw Error("候选依赖路径无效");
      if (item.kind === "documents" && (item.copyPaths?.length || item.dependencies.length !== item.baseDependencies.length || item.dependencies.length > 64 || item.targetId !== item.dependencies[0]?.path))
        throw Error("资料候选依赖清单无效");
      const dependencyPaths = new Set(item.dependencies.map((dep) => dep.path));
      if (item.changedPaths.some((path) => !dependencyPaths.has(path)) || item.baseDependencies.some((dep) => !dependencyPaths.has(dep.path)))
        throw Error("候选依赖清单不完整");
      for (const dependency of item.dependencies) {
        const path = join10(item.repo, dependency.path);
        if ((await lstat6(path)).isSymbolicLink() || !isPathDescendant(checkout, await realpath9(path)))
          throw Error(`剧情候选依赖越界：${dependency.path}`);
        if (hash3(await readFile12(path)) !== dependency.revision)
          throw Error(`候选依赖已改变：${dependency.path}`);
      }
      if (item.kind === "deck" && item.deckArtFingerprints) {
        const ids = item.deckCardIds ?? [];
        if (!ids.length || item.placeholderCardIds?.length || !item.dependencies.some((dep) => dep.path === CARD_ASSET_MANIFEST_PATH))
          throw Error("整套插画候选资源清单不完整");
        const declared = item.dependencies.filter((dep) => dep.path.startsWith("public/assets/card-faces/")).map((dep) => dep.path);
        const referenced = [];
        const manifest = await json2(join10(item.repo, CARD_ASSET_MANIFEST_PATH), { assets: [] });
        for (const id of ids) {
          let card;
          for (const path of item.dependencies.filter((dep) => dep.path.startsWith("public/data/cards/")).map((dep) => dep.path)) {
            const collection = await json2(join10(item.repo, path), {});
            card ??= Object.values(collection).filter(Array.isArray).flat().find((entry) => entry.id === id);
          }
          const face = card?.cardFace;
          if (face?.schemaVersion !== 1 || !face.artwork || !face.variants?.jade || !face.variants?.scroll)
            throw Error(`卡牌 ${id} 的两套插画引用不完整`);
          const paths = [face.artwork, ...["jade", "scroll"].flatMap((theme) => [face.variants[theme].texture, face.variants[theme].preview])].map((path) => `public${path}`);
          if (new Set(paths).size !== 5 || paths.some((path) => !path.startsWith(`public/assets/card-faces/${id}/`) || !manifest.assets.some((entry) => entry.path === path)))
            throw Error(`卡牌 ${id} 的资源闭包不完整`);
          referenced.push(...paths);
        }
        if (!eq([...referenced].sort(), [...declared].sort()))
          throw Error("整套插画候选有遗漏或无关资源");
      }
      return item.changedPaths;
    }
    const collection = cardCollection(candidateCardKind(item));
    const entryPath = collection.inDeck ? CARD_STARTER_DECK_PATH : CARD_BATTLE_LOADOUT_PATH;
    if (![collection.path, CARD_ASSET_MANIFEST_PATH, entryPath].every((path) => item.dependencies.some((dep) => dep.path === path)))
      throw Error("候选卡牌依赖不完整");
    const paths = candidateAssetPaths(item);
    if (paths.length !== 5 || paths.some((path) => !new RegExp(`^public/assets/card-faces/${item.cardId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/[A-Za-z0-9._-]+\\.png$`).test(path)))
      throw Error("候选素材依赖不完整");
    for (const dependency of item.dependencies) {
      const path = join10(item.repo, dependency.path);
      if ((await lstat6(path)).isSymbolicLink() || !isPathDescendant(checkout, await realpath9(path)))
        throw Error(`候选依赖越界：${dependency.path}`);
      if (hash3(await readFile12(path)) !== dependency.revision)
        throw Error(`候选依赖已改变：${dependency.path}`);
    }
    return paths;
  };
  const writePatch = async (base, patch, reverse = false) => {
    const path = join10(base, patch.path);
    const expected = decode2(reverse ? patch.after : patch.before);
    const desired = decode2(reverse ? patch.before : patch.after);
    const current = await bytes(path);
    if (same(current, desired))
      return;
    if (!same(current, expected))
      throw Error(`目标已被外部修改：${patch.path}`);
    if (desired === null) {
      await rm5(path, { force: true });
      return;
    }
    await mkdir9(dirname6(path), { recursive: true });
    const temp = `${path}.${randomUUID10()}.tmp`;
    await writeFile8(temp, desired);
    await rename8(temp, path);
  };
  const apply = async (base, patches, reverse = false) => {
    const sequence = reverse ? [...patches].reverse() : patches;
    for (const patch of sequence)
      await writePatch(base, patch, reverse);
  };
  const merge = async (item, undo, adoption) => {
    if (item.kind === "story" || item.kind === "documents" || item.kind === "deck") {
      const patches = [];
      for (const path of item.changedPaths ?? []) {
        const before = await bytes(join10(root(item.projectId), path));
        const adopted = await bytes(join10(item.repo, path));
        if (!adopted)
          throw Error(`候选剧情文件缺失：${path}`);
        if (undo && !same(before, adopted))
          throw Error(`采用后的剧情文件已有新修改：${path}`);
        const original = adoption?.patches.find((patch) => patch.path === path)?.before ?? null;
        patches.push({ path, before: encode2(before), after: undo ? original : encode2(adopted) });
      }
      return patches;
    }
    const base = root(item.projectId);
    const paths = candidateAssetPaths(item);
    const kind = candidateCardKind(item);
    const collection = cardCollection(kind);
    const cardsPath = join10(base, collection.path);
    const manifestPath = join10(base, CARD_ASSET_MANIFEST_PATH);
    const entryPath = collection.inDeck ? CARD_STARTER_DECK_PATH : CARD_BATTLE_LOADOUT_PATH;
    const cardsBefore = await bytes(cardsPath);
    const manifestBefore = await bytes(manifestPath);
    const entryBefore = await bytes(join10(base, entryPath));
    const adoptionPatches = new Map(adoption?.patches.map((patch) => [patch.path, patch]) ?? []);
    if (undo && [collection.path, CARD_ASSET_MANIFEST_PATH, entryPath, ...paths].some((path) => !adoptionPatches.has(path))) {
      throw Error("完整采用日志缺少卡牌依赖");
    }
    const mergedJson = (path, current, next) => {
      const adoptedPatch = adoptionPatches.get(path);
      if (undo && adoptedPatch && same(current, decode2(adoptedPatch.after)))
        return adoptedPatch.before;
      return encode2(format(next));
    };
    const cards = cardsBefore ? JSON.parse(cardsBefore.toString("utf8")) : { [collection.key]: [] };
    const manifest = manifestBefore ? JSON.parse(manifestBefore.toString("utf8")) : { assets: [] };
    const entry = entryBefore ? JSON.parse(entryBefore.toString("utf8")) : null;
    const candidateCards = await json2(join10(item.repo, collection.path), { [collection.key]: [] });
    const candidateManifest = await json2(join10(item.repo, CARD_ASSET_MANIFEST_PATH), { assets: [] });
    const candidateEntry = await json2(join10(item.repo, entryPath), null);
    const currentCards = cards[collection.key];
    const stagedCards = candidateCards[collection.key];
    if (!Array.isArray(currentCards) || !Array.isArray(stagedCards) || !Array.isArray(manifest.assets) || !entry || !candidateEntry)
      throw Error("候选卡牌或目标目录不完整");
    const selected = stagedCards.find((card) => card.id === item.cardId);
    if (!selected)
      throw Error("候选卡牌或目标目录不完整");
    const candidateEntries = paths.map((path) => candidateManifest.assets.find((entry) => entry.path === path));
    if (candidateEntries.some((entry) => !entry))
      throw Error("候选素材清单不完整");
    const originalCards = adoption?.patches.find((patch) => patch.path === collection.path)?.before;
    const originalManifest = adoption?.patches.find((patch) => patch.path === CARD_ASSET_MANIFEST_PATH)?.before;
    const originalEntry = adoption?.patches.find((patch) => patch.path === entryPath)?.before;
    const beforeCard = originalCards ? JSON.parse(Buffer.from(originalCards, "base64").toString("utf8"))[collection.key].find((card) => card.id === item.cardId) : undefined;
    const beforeEntries = originalManifest ? JSON.parse(Buffer.from(originalManifest, "base64").toString("utf8")).assets : [];
    const originalEntryValue = originalEntry ? JSON.parse(Buffer.from(originalEntry, "base64").toString("utf8")) : null;
    const currentCard = currentCards.find((card) => card.id === item.cardId);
    if (undo && !eq(currentCard, selected))
      throw Error("采用后的卡牌已有新修改，无法直接撤销");
    const nextCard = undo ? beforeCard : selected;
    const nextCards = { ...cards, [collection.key]: [...currentCards.filter((card) => card.id !== item.cardId), ...nextCard ? [nextCard] : []] };
    const index = currentCards.findIndex((card) => card.id === item.cardId);
    if (nextCard && index >= 0)
      nextCards[collection.key].splice(index, 0, nextCards[collection.key].pop());
    const nextManifest = { ...manifest, assets: manifest.assets.filter((entry) => !paths.includes(String(entry.path))) };
    let nextEntry;
    if (collection.inDeck) {
      const deck = entry;
      const candidateDeck = candidateEntry;
      if (!Array.isArray(deck.cards) || !Array.isArray(candidateDeck.cards))
        throw Error("候选卡组格式无效");
      const candidateDeckCard = candidateDeck.cards.find((card) => card.id === item.cardId);
      if (!candidateDeckCard || undo && !eq(deck.cards.find((card) => card.id === item.cardId), candidateDeckCard))
        throw Error("候选卡组或采用后的卡组条目已变化");
      const beforeDeckCard = originalEntryValue?.cards.find((card) => card.id === item.cardId);
      const nextDeck = { ...deck, cards: deck.cards.filter((card) => card.id !== item.cardId) };
      const deckCard = undo ? beforeDeckCard : candidateDeckCard;
      if (deckCard)
        nextDeck.cards.push(deckCard);
      const deckIndex = deck.cards.findIndex((card) => card.id === item.cardId);
      if (deckCard && deckIndex >= 0)
        nextDeck.cards.splice(deckIndex, 0, nextDeck.cards.pop());
      nextEntry = nextDeck;
    } else {
      const key = kind === "pill" ? "pillIds" : "skillIds";
      const current = entry[key];
      const staged = candidateEntry[key];
      const original = originalEntryValue?.[key];
      if (entry.schemaVersion !== 1 || candidateEntry.schemaVersion !== 1 || !Array.isArray(current) || !Array.isArray(staged) || !staged.includes(item.cardId) || current.length > 3 || staged.length > 3 || new Set(current).size !== current.length || new Set(staged).size !== staged.length || current.some((id) => typeof id !== "string") || staged.some((id) => typeof id !== "string"))
        throw Error("候选战斗初始配置无效");
      if (undo && !current.includes(item.cardId))
        throw Error("采用后的战斗初始配置已变化");
      const wanted = undo ? original?.includes(item.cardId) ?? false : true;
      const updated = current.filter((id) => id !== item.cardId);
      if (wanted) {
        const position = current.indexOf(item.cardId);
        updated.splice(position >= 0 ? position : updated.length, 0, item.cardId);
      }
      if (updated.length > 3)
        throw Error("战斗初始配置槽位已满");
      nextEntry = { ...entry, [key]: updated };
    }
    for (const path of paths) {
      const current = manifest.assets.find((entry) => entry.path === path);
      const expected = candidateManifest.assets.find((entry) => entry.path === path);
      if (undo && !eq(current, expected))
        throw Error(`采用后的素材记录已有新修改：${path}`);
      const target = undo ? beforeEntries.find((entry) => entry.path === path) : expected;
      if (target)
        nextManifest.assets.push(target);
    }
    const patches = [
      { path: collection.path, before: encode2(cardsBefore), after: mergedJson(collection.path, cardsBefore, nextCards) },
      { path: CARD_ASSET_MANIFEST_PATH, before: encode2(manifestBefore), after: mergedJson(CARD_ASSET_MANIFEST_PATH, manifestBefore, nextManifest) },
      { path: entryPath, before: encode2(entryBefore), after: mergedJson(entryPath, entryBefore, nextEntry) }
    ];
    for (const path of paths) {
      const prior = await bytes(join10(base, path));
      const adopted = await readFile12(join10(item.repo, path));
      if (undo && !same(prior, adopted))
        throw Error(`采用后的素材文件已有新修改：${path}`);
      const original = adoption?.patches.find((patch) => patch.path === path)?.before ?? null;
      patches.push({ path, before: encode2(prior), after: undo ? original : encode2(adopted) });
    }
    return patches;
  };
  async function confirm(input) {
    const item = await candidate(input, true);
    if (item.status === "adopted")
      return { candidate: item, adoptionId: item.adoptionId, reused: true };
    if (item.status !== "candidate")
      throw Error("这个候选已经撤销，需建立新候选");
    if (item.kind === "deck") {
      const { production } = await options.workflow.query({ projectId: item.projectId, op: "production", productionId: item.productionId });
      const batch = production.batch;
      if (!batch?.deck)
        throw Error("整套牌组方案已不存在");
      const report = inspectDeck(batch.cards, batch.deck, production.brief, production.gameCandidates);
      if (!report.confirmed || report.fingerprint !== (item.deckLogicFingerprint ?? item.fingerprint) || report.candidateId !== item.id)
        throw Error("整套草案已更新，请确认并试玩当前候选");
    }
    await options.previewEvidence(item);
    await checkSnapshot(item);
    if (item.sourceSnapshotTree && await (item.sourceSnapshotScope === "runtime" ? gameRuntimeSnapshotTree : gameSourceSnapshotTree)(root(item.projectId)) !== item.sourceSnapshotTree) {
      throw Error("正式项目的游戏源码已改变，请建立并试玩新候选");
    }
    const targetRevision = item.kind === "story" || item.kind === "documents" || item.kind === "deck" ? await storyTargetBaseRevision(root(item.projectId), item.baseDependencies ?? []) : await cardTargetBaseRevision(root(item.projectId), item.cardId, candidateAssetPaths(item), candidateCardKind(item));
    if (targetRevision !== item.targetBaseRevision)
      throw Error("正式项目的内容或依赖已改变，请建立新候选");
    const journal = { id: randomUUID10(), candidateId: item.id, projectId: item.projectId, productionId: item.productionId, status: "applying", createdAt: new Date().toISOString(), patches: await merge(item, false) };
    await writeJournal(journal);
    let adopted = false;
    try {
      await apply(root(item.projectId), journal.patches);
      journal.status = "applied";
      await writeJournal(journal);
      const result = await options.workflow.command("recordGameAdoption", { projectId: item.projectId, productionId: item.productionId, candidateId: item.id, status: "adopted", adoptionId: journal.id });
      adopted = true;
      journal.status = "complete";
      await writeJournal(journal);
      return { ...result, adoptionId: journal.id };
    } catch (error) {
      if (!adopted) {
        const detail = await options.workflow.query({ projectId: item.projectId, op: "production", productionId: item.productionId });
        adopted = detail.production.gameCandidates?.some((candidate) => candidate.id === item.id && candidate.status === "adopted" && candidate.adoptionId === journal.id) ?? false;
      }
      if (adopted)
        throw error;
      journal.status = "reverting";
      await writeJournal(journal);
      await apply(root(item.projectId), journal.patches, true);
      journal.status = "undone";
      await writeJournal(journal);
      throw error;
    }
  }
  async function inspect(input) {
    const item = await candidate(input);
    await checkSnapshot(item);
    const targetRevision = item.kind === "story" || item.kind === "documents" || item.kind === "deck" ? await storyTargetBaseRevision(root(item.projectId), item.baseDependencies ?? []) : await cardTargetBaseRevision(root(item.projectId), item.cardId, candidateAssetPaths(item), candidateCardKind(item));
    const journal = item.adoptionId ? await json2(journalPath({ projectId: item.projectId, id: item.adoptionId }), null) : null;
    const patches = item.status === "adopted" && journal?.candidateId === item.id ? journal.patches : await merge(item, false);
    let remaining = 128 * 1024;
    const files = patches.map((patch) => {
      const before = decode2(patch.before), after = decode2(patch.after);
      const text = /\.(?:json|md|markdown|txt)$/iu.test(patch.path);
      const truncated = text && (before?.length || 0) + (after?.length || 0) > Math.min(24 * 1024, remaining);
      if (text && !truncated)
        remaining -= (before?.length || 0) + (after?.length || 0);
      return {
        path: patch.path,
        changed: !same(before, after),
        binary: !text,
        truncated,
        beforeRevision: before ? hash3(before) : null,
        afterRevision: after ? hash3(after) : null,
        beforeBytes: before?.length || 0,
        afterBytes: after?.length || 0,
        ...text && !truncated ? { before: before?.toString("utf8") ?? null, after: after?.toString("utf8") ?? null } : {}
      };
    });
    return {
      candidateId: item.id,
      candidateHash: item.candidateHash,
      commit: item.commit,
      status: item.status,
      targetBaseRevision: item.targetBaseRevision,
      currentBaseRevision: targetRevision,
      baseCurrent: targetRevision === item.targetBaseRevision,
      comparison: item.status === "adopted" && journal ? "adoption-record" : "current-to-candidate",
      files
    };
  }
  async function undo(input) {
    const item = await candidate(input);
    if (item.status === "undone")
      return { candidate: item, reused: true };
    if (item.status !== "adopted" || !item.adoptionId || item.adoptionId !== input.adoptionId)
      throw Error("采用记录不匹配");
    const old = await json2(journalPath({ projectId: item.projectId, id: item.adoptionId }), null);
    if (!old || old.status !== "complete" || old.candidateId !== item.id)
      throw Error("找不到完整采用日志");
    const journal = { id: randomUUID10(), candidateId: item.id, projectId: item.projectId, productionId: item.productionId, status: "undoing", createdAt: new Date().toISOString(), patches: await merge(item, true, old) };
    await writeJournal(journal);
    await apply(root(item.projectId), journal.patches);
    const result = await options.workflow.command("recordGameAdoption", { projectId: item.projectId, productionId: item.productionId, candidateId: item.id, status: "undone" });
    journal.status = "undone";
    await writeJournal(journal);
    return result;
  }
  async function recover() {
    for (const projectId of roots.keys()) {
      const dir = join10(journals, projectId);
      const files = await readdir5(dir).catch((error) => {
        if (error.code === "ENOENT")
          return [];
        throw error;
      });
      for (const name of files.filter((name) => name.endsWith(".json"))) {
        const journal = await json2(join10(dir, name), null);
        if (!journal || !["applying", "applied", "reverting", "undoing"].includes(journal.status))
          continue;
        const detail = await options.workflow.query({ projectId, op: "production", productionId: journal.productionId });
        const item = detail.production.gameCandidates?.find((candidate) => candidate.id === journal.candidateId);
        if (!item)
          throw Error(`采用日志没有对应候选：${journal.id}`);
        if (journal.status === "undoing") {
          await apply(root(projectId), journal.patches);
          if (item.status === "adopted")
            await options.workflow.command("recordGameAdoption", { projectId, productionId: item.productionId, candidateId: item.id, status: "undone" });
          journal.status = "undone";
          await writeJournal(journal);
        } else if (item.status === "adopted" && item.adoptionId === journal.id) {
          journal.status = "complete";
          await writeJournal(journal);
        } else {
          journal.status = "reverting";
          await writeJournal(journal);
          await apply(root(projectId), journal.patches, true);
          journal.status = "undone";
          await writeJournal(journal);
        }
      }
    }
  }
  const snapshotSource = (input) => serial(async () => {
    const item = await candidate(input);
    await checkSnapshot(item);
    return {
      root: item.repo,
      source: { kind: "candidate", productionId: item.productionId, candidateId: item.id, candidateHash: item.candidateHash, commit: item.commit },
      verify: () => serial(async () => {
        await checkSnapshot(item);
      })
    };
  });
  return { snapshotSource, inspect: (input) => serial(() => inspect(input)), confirm: (input) => serial(() => confirm(input)), undo: (input) => serial(() => undo(input)), recover: () => serial(recover), close: async () => {
    await queue;
  } };
}

// plugins/cardgame-content/src/registration.ts
import { createHash as createHash14 } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
async function verifiedCardDraftSource(app, caller) {
  if (caller.kind === "user")
    return { _draftOrigin: "user" };
  if (caller.kind !== "agent" || !caller.noteId || !caller.sessionId)
    return { _draftOrigin: "unknown" };
  try {
    const session = await app.dispatch("session.get", { sessionId: caller.sessionId, noteId: caller.noteId }, caller);
    if (session.id === caller.sessionId && session.noteId === caller.noteId && session.hasMessages === true) {
      return { _draftOrigin: "agent", _draftSource: { kind: "native-session", noteId: caller.noteId, sessionId: caller.sessionId } };
    }
  } catch {}
  return { _draftOrigin: "unknown" };
}
var workflowQueries = new Set(["todos", "todo", "productions", "production", "productionDispatch", "workflowStatus", "gameCandidates", "changes"]);
var contentCommands = new Set(["saveDocument", "moveDocument", "updateCard", "updateAsset", "registerCandidates", "adoptVersion", "compileStory"]);
var formalMutations = new Set(["saveDocument", "moveDocument", "updateCard", "updateAsset", "adoptVersion", "compileStory", "adoptAsset"]);
var internalWorkflowCommands = new Set(["recordGameCandidate", "recordGameAdoption"]);
function requiredGamePreviewChecks(candidate, cardKind) {
  if (candidate.kind === "deck")
    return ["game-shell", "content-catalog", "deck-definition", "deck-composition", ...candidate.deckArtFingerprints ? ["deck-art"] : []];
  if (candidate.kind === "documents")
    return ["game-shell", "content-catalog", "knowledge-documents"];
  if (candidate.kind === "story")
    return [
      "game-shell",
      "content-catalog",
      "story-resource",
      "story-route",
      ...candidate.shopTargets?.length ? ["story-shops"] : [],
      ...candidate.recipeIds?.length ? ["story-recipes"] : [],
      ...candidate.itemUseIds?.length || candidate.itemIconPaths?.length ? ["story-items"] : [],
      ...candidate.questIds?.length ? ["story-quests"] : [],
      ...candidate.copyPaths?.length ? ["story-copy"] : [],
      ...candidate.portraitPaths?.length ? ["story-portraits"] : [],
      ...candidate.itemIconPaths?.length ? ["story-item-icons"] : []
    ];
  return [
    "game-shell",
    "content-catalog",
    "card-definition",
    "card-themes",
    cardKind === "pill" || cardKind === "skill" ? "playable-loadout" : "playable-deck"
  ];
}
function candidatePreviewOptions(candidate) {
  const cardKind = candidate.kind === "story" || candidate.kind === "documents" || candidate.kind === "deck" ? undefined : candidateCardKind(candidate);
  return {
    projectId: candidate.projectId,
    ...candidate.kind !== "documents" ? { cardId: candidate.cardId } : {},
    candidateHash: candidate.candidateHash,
    ...cardKind && cardKind !== "unit" ? { cardKind } : {},
    ...candidate.kind === "deck" ? { candidateKind: "deck", deckPath: candidate.deckPath, deckCardIds: candidate.deckCardIds, placeholderCardIds: candidate.placeholderCardIds, ...candidate.deckArtFingerprints ? { deckArtFingerprints: candidate.deckArtFingerprints } : {} } : {},
    ...candidate.kind === "documents" ? { candidateKind: "documents", documentRevisions: candidate.dependencies } : {},
    ...candidate.kind === "story" ? {
      storyId: candidate.targetId,
      ...candidate.entryHubId && candidate.entryActionId ? { entryHubId: candidate.entryHubId, entryActionId: candidate.entryActionId } : {},
      ...candidate.shopTargets?.length ? { shopTargets: candidate.shopTargets } : {},
      ...candidate.recipeIds?.length ? { recipeIds: candidate.recipeIds } : {},
      ...candidate.itemUseIds?.length ? { itemUseIds: candidate.itemUseIds } : {},
      ...candidate.questIds?.length ? { questIds: candidate.questIds } : {},
      ...candidate.copyPaths?.length ? { copyPaths: candidate.copyPaths } : {},
      ...candidate.portraitPaths?.length ? { portraitPaths: candidate.portraitPaths } : {},
      ...candidate.itemIconPaths?.length ? { itemIconPaths: candidate.itemIconPaths } : {}
    } : {}
  };
}
async function createCardgameProvider(host, media, packageRoot, bunPath, projects, resolvePreviewNote) {
  const options = { dataRoot: resolve6(host.dataRoot, "plugins/cardgame-content"), projects };
  const content = await createContentService(options);
  const battleExecution = await createBattleExecutionService({ ...options, packageRoot, subprocess: host.runtime.subprocess, bunPath, resolveCandidate: async (projectId, ref) => {
    const detail = await workflows.query({ projectId, op: "production", productionId: ref.productionId });
    const candidate = detail.production.gameCandidates?.find((item) => item.id === ref.candidateId);
    if (!candidate || candidate.candidateHash !== ref.candidateHash)
      throw Error("所选候选身份已变化，请刷新后重新选择");
    return gameAdoptions.snapshotSource({
      projectId,
      productionId: ref.productionId,
      candidateId: ref.candidateId,
      candidateHash: ref.candidateHash,
      featureId: candidate.featureId,
      targetBaseRevision: candidate.targetBaseRevision,
      validationManifest: candidate.validationManifest
    });
  } });
  const storyExecution = createStoryExecutionService({ ...options, packageRoot, content, subprocess: host.runtime.subprocess, bunPath });
  const workflows = await Promise.resolve().then(() => createWorkflowService(options)).catch(async (error) => {
    await Promise.allSettled([battleExecution.close(), storyExecution.close(), content.close()]);
    throw error;
  });
  const productionEvents = createProductionEvents(workflows, content);
  const pinnedReferences = createPinnedReferenceService(host.app.core, (input) => input.op === "battleComparison" ? battleExecution.compare(String(input.projectId), input.before, input.after) : input.op === "production" ? workflows.query(input) : content.query(input));
  const previewNote = async (candidate) => {
    const noteId = await resolvePreviewNote(candidate.projectId);
    const config = await host.app.core.readRecord("states", `${noteId}:config`);
    if (config?.value?.projectId !== candidate.projectId)
      throw Error("试玩便笺绑定了另一项目");
    return noteId;
  };
  const registerPreview = async (candidate) => {
    const noteId = await previewNote(candidate);
    return host.app.requireEngine().invoke(noteId, "receive", {
      key: candidate.id,
      title: candidate.kind === "deck" ? `牌组 ${candidate.targetId}` : candidate.kind === "story" ? `剧情 ${candidate.targetId}` : candidate.kind === "documents" ? `资料 ${candidate.targetId}` : `卡牌 ${candidate.cardId}`,
      featureId: candidate.featureId,
      adapter: join11(candidate.repo, "knowledge/tools/preview/preview.config.mjs"),
      repos: { game: { repo: candidate.repo, commit: candidate.commit } },
      options: candidatePreviewOptions(candidate),
      start: true
    }, { kind: "action", noteId });
  };
  const gameCandidates = createGameCandidateService({ ...options, content, workflow: workflows, registerPreview, deckPreviewAdapter: resolve6(packageRoot, "plugins/cardgame-content/preview/preview.config.mjs") });
  const formalPreview = createFormalPreviewService({ ...options, register: async (record, repo) => {
    const noteId = await previewNote(record);
    const note = await host.app.note(noteId);
    if (!host.runtime.previews?.command)
      throw Error("宿主没有提供受管预览命令");
    return host.runtime.previews.command("receive", {
      key: record.key,
      title: `正式内容快照 · ${record.createdAt}`,
      adapter: resolve6(packageRoot, "plugins/cardgame-content/preview/preview.config.mjs"),
      repos: { game: { repo, commit: record.commit } },
      options: { projectId: record.projectId, profile: "formal-snapshot", formalPreview: true, snapshotRevision: record.snapshotRevision, snapshotCreatedAt: record.createdAt },
      start: true
    }, { access: { noteId, version: note.value.codeVersion ?? "", caller: { kind: "system" } } });
  } });
  const previewEvidence = async (candidate) => {
    const noteId = await previewNote(candidate);
    const note = await host.app.note(noteId);
    const state = await host.app.core.readRecord("states", note.value.stateRef);
    const entry = state?.value?.candidates?.find((item) => item.key === candidate.id);
    const expectedAdapter = join11(candidate.repo, "knowledge/tools/preview/preview.config.mjs");
    const expectedRepos = { game: { repo: candidate.repo, commit: candidate.commit } };
    const cardKind = candidate.kind === "story" || candidate.kind === "documents" || candidate.kind === "deck" ? undefined : candidateCardKind(candidate);
    const expectedOptions = candidatePreviewOptions(candidate);
    if (entry?.adapter !== expectedAdapter || !isDeepStrictEqual(entry.repos, expectedRepos) || !isDeepStrictEqual(entry.options, expectedOptions))
      throw Error("请先在试玩便笺完成这个确切候选的运行与验证");
    const fingerprint = createHash14("sha256").update(JSON.stringify({ adapter: entry.adapter, repos: entry.repos, options: entry.options })).digest("hex").slice(0, 16);
    const status = entry.status?.web;
    if (status?.phase !== "ready" || status.source !== fingerprint || status.verified?.ok !== true)
      throw Error("请先在试玩便笺完成这个确切候选的运行与验证");
    const passed = new Set((status.verified.checks ?? []).filter((check) => check.ok).map((check) => check.name));
    const required = requiredGamePreviewChecks(candidate, cardKind);
    if (!required.every((name) => passed.has(name)))
      throw Error("游戏候选的验证项目不完整");
  };
  const gameAdoptions = createGameAdoptionService({ ...options, workflow: workflows, previewEvidence });
  try {
    await gameAdoptions.recover();
  } catch (error) {
    await Promise.allSettled([battleExecution.close(), storyExecution.close(), gameAdoptions.close(), gameCandidates.close(), content.close(), workflows.close()]);
    throw error;
  }
  const pipeline = createCardPipeline(content, workflows, Object.fromEntries(projects.filter((project) => project.cardFaceFont).map((project) => [project.id, project.cardFaceFont])), gameCandidates, { imageGenerator: createCodexImageGenerator() });
  const projectIds = new Set(projects.map((project) => project.id));
  const featureProgressNote = async (noteId) => {
    if (!noteId)
      return false;
    const note = await host.app.note(noteId);
    return Boolean(note.value.actions?.includes("confirmGameCandidate") && note.value.actions?.includes("undoGameCandidate"));
  };
  const assertProject = async (input, noteId, featureProgress = false) => {
    if (typeof input.projectId !== "string" || !projectIds.has(input.projectId))
      throw Error("项目尚未登记，请先在内容库选择 CardGame 项目目录");
    if (noteId) {
      const config = await host.app.core.readRecord("states", `${noteId}:config`);
      if (config?.value?.projectId !== input.projectId && !(featureProgress && await featureProgressNote(noteId)))
        throw Error("便笺尚未绑定这个项目");
    }
  };
  let removeMedia = () => {};
  let closing;
  const close = () => closing ??= (async () => {
    const failures = [];
    try {
      removeMedia();
    } catch (error) {
      failures.push(error);
    }
    for (const phase of [[() => formalPreview.close(), () => battleExecution.close(), () => storyExecution.close(), () => pipeline.close()], [() => gameCandidates.close(), () => gameAdoptions.close()], [() => content.close(), () => workflows.close()]]) {
      const results = await Promise.allSettled(phase.map((dispose) => Promise.resolve().then(dispose)));
      for (const result of results)
        if (result.status === "rejected")
          failures.push(result.reason);
    }
    if (failures.length)
      throw new AggregateError(failures, "CardGame content shutdown failed");
  })();
  try {
    removeMedia = media.register("cardgame-content", async (input) => {
      await assertProject(input);
      const file = await content.resolveMedia(input);
      return { ...file, path: file.absolutePath ?? file.path };
    });
    return {
      beforeNativeTool: (input) => cardgameNativeWriteDenial(host.app.core, input.sessionId, input.name, input.parentSessionId),
      noteContext: async (note) => {
        const lines = await cardgameSelectionLines(host, note);
        const config = await host.app.core.readRecord("states", `${note.id}:config`);
        const projectId = config?.value.projectId;
        if (!projectId || !projectIds.has(projectId))
          return lines;
        try {
          return [...lines, ...pinnedReferenceLines((await pinnedReferences.query(projectId)).items)];
        } catch {
          return [...lines, "固定引用当前无法核对；不要把旧上下文当成当前内容。"];
        }
      },
      resources: { query: {
        version: "1",
        async load(value, context) {
          const raw = value;
          const contract = Object.values(contentQueries).find((query) => query.resource.input.shape.op.value === raw.op);
          const { allowLegacyReconciliation: _legacy, ...publicInput } = raw;
          const input = contract ? await contract.resource.input.parseAsync(publicInput) : raw;
          const result = await (async () => {
            if (input.op === "previewReferenceTarget") {
              await assertProject(input, context.scope.noteId);
              const page = await workflows.query({ projectId: input.projectId, op: "gameCandidates" });
              const candidate = page.items.find((item) => item.id === input.key && item.commit === input.commit);
              if (!candidate)
                throw Error("当前预览不是已登记的游戏候选，或提交已变化");
              return await pinnedReferences.describe(String(input.projectId), { kind: "candidate", id: candidate.id, context: { productionId: candidate.productionId, commit: candidate.commit } });
            }
            if (input.op === "pinnedReferences" || input.op === "pinnedReferenceTarget") {
              await assertProject(input, context.scope.noteId);
              return await (input.op === "pinnedReferenceTarget" ? pinnedReferences.describe(String(input.projectId), input) : pinnedReferences.query(String(input.projectId)));
            }
            if (input.op === "formalPreview") {
              await assertProject(input, context.scope.noteId);
              return await formalPreview.query(String(input.projectId));
            }
            if (input.op === "featureChanges") {
              if (!await featureProgressNote(context.scope.noteId))
                throw Error("只有功能进展可读取游戏改动");
              await assertProject(input, context.scope.noteId, true);
              const page = await workflows.query({ ...input, op: "changes" });
              return { ...page, items: await Promise.all(page.items.map(async (change) => {
                const { production } = await workflows.query({ projectId: change.projectId, op: "production", id: change.productionId });
                const candidates = await Promise.all(change.candidates.map(async (candidate) => ({
                  ...candidate,
                  previewVerified: candidate.current && candidate.status === "candidate" ? await previewEvidence(production.gameCandidates.find((item) => item.id === candidate.id)).then(() => true, () => false) : false
                })));
                return { ...change, candidates, stage: change.stage === "checking" && candidates.some((candidate) => candidate.current && candidate.status === "candidate" && candidate.previewVerified) ? "review" : change.stage };
              })) };
            }
            if (input.op === "gameCandidateDiff") {
              await assertProject(input, context.scope.noteId);
              const detail = await workflows.query({ projectId: input.projectId, op: "production", productionId: input.productionId });
              const candidate = detail.production.gameCandidates?.find((item) => item.id === input.candidateId);
              if (!candidate)
                throw Error("找不到制作单对应的候选");
              return await gameAdoptions.inspect({
                projectId: candidate.projectId,
                productionId: candidate.productionId,
                candidateId: candidate.id,
                featureId: candidate.featureId,
                candidateHash: candidate.candidateHash,
                targetBaseRevision: candidate.targetBaseRevision,
                validationManifest: candidate.validationManifest
              });
            }
            if (input.op === "featureCandidates") {
              if (!await featureProgressNote(context.scope.noteId))
                throw Error("只有功能进展可读取游戏候选");
              const groups = await Promise.all(projects.map(async (project) => workflows.query({ projectId: project.id, op: "gameCandidates" })));
              const items = groups.flatMap((group) => group.items);
              return { items: await Promise.all(items.map(async (candidate) => {
                const { repo: _repo, dependencies: _dependencies, ...publicCandidate } = candidate;
                const previewVerified = await previewEvidence(candidate).then(() => true, () => false);
                return { ...publicCandidate, previewVerified };
              })) };
            }
            await assertProject(input, context.scope.noteId);
            if (input.op === "battleExperiments")
              return await battleExecution.query(String(input.projectId));
            if (input.op === "battleSources") {
              const page = await workflows.query({ projectId: input.projectId, op: "gameCandidates" });
              return { items: page.items.map((item) => ({
                productionId: item.productionId,
                candidateId: item.id,
                candidateHash: item.candidateHash,
                commit: item.commit,
                kind: item.kind ?? "card",
                targetId: item.targetId ?? item.cardId ?? item.id,
                status: item.status
              })) };
            }
            if (input.op === "battleComparison")
              return await battleExecution.compare(String(input.projectId), input.before, input.after);
            if (input.op === "storyExecutionReport")
              return await storyExecution.query(String(input.projectId), String(input.id));
            if (input.op === "cardBatch" || input.op === "cardFaceThemes")
              return JSON.parse(JSON.stringify(await pipeline.query(input)));
            if (input.op === "media" && input.variant !== "waveform") {
              const file = await content.resolveMedia(input);
              const { path: _path, absolutePath: _absolutePath, ...metadata } = file;
              return { ...metadata, url: media.issue("cardgame-content", input) };
            }
            if (workflowQueries.has(String(input.op))) {
              return await workflows.query(input, { execution: async (binding) => {
                if (!binding.deskNoteId || !binding.delegationId)
                  return null;
                await assertProject(input, binding.deskNoteId);
                const desk = await host.app.note(binding.deskNoteId);
                const task = await host.app.core.readProjected("states", desk.value.stateRef, (state) => {
                  const item = state?.delegations?.[binding.delegationId];
                  return item ? { id: item.id, status: item.status, updatedAt: item.updatedAt, outcome: item.outcome ?? null, delivery: item.delivery ?? null } : null;
                });
                return task?.value ?? null;
              } });
            }
            return await content.query(input);
          })();
          if (contract)
            await contract.output.parseAsync(result);
          return result;
        },
        async subscribe(input, invalidate) {
          if (["pinnedReferences", "pinnedReferenceTarget", "previewReferenceTarget"].includes(String(input.op))) {
            const releases = [pinnedReferences.subscribe(String(input.projectId), invalidate), content.subscribe(() => invalidate()), workflows.subscribe(() => invalidate()), battleExecution.subscribe(invalidate)];
            return () => {
              for (const release of releases)
                release();
            };
          }
          if (input.op === "battleSources")
            return workflows.subscribe(() => invalidate());
          if (["battleExperiments", "battleComparison"].includes(String(input.op)))
            return battleExecution.subscribe(invalidate);
          if (input.op === "storyExecutionReport") {
            const release = storyExecution.subscribe(invalidate), releaseContent = content.subscribe(() => invalidate());
            return () => {
              release();
              releaseContent();
            };
          }
          if (input.op === "gameCandidateDiff") {
            const releaseWorkflow = workflows.subscribe(() => invalidate());
            const releaseContent = content.subscribe(() => invalidate());
            return () => {
              releaseWorkflow();
              releaseContent();
            };
          }
          const store = workflowQueries.has(String(input.op)) || input.op === "cardBatch" || input.op === "featureCandidates" || input.op === "featureChanges" ? workflows : content;
          const release = store.subscribe(() => invalidate());
          if (!["featureCandidates", "featureChanges"].includes(String(input.op)))
            return release;
          try {
            const projectId = String(input.projectId ?? projects[0]?.id ?? "");
            if (!projectIds.has(projectId))
              return release;
            const preview = await host.app.note(await resolvePreviewNote(projectId));
            const releasePreview = host.app.core.subscribe("states", preview.value.stateRef, () => invalidate());
            return () => {
              releasePreview();
              release();
            };
          } catch (error) {
            release();
            throw error;
          }
        }
      } },
      async invoke(method, rawInput, caller) {
        const contract = ["createCardBatch", "saveCardDraft", "createTodo"].includes(method) ? undefined : Object.values(contentActions).find((action) => action.method.method === method);
        const { allowLegacyReconciliation: _legacy, ...publicInput } = rawInput;
        const input = contract ? await contract.method.input.parseAsync(publicInput) : rawInput;
        const result = await (async () => {
          await assertProject(input, caller.noteId, method === "confirmGameCandidate" || method === "undoGameCandidate");
          if (method === "prepareProductionEvent")
            return productionEvents.prepare(input);
          if (method === "productionResult" || method === "receiveResult")
            return productionEvents.receiveResult(input);
          if (method === "recordCandidates")
            return productionEvents.recordCandidates(input);
          if (method === "recordAdoption")
            return productionEvents.recordAdoption(input);
          if (method === "pinReference" || method === "removePinnedReference") {
            if (!caller.noteId || caller.dryRun || caller.replay)
              throw Error("请从项目便笺操作固定引用");
            return method === "pinReference" ? pinnedReferences.pin(String(input.projectId), input) : pinnedReferences.remove(String(input.projectId), input.key);
          }
          if (method === "prepareFormalPreview") {
            if (!caller.noteId || caller.dryRun || caller.replay)
              throw Error("请从试玩便笺明确准备正式内容快照");
            if (caller.noteId !== await previewNote({ projectId: String(input.projectId) }))
              throw Error("只有已登记的试玩便笺可准备正式内容快照");
            return formalPreview.prepare(String(input.projectId), input.fresh === true);
          }
          if (method === "prepareBattleExperiment" || method === "stopBattleExperiment") {
            if (!caller.noteId || caller.dryRun || caller.replay)
              throw Error("自动对局只能从正常运行的便笺显式启动或停止");
            if (method === "stopBattleExperiment") {
              await battleExecution.stop(String(input.projectId));
              return { stopped: true };
            }
            const result = await battleExecution.start(String(input.projectId), input.fresh === true, input.candidate);
            return { id: result.id, url: result.url, snapshotId: result.snapshotId };
          }
          if (method === "analyzeStoryPaths") {
            if (!caller.noteId)
              throw Error("请从剧情便笺启动检查");
            const note = await host.app.note(caller.noteId);
            return storyExecution.run(String(input.projectId), String(input.id), String(input.expectedRevision ?? ""), { noteId: caller.noteId, version: note.value.codeVersion ?? "", caller: { ...caller, kind: caller.kind === "action" ? "system" : caller.kind } });
          }
          if (formalMutations.has(method) && !(method === "compileStory" && input.dryRun === true))
            throw Error("正式项目改动需先建立可试玩候选，再到功能进展确认采用");
          if (internalWorkflowCommands.has(method))
            throw Error("候选与采用记录只能由制作及采用服务写入");
          if (method === "confirmGameCandidate" || method === "undoGameCandidate") {
            if (caller.kind !== "user" || !await featureProgressNote(caller.noteId))
              throw Error("只有功能进展中的用户操作可以确认或撤销");
            return method === "confirmGameCandidate" ? gameAdoptions.confirm(input) : gameAdoptions.undo(input);
          }
          if (method === "stageStoryCandidate" || method === "stageDocumentsCandidate") {
            if (!caller.noteId)
              throw Error("资料或剧情候选需要知识库便笺来源");
            const config = await host.app.core.readRecord("states", `${caller.noteId}:config`);
            if (config?.value?.mode !== "knowledge")
              throw Error("只有知识库便笺可以建立资料或剧情候选");
            return method === "stageStoryCandidate" ? gameCandidates.stageStory(input) : gameCandidates.stageDocuments(input);
          }
          assertDeckWriteAccess(method, input, caller.kind);
          if (CARD_PIPELINE_COMMANDS.has(method)) {
            const source = method === "setCardDrafts" || method === "createCardBatch" ? await verifiedCardDraftSource(host.app, caller) : { _draftOrigin: "unknown" };
            return pipeline.command(method, { ...input, _draftSource: undefined, ...source });
          }
          if (method === "requestPreviewRepair") {
            if (caller.kind !== "user" || !caller.noteId)
              throw Error("修复需要执行台中的用户操作");
            const desk = await host.app.note(caller.noteId);
            const state = await host.app.core.readRecord("states", desk.value.stateRef);
            const task = state?.value?.delegations?.[String(input.delegationId)];
            const feedback = task?.feedback?.find((item) => item.id === input.feedbackId && item.candidateKey && item.status === "failed");
            if (!feedback)
              throw Error("找不到这个任务的预览失败记录");
            const relations = (await host.app.skillConnections.list(desk.value.desktopId)).filter((relation) => relation.enabled && !relation.archived && relation.nodeIds.includes(caller.noteId) && relation.nodes.some((node) => node.noteId === caller.noteId && node.available.actions.some((action) => action.name === "acceptPreviewFeedback")) && relation.nodes.some((node) => node.noteId !== caller.noteId && node.available.actions.some((action) => action.name === "receive") && node.available.queries.some((query) => query.name === "candidate")));
            const previewIds = [...new Set(relations.flatMap((relation) => relation.nodes.filter((node) => node.noteId !== caller.noteId && node.available.actions.some((action) => action.name === "receive")).map((node) => node.noteId)))];
            const previewId = typeof task.preview?.noteId === "string" ? task.preview.noteId : previewIds.length === 1 ? previewIds[0] : undefined;
            if (!previewId || !previewIds.includes(previewId))
              throw Error("候选预览 Skill 连线不可用或来源不明确");
            return host.app.requireEngine().invoke(previewId, "requestRepair", {
              key: feedback.candidateKey,
              revision: feedback.revision,
              runId: feedback.runId,
              surface: feedback.surface
            }, { kind: "user", noteId: caller.noteId });
          }
          return contentCommands.has(method) ? content.command(method, input) : workflows.command(method, input);
        })();
        if (contract) {
          try {
            await contract.output.parseAsync(result);
          } catch (cause) {
            throw new Error(`CardGame ${method} returned invalid output after invocation; inspect effects before retrying`, { cause });
          }
        }
        return result;
      },
      close
    };
  } catch (cause) {
    try {
      await close();
    } catch (cleanupError) {
      throw new AggregateError([cause, cleanupError], "CardGame extension activation failed");
    }
    throw cause;
  }
}

// plugin.ts
var name = "cardgame-local-content";
var inject = ["worka"];
async function apply(ctx, config = {}) {
  const host = ctx.worka;
  if (!host.media)
    throw Error("CardGame 需要宿主媒体服务");
  const here = dirname7(fileURLToPath(import.meta.url));
  const packageRoot = basename2(here) === "dist" ? resolve7(here, "..") : here;
  const manager = createProjectBindingManager({
    host,
    media: host.media,
    packageRoot,
    bunPath: config.bunPath ?? "bun",
    createProvider: createCardgameProvider,
    isNoteController,
    beforeNativeTool: (input) => cardgameNativeWriteDenial(host.app.core, input.sessionId, input.name, input.parentSessionId)
  });
  let unregister;
  try {
    const dispose = await host.register("cardgame-content", manager);
    unregister = dispose;
    ctx.effect(() => dispose, "CardGame 桌面项目扩展");
  } catch (error) {
    try {
      if (unregister)
        await unregister();
      else
        await manager.close();
    } catch (cleanupError) {
      throw new AggregateError([error, cleanupError], "CardGame 扩展注册失败");
    }
    throw error;
  }
}
export {
  apply,
  inject,
  name
};
