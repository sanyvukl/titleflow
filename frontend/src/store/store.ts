import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../auth/authSlice";
import liensReducer from "../features/liens/liensSlice";
import documentsReducer from "../features/documents/documentSlice";
import dmvReviewReducer from "../features/dmvReview/dmvReviewSlice";
import auditLogsReducer from "../features/auditLogs/auditLogsSlice";
import titleApplicationsReducer from "../features/titleApplications/titleApplicationsSlice.ts";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        titleApplications: titleApplicationsReducer,
        documents: documentsReducer,
        dmvReview: dmvReviewReducer,
        auditLogs: auditLogsReducer,
        liens: liensReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;