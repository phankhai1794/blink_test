import React, { createRef, useMemo, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as HeaderActions from 'app/store/actions/header';
import GuestWorkspace from './GuestWorkspace';
import OtpInput from 'react-otp-input';

const OtpCheck = ({ status }) => {
  const CODE = '1111';
  const dispatch = useDispatch();
  const [otpCode, setOtpCode] = useState('');
  const handleChange = (code) => {
    setOtpCode(code);
  };
  useEffect(() => {
    dispatch(HeaderActions.displayBtn());
  }, []);

  return (
    <>
      {otpCode === CODE ? (
        <GuestWorkspace status={status} />
      ) : (
        <div>
          <div style={{ margin: '2rem auto 4rem auto', textAlign: 'center' }}>
            <img src="../assets/images/logos/one_ocean_network-logo.png" alt="company logo" />
          </div>
          <div style={{ margin: '2rem auto', display: 'flex' }}>
            <OtpInput
              value={otpCode}
              onChange={handleChange}
              numInputs={4}
              inputStyle={{
                fontSize: '4rem',
                margin: 'auto 5rem',
                padding: '2rem',
                borderRadius: 4,
                border: '1px solid rgba(0,0,0,0.3)'
              }}
              containerStyle={{
                margin: 'auto'
              }}
            />
          </div>
          {otpCode.length === CODE.length && otpCode !== CODE && (
            <h2 style={{ color: 'red', margin: 'auto', textAlign: 'center' }}>
              {' '}
              Incorrect OTP Code
            </h2>
          )}
        </div>
      )}
    </>
  );
};

export default OtpCheck;
