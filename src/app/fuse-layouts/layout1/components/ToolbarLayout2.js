import User from 'app/fuse-layouts/shared-components/User';
import { getUserCountry } from 'app/services/countryService';
import React, { useEffect, useState } from 'react';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Avatar,
  Select,
  MenuItem,
  Checkbox,
  Divider,
  Icon
} from '@material-ui/core';
import clsx from 'clsx';
import * as Actions from 'app/main/apps/dashboards/admin/store/actions';
import { handleError } from '@shared/handleError';
import { uniqueArray } from '@shared';

const useStyles = makeStyles((theme) => ({
  formControl: {
    '& fieldset': {
      border: 'none'
    },
    '& span': {
      fontFamily: 'Montserrat',
      fontSize: '13px'
    },
    '& input': {
      fontFamily: 'Montserrat',
      fontSize: '14px'
    }
  },
  separator: {
    width: 1,
    height: 64,
    backgroundColor: theme.palette.divider
  },
  fitAvatar: {
    // zoom out to show full logo
    '& > img': {
      objectFit: 'contain'
    }
  },
  logo: {
    width: 70,
    height: 50,
    borderRadius: 0
  },
  select: {
    paddingRight: 0
  },
  chips: {
    display: 'flex'
  },
  chip: {
    backgroundColor: '#E2E6EA',
    borderRadius: '4px',
    height: '24px',
    margin: 2
  },
  menuItemSelected: {
    backgroundColor: '#FDF2F2 !important'
  }
}));

const flagUrl = (value) => `assets/images/flags/${value.toLowerCase()}.svg`;

const TreeNode = (props) => {
  const { label, children, val, handleSelectStatus, check } = props;

  const [isExpanded, setIsExpanded] = useState(false);
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          padding: '8px 16px',
          alignItems: 'center',
          width: '100%'
        }}>
        <Icon style={{ color: '#BD0F72' }}>{isExpanded ? 'arrow_drop_down' : 'arrow_right'}</Icon>
        <Checkbox checked={check} onChange={(e) => handleSelectStatus(e, val)} color="primary" />
        <div style={{ display: 'flex', cursor: 'pointer' }} onClick={handleToggle}>
          <img
            loading="lazy"
            style={{ borderRadius: '50%' }}
            width="20"
            height="20"
            src={flagUrl(val)}
            alt=""
          />
          <span style={{ fontFamily: 'Montserrat', fontSize: '14px', marginLeft: 5 }}>{label}</span>
        </div>
      </div>

      {isExpanded && <>{children}</>}
    </>
  );
};

function ToolbarLayout2(props) {
  const { search } = window.location;
  const classes = useStyles(props);
  const fcountry = JSON.parse(localStorage.getItem('fcountry') || '""');
  const foffice = JSON.parse(localStorage.getItem('foffice') || '""');
  const toolbarTheme = useSelector(({ fuse }) => fuse.settings.toolbarTheme);
  const office = useSelector(({ dashboard }) => dashboard.office); // for query
  const filterCountry = useSelector(({ dashboard }) => dashboard.countries);

  const dispatch = useDispatch();

  const user = useSelector(({ user }) => user);
  const [countries, setCountries] = useState([]);
  const countryOption = user.countries;
  const _office = user.office;

  const setOffice = (value) => {
    dispatch(Actions.setOffice(value));
    localStorage.setItem('foffice', JSON.stringify(value));
  };

  const setFilterCountry = (value) => {
    dispatch(Actions.filterCountry(value));
    localStorage.setItem('fcountry', JSON.stringify(value));
  };

  useEffect(() => {
    // auto select only 1 default country when access to BLINK via OPUS
    let result = fcountry || [...countryOption];
    if (search) {
      const cntr = new URLSearchParams(search).get('cntr');
      if (cntr && countryOption.includes(cntr)) result = [cntr];

      // Remove search param from url
      window.history.pushState({}, '', `/apps/admin`);
    }
    dispatch(Actions.filterCountry(result));

    getUserCountry()
      .then(({ data }) => {
        const tempO = [];
        const temp = data.userCountry.map((m) => {
          let office = m.office.filter((item) => _office?.includes(item));
          office = office.length ? office : m.office;
          tempO.push(...office);
          return { ...m, offices: office.sort((a, b) => a.localeCompare(b)) };
        });
        if (fcountry?.length && !foffice) {
          const arr = [];
          fcountry.forEach((f) => {
            arr.push(...temp.find((t) => t.value === f).offices);
          });
          setOffice(arr);
        } else setOffice(foffice || tempO);
        setCountries(temp);
      })
      .catch((err) => handleError(dispatch, err));
  }, []);

  const selectAll = (event) => {
    if (office.length === countries.reduce((sum, obj) => sum + obj.offices.length, 0)) {
      setFilterCountry([]);
      setOffice([]);
    } else {
      setFilterCountry(countryOption);
      setOffice(countries.reduce((arr, obj) => [...arr, ...obj.offices], []));
    }
  };

  const handleSelectStatus = (e, country) => {
    e.stopPropagation();
    const check = e.target.checked;
    const temp = countries.find(({ value }) => value === country);
    if (check) {
      if (!filterCountry.includes(country)) {
        setFilterCountry([...filterCountry, country]);
      }
      setOffice(uniqueArray([...office, ...temp.offices]));
    } else {
      setFilterCountry(filterCountry.filter((c) => c !== country));
      setOffice(office.filter((o) => !temp.offices.includes(o)));
    }
  };

  const handleSelectOffice = (_country, _office) => {
    if (office.includes(_office)) {
      const country = countries.find(({ value }) => value === _country);
      const filter = office.filter((item) => item !== _office);
      if (!country.offices.some((element) => filter.includes(element)))
        setFilterCountry(filterCountry.filter((c) => c !== _country));
      setOffice(filter);
    } else {
      if (!filterCountry.includes(_country)) setFilterCountry([...filterCountry, _country]);
      setOffice([...office, _office]);
    }
  };

  return (
    <ThemeProvider theme={toolbarTheme}>
      <AppBar id="fuse-toolbar" className="flex relative z-10" color="inherit">
        <Toolbar className="p-0" style={{ justifyContent: 'space-between' }}>
          <div style={{ marginLeft: '2rem' }}>
            <Avatar
              src="assets/images/logos/one_ocean_network-logo.png"
              className={clsx(classes.logo, classes.fitAvatar)}
              alt="one-logo"
            />
          </div>
          <div className="flex items-center">
            {countries.length === 1 ? (
              <img
                className="circle-flag"
                width="25"
                height="25"
                src={flagUrl(countries[0].value)}
              />
            ) : (
              <Select
                classes={{ select: classes.select }}
                multiple
                onChange={selectAll}
                value={filterCountry.length ? filterCountry : ['plus']}
                MenuProps={{ PaperProps: { style: { minWidth: 220 } } }}
                inputProps={{ IconComponent: () => null }}
                renderValue={(selected) => (
                  <div className={classes.chips}>
                    {selected.slice(0, 4).map((value) => (
                      <img
                        key={value}
                        className={filterCountry.length ? 'circle-flag' : 'circle-flag-default'}
                        width="25"
                        height="25"
                        src={flagUrl(value)}
                      />
                    ))}
                    {selected.length - 4 > 0 && (
                      <div className="circle-flag-plus">+{selected.length - 4}</div>
                    )}
                  </div>
                )}
                disableUnderline>
                <MenuItem value="All" classes={{ selected: classes.menuItemSelected }}>
                  <Checkbox
                    checked={
                      office.length === countries.reduce((sum, obj) => sum + obj.offices.length, 0)
                    }
                    color="primary"
                  />
                  <span style={{ fontFamily: 'Montserrat', fontSize: '14px' }}>All</span>
                </MenuItem>
                <Divider />
                {countries.map(({ label, value, offices }) => (
                  <TreeNode
                    key={label}
                    label={label}
                    val={value}
                    check={offices.every((o) => office.includes(o))}
                    handleSelectStatus={handleSelectStatus}>
                    {offices.map((o) => (
                      <MenuItem key={o} onClick={() => handleSelectOffice(value, o)}>
                        <Checkbox checked={office.includes(o)} color="primary" />
                        <span>{o}</span>
                      </MenuItem>
                    ))}
                    <span></span>
                  </TreeNode>
                ))}
              </Select>
            )}
            <User />
          </div>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default ToolbarLayout2;
