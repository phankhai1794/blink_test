import React, { createRef, useMemo, useState } from 'react';
import { Input, TextField } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import GuestWorkspace from './GuestWorkspace';
import OtpInput from "react-otp-input"
const OtpCheck = () => {
    const [otpCode, setOtpCode] = useState("");
    const handleChange = (code) => {
        setOtpCode(code)
    }
    return (
        <>
            {otpCode === "111111" ? (
                <GuestWorkspace />
            ) :
                (
                    <div>
                        <div style={{ margin: "2rem auto 4rem auto", textAlign: "center" }}>
                            <img
                                src="../assets/images/logos/one_ocean_network-logo.png"
                                alt="company logo"
                            />
                        </div>
                        <div style={{ margin: "2rem auto", display: "flex" }}>
                            <OtpInput
                                value={otpCode}
                                onChange={handleChange}
                                numInputs={6}
                                inputStyle={{
                                    fontSize: "4rem",
                                    margin: "auto 5rem",
                                    padding: "2rem",
                                    borderRadius: 4,
                                    border: "1px solid rgba(0,0,0,0.3)"
                                }}
                                containerStyle={{
                                    margin: "auto",
                                }}
                            />
                        </div>
                        {otpCode.length === 6 && otpCode !== "111111" && (
                            <h2 style={{ color: "red", margin: "auto", textAlign: "center" }}> Incorrect OTP Code</h2>
                        )}
                    </div>
                )}

        </>

    )
}
{/* < input type="number" ref={inputRefs[index]} onChange={handleChange(index)} /> */ }

export default OtpCheck;
