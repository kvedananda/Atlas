import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Overview } from '../Overview';
import { PlateTable } from '../PlateTable';
import { ViewTabs } from '../ViewTabs';
import { Header } from '../Header';
import { PlateEditor } from '../PlateEditor';
import SplitPane from 'react-split-pane';
import styles from './Activity.module.css';
import { ActivitySidebar } from '../../ActivitySidebar';

export class Activity extends Component {
  renderActiveView() {
    const { activeView } = this.props;
    if (activeView) {
      switch (activeView.type) {
        case 'Overview':
          return <Overview view={activeView} />;
        case 'PlateTable':
          return <PlateTable view={activeView} />;
        case 'PlateEditor':
          return <PlateEditor view={activeView} />;
        default:
          return <div>No view selected</div>;
      }
    } else return <div>No view selected</div>;
  }
  render() {
    return (
      <div className={styles.activity}>
        <Header name={this.props.name} />
        <div className={styles.container}>
          <SplitPane
            primary="second"
            defaultSize={300}
            minSize={200}
            pane1Style={{ overflow: 'hidden' }}
            pane2Style={{ height: '100%' }}
          >
            <div className={styles.leftPanelContainer}>
              <ViewTabs
                views={this.props.views}
                onTabClick={this.props.onViewTabClick}
              />
              <div className={styles.activeView}>{this.renderActiveView()}</div>
            </div>
            <div>
              <ActivitySidebar />
            </div>
          </SplitPane>
        </div>
      </div>
    );
  }
}

Activity.propTypes = {
  activeView: PropTypes.object.isRequired,
  name: PropTypes.string,
  onViewTabClick: PropTypes.func,
  views: PropTypes.array.isRequired,
};
