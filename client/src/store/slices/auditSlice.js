import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import http, { errorMessage } from '../../api/http.js';

export const fetchAuditLogs = createAsyncThunk('audit/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await http.get('/audit');
    return data;
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

// Client-side security events (e.g. CSV_EXPORT); the server stamps user / ip / time
export const logClientAction = createAsyncThunk(
  'audit/logClientAction',
  async ({ action, details }, { dispatch }) => {
    try {
      await http.post('/audit', { action, details });
      dispatch(fetchAuditLogs());
    } catch (err) {
      // non-fatal
    }
  }
);

const auditSlice = createSlice({
  name: 'audit',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {
    clearAudit: (state) => {
      state.items = [];
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearAudit } = auditSlice.actions;
export default auditSlice.reducer;
