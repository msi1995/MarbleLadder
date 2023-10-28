import { BASE_ROUTE } from "../App";
import { PlayerLadderData } from "../components/SoloLadder";

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