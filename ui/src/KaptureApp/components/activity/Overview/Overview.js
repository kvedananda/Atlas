import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid } from './Grid';
import { Button } from 'KaptureApp/components';
import { Scrollbars } from 'AtlasUI/components';
import styles from './Overview.module.css';

export class Overview extends Component {
  handleAdd96WellPlate = () => {
    if (this.props.onAddPlate) {
      this.props.onAddPlate({ rows: 8, columns: 12 }, 1);
    }
  };
  handleAdd384WellPlate = () => {
    if (this.props.onAddPlate) {
      this.props.onAddPlate({ rows: 16, columns: 24 }, 1);
    }
  };
  handleAddMultiTableView = () => {
    if (this.props.onAddView) {
      const gridIds = this.props.view.data.grids.map((grid) => grid.id);
      this.props.onAddView({
        type: 'MultiPlateTable',
        data: {
          gridIds,
        },
      });
    }
  };
  handleGridClick = (gridId) => {
    // if (this.props.onAddView) {
    //   this.props.onAddView({
    //     type: 'Editor',
    //     data: {
    //       gridIds: [gridId],
    //     },
    //   });
    // }
  };
  handleGridCheckboxChange = (gridId) => {
    if (this.props.onToggleGridSelection) {
      this.props.onToggleGridSelection(gridId, this.props.view.id);
    }
  };
  renderGrids() {
    const { grids, selectedGrids } = this.props.view.data;
    return grids.map((grid) => {
      const selected = selectedGrids.includes(grid.id);
      return (
        <Grid
          key={grid.id}
          grid={grid}
          onCheckboxChange={this.handleGridCheckboxChange}
          onClick={this.handleGridClick}
          onSaveName={this.props.onSaveGridName}
          selected={selected}
        />
      );
    });
  }
  render() {
    return (
      <div className={styles.overview}>
        <div className="h-10 bg-gray-50 pl-4 flex flex-row items-center">
          <Button
            onClick={this.handleAdd96WellPlate}
            content="96-Well Plate"
            icon="plus-circle"
            secondary
            className="mr-2"
          />
          <Button
            onClick={this.handleAdd384WellPlate}
            content="384-Well Plate"
            icon="plus-circle"
            secondary
            className="mr-2"
          />
        </div>
        <div className={styles.scrollContainer}>
          <Scrollbars>
            <div className="h-full flex flex-row flex-wrap content-start p-4 bg-gray-100">
              {this.renderGrids()}
            </div>
          </Scrollbars>
        </div>
      </div>
    );
  }
}

Overview.propTypes = {
  view: PropTypes.object.isRequired,
  onAddPlate: PropTypes.func,
  onAddView: PropTypes.func,
  onSaveGridName: PropTypes.func,
  onToggleGridSelection: PropTypes.func,
};
