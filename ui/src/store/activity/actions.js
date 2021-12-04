import { actions } from './slice';
import * as selectors from './selectors';
import * as gridActions from './gridActions';
import * as viewActions from './viewActions';
import { api } from 'api';
import { createPlate } from 'models';

export const { resetState: resetActivity, resetSaveTime } = actions;

export function loadActivity(name) {
  return async (dispatch, getState) => {
    dispatch(actions.setLoading());
    // try {
    const plateTypes = await api.fetchPlateTypes();
    dispatch(actions.setPlateTypes({ plateTypes }));
    const activityData = await api.fetchActivity(name);
    let plates = [];
    if (activityData.plates && activityData.plates.length) {
      plates = activityData.plates.map((plate) => {
        return createPlate(plate, activityData.components);
      });
    }
    const activity = {
      id: activityData.id,
      name: activityData.name,
      startDate: activityData.startDate,
      updateDate: activityData.updateDate,
      plates,
      views: [
        viewActions.getOverview(true),
        viewActions.getPlateEditor(false),
        viewActions.getPlateTable(false),
      ],
    };
    dispatch(actions.setActivity({ activity }));
    // } catch (error) {
    //   dispatch(actions.setInitializationError({ error: error.message }));
    // }
  };
}

export function saveActivity(name) {
  return async (dispatch, getState) => {
    dispatch(actions.setSavePending());
    try {
      const plates = selectors.selectPlates(getState());
      const response = await api.saveActivity(name, plates);
      dispatch(actions.setSaveSuccess({ updateDate: response.updateDate }));
    } catch (error) {
      dispatch(actions.setSaveError({ error: error.message }));
    }
  };
}

export function deleteActivity(name) {
  return async (dispatch, getState) => {
    dispatch(actions.setDeleteActivityStatus({ status: 'Deleting...' }));
    try {
      await api.deleteActivity(name);
      dispatch(actions.setDeleteActivityStatus({ status: 'Activity deleted' }));
    } catch (error) {
      dispatch(actions.setDeleteActivityStatus({ status: error.message }));
    }
  };
}

export const autoArrangePlates = actions.autoArrangePlates;
export const setPlateType = gridActions.setPlateType;
export const clearSetPlateTypeError = actions.clearSetPlateTypeError;
export const setPlateName = gridActions.setPlateName;
export const setPlateIdToCopy = gridActions.setPlateIdToCopy;
export const pasteToPlates = gridActions.pasteToPlates;
export const swapComponents = gridActions.swapComponents;
export const updatePlateDetails = gridActions.updatePlateDetails;
export const updatePlateProperties = gridActions.updatePlateProperties;
export const setPlateSelections = gridActions.setPlateSelections;
export const selectAllPlateWells = gridActions.selectAllPlateWells;
export const deselectAllPlateWells = gridActions.deselectAllPlateWells;
export const selectInteriorPlateWells = gridActions.selectInteriorPlateWells;
export const selectBorderPlateWells = gridActions.selectBorderPlateWells;
export const updatePlateWells = gridActions.updatePlateWells;
export const togglePlateWellSelections = gridActions.togglePlateWellSelections;
export const removeComponentFromWell = gridActions.removeComponentFromWell;
export const removeComponentTypesFromWells =
  gridActions.removeComponentTypesFromWells;
export const setGridComponents = gridActions.setGridComponents;

export const setActiveView = viewActions.setActiveView;
export const updateViewData = viewActions.updateViewData;