import react, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

const Step1 = ({ submitHandler }) => {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [outletCode, setOutletCode] = useState("");

  const [stateError, setStateError] = useState(null);
  const [compErr, setCompErr] = useState(null);
  const [disErr, setDisErr] = useState(null);

  const formSubmitHandler = (e) => {
    e.preventDefault();
    console.log(selectedState);
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
    let data = {};
    data.state = selectedState;
    data.district = selectedDistrict;
    data.company = selectedCompany;
    data.outletCode = outletCode;

    submitHandler(data);
  };

  const getDistricts = async (stateId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_DOMAIN}api/register/data/districts`,
        { stateId: stateId },
      );
      console.log(response.data);
      setDistricts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_DOMAIN}api/register/data/get`,
      );
      setStates(response.data.states);
      setDistricts(response.data.districts);
      setCompanies(response.data.companies);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <form onSubmit={formSubmitHandler}>
        <div>
          <label>Select State</label>
          {states.length > 0 && (
            <Select
              onChange={(e) => {
                console.log(e);
                setSelectedState(e.value);
                getDistricts(e.value);
                setStateError(null);
              }}
              options={states.map((val) => {
                return {
                  label: val.state,
                  value: val.id,
                };
              })}
              maxMenuHeight={200}
              defaultValue={null}
            ></Select>
          )}{" "}
          {stateError && <p>{stateError}</p>}
        </div>
        <div>
          <label>District</label>
          {districts.length > 0 && (
            <Select
              onChange={(e) => {
                setSelectedDistrict(e.value);
                setDisErr(null);
              }}
              options={districts.map((val) => {
                return {
                  value: val.id,
                  label: val.district,
                };
              })}
              maxMenuHeight={200}
            ></Select>
          )}{" "}
          {disErr && <p>{disErr}</p>}
        </div>
        <div>
          <label>Comapany</label>
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
              maxMenuHeight={200}
            ></Select>
          )}{" "}
          {compErr && <p>{compErr}</p>}
        </div>
        <div>
          <label>Outlet Code</label>
          <input
            type="number"
            placeholder="Outlet Code"
            onChange={(e) => {
              setOutletCode(e.target.value);
            }}
          />
        </div>
        <br></br>
        <button type="submit">submit</button>
      </form>
    </div>
  );
};
export default Step1;
