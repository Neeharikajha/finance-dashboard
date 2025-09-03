import { configureStore } from "@reduxjs/toolkit";
import widgetsReducer from "./widgetsSlice";

export const store = configureStore({
  reducer: {
    widgets: widgetsReducer,
  },
});
