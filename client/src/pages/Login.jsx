import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import FormInput from '../components/FormInput.jsx';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState(''); // Initialize error state to none
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const navigate = useNavigate(); // Navigation hook

  const onSubmit = async (formData) => { // Handles form submission
    setServerError(''); // Clear prev server errors
    setSuccessMessage(''); // Clear previous success messages
    // Make post request to API server
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, { // Make post request to api server
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Login Failed');

      setSuccessMessage('Login successful! Redirecting...'); // Set success message
      /* ADDED LATER
      setTimeout(() => {
        navigate('/dashboard'); // Redirect to dashboard after 3 seconds
      }, 3000);
      */
    }
    catch (err) {
      setServerError(err.message);
    }
  };

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
        Welcome back! Login to continue
      </h2>
      {serverError && <p className="text-red-500 text-sm sm:text-sm md:text-base lg:text-base xl:text-base 2xl:text-base">{serverError}</p>}
      {successMessage && <p className="text-green-500 text-sm sm:text-sm md:text-base lg:text-base xl:text-base 2xl:text-base mt-[10px]">{successMessage}</p>}

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
        <FormInput
          label="Password"
          name="password"
          type="password"
          register={register}
          error={errors.password}
          rules={{
            required: 'Password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters' },
            pattern: { value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, message: 'Password must contain at least one number and letter' }
          }}
          required
        />
      </div>

      <a href="/forgot-password"
        className="
          underline text-(--primary-color)
          text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-sm
          mt-[10px] flex justify-left w-full
        "
      >
        Forgot Password?
      </a>

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
        disabled={!!successMessage}
      >
        Login
      </button>

      <p className="text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-sm my-[5px]">or</p>

      <button
        className="
          w-full py-[10px]
          flex flex-row items-center justify-center md:gap-[10px] gap-[5px]
          text-[--text-color] border-solid border-[1px] border-(--text-color)
          rounded-[5px] bg-transparent
          text-sm sm:text-sm md:text-base lg:text-base xl:text-base 2xl:text-base
          transition-all duration-150
          hover:shadow-[1px_1px_3px_var(--shadow-color)]
        "
        disabled={!!successMessage}
      >
        <img className="w-[20px] h-[20px]" src="../../google-icon.svg" alt="Google icon" />
        Login with Google
      </button>    

      <p
        className="
          text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-sm
          mt-[20px]
        "
      >
        New with us?
        <a href="/register" className="ml-[5px] underline text-(--primary-color)">Register</a>
      </p>
    </form>
  );
}