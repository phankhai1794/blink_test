import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  ListItem,
  Divider,
  Icon,
  Avatar
} from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import * as AppAction from 'app/store/actions';
import { displayToast } from '@shared';
import { Drawer, Button, List } from '@material-ui/core';
import { cyan } from '@material-ui/core/colors';
const useStyles = makeStyles((theme) => ({
  root: {
    background: 'url("assets/images/backgrounds/slider-sea.jpg")',
    backgroundSize: 'cover',
    color: theme.palette.primary.contrastText
  }
}));

function Transaction(props) {
  const { history, location } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = useSelector(({ user }) => user);
  const [selectedTab, setSelectedTab] = useState(0);

  function selectedChange(index) {
    setSelectedTab(index);
    console.log('value', index);
  }

  function handleTransaction(model) {
    
  }

  useEffect(() => {
    // if (
    //   localStorage.getItem('AUTH_TOKEN') &&
    //   PermissionProvider({ action: PERMISSION.ACCESS_DASHBOARD })
    // )
  }, []);

  let historyVerions = ['14:49, 5 tháng 5', '11:49, 5 tháng 5', '10:30, 5 tháng 5'];
  return (
    <div className="flex" style={{ marginTop: 70, width: 300, backgroundColor: 'white' }}>
      {/* <FuseAnimate  animation={{ translateX: [0, '100%'] }}> */}
      <div className="flex flex-col" style={{ width: '100%' }}>
        <Typography variant="h5" style={{ margin: 10 }}>
          History versions
        </Typography>
        <Divider style={{ margin: 10 }} />
        <List>
          {historyVerions.map((data, index) => {
            return (
              <ListItem
                className="flex flex-col "
                style={{
                  alignItems: 'flex-start',
                  backgroundColor: selectedTab == index ? '#e2f3eb' : 'white'
                }}
                key={index}
                button={true}
                onClick={() => selectedChange(index)}
                selected={selectedTab === index}>
                <Typography
                  variant="h5"
                  style={{ fontWeight: selectedTab === index ? 'bold' : '400' }}>
                  {data}
                </Typography>
                {index == 0 ? <label style={{ fontSize: 12 }}>Phiên bản hiện tại</label> : null}
                <div className="flex flex-row" style={{ alignItems: 'center' }}>
                  <Avatar style={{ background: cyan[400], width: 10, height: 10, padding: 2 }}>
                    A
                  </Avatar>
                  <label style={{ paddingLeft:8 }}>AN NGUYEN</label>
                </div>
              </ListItem>
            );
          })}
        </List>
      </div>
      {/* </FuseAnimate> */}
    </div>
  );
}

export default Transaction;
