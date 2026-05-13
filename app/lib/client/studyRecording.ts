"use client";

export type StudyRecordingMode = "microphone" | "browser-tab";
type RecordingStatus = "idle" | "recording" | "stopping";

export interface StudyRecordingResult {
  id: string;
  mode: StudyRecordingMode;
  durationMs: number;
  transcript: string;
  capturedAt: string;
  mediaUrl: string | null;
  mimeType: string | null;
  fileName: string;
}

export interface StudyRecordingSnapshot {
  status: RecordingStatus;
  mode: StudyRecordingMode | null;
  startedAt: number | null;
  transcript: string;
  lastResult: StudyRecordingResult | null;
  previewStream: MediaStream | null;
}

type RecordingStore = {
  status: RecordingStatus;
  mode: StudyRecordingMode | null;
  startedAt: number | null;
  transcript: string;
  lastResult: StudyRecordingResult | null;
  recorder: MediaRecorder | null;
  stream: MediaStream | null;
  chunks: BlobPart[];
  mimeType: string | null;
  speechRecognizer: SpeechRecognitionLike | null;
  pendingStop:
    | null
    | { resolve: (value: StudyRecordingResult | null) => void; reject: (reason?: unknown) => void };
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

const STORE_KEY = "__studyRecordingStore";
const EVENT_NAME = "study-recording-state";

function initialStore(): RecordingStore {
  return {
    status: "idle",
    mode: null,
    startedAt: null,
    transcript: "",
    lastResult: null,
    recorder: null,
    stream: null,
    chunks: [],
    mimeType: null,
    speechRecognizer: null,
    pendingStop: null,
  };
}

function getStore(): RecordingStore {
  const globalAny = globalThis as typeof globalThis & {
    [STORE_KEY]?: RecordingStore;
  };
  if (!globalAny[STORE_KEY]) {
    globalAny[STORE_KEY] = initialStore();
  }
  return globalAny[STORE_KEY]!;
}

function emitState() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: getStudyRecordingSnapshot() }));
}

function cleanupStream(stream: MediaStream | null) {
  if (!stream) return;
  stream.getTracks().forEach((track) => track.stop());
}

function stopSpeechRecognizer(store: RecordingStore) {
  if (!store.speechRecognizer) return;
  try {
    store.speechRecognizer.stop();
  } catch {
    // swallow recognition stop errors
  }
  store.speechRecognizer = null;
}

function getSpeechRecognitionCtor() {
  if (typeof window === "undefined") return null;
  const windowAny = window as typeof window & {
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    SpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return windowAny.SpeechRecognition || windowAny.webkitSpeechRecognition || null;
}

function tryStartSpeechRecognition(store: RecordingStore) {
  if (store.mode !== "microphone") return;
  const Ctor = getSpeechRecognitionCtor();
  if (!Ctor) return;
  try {
    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.onresult = (event: unknown) => {
      const eventAny = event as { results?: ArrayLike<ArrayLike<{ transcript: string }>> };
      const results = eventAny.results;
      if (!results) return;
      let text = "";
      for (let idx = 0; idx < results.length; idx += 1) {
        const item = results[idx]?.[0];
        if (item?.transcript) {
          text += `${item.transcript} `;
        }
      }
      store.transcript = text.trim();
      emitState();
    };
    recognition.onerror = () => undefined;
    recognition.onend = () => undefined;
    recognition.start();
    store.speechRecognizer = recognition;
  } catch {
    // speech recognition is optional enhancement
  }
}

function formatRecordingFileName(mode: StudyRecordingMode, timestamp: string) {
  const date = new Date(timestamp);
  const stamp = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}_${String(date.getHours()).padStart(2, "0")}-${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
  return `${mode === "browser-tab" ? "tab-recording" : "mic-recording"}-${stamp}.webm`;
}

function createRecordingResult(store: RecordingStore): StudyRecordingResult | null {
  if (!store.mode || !store.startedAt) return null;
  const capturedAt = new Date().toISOString();
  const blob =
    store.chunks.length > 0
      ? new Blob(store.chunks, { type: store.mimeType || "video/webm" })
      : null;
  const mediaUrl = blob ? URL.createObjectURL(blob) : null;
  return {
    id: `recording_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    mode: store.mode,
    durationMs: Math.max(Date.now() - store.startedAt, 0),
    transcript: store.transcript.trim(),
    capturedAt,
    mediaUrl,
    mimeType: blob ? blob.type || store.mimeType : null,
    fileName: formatRecordingFileName(store.mode, capturedAt),
  };
}

export function getStudyRecordingSnapshot(): StudyRecordingSnapshot {
  const store = getStore();
  return {
    status: store.status,
    mode: store.mode,
    startedAt: store.startedAt,
    transcript: store.transcript,
    lastResult: store.lastResult,
    previewStream: store.stream,
  };
}

export function onStudyRecordingChange(handler: (snapshot: StudyRecordingSnapshot) => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }
  const wrapped = (event: Event) => {
    const detail = (event as CustomEvent<StudyRecordingSnapshot>).detail;
    handler(detail || getStudyRecordingSnapshot());
  };
  window.addEventListener(EVENT_NAME, wrapped);
  return () => window.removeEventListener(EVENT_NAME, wrapped);
}

export async function startStudyRecording(mode: StudyRecordingMode) {
  const store = getStore();
  if (store.status === "recording" || store.status === "stopping") {
    throw new Error("A recording is already in progress.");
  }
  const mediaDevices = navigator.mediaDevices;
  if (!mediaDevices) {
    throw new Error("Media capture is not supported in this browser.");
  }

  const stream =
    mode === "microphone"
      ? await mediaDevices.getUserMedia({ audio: true })
      : await mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });

  const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
    ? "video/webm;codecs=vp9,opus"
    : MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")
      ? "video/webm;codecs=vp8,opus"
      : MediaRecorder.isTypeSupported("video/webm")
        ? "video/webm"
        : "";
  const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
  store.mode = mode;
  store.startedAt = Date.now();
  store.status = "recording";
  store.transcript = "";
  store.chunks = [];
  store.mimeType = mimeType || recorder.mimeType || null;
  store.stream = stream;
  store.recorder = recorder;
  store.lastResult = null;
  stopSpeechRecognizer(store);
  tryStartSpeechRecognition(store);

  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      store.chunks.push(event.data);
    }
  };

  recorder.onstop = () => {
    const result = createRecordingResult(store);
    stopSpeechRecognizer(store);
    cleanupStream(store.stream);
    store.status = "idle";
    store.mode = null;
    store.startedAt = null;
    store.recorder = null;
    store.stream = null;
    store.chunks = [];
    store.mimeType = null;
    store.lastResult = result;
    emitState();
    if (store.pendingStop) {
      store.pendingStop.resolve(result);
      store.pendingStop = null;
    }
  };

  stream.getTracks().forEach((track) => {
    track.onended = () => {
      if (store.recorder && store.recorder.state !== "inactive") {
        store.status = "stopping";
        stopSpeechRecognizer(store);
        emitState();
        store.recorder.stop();
      }
    };
  });

  recorder.start(1000);
  emitState();
}

export async function stopStudyRecording(): Promise<StudyRecordingResult | null> {
  const store = getStore();
  if (!store.recorder || store.recorder.state === "inactive") {
    return store.lastResult;
  }
  if (store.pendingStop) {
    return new Promise((resolve, reject) => {
      const existing = store.pendingStop!;
      store.pendingStop = {
        resolve: (value) => {
          existing.resolve(value);
          resolve(value);
        },
        reject: (reason) => {
          existing.reject(reason);
          reject(reason);
        },
      };
    });
  }

  store.status = "stopping";
  emitState();
  return new Promise((resolve, reject) => {
    store.pendingStop = { resolve, reject };
    try {
      stopSpeechRecognizer(store);
      store.recorder!.stop();
    } catch (error) {
      store.pendingStop = null;
      reject(error);
    }
  });
}
