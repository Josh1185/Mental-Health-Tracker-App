import { useState } from "react";
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import FormInput from '../components/FormInput.jsx';

export default function ForgotPassword() {

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState(''); // Initialize error state to none
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track form submission
  const navigate = useNavigate(); // Navigation hook

  const onSubmit = async (formData) => { // Handles form submission
    setServerError(''); // Clear previous server errors
    setSuccessMessage(''); // Clear previous success messages
    setIsSubmitting(true); // Set submitting state to true
    if (isSubmitting) return; // Prevent multiple submissions

    try {
      // Make post request to API server
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/request-password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Password reset request failed');

      // If successful, set success message and redirect after a delay
      setSuccessMessage('Password reset link sent to your email.');
      setTimeout(() => {
        navigate('/login'); // Redirect to login page after 3 seconds
      }, 3000);
    }
    catch (err) {
      setServerError(err.message); // Set server error message
    }
    finally {
      setIsSubmitting(false); // Reset submitting state
    }
  }

  // JSX
  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="
        w-[85%] max-w-[400px] p-[20px_30px] rounded-[5px]
        bg-(--background-color)
        flex flex-col items-center
        animate-(--animate-fade-in-scale)
      "
    >
      <h2 
        className="
          text-md sm:text-lg md:text-xl lg:text-xl xl:text-xl 2xl:text-xl
          text-center
          mb-[20px]
        "
      >
        Enter your email to reset your password
      </h2>
      {serverError && <p className="text-red-500 text-sm sm:text-sm md:text-base lg:text-base xl:text-base 2xl:text-base">{serverError}</p>}

      <div className="w-full flex flex-col items-center gap-[10px]">
        <FormInput
          label="Email"
          name="email"
          register={register}
          error={errors.email}
          rules={{ 
            required: 'Email is required',
            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
          }}
          required
        />
      </div>

      {successMessage && <p className="text-green-500 text-sm sm:text-sm md:text-base lg:text-base xl:text-base 2xl:text-base mt-[10px]">{successMessage}</p>}

      <button 
        type="submit" 
        className="
          w-full py-[10px] mt-[20px]
          bg-linear-to-br from-(--primary-color) to-(--accent-color)
          text-[#F2F4F7]
          rounded-[5px]
          text-sm sm:text-sm md:text-base lg:text-base xl:text-base 2xl:text-base
          transition-all duration-150
          hover:shadow-[1px_1px_3px_var(--shadow-color)]
        "
        disabled={!!successMessage || isSubmitting} // Disable button if success message is shown or form is submitting
      >
        {isSubmitting ? 'Sending...' : 'Send Reset Link'}
      </button>   

      <p
        className="
          text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-sm
          mt-[20px]
        "
      >
        Remembered your password?
        <a href="/login" className="ml-[5px] underline text-(--primary-color)">Login</a>
      </p>
    </form>
  );
}