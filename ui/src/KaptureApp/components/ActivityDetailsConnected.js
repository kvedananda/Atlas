import { connect } from 'react-redux';

import { ActivityDetails } from 'AtlasUI/components';
import { selectors } from 'KaptureApp/store';
import { actions } from 'KaptureApp/actions';

const { selectActivityContainerCollections } = selectors;
const { setContainerCollectionsStale } = actions.activity;

const mapState = (state, props) => {
  return {
    containerCollections: selectActivityContainerCollections(state),
  };
};

const mapDispatch = {
  onUnmount: () => {
    return setContainerCollectionsStale({ stale: true });
  },
};

const connected = connect(mapState, mapDispatch)(ActivityDetails);
export { connected as ActivityDetails };