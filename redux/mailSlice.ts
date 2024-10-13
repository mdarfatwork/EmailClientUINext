import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const loadStateFromLocalStorage = (): MailState => {
    if (typeof window === 'undefined') {
        // If running on the server, return the initial state directly
        return { readEmails: [], favoriteEmails: [] };
    }
    
    try {
        const serializedState = localStorage.getItem('mailState');
        if (serializedState === null) {
            return { readEmails: [], favoriteEmails: [] };  // Default state if nothing is saved
        }
        return JSON.parse(serializedState);
    } catch (error) {
        console.error('Could not load state from localStorage:', error);
        return { readEmails: [], favoriteEmails: [] };  // Default state if an error occurs
    }
};

// Save state to localStorage
const saveStateToLocalStorage = (state: MailState) => {
    if (typeof window === 'undefined') {
        // If running on the server, do not attempt to save to localStorage
        return;
    }
    
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('mailState', serializedState);
    } catch (error) {
        console.error('Could not save state to localStorage:', error);
    }
};

interface MailState {
    readEmails: string[];
    favoriteEmails: string[];
}

const initialState: MailState = loadStateFromLocalStorage();

const mailSlice = createSlice({
    name: 'mail',
    initialState,
    reducers: {
        markAsRead: (state, action: PayloadAction<string>) => {
            if (!state.readEmails.includes(action.payload)) {
                state.readEmails.push(action.payload);
                saveStateToLocalStorage(state);
            }
        },
        markAsFavorite: (state, action: PayloadAction<string>) => {
            if (!state.favoriteEmails.includes(action.payload)) {
                state.favoriteEmails.push(action.payload);
                saveStateToLocalStorage(state);
            }
        },
        unmarkAsFavorite: (state, action: PayloadAction<string>) => {
            state.favoriteEmails = state.favoriteEmails.filter(emailId => emailId !== action.payload);
            saveStateToLocalStorage(state);
        },
    },
});

export const { markAsRead, markAsFavorite, unmarkAsFavorite } = mailSlice.actions;
export default mailSlice.reducer;