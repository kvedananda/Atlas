import { createSelector } from 'redux-starter-kit';
import { getActivePlate, getSelectedWells } from './plateFunctions';

/* Activity Search */
export const selectActivitySearchSearchTerm = createSelector([
  'activitySearch.searchTerm',
]);
export const selectActivitySearchLoading = createSelector([
  'activitySearch.loading',
]);
export const selectActivitySearchError = createSelector([
  'activitySearch.error',
]);
export const selectActivitySearchResults = createSelector([
  'activitySearch.results',
]);

/* Activities */
export const selectActivityInitialized = createSelector([
  'activity.initialized',
]);
export const selectActivityInitializationError = createSelector([
  'activity.initializationError',
]);
export const selectActivity = createSelector(['activities.activity']);
export const selectActivityId = createSelector(['activity.id']);
export const selectActivityName = createSelector(['activity.name']);
export const selectActivityDescription = createSelector([
  'activities.activity.data.description',
]);
export const selectActivityContainerCollections = createSelector([
  'activities.activity.containerCollections',
]);
export const selectActivityPublishStatus = createSelector([
  'activities.publishStatus',
]);
export const selectActivityPublishedContainerCollectionDetails = createSelector(
  ['activities.publishedContainerCollectionDetails']
);
export const selectActivityPlateSize = createSelector(['activities.plateSize']);
export const selectActivityContainerCollectionsStale = createSelector([
  'activities.containerCollectionsStale',
]);

/* Editor */
export const selectEditorInitialized = createSelector(['editor.initialized']);
export const selectEditorInitializationError = createSelector([
  'editor.initializationError',
]);
export const selectEditorPlates = createSelector(['editor.plates']);
export const selectEditorActivePlate = createSelector(
  ['editor.plates'],
  getActivePlate
);
export const selectEditorSelectedWellsFromActivePlate = createSelector(
  ['editor.plates'],
  plates => {
    const activePlate = getActivePlate(plates);
    if (activePlate) {
      return getSelectedWells(activePlate);
    } else return null;
  }
);
export const selectEditorSettings = createSelector(['editor.settings']);
export const selectEditorBarcodes = createSelector(['editor.barcodes']);
export const selectEditorComponentCounts = createSelector([
  'editor.componentCounts',
]);
export const selectEditorSaveStatus = createSelector(['editor.saveStatus']);
export const selectEditorLastSaveTime = createSelector(['editor.lastSaveTime']);
export const selectEditorComponents = createSelector([
  'editorComponents.components',
]);
export const selectEditorToolComponentsValid = createSelector([
  'editorTools.toolComponentsValid',
]);
export const selectEditorClickMode = createSelector(['editorTools.clickMode']);
export const selectEditorToolComponents = createSelector([
  'editorTools.toolComponents',
]);
export const selectEditorSelectedToolComponents = createSelector(
  ['editorTools.toolComponents'],
  toolComponents => {
    return toolComponents.filter(component => component.selected);
  }
);
export const selectEditorClearMode = createSelector(['editorTools.clearMode']);

/* Print */
export const selectPrintInitialized = createSelector(['print.initialized']);
export const selectPrintInitializationError = createSelector([
  'print.initializationError',
]);
export const selectPrintPlates = createSelector(['print.plates']);
