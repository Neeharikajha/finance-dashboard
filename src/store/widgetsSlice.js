import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  widgets: [],
};

const widgetsSlice = createSlice({
  name: "widgets",
  initialState,
  reducers: {
    setWidgets: (state, action) => {
      // Replace entire widgets array (used for import)
      const incoming = Array.isArray(action.payload) ? action.payload : [];
      state.widgets = incoming.map((w) => ({
        id: w.id || Date.now() + Math.random(),
        x: w.x ?? 0,
        y: w.y ?? 0,
        w: w.w ?? 4,
        h: w.h ?? 3,
        color: w.color || "#ffffff",
        type: w.type || "table",
        symbol: w.symbol || "",
        apiEndpoint: w.apiEndpoint || "",
        apiKey: w.apiKey || "",
        financeCardType: w.financeCardType || "watchlist",
        chartType: w.chartType || "line",
        chartInterval: w.chartInterval || "1d",
        title: w.title || "",
        width: w.width,
        height: w.height,
      }));
    },
    mergeWidgets: (state, action) => {
      const incoming = Array.isArray(action.payload) ? action.payload : [];
      const existingIds = new Set(state.widgets.map((w) => String(w.id)));
      const maxY = state.widgets.reduce((acc, w) => Math.max(acc, (w.y || 0) + (w.h || 1)), 0);
      const totalCols = 12;
      incoming.forEach((w, idx) => {
        let newId = w.id || Date.now() + Math.random();
        if (existingIds.has(String(newId))) {
          newId = Date.now() + Math.random();
        }
        const widthUnits = Math.min(totalCols, w.w ?? 4);
        const heightUnits = w.h ?? 3;
        const x = (idx * widthUnits) % totalCols;
        const rowOffset = Math.floor((idx * widthUnits) / totalCols);
        const merged = {
          id: newId,
          x,
          y: (maxY || 0) + rowOffset * (heightUnits + 1),
          w: widthUnits,
          h: heightUnits,
          color: w.color || "#ffffff",
          type: w.type || "table",
          symbol: w.symbol || "",
          apiEndpoint: w.apiEndpoint || "",
          apiKey: w.apiKey || "",
          financeCardType: w.financeCardType || "watchlist",
          chartType: w.chartType || "line",
          chartInterval: w.chartInterval || "1d",
          title: w.title || "",
          width: w.width,
          height: w.height,
        };
        state.widgets.push(merged);
      });
    },
    addWidget: (state, action) => {
      const newWidget = {
        ...action.payload,
        id: action.payload.id || Date.now(),
        x: 0,
        y: 0,
        w: action.payload.w || 4,
        h: action.payload.h || 3,
        color: action.payload.color || "#ffffff",
        type: action.payload.type || "table",
        symbol: action.payload.symbol || "",
        apiEndpoint: action.payload.apiEndpoint || "",
        apiKey: action.payload.apiKey || "",
        financeCardType: action.payload.financeCardType || "watchlist",
        chartType: action.payload.chartType || "line",
        chartInterval: action.payload.chartInterval || "1d",
      };
      state.widgets.push(newWidget);
    },
    removeWidget: (state, action) => {
      state.widgets = state.widgets.filter((w) => w.id !== action.payload);
    },
    editWidget: (state, action) => {
      const index = state.widgets.findIndex((w) => w.id === action.payload.id);
      if (index !== -1) {
        state.widgets[index] = { ...state.widgets[index], ...action.payload };
      }
    },
    updateWidgetLayout: (state, action) => {
      // action.payload = array of {i, x, y, w, h}
      action.payload.forEach((l) => {
        const widget = state.widgets.find((w) => w.id.toString() === l.i);
        if (widget) {
          widget.x = l.x;
          widget.y = l.y;
          widget.w = l.w;
          widget.h = l.h;
        }
      });
    },
  },
});

export const { setWidgets, mergeWidgets, addWidget, removeWidget, editWidget, updateWidgetLayout } =
  widgetsSlice.actions;

export default widgetsSlice.reducer;
