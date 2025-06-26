import type { ISerializedRootStore } from "../stores/RootStore";

const isBrowser = typeof window !== "undefined";

export const loadState = (): ISerializedRootStore | undefined => {
  if (!isBrowser) return undefined;

  try {
    const raw = localStorage.getItem("hits-store");
    if (!raw) return undefined;
    const state = JSON.parse(raw);
    return state || undefined;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const saveState = (state: ISerializedRootStore): void => {
  if (!isBrowser) return;
  localStorage.setItem("hits-store", JSON.stringify(state));
};
