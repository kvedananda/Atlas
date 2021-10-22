import { createSlice } from '@reduxjs/toolkit';
import { createWells, createRowHeaders, createColumnHeaders } from 'models';

const initialSaveTime = {
  savePending: false,
  saveError: '',
  lastSaveTime: null,
};

const initialState = {
  loading: false,
  initialized: false,
  initializationError: '',
  id: null,
  name: '',
  description: '',
  createdTime: null,
  updatedTime: null,
  plates: [],
  views: [],
  plateTypes: [],
  plateToCopy: null,
  settings: {
    containerSize: {
      size: 120,
      innerPadding: 4,
      outerPadding: 2,
    },
  },
  status: '',
  ...initialSaveTime,
};

const activity = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = true;
      state.initialized = false;
      state.initializationError = '';
    },
    setInitializationError(state, action) {
      state.loading = false;
      state.initialized = false;
      state.initializationError = action.payload.error;
    },
    setActivity(state, action) {
      const { activity } = action.payload;
      Object.assign(state, activity);
      state.loading = false;
      state.initialized = true;
      state.initializationError = '';
      const positioned = state.plates.find((plate) => {
        return (
          plate.overviewPositionLeft !== null &&
          plate.overviewPositionLeft !== undefined &&
          plate.overviewPositionTop !== null &&
          plate.overviewPositionTop !== undefined
        );
      });
      if (!positioned) {
        arrangePlates(state.plates);
      }
    },
    autoArrangePlates(state, action) {
      arrangePlates(state.plates);
    },
    setPlateTypes(state, action) {
      state.plateTypes = action.payload.plateTypes;
    },
    setPlateType(state, action) {
      const { plateIds, plateTypeId } = action.payload;
      const plateType = state.plateTypes.find(
        (plateType) => plateType.id === plateTypeId
      );
      let width, height;
      if (plateType.numCols === 12 && plateType.numRows === 8) {
        width = 130;
        height = 150;
      }
      if (plateType.numCols === 24 && plateType.numRows === 16) {
        width = 240;
        height = 230;
      }
      plateIds.forEach((plateId) => {
        const plate = findPlate(plateId, state.plates);
        plate.plateTypeId = plateType.id;
        plate.numRows = plateType.numRows;
        plate.numCols = plateType.numCols;
        plate.wells = createWells(plateType.numRows, plateType.numCols);
        plate.rowHeaders = createRowHeaders(plateType.numRows);
        plate.columnHeaders = createColumnHeaders(plateType.numCols);
        plate.overviewWidth = width;
        plate.overviewHeight = height;
      });
    },
    updatePlateWells(state, action) {
      const { plateId, updatedWells } = action.payload;
      const plate = findPlate(plateId, state.plates);
      updatedWells.forEach((updatedWell) => {
        const plateWell = findWell(updatedWell.id, plate.wells);
        plateWell.components = updatedWell.components;
      });
    },
    setPlateName(state, action) {
      const { plateId, name } = action.payload;
      const plate = findPlate(plateId, state.plates);
      plate.name = name;
    },
    updatePlateDetails(state, action) {
      const { plateId, details } = action.payload;
      const plate = findPlate(plateId, state.plates);
      Object.assign(plate, details);
    },
    setPlateToCopy(state, action) {
      state.plateToCopy = action.payload.plateId;
    },
    pasteToPlates(state, action) {
      if (state.plateToCopy) {
        const plateToCopy = findPlate(state.plateToCopy, state.plates);
        if (plateToCopy && plateToCopy.plateTypeId) {
          const targetPlateIds = action.payload.plateIds;
          targetPlateIds.forEach((targetPlateId) => {
            const targetPlate = findPlate(targetPlateId, state.plates);
            targetPlate.plateTypeId = plateToCopy.plateTypeId;
            targetPlate.numCols = plateToCopy.numCols;
            targetPlate.numRows = plateToCopy.numRows;
            targetPlate.columnHeaders = plateToCopy.columnHeaders;
            targetPlate.rowHeaders = plateToCopy.rowHeaders;
            targetPlate.overviewWidth = plateToCopy.overviewWidth;
            targetPlate.overviewHeight = plateToCopy.overviewHeight;
            targetPlate.wells = JSON.parse(JSON.stringify(plateToCopy.wells));
          });
        }
      }
    },
    setPlateSelections(state, action) {
      const { selections } = action.payload;
      state.plates.forEach((plate) => {
        plate.selected = selections.includes(plate.id);
      });
    },
    addView(state, action) {
      const { view } = action.payload;
      if (!view.name) {
        let highestUntitled = 0;
        state.views.forEach((view) => {
          if (view.name.startsWith('View')) {
            const viewNum = parseInt(view.name.substring(4));
            if (viewNum > highestUntitled) highestUntitled = viewNum;
          }
        });
        view.name = `View${highestUntitled + 1}`;
      }
      state.views.push(view);
    },
    setActiveView(state, action) {
      const { viewId } = action.payload;
      let activeView;
      state.views.forEach((view) => {
        if (view.id === viewId) {
          view.active = true;
          activeView = view;
        } else view.active = false;
      });
      if (
        activeView.type === 'PlateTable' ||
        activeView.type === 'PlateEditor'
      ) {
        let selectedFound = false;
        state.plates.forEach((plate, i) => {
          if (plate.selected && !selectedFound) {
            selectedFound = true;
          } else {
            plate.selected = false;
          }
          if (plate.wells) {
            plate.wells.forEach((well) => {
              well.selected = false;
            });
          }
        });
        if (!selectedFound) state.plates[0].selected = true;
      } else {
        state.plates.forEach((plate, i) => {
          plate.selected = false;
          if (plate.wells) {
            plate.wells.forEach((well) => {
              well.selected = false;
            });
          }
        });
      }
    },
    setActiveViewWithPlate(state, action) {
      const { viewType, plateId } = action.payload;
      state.views.forEach((view) => {
        if (view.type === viewType) {
          view.active = true;
        } else view.active = false;
      });
      state.plates.forEach((plate) => {
        if (plate.id === plateId) {
          plate.selected = true;
        } else plate.selected = false;
      });
    },
    setViewPlateSelections(state, action) {
      const { viewId, selections } = action.payload;
      const view = findView(viewId, state.views);
      selections.forEach((selection) => {
        const viewPlate = findPlate(selection.plateId, view.viewPlates);
        viewPlate.selected = selection.selected;
      });
    },
    selectAllPlateWells(state, action) {
      const { plateIds } = action.payload;
      plateIds.forEach((plateId) => {
        const plate = findPlate(plateId, state.plates);
        plate.wells.forEach((well) => {
          well.selected = true;
        });
      });
    },
    deselectAllPlateWells(state, action) {
      const { plateIds } = action.payload;
      plateIds.forEach((plateId) => {
        const plate = findPlate(plateId, state.plates);
        plate.wells.forEach((well) => {
          well.selected = false;
        });
      });
    },
    selectInteriorPlateWells(state, action) {
      const { plateIds } = action.payload;
      plateIds.forEach((plateId) => {
        const plate = findPlate(plateId, state.plates);
        for (let i = 0; i < plate.numRows; i++) {
          const start = i * plate.numCols;
          const end = (i + 1) * plate.numCols;
          const row = plate.wells.slice(start, end);
          row.forEach((well, j) => {
            if (i === 0 || i === plate.numRows - 1) {
              well.selected = false;
            } else {
              if (j === 0 || j === plate.numCols - 1) {
                well.selected = false;
              } else well.selected = true;
            }
          });
        }
      });
    },
    selectBorderPlateWells(state, action) {
      const { plateIds } = action.payload;
      plateIds.forEach((plateId) => {
        const plate = findPlate(plateId, state.plates);
        for (let i = 0; i < plate.numRows; i++) {
          const start = i * plate.numCols;
          const end = (i + 1) * plate.numCols;
          const row = plate.wells.slice(start, end);
          row.forEach((well, j) => {
            if (i === 0 || i === plate.numRows - 1) {
              well.selected = true;
            } else {
              if (j === 0 || j === plate.numCols - 1) {
                well.selected = true;
              } else well.selected = false;
            }
          });
        }
      });
    },
    togglePlateWellSelections(state, action) {
      const { wellIds, plateIds } = action.payload;
      plateIds.forEach((plateId) => {
        const plate = findPlate(plateId, state.plates);
        const status = { selected: false, deselected: false };
        const wellsToUpdate = [];
        wellIds.forEach((wellId) => {
          const well = findWell(wellId, plate.wells);
          if (well.selected) {
            status.selected = true;
          } else {
            status.deselected = true;
          }
          wellsToUpdate.push(well);
        });
        const newSelectionStatus =
          (status.selected && status.deselected) || !status.selected
            ? true
            : false;
        wellsToUpdate.forEach((well) => {
          well.selected = newSelectionStatus;
        });
      });
    },
    removeWellComponent(state, action) {
      const { plateId, wellId, componentId } = action.payload;
      const plate = findPlate(plateId, state.plates);
      const well = findWell(wellId, plate.wells);
      const wellIndex = well.components.findIndex(
        (component) => component.id === componentId
      );
      well.components.splice(wellIndex, 1);
    },
    removeComponentTypesFromWells(state, action) {
      const { componentTypes, wellIds, plateIds } = action.payload;
      plateIds.forEach((plateId) => {
        const plate = findPlate(plateId, state.plates);
        wellIds.forEach((wellId) => {
          const well = findWell(wellId, plate.wells);
          well.components = well.components.filter(
            (component) => !componentTypes.includes(component.type)
          );
        });
      });
    },
    resetState(state, action) {
      Object.assign(state, initialState);
    },
    setSavePending(state, action) {
      state.savePending = true;
      state.saveError = '';
      state.lastSaveTime = null;
    },
    setLastSaveTime(state, action) {
      state.savePending = false;
      state.saveError = '';
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

function findPlate(plateId, plates) {
  return plates.find((plate) => plate.id === plateId);
}

function findWell(wellId, wells) {
  return wells.find((well) => well.id === wellId);
}

function findView(viewId, views) {
  return views.find((view) => view.id === viewId);
}

function arrangePlates(plates) {
  let currentLeft = 10,
    spacing = 10,
    top = 10;
  plates.forEach((plate) => {
    plate.overviewPositionLeft = currentLeft;
    plate.overviewPositionTop = top;
    currentLeft += plate.overviewWidth + spacing;
  });
}
