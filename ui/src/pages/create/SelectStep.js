import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchEntityLists } from '../../store/entityLists';
import { createExperimentActions } from '../../store/createExperiment';
import { NewExperimentForm } from '../../components/NewExperimentForm';

class SelectStep extends Component {
  componentDidMount() {
    if (!this.props.loaded && !this.props.pending) {
      this.props.fetchEntityLists();
    }
  }

  handleFormSubmit = formValues => {
    this.props.setExperimentOptions(formValues);
    this.props.onStepComplete();
  };

  render() {
    const { pending, loaded, error, currentValues } = this.props;
    if (pending) {
      return <div>Loading...</div>;
    } else if (error) {
      return <div>{error}</div>;
    } else if (loaded) {
      const {
        experiments,
        compounds,
        communities,
        media,
      } = this.props.selectOptions;
      return (
        <NewExperimentForm
          onSubmit={this.handleFormSubmit}
          experiments={experiments}
          compounds={compounds}
          communities={communities}
          media={media}
          initialValues={currentValues}
        />
      );
    } else return <div />;
  }
}

SelectStep.propTypes = {
  pending: PropTypes.bool.isRequired,
  loaded: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  selectOptions: PropTypes.object.isRequired,
  currentValues: PropTypes.object,
  setExperimentOptions: PropTypes.func.isRequired,
  onStepComplete: PropTypes.func.isRequired,
};

const mapState = (state, props) => {
  const { pending, loaded, error, values: selectOptions } = state.entityLists;
  return {
    pending,
    loaded,
    error,
    selectOptions,
    currentValues: {
      experiment: state.createExperiment.experiment,
      ...state.createExperiment.components,
    },
  };
};

const connected = connect(
  mapState,
  { fetchEntityLists, ...createExperimentActions }
)(SelectStep);
export { connected as SelectStep };
