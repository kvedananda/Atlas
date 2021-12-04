import axios from 'axios';
import { API_URL } from 'config/api';
import { ComponentService } from 'services/ComponentService';

export async function searchActivities(searchTerm) {
  const response = await axios.get(
    API_URL + '/api/atlas/_search/experiments/' + searchTerm
  );
  return response.data;
}

export async function fetchActivity(name) {
  const response = await axios.get(API_URL + '/api/atlas/activity/' + name);
  return response.data;
}

export async function deleteActivity(name) {
  const response = await axios.delete(API_URL + '/api/atlas/activity/' + name);
  return response.data;
}

export async function saveActivity(name, plates) {
  const exportedPlates = exportPlates(plates);
  const postData = {
    name,
    plates: exportedPlates,
  };
  console.log(postData);
  const response = await axios.post(
    API_URL + '/api/atlas/activity/' + name,
    postData
  );
  return response.data;
}

export async function fetchPlateTypes() {
  const response = await axios.get(API_URL + '/api/atlas/platetypes');
  return response.data;
}

export async function searchComponents(searchTerm) {
  const response = await axios.get(
    API_URL + '/api/atlas/components/_search/' + searchTerm
  );
  return response.data;
}

export async function setPlateType(plateIds, plateTypeId) {
  const postData = plateIds.map((plateId) => {
    return {
      id: plateId,
      plateTypeId,
    };
  });
  const response = await axios.post(
    API_URL + '/api/atlas/plate/setType',
    postData
  );
  return response.data;
}

export function exportPlates(plates) {
  return plates.map((plate) => {
    return exportPlate(plate);
  });
}

function exportPlate(plate) {
  const exportedPlate = {
    id: plate.id,
    barcode: plate.barcode,
    name: plate.name,
    plateNumber: plate.plateNumber,
    overviewPositionLeft: plate.overviewPositionLeft,
    overviewPositionTop: plate.overviewPositionTop,
    wells: [],
  };
  if (plate.wells) {
    exportedPlate.wells = plate.wells.map((well) => {
      const exportedWell = {
        id: well.id,
        row: well.row,
        column: well.column,
        components: [],
      };
      if (well.components && well.components.length) {
        exportedWell.components = well.components.map((component) =>
          ComponentService.exportComponent(component)
        );
      }
      return exportedWell;
    });
  }
  return exportedPlate;
}