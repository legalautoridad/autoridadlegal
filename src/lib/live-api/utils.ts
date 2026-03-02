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

export type GetAudioContextOptions = AudioContextOptions & {
  id?: string;
};

const map: Map<string, AudioContext> = new Map();

export const audioContext: (
  options?: GetAudioContextOptions
) => Promise<AudioContext> = async (options?: GetAudioContextOptions) => {
  // Lazily create the interaction promise on the client side only
  if (typeof window === "undefined") {
    throw new Error("AudioContext is only available in the browser.");
  }

  if (!(window as any).__didInteract) {
    (window as any).__didInteract = new Promise((res) => {
      window.addEventListener("pointerdown", res, { once: true });
      window.addEventListener("keydown", res, { once: true });
    });
  }

  const didInteract = (window as any).__didInteract;

  try {
    const a = new Audio();
    a.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
    // We try to play, but we don't block or crash if it fails (e.g. no speakers)
    await a.play().catch(() => { });

    if (options?.id && map.has(options.id)) {
      const ctx = map.get(options.id);
      if (ctx) return ctx;
    }
    const ctx = new AudioContext(options);
    if (options?.id) map.set(options.id, ctx);
    return ctx;
  } catch (e) {
    // If we fail here, we still try to wait for interaction as a fallback
    await didInteract().catch(() => { });

    if (options?.id && map.has(options.id)) {
      const ctx = map.get(options.id);
      if (ctx) return ctx;
    }
    const ctx = new AudioContext(options);
    if (options?.id) map.set(options.id, ctx);
    return ctx;
  }
};

export function base64ToArrayBuffer(base64: string) {
  let binaryString: string;
  if (typeof window !== "undefined" && window.atob) {
    binaryString = window.atob(base64);
  } else {
    binaryString = Buffer.from(base64, 'base64').toString('binary');
  }

  var bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
