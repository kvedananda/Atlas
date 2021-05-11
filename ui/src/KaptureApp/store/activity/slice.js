import { createSlice } from '@reduxjs/toolkit';

const initialSaveTime = {
  savePending: false,
  saveError: null,
  lastSaveTime: null,
};

const initialState = {
  initialized: false,
  initializationError: null,
  id: null,
  name: null,
  description: null,
  containerCollections: null,
  data: null,
  containerCollectionsStale: true,
  publishSuccess: false,
  publishError: null,
  publishedContainerCollectionDetails: null,
  ...initialSaveTime,
};

const activity = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    setInitialized(state, action) {
      state.initialized = action.payload.initialized;
    },
    setInitializationError(state, action) {
      state.initializationError = action.payload.error;
    },
    resetState(state, action) {
      Object.assign(state, initialState);
    },
    setActivity(state, action) {
      const { activity } = action.payload;
      Object.assign(state, activity);
      state.initialized = true;
      state.containerCollectionsStale = false;
    },
    setContainerCollectionsStale(state, action) {
      state.containerCollectionsStale = action.payload.stale;
    },
    setPublishSuccess(state, action) {
      state.publishSuccess = action.payload.publishSuccess;
    },
    setPublishError(state, action) {
      state.publishError = action.payload.publishError;
    },
    setPublishedContainerCollectionDetails(state, action) {
      state.publishedContainerCollectionDetails =
        action.payload.containerCollectionDetails;
    },
    resetPublishState(state, action) {
      state.publishSuccess = false;
      state.publishError = null;
      state.publishedContainerCollectionDetails = null;
    },
    setSavePending(state, action) {
      state.savePending = true;
      state.saveError = null;
      state.lastSaveTime = null;
    },
    setLastSaveTime(state, action) {
      state.savePending = false;
      state.saveError = null;
      state.lastSaveTime = action.payload.lastSaveTime;
    },
    setSaveError(state, action) {
      state.savePending = false;
      state.saveError = action.payload.error;
    },
    resetSaveTime(state, action) {
      Object.assign(state, initialSaveTime);
    },
  },
});

export const { actions, reducer } = activity;
