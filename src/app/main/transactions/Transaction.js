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
import { FuseAnimate, FuseScrollbars } from '@fuse';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import * as AppAction from 'app/store/actions';
import { displayToast } from '@shared';
import { Drawer, Button, List } from '@material-ui/core';
import { cyan } from '@material-ui/core/colors';
import { format } from 'date-fns';
import * as TransActions from '../apps/workspace/admin/store/actions/transaction';

const useStyles = makeStyles((theme) => ({
  root: {
    background: 'url("assets/images/backgrounds/slider-sea.jpg")',
    backgroundSize: 'cover',
    color: theme.palette.primary.contrastText
  }
}));

function Transaction(props) {
  const dispatch = useDispatch();
  const classes = useStyles(props);

  const [myBL] = useSelector((state) => [state.workspace.inquiryReducer.myBL]);
  const { blTrans } = useSelector(({ transReducer }) => transReducer);
  const user = useSelector(({ user }) => user);
  const [selectedTab, setSelectedTab] = useState(0);

  function selectedChange(index) {
    setSelectedTab(index);
  }

  useEffect(() => {
    if (myBL) {
      console.log('myBL', myBL);
      dispatch(TransActions.getBlTrans('690d7f35-1b11-4219-a536-a9e87af88e16'));
    }
  }, [myBL]);

  useEffect(() => {
    if (blTrans) {
    }
  }, [blTrans]);

  return (
    <div className="flex" style={{ marginTop: 70, width: 450, backgroundColor: 'white' }}>
      <div className="flex flex-col" style={{ width: '100%' }}>
        <Typography variant="h5" style={{ margin: 10 }}>
          History versions
        </Typography>
        <Divider style={{ margin: 10 }} />
        <FuseScrollbars className={classes.content} scrollToTopOnChildChange>
        <List>
          {blTrans?.map((data, index) => {
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
                  {format(new Date(), 'MM/dd/yyyy kk:mm')}
                </Typography>
                {index == 0 ? <label style={{ fontSize: 12 }}>Phiên bản hiện tại</label> : null}
                <div className="flex flex-row" style={{ alignItems: 'center' }}>
                  <Avatar style={{ background: cyan[400], width: 10, height: 10, padding: 2 }}>
                    {user.displayName.charAt(0).toUpperCase()}
                  </Avatar>
                  <label style={{ paddingLeft: 8 }}>{data.creator?.userName}</label>
                </div>
              </ListItem>
            );
          })}
        </List>
        </FuseScrollbars>
       
      </div>
    </div>
  );
}

export default Transaction;
