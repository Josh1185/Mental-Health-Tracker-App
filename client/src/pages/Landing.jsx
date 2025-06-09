import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <>
      <h1>Landing Page</h1>
      <Link to="/register">Register</Link>
      <Link to="/login">Login</Link>
    </>
  );
}