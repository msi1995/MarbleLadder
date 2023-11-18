import { NavigateFunction } from "react-router-dom";
import { BASE_ROUTE } from "../App";
import Cookies from "universal-cookie";
import { LadderPlayer } from "../types/interfaces";

export const handleLogout = (navigate: NavigateFunction, cookies: Cookies) => {
  cookies.remove("MarbleToken", { path: "/" });
  localStorage.clear();
  navigate("/");
  window.location.reload();
};

export const round =(value: number, precision: number) => {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

export const getLadderData = async (setLadderData: React.Dispatch<React.SetStateAction<LadderPlayer[]>>) => {
  try {
    const res: Response = await fetch(BASE_ROUTE + "/ladder-data");
    const data: LadderPlayer[] = await res.json();
    setLadderData(data);
  } catch (error) {
    console.log(error);
  }
};

export const userIsAdmin = async (token: string) => {
  try {
    const res: Response = await fetch(
      BASE_ROUTE + `/check-admin`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    return data.admin;
  } catch (error) {
    console.log(error);
  }
};

export const smallScreen = () => {
  return window.innerWidth <= 850;
};

export const above1080 = () => {
  return window.innerWidth > 1980;
}