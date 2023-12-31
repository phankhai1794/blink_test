import React from 'react';
import { Button, Icon, Typography } from '@material-ui/core';
import { FuseExample, FusePageSimple } from '@fuse';
import { Link } from 'react-router-dom';

/* eslint import/no-webpack-loader-syntax: off */

function ReactTableDoc() {
  return (
    <FusePageSimple
      header={
        <div className="flex flex-1 items-center justify-between p-24">
          <div className="flex flex-col">
            <div className="flex items-center mb-16">
              <Icon className="text-18" color="action">
                home
              </Icon>
              <Icon className="text-16" color="action">
                chevron_right
              </Icon>
              <Typography color="textSecondary">Documentation</Typography>
              <Icon className="text-16" color="action">
                chevron_right
              </Icon>
              <Typography color="textSecondary">3rd Party Components</Typography>
              <Icon className="text-16" color="action">
                chevron_right
              </Icon>
              <Typography color="textSecondary">Data Tables</Typography>
            </div>
            <Typography variant="h6">React Table</Typography>
          </div>
          <Button
            className="normal-case"
            variant="contained"
            component="a"
            href="https://github.com/react-tools/react-table"
            target="_blank"
          >
            <Icon className="mr-4">link</Icon>
            Reference
          </Button>
        </div>
      }
      content={
        <div className="p-24 max-w-2xl">
          <Typography className="mb-16" component="p">
            <code>react-table</code> is a lightweight, fast and extendable datagrid built for React.
          </Typography>

          <hr />

          <Typography className="text-32 mt-32 mb-8" component="h2">
            Example Usages
          </Typography>

          <FuseExample
            className="mb-64"
            component={require('./examples/simple.js').default}
            raw={require('!raw-loader!./examples/simple.js')}
          />

          <Typography className="text-32 mt-32 mb-8" component="h2">
            Demos
          </Typography>

          <ul>
            <li className="mb-8">
              <Link to="/apps/contacts">Contacts App</Link>
            </li>
          </ul>
        </div>
      }
    />
  );
}

export default ReactTableDoc;
