import react from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const schema = yup.object().shape({
  dealerName: yup.string().required("dealer name is required"),
  email: yup.string().required("email is required").email("email is invalid"),
  address: yup.string().required("address is required"),
  city: yup.string().required("city is required"),
  pin: yup.string().matches(/^\d{6}$/, "pin is not valid"),
  whatsapp: yup
    .string()
    .matches(phoneRegExp, "whatsapp number is not valid")
    .required("whatsapp no is required"),
});

const Step4 = ({ submitHandler, businessId }) => {
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  let formSubmitHanler = async (data) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_DOMAIN}api/register/details/add`,
        {
          data: data,
          businessId: businessId,
        },
      );
      submitHandler(response.data);
      console.log(response.data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  let fetchMobile = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_DOMAIN}api/register/details/mobile`,
        {
          businessId: businessId,
        },
      );
      console.log(response.data.mobile);
      setValue("whatsapp", response.data.mobile, {
        shouldValidate: true,
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(formSubmitHanler)}>
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
          <label>Whats App Number</label>
          <div>
            <input
              {...register("whatsapp")}
              placeholder="Whatsapp number"
              type="text"
            />
            <button
              type="button"
              onClick={() => {
                fetchMobile();
              }}
            >
              Same As Mobile
            </button>
          </div>
          <p>{errors.whatsapp?.message}</p>
        </div>
        <div>
          <label>Email</label>
          <input {...register("email")} placeholder="email" type="email" />
          <p>{errors.email?.message}</p>
        </div>
        <div>
          <label>Address</label>
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
          <input {...register("pin")} placeholder="city" type="number" />
          <p>{errors.pin?.message}</p>
        </div>
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default Step4;
