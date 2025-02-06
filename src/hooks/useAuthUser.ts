import UserContext from "@/provider/UserContext";
import { useContext } from "react";

export function useAuthUser() {
    return useContext(UserContext);
  }