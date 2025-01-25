// AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const rawUserData = localStorage.getItem("userData");

    // Add explicit check for valid JSON
    if (rawUserData && rawUserData !== "undefined") {
      try {
        const userData = JSON.parse(rawUserData);
        if (userData?.email) {
          // Additional validation
          setUser(userData);
        } else {
          throw new Error("Invalid user data structure");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        // Clear invalid data
        localStorage.removeItem("userData");
        localStorage.removeItem("authToken");
        setUser(null);
      }
    }
  }, []);

  const login = (userData, token) => {
    // Validate before saving
    if (!userData?.email) {
      console.error("Invalid user data format");
      return;
    }

    const sanitizedData = { email: userData.email };
    localStorage.setItem("userData", JSON.stringify(sanitizedData));
    localStorage.setItem("authToken", token);
    setUser(sanitizedData);
  };

  const logout = () => {
    // Clear all auth-related items
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    // Clear potential legacy items
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
