import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Segment, Header, Icon } from 'semantic-ui-react';

import { plateMapRowHeaders } from '../constants';
import { Well } from './Well';

export class PlateMap extends Component {
  renderTable(plateMap) {
    const rows = plateMap.map((row, i) => {
      const columns = row.map((well, j) => {
        return (
          <td key={j + 1}>
            <Well onClick={this.handleWellClick} well={well} />
          </td>
        );
      });
      columns.unshift(<th key={0}>{plateMapRowHeaders[i]}</th>);
      return <tr key={i + 1}>{columns}</tr>;
    });

    const topHeaderCells = plateMap[0].map((well, i) => {
      return <th key={i + 1}>{i + 1}</th>;
    });
    topHeaderCells.unshift(<td key="blank" />);
    rows.unshift(<tr key="topHeader">{topHeaderCells}</tr>);
    return (
      <div className="platemap-container">
        <table className="plate">
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
  // handleWellClick = (wellId) => {
  //   this.props.onWellClick({ plateMapId: this.props.plateMap.id, wellId})
  // };
  handleWellClick = well => {
    const plateMapId = this.props.plateMap.id;
    const wellIds = [well.id];
    switch (this.props.clickMode) {
      case 'apply':
        this.props.modifyWells({
          plateMapId,
          wellIds,
          values: { components: this.props.valuesToApply },
        });
        break;
      case 'select':
        this.props.modifyWells({
          plateMapId,
          wellIds,
          values: { selected: !well.selected },
        });
        break;
    }
  };
  handleDelete = () => {
    this.props.onDeleteClick(this.props.plateMap.id);
  };
  render() {
    const { plateMap, numberOfPlateMaps } = this.props;
    if (plateMap) {
      return (
        <div style={{ border: '1px solid black' }}>
          <div>{plateMap.id}</div>
          <Button primary onClick={this.handleDelete}>
            Delete
          </Button>
          {this.renderTable(plateMap.data)}
        </div>
      );
    } else if (!numberOfPlateMaps) {
      return (
        <Segment placeholder>
          <Header icon>
            <Icon name="grid layout" />
            There are no plate maps in this experiment
          </Header>
          <Button primary onClick={this.props.onAddClick}>
            Add a Plate Map
          </Button>
        </Segment>
      );
    } else {
      return <div />;
    }
  }
}

PlateMap.propTypes = {
  plateMap: PropTypes.object,
  numberOfPlateMaps: PropTypes.number.isRequired,
  valuesToApply: PropTypes.object.isRequired,
  clickMode: PropTypes.string.isRequired,
  onAddClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onWellClick: PropTypes.func.isRequired,
  modifyWells: PropTypes.func.isRequired,
};
