import React, { useEffect, useState } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { handleError } from '@shared/handleError';
import { getAllMailAccess, updateMailAccess } from 'app/services/mailService';
import clsx from 'clsx';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';

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
  buttonLabel: {
    gap: '5px',
    fontSize: 16
  },
  dialogContent: {
    margin: 'auto',
    backgroundColor: (props) => props.style?.backgroundColor || 'white', //email preview
    position: 'relative',
    width: (props) => (props.isFullScreen ? '1200px' : '900px')
  },
  colorSelectedTab: {
    color: '#BD0F72'
  },
  tab: {
    fontFamily: 'Montserrat',
    textTransform: 'none',
    fontSize: '18px',
    fontWeight: '600'
  },
  iconLabelWrapper: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-around'
  },
  countBtn: {
    background: '#E2E6EA',
    fontSize: '14px',
    height: '24px',
    width: '24px',
    borderRadius: '4px',
    marginBottom: '0 !important'
  },
  colorCountBtn: {
    background: '#FDF2F2'
  }
}));
const StyledChip = withStyles((theme) => ({
  root: {
    maxWidth: 350,
    borderRadius: 4,
    background: '#F5F8FA',
    height: 26,
    margin: 3,
    color: '#333',
    fontSize: 15,
    fontFamily: 'Montserrat'
  },
  label: {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
}))(Chip);
const ListEmailAccess = (props) => {
  const classes = useStyles();
  const mybl = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);

  const [tab, setTab] = useState(0);
  const [isEdit, setEdit] = useState(false);
  const [emails, setEmails] = useState({
    toCustomer: [],
    toCustomerCc: [],
    toCustomerBcc: [],
    toOnshore: [],
    toOnshoreCc: [],
    toOnshoreBcc: []
  });
  const [emailOrigin, setEmailOrigin] = useState(emails);

  const dispatch = useDispatch();

  const handleChange = (e, newValue) => {
    setTab(newValue);
  };

  const onSave = () => {
    updateMailAccess({ action: 'delete', emails }, mybl.id)
      .then(() => {
        setEdit(false);
      })
      .catch((err) => handleError(dispatch, err));
  };

  const onCancel = () => {
    setEmails(emailOrigin)
    setEdit(false);
  };

  const onDelete = (label, tag) => {
    const key = `to${tab ? 'Onshore' : 'Customer'}${label === 'To' ? '' : label}`;
    const result = emails[key];
    result.splice(tag, 1);
    setEmails((e) => ({
      ...e,
      [key]: result
    }));
  };

  useEffect(() => {
    getAllMailAccess(mybl.id)
      .then(({ data }) => {
        setEmails(data.data);
        setEmailOrigin(data.data);
      })
      .catch((err) => handleError(dispatch, err));
  }, []);
  return (
    <div>
      <Tabs
        indicatorColor="primary"
        style={{
          display: 'flex',
          margin: 0,
          height: '40px',
          marginBottom: 16,
          borderBottom: '2px solid #515F6B'
        }}
        value={tab}
        onChange={handleChange}>
        <Tab
          value={0}
          classes={{ wrapper: classes.iconLabelWrapper }}
          className={clsx(classes.tab, tab === 0 && classes.colorSelectedTab)}
          label="Customer"
        />
        <Tab
          value={1}
          classes={{ wrapper: classes.iconLabelWrapper }}
          className={clsx(classes.tab, tab === 1 && classes.colorSelectedTab)}
          label="Onshore"
        />
      </Tabs>
      {[
        { label: 'To', value: tab ? emails.toOnshore : emails.toCustomer },
        { label: 'Cc', value: tab ? emails.toOnshoreCc : emails.toCustomerCc },
        { label: 'Bcc', value: tab ? emails.toOnshoreBcc : emails.toCustomerBcc }
      ].map(({ label, value }, index) => (
        <>
          {value?.length ? (
            <fieldset style={{ border: '1px solid #E2E6EA', borderRadius: 8 }} key={index}>
              <legend style={{ color: '#7D7D7D' }}>{label}</legend>
              <div
                className="flex flex-wrap"
                style={{
                  background: 'white'
                }}>
                <>
                  {value.map((tag, i) => (
                    <StyledChip
                      clickable={false}
                      key={i}
                      label={tag}
                      onDelete={() => onDelete(label, tag)}
                      deleteIcon={isEdit ? <ClearIcon fontSize="small" /> : <></>}
                    />
                  ))}
                </>
              </div>
            </fieldset>
          ) : null}
        </>
      ))}
      {isEdit ? (
        <div style={{ display: 'flex', justifyContent: 'end', marginTop: 18 }}>
          <Button
            variant="contained"
            classes={{ root: classes.button, label: classes.buttonLabel }}
            color="primary"
            onClick={() => onSave()}>
            Save
          </Button>
          <Button
            variant="contained"
            classes={{ root: clsx(classes.button, 'reply'), label: classes.buttonLabel }}
            color="primary"
            onClick={() => onCancel()}>
            Cancel
          </Button>
        </div>
      ) : (
        <div style={{ textAlign: 'right', marginTop: 18 }}>
          <Button
            variant="contained"
            classes={{ root: classes.button, label: classes.buttonLabel }}
            color="primary"
            onClick={() => setEdit(true)}>
            <EditIcon style={{ width: 16 }} />
            Edit
          </Button>
        </div>
      )}
    </div>
  );
};

export default ListEmailAccess;
