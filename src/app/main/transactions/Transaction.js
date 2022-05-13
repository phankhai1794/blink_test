import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, ListItem, Divider, Avatar } from '@material-ui/core';
import { FuseScrollbars } from '@fuse';
import { makeStyles } from '@material-ui/styles';
import { List } from '@material-ui/core';
import { cyan } from '@material-ui/core/colors';
import { format } from 'date-fns';
import * as TransActions from '../apps/workspace/admin/store/actions/transaction';
const DATE_OPTIONS_FULL = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric'
};
const DATE_OPTIONS_WITHOUT_YEAR = {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric'
};

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
  const aaaa = false;

  useEffect(() => {
    if (myBL) {
      dispatch(TransActions.getBlTrans(myBL.id));
    }
  }, [myBL]);
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
                    {new Date(data.createdAt).toLocaleString(
                      undefined,
                      new Date().getFullYear() == new Date(data.createdAt).getFullYear()
                        ? DATE_OPTIONS_WITHOUT_YEAR
                        : DATE_OPTIONS_FULL
                    )}
                  </Typography>
                  {index == 0 ? <label style={{ fontSize: 11, fontStyle: 'italic'}}>Current version</label> : null}
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
