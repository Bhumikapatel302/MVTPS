import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Custom CSS to hide scrollbar but keep scroll functionality
const hideScrollbar = {
  scrollbarWidth: 'none',  /* Firefox */
  '&::-webkit-scrollbar': {
    display: 'none',  /* Chrome, Safari, Opera */
  },
  '&': {
    msOverflowStyle: 'none',  /* IE and Edge */
  }
};
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "../services/api";
import {
  ShieldCheck,
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  AlertTriangle,
  CheckCircle2,
  Briefcase,
  TrendingUp,
  Ship,
  Anchor,
  Loader2,
} from "lucide-react";

const ADMIN_EMAIL = "admin@vesselapp.com";
const ADMIN_PASSWORD = "admin123";

const LoginRegister = () => {
  const [authMode, setAuthMode] = useState("login");
  const [mounted, setMounted] = useState(false);
  const [selectedRole, setSelectedRole] = useState("operator");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const isAdminLogin =
    authMode === "login" &&
    formData.email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
    formData.password === ADMIN_PASSWORD;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setErrors({});
    setAuthError("");
    setShowSuccess(false);
  }, [authMode]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    if (authError) setAuthError("");
  };

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const validateForm = () => {
    const nextErrors = {};
    const trimmed = {
      username: formData.username ? formData.username.trim() : '',
      email: formData.email ? formData.email.trim() : '',
      password: formData.password || '',
      confirmPassword: formData.confirmPassword || '',
    };

    if (authMode === 'register') {
      // Username validation
      if (!trimmed.username) {
        nextErrors.username = 'Username is required';
      } else if (trimmed.username.length < 3) {
        nextErrors.username = 'Username must be at least 3 characters';
      } else if (!/^[a-zA-Z0-9@.+\-_]+$/.test(trimmed.username)) {
        nextErrors.username = 'Username can only contain letters, numbers, and @/./+/-/_';
      }

      // Email validation
      if (!trimmed.email) {
        nextErrors.email = 'Email is required';
      } else if (!validateEmail(trimmed.email)) {
        nextErrors.email = 'Please enter a valid email';
      }

      // Password validations
      if (!trimmed.password) {
        nextErrors.password = 'Password is required';
      } else if (trimmed.password.length < 8) {
        nextErrors.password = 'Password must be at least 8 characters';
      } else if (/^\d+$/.test(trimmed.password)) {
        nextErrors.password = 'Password cannot be all numbers';
      } else if (['password', '12345678', 'qwerty', 'letmein'].includes(trimmed.password.toLowerCase())) {
        nextErrors.password = 'Please choose a stronger password';
      }

      // Confirm password
      if (!trimmed.confirmPassword) {
        nextErrors.confirmPassword = 'Please confirm your password';
      } else if (trimmed.password !== trimmed.confirmPassword) {
        nextErrors.confirmPassword = 'Passwords do not match';
      }
    } else {
      // Login validations - accept username or email
      if (!trimmed.username && !trimmed.email) {
        nextErrors.username = 'Username or email is required';
      }
      if (!trimmed.password) {
        nextErrors.password = 'Password is required';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const navigate = useNavigate();
  const location = useLocation();

  // Sync authMode with URL path
  useEffect(() => {
    if (location.pathname.includes("/register")) {
      setAuthMode("register");
    } else {
      setAuthMode("login");
    }
  }, [location.pathname]);

  // In client/src/pages/LoginRegister.jsx - REPLACE the handleSubmit function with this:

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    setAuthError("");

    try {
      if (authMode === "register") {
        // Prepare registration data according to backend requirements
        const username = (formData.username || '').trim();
        const email = (formData.email || '').trim();

        // Double-check required fields
        if (!username) {
          setErrors(prev => ({ ...prev, username: 'Username is required' }));
          setAuthError('Please fill in all required fields');
          setIsSubmitting(false);
          return;
        }

        if (!email) {
          setErrors(prev => ({ ...prev, email: 'Email is required' }));
          setAuthError('Please fill in all required fields');
          setIsSubmitting(false);
          return;
        }

        const registrationData = {
          username: username,
          email: email,
          password: formData.password,
          password2: formData.confirmPassword,
          role: selectedRole,
        };

        console.log('Form Data:', formData);
        console.log('Registration payload:', registrationData);

        // Handle registration
        const response = await authAPI.register(registrationData);

        const roleText = selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1);
        setSuccessMessage(`Account created successfully as ${roleText}.`);

        // Redirect to login after successful registration
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        // Handle login - use username or email
        const loginIdentifier = formData.username.trim() || formData.email.trim();

        // ========== IMPORTANT: SEND SELECTED ROLE FOR VALIDATION ==========
        const response = await authAPI.login({
          username: loginIdentifier,
          password: formData.password,
          selected_role: selectedRole  // SEND THE SELECTED ROLE
        });

        const user = response.user;
        const role = user.role || 'operator';
        const roleText = role.charAt(0).toUpperCase() + role.slice(1);

        setSuccessMessage("Successfully logged in");

        // Redirect based on user role
        setTimeout(() => {
          if (role === 'admin') {
            navigate('/admin/dashboard');
          } else if (role === 'analyst') {
            navigate('/analyst/dashboard');
          } else {
            navigate('/operator/dashboard');
          }
        }, 1500);
      }

      setShowSuccess(true);
    } catch (error) {
      console.error('Authentication error:', error);

      // Handle validation errors from backend
      let errorMessage = 'An error occurred during authentication. Please try again.';

      if (error.response?.data) {
        const errorData = error.response.data;

        // Handle field-specific validation errors
        if (typeof errorData === 'object') {
          // Handle non_field_errors specially
          if (errorData.non_field_errors) {
            errorMessage = Array.isArray(errorData.non_field_errors)
              ? errorData.non_field_errors[0]
              : errorData.non_field_errors;
          }
          // Handle selected_role errors (role mismatch)
          else if (errorData.selected_role) {
            errorMessage = Array.isArray(errorData.selected_role)
              ? errorData.selected_role[0]
              : errorData.selected_role;
          }
          // Handle other field errors
          else {
            const fieldErrors = [];
            for (const [field, messages] of Object.entries(errorData)) {
              if (Array.isArray(messages)) {
                fieldErrors.push(messages.join(', '));
              } else if (typeof messages === 'string') {
                fieldErrors.push(messages);
              }
            }

            if (fieldErrors.length > 0) {
              errorMessage = fieldErrors.join(' | ');
            } else if (errorData.detail) {
              errorMessage = errorData.detail;
            } else if (errorData.message) {
              errorMessage = errorData.message;
            } else if (errorData.error) {
              errorMessage = errorData.error;
            }
          }
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setAuthError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleConfig = () => {
    const configs = {
      operator: {
        icon: Briefcase,
        gradient: "from-primary-500 to-accent-600",
        bgGradient: "bg-primary-400/20 dark:bg-primary-500/10",
        title: "Operator Login",
        subtitle: "Sign in with your operator account.",
        headerTitle: "Operator Login",
        headerSubtitle: "Manage operations efficiently.",
        registerTitle: "Register as Operator",
        registerSubtitle: "Join as an operator and manage vessel operations.",
      },
      analyst: {
        icon: TrendingUp,
        gradient: "from-secondary-500 to-secondary-600",
        bgGradient: "bg-secondary-400/20 dark:bg-secondary-500/10",
        title: "Analyst Login",
        subtitle: "Sign in with your analyst account.",
        headerTitle: "Analyst Login",
        headerSubtitle: "Analyze and generate insights.",
        registerTitle: "Register as Analyst",
        registerSubtitle: "Join as an analyst and generate valuable insights.",
      },
      admin: {
        icon: ShieldCheck,
        gradient: "from-amber-500 to-orange-600",
        bgGradient: "bg-amber-400/20 dark:bg-amber-600/10",
        title: "Admin Login",
        subtitle: "Sign in with admin email and password.",
        headerTitle: "Admin Login",
        headerSubtitle: "Administrative access.",
        registerTitle: "Register as Admin",
        registerSubtitle: "Join as an administrator and manage the system.",
      },
    };

    if (authMode === "login" && isAdminLogin) {
      return configs.admin;
    }
    return configs[selectedRole] || configs.operator;
  };

  const roleConfig = getRoleConfig();
  const PrimaryIcon = roleConfig.icon;

  const renderTextInput = ({ id, label, placeholder, icon: Icon, type = "text" }) => (
    <motion.label
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="block space-y-1.5"
      key={id}
    >
      <span className="text-xs font-bold uppercase tracking-wider text-slate-950">{label}</span>
      <div className="relative group">
        <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 group-focus-within:text-slate-900 transition-colors">
          <Icon className="w-5 h-5" />
        </span>
        <input
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          name={id}
          value={formData[id] || ''}
          onChange={handleInput}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-slate-50 py-3.5 pl-10 pr-3 text-sm font-medium text-slate-900 placeholder-slate-400 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent ${errors[id] ? "border-red-400 focus:ring-red-500" : "border-slate-200"
            }`}
          disabled={isSubmitting}
        />
        {type === "password" && (
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-900 transition-colors"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={isSubmitting}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {errors[id] && (
        <motion.span
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-xs text-red-600 font-medium block"
        >
          {errors[id]}
        </motion.span>
      )}
    </motion.label>
  );

  const modeFields = [
    authMode === "register"
      ? renderTextInput({
        id: "username",
        label: "Username",
        placeholder: "Enter a unique username",
        icon: User,
      })
      : renderTextInput({
        id: "username",
        label: "Username or Email",
        placeholder: "Enter username or email",
        icon: User,
      }),
    authMode === "register"
      ? renderTextInput({
        id: "email",
        label: "Email",
        placeholder: "user@example.com",
        icon: Mail,
        type: "email",
      })
      : null,
    renderTextInput({
      id: "password",
      label: "Password",
      placeholder: "Enter your password",
      icon: Lock,
      type: "password",
    }),
    authMode === "register"
      ? renderTextInput({
        id: "confirmPassword",
        label: "Confirm Password",
        placeholder: "Confirm your password",
        icon: Lock,
        type: "password",
      })
      : null,
  ].filter(Boolean);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center transition-colors duration-500 text-slate-900">

      {/* Modern Background */}
      <div className="absolute inset-0 z-0 bg-sky-50">
        {/* Background Pattern - Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e0f2fe_1px,transparent_1px),linear-gradient(to_bottom,#e0f2fe_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        {/* Modern Sky Blue Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50/80 via-white/50 to-blue-50/80 backdrop-blur-[1px]" />
      </div>

      {/* Centered Auth Form - Light theme */}
      <div className="w-full max-w-md px-4 py-8 z-10 relative">{/* Form container */}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          <motion.section
            layout
            className="relative overflow-hidden rounded-3xl border border-sky-100 bg-white p-8 shadow-xl shadow-sky-100/50"
          >
            <motion.div
              className={`absolute inset-x-16 top-0 h-40 rounded-b-[40%] bg-linear-to-r ${roleConfig.gradient} opacity-10 blur-2xl`}
              layout
            />

            <div className="relative z-10 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-slate-900 p-2.5 text-white shadow-md">
                    <PrimaryIcon className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-950">Secure Access</p>
                    <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
                      {authMode === "register" ? roleConfig.registerTitle : roleConfig.headerTitle}
                    </h2>
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-950 pl-14">
                  {authMode === "register" ? roleConfig.registerSubtitle : roleConfig.headerSubtitle}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex gap-1 p-1 rounded-xl bg-slate-100/80 border border-slate-200"
              >
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    navigate("/login");
                  }}
                  className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${authMode === "login"
                    ? "bg-white text-slate-950 shadow-sm ring-1 ring-black/5"
                    : "text-slate-500 hover:text-slate-900"
                    }`}
                  disabled={isSubmitting}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("register");
                    navigate("/register");
                  }}
                  className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${authMode === "register"
                    ? "bg-white text-slate-950 shadow-sm ring-1 ring-black/5"
                    : "text-slate-500 hover:text-slate-900"
                    }`}
                  disabled={isSubmitting}
                >
                  Register
                </button>
              </motion.div>

              {authMode === "register" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-950">Select Role</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "operator", label: "Operator", icon: Briefcase },
                      { id: "analyst", label: "Analyst", icon: TrendingUp },
                      { id: "admin", label: "Admin", icon: ShieldCheck },
                    ].map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRole(role.id)}
                        disabled={isSubmitting}
                        className={`flex flex-col items-center justify-center gap-2 rounded-xl px-2 py-3 text-xs font-bold transition-all border ${selectedRole === role.id
                          ? "bg-slate-900 text-white border-slate-900 shadow-md transform scale-[1.02]"
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                      >
                        <role.icon className="w-4 h-4" />
                        {role.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {authMode === "login" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-950">Login As</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "operator", label: "Operator", icon: Briefcase },
                      { id: "analyst", label: "Analyst", icon: TrendingUp },
                      { id: "admin", label: "Admin", icon: ShieldCheck },
                    ].map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRole(role.id)}
                        disabled={isSubmitting}
                        className={`flex flex-col items-center justify-center gap-2 rounded-xl px-2 py-3 text-xs font-bold transition-all border ${(selectedRole === role.id || (role.id === "admin" && isAdminLogin))
                          ? "bg-slate-900 text-white border-slate-900 shadow-md transform scale-[1.02]"
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                      >
                        <role.icon className="w-4 h-4" />
                        {role.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {authError && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600 border border-red-100 flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  {authError}
                </motion.div>
              )}

              <div className="space-y-4 pt-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={authMode}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {modeFields}
                  </motion.div>
                </AnimatePresence>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 disabled:opacity-70 transition-all flex items-center justify-center gap-2 mt-4"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <PrimaryIcon className="w-4 h-4" />
                    {authMode === "register" ? "Create Account" : "Sign In"}
                  </>
                )}
              </motion.button>
            </div>


          </motion.section>
        </motion.div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] min-w-[320px] max-w-md rounded-2xl bg-white p-4 shadow-2xl shadow-emerald-900/20 border border-emerald-100 flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Success</p>
              <p className="text-sm font-medium text-slate-600">{successMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
};

export default LoginRegister;