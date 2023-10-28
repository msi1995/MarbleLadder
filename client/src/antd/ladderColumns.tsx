import { ColumnsType } from "antd/es/table";
import { PlayerLadderData } from "../components/SoloLadder";
import { NavLink } from "react-router-dom";
import { Tag } from "antd";
export const smallScreen = () => {
    return window.innerWidth <= 850;
  };
  
export let ladderColumns: ColumnsType<PlayerLadderData> = [
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      align: smallScreen() ? "center" : "justify",
      width: smallScreen() ? "auto" : "10%",
    },
    {
      title: "Player",
      dataIndex: "username",
      key: "username",
      align: smallScreen() ? "center" : "justify",
      width: smallScreen() ? "auto" : "25%",
      render: (text, record) => (
        <NavLink
          to={{ pathname: `/player/${text}` }}
        >
          {text}
        </NavLink>
      ),
    },
    {
      title: "Rating",
      dataIndex: "ratingScore",
      key: "ratingScore",
      align: smallScreen() ? "center" : "justify",
      width: smallScreen() ? "auto" : "15%",
    },
    {
      title: "W/L",
      dataIndex: "winloss",
      align: smallScreen() ? "center" : "justify",
      width: smallScreen() ? "20%" : "15%",
      render: (_, record) => (
        <span>
          {record.wins}-{record.losses}
        </span>
      ),
    },
    {
      title: "Streak",
      key: "streak",
      align: smallScreen() ? "center" : "justify",
      dataIndex: "streak",
      width: smallScreen() ? "auto" : "15%",
      render: (_, { currentStreak }) => (
        <>
          <Tag
            color={currentStreak >= 0 ? "green" : "volcano"}
            key={currentStreak}
          >
            {currentStreak == 0
              ? ""
              : currentStreak > 0
              ? `${currentStreak}W`
              : `${Math.abs(currentStreak)}L`}
          </Tag>
        </>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      width: smallScreen() ? "auto" : "20%",
      render: (text, record) => (
        <>
        <NavLink
        className='bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-800 hover:text-white'
          to={{ pathname: `/player/${record.username}` }}
        >View Player
        </NavLink>
        </>
      ),
    },
  ];
  
  if (smallScreen()) {
    ladderColumns = ladderColumns.filter((item) => item.key !== "action");
  }