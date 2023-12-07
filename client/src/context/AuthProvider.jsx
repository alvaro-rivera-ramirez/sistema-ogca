import { useContext, createContext, useState, useEffect } from "react";
import { API_URL } from "../constants";

const AuthContext = createContext({
  isAuthenticated: false,
  accessToken:"",
  user:null,
  saveUser:(userData)=>{},
  getUser:()=>{},
  signout:()=>{}
});

export const AuthProvider = ({children}) => {
  const [user, setUser ] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState("")
  const [isloading, setIsLoading] = useState(true);

  function saveUser(userData) {
    setUser(userData.user);
    window.localStorage.setItem("token",userData.token);
    setAccessToken(userData.token)
    setIsAuthenticated(true);
  }

  function getUser() {
    return user;
  }

  function signout() {
    setUser(null);
    setAccessToken("");
    setIsAuthenticated(false);
    window.localStorage.removeItem("token");
  }

  async function checkAuth() {
    try {
      const token=window.localStorage.getItem("token");

      if(!token){
        console.log('logout')
        signout()
        setIsLoading(false)
        return;
      }
      const userData=await retrieveUserInfo(token);
      if(userData){
        setAccessToken(token)
        setUser(userData)
        setIsAuthenticated(true)
        setIsLoading(false)
        return;
      }
      setIsLoading(false)
      signout();
    } catch (error) {
      console.log(error)
      signout();
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        accessToken,
        user,
        saveUser,
        getUser,
        signout,
      }}
    >
      {isloading ? <div>Cargando...</div> : children}
    </AuthContext.Provider>
  );
}

async function retrieveUserInfo(accessToken) {
  try {
    const response = await fetch(`${API_URL}/v1/session`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const json = await response.json();
      return json;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export const useAuth = () => useContext(AuthContext);