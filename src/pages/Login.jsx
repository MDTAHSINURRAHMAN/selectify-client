import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import { FaGoogle } from "react-icons/fa";
import { toast } from "react-toastify";
import Navbar from "../components/shared/Navbar";
import Logo from "../components/shared/logo";

const Login = () => {
  const { userLogin, signInWithGoogle, setUser } = useContext(AuthContext);
  const [error, setError] = useState({});
  const [email, setEmail] = useState(""); // State to hold the email input
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const email = form.get("email");
    const password = form.get("password");

    setEmail(email); // Store email in state

    userLogin(email, password)
      .then((result) => {
        const user = result.user;
        setUser(user);
        toast.success("Login successful! Welcome back!");
        navigate(location?.state ? location.state : "/");
      })
      .catch(() => {
        toast.error("Invalid Email or Password");
      });
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then((result) => {
        const user = result.user;
        setUser(user);
        toast.success("Welcome to The Career Advisory");
        navigate(location?.state?.from || "/");
      })
      .catch(() => {
        toast.error("Failed to sign in with Google");
      });
  };

  return (
    <div>
      <Logo></Logo>
      <Navbar></Navbar>
      <div className="min-h-screen flex justify-center items-center font-karla text-center">
        <div className="card bg-background-color w-full max-w-lg shrink-0 rounded-none p-2 md:p-5 lg:p-10 shadow-xl">
          <h2 className="text-2xl md:text-4xl font-semibold">
            Login Your Account
          </h2>
          <form onSubmit={handleSubmit} className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="email"
                className="input input-bordered rounded-none"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                name="password"
                type="password"
                placeholder="password"
                className="input input-bordered rounded-none"
                required
              />
              {error.login && (
                <label className="label text-sm text-red-600">
                  {error.login}
                </label>
              )}
              <label className="label">
                <Link
                  to="/forgot-password"
                  state={{ email }} // Pass email to ForgotPassword page
                  className="label-text-alt link link-hover"
                >
                  Forgot password?
                </Link>
              </label>
            </div>
            <div className="form-control mt-3">
              <button className="btn bg-banner-title hover:bg-hover-color text-white font-medium rounded-none">Login</button>
            </div>
          </form>
          <div className="form-control px-8 mb-6">
            <button
              onClick={handleGoogleSignIn}
              className="btn bg-banner-title hover:bg-hover-color text-white font-medium rounded-none"
            >
              <FaGoogle /> Login With Google
            </button>
          </div>
          <p className="text-sm md:text-base text-center font-semibold">
            Don't Have An Account?{" "}
            <Link
              className="text-sm md:text-base text-hover-color hover:underline ml-1"
              to="/auth/register"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
