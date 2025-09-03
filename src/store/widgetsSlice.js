import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  widgets: [],
};

const widgetsSlice = createSlice({
  name: "widgets",
  initialState,
  reducers: {
    addWidget: (state, action) => {
      state.widgets.push({
        ...action.payload,
        id: Date.now(),
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        color: "#ffffff",
      });
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

export const { addWidget, removeWidget, editWidget, updateWidgetLayout } =
  widgetsSlice.actions;

export default widgetsSlice.reducer;
