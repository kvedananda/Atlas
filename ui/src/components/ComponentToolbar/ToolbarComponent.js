import React, { Component } from 'react';
import { Form, Checkbox, Icon } from 'semantic-ui-react';

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
  handleAddTimepoint = () => {};
  renderTimepoints = () => {
    const { timepoints } = this.props.component;
    return (
      <div className="timepoints">
        {timepoints.map((timepoint, i) => {
          return (
            <div className="timepoint" key={i}>
              {timepoint.time} {timepoint.concentration}
            </div>
          );
        })}
        <div className="add-timepoint">
          <Icon name="plus circle" onClick={this.handleAddTimepointClick} /> Add
          Timepoint
        </div>
      </div>
    );
  };
  renderConcentration = () => {
    const concentration = this.props.component.timepoints[0].concentration;
    return <div className="concentration">{concentration}</div>;
  };
  render() {
    const { component, showTimepoints, showConcentration } = this.props;
    return (
      <div className={styles.component}>
        <div className={styles.header}>
          <Checkbox
            label={component.displayName}
            value={component.id}
            onClick={this.handleCheckboxClick}
            checked={component.selected}
          />
          <Icon name="remove circle" onClick={this.handleRemoveClick} />
        </div>
        <div>
          {showTimepoints && this.renderTimepoints()}
          {!showTimepoints && showConcentration && this.renderConcentration()}
        </div>
      </div>
    );
  }
}
