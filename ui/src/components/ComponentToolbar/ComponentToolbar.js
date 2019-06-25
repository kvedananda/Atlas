import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tab } from 'semantic-ui-react';

import { ApplyToolbar } from './ApplyToolbar';
import { SelectToolbar } from './SelectToolbar';
import { ClearToolbar } from './ClearToolbar';

const panes = [
  {
    menuItem: 'Apply',
    render: () => (
      <Tab.Pane attached={false}>
        <ApplyToolbar />
      </Tab.Pane>
    ),
    modeName: 'apply',
  },
  {
    menuItem: 'Select',
    render: () => (
      <Tab.Pane attached={false}>
        <SelectToolbar />
      </Tab.Pane>
    ),
    modeName: 'select',
  },
  {
    menuItem: 'Clear',
    render: () => (
      <Tab.Pane attached={false}>
        <ClearToolbar />
      </Tab.Pane>
    ),
    modeName: 'clear',
  },
];

export class ComponentToolbar extends Component {
  handleTabChange = (e, data) => {
    const { activeIndex, panes } = data;
    const modeName = panes[activeIndex].modeName;
    this.props.onTabChange(modeName);
  };
  render() {
    return (
      <div className="component-toolbar">
        <Tab
          onTabChange={this.handleTabChange}
          defaultActiveIndex={0}
          menu={{ pointing: true }}
          panes={panes}
        />
      </div>
    );
  }
}

ComponentToolbar.propTypes = {
  onTabChange: PropTypes.func.isRequired,
};