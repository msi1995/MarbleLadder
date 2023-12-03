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

export const round = (value: number, precision: number) => {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
};

export const calculateScoreColor = (score: number) => {
  const darkRed = [139, 0, 0];
  const orange = [255, 165, 0];
  const yellow = [255, 255, 0];
  const lightGreen = [0, 236, 81];
  const teal = [0, 185, 185];
  const intenseTeal = [0, 225, 225];
  const purple = [180, 0, 255]

  let color;

  if (score <= 50) {
    // dark red and orange
    const percentage = (score - 5) / 20;
    color = darkRed.map((channel, index) =>
      Math.round(channel + percentage * (orange[index] - channel))
    );
  } else if (score <= 60) {
    // orange and yellow
    const percentage = (score - 25) / 20;
    color = orange.map((channel, index) =>
      Math.round(channel + percentage * (yellow[index] - channel))
    );
  } else if (score <= 75) {
    // yellow and green
    const percentage = (score - 60) / 20;
    color = yellow.map((channel, index) =>
      Math.round(channel + percentage * (lightGreen[index] - channel))
    );
  } else if (score <= 82.5) {
    // green and teal
    const percentage = (score - 70) / 20;
    color = lightGreen.map((channel, index) =>
      Math.round(channel + percentage * (teal[index] - channel))
    );
  } else if (score < 90) {
    // teal and intense teal up to 900
    const percentage = (score - 75) / 20;
    const finalColor = teal.map((channel, index) =>
      Math.round(channel + percentage * (purple[index] - channel))
    );

    color = finalColor.map((value) => Math.min(255, value));
  }
  else if (score < 95) {
    // purple up to 950
    const percentage = (score - 72.5) / 20;
    color = intenseTeal.map((channel, index) =>
      Math.round(channel + percentage * (purple[index] - channel))
    );
  }
  // // gold for 925-949
  // else if (score < 95) {
  //   color = [255, 255, 0];
  // } 
  else if (score < 99) {
    // volcano for 950-990
    color = [255, 0, 0];
  }
  else{
    color = [255,255,0]
  }

  return `rgb(${color.join(",")})`;
};

export const getLadderData = async (
  setLadderData: React.Dispatch<React.SetStateAction<LadderPlayer[]>>
) => {
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
    const res: Response = await fetch(BASE_ROUTE + `/check-admin`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
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
};

export const projectedMaxes: Record<string, number> = {
  "Arcadia": 190,
  "Assault": 275,
  "Brawl": 215,
  "Frostbite": 150,
  "Jumphouse": 250,
  "Mosh Pit": 320,
  "Nexus": 190,
  "Pythagoras": 200,
  "Stadion": 225,
  "Surf's Up": 140,
}
