import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestLoginAPI } from "../api/auth";

const validateEmail = (email) => {
  if (!email) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format.";
  return "";
};

const validatePassword = (password) => {
  if (!password) return "Password is required.";
  return "";
};

const initialFormState = {
  email: "",
  password: "",
};

const initialErrorState = {
  email: "",
  password: "",
  general: "",
};

export const useLoginForm = () => {
  const [formValues, setFormValues] = useState(initialFormState);
  const [errors, setErrors] = useState(initialErrorState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: "" }));
    }

    if (errors[name]) {
      validateField(name, value);
    }
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "email":
        error = validateEmail(value);
        break;
      case "password":
        error = validatePassword(value);
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
    setIsSubmitting(true);
    setErrors(initialErrorState); // Reset errors sebelum submit baru

    const emailValError = validateEmail(formValues.email);
    const passwordValError = validatePassword(formValues.password);

    const currentErrors = {
      email: emailValError,
      password: passwordValError,
      general: "",
    };

    if (emailValError || passwordValError) {
      setErrors(currentErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await requestLoginAPI(formValues);

      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);
        navigate("/");
      }
      if (
        formValues.email === "akundemo@gmail.com" &&
        formValues.password === "Akundemo123_"
      ) {
        localStorage.setItem("token", "demo-token");
        localStorage.setItem("username", "AkunDemo");
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      let errorMessage = "Login gagal. Silakan coba lagi.";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      setErrors((prev) => ({ ...prev, general: errorMessage }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formValues,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFormValues,
  };
};
