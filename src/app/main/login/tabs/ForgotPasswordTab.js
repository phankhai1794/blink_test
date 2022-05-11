import React, { useRef, useState } from 'react';
import { TextFieldFormsy } from '@fuse';
import { Button, Icon, InputAdornment } from '@material-ui/core';
import { forgotPassword } from 'app/services/authService';
import { useDispatch } from 'react-redux';
import Formsy from 'formsy-react';
import * as AppAction from 'app/store/actions';
function ForgotPasswordTab(props) {

  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef(null);

  const dispatch = useDispatch();
  function disableButton() {
    setIsFormValid(false);
  }

  function enableButton() {
    setIsFormValid(true);
  }

  function handleSubmit(model) {
    forgotPassword(model).then(data => {
      dispatch(AppAction.showMessage({ message: 'Please check your email to reset your password.', variant: 'success' }));
      props.loginTabView(true)
    }).catch(err => {
      dispatch(AppAction.showMessage({ message: err.message, variant: 'error' }));
    });
  }

  return (
    <div className="w-full">
      <Formsy
        onValidSubmit={handleSubmit}
        onValid={enableButton}
        onInvalid={disableButton}
        ref={formRef}
        className="flex flex-col justify-center w-full"
      >
        <TextFieldFormsy
          className="mb-16"
          type="text"
          name="userName"
          label="Username"
          validations={{
            minLength: 4
          }}
          validationErrors={{
            minLength: 'Min character length is 4'
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Icon className="text-20" color="action">
                  person
                </Icon>
              </InputAdornment>
            )
          }}
          variant="outlined"
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="w-full mx-auto mt-16 normal-case"
          aria-label="LOG IN"
          disabled={!isFormValid}
          value="legacy"
        >
          Send to my email
        </Button>
      </Formsy>
    </div>
  );
}

export default ForgotPasswordTab;
