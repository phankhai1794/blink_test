import React from 'react';
import { AppBar, Toolbar } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import PurchaseButton from 'app/fuse-layouts/shared-components/PurchaseButton';
import PoweredByLinks from 'app/fuse-layouts/shared-components/PoweredByLinks';
import { useSelector } from 'react-redux';

function FooterLayout1(props) {
  const footerTheme = useSelector(({ fuse }) => fuse.settings.footerTheme);
  const footerSettings = useSelector(({ fuse }) => fuse.settings.current.layout.config.footer);
  return (
    <ThemeProvider theme={footerTheme}>
      <AppBar id="fuse-footer" className="relative z-10" color="default">
        <Toolbar className="px-16 py-0 flex items-center">
          {footerSettings.children ? (
            footerSettings.children
          ) : (
            <React.Fragment>
              <div className="flex flex-1">
                <PurchaseButton />
              </div>

              <div>
                <PoweredByLinks />
              </div>
            </React.Fragment>
          )}
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default FooterLayout1;
