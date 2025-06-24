// Utility for webllm engine management and chat completion with IndexedDB caching
// @ts-ignore: web-llm is a global variable injected by the MLC Web
import * as webllm from "https://esm.run/@mlc-ai/web-llm";

const appConfig = webllm.prebuiltAppConfig;
appConfig.useIndexedDBCache = true;

let engine: webllm.MLCEngineInterface | null = null;

export async function getEngine(
  selectedModel = "Llama-3.2-3B-Instruct-q4f16_1-MLC",
  progressCallback?: (report: any) => void
): Promise<webllm.MLCEngineInterface> {
  if (engine) return engine;
  const modelCached = await webllm.hasModelInCache(selectedModel, appConfig);
  if (modelCached) {
    // If cached, create engine and reload from cache (fast)
    engine = await webllm.CreateMLCEngine(selectedModel, {
      initProgressCallback:
        progressCallback || ((report: any) => console.log(report.text)),
      logLevel: "INFO",
      appConfig,
    });
    await engine.reload(selectedModel);
  } else {
    // Not cached, create engine (will download and cache)
    engine = await webllm.CreateMLCEngine(selectedModel, {
      initProgressCallback:
        progressCallback || ((report: any) => console.log(report.text)),
      logLevel: "INFO",
      appConfig,
    });
  }
  if (!engine) throw new Error("Failed to create MLC engine");
  return engine;
}

export async function chatCompletion(
  request: webllm.ChatCompletionRequest,
  selectedModel = "Llama-3.2-3B-Instruct-q4f16_1-MLC",
  progressCallback?: (report: any) => void
): Promise<any> {
  const engine = await getEngine(selectedModel, progressCallback);
  return engine.chatCompletion(request);
}

export async function hasModelInCache(
  selectedModel = "Llama-3.2-3B-Instruct-q4f16_1-MLC"
) {
  return webllm.hasModelInCache(selectedModel, appConfig);
}

export async function deleteModelAllInfoInCache(
  selectedModel = "Llama-3.2-3B-Instruct-q4f16_1-MLC"
) {
  return webllm.deleteModelAllInfoInCache(selectedModel, appConfig);
}

export async function reloadModel(
  selectedModel = "Llama-3.2-3B-Instruct-q4f16_1-MLC"
) {
  if (!engine) throw new Error("Engine not initialized");
  return engine.reload(selectedModel);
}

export function isEngineLoaded() {
  return !!engine;
}

export type { webllm };
