import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "../utils/validationRegister";
import { requestRegisterAPI } from "../api/auth";
import toast from "react-hot-toast";

const initialFormState = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const initialErrorState = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const useRegistrationForm = () => {
  const [formValues, setFormValues] = useState(initialFormState);
  const [errors, setErrors] = useState(initialErrorState);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username" && value.length > 14) {
      return; // Jangan update state kalau lebih dari 14 karakter
    }
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    if (errors[name]) {
      validateField(name, value, formValues.password);
    }
  };

  const validateField = (name, value, passwordValue = formValues.password) => {
    let error = "";
    switch (name) {
      case "username":
        error = validateUsername(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "password":
        error = validatePassword(value);
        if (formValues.confirmPassword) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            confirmPassword: validateConfirmPassword(
              formValues.confirmPassword,
              value,
            ),
          }));
        }
        break;
      case "confirmPassword":
        error = validateConfirmPassword(value, passwordValue);
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usernameValError = validateUsername(formValues.username);
    const emailValError = validateEmail(formValues.email);
    const passwordValError = validatePassword(formValues.password);
    const confirmPasswordValError = validateConfirmPassword(
      formValues.confirmPassword,
      formValues.password,
    );

    const currentErrors = {
      username: usernameValError,
      email: emailValError,
      password: passwordValError,
      confirmPassword: confirmPasswordValError,
    };

    setErrors(currentErrors);

    const isFormValid = Object.values(currentErrors).every((error) => !error);

    if (!isFormValid) {
      return;
    }

    try {
      const res = await requestRegisterAPI(formValues);
      if (res.status === 201) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);
        navigate("/");
        toast.success("Registrasi berhasil !", {
          duration: 3000,
        });
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        alert(`Registrasi gagal: ${err.response.data.message}`);
      } else {
        alert("Registrasi gagal. Silakan coba lagi.");
      }
    }
  };

  return {
    formValues,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
  };
};
