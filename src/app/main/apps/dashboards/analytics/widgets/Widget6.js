import React from 'react';
import { Card, Icon, Tooltip } from '@material-ui/core';
import GoogleMap from 'google-map-react';

function Marker(props) {
  return (
    <Tooltip title={props.text} placement="top">
      <Icon className="text-red">place</Icon>
    </Tooltip>
  );
}

function Widget6(props) {
  return (
    <Card className="w-full h-512 rounded-8 shadow-none border-1">
      <GoogleMap
        bootstrapURLKeys={{
          key: process.env.REACT_APP_MAP_KEY
        }}
        defaultZoom={1}
        defaultCenter={[17.308688, 7.03125]}
        options={{
          styles: props.data.styles
        }}
      >
        {props.data.markers.map((marker) => (
          <Marker key={marker.label} text={marker.label} lat={marker.lat} lng={marker.lng} />
        ))}
      </GoogleMap>
    </Card>
  );
}

export default Widget6;
