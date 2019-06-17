import React, {Component} from 'react';
import ReactMapGL from 'react-map-gl';

const TOKEN = 'pk.eyJ1IjoidGVlbXV0YXNrdWxhIiwiYSI6ImNqYWYwano1MjB6eTYyd3F1OGNjMWczMGcifQ.KVj38ECZkRdLx06fMyBMRQ';

class MapVisualization extends Component {
  state = {
    viewport: {
      width: '100%',
      height: 600,
      latitude: 37.7577,
      longitude: -122.4376,
      zoom: 8
    }
  };

  render() {
    const { viewport } = this.state;

    return (
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={TOKEN}
        onViewportChange={(viewport) => this.setState({viewport})}
      />
    );
  }
}

export default MapVisualization;
