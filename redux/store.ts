import { configureStore } from '@reduxjs/toolkit';
import mailReducer from './mailSlice';

export const store = configureStore({
    reducer: {
        mail: mailReducer,
    },
});

// Type definitions
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
