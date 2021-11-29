import { connect } from 'react-redux';
import { Overview } from './Overview';
import { activity } from 'store';

const mapState = (state, props) => {
  return {
    copyDisabled: activity.selectCopyDisabled(state),
    pasteDisabled: activity.selectPasteDisabled(state),
    plates: activity.selectPlates(state),
    plateTypes: activity.selectPlateTypes(state),
    selectedPlateIds: activity.selectSelectedPlateIds(state),
    setPlateTypeError: activity.selectSetPlateTypeError(state),
    swapComponentsDisabled: activity.selectSwapComponentsDisabled(state),
  };
};

const mapDispatch = {
  onAutoArrangePlates: activity.autoArrangePlates,
  onCloseSetPlateTypeError: activity.clearSetPlateTypeError,
  onCopyPlate: activity.setPlateIdToCopy,
  onPastePlate: activity.pasteToPlates,
  onPlateSelectionChange: activity.setPlateSelections,
  onSavePlateName: activity.setPlateName,
  onSetPlateType: activity.setPlateType,
  onSwapComponents: activity.swapComponents,
  onSwitchToView: activity.setActiveView,
  onUpdatePlateDetails: activity.updatePlateDetails,
};

const connected = connect(mapState, mapDispatch)(Overview);
export { connected as Overview };
