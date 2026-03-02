/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GenAILiveClient } from "../genai-live-client";
import { LiveClientOptions } from "../types";
import { AudioStreamer } from "../audio-streamer";
import { audioContext } from "../utils";
import VolMeterWorket from "../worklets/vol-meter";
import { LiveConnectConfig } from "@google/genai";

export type UseLiveAPIResults = {
  client: GenAILiveClient;
  setConfig: (config: LiveConnectConfig) => void;
  config: LiveConnectConfig;
  model: string;
  setModel: (model: string) => void;
  connected: boolean;
  connect: (config?: LiveConnectConfig) => Promise<void>;
  disconnect: () => Promise<void>;
  volume: number;
};

export function useLiveAPI(options: LiveClientOptions): UseLiveAPIResults {
  const [client] = useState(() => new GenAILiveClient({
    ...options,
    httpOptions: { ...options.httpOptions, apiVersion: "v1alpha" }
  }));
  const audioStreamerRef = useRef<AudioStreamer | null>(null);

  const [model, setModel] = useState<string>("models/gemini-2.5-flash-native-audio");
  const [config, setConfig] = useState<LiveConnectConfig>({});
  const [connected, setConnected] = useState(false);
  const [volume, setVolume] = useState(0);

  // register audio for streaming server -> speakers
  useEffect(() => {
    if (!audioStreamerRef.current) {
      audioContext({ id: "audio-out" })
        .then((audioCtx: AudioContext) => {
          audioStreamerRef.current = new AudioStreamer(audioCtx);
          audioStreamerRef.current
            .addWorklet<any>("vumeter-out", VolMeterWorket, (ev: any) => {
              setVolume(ev.data.volume);
            })
            .catch(err => console.warn("[LIVE API] Failed to add volume worklet:", err));
        })
        .catch(err => {
          console.warn("[LIVE API] Failed to initialize AudioStreamer (no output device?):", err);
        });
    }
  }, [audioStreamerRef]);

  useEffect(() => {
    const onOpen = () => {
      setConnected(true);
      if (audioStreamerRef.current) {
        audioStreamerRef.current.resume().catch(e => console.warn("[LIVE API] Failed to resume audio:", e));
      }
    };

    const onClose = () => {
      setConnected(false);
    };

    const onError = (error: ErrorEvent) => {
      console.warn("error", error);
    };

    const stopAudioStreamer = () => audioStreamerRef.current?.stop();

    const onAudio = (data: ArrayBuffer) => {
      if (Math.random() < 0.1) console.log("[LIVE API HOOK] Receiving audio chunk, size:", data.byteLength);
      if (audioStreamerRef.current) {
        audioStreamerRef.current.resume().catch(e => console.warn("Failed to resume audio on chunk:", e));
        audioStreamerRef.current.addPCM16(new Uint8Array(data));
      }
    };

    client
      .on("error", onError)
      .on("open", onOpen)
      .on("close", onClose)
      .on("interrupted", stopAudioStreamer)
      .on("audio", onAudio);

    return () => {
      client
        .off("error", onError)
        .off("open", onOpen)
        .off("close", onClose)
        .off("interrupted", stopAudioStreamer)
        .off("audio", onAudio);
    };
  }, [client]);

  const configRef = useRef<LiveConnectConfig>(config);
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const connect = useCallback(async (newConfig?: LiveConnectConfig) => {
    const finalConfig = newConfig || configRef.current;
    console.log("[LIVE API HOOK] connect called with model:", model);
    if (!finalConfig) {
      throw new Error("config has not been set");
    }
    try {
      console.log("[LIVE API HOOK] Disconnecting previous session if any...");
      await client.disconnect();
      console.log("[LIVE API HOOK] Calling client.connect()...");
      const result = await client.connect(model, finalConfig);
      console.log("[LIVE API HOOK] client.connect() finished with result:", result);
      if (!result) {
        throw new Error("Conexión rechazada por el cliente GenAI.");
      }
    } catch (e) {
      console.error("[LIVE API HOOK] Error during connect:", e);
      throw e;
    }
  }, [client, model]);

  const disconnect = useCallback(async () => {
    await client.disconnect();
    setConnected(false);
  }, [client]);

  return {
    client,
    config,
    setConfig,
    model,
    setModel,
    connected,
    connect,
    disconnect,
    volume,
  };
}
