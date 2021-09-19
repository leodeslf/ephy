var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// .svelte-kit/vercel/entry.js
__export(exports, {
  default: () => entry_default
});

// node_modules/@sveltejs/kit/dist/install-fetch.js
var import_http = __toModule(require("http"));
var import_https = __toModule(require("https"));
var import_zlib = __toModule(require("zlib"));
var import_stream = __toModule(require("stream"));
var import_util = __toModule(require("util"));
var import_crypto = __toModule(require("crypto"));
var import_url = __toModule(require("url"));
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
var src = dataUriToBuffer;
var dataUriToBuffer$1 = src;
var { Readable } = import_stream.default;
var wm = new WeakMap();
async function* read(parts) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else {
      yield part;
    }
  }
}
var Blob = class {
  constructor(blobParts = [], options2 = {}) {
    let size = 0;
    const parts = blobParts.map((element) => {
      let buffer;
      if (element instanceof Buffer) {
        buffer = element;
      } else if (ArrayBuffer.isView(element)) {
        buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
      } else if (element instanceof ArrayBuffer) {
        buffer = Buffer.from(element);
      } else if (element instanceof Blob) {
        buffer = element;
      } else {
        buffer = Buffer.from(typeof element === "string" ? element : String(element));
      }
      size += buffer.length || buffer.size || 0;
      return buffer;
    });
    const type = options2.type === void 0 ? "" : String(options2.type).toLowerCase();
    wm.set(this, {
      type: /[^\u0020-\u007E]/.test(type) ? "" : type,
      size,
      parts
    });
  }
  get size() {
    return wm.get(this).size;
  }
  get type() {
    return wm.get(this).type;
  }
  async text() {
    return Buffer.from(await this.arrayBuffer()).toString();
  }
  async arrayBuffer() {
    const data = new Uint8Array(this.size);
    let offset = 0;
    for await (const chunk of this.stream()) {
      data.set(chunk, offset);
      offset += chunk.length;
    }
    return data.buffer;
  }
  stream() {
    return Readable.from(read(wm.get(this).parts));
  }
  slice(start = 0, end = this.size, type = "") {
    const { size } = this;
    let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
    let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
    const span = Math.max(relativeEnd - relativeStart, 0);
    const parts = wm.get(this).parts.values();
    const blobParts = [];
    let added = 0;
    for (const part of parts) {
      const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
      if (relativeStart && size2 <= relativeStart) {
        relativeStart -= size2;
        relativeEnd -= size2;
      } else {
        const chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
        blobParts.push(chunk);
        added += ArrayBuffer.isView(chunk) ? chunk.byteLength : chunk.size;
        relativeStart = 0;
        if (added >= span) {
          break;
        }
      }
    }
    const blob = new Blob([], { type: String(type).toLowerCase() });
    Object.assign(wm.get(blob), { size: span, parts: blobParts });
    return blob;
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
  static [Symbol.hasInstance](object) {
    return object && typeof object === "object" && typeof object.stream === "function" && object.stream.length === 0 && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
  }
};
Object.defineProperties(Blob.prototype, {
  size: { enumerable: true },
  type: { enumerable: true },
  slice: { enumerable: true }
});
var fetchBlob = Blob;
var Blob$1 = fetchBlob;
var FetchBaseError = class extends Error {
  constructor(message, type) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.type = type;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
};
var FetchError = class extends FetchBaseError {
  constructor(message, type, systemError) {
    super(message, type);
    if (systemError) {
      this.code = this.errno = systemError.code;
      this.erroredSysCall = systemError.syscall;
    }
  }
};
var NAME = Symbol.toStringTag;
var isURLSearchParameters = (object) => {
  return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
};
var isBlob = (object) => {
  return typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
};
function isFormData(object) {
  return typeof object === "object" && typeof object.append === "function" && typeof object.set === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.delete === "function" && typeof object.keys === "function" && typeof object.values === "function" && typeof object.entries === "function" && typeof object.constructor === "function" && object[NAME] === "FormData";
}
var isAbortSignal = (object) => {
  return typeof object === "object" && object[NAME] === "AbortSignal";
};
var carriage = "\r\n";
var dashes = "-".repeat(2);
var carriageLength = Buffer.byteLength(carriage);
var getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
function getHeader(boundary, name, field) {
  let header = "";
  header += `${dashes}${boundary}${carriage}`;
  header += `Content-Disposition: form-data; name="${name}"`;
  if (isBlob(field)) {
    header += `; filename="${field.name}"${carriage}`;
    header += `Content-Type: ${field.type || "application/octet-stream"}`;
  }
  return `${header}${carriage.repeat(2)}`;
}
var getBoundary = () => (0, import_crypto.randomBytes)(8).toString("hex");
async function* formDataIterator(form, boundary) {
  for (const [name, value] of form) {
    yield getHeader(boundary, name, value);
    if (isBlob(value)) {
      yield* value.stream();
    } else {
      yield value;
    }
    yield carriage;
  }
  yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
  let length = 0;
  for (const [name, value] of form) {
    length += Buffer.byteLength(getHeader(boundary, name, value));
    if (isBlob(value)) {
      length += value.size;
    } else {
      length += Buffer.byteLength(String(value));
    }
    length += carriageLength;
  }
  length += Buffer.byteLength(getFooter(boundary));
  return length;
}
var INTERNALS$2 = Symbol("Body internals");
var Body = class {
  constructor(body, {
    size = 0
  } = {}) {
    let boundary = null;
    if (body === null) {
      body = null;
    } else if (isURLSearchParameters(body)) {
      body = Buffer.from(body.toString());
    } else if (isBlob(body))
      ;
    else if (Buffer.isBuffer(body))
      ;
    else if (import_util.types.isAnyArrayBuffer(body)) {
      body = Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof import_stream.default)
      ;
    else if (isFormData(body)) {
      boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
      body = import_stream.default.Readable.from(formDataIterator(body, boundary));
    } else {
      body = Buffer.from(String(body));
    }
    this[INTERNALS$2] = {
      body,
      boundary,
      disturbed: false,
      error: null
    };
    this.size = size;
    if (body instanceof import_stream.default) {
      body.on("error", (err) => {
        const error2 = err instanceof FetchBaseError ? err : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${err.message}`, "system", err);
        this[INTERNALS$2].error = error2;
      });
    }
  }
  get body() {
    return this[INTERNALS$2].body;
  }
  get bodyUsed() {
    return this[INTERNALS$2].disturbed;
  }
  async arrayBuffer() {
    const { buffer, byteOffset, byteLength } = await consumeBody(this);
    return buffer.slice(byteOffset, byteOffset + byteLength);
  }
  async blob() {
    const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
    const buf = await this.buffer();
    return new Blob$1([buf], {
      type: ct
    });
  }
  async json() {
    const buffer = await consumeBody(this);
    return JSON.parse(buffer.toString());
  }
  async text() {
    const buffer = await consumeBody(this);
    return buffer.toString();
  }
  buffer() {
    return consumeBody(this);
  }
};
Object.defineProperties(Body.prototype, {
  body: { enumerable: true },
  bodyUsed: { enumerable: true },
  arrayBuffer: { enumerable: true },
  blob: { enumerable: true },
  json: { enumerable: true },
  text: { enumerable: true }
});
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  let { body } = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (isBlob(body)) {
    body = body.stream();
  }
  if (Buffer.isBuffer(body)) {
    return body;
  }
  if (!(body instanceof import_stream.default)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const err = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(err);
        throw err;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error2) {
    if (error2 instanceof FetchBaseError) {
      throw error2;
    } else {
      throw new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error2.message}`, "system", error2);
    }
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error2) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error2.message}`, "system", error2);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
var clone = (instance, highWaterMark) => {
  let p1;
  let p2;
  let { body } = instance;
  if (instance.bodyUsed) {
    throw new Error("cannot clone body after it is used");
  }
  if (body instanceof import_stream.default && typeof body.getBoundary !== "function") {
    p1 = new import_stream.PassThrough({ highWaterMark });
    p2 = new import_stream.PassThrough({ highWaterMark });
    body.pipe(p1);
    body.pipe(p2);
    instance[INTERNALS$2].body = p1;
    body = p2;
  }
  return body;
};
var extractContentType = (body, request) => {
  if (body === null) {
    return null;
  }
  if (typeof body === "string") {
    return "text/plain;charset=UTF-8";
  }
  if (isURLSearchParameters(body)) {
    return "application/x-www-form-urlencoded;charset=UTF-8";
  }
  if (isBlob(body)) {
    return body.type || null;
  }
  if (Buffer.isBuffer(body) || import_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
    return null;
  }
  if (body && typeof body.getBoundary === "function") {
    return `multipart/form-data;boundary=${body.getBoundary()}`;
  }
  if (isFormData(body)) {
    return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
  }
  if (body instanceof import_stream.default) {
    return null;
  }
  return "text/plain;charset=UTF-8";
};
var getTotalBytes = (request) => {
  const { body } = request;
  if (body === null) {
    return 0;
  }
  if (isBlob(body)) {
    return body.size;
  }
  if (Buffer.isBuffer(body)) {
    return body.length;
  }
  if (body && typeof body.getLengthSync === "function") {
    return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
  }
  if (isFormData(body)) {
    return getFormDataLength(request[INTERNALS$2].boundary);
  }
  return null;
};
var writeToStream = (dest, { body }) => {
  if (body === null) {
    dest.end();
  } else if (isBlob(body)) {
    body.stream().pipe(dest);
  } else if (Buffer.isBuffer(body)) {
    dest.write(body);
    dest.end();
  } else {
    body.pipe(dest);
  }
};
var validateHeaderName = typeof import_http.default.validateHeaderName === "function" ? import_http.default.validateHeaderName : (name) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
    const err = new TypeError(`Header name must be a valid HTTP token [${name}]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
    throw err;
  }
};
var validateHeaderValue = typeof import_http.default.validateHeaderValue === "function" ? import_http.default.validateHeaderValue : (name, value) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
    const err = new TypeError(`Invalid character in header content ["${name}"]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_CHAR" });
    throw err;
  }
};
var Headers = class extends URLSearchParams {
  constructor(init2) {
    let result = [];
    if (init2 instanceof Headers) {
      const raw = init2.raw();
      for (const [name, values] of Object.entries(raw)) {
        result.push(...values.map((value) => [name, value]));
      }
    } else if (init2 == null)
      ;
    else if (typeof init2 === "object" && !import_util.types.isBoxedPrimitive(init2)) {
      const method = init2[Symbol.iterator];
      if (method == null) {
        result.push(...Object.entries(init2));
      } else {
        if (typeof method !== "function") {
          throw new TypeError("Header pairs must be iterable");
        }
        result = [...init2].map((pair) => {
          if (typeof pair !== "object" || import_util.types.isBoxedPrimitive(pair)) {
            throw new TypeError("Each header pair must be an iterable object");
          }
          return [...pair];
        }).map((pair) => {
          if (pair.length !== 2) {
            throw new TypeError("Each header pair must be a name/value tuple");
          }
          return [...pair];
        });
      }
    } else {
      throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    }
    result = result.length > 0 ? result.map(([name, value]) => {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return [String(name).toLowerCase(), String(value)];
    }) : void 0;
    super(result);
    return new Proxy(this, {
      get(target, p2, receiver) {
        switch (p2) {
          case "append":
          case "set":
            return (name, value) => {
              validateHeaderName(name);
              validateHeaderValue(name, String(value));
              return URLSearchParams.prototype[p2].call(receiver, String(name).toLowerCase(), String(value));
            };
          case "delete":
          case "has":
          case "getAll":
            return (name) => {
              validateHeaderName(name);
              return URLSearchParams.prototype[p2].call(receiver, String(name).toLowerCase());
            };
          case "keys":
            return () => {
              target.sort();
              return new Set(URLSearchParams.prototype.keys.call(target)).keys();
            };
          default:
            return Reflect.get(target, p2, receiver);
        }
      }
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  toString() {
    return Object.prototype.toString.call(this);
  }
  get(name) {
    const values = this.getAll(name);
    if (values.length === 0) {
      return null;
    }
    let value = values.join(", ");
    if (/^content-encoding$/i.test(name)) {
      value = value.toLowerCase();
    }
    return value;
  }
  forEach(callback) {
    for (const name of this.keys()) {
      callback(this.get(name), name);
    }
  }
  *values() {
    for (const name of this.keys()) {
      yield this.get(name);
    }
  }
  *entries() {
    for (const name of this.keys()) {
      yield [name, this.get(name)];
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  raw() {
    return [...this.keys()].reduce((result, key) => {
      result[key] = this.getAll(key);
      return result;
    }, {});
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((result, key) => {
      const values = this.getAll(key);
      if (key === "host") {
        result[key] = values[0];
      } else {
        result[key] = values.length > 1 ? values : values[0];
      }
      return result;
    }, {});
  }
};
Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
  result[property] = { enumerable: true };
  return result;
}, {}));
function fromRawHeaders(headers = []) {
  return new Headers(headers.reduce((result, value, index2, array) => {
    if (index2 % 2 === 0) {
      result.push(array.slice(index2, index2 + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
var redirectStatus = new Set([301, 302, 303, 307, 308]);
var isRedirect = (code) => {
  return redirectStatus.has(code);
};
var INTERNALS$1 = Symbol("Response internals");
var Response = class extends Body {
  constructor(body = null, options2 = {}) {
    super(body, options2);
    const status = options2.status || 200;
    const headers = new Headers(options2.headers);
    if (body !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(body);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    this[INTERNALS$1] = {
      url: options2.url,
      status,
      statusText: options2.statusText || "",
      headers,
      counter: options2.counter,
      highWaterMark: options2.highWaterMark
    };
  }
  get url() {
    return this[INTERNALS$1].url || "";
  }
  get status() {
    return this[INTERNALS$1].status;
  }
  get ok() {
    return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
  }
  get redirected() {
    return this[INTERNALS$1].counter > 0;
  }
  get statusText() {
    return this[INTERNALS$1].statusText;
  }
  get headers() {
    return this[INTERNALS$1].headers;
  }
  get highWaterMark() {
    return this[INTERNALS$1].highWaterMark;
  }
  clone() {
    return new Response(clone(this, this.highWaterMark), {
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected,
      size: this.size
    });
  }
  static redirect(url, status = 302) {
    if (!isRedirect(status)) {
      throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    }
    return new Response(null, {
      headers: {
        location: new URL(url).toString()
      },
      status
    });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
};
Object.defineProperties(Response.prototype, {
  url: { enumerable: true },
  status: { enumerable: true },
  ok: { enumerable: true },
  redirected: { enumerable: true },
  statusText: { enumerable: true },
  headers: { enumerable: true },
  clone: { enumerable: true }
});
var getSearch = (parsedURL) => {
  if (parsedURL.search) {
    return parsedURL.search;
  }
  const lastOffset = parsedURL.href.length - 1;
  const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
  return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
};
var INTERNALS = Symbol("Request internals");
var isRequest = (object) => {
  return typeof object === "object" && typeof object[INTERNALS] === "object";
};
var Request = class extends Body {
  constructor(input, init2 = {}) {
    let parsedURL;
    if (isRequest(input)) {
      parsedURL = new URL(input.url);
    } else {
      parsedURL = new URL(input);
      input = {};
    }
    let method = init2.method || input.method || "GET";
    method = method.toUpperCase();
    if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
      throw new TypeError("Request with GET/HEAD method cannot have body");
    }
    const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
    super(inputBody, {
      size: init2.size || input.size || 0
    });
    const headers = new Headers(init2.headers || input.headers || {});
    if (inputBody !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(inputBody, this);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    let signal = isRequest(input) ? input.signal : null;
    if ("signal" in init2) {
      signal = init2.signal;
    }
    if (signal !== null && !isAbortSignal(signal)) {
      throw new TypeError("Expected signal to be an instanceof AbortSignal");
    }
    this[INTERNALS] = {
      method,
      redirect: init2.redirect || input.redirect || "follow",
      headers,
      parsedURL,
      signal
    };
    this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
    this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
    this.counter = init2.counter || input.counter || 0;
    this.agent = init2.agent || input.agent;
    this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
    this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
  }
  get method() {
    return this[INTERNALS].method;
  }
  get url() {
    return (0, import_url.format)(this[INTERNALS].parsedURL);
  }
  get headers() {
    return this[INTERNALS].headers;
  }
  get redirect() {
    return this[INTERNALS].redirect;
  }
  get signal() {
    return this[INTERNALS].signal;
  }
  clone() {
    return new Request(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
};
Object.defineProperties(Request.prototype, {
  method: { enumerable: true },
  url: { enumerable: true },
  headers: { enumerable: true },
  redirect: { enumerable: true },
  clone: { enumerable: true },
  signal: { enumerable: true }
});
var getNodeRequestOptions = (request) => {
  const { parsedURL } = request[INTERNALS];
  const headers = new Headers(request[INTERNALS].headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "*/*");
  }
  let contentLengthValue = null;
  if (request.body === null && /^(post|put)$/i.test(request.method)) {
    contentLengthValue = "0";
  }
  if (request.body !== null) {
    const totalBytes = getTotalBytes(request);
    if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
      contentLengthValue = String(totalBytes);
    }
  }
  if (contentLengthValue) {
    headers.set("Content-Length", contentLengthValue);
  }
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", "node-fetch");
  }
  if (request.compress && !headers.has("Accept-Encoding")) {
    headers.set("Accept-Encoding", "gzip,deflate,br");
  }
  let { agent } = request;
  if (typeof agent === "function") {
    agent = agent(parsedURL);
  }
  if (!headers.has("Connection") && !agent) {
    headers.set("Connection", "close");
  }
  const search = getSearch(parsedURL);
  const requestOptions = {
    path: parsedURL.pathname + search,
    pathname: parsedURL.pathname,
    hostname: parsedURL.hostname,
    protocol: parsedURL.protocol,
    port: parsedURL.port,
    hash: parsedURL.hash,
    search: parsedURL.search,
    query: parsedURL.query,
    href: parsedURL.href,
    method: request.method,
    headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
    insecureHTTPParser: request.insecureHTTPParser,
    agent
  };
  return requestOptions;
};
var AbortError = class extends FetchBaseError {
  constructor(message, type = "aborted") {
    super(message, type);
  }
};
var supportedSchemas = new Set(["data:", "http:", "https:"]);
async function fetch(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request(url, options_);
    const options2 = getNodeRequestOptions(request);
    if (!supportedSchemas.has(options2.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${options2.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (options2.protocol === "data:") {
      const data = dataUriToBuffer$1(request.url);
      const response2 = new Response(data, { headers: { "Content-Type": data.typeFull } });
      resolve2(response2);
      return;
    }
    const send = (options2.protocol === "https:" ? import_https.default : import_http.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error2 = new AbortError("The operation was aborted.");
      reject(error2);
      if (request.body && request.body instanceof import_stream.default.Readable) {
        request.body.destroy(error2);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error2);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(options2);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (err) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
      finalize();
    });
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        const locationURL = location === null ? null : new URL(location, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              try {
                headers.set("Location", locationURL);
              } catch (error2) {
                reject(error2);
              }
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              size: request.size
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_stream.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            resolve2(fetch(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
        }
      }
      response_.once("end", () => {
        if (signal) {
          signal.removeEventListener("abort", abortAndFinalize);
        }
      });
      let body = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error2) => {
        reject(error2);
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createGunzip(zlibOptions), (error2) => {
          reject(error2);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error2) => {
          reject(error2);
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflate(), (error2) => {
              reject(error2);
            });
          } else {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflateRaw(), (error2) => {
              reject(error2);
            });
          }
          response = new Response(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createBrotliDecompress(), (error2) => {
          reject(error2);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request);
  });
}

// node_modules/@sveltejs/kit/dist/node.js
function getRawBody(req) {
  return new Promise((fulfil, reject) => {
    const h = req.headers;
    if (!h["content-type"]) {
      return fulfil(null);
    }
    req.on("error", reject);
    const length = Number(h["content-length"]);
    if (isNaN(length) && h["transfer-encoding"] == null) {
      return fulfil(null);
    }
    let data = new Uint8Array(length || 0);
    if (length > 0) {
      let offset = 0;
      req.on("data", (chunk) => {
        const new_len = offset + Buffer.byteLength(chunk);
        if (new_len > length) {
          return reject({
            status: 413,
            reason: 'Exceeded "Content-Length" limit'
          });
        }
        data.set(chunk, offset);
        offset = new_len;
      });
    } else {
      req.on("data", (chunk) => {
        const new_data = new Uint8Array(data.length + chunk.length);
        new_data.set(data, 0);
        new_data.set(chunk, data.length);
        data = new_data;
      });
    }
    req.on("end", () => {
      fulfil(data);
    });
  });
}

// .svelte-kit/output/server/app.js
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _map;
function get_single_valued_header(headers, key) {
  const value = headers[key];
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return void 0;
    }
    if (value.length > 1) {
      throw new Error(`Multiple headers provided for ${key}. Multiple may be provided only for set-cookie`);
    }
    return value[0];
  }
  return value;
}
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key in obj) {
    clone2[key.toLowerCase()] = obj[key];
  }
  return clone2;
}
function error$1(body) {
  return {
    status: 500,
    body,
    headers: {}
  };
}
function is_string(s2) {
  return typeof s2 === "string" || s2 instanceof String;
}
function is_content_type_textual(content_type) {
  if (!content_type)
    return true;
  const [type] = content_type.split(";");
  return type === "text/plain" || type === "application/json" || type === "application/x-www-form-urlencoded" || type === "multipart/form-data";
}
async function render_endpoint(request, route, match) {
  const mod = await route.load();
  const handler = mod[request.method.toLowerCase().replace("delete", "del")];
  if (!handler) {
    return;
  }
  const params = route.params(match);
  const response = await handler({ ...request, params });
  const preface = `Invalid response from route ${request.path}`;
  if (!response) {
    return;
  }
  if (typeof response !== "object") {
    return error$1(`${preface}: expected an object, got ${typeof response}`);
  }
  let { status = 200, body, headers = {} } = response;
  headers = lowercase_keys(headers);
  const type = get_single_valued_header(headers, "content-type");
  const is_type_textual = is_content_type_textual(type);
  if (!is_type_textual && !(body instanceof Uint8Array || is_string(body))) {
    return error$1(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
  }
  let normalized_body;
  if ((typeof body === "object" || typeof body === "undefined") && !(body instanceof Uint8Array) && (!type || type.startsWith("application/json"))) {
    headers = { ...headers, "content-type": "application/json; charset=utf-8" };
    normalized_body = JSON.stringify(typeof body === "undefined" ? {} : body);
  } else {
    normalized_body = body;
  }
  return { status, body: normalized_body, headers };
}
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k2 = _a[0], v = _a[1];
            return "set(" + stringify(k2) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop$1() {
}
function safe_not_equal$1(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
Promise.resolve();
var subscriber_queue$1 = [];
function writable$1(value, start = noop$1) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal$1(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue$1.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue$1.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue$1.length; i += 2) {
            subscriber_queue$1[i][0](subscriber_queue$1[i + 1]);
          }
          subscriber_queue$1.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop$1) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop$1;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
var s$1 = JSON.stringify;
async function render_response({
  branch,
  options: options2,
  $session,
  page_config,
  status,
  error: error2,
  page
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error2) {
    error2.stack = options2.get_stack(error2);
  }
  if (page_config.ssr) {
    branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => css2.add(url));
      if (node.js)
        node.js.forEach((url) => js.add(url));
      if (node.styles)
        node.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable$1($session);
    const props = {
      stores: {
        page: writable$1(null),
        navigating: writable$1(null),
        session
      },
      page,
      components: branch.map(({ node }) => node.module.default)
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js)
    js.clear();
  const links = options2.amp ? styles.size > 0 || rendered.css.code.length > 0 ? `<style amp-custom>${Array.from(styles).concat(rendered.css.code).join("\n")}</style>` : "" : [
    ...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
    ...Array.from(css2).map((dep) => `<link rel="stylesheet" href="${dep}">`)
  ].join("\n		");
  let init2 = "";
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>`;
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : "document.body"},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error3) => {
      throw new Error(`Failed to serialize session data: ${error3.message}`);
    })},
				host: ${page && page.host ? s$1(page.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error2)},
					nodes: [
						${(branch || []).map(({ node }) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page && page.host ? s$1(page.host) : "location.host"}, // TODO this is redundant
						path: ${s$1(page && page.path)},
						query: new URLSearchParams(${page ? s$1(page.query.toString()) : ""}),
						params: ${page && s$1(page.params)}
					}
				}` : "null"}
			});
		<\/script>`;
  }
  if (options2.service_worker) {
    init2 += `<script>
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('${options2.service_worker}');
			}
		<\/script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp ? `<style data-svelte>${Array.from(styles).join("\n")}</style>` : "",
    links,
    init2
  ].join("\n\n		");
  const body = options2.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({ url, body: body2, json }) => {
    let attributes = `type="application/json" data-type="svelte-data" data-url="${url}"`;
    if (body2)
      attributes += ` data-body="${hash(body2)}"`;
    return `<script ${attributes}>${json}<\/script>`;
  }).join("\n\n	")}
		`;
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${is_private ? "private" : "public"}, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers["permissions-policy"] = "interest-cohort=()";
  }
  return {
    status,
    headers,
    body: options2.template({ head, body })
  };
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(err);
    return null;
  }
}
function serialize_error(error2) {
  if (!error2)
    return null;
  let serialized = try_serialize(error2);
  if (!serialized) {
    const { name, message, stack } = error2;
    serialized = try_serialize({ ...error2, name, message, stack });
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return {
        status: status || 500,
        error: new Error()
      };
    }
    const error2 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    if (!(error2 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error2 };
    }
    return { status, error: error2 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  return loaded;
}
var s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page,
  node,
  $session,
  context,
  prerender_enabled,
  is_leaf,
  is_error,
  status,
  error: error2
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  let loaded;
  const page_proxy = new Proxy(page, {
    get: (target, prop, receiver) => {
      if (prop === "query" && prerender_enabled) {
        throw new Error("Cannot access query on a page with prerendering enabled");
      }
      return Reflect.get(target, prop, receiver);
    }
  });
  if (module2.load) {
    const load_input = {
      page: page_proxy,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url;
        if (typeof resource === "string") {
          url = resource;
        } else {
          url = resource.url;
          opts = {
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity,
            ...opts
          };
        }
        const resolved = resolve(request.path, url.split("?")[0]);
        let response;
        const filename = resolved.replace(options2.paths.assets, "").slice(1);
        const filename_html = `${filename}/index.html`;
        const asset = options2.manifest.assets.find((d) => d.file === filename || d.file === filename_html);
        if (asset) {
          response = options2.read ? new Response(options2.read(asset.file), {
            headers: asset.type ? { "content-type": asset.type } : {}
          }) : await fetch(`http://${page.host}/${asset.file}`, opts);
        } else if (resolved.startsWith("/") && !resolved.startsWith("//")) {
          const relative = resolved;
          const headers = {
            ...opts.headers
          };
          if (opts.credentials !== "omit") {
            uses_credentials = true;
            headers.cookie = request.headers.cookie;
            if (!headers.authorization) {
              headers.authorization = request.headers.authorization;
            }
          }
          if (opts.body && typeof opts.body !== "string") {
            throw new Error("Request body must be a string");
          }
          const search = url.includes("?") ? url.slice(url.indexOf("?") + 1) : "";
          const rendered = await respond({
            host: request.host,
            method: opts.method || "GET",
            headers,
            path: relative,
            rawBody: opts.body == null ? null : new TextEncoder().encode(opts.body),
            query: new URLSearchParams(search)
          }, options2, {
            fetched: url,
            initiator: route
          });
          if (rendered) {
            if (state.prerender) {
              state.prerender.dependencies.set(relative, rendered);
            }
            response = new Response(rendered.body, {
              status: rendered.status,
              headers: rendered.headers
            });
          }
        } else {
          if (resolved.startsWith("//")) {
            throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
          }
          if (typeof request.host !== "undefined") {
            const { hostname: fetch_hostname } = new URL(url);
            const [server_hostname] = request.host.split(":");
            if (`.${fetch_hostname}`.endsWith(`.${server_hostname}`) && opts.credentials !== "omit") {
              uses_credentials = true;
              opts.headers = {
                ...opts.headers,
                cookie: request.headers.cookie
              };
            }
          }
          const external_request = new Request(url, opts);
          response = await options2.hooks.externalFetch.call(null, external_request);
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, receiver) {
              async function text() {
                const body = await response2.text();
                const headers = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 !== "etag" && key2 !== "set-cookie")
                    headers[key2] = value;
                }
                if (!opts.body || typeof opts.body === "string") {
                  fetched.push({
                    url,
                    body: opts.body,
                    json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":${escape$1(body)}}`
                  });
                }
                return body;
              }
              if (key === "text") {
                return text;
              }
              if (key === "json") {
                return async () => {
                  return JSON.parse(await text());
                };
              }
              return Reflect.get(response2, key, response2);
            }
          });
          return proxy;
        }
        return response || new Response("Not found", {
          status: 404
        });
      },
      context: { ...context }
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error2;
    }
    loaded = await module2.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  if (!loaded) {
    throw new Error(`${node.entry} - load must return a value except for page fall through`);
  }
  return {
    node,
    loaded: normalize(loaded),
    context: loaded.context || context,
    fetched,
    uses_credentials
  };
}
var escaped$2 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escape$1(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$2) {
      result += escaped$2[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
var absolute = /^([a-z]+:)?\/?\//;
function resolve(base2, path) {
  const base_match = absolute.exec(base2);
  const path_match = absolute.exec(path);
  if (!base_match) {
    throw new Error(`bad base path: "${base2}"`);
  }
  const baseparts = path_match ? [] : base2.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
  return `${prefix}${baseparts.join("/")}`;
}
function coalesce_to_error(err) {
  return err instanceof Error ? err : new Error(JSON.stringify(err));
}
async function respond_with_error({ request, options: options2, state, $session, status, error: error2 }) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page,
    node: default_layout,
    $session,
    context: {},
    prerender_enabled: is_prerender_enabled(options2, default_error, state),
    is_leaf: false,
    is_error: false
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page,
      node: default_error,
      $session,
      context: loaded ? loaded.context : {},
      prerender_enabled: is_prerender_enabled(options2, default_error, state),
      is_leaf: false,
      is_error: true,
      status,
      error: error2
    })
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr
      },
      status,
      error: error2,
      branch,
      page
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return {
      status: 500,
      headers: {},
      body: error3.stack
    };
  }
}
function is_prerender_enabled(options2, node, state) {
  return options2.prerender && (!!node.module.prerender || !!state.prerender && state.prerender.all);
}
async function respond$1(opts) {
  const { request, options: options2, state, $session, route } = opts;
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id ? options2.load_component(id) : void 0));
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error3
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  let page_config = get_page_config(leaf, options2);
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: ""
    };
  }
  let branch = [];
  let status = 200;
  let error2;
  ssr:
    if (page_config.ssr) {
      let context = {};
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node({
              ...opts,
              node,
              context,
              prerender_enabled: is_prerender_enabled(options2, node, state),
              is_leaf: i === nodes.length - 1,
              is_error: false
            });
            if (!loaded)
              return;
            if (loaded.loaded.redirect) {
              return {
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect)
                }
              };
            }
            if (loaded.loaded.error) {
              ({ status, error: error2 } = loaded.loaded);
            }
          } catch (err) {
            const e = coalesce_to_error(err);
            options2.handle_error(e, request);
            status = 500;
            error2 = e;
          }
          if (loaded && !error2) {
            branch.push(loaded);
          }
          if (error2) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  const error_loaded = await load_node({
                    ...opts,
                    node: error_node,
                    context: node_loaded.context,
                    prerender_enabled: is_prerender_enabled(options2, error_node, state),
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error2
                  });
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  page_config = get_page_config(error_node.module, options2);
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (err) {
                  const e = coalesce_to_error(err);
                  options2.handle_error(e, request);
                  continue;
                }
              }
            }
            return await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error2
            });
          }
        }
        if (loaded && loaded.loaded.context) {
          context = {
            ...context,
            ...loaded.loaded.context
          };
        }
      }
    }
  try {
    return await render_response({
      ...opts,
      page_config,
      status,
      error: error2,
      branch: branch.filter(Boolean)
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return await respond_with_error({
      ...opts,
      status: 500,
      error: error3
    });
  }
}
function get_page_config(leaf, options2) {
  return {
    ssr: "ssr" in leaf ? !!leaf.ssr : options2.ssr,
    router: "router" in leaf ? !!leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? !!leaf.hydrate : options2.hydrate
  };
}
async function render_page(request, route, match, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const params = route.params(match);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  const $session = await options2.hooks.getSession(request);
  const response = await respond$1({
    request,
    options: options2,
    state,
    $session,
    route,
    page
  });
  if (response) {
    return response;
  }
  if (state.fetched) {
    return {
      status: 500,
      headers: {},
      body: `Bad request in load function: failed to fetch ${state.fetched}`
    };
  }
}
function read_only_form_data() {
  const map = new Map();
  return {
    append(key, value) {
      if (map.has(key)) {
        (map.get(key) || []).push(value);
      } else {
        map.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map)
  };
}
var ReadOnlyFormData = class {
  constructor(map) {
    __privateAdd(this, _map, void 0);
    __privateSet(this, _map, map);
  }
  get(key) {
    const value = __privateGet(this, _map).get(key);
    return value && value[0];
  }
  getAll(key) {
    return __privateGet(this, _map).get(key);
  }
  has(key) {
    return __privateGet(this, _map).has(key);
  }
  *[Symbol.iterator]() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *entries() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *keys() {
    for (const [key] of __privateGet(this, _map))
      yield key;
  }
  *values() {
    for (const [, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield value[i];
      }
    }
  }
};
_map = new WeakMap();
function parse_body(raw, headers) {
  if (!raw)
    return raw;
  const content_type = headers["content-type"];
  const [type, ...directives] = content_type ? content_type.split(/;\s*/) : [];
  const text = () => new TextDecoder(headers["content-encoding"] || "utf-8").decode(raw);
  switch (type) {
    case "text/plain":
      return text();
    case "application/json":
      return JSON.parse(text());
    case "application/x-www-form-urlencoded":
      return get_urlencoded(text());
    case "multipart/form-data": {
      const boundary = directives.find((directive) => directive.startsWith("boundary="));
      if (!boundary)
        throw new Error("Missing boundary");
      return get_multipart(text(), boundary.slice("boundary=".length));
    }
    default:
      return raw;
  }
}
function get_urlencoded(text) {
  const { data, append } = read_only_form_data();
  text.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    throw new Error("Malformed form data");
  }
  const { data, append } = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    if (!match) {
      throw new Error("Malformed form data");
    }
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    const headers = {};
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name, value] = raw_header.split(": ");
      name = name.toLowerCase();
      headers[name] = value;
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name2, value2] = raw_directive.split("=");
        directives[name2] = JSON.parse(value2);
      });
      if (name === "content-disposition") {
        if (value !== "form-data")
          throw new Error("Malformed form data");
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      throw new Error("Malformed form data");
    append(key, body);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !(incoming.path.split("/").pop() || "").includes(".")) {
      const path = has_trailing_slash ? incoming.path.slice(0, -1) : incoming.path + "/";
      const q2 = incoming.query.toString();
      return {
        status: 301,
        headers: {
          location: options2.paths.base + path + (q2 ? `?${q2}` : "")
        }
      };
    }
  }
  const headers = lowercase_keys(incoming.headers);
  const request = {
    ...incoming,
    headers,
    body: parse_body(incoming.rawBody, headers),
    params: {},
    locals: {}
  };
  try {
    return await options2.hooks.handle({
      request,
      resolve: async (request2) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request2),
            page_config: { ssr: false, router: true, hydrate: true },
            status: 200,
            branch: []
          });
        }
        for (const route of options2.manifest.routes) {
          const match = route.pattern.exec(request2.path);
          if (!match)
            continue;
          const response = route.type === "endpoint" ? await render_endpoint(request2, route, match) : await render_page(request2, route, match, options2, state);
          if (response) {
            if (response.status === 200) {
              const cache_control = get_single_valued_header(response.headers, "cache-control");
              if (!cache_control || !/(no-store|immutable)/.test(cache_control)) {
                const etag = `"${hash(response.body || "")}"`;
                if (request2.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: ""
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        const $session = await options2.hooks.getSession(request2);
        return await respond_with_error({
          request: request2,
          options: options2,
          state,
          $session,
          status: 404,
          error: new Error(`Not found: ${request2.path}`)
        });
      }
    });
  } catch (err) {
    const e = coalesce_to_error(err);
    options2.handle_error(e, request);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
}
function noop() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function set_store_value(store, ret, value) {
  store.set(value);
  return ret;
}
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
Promise.resolve();
var escaped = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
}
var missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
var on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(parent_component ? parent_component.$$.context : context || []),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name}${value === true ? "" : `=${typeof value === "string" ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
}
function add_classes(classes) {
  return classes ? ` class="${classes}"` : "";
}
function afterUpdate() {
}
var css$9 = {
  code: "#svelte-announcer.svelte-1j55zn5{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}",
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\n\\timport { setContext, afterUpdate, onMount } from 'svelte';\\n\\n\\t// stores\\n\\texport let stores;\\n\\texport let page;\\n\\n\\texport let components;\\n\\texport let props_0 = null;\\n\\texport let props_1 = null;\\n\\texport let props_2 = null;\\n\\n\\tsetContext('__svelte__', stores);\\n\\n\\t$: stores.page.set(page);\\n\\tafterUpdate(stores.page.notify);\\n\\n\\tlet mounted = false;\\n\\tlet navigated = false;\\n\\tlet title = null;\\n\\n\\tonMount(() => {\\n\\t\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\t\\tif (mounted) {\\n\\t\\t\\t\\tnavigated = true;\\n\\t\\t\\t\\ttitle = document.title || 'untitled page';\\n\\t\\t\\t}\\n\\t\\t});\\n\\n\\t\\tmounted = true;\\n\\t\\treturn unsubscribe;\\n\\t});\\n<\/script>\\n\\n<svelte:component this={components[0]} {...(props_0 || {})}>\\n\\t{#if components[1]}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}>\\n\\t\\t\\t{#if components[2]}\\n\\t\\t\\t\\t<svelte:component this={components[2]} {...(props_2 || {})}/>\\n\\t\\t\\t{/if}\\n\\t\\t</svelte:component>\\n\\t{/if}\\n</svelte:component>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\t{title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>\\n\\t#svelte-announcer {\\n\\t\\tposition: absolute;\\n\\t\\tleft: 0;\\n\\t\\ttop: 0;\\n\\t\\tclip: rect(0 0 0 0);\\n\\t\\tclip-path: inset(50%);\\n\\t\\toverflow: hidden;\\n\\t\\twhite-space: nowrap;\\n\\t\\twidth: 1px;\\n\\t\\theight: 1px;\\n\\t}\\n</style>"],"names":[],"mappings":"AAsDC,iBAAiB,eAAC,CAAC,AAClB,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACnB,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,QAAQ,CAAE,MAAM,CAChB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,AACZ,CAAC"}`
};
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  $$result.css.add(css$9);
  {
    stores.page.set(page);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}` : ``}`
    })}` : ``}`
  })}

${``}`;
});
var base = "";
var assets = "";
function set_paths(paths) {
  base = paths.base;
  assets = paths.assets || base;
}
function set_prerendering(value) {
}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
var template = ({ head, body }) => '<!DOCTYPE html>\n<html lang="en">\n\n<head>\n	<meta charset="utf-8" />\n	<link rel="icon" href="/favicon.png" />\n	<meta name="viewport" content="width=device-width, initial-scale=1" />\n	' + head + '\n</head>\n\n<body>\n	<div id="svelte">' + body + "</div>\n</body>\n\n</html>\n";
var options = null;
var default_settings = { paths: { "base": "", "assets": "" } };
function init(settings = default_settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  const hooks = get_hooks(user_hooks);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: assets + "/_app/start-5a03e577.js",
      css: [assets + "/_app/assets/start-61d1577b.css"],
      js: [assets + "/_app/start-5a03e577.js", assets + "/_app/chunks/vendor-e58c2f7b.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => assets + "/_app/" + entry_lookup[id],
    get_stack: (error2) => String(error2),
    handle_error: (error2, request) => {
      hooks.handleError({ error: error2, request });
      error2.stack = options.get_stack(error2);
    },
    hooks,
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    prerender: true,
    read: settings.read,
    root: Root,
    service_worker: null,
    router: true,
    ssr: true,
    target: "#svelte",
    template,
    trailing_slash: "never"
  };
}
var empty = () => ({});
var manifest = {
  assets: [{ "file": "demo.gif", "size": 3674899, "type": "image/gif" }],
  layout: "src/routes/__layout.svelte",
  error: ".svelte-kit/build/components/error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    }
  ]
};
var get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ request, resolve: resolve2 }) => resolve2(request)),
  handleError: hooks.handleError || (({ error: error2 }) => console.error(error2.stack)),
  externalFetch: hooks.externalFetch || fetch
});
var module_lookup = {
  "src/routes/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout;
  }),
  ".svelte-kit/build/components/error.svelte": () => Promise.resolve().then(function() {
    return error;
  }),
  "src/routes/index.svelte": () => Promise.resolve().then(function() {
    return index;
  })
};
var metadata_lookup = { "src/routes/__layout.svelte": { "entry": "pages/__layout.svelte-fabaa65b.js", "css": ["assets/pages/__layout.svelte-f5e9fbbe.css"], "js": ["pages/__layout.svelte-fabaa65b.js", "chunks/vendor-e58c2f7b.js", "chunks/size-ec3629e2.js"], "styles": [] }, ".svelte-kit/build/components/error.svelte": { "entry": "error.svelte-5ae88f90.js", "css": [], "js": ["error.svelte-5ae88f90.js", "chunks/vendor-e58c2f7b.js"], "styles": [] }, "src/routes/index.svelte": { "entry": "pages/index.svelte-64b0f2fd.js", "css": ["assets/pages/index.svelte-4b0f61b9.css"], "js": ["pages/index.svelte-64b0f2fd.js", "chunks/vendor-e58c2f7b.js", "chunks/size-ec3629e2.js"], "styles": [] } };
async function load_component(file) {
  const { entry, css: css2, js, styles } = metadata_lookup[file];
  return {
    module: await module_lookup[file](),
    entry: assets + "/_app/" + entry,
    css: css2.map((dep) => assets + "/_app/" + dep),
    js: js.map((dep) => assets + "/_app/" + dep),
    styles
  };
}
function render(request, {
  prerender
} = {}) {
  const host = request.headers["host"];
  return respond({ ...request, host }, options, { prerender });
}
var subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
var width = writable();
var height = writable();
var margin = readable(30);
var scale = writable(1);
var radius = writable();
var AutoResize = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let availableRadius;
  let $radius, $$unsubscribe_radius;
  let $margin, $$unsubscribe_margin;
  let $scale, $$unsubscribe_scale;
  let $height, $$unsubscribe_height;
  let $width, $$unsubscribe_width;
  $$unsubscribe_radius = subscribe(radius, (value) => $radius = value);
  $$unsubscribe_margin = subscribe(margin, (value) => $margin = value);
  $$unsubscribe_scale = subscribe(scale, (value) => $scale = value);
  $$unsubscribe_height = subscribe(height, (value) => $height = value);
  $$unsubscribe_width = subscribe(width, (value) => $width = value);
  const minRadius = $margin;
  availableRadius = Math.min($width, $height) * 0.5;
  set_store_value(radius, $radius = availableRadius * $scale - $margin, $radius);
  {
    if ($radius < minRadius)
      set_store_value(radius, $radius = minRadius, $radius);
  }
  $$unsubscribe_radius();
  $$unsubscribe_margin();
  $$unsubscribe_scale();
  $$unsubscribe_height();
  $$unsubscribe_width();
  return `

<div style="${"display: none;"}"></div>`;
});
var css$8 = {
  code: ":root{background-color:#fff;color:#aaa;font-family:monospace;font-size:15px;line-height:1.5}*{margin:0;padding:0;box-sizing:border-box}html{filter:invert(0)}.button{background-color:#eaeaff;border:none;border:1px solid #5869ff20;border-radius:6px;box-shadow:0 1px 3px #5869ff60;color:#0b05be;cursor:pointer;display:grid;font:inherit;height:2.5rem;place-content:center;user-select:none;width:2.5rem}.button.on,.button:active{background-color:#c9cbff;box-shadow:none;color:#000}.button input[type=checkbox]{display:none}.button__group{display:flex;gap:0.5rem}.note{background-color:#eaeaff;border:1px solid #5869ff20;border-radius:3px;color:#0b05be;cursor:default;display:flex;flex-direction:column;margin:-1px;margin-bottom:0.5rem;padding:0.25rem 0.5rem}.params__group{flex-direction:column;padding:0.5rem 1rem 1rem}.params__group h2{color:#6c6c6c;font:inherit;font-size:13px;margin-bottom:0.5rem;text-transform:uppercase}.params__group>p{display:flex;justify-content:right}.params__group>p label{padding-right:1rem}.params__group>p input{background-color:#fff;border:1px solid #0001;border-radius:3px;font:inherit;line-height:inherit;margin:-1px;padding-left:4px;width:10ch}.show-hidden-element{display:flex}.white-box,.params__group{background-color:#fff;border-radius:6px;box-shadow:0 1px 3px #5869ff30;color:#2135e2;display:flex;gap:0.5rem;padding:1rem}",
  map: '{"version":3,"file":"__layout.svelte","sources":["__layout.svelte"],"sourcesContent":["<script>\\r\\n  import AutoResize from \\"/src/components/AutoResize.svelte\\";\\r\\n<\/script>\\r\\n\\r\\n<svelte:head>\\r\\n  <title>ephy</title>\\r\\n</svelte:head>\\r\\n\\r\\n<AutoResize />\\r\\n<slot />\\r\\n\\r\\n<style lang=\\"scss\\" global>:global(:root) {\\n  background-color: #fff;\\n  color: #aaa;\\n  font-family: monospace;\\n  font-size: 15px;\\n  line-height: 1.5;\\n}\\n\\n:global(*) {\\n  margin: 0;\\n  padding: 0;\\n  box-sizing: border-box;\\n}\\n\\n:global(html) {\\n  filter: invert(0);\\n}\\n\\n:global(.button) {\\n  background-color: #eaeaff;\\n  border: none;\\n  border: 1px solid #5869ff20;\\n  border-radius: 6px;\\n  box-shadow: 0 1px 3px #5869ff60;\\n  color: #0b05be;\\n  cursor: pointer;\\n  display: grid;\\n  font: inherit;\\n  height: 2.5rem;\\n  place-content: center;\\n  user-select: none;\\n  width: 2.5rem;\\n}\\n:global(.button.on), :global(.button:active) {\\n  background-color: #c9cbff;\\n  box-shadow: none;\\n  color: #000;\\n}\\n:global(.button) :global(input[type=checkbox]) {\\n  display: none;\\n}\\n\\n:global(.button__group) {\\n  display: flex;\\n  gap: 0.5rem;\\n}\\n\\n:global(.note) {\\n  background-color: #eaeaff;\\n  border: 1px solid #5869ff20;\\n  border-radius: 3px;\\n  color: #0b05be;\\n  cursor: default;\\n  display: flex;\\n  flex-direction: column;\\n  margin: -1px;\\n  margin-bottom: 0.5rem;\\n  padding: 0.25rem 0.5rem;\\n}\\n\\n:global(.params__group) {\\n  flex-direction: column;\\n  padding: 0.5rem 1rem 1rem;\\n}\\n:global(.params__group) :global(h2) {\\n  color: #6c6c6c;\\n  font: inherit;\\n  font-size: 13px;\\n  margin-bottom: 0.5rem;\\n  text-transform: uppercase;\\n}\\n:global(.params__group) > :global(p) {\\n  display: flex;\\n  justify-content: right;\\n}\\n:global(.params__group) > :global(p) :global(label) {\\n  padding-right: 1rem;\\n}\\n:global(.params__group) > :global(p) :global(input) {\\n  background-color: #fff;\\n  border: 1px solid #0001;\\n  border-radius: 3px;\\n  font: inherit;\\n  line-height: inherit;\\n  margin: -1px;\\n  padding-left: 4px;\\n  width: 10ch;\\n}\\n\\n:global(.show-hidden-element) {\\n  display: flex;\\n}\\n\\n:global(.white-box), :global(.params__group) {\\n  background-color: #fff;\\n  border-radius: 6px;\\n  box-shadow: 0 1px 3px #5869ff30;\\n  color: #2135e2;\\n  display: flex;\\n  gap: 0.5rem;\\n  padding: 1rem;\\n}</style>\\r\\n"],"names":[],"mappings":"AAWkC,KAAK,AAAE,CAAC,AACxC,gBAAgB,CAAE,IAAI,CACtB,KAAK,CAAE,IAAI,CACX,WAAW,CAAE,SAAS,CACtB,SAAS,CAAE,IAAI,CACf,WAAW,CAAE,GAAG,AAClB,CAAC,AAEO,CAAC,AAAE,CAAC,AACV,MAAM,CAAE,CAAC,CACT,OAAO,CAAE,CAAC,CACV,UAAU,CAAE,UAAU,AACxB,CAAC,AAEO,IAAI,AAAE,CAAC,AACb,MAAM,CAAE,OAAO,CAAC,CAAC,AACnB,CAAC,AAEO,OAAO,AAAE,CAAC,AAChB,gBAAgB,CAAE,OAAO,CACzB,MAAM,CAAE,IAAI,CACZ,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,SAAS,CAC3B,aAAa,CAAE,GAAG,CAClB,UAAU,CAAE,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,SAAS,CAC/B,KAAK,CAAE,OAAO,CACd,MAAM,CAAE,OAAO,CACf,OAAO,CAAE,IAAI,CACb,IAAI,CAAE,OAAO,CACb,MAAM,CAAE,MAAM,CACd,aAAa,CAAE,MAAM,CACrB,WAAW,CAAE,IAAI,CACjB,KAAK,CAAE,MAAM,AACf,CAAC,AACO,UAAU,AAAC,CAAU,cAAc,AAAE,CAAC,AAC5C,gBAAgB,CAAE,OAAO,CACzB,UAAU,CAAE,IAAI,CAChB,KAAK,CAAE,IAAI,AACb,CAAC,AACO,OAAO,AAAC,CAAC,AAAQ,oBAAoB,AAAE,CAAC,AAC9C,OAAO,CAAE,IAAI,AACf,CAAC,AAEO,cAAc,AAAE,CAAC,AACvB,OAAO,CAAE,IAAI,CACb,GAAG,CAAE,MAAM,AACb,CAAC,AAEO,KAAK,AAAE,CAAC,AACd,gBAAgB,CAAE,OAAO,CACzB,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,SAAS,CAC3B,aAAa,CAAE,GAAG,CAClB,KAAK,CAAE,OAAO,CACd,MAAM,CAAE,OAAO,CACf,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,MAAM,CAAE,IAAI,CACZ,aAAa,CAAE,MAAM,CACrB,OAAO,CAAE,OAAO,CAAC,MAAM,AACzB,CAAC,AAEO,cAAc,AAAE,CAAC,AACvB,cAAc,CAAE,MAAM,CACtB,OAAO,CAAE,MAAM,CAAC,IAAI,CAAC,IAAI,AAC3B,CAAC,AACO,cAAc,AAAC,CAAC,AAAQ,EAAE,AAAE,CAAC,AACnC,KAAK,CAAE,OAAO,CACd,IAAI,CAAE,OAAO,CACb,SAAS,CAAE,IAAI,CACf,aAAa,CAAE,MAAM,CACrB,cAAc,CAAE,SAAS,AAC3B,CAAC,AACO,cAAc,AAAC,CAAW,CAAC,AAAE,CAAC,AACpC,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,KAAK,AACxB,CAAC,AACO,cAAc,AAAC,CAAW,CAAC,AAAC,CAAC,AAAQ,KAAK,AAAE,CAAC,AACnD,aAAa,CAAE,IAAI,AACrB,CAAC,AACO,cAAc,AAAC,CAAW,CAAC,AAAC,CAAC,AAAQ,KAAK,AAAE,CAAC,AACnD,gBAAgB,CAAE,IAAI,CACtB,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CACvB,aAAa,CAAE,GAAG,CAClB,IAAI,CAAE,OAAO,CACb,WAAW,CAAE,OAAO,CACpB,MAAM,CAAE,IAAI,CACZ,YAAY,CAAE,GAAG,CACjB,KAAK,CAAE,IAAI,AACb,CAAC,AAEO,oBAAoB,AAAE,CAAC,AAC7B,OAAO,CAAE,IAAI,AACf,CAAC,AAEO,UAAU,AAAC,CAAU,cAAc,AAAE,CAAC,AAC5C,gBAAgB,CAAE,IAAI,CACtB,aAAa,CAAE,GAAG,CAClB,UAAU,CAAE,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,SAAS,CAC/B,KAAK,CAAE,OAAO,CACd,OAAO,CAAE,IAAI,CACb,GAAG,CAAE,MAAM,CACX,OAAO,CAAE,IAAI,AACf,CAAC"}'
};
var _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$8);
  return `${$$result.head += `${$$result.title = `<title>ephy</title>`, ""}`, ""}

${validate_component(AutoResize, "AutoResize").$$render($$result, {}, {}, {})}
${slots.default ? slots.default({}) : ``}`;
});
var __layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout
});
function load({ error: error2, status }) {
  return { props: { error: error2, status } };
}
var Error$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { status } = $$props;
  let { error: error2 } = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error2 !== void 0)
    $$bindings.error(error2);
  return `<h1>${escape(status)}</h1>

<pre>${escape(error2.message)}</pre>



${error2.frame ? `<pre>${escape(error2.frame)}</pre>` : ``}
${error2.stack ? `<pre>${escape(error2.stack)}</pre>` : ``}`;
});
var error = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Error$1,
  load
});
var Note = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="${"note"}" role="${"note"}">${slots.default ? slots.default({}) : ``}</div>`;
});
var ParamGroup = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<form class="${"params__group"}" autocomplete="${"off"}">${slots.default ? slots.default({}) : ``}</form>`;
});
var p = writable(101);
var q = writable(100);
var k = writable();
var irreducibleP = writable();
var irreducibleQ = writable();
var radian = Math.PI * 2;
function gcd(a, b, isRecursion) {
  if (a === b)
    return a;
  const max = a > b ? a : b;
  const min = a < b ? a : b;
  if (min === 0)
    return !isRecursion ? false : max;
  return gcd(max % min, min, true);
}
var r1 = writable();
var r2 = writable();
var factor = writable(1);
var rendering = writable(false);
var progress = writable(0);
function setRatio(newRatio) {
  ({ ...newRatio });
}
function setRender(newRender) {
  ({ ...newRender });
}
var css$7 = {
  code: ".param__group>.note>p>label{padding-right:0}.partially-invalid{opacity:0.5}.ratio{display:inline-flex;min-width:11ch}",
  map: '{"version":3,"file":"Ratio.svelte","sources":["Ratio.svelte"],"sourcesContent":["<script>\\r\\n  import Note from \\"/src/components/reusable/Note.svelte\\";\\r\\n  import ParamGroup from \\"/src/components/reusable/ParamGroup.svelte\\";\\r\\n  import { p, q, k, irreducibleP, irreducibleQ } from \\"/src/stores/ratio\\";\\r\\n  import { gcd } from \\"/src/js/util\\";\\r\\n  import { radius } from \\"/src/stores/size\\";\\r\\n  import { r1, r2 } from \\"/src/stores/circles\\";\\r\\n  import { factor } from \\"/src/stores/factor\\";\\r\\n  import { setRatio } from \\"/src/js/cycloid\\";\\r\\n\\r\\n  const minP = -2500;\\r\\n  const minQ = 1;\\r\\n  const maxPQ = 2500;\\r\\n\\r\\n  // Data bound.\\r\\n  $: $p = Math.floor($p);\\r\\n  $: $q = Math.floor($q);\\r\\n  $: if ($p < minP) $p = minP;\\r\\n  $: if ($q < minQ) $q = minQ;\\r\\n  $: if ($p > maxPQ) $p = maxPQ;\\r\\n  $: if ($q > maxPQ) $q = maxPQ;\\r\\n\\r\\n  $: absP = Math.abs($p);\\r\\n  \\r\\n  // If `p` is negative, `q` cannot be greater than its absolute value.\\r\\n  $: if ($p < 0 && $q > absP) $q = absP;\\r\\n\\r\\n  // If `p` is zero, we cannot draw.\\r\\n  $: if (absP > 0) {\\r\\n    const gcdPQ = gcd(absP, $q);\\r\\n    $irreducibleP = $p / gcdPQ;\\r\\n    $irreducibleQ = $q / gcdPQ;\\r\\n  }\\r\\n\\r\\n  // Ratio.\\r\\n  $: $k = $irreducibleP / $irreducibleQ;\\r\\n\\r\\n  // Fraction for the circles radius relative to the cycloid radius.\\r\\n  let fraction;\\r\\n  $: fraction = $radius / ($k + ($k > 0 ? 2 : -2));\\r\\n\\r\\n  // Circles radius.\\r\\n  $: $r1 = fraction * $k;\\r\\n  $: $r2 = fraction;\\r\\n\\r\\n  // Orbit of outer cirlce.\\r\\n  let orbit;\\r\\n  $: orbit = $r1 + $r2;\\r\\n\\r\\n  let r2Factor;\\r\\n  $: r2Factor = $r2 * $factor;\\r\\n\\r\\n  // Pass ratio config. to cycloid module.\\r\\n  $: setRatio({\\r\\n    r1: $r1,\\r\\n    r2: $r2,\\r\\n    r2Factor,\\r\\n    orbit,\\r\\n    revolutions: Math.abs($irreducibleQ),\\r\\n  });\\r\\n\\r\\n  $: kFixed8 = +$k.toFixed(7);\\r\\n<\/script>\\r\\n\\r\\n<!-- svelte-ignore component-name-lowercase -->\\r\\n<ParamGroup>\\r\\n  <h2>Raz\xF3n</h2>\\r\\n  <Note>\\r\\n    <p>k = <label for=\\"p\\">p</label> \u2236 <label for=\\"q\\">q</label></p>\\r\\n    <p>\\r\\n      k = <span class=\\"ratio\\">{`${$irreducibleP} : ${$irreducibleQ}`}</span>\\r\\n    </p>\\r\\n    <p>k {(kFixed8 === $k ? \\"= \\" : \\"\u2248 \\") + kFixed8}</p>\\r\\n  </Note>\\r\\n  <p>\\r\\n    <label\\r\\n      for=\\"p\\"\\r\\n      title=\\"En forma reducida, n\xFAmero de c\xFAspudes.\\"\\r\\n      class:partially-invalid={$p === 0}>p</label\\r\\n    >\\r\\n    <input id=\\"p\\" type=\\"number\\" bind:value={$p} min={minP} max={maxPQ} />\\r\\n  </p>\\r\\n  <p>\\r\\n    <label for=\\"q\\" title=\\"En forma reducida, n\xFAmero de revoluciones.\\">q</label>\\r\\n    <input id=\\"q\\" type=\\"number\\" bind:value={$q} min={minQ} max={maxPQ} />\\r\\n  </p>\\r\\n</ParamGroup>\\r\\n\\r\\n<style lang=\\"scss\\" global>:global(.param__group) > :global(.note) > :global(p) > :global(label) {\\n  padding-right: 0;\\n}\\n\\n:global(.partially-invalid) {\\n  opacity: 0.5;\\n}\\n\\n:global(.ratio) {\\n  display: inline-flex;\\n  min-width: 11ch;\\n}</style>\\r\\n"],"names":[],"mappings":"AAwFkC,aAAa,AAAC,CAAW,KAAK,AAAC,CAAW,CAAC,AAAC,CAAW,KAAK,AAAE,CAAC,AAC/F,aAAa,CAAE,CAAC,AAClB,CAAC,AAEO,kBAAkB,AAAE,CAAC,AAC3B,OAAO,CAAE,GAAG,AACd,CAAC,AAEO,MAAM,AAAE,CAAC,AACf,OAAO,CAAE,WAAW,CACpB,SAAS,CAAE,IAAI,AACjB,CAAC"}'
};
var minQ = 1;
var maxPQ = 2500;
var Ratio = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let absP;
  let kFixed8;
  let $k, $$unsubscribe_k;
  let $irreducibleQ, $$unsubscribe_irreducibleQ;
  let $r2, $$unsubscribe_r2;
  let $r1, $$unsubscribe_r1;
  let $factor, $$unsubscribe_factor;
  let $radius, $$unsubscribe_radius;
  let $irreducibleP, $$unsubscribe_irreducibleP;
  let $q, $$unsubscribe_q;
  let $p, $$unsubscribe_p;
  $$unsubscribe_k = subscribe(k, (value) => $k = value);
  $$unsubscribe_irreducibleQ = subscribe(irreducibleQ, (value) => $irreducibleQ = value);
  $$unsubscribe_r2 = subscribe(r2, (value) => $r2 = value);
  $$unsubscribe_r1 = subscribe(r1, (value) => $r1 = value);
  $$unsubscribe_factor = subscribe(factor, (value) => $factor = value);
  $$unsubscribe_radius = subscribe(radius, (value) => $radius = value);
  $$unsubscribe_irreducibleP = subscribe(irreducibleP, (value) => $irreducibleP = value);
  $$unsubscribe_q = subscribe(q, (value) => $q = value);
  $$unsubscribe_p = subscribe(p, (value) => $p = value);
  const minP = -2500;
  let fraction;
  let orbit;
  let r2Factor;
  $$result.css.add(css$7);
  set_store_value(p, $p = Math.floor($p), $p);
  set_store_value(q, $q = Math.floor($q), $q);
  {
    if ($p < minP)
      set_store_value(p, $p = minP, $p);
  }
  {
    if ($q < minQ)
      set_store_value(q, $q = minQ, $q);
  }
  {
    if ($p > maxPQ)
      set_store_value(p, $p = maxPQ, $p);
  }
  {
    if ($q > maxPQ)
      set_store_value(q, $q = maxPQ, $q);
  }
  absP = Math.abs($p);
  {
    if ($p < 0 && $q > absP)
      set_store_value(q, $q = absP, $q);
  }
  {
    if (absP > 0) {
      const gcdPQ = gcd(absP, $q);
      set_store_value(irreducibleP, $irreducibleP = $p / gcdPQ, $irreducibleP);
      set_store_value(irreducibleQ, $irreducibleQ = $q / gcdPQ, $irreducibleQ);
    }
  }
  set_store_value(k, $k = $irreducibleP / $irreducibleQ, $k);
  fraction = $radius / ($k + ($k > 0 ? 2 : -2));
  set_store_value(r1, $r1 = fraction * $k, $r1);
  set_store_value(r2, $r2 = fraction, $r2);
  orbit = $r1 + $r2;
  r2Factor = $r2 * $factor;
  {
    setRatio({
      r1: $r1,
      r2: $r2,
      r2Factor,
      orbit,
      revolutions: Math.abs($irreducibleQ)
    });
  }
  kFixed8 = +$k.toFixed(7);
  $$unsubscribe_k();
  $$unsubscribe_irreducibleQ();
  $$unsubscribe_r2();
  $$unsubscribe_r1();
  $$unsubscribe_factor();
  $$unsubscribe_radius();
  $$unsubscribe_irreducibleP();
  $$unsubscribe_q();
  $$unsubscribe_p();
  return `
${validate_component(ParamGroup, "ParamGroup").$$render($$result, {}, {}, {
    default: () => `<h2>Raz\xF3n</h2>
  ${validate_component(Note, "Note").$$render($$result, {}, {}, {
      default: () => `<p>k = <label for="${"p"}">p</label> \u2236 <label for="${"q"}">q</label></p>
    <p>k = <span class="${"ratio"}">${escape(`${$irreducibleP} : ${$irreducibleQ}`)}</span></p>
    <p>k ${escape((kFixed8 === $k ? "= " : "\u2248 ") + kFixed8)}</p>`
    })}
  <p><label for="${"p"}" title="${"En forma reducida, n\xFAmero de c\xFAspudes."}"${add_classes([$p === 0 ? "partially-invalid" : ""].join(" ").trim())}>p</label>
    <input id="${"p"}" type="${"number"}"${add_attribute("min", minP, 0)}${add_attribute("max", maxPQ, 0)}${add_attribute("value", $p, 0)}></p>
  <p><label for="${"q"}" title="${"En forma reducida, n\xFAmero de revoluciones."}">q</label>
    <input id="${"q"}" type="${"number"}"${add_attribute("min", minQ, 0)}${add_attribute("max", maxPQ, 0)}${add_attribute("value", $q, 0)}></p>`
  })}`;
});
var Factor = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $factor, $$unsubscribe_factor;
  $$unsubscribe_factor = subscribe(factor, (value) => $factor = value);
  {
    if ($factor < -100)
      set_store_value(factor, $factor = -100, $factor);
  }
  {
    if ($factor > 100)
      set_store_value(factor, $factor = 100, $factor);
  }
  $$unsubscribe_factor();
  return `${validate_component(ParamGroup, "ParamGroup").$$render($$result, {}, {}, {
    default: () => `<h2>Factor</h2>
  
  <p><label for="${"factor"}">f</label>
    <input id="${"factor"}" type="${"number"}" min="${"-100"}" max="${"100"}" step="${"0.05"}"${add_attribute("value", $factor, 0)}></p>`
  })}`;
});
var css$6 = {
  code: ".progress.svelte-gny1p6.svelte-gny1p6{color:#6c6c6c;font-size:13px;display:flex;align-items:center}.progress.rendering.svelte-gny1p6 .green-dot.svelte-gny1p6{animation:svelte-gny1p6-blink 480ms infinite}.green-dot.svelte-gny1p6.svelte-gny1p6{width:8px;height:8px;margin-left:0.5rem;background-color:#76ff03;border-radius:50%;opacity:1;transition:opacity 240ms}@keyframes svelte-gny1p6-blink{from{opacity:0}}",
  map: '{"version":3,"file":"Progress.svelte","sources":["Progress.svelte"],"sourcesContent":["<script>\\r\\n  import { rendering, progress } from \\"/src/stores/feedback\\";\\r\\n<\/script>\\r\\n\\r\\n{#if $progress}\\r\\n  <span class=\\"progress\\" class:rendering={$rendering}>\\r\\n    {$progress}% <span class=\\"green-dot\\" />\\r\\n  </span>\\r\\n{/if}\\r\\n\\r\\n<style lang=\\"scss\\">.progress {\\n  color: #6c6c6c;\\n  font-size: 13px;\\n  display: flex;\\n  align-items: center;\\n}\\n.progress.rendering .green-dot {\\n  animation: blink 480ms infinite;\\n}\\n\\n.green-dot {\\n  width: 8px;\\n  height: 8px;\\n  margin-left: 0.5rem;\\n  background-color: #76ff03;\\n  border-radius: 50%;\\n  opacity: 1;\\n  transition: opacity 240ms;\\n}\\n\\n@keyframes blink {\\n  from {\\n    opacity: 0;\\n  }\\n}</style>\\r\\n"],"names":[],"mappings":"AAUmB,SAAS,4BAAC,CAAC,AAC5B,KAAK,CAAE,OAAO,CACd,SAAS,CAAE,IAAI,CACf,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,AACrB,CAAC,AACD,SAAS,wBAAU,CAAC,UAAU,cAAC,CAAC,AAC9B,SAAS,CAAE,mBAAK,CAAC,KAAK,CAAC,QAAQ,AACjC,CAAC,AAED,UAAU,4BAAC,CAAC,AACV,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,CACX,WAAW,CAAE,MAAM,CACnB,gBAAgB,CAAE,OAAO,CACzB,aAAa,CAAE,GAAG,CAClB,OAAO,CAAE,CAAC,CACV,UAAU,CAAE,OAAO,CAAC,KAAK,AAC3B,CAAC,AAED,WAAW,mBAAM,CAAC,AAChB,IAAI,AAAC,CAAC,AACJ,OAAO,CAAE,CAAC,AACZ,CAAC,AACH,CAAC"}'
};
var Progress = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $progress, $$unsubscribe_progress;
  let $rendering, $$unsubscribe_rendering;
  $$unsubscribe_progress = subscribe(progress, (value) => $progress = value);
  $$unsubscribe_rendering = subscribe(rendering, (value) => $rendering = value);
  $$result.css.add(css$6);
  $$unsubscribe_progress();
  $$unsubscribe_rendering();
  return `${$progress ? `<span class="${["progress svelte-gny1p6", $rendering ? "rendering" : ""].join(" ").trim()}">${escape($progress)}% <span class="${"green-dot svelte-gny1p6"}"></span></span>` : ``}`;
});
var Redraw = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<button title="${"Redibujar"}" class="${"button"}">\u21BB
</button>`;
});
var Checkbox = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title, id, checked } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.checked === void 0 && $$bindings.checked && checked !== void 0)
    $$bindings.checked(checked);
  return `<label${add_attribute("title", title, 0)} role="${"button"}" class="${["button", checked ? "on" : ""].join(" ").trim()}"${add_attribute("for", id, 0)}>${slots.default ? slots.default({}) : ``}
  <input${add_attribute("id", id, 0)} type="${"checkbox"}"${add_attribute("checked", checked, 1)}></label>`;
});
var paramsIsVisible = writable(true);
var debugIsVisible = writable(false);
var ToggleDebug = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $debugIsVisible, $$unsubscribe_debugIsVisible;
  $$unsubscribe_debugIsVisible = subscribe(debugIsVisible, (value) => $debugIsVisible = value);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(Checkbox, "Checkbox").$$render($$result, {
      title: "Debug",
      id: "toggle-debug",
      checked: $debugIsVisible
    }, {
      checked: ($$value) => {
        $debugIsVisible = $$value;
        $$settled = false;
      }
    }, { default: () => `\u25CE` })}`;
  } while (!$$settled);
  $$unsubscribe_debugIsVisible();
  return $$rendered;
});
var speedR1R2 = writable(5e-3);
var iterations = writable(500);
var css$5 = {
  code: "h2.svelte-1ysmykw{display:flex;gap:1rem;justify-content:space-between;align-items:center}.button__group.svelte-1ysmykw{margin-top:0.5rem}",
  map: '{"version":3,"file":"Render.svelte","sources":["Render.svelte"],"sourcesContent":["<script>\\r\\n  import ParamGroup from \\"/src/components/reusable/ParamGroup.svelte\\";\\r\\n  import Progress from \\"./Progress.svelte\\";\\r\\n  import Redraw from \\"./Redraw.svelte\\";\\r\\n  import ShowDebug from \\"./ToggleDebug.svelte\\";\\r\\n  import { speedR1R2, iterations } from \\"/src/stores/render\\";\\r\\n  import { radian } from \\"/src/js/util\\";\\r\\n  import { k } from \\"/src/stores/ratio\\";\\r\\n  import { setRender } from \\"/src/js/cycloid\\";\\r\\n\\r\\n  const minS = 0.001;\\r\\n  const minI = 1;\\r\\n  const maxS = 0.1 * radian.toFixed(3);\\r\\n  const maxI = 5000;\\r\\n\\r\\n  // Data bound.\\r\\n  $: if ($speedR1R2 < minS) $speedR1R2 = minS;\\r\\n  $: if ($iterations < minI) $iterations = minI;\\r\\n  $: if ($speedR1R2 > maxS) $speedR1R2 = maxS;\\r\\n  $: if ($iterations > maxI) $iterations = maxI;\\r\\n\\r\\n  // Pass render config. to cycloid module.\\r\\n  $: setRender({\\r\\n    speedR2: $speedR1R2 * ($k + 1),\\r\\n    speedR1R2: $speedR1R2,\\r\\n    iterations: $iterations,\\r\\n  });\\r\\n<\/script>\\r\\n\\r\\n<ParamGroup>\\r\\n  <h2>Dibujo <Progress /></h2>\\r\\n  <p>\\r\\n    <label for=\\"speed-r1r2\\" title=\\"Velocidad rotacional en radianes.\\">\\r\\n      \u03C9\\r\\n    </label>\\r\\n    <input\\r\\n      id=\\"speed-r1r2\\"\\r\\n      type=\\"number\\"\\r\\n      bind:value={$speedR1R2}\\r\\n      min={minS}\\r\\n      max={maxS}\\r\\n      step=\\".001\\"\\r\\n    />\\r\\n  </p>\\r\\n  <p>\\r\\n    <label for=\\"iterations\\" title=\\"Iteraciones por cuadro.\\">1x</label>\\r\\n    <input\\r\\n      id=\\"iterations\\"\\r\\n      type=\\"number\\"\\r\\n      bind:value={$iterations}\\r\\n      min={minI}\\r\\n      max={maxI}\\r\\n      step=\\"1\\"\\r\\n    />\\r\\n  </p>\\r\\n  <div class=\\"button__group\\">\\r\\n    <Redraw />\\r\\n    <ShowDebug />\\r\\n  </div>\\r\\n</ParamGroup>\\r\\n\\r\\n<style lang=\\"scss\\">h2 {\\n  display: flex;\\n  gap: 1rem;\\n  justify-content: space-between;\\n  align-items: center;\\n}\\n\\n.button__group {\\n  margin-top: 0.5rem;\\n}</style>\\r\\n"],"names":[],"mappings":"AA6DmB,EAAE,eAAC,CAAC,AACrB,OAAO,CAAE,IAAI,CACb,GAAG,CAAE,IAAI,CACT,eAAe,CAAE,aAAa,CAC9B,WAAW,CAAE,MAAM,AACrB,CAAC,AAED,cAAc,eAAC,CAAC,AACd,UAAU,CAAE,MAAM,AACpB,CAAC"}'
};
var minS = 1e-3;
var minI = 1;
var maxI = 5e3;
var Render = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $iterations, $$unsubscribe_iterations;
  let $speedR1R2, $$unsubscribe_speedR1R2;
  let $k, $$unsubscribe_k;
  $$unsubscribe_iterations = subscribe(iterations, (value) => $iterations = value);
  $$unsubscribe_speedR1R2 = subscribe(speedR1R2, (value) => $speedR1R2 = value);
  $$unsubscribe_k = subscribe(k, (value) => $k = value);
  const maxS = 0.1 * radian.toFixed(3);
  $$result.css.add(css$5);
  {
    if ($speedR1R2 < minS)
      set_store_value(speedR1R2, $speedR1R2 = minS, $speedR1R2);
  }
  {
    if ($iterations < minI)
      set_store_value(iterations, $iterations = minI, $iterations);
  }
  {
    if ($speedR1R2 > maxS)
      set_store_value(speedR1R2, $speedR1R2 = maxS, $speedR1R2);
  }
  {
    if ($iterations > maxI)
      set_store_value(iterations, $iterations = maxI, $iterations);
  }
  {
    setRender({
      speedR2: $speedR1R2 * ($k + 1),
      speedR1R2: $speedR1R2,
      iterations: $iterations
    });
  }
  $$unsubscribe_iterations();
  $$unsubscribe_speedR1R2();
  $$unsubscribe_k();
  return `${validate_component(ParamGroup, "ParamGroup").$$render($$result, {}, {}, {
    default: () => `<h2 class="${"svelte-1ysmykw"}">Dibujo ${validate_component(Progress, "Progress").$$render($$result, {}, {}, {})}</h2>
  <p><label for="${"speed-r1r2"}" title="${"Velocidad rotacional en radianes."}">\u03C9
    </label>
    <input id="${"speed-r1r2"}" type="${"number"}"${add_attribute("min", minS, 0)}${add_attribute("max", maxS, 0)} step="${".001"}"${add_attribute("value", $speedR1R2, 0)}></p>
  <p><label for="${"iterations"}" title="${"Iteraciones por cuadro."}">1x</label>
    <input id="${"iterations"}" type="${"number"}"${add_attribute("min", minI, 0)}${add_attribute("max", maxI, 0)} step="${"1"}"${add_attribute("value", $iterations, 0)}></p>
  <div class="${"button__group svelte-1ysmykw"}">${validate_component(Redraw, "Redraw").$$render($$result, {}, {}, {})}
    ${validate_component(ToggleDebug, "ShowDebug").$$render($$result, {}, {}, {})}</div>`
  })}`;
});
var ToggleParams = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $paramsIsVisible, $$unsubscribe_paramsIsVisible;
  $$unsubscribe_paramsIsVisible = subscribe(paramsIsVisible, (value) => $paramsIsVisible = value);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(Checkbox, "Checkbox").$$render($$result, {
      title: "Men\xFA",
      id: "toggle-params",
      checked: $paramsIsVisible
    }, {
      checked: ($$value) => {
        $paramsIsVisible = $$value;
        $$settled = false;
      }
    }, { default: () => `\u22EF` })}`;
  } while (!$$settled);
  $$unsubscribe_paramsIsVisible();
  return $$rendered;
});
var css$4 = {
  code: "aside{display:flex;flex-direction:column;gap:1rem;grid-area:params}aside>*{align-self:flex-end;pointer-events:all}aside>:last-child{margin-top:auto}.params{display:none;flex-direction:column;gap:1rem;pointer-events:none}.params>*{pointer-events:all}",
  map: '{"version":3,"file":"Params.svelte","sources":["Params.svelte"],"sourcesContent":["<script>\\r\\n  import Ratio from \\"./Ratio.svelte\\";\\r\\n  import Factor from \\"./Factor.svelte\\";\\r\\n  import Render from \\"./render/Render.svelte\\";\\r\\n  import ToggleParams from \\"./ToggleParams.svelte\\";\\r\\n  import { paramsIsVisible } from \\"/src/stores/ui\\";\\r\\n<\/script>\\r\\n\\r\\n<aside>\\r\\n  <div class=\\"params\\" class:show-hidden-element={$paramsIsVisible}>\\r\\n    <Ratio />\\r\\n    <Factor />\\r\\n    <Render />\\r\\n  </div>\\r\\n  <ToggleParams />\\r\\n</aside>\\r\\n\\r\\n<style lang=\\"scss\\" global>:global(aside) {\\n  display: flex;\\n  flex-direction: column;\\n  gap: 1rem;\\n  grid-area: params;\\n}\\n:global(aside) > :global(*) {\\n  align-self: flex-end;\\n  pointer-events: all;\\n}\\n:global(aside) > :global(:last-child) {\\n  margin-top: auto;\\n}\\n\\n:global(.params) {\\n  display: none;\\n  flex-direction: column;\\n  gap: 1rem;\\n  pointer-events: none;\\n}\\n:global(.params) > :global(*) {\\n  pointer-events: all;\\n}</style>\\r\\n"],"names":[],"mappings":"AAiBkC,KAAK,AAAE,CAAC,AACxC,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,GAAG,CAAE,IAAI,CACT,SAAS,CAAE,MAAM,AACnB,CAAC,AACO,KAAK,AAAC,CAAW,CAAC,AAAE,CAAC,AAC3B,UAAU,CAAE,QAAQ,CACpB,cAAc,CAAE,GAAG,AACrB,CAAC,AACO,KAAK,AAAC,CAAW,WAAW,AAAE,CAAC,AACrC,UAAU,CAAE,IAAI,AAClB,CAAC,AAEO,OAAO,AAAE,CAAC,AAChB,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,GAAG,CAAE,IAAI,CACT,cAAc,CAAE,IAAI,AACtB,CAAC,AACO,OAAO,AAAC,CAAW,CAAC,AAAE,CAAC,AAC7B,cAAc,CAAE,GAAG,AACrB,CAAC"}'
};
var Params = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $paramsIsVisible, $$unsubscribe_paramsIsVisible;
  $$unsubscribe_paramsIsVisible = subscribe(paramsIsVisible, (value) => $paramsIsVisible = value);
  $$result.css.add(css$4);
  $$unsubscribe_paramsIsVisible();
  return `<aside><div class="${["params", $paramsIsVisible ? "show-hidden-element" : ""].join(" ").trim()}">${validate_component(Ratio, "Ratio").$$render($$result, {}, {}, {})}
    ${validate_component(Factor, "Factor").$$render($$result, {}, {}, {})}
    ${validate_component(Render, "Render").$$render($$result, {}, {}, {})}</div>
  ${validate_component(ToggleParams, "ToggleParams").$$render($$result, {}, {}, {})}
</aside>`;
});
var css$3 = {
  code: "footer.svelte-fnof4a{font-size:13px;text-align:right;grid-area:footer;justify-self:right;pointer-events:all}h1.svelte-fnof4a{display:inline;font:inherit}a.svelte-fnof4a{font:inherit;color:inherit;cursor:pointer}",
  map: '{"version":3,"file":"Footer.svelte","sources":["Footer.svelte"],"sourcesContent":["<footer>\\r\\n  <h1>ephy</h1>\\r\\n  \xA9 2021 <a href=\\"https://github.com/leodeslf\\">leodeslf</a>\\r\\n</footer>\\r\\n\\r\\n<style lang=\\"scss\\">footer {\\n  font-size: 13px;\\n  text-align: right;\\n  grid-area: footer;\\n  justify-self: right;\\n  pointer-events: all;\\n}\\n\\nh1 {\\n  display: inline;\\n  font: inherit;\\n}\\n\\na {\\n  font: inherit;\\n  color: inherit;\\n  cursor: pointer;\\n}</style>\\r\\n"],"names":[],"mappings":"AAKmB,MAAM,cAAC,CAAC,AACzB,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,KAAK,CACjB,SAAS,CAAE,MAAM,CACjB,YAAY,CAAE,KAAK,CACnB,cAAc,CAAE,GAAG,AACrB,CAAC,AAED,EAAE,cAAC,CAAC,AACF,OAAO,CAAE,MAAM,CACf,IAAI,CAAE,OAAO,AACf,CAAC,AAED,CAAC,cAAC,CAAC,AACD,IAAI,CAAE,OAAO,CACb,KAAK,CAAE,OAAO,CACd,MAAM,CAAE,OAAO,AACjB,CAAC"}'
};
var Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$3);
  return `<footer class="${"svelte-fnof4a"}"><h1 class="${"svelte-fnof4a"}">ephy</h1>
  \xA9 2021 <a href="${"https://github.com/leodeslf"}" class="${"svelte-fnof4a"}">leodeslf</a>
</footer>`;
});
var css$2 = {
  code: '.ui.svelte-1h6wivf{padding:1rem 2rem;position:absolute;width:100%;height:100%;pointer-events:none;display:grid;gap:1rem;grid-template-areas:"params" "footer";grid-template-rows:auto min-content;z-index:1}',
  map: '{"version":3,"file":"UI.svelte","sources":["UI.svelte"],"sourcesContent":["<script>\\r\\n  import Params from \\"./params/Params.svelte\\";\\r\\n  import Footer from \\"./Footer.svelte\\";\\r\\n<\/script>\\r\\n\\r\\n<div class=\\"ui\\">\\r\\n  <Params />\\r\\n  <Footer />\\r\\n</div>\\r\\n\\r\\n<style lang=\\"scss\\">.ui {\\n  padding: 1rem 2rem;\\n  position: absolute;\\n  width: 100%;\\n  height: 100%;\\n  pointer-events: none;\\n  display: grid;\\n  gap: 1rem;\\n  grid-template-areas: \\"params\\" \\"footer\\";\\n  grid-template-rows: auto min-content;\\n  z-index: 1;\\n}</style>\\r\\n"],"names":[],"mappings":"AAUmB,GAAG,eAAC,CAAC,AACtB,OAAO,CAAE,IAAI,CAAC,IAAI,CAClB,QAAQ,CAAE,QAAQ,CAClB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,cAAc,CAAE,IAAI,CACpB,OAAO,CAAE,IAAI,CACb,GAAG,CAAE,IAAI,CACT,mBAAmB,CAAE,QAAQ,CAAC,QAAQ,CACtC,kBAAkB,CAAE,IAAI,CAAC,WAAW,CACpC,OAAO,CAAE,CAAC,AACZ,CAAC"}'
};
var UI = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$2);
  return `<div class="${"ui svelte-1h6wivf"}">${validate_component(Params, "Params").$$render($$result, {}, {}, {})}
  ${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}
</div>`;
});
var Cycloid = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $height, $$unsubscribe_height;
  let $width, $$unsubscribe_width;
  $$unsubscribe_height = subscribe(height, (value) => $height = value);
  $$unsubscribe_width = subscribe(width, (value) => $width = value);
  let canvas;
  $$unsubscribe_height();
  $$unsubscribe_width();
  return `<canvas class="${"cycloid-canvas"}"${add_attribute("width", $width, 0)}${add_attribute("height", $height, 0)}${add_attribute("this", canvas, 0)}></canvas>`;
});
var css$1 = {
  code: ".debug-canvas.svelte-2v4qi9{display:none;position:absolute;pointer-events:none}",
  map: '{"version":3,"file":"Debug.svelte","sources":["Debug.svelte"],"sourcesContent":["<script>\\r\\n  import { afterUpdate, tick } from \\"svelte\\";\\r\\n  import { width, height } from \\"/src/stores/size\\";\\r\\n  import { setDebugContext } from \\"/src/js/debug\\";\\r\\n\\r\\n  let canvas;\\r\\n\\r\\n  async function resetDebugContext() {\\r\\n    // Canvas could be updating to fit the window.\\r\\n    await tick();\\r\\n\\r\\n    const context = canvas.getContext(\\"2d\\");\\r\\n    context.translate($width * 0.5, $height * 0.5);\\r\\n    context.lineCap = \\"round\\";\\r\\n    context.lineWidth = 1;\\r\\n\\r\\n    setDebugContext(context);\\r\\n  }\\r\\n\\r\\n  afterUpdate(() => resetDebugContext());\\r\\n<\/script>\\r\\n\\r\\n<canvas\\r\\n  class=\\"debug-canvas\\"\\r\\n  width={$width}\\r\\n  height={$height}\\r\\n  bind:this={canvas}\\r\\n/>\\r\\n\\r\\n<style lang=\\"scss\\">.debug-canvas {\\n  display: none;\\n  position: absolute;\\n  pointer-events: none;\\n}</style>\\r\\n"],"names":[],"mappings":"AA6BmB,aAAa,cAAC,CAAC,AAChC,OAAO,CAAE,IAAI,CACb,QAAQ,CAAE,QAAQ,CAClB,cAAc,CAAE,IAAI,AACtB,CAAC"}'
};
var Debug = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $height, $$unsubscribe_height;
  let $width, $$unsubscribe_width;
  $$unsubscribe_height = subscribe(height, (value) => $height = value);
  $$unsubscribe_width = subscribe(width, (value) => $width = value);
  let canvas;
  $$result.css.add(css$1);
  $$unsubscribe_height();
  $$unsubscribe_width();
  return `<canvas class="${"debug-canvas svelte-2v4qi9"}"${add_attribute("width", $width, 0)}${add_attribute("height", $height, 0)}${add_attribute("this", canvas, 0)}></canvas>`;
});
var css = {
  code: ":root{background-color:#fff;color:#aaa;font-family:monospace;font-size:15px;line-height:1.5}*{margin:0;padding:0;box-sizing:border-box}html{filter:invert(0)}.button{background-color:#eaeaff;border:none;border:1px solid #5869ff20;border-radius:6px;box-shadow:0 1px 3px #5869ff60;color:#0b05be;cursor:pointer;display:grid;font:inherit;height:2.5rem;place-content:center;user-select:none;width:2.5rem}.button.on,.button:active{background-color:#c9cbff;box-shadow:none;color:#000}.button input[type=checkbox]{display:none}.button__group{display:flex;gap:0.5rem}.note{background-color:#eaeaff;border:1px solid #5869ff20;border-radius:3px;color:#0b05be;cursor:default;display:flex;flex-direction:column;margin:-1px;margin-bottom:0.5rem;padding:0.25rem 0.5rem}.params__group{flex-direction:column;padding:0.5rem 1rem 1rem}.params__group h2{color:#6c6c6c;font:inherit;font-size:13px;margin-bottom:0.5rem;text-transform:uppercase}.params__group>p{display:flex;justify-content:right}.params__group>p label{padding-right:1rem}.params__group>p input{background-color:#fff;border:1px solid #0001;border-radius:3px;font:inherit;line-height:inherit;margin:-1px;padding-left:4px;width:10ch}.show-hidden-element,.layer-canvas.debug-is-visible .debug-canvas{display:flex}.white-box,.params__group{background-color:#fff;border-radius:6px;box-shadow:0 1px 3px #5869ff30;color:#2135e2;display:flex;gap:0.5rem;padding:1rem}.layer-canvas{display:grid;user-select:none}",
  map: '{"version":3,"file":"Canvas.svelte","sources":["Canvas.svelte"],"sourcesContent":["<script>\\r\\n  import Cycloid from \\"./Cycloid.svelte\\";\\r\\n  import Debug from \\"./Debug.svelte\\";\\r\\n  import { scale } from \\"/src/stores/size\\";\\r\\n  import { debugIsVisible } from \\"/src/stores/ui\\";\\r\\n\\r\\n  const minScale = 0.001;\\r\\n\\r\\n  // Zoom in/out.\\r\\n  function updateScale(e) {\\r\\n    $scale -= e.deltaY * 0.001;\\r\\n    if ($scale < minScale) $scale = minScale;\\r\\n  }\\r\\n<\/script>\\r\\n\\r\\n<div\\r\\n  class=\\"layer-canvas\\"\\r\\n  on:mousewheel={updateScale}\\r\\n  class:debug-is-visible={$debugIsVisible}\\r\\n>\\r\\n  <Cycloid />\\r\\n  <Debug />\\r\\n</div>\\r\\n\\r\\n<style lang=\\"scss\\" global>:global(:root) {\\n  background-color: #fff;\\n  color: #aaa;\\n  font-family: monospace;\\n  font-size: 15px;\\n  line-height: 1.5;\\n}\\n\\n:global(*) {\\n  margin: 0;\\n  padding: 0;\\n  box-sizing: border-box;\\n}\\n\\n:global(html) {\\n  filter: invert(0);\\n}\\n\\n:global(.button) {\\n  background-color: #eaeaff;\\n  border: none;\\n  border: 1px solid #5869ff20;\\n  border-radius: 6px;\\n  box-shadow: 0 1px 3px #5869ff60;\\n  color: #0b05be;\\n  cursor: pointer;\\n  display: grid;\\n  font: inherit;\\n  height: 2.5rem;\\n  place-content: center;\\n  user-select: none;\\n  width: 2.5rem;\\n}\\n:global(.button.on), :global(.button:active) {\\n  background-color: #c9cbff;\\n  box-shadow: none;\\n  color: #000;\\n}\\n:global(.button) :global(input[type=checkbox]) {\\n  display: none;\\n}\\n\\n:global(.button__group) {\\n  display: flex;\\n  gap: 0.5rem;\\n}\\n\\n:global(.note) {\\n  background-color: #eaeaff;\\n  border: 1px solid #5869ff20;\\n  border-radius: 3px;\\n  color: #0b05be;\\n  cursor: default;\\n  display: flex;\\n  flex-direction: column;\\n  margin: -1px;\\n  margin-bottom: 0.5rem;\\n  padding: 0.25rem 0.5rem;\\n}\\n\\n:global(.params__group) {\\n  flex-direction: column;\\n  padding: 0.5rem 1rem 1rem;\\n}\\n:global(.params__group) :global(h2) {\\n  color: #6c6c6c;\\n  font: inherit;\\n  font-size: 13px;\\n  margin-bottom: 0.5rem;\\n  text-transform: uppercase;\\n}\\n:global(.params__group) > :global(p) {\\n  display: flex;\\n  justify-content: right;\\n}\\n:global(.params__group) > :global(p) :global(label) {\\n  padding-right: 1rem;\\n}\\n:global(.params__group) > :global(p) :global(input) {\\n  background-color: #fff;\\n  border: 1px solid #0001;\\n  border-radius: 3px;\\n  font: inherit;\\n  line-height: inherit;\\n  margin: -1px;\\n  padding-left: 4px;\\n  width: 10ch;\\n}\\n\\n:global(.show-hidden-element), :global(.layer-canvas.debug-is-visible) :global(.debug-canvas) {\\n  display: flex;\\n}\\n\\n:global(.white-box), :global(.params__group) {\\n  background-color: #fff;\\n  border-radius: 6px;\\n  box-shadow: 0 1px 3px #5869ff30;\\n  color: #2135e2;\\n  display: flex;\\n  gap: 0.5rem;\\n  padding: 1rem;\\n}\\n\\n:global(.layer-canvas) {\\n  display: grid;\\n  user-select: none;\\n}</style>\\r\\n"],"names":[],"mappings":"AAwBkC,KAAK,AAAE,CAAC,AACxC,gBAAgB,CAAE,IAAI,CACtB,KAAK,CAAE,IAAI,CACX,WAAW,CAAE,SAAS,CACtB,SAAS,CAAE,IAAI,CACf,WAAW,CAAE,GAAG,AAClB,CAAC,AAEO,CAAC,AAAE,CAAC,AACV,MAAM,CAAE,CAAC,CACT,OAAO,CAAE,CAAC,CACV,UAAU,CAAE,UAAU,AACxB,CAAC,AAEO,IAAI,AAAE,CAAC,AACb,MAAM,CAAE,OAAO,CAAC,CAAC,AACnB,CAAC,AAEO,OAAO,AAAE,CAAC,AAChB,gBAAgB,CAAE,OAAO,CACzB,MAAM,CAAE,IAAI,CACZ,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,SAAS,CAC3B,aAAa,CAAE,GAAG,CAClB,UAAU,CAAE,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,SAAS,CAC/B,KAAK,CAAE,OAAO,CACd,MAAM,CAAE,OAAO,CACf,OAAO,CAAE,IAAI,CACb,IAAI,CAAE,OAAO,CACb,MAAM,CAAE,MAAM,CACd,aAAa,CAAE,MAAM,CACrB,WAAW,CAAE,IAAI,CACjB,KAAK,CAAE,MAAM,AACf,CAAC,AACO,UAAU,AAAC,CAAU,cAAc,AAAE,CAAC,AAC5C,gBAAgB,CAAE,OAAO,CACzB,UAAU,CAAE,IAAI,CAChB,KAAK,CAAE,IAAI,AACb,CAAC,AACO,OAAO,AAAC,CAAC,AAAQ,oBAAoB,AAAE,CAAC,AAC9C,OAAO,CAAE,IAAI,AACf,CAAC,AAEO,cAAc,AAAE,CAAC,AACvB,OAAO,CAAE,IAAI,CACb,GAAG,CAAE,MAAM,AACb,CAAC,AAEO,KAAK,AAAE,CAAC,AACd,gBAAgB,CAAE,OAAO,CACzB,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,SAAS,CAC3B,aAAa,CAAE,GAAG,CAClB,KAAK,CAAE,OAAO,CACd,MAAM,CAAE,OAAO,CACf,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,MAAM,CAAE,IAAI,CACZ,aAAa,CAAE,MAAM,CACrB,OAAO,CAAE,OAAO,CAAC,MAAM,AACzB,CAAC,AAEO,cAAc,AAAE,CAAC,AACvB,cAAc,CAAE,MAAM,CACtB,OAAO,CAAE,MAAM,CAAC,IAAI,CAAC,IAAI,AAC3B,CAAC,AACO,cAAc,AAAC,CAAC,AAAQ,EAAE,AAAE,CAAC,AACnC,KAAK,CAAE,OAAO,CACd,IAAI,CAAE,OAAO,CACb,SAAS,CAAE,IAAI,CACf,aAAa,CAAE,MAAM,CACrB,cAAc,CAAE,SAAS,AAC3B,CAAC,AACO,cAAc,AAAC,CAAW,CAAC,AAAE,CAAC,AACpC,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,KAAK,AACxB,CAAC,AACO,cAAc,AAAC,CAAW,CAAC,AAAC,CAAC,AAAQ,KAAK,AAAE,CAAC,AACnD,aAAa,CAAE,IAAI,AACrB,CAAC,AACO,cAAc,AAAC,CAAW,CAAC,AAAC,CAAC,AAAQ,KAAK,AAAE,CAAC,AACnD,gBAAgB,CAAE,IAAI,CACtB,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CACvB,aAAa,CAAE,GAAG,CAClB,IAAI,CAAE,OAAO,CACb,WAAW,CAAE,OAAO,CACpB,MAAM,CAAE,IAAI,CACZ,YAAY,CAAE,GAAG,CACjB,KAAK,CAAE,IAAI,AACb,CAAC,AAEO,oBAAoB,AAAC,CAAU,8BAA8B,AAAC,CAAC,AAAQ,aAAa,AAAE,CAAC,AAC7F,OAAO,CAAE,IAAI,AACf,CAAC,AAEO,UAAU,AAAC,CAAU,cAAc,AAAE,CAAC,AAC5C,gBAAgB,CAAE,IAAI,CACtB,aAAa,CAAE,GAAG,CAClB,UAAU,CAAE,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,SAAS,CAC/B,KAAK,CAAE,OAAO,CACd,OAAO,CAAE,IAAI,CACb,GAAG,CAAE,MAAM,CACX,OAAO,CAAE,IAAI,AACf,CAAC,AAEO,aAAa,AAAE,CAAC,AACtB,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,IAAI,AACnB,CAAC"}'
};
var Canvas = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_scale;
  let $debugIsVisible, $$unsubscribe_debugIsVisible;
  $$unsubscribe_scale = subscribe(scale, (value) => value);
  $$unsubscribe_debugIsVisible = subscribe(debugIsVisible, (value) => $debugIsVisible = value);
  $$result.css.add(css);
  $$unsubscribe_scale();
  $$unsubscribe_debugIsVisible();
  return `<div class="${["layer-canvas", $debugIsVisible ? "debug-is-visible" : ""].join(" ").trim()}">${validate_component(Cycloid, "Cycloid").$$render($$result, {}, {}, {})}
  ${validate_component(Debug, "Debug").$$render($$result, {}, {}, {})}
</div>`;
});
var Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<main>${validate_component(UI, "UI").$$render($$result, {}, {}, {})}
  ${validate_component(Canvas, "Canvas").$$render($$result, {}, {}, {})}</main>`;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes
});

// .svelte-kit/vercel/entry.js
init();
var entry_default = async (req, res) => {
  const { pathname, searchParams } = new URL(req.url || "", "http://localhost");
  let body;
  try {
    body = await getRawBody(req);
  } catch (err) {
    res.statusCode = err.status || 400;
    return res.end(err.reason || "Invalid request body");
  }
  const rendered = await render({
    method: req.method,
    headers: req.headers,
    path: pathname,
    query: searchParams,
    rawBody: body
  });
  if (rendered) {
    const { status, headers, body: body2 } = rendered;
    return res.writeHead(status, headers).end(body2);
  }
  return res.writeHead(404).end();
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
