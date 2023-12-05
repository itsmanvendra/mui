import React, { useState, useEffect } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Registration() {
  const [curStep, setCurstep] = useState(1);
  const [outlets, setOutlets] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [buisnessId, setBuisnessId] = useState(null);
  const [licenceCode, setLicenceCode] = useState(null);
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    console.log(state);
    if (state && state.curStep && state.businessId) {
      setCurstep(state.curStep);
      setBuisnessId(state.businessId);
    }
  }, []);

  const step1SubmitHadler = async (data) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_DOMAIN}api/register/data/outlets`,
        data,
      );
      setOutlets(response.data);
      setSelectedState(data.state);
      setCurstep(2);
    } catch (error) {
      console.log(error);
    }
  };

  const step2SubmitHandler = (outlet) => {
    setSelectedOutlet(outlet);
    setCurstep(3);
  };

  const step3SubmitHandler = (data) => {
    console.log(data);
    setBuisnessId(data.businessId);
    setLicenceCode(data.licenceCode);
    setCurstep(4);
    console.log(data);
  };

  const step4SubmitHandler = (data) => {
    setCurstep(5);
    console.log(data);
  };

  const step5SubmitHandler = (data) => {
    navigate("/registration/success");
    console.log(data);
  };

  let content = null;
  if (curStep == 1) {
    content = <Step1 submitHandler={step1SubmitHadler}></Step1>;
  } else if (curStep == 2) {
    content = (
      <Step2
        submitHandler={step2SubmitHandler}
        selectedState={selectedState}
        outlets={outlets}
      ></Step2>
    );
  } else if (curStep == 3) {
    content = (
      <Step3
        submitHandler={step3SubmitHandler}
        selectedState={selectedState}
        outlet={selectedOutlet}
      ></Step3>
    );
  } else if (curStep == 4) {
    content = (
      <Step4
        submitHandler={step4SubmitHandler}
        businessId={buisnessId}
        licenceCode={licenceCode}
      ></Step4>
    );
  } else if (curStep == 5) {
    content = (
      <Step5 submitHandler={step5SubmitHandler} buisnessId={buisnessId}></Step5>
    );
  }

  return <>{content}</>;
}

export default Registration;
