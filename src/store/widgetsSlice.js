// // import { createSlice } from "@reduxjs/toolkit";

// // const initialState = { widgets: [] };

// // const widgetsSlice = createSlice({
// //   name: "widgets",
// //   initialState,
// //   reducers: {
// //     addWidget: (state, action) => state.widgets.push(action.payload),
// //     removeWidget: (state, action) =>
// //       (state.widgets = state.widgets.filter((w) => w.id !== action.payload)),
// //     editWidget: (state, action) => {
// //       const index = state.widgets.findIndex((w) => w.id === action.payload.id);
// //       if (index !== -1) state.widgets[index] = action.payload;
// //     },
// //   },
// // });

// // export const { addWidget, removeWidget, editWidget } = widgetsSlice.actions;
// // export default widgetsSlice.reducer;

// import { createSlice } from "@reduxjs/toolkit";

// const initialState = { widgets: [] };

// const widgetsSlice = createSlice({
//   name: "widgets",
//   initialState,
//   reducers: {
//     addWidget: (state, action) => {
//       state.widgets.push(action.payload); // mutate only
//     },
//     removeWidget: (state, action) => {
//       state.widgets = state.widgets.filter((w) => w.id !== action.payload);
//     },
//   },
// });

// export const { addWidget, removeWidget } = widgetsSlice.actions;
// export default widgetsSlice.reducer;


// widgetsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = { widgets: [] };

const widgetsSlice = createSlice({
  name: "widgets",
  initialState,
  reducers: {
    addWidget: (state, action) => {
      state.widgets.push(action.payload);
    },
    removeWidget: (state, action) => {
      state.widgets = state.widgets.filter((w) => w.id !== action.payload);
    },
    editWidget: (state, action) => {
      const index = state.widgets.findIndex((w) => w.id === action.payload.id);
      if (index !== -1) state.widgets[index] = action.payload;
    },
  },
});

export const { addWidget, removeWidget, editWidget } = widgetsSlice.actions;
export default widgetsSlice.reducer;
