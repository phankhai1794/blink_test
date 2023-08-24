import User from 'app/fuse-layouts/shared-components/User';
import { getUserCountry } from 'app/services/countryService';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Avatar,
  MenuItem,
  Checkbox,
  Divider,
  Icon,
  Button,
  Link,
  Menu,
  SvgIcon
} from '@material-ui/core';
import clsx from 'clsx';
import { matchSorter } from 'match-sorter';
import * as Actions from 'app/main/apps/dashboards/admin/store/actions';
import { handleError } from '@shared/handleError';
import { uniqueArray } from '@shared';
import debounce from 'lodash/debounce';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    marginLeft: 0,
    borderRadius: 8,
    boxShadow: 'none',
    textTransform: 'capitalize',
    fontFamily: 'Montserrat',
    fontWeight: 600,
    '&.reply': {
      backgroundColor: 'white',
      color: '#BD0F72',
      border: '1px solid #BD0F72'
    }
  },
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
  list: {
    padding: 0
  },
  paper: {
    width: 300
  },
  chips: {
    display: 'flex'
  },
  chip: {
    backgroundColor: '#E2E6EA',
    borderRadius: '4px',
    height: '24px',
    margin: 2
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
          padding: '2px 16px',
          alignItems: 'center',
          width: '100%'
        }}>
        <Icon style={{ color: '#BD0F72', cursor: 'pointer' }} onClick={handleToggle}>
          {isExpanded ? 'arrow_drop_down' : 'arrow_right'}
        </Icon>
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
  const office = useSelector(({ dashboard }) => dashboard.office); // for query, select option
  const filterCountry = useSelector(({ dashboard }) => dashboard.countries);
  const [hover, setHover] = useState();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [officeOriginal, setOfficeOriginal] = useState(office);
  const [countryOriginal, setCountryOriginal] = useState(filterCountry);
  const searchRef = useRef();
  const user = useSelector(({ user }) => user);
  const [countries, setCountries] = useState([]);
  const [countySearch, setCountrySearch] = useState([]);

  const countryOption = user.countries;
  const _office = user.office; // account's office
  const [isFocused, setIsFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleClearInput = () => {
    setSearchValue('');
    setCountrySearch(countries);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
    let result = fcountry && fcountry.length ? fcountry : [...countryOption];
    let isFallback = false;
    if (search) {
      isFallback = true;
      const cntr = new URLSearchParams(search).get('cntr');
      if (cntr && countryOption.includes(cntr)) result = [cntr];

      // Remove search param from url
      window.history.pushState({}, '', `/apps/admin`);
    }
    setFilterCountry(result);
    setCountryOriginal(result);

    getUserCountry()
      .then(({ data }) => {
        const tempO = [];
        const temp = data.userCountry.map((m) => {
          let office = m.office.filter((item) => _office?.includes(item));
          office = office.length ? office : m.office;
          tempO.push(...office);
          return { ...m, offices: office.sort((a, b) => a.localeCompare(b)) };
        });
        if (isFallback || (result?.length && !foffice)) {
          const arr = [];
          result.forEach((f) => {
            const r = temp.find((t) => t.value === f)?.offices;
            if (r) arr.push(...r);
          });
          setOffice(arr);
          setOfficeOriginal(arr);
        } else {
          setOffice(foffice || tempO);
          setOfficeOriginal(foffice || tempO);
        }
        setCountries(temp);
        setCountrySearch(temp);
      })
      .catch((err) => handleError(dispatch, err));
  }, []);

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target) && !searchValue) {
      setIsFocused(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchValue]);

  const searchBookingOffice = (val) => {
    const value = val.split(/,/).map((str) => str.trim());
    let result = countries.map((c) => ({
      ...c,
      offices: matchSorter(c.offices, value, { threshold: matchSorter.rankings.CONTAINS })
    }));
    result = result.filter((c) => c.offices.length);
    setCountrySearch(result);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    searchBookingOffice(value);
  };

  const selectAll = () => {
    if (officeOriginal.length === countries.reduce((sum, obj) => sum + obj.offices.length, 0)) {
      setCountryOriginal([]);
      setOfficeOriginal([]);
    } else {
      setCountryOriginal(countryOption);
      setOfficeOriginal(countries.reduce((arr, obj) => [...arr, ...obj.offices], []));
    }
  };

  const handleSelectStatus = (e, country) => {
    e.stopPropagation();
    const check = e.target.checked;
    const temp = countries.find(({ value }) => value === country);
    if (check) {
      if (!countryOriginal.includes(country)) {
        setCountryOriginal([...countryOriginal, country]);
      }
      setOfficeOriginal(uniqueArray([...officeOriginal, ...temp.offices]));
    } else {
      setCountryOriginal(countryOriginal.filter((c) => c !== country));
      setOfficeOriginal(officeOriginal.filter((o) => !temp.offices.includes(o)));
    }
  };

  const handleSelectOffice = (_country, _office) => {
    if (officeOriginal.includes(_office)) {
      const country = countries.find(({ value }) => value === _country);
      const filter = officeOriginal.filter((item) => item !== _office);
      if (!country.offices.some((element) => filter.includes(element)))
        setCountryOriginal(countryOriginal.filter((c) => c !== _country));
      setOfficeOriginal(filter);
    } else {
      if (!countryOriginal.includes(_country)) setCountryOriginal([...countryOriginal, _country]);
      setOfficeOriginal([...officeOriginal, _office]);
    }
  };

  const onHover = (value) => {
    setHover(value);
  };

  const leaveHover = () => {
    setHover();
  };

  const onClickOnly = (e, c, o) => {
    e.stopPropagation();
    setOfficeOriginal([o]);
    setCountryOriginal([c]);
    return;
  };

  const onApply = () => {
    handleClose();
    setOffice(officeOriginal);
    setFilterCountry(countryOriginal);
  };

  const onCancel = () => {
    handleClose();
    setOfficeOriginal(office);
    setCountryOriginal(filterCountry);
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
            <div className={classes.chips} style={{ cursor: 'pointer' }} onClick={handleClick}>
              {filterCountry.slice(0, 4).map((value) => (
                <img
                  key={value}
                  className={filterCountry.length ? 'circle-flag' : 'circle-flag-default'}
                  width="25"
                  height="25"
                  src={flagUrl(value)}
                />
              ))}
              {filterCountry.length - 4 > 0 && (
                <div className="circle-flag-plus">+{filterCountry.length - 4}</div>
              )}
            </div>
            <User />
          </div>
          <Menu
            classes={{ paper: classes.paper, list: classes.list }}
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '4px 10px' }}>
              <Checkbox
                checked={
                  officeOriginal.length ===
                  countries.reduce((sum, obj) => sum + obj.offices.length, 0)
                }
                color="primary"
                onChange={selectAll}
              />
              {isFocused ? (
                <div
                  ref={searchRef}
                  style={{
                    border: '2px solid #BD0F72',
                    borderRadius: 4,
                    padding: '4px 8px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                  <input
                    style={{
                      border: 'none',
                      textTransform: 'uppercase',
                      fontFamily: 'Montserrat',
                      fontSize: 14
                    }}
                    type="text"
                    autoFocus
                    value={searchValue}
                    onChange={handleSearchChange}
                  />
                  {searchValue && (
                    <img
                      src="assets/images/icons/clear-text.svg"
                      style={{ width: 22, cursor: 'pointer' }}
                      onClick={handleClearInput}
                    />
                  )}
                </div>
              ) : (
                <div
                  onClick={handleFocus}
                  style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <img src="assets/images/icons/search.svg" style={{ width: 22 }} />
                  <span style={{ color: '#8A97A3' }}>Booking Country</span>
                </div>
              )}
            </div>
            <Divider />
            <div style={{ overflowX: 'hidden', overflowY: 'scroll', maxHeight: 450 }}>
              {countySearch.map(({ label, value, offices }) => (
                <TreeNode
                  key={label}
                  label={label}
                  val={value}
                  check={offices.every((o) => officeOriginal.includes(o))}
                  handleSelectStatus={handleSelectStatus}>
                  {offices.map((o) => (
                    <div key={o} onMouseEnter={() => onHover(o)} onMouseLeave={leaveHover}>
                      <MenuItem onClick={() => handleSelectOffice(value, o)}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                            marginLeft: 50
                          }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center'
                            }}>
                            <Checkbox checked={officeOriginal.includes(o)} color="primary" />
                            <span>{o}</span>
                          </div>
                          {hover === o && (
                            <Link
                              onClick={(e) => onClickOnly(e, value, o)}
                              style={{
                                color: '#BD0F72',
                                fontFamily: 'Montserrat',
                                background: '#FDF2F2',
                                borderRadius: 4,
                                width: 60,
                                textAlign: 'center',
                                fontSize: 14
                              }}>
                              ONLY
                            </Link>
                          )}
                        </div>
                      </MenuItem>
                    </div>
                  ))}
                </TreeNode>
              ))}
            </div>
            <Divider />
            <div style={{ display: 'flex', justifyContent: 'end', margin: '5px 0' }}>
              <Button
                variant="contained"
                classes={{ root: clsx(classes.button) }}
                color="primary"
                onClick={() => onApply()}
                disabled={!officeOriginal.length}>
                Apply
              </Button>
              <Button
                variant="contained"
                classes={{ root: clsx(classes.button, 'reply') }}
                color="primary"
                onClick={() => onCancel()}>
                Cancel
              </Button>
            </div>
          </Menu>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default ToolbarLayout2;
