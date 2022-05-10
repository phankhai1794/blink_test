import { TextFieldFormsy } from '@fuse';
import { Button, Icon, InputAdornment } from '@material-ui/core';
import { displayToast } from '@shared';
import { forgotPassword } from 'app/services/authService';
import Formsy from 'formsy-react';
import React, { useRef, useState } from 'react';

function ForgotPasswordTab(props) {

  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef(null);


  function disableButton() {
    setIsFormValid(false);
  }

  function enableButton() {
    setIsFormValid(true);
  }

  function handleSubmit(model) {
    forgotPassword(model).then(data => {
      displayToast('success');
      props.loginTabView(true)
    }).catch(err => {
      displayToast('error', err.message);
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
