import { editorImportActions, selectors } from 'KaptureApp/store';
import { api } from 'KaptureApp/api';
import {
  COMPONENT_TYPE_COMMUNITY,
  COMPONENT_TYPE_COMPOUND,
  COMPONENT_TYPE_MEDIUM,
  COMPONENT_TYPE_SUPPLEMENT,
} from 'KaptureApp/config/componentTypes';
import { GRID_ROW_HEADERS } from 'KaptureApp/config/grid';
import { createComponent } from 'KaptureApp/utils/toolComponentFunctions';

const {
  fetchCommunityByName,
  searchCommunities,
  fetchCompoundByName,
  searchCompounds,
  fetchMediumByName,
  searchMedia,
  fetchSupplementByName,
  searchSupplements,
} = api;

const {
  selectEditorImportImportedComponents,
  selectEditorComponentImportErrors,
} = selectors;

const {
  setImportPending,
  setImportResults,
  setImportError,
  resetState,
} = editorImportActions;

export const resetEditorImport = resetState;

export const importComponents = (componentType, componentNames, timepoints) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setImportPending());
      let fetchMethod;
      let searchMethod;
      if (componentType === COMPONENT_TYPE_COMMUNITY) {
        fetchMethod = fetchCommunityByName;
        searchMethod = searchCommunities;
      } else if (componentType === COMPONENT_TYPE_COMPOUND) {
        fetchMethod = fetchCompoundByName;
        searchMethod = searchCompounds;
      } else if (componentType === COMPONENT_TYPE_MEDIUM) {
        fetchMethod = fetchMediumByName;
        searchMethod = searchMedia;
      } else if (componentType === COMPONENT_TYPE_SUPPLEMENT) {
        fetchMethod = fetchSupplementByName;
        searchMethod = searchSupplements;
      }
      const positions = [];
      const imported = [];
      const importErrors = [];
      const componentIndex = {};
      componentNames.forEach((row, i) => {
        row.forEach((name, j) => {
          if (name && name !== 'BLANK') {
            if (!componentIndex[name]) {
              componentIndex[name] = name;
            }
            positions.push({
              row: GRID_ROW_HEADERS[i],
              column: j + 1,
              component: name,
            });
          }
        });
      });
      const uniqueComponentsNames = Object.keys(componentIndex);
      const promises = uniqueComponentsNames.map((name) => {
        return fetchMethod(name);
      });
      const responses = await Promise.all(promises);
      responses.forEach((response, i) => {
        const name = uniqueComponentsNames[i];
        if (response.data.length) {
          componentIndex[name] = response.data[0];
        } else {
          componentIndex[name] = null;
        }
      });
      positions.forEach((position, i) => {
        const component = componentIndex[position.component];
        if (component) {
          imported.push({
            ...position,
            component: component,
          });
        } else {
          importErrors.push({
            ...position,
          });
        }
      });
      const importedComponents = imported.map((position) => {
        return {
          row: position.row,
          column: position.column,
          component: createComponent(
            position.component,
            componentType,
            timepoints
          ),
        };
      });
      const errorIndex = {};
      importErrors.forEach((error) => {
        if (!errorIndex[error.component]) {
          errorIndex[error.component] = error.component;
        }
      });
      const uniqueErrorNames = Object.keys(errorIndex);
      const errorPromises = uniqueErrorNames.map((component) => {
        return searchMethod(component);
      });
      const errorResponses = await Promise.all(errorPromises);
      errorResponses.forEach((response, i) => {
        const name = uniqueErrorNames[i];
        errorIndex[name] = response.data;
      });
      importErrors.forEach((error, i) => {
        const data = errorIndex[error.component];
        if (data) {
          error.options = data.map((component) => {
            return createComponent(component, componentType, timepoints);
          });
        }
      });
      importErrors.sort((a, b) => {
        if (a.column > b.column) return 1;
        if (a.column < b.column) return -1;
        if (a.row > b.row) return 1;
        if (a.row < b.row) return -1;
        else return 0;
      });
      dispatch(
        setImportResults({
          importedComponents,
          componentImportErrors: importErrors,
        })
      );
    } catch (error) {
      dispatch(setImportError({ error: error.message }));
    }
  };
};

export const fixComponent = (row, column, componentId) => {
  return (dispatch, getState) => {
    const importedComponents = selectEditorImportImportedComponents(getState());
    const importErrors = selectEditorComponentImportErrors(getState());
    const errorIndex = importErrors.findIndex((importError) => {
      return importError.row === row && importError.column === column;
    });
    const error = importErrors[errorIndex];
    const selectedComponent = error.options.find((option) => {
      return option.id === componentId;
    });
    const newImportedComponents = importedComponents.slice();
    newImportedComponents.push({
      row: row,
      column: column,
      component: selectedComponent,
    });
    const newErrors = importErrors.slice();
    newErrors.splice(errorIndex, 1);
    dispatch(
      setImportResults({
        importedComponents: newImportedComponents,
        componentImportErrors: newErrors,
      })
    );
  };
};

export const fixAllComponents = (row, column, componentId) => {
  return (dispatch, getState) => {
    const importedComponents = selectEditorImportImportedComponents(getState());
    const importErrors = selectEditorComponentImportErrors(getState());
    const newImportedComponents = importedComponents.slice();
    const newErrors = [];
    const error = importErrors.find((importError) => {
      return importError.row === row && importError.column === column;
    });
    const selectedComponent = error.options.find((option) => {
      return option.id === componentId;
    });
    importErrors.forEach((importError) => {
      if (importError.component === error.component) {
        newImportedComponents.push({
          row: importError.row,
          column: importError.column,
          component: selectedComponent,
        });
      } else {
        newErrors.push(importError);
      }
    });
    dispatch(
      setImportResults({
        importedComponents: newImportedComponents,
        componentImportErrors: newErrors,
      })
    );
  };
};
