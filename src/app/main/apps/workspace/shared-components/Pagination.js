import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Tooltip, Button } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';


const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '16px',
    paddingBottom: '32px',
  },
  btn: {
    fontSize: '32px'
  }
}));


const Pagination = (props) => {
  const { pathname } = window.location;
  const classes = useStyles();
  const dispatch = useDispatch();

  let { pageNumber, totalPage, currentNumber } = props

  const handleClickStart = () => {

  }

  const handleClickEnd = () => {

  }

  const handlePrevious = () => {

  }

  const handleNext = () => {

  }

  const pageStart = () => {
    return (
      <Button className={classes.btn}><ArrowBackIosIcon /></Button>
    )
  }

  return (
    <div className={classes.container}>
      <Button variant='outlined'><ArrowBackIosIcon /></Button>
      <Button variant='outlined'>1</Button>
             2 ... 5

    </div>
  );
};
export default Pagination;
