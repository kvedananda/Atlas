import React, { Component } from 'react';
import { Checkbox, Icon, Segment } from 'semantic-ui-react';
import classNames from 'classnames';

import { Timepoint } from './Timepoint';
import styles from './ToolbarComponent.module.css';

export class ToolbarComponent extends Component {
  handleCheckboxClick = (e, data) => {
    const { checked } = data;
    const { component } = this.props;
    const selection = { components: [component] };
    if (checked) {
      this.props.onSelect(selection);
    } else {
      this.props.onDeselect(selection);
    }
  };
  handleRemoveClick = (e, data) => {
    if (this.props.onRemoveClick) {
      this.props.onRemoveClick({ components: [this.props.component] });
    }
  };
  handleAddTimepointClick = () => {
    if (this.props.onAddTimepointClick) {
      const { component } = this.props;
      this.props.onAddTimepointClick({ component });
    }
  };
  handleTimepointChange = data => {
    if (this.props.onTimepointChange) {
      const { component } = this.props;
      this.props.onTimepointChange({ component, ...data });
    }
  };
  handleTimepointDeleteClick = data => {
    if (this.props.onTimepointDeleteClick) {
      const { component } = this.props;
      this.props.onTimepointDeleteClick({ component, ...data });
    }
  };
  renderTimepoints = () => {
    const {
      component,
      allowTimepointTimeChange,
      allowAddTimepoint,
    } = this.props;
    const { timepoints } = component;
    return (
      <React.Fragment>
        <div className={styles.timepoints}>
          {timepoints.map((timepoint, i) => {
            return (
              <Timepoint
                timepoint={timepoint}
                index={i}
                key={i}
                onChange={this.handleTimepointChange}
                allowDelete={i > 0}
                onDeleteClick={this.handleTimepointDeleteClick}
                allowTimeChange={allowTimepointTimeChange}
              />
            );
          })}
        </div>
        {allowAddTimepoint && (
          <div
            className={styles.addTimepoint}
            onClick={this.handleAddTimepointClick}
          >
            <Icon link color="blue" className={styles.addTimepointIcon} name="plus circle" /> Add
            Timepoint
          </div>
        )}
      </React.Fragment>
    );
  };
  renderValidationErrors = errors => {
    return errors.map((error, i) => {
      return <div key={i}>{error}</div>;
    });
  };
  renderConcentration = () => {
    const concentration = this.props.component.timepoints[0].concentration;
    return <div className="concentration">{concentration}</div>;
  };
  render() {
    const { component, showTimepoints } = this.props;
    const componentClass = classNames(styles.component, {
      selected: component.selected,
    });
    return (
      <div className={componentClass}>
        <Segment>
          <div className={styles.header}>
            <Checkbox
              label={component.displayName}
              value={component.id}
              onClick={this.handleCheckboxClick}
              checked={component.selected}
            />
            <Icon
              link
              className={styles.removeIcon}
              name="remove"
              onClick={this.handleRemoveClick}
            />
          </div>
          {showTimepoints && this.renderTimepoints()}
          {!component.isValid && (
            <div className={styles.validationErrors}>
              {this.renderValidationErrors(component.errors)}
            </div>
          )}
        </Segment>
      </div>
    );
  }
}
