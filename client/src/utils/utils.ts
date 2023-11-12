import { BASE_ROUTE } from "../App";
import { PlayerLadderData } from "../antd/ladderColumns";

export const handleLogout = (navigate: any, cookies: any) => {
  cookies.remove("MarbleToken", { path: "/" });
  localStorage.clear();
  navigate("/");
  window.location.reload();
};

export const round =(value: number, precision: number) => {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

export const getLadderData = async (setLadderData: React.Dispatch<React.SetStateAction<PlayerLadderData[]>>) => {
  try {
    const res: Response = await fetch(BASE_ROUTE + "/ladder-data");
    const data: PlayerLadderData[] = await res.json();
    setLadderData(data);
  } catch (error) {
    console.log(error);
  }
};

export const userIsAdmin = async (navigate: any, cookies: any, token: any) => {
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