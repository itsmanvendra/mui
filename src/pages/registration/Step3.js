import react, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Step3 = ({ outlet, submitHandler, selectedState }) => {
  const [enteredOtp, setEnteredOtp] = useState();
  const navigate = useNavigate();

  const formSubmitHandler = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_DOMAIN}api/register/otp/verify`,
        {
          outlet: outlet,
          otp: enteredOtp,
          state: selectedState,
        },
      );
      submitHandler(response.data);
    } catch (error) {
      // todo: handle errors
      console.log(error);
    }
  };

  return (
    <>
      <div>
        <div>enter opt send on mobile {outlet.mobile}</div>
        <button
          onClick={() => {
            navigate(`/registration/update/${selectedState}/${outlet.id}`);
          }}
        >
          change mobile
        </button>
      </div>
      <form>
        <input
          type="text"
          onChange={(e) => {
            setEnteredOtp(e.target.value);
          }}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            formSubmitHandler();
          }}
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default Step3;
