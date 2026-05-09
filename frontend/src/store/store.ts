import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../auth/authSlice";
import titleApplicationsReducer from "../features/titleApplications/titleApplicationsSlice.ts";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        titleApplications: titleApplicationsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;