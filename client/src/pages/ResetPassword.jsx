import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { useEffect } from "react";
import FormInput from '../components/FormInput.jsx';
import BaseForm from "../components/BaseForm.jsx";

export default function ResetPassword() {

  // This page is for resetting the password after the user clicks the link in their email
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token'); // Get the reset token from the URL

  const navigate = useNavigate(); // Navigation hook

  useEffect(() => {
    if (!resetToken) {
      navigate('/login'); // If no token is present, redirect to login page
    }
  }, [resetToken, navigate]);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState(''); // Initialize error state to none
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track form submission
  
  const onSubmit = async (formData) => { // Handles form submission
    setServerError(''); // Clear previous server errors
    setSuccessMessage(''); // Clear previous success messages
    setIsSubmitting(true); // Set submitting state to true
    if (isSubmitting) return; // Prevent multiple submissions

    const { confirmNewPassword, newPassword } = formData; // Exclude confirmPassword from data to send

    try {
      // Make post request to API server
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: newPassword, token: resetToken }) // Include reset token in the request
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Password reset failed');

      // If successful, set success message and redirect after a delay
      setSuccessMessage('Password has been successfully reset.');
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

  return (

    <BaseForm onSubmit={handleSubmit(onSubmit)} title="Enter your new password">

      {serverError && <p className="text-red-500 text-sm sm:text-sm md:text-base lg:text-base xl:text-base 2xl:text-base">{serverError}</p>}

      <div className="w-full flex flex-col items-center gap-[10px]">
        <FormInput
          label="New Password"
          name="newPassword"
          type="password"
          register={register}
          error={errors.newPassword}
          rules={{
            required: 'New password is required',
            minLength: { value: 8, message: 'New password must be at least 8 characters' },
            pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, message: 'New password must contain at least one number, one lowercase, and one uppercase' }
          }}
          required
        />

        <FormInput
          label="Confirm New Password"
          name="confirmNewPassword"
          type="password"
          register={register}
          error={errors.confirmNewPassword}
          rules={{
            required: 'Confirm new password is required',
            validate: value =>
              value === watch('newPassword') || 'Passwords do not match'
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
        {isSubmitting ? 'Resetting...' : 'Reset Password'}
      </button>   
    </BaseForm>

  );
}