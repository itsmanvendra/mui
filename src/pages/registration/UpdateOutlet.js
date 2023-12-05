import react from "react";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "react-router-dom";
import axios from "axios";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const schema = yup.object().shape({
  email: yup.string().required("email is required").email("email is invalid"),
  mobile: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("mobile no is required"),
  gstinNo: yup.string().required("gstin no is required"),
  file: yup.mixed().test("file", "You need to provide a file", (value) => {
    if (value.length > 0) {
      return true;
    }
    return false;
  }),
});
const UpdateOutlet = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const params = useParams();
  console.log(params);

  const formSubmitHandler = async (data) => {
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("gstinNo", data.gstinNo);
      formData.append("mobile", data.mobile);
      formData.append("file", data.file[0]);
      formData.append("state", params.stateId);
      formData.append("prospectId", params.prospectId);
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_DOMAIN}api/register/verify/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      console.log(response.data);
      console.log(data);
      // todo: redirect to success page
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(formSubmitHandler)}>
        <div>
          <label>mobile no</label>
          <input {...register("mobile")} placeholder="mobile" type="number" />
          <p>{errors.mobile?.message}</p>
        </div>
        <div>
          <label>Email</label>
          <input {...register("email")} placeholder="email" type="email" />
          <p>{errors.email?.message}</p>
        </div>
        <div>
          <label>Gstin No</label>
          <input
            {...register("gstinNo")}
            placeholder="Gstin Number"
            type="text"
          />
          <p>{errors.gstinNo?.message}</p>
        </div>
        <div>
          <label>File up to 300kb</label>
          <input type="file" {...register("file")} placeholder="bill" />
          <p>{errors.file?.message}</p>
        </div>
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default UpdateOutlet;
