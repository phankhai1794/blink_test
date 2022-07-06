import React from 'react';
import { Paper, Button, Input, Icon, Typography } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { FuseAnimate } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// import * as Actions from '../store/actions';

function InquiringHeader(props) {
  const dispatch = useDispatch();
  // const searchText = useSelector(({ eCommerceApp }) => eCommerceApp.products.searchText);
  const mainTheme = useSelector(({ fuse }) => fuse.settings.mainTheme);

  return (
    <div className="flex flex-1 w-full items-center justify-between">
      <div className="flex items-center"></div>

      <div className="flex flex-1 items-center justify-center px-12">
        <ThemeProvider theme={mainTheme}>
          <FuseAnimate animation="transition.slideDownIn" delay={300}>
            <Paper className="flex items-center w-full max-w-512 px-8 py-4 rounded-8" elevation={1}>
              <Icon className="mr-8" color="action">
                search
              </Icon>

              <Input
                placeholder="Search"
                className="flex flex-1"
                disableUnderline
                fullWidth
                inputProps={{
                  'aria-label': 'Search'
                }}
                // onChange={ev => dispatch(Actions.setProductsSearchText(ev))}
              />
            </Paper>
          </FuseAnimate>
        </ThemeProvider>
      </div>
      <FuseAnimate animation="transition.slideRightIn" delay={300}>
        {/* TODO: Update BKG_NO */}
        <Button
          component={Link}
          to="/apps/workspace/NGOB29899900"
          className="whitespace-no-wrap mr-52"
          variant="contained">
          <span className="hidden sm:flex">Create workspace</span>
          <span className="flex sm:hidden">New</span>
        </Button>
      </FuseAnimate>
    </div>
  );
}

export default InquiringHeader;
