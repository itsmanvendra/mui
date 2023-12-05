import react, { useState, useEffect } from "react";
import NewOutlet from "./NewOutlet";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const Step2 = ({ outlets, submitHandler, selectedState }) => {
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const [error, setError] = useState(null);
  const [backError, setBackError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (outlets.length == 0) {
      navigate("/registration/new");
    }
  }, []);

  const formSubmitHandler = async () => {
    try {
      console.log("hi");

      if (!selectedOutlet) {
        setError("please select a outlet first");
      } else if (!selectedOutlet.mobile) {
        navigate(`/registration/update/${selectedState}/${selectedOutlet.id}`);
        // redirect to update outlet
      } else {
        const response = await axios.post(
          `${process.env.REACT_APP_SERVER_DOMAIN}api/register/otp/send`,
          {
            outlet: selectedOutlet,
            state: selectedState,
          },
        );
        console.log(response.data);
        submitHandler(selectedOutlet);
        // send request
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Outlet Code</th>
            <th>Dealer Name</th>
            <th>Business Name</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {outlets.map((outlet) => {
            return (
              <tr key={outlet.id}>
                <td>
                  <input
                    type="radio"
                    name="outlet"
                    value={outlet.id}
                    onClick={() => {
                      setSelectedOutlet(outlet);
                    }}
                  />
                </td>
                <td>{outlet.ro_code ? outlet.ro_code : "-"}</td>
                <td>{outlet.dealer_name ? outlet.dealer_name : "-"}</td>
                <td>{outlet.pump_name ? outlet.pump_name : "-"}</td>
                <td>{outlet.mobile ? outlet.mobile : "-"}</td>
                <td>{outlet.email ? outlet.email : "-"}</td>
                <td>{outlet.address ? outlet.address : "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {error && <p>{error}</p>}
      <div>
        <button
          onClick={() => {
            formSubmitHandler();
          }}
        >
          Submit
        </button>
        <NavLink to="/registration/new">Not In List</NavLink>
      </div>
    </>
  );
};

export default Step2;
