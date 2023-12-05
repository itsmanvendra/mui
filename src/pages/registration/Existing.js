import react, { useState } from "react";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const schema = yup.object().shape({
  mobile: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("mobile no is required"),
  licCode: yup.string().required("licence code is required"),
  otp: yup.string().required("otp is required"),
});
const Existing = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();

  const formSubmitHandler = async (data) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_DOMAIN}api/register/exists/get`,
        data,
      );
      navigate("/registration", {
        state: {
          curStep: response.data.curStep,
          businessId: response.data.businessId,
        },
      });
      console.log(response.data);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const getOtpHandler = async () => {
    try {
      let mobile = getValues("mobile");
      if (!phoneRegExp.test(mobile)) {
        setError("mobile", {
          type: "custom",
          message: "mobile number not valid",
        });
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_DOMAIN}api/register/exists/otp`,
        {
          mobile: mobile,
        },
      );

      console.log(response.data);

      console.log("getting otp");
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit(formSubmitHandler)}>
      <div>
        <label>mobile no</label>
        <input
          {...register("mobile")}
          onChange={() => {
            setError("mobile", null);
          }}
          placeholder="mobile"
          type="number"
        />
        <p>{errors.mobile?.message}</p>
      </div>
      <button
        type="button"
        onClick={() => {
          getOtpHandler();
        }}
      >
        Get Otp
      </button>
      <div>
        <label>Otp</label>
        <input {...register("otp")} placeholder="otp" type="text" />
        <p>{errors.otp?.message}</p>
      </div>
      <div>
        <label>licence code</label>
        <input
          {...register("licCode")}
          placeholder="licence code"
          type="text"
        />
        <p>{errors.licCode?.message}</p>
      </div>
      <div>
        <button type="submit">submit</button>
      </div>
    </form>
  );
};

export default Existing;
