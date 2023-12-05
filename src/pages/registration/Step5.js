import react from "react";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

const schema = yup.object().shape({
  username: yup.string().required("username is required"),
  password: yup
    .string()
    .required("password is required")
    .matches(
      /(?=.*[!@#$%^&*(),.?":{}|<>])/,
      "password should contain at least one symbol",
    )
    .matches(/(?=.*[A-Z])/, "should contain at least one uppercase letter")
    .matches(/(?=.*[a-z])/, "should contain at least one lowercase letter")
    .matches(/(?=.*\d)/, "should contain at least one digit")
    .min(8, "password at least 8 characters long"),
  cpassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

const Step5 = ({ submitHandler, buisnessId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  let formSubmitHandler = async (data) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_DOMAIN}api/register/user/add`,
        {
          data: data,
          buisnessId: buisnessId,
        },
      );
      submitHandler(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(formSubmitHandler)}>
        <div>
          <label>Username</label>
          <input {...register("username")} placeholder="username" type="text" />
          <p>{errors.username?.message}</p>
        </div>
        <div>
          <label>Password</label>
          <input
            {...register("password")}
            placeholder="password"
            type="password"
          />

          <p>{errors.password?.message}</p>
        </div>
        <div>
          <label>Renter Password</label>
          <input
            {...register("cpassword")}
            placeholder="password"
            type="password"
          />

          <p>{errors.cpassword?.message}</p>
        </div>
        <button type="submit">Submit</button>
        <button type="button">Suggest</button>
      </form>
    </div>
  );
};

export default Step5;
