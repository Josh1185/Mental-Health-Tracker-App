import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState(''); // Initialize error state to none
  const navigate = useNavigate(); // Navigation hook

  const onSubmit = async (formData) => { // Handles form submission
    setServerError(''); // Clear prev server errors
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, { // Make post request to api server
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login Failed');

      alert('Login successful');
    }
    catch (err) {
      setServerError(err.message);
    }
  };

  // JSX
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-semibold">Login</h2>
      {serverError && <p className="text-red-500">{serverError}</p>}

      <input
        {...register('email', {
          required: 'Email is required',
          pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
        })}
        placeholder="Email"
        className="w-full p-2 border"
      />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}

      <input
        type="password"
        {...register('password', {
          required: 'Password is required',
          minLength: { value: 8, message: 'Password must be at least 8 characters' }
        })}
        placeholder="Password"
        className="w-full p-2 border"
      />
      {errors.password && <p className="text-red-500">{errors.password.message}</p>}

      <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">Login</button>
    </form>
  );
}