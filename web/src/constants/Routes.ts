export const ROUTES = {
  Home: "/",

  AboutUs: "/about-us",

  ContactUs: "/contact-us",

  Professors: "/professors",

  Faculties: "/faculties",

  Resume: (id: string | number) => `/resume-list/${id}`,    

  DU: "https://du.ac.ir/fa",

  Login: "/login",

  Dashboard: "/dashboard",

  OTP: (email: string) => `/otp?email=${email}`,
};
