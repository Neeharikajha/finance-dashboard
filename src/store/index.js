import { configureStore } from "@reduxjs/toolkit";
import widgetsReducer from "./widgetsSlice";

// Load persisted state (client-side only)
function loadPersistedState() {
  if (typeof window === "undefined") return undefined;
  try {
    const serialized = localStorage.getItem("finance_dashboard_state");
    if (!serialized) return undefined;
    return JSON.parse(serialized);
  } catch {
    return undefined;
  }
}

function savePersistedState(state) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("finance_dashboard_state", JSON.stringify(state));
  } catch {
    // ignore write errors
  }
}

export const store = configureStore({
  reducer: {
    widgets: widgetsReducer,
  },
  preloadedState: loadPersistedState(),
});

// Persist on any state change (debounced)
let persistTimer = null;
store.subscribe(() => {
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    const state = store.getState();
    savePersistedState({ widgets: state.widgets });
  }, 300);
});
