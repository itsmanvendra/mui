import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const schema = yup.object().shape({
  roCode: yup.string().required("ro code is required"),
  dealerName: yup.string().required("dealer name is required"),
  pumpName: yup.string().required("pump name is required"),
  email: yup.string().required("email is required").email("email is invalid"),
  address: yup.string().required("address is required"),
  city: yup.string().required("city is required"),
  pin: yup.string().matches(/^\d{6}$/, "pin is not valid"),
  gstinNo: yup.string().required("gstin no is required"),
  mobile: yup
    .string()
    .matches(phoneRegExp, "whatsapp number is not valid")
    .required("whatsapp no is required"),
  file: yup.mixed().test("file", "You need to provide a file", (value) => {
    if (value.length > 0) {
      return true;
    }
    return false;
  }),
});

const NewOutlet = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [stateError, setStateError] = useState(null);
  const [compErr, setCompErr] = useState(null);
  const [disErr, setDisErr] = useState(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_DOMAIN}api/register/data/get`,
      );
      console.log(response.data);
      setStates(response.data.states);
      setDistricts(response.data.districts);
      setCompanies(response.data.companies);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  let formSubmitHanler = async (data) => {
    try {
      console.log(data, selectedState, selectedCompany, selectedDistrict);
      let is = true;
      if (!selectedState) {
        setStateError("please select valid state");
        is = false;
      }
      if (!selectedCompany) {
        setCompErr("please select valid company");
        is = false;
      }
      if (!selectedDistrict) {
        setDisErr("please select valid district");
        is = false;
      }
      if (!is) {
        return;
      }

      const formData = new FormData();
      for (let key in data) {
        if (key != "file") {
          formData.append(key, data[key]);
        }
      }
      formData.append("file", data.file[0]);
      formData.append("districtId", selectedDistrict);
      formData.append("stateId", selectedState);
      formData.append("companyId", selectedCompany);

      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_DOMAIN}api/register/verify/new`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      // todo: redirect to success page
      console.log(response.data);
    } catch (error) {
      if (error.response.data.type === "file") {
        setError("file", {
          type: "server",
          message: error.response.data.message,
        });
      }
      console.log(error);
    }
  };

  const getDistricts = async (stateId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_DOMAIN}api/register/data/districts`,
        { stateId: stateId },
      );
      setDistricts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(formSubmitHanler)}>
        <div>
          <label>RO Code</label>
          <input {...register("roCode")} placeholder="RO Code" type="text" />
          <p>{errors.roCode?.message}</p>
        </div>
        <div>
          <label>Dealer Name</label>
          <input
            {...register("dealerName")}
            placeholder="dealer name"
            type="text"
          />
          <p>{errors.dealerName?.message}</p>
        </div>
        <div>
          <label>Gstin No</label>
          <input {...register("gstinNo")} placeholder="Gstin No" type="text" />
          <p>{errors.gstinNo?.message}</p>
        </div>
        <div>
          <label>Pump Name</label>
          <input
            {...register("pumpName")}
            placeholder="pump name"
            type="text"
          />
          <p>{errors.pumpName?.message}</p>
        </div>
        <div>
          <label>Mobile</label>
          <input {...register("mobile")} placeholder="mobile" type="number" />
          <p>{errors.mobile?.message}</p>
        </div>
        <div>
          <label>Email</label>
          <input {...register("email")} placeholder="email" type="email" />
          <p>{errors.email?.message}</p>
        </div>
        <div>
          <label>address</label>
          <input {...register("address")} placeholder="address" type="text" />
          <p>{errors.address?.message}</p>
        </div>
        <div>
          <label>City</label>
          <input {...register("city")} placeholder="city" type="text" />
          <p>{errors.city?.message}</p>
        </div>
        <div>
          <label>Pin</label>
          <input {...register("pin")} placeholder="pin" type="number" />
          <p>{errors.pin?.message}</p>
        </div>
        <div>
          <label>state</label>
          {states.length > 0 && (
            <Select
              onChange={(e) => {
                setSelectedState(e.value);
                setStateError(null);
                getDistricts(e.value);
              }}
              options={states.map((val) => {
                return {
                  label: val.state,
                  value: val.id,
                };
              })}
              maxMenuHeight={300}
            ></Select>
          )}{" "}
          {stateError && <p>{stateError}</p>}
        </div>
        <div>
          <label>District</label>
          {districts.length > 0 && (
            <Select
              onChange={(e) => {
                console.log(e.value);
                setSelectedDistrict(e.value);
                setDisErr(null);
              }}
              options={districts.map((val) => {
                return {
                  value: val.id,
                  label: val.district,
                };
              })}
            ></Select>
          )}{" "}
          {disErr && <p>{disErr}</p>}
        </div>
        <div>
          <label>company</label>
          {companies.length > 0 && (
            <Select
              onChange={(e) => {
                setSelectedCompany(e.value);
                setCompErr(null);
              }}
              options={companies.map((val) => {
                return {
                  value: val.id,
                  label: val.name,
                };
              })}
              maxMenuHeight={300}
            ></Select>
          )}{" "}
          {compErr && <p>{compErr}</p>}
        </div>
        <div>
          <label>File up to 300kb</label>
          <input type="file" {...register("file")} placeholder="bill" />
          {errors.file && <p>{errors.file.message}</p>}
        </div>
        <br></br>
        <button type="submit">submit</button>
      </form>
    </>
  );
};

export default NewOutlet;
