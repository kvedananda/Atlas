import { connect } from 'react-redux';
import { Overview } from './Overview';
import { activity } from 'KaptureApp/store';

const mapState = (state, props) => {
  return {
    plates: activity.selectPlates(state),
    plateTypes: activity.selectPlateTypes(state),
  };
};

const mapDispatch = {
  onAutoArrangePlates: activity.autoArrangePlates,
  onCopyPlate: activity.setPlateToCopy,
  onPastePlate: activity.pasteToPlates,
  onPlateSelectionChange: activity.setPlateSelections,
  onSavePlateName: activity.setPlateName,
  onSetPlateType: activity.setPlateType,
  onSwitchToView: activity.setActiveViewWithPlate,
  onUpdatePlateDetails: activity.updatePlateDetails,
};

const connected = connect(mapState, mapDispatch)(Overview);
export { connected as Overview };
