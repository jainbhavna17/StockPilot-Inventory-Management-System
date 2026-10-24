import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import http, { TOKEN_KEY, errorMessage } from '../../api/http.js';
import { DEMO_CREDENTIALS } from '../../utils/constants.js';

// Log in as one of the demo roles: 'admin' | 'manager' | 'viewer'
export const loginDemo = createAsyncThunk('auth/loginDemo', async (userKey, { rejectWithValue }) => {
  try {
    const creds = DEMO_CREDENTIALS[userKey] || DEMO_CREDENTIALS.admin;
    const { data } = await http.post('/auth/login', creds);
    localStorage.setItem(TOKEN_KEY, data.token);
    return data;
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

// Restore the session from a stored JWT
export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await http.get('/auth/me');
    return data.user;
  } catch (err) {
    localStorage.removeItem(TOKEN_KEY);
    return rejectWithValue(errorMessage(err));
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try {
    await http.post('/auth/logout');
  } catch (err) {
    // ignore: token may already be invalid
  } finally {
    localStorage.removeItem(TOKEN_KEY);
  }
});

const initialState = {
  currentUser: null,
  sessionToken: localStorage.getItem(TOKEN_KEY) || '',
  isAuthenticated: false,
  bootstrapped: !localStorage.getItem(TOKEN_KEY), // true when there is no session to restore
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginDemo.fulfilled, (state, action) => {
        state.currentUser = action.payload.user;
        state.sessionToken = action.payload.token;
        state.isAuthenticated = true;
        state.bootstrapped = true;
        state.error = null;
      })
      .addCase(loginDemo.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        state.bootstrapped = true;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.currentUser = null;
        state.sessionToken = '';
        state.isAuthenticated = false;
        state.bootstrapped = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null;
        state.sessionToken = '';
        state.isAuthenticated = false;
      });
  },
});

export default authSlice.reducer;
