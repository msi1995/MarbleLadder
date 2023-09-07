import React from "react";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import { BASE_ROUTE } from "../App";

interface PlayerLadderData {
  rank: number;
  key: string;
  player: string;
  ratingScore: number;
  wins: number;
  losses: number;
  currentStreak: number;
}

const columns: ColumnsType<PlayerLadderData> = [
  {
    title: "Rank",
    dataIndex: "rank",
    key: "rank",
    width: "15%",
  },
  {
    title: "Player",
    dataIndex: "username",
    key: "username",
    width: "25%",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "ELO",
    dataIndex: "ratingScore",
    key: "ratingScore",
    width: "20%",
  },
  {
    title: "W/L",
    dataIndex: "winloss",
    width: "20%",
    render: (_, record) => (
      <span>
        {record.wins}-{record.losses}
      </span>
    ),
  },
  {
    title: "Streak",
    key: "streak",
    dataIndex: "streak",
    width: "20%",
    render: (_, { currentStreak }) => (
      <>
        <Tag
          color={currentStreak >= 0 ? "green" : "volcano"}
          key={currentStreak}
        >
          {currentStreak == 0
            ? "No games yet!"
            : currentStreak > 0
            ? `${currentStreak}W`
            : `${Math.abs(currentStreak)}L`}
        </Tag>
      </>
    ),
  },
];

// const data: PlayerLadderData[] = [
//   {
//     key: "1",
//     rank: 1,
//     player: "gem hunt destroyer",
//     ratingScore: 1000,
//     wins: 5,
//     losses: 0,
//     currentStreak: 0,
//   },
//   {
//     key: "2",
//     rank: 2,
//     player: "Mazik",
//     ratingScore: 1000,
//     wins: 5,
//     losses: 0,
//     currentStreak: -3,
//   },
//   {
//     key: "3",
//     rank: 3,
//     player: "Elomith",
//     ratingScore: 1000,
//     wins: 5,
//     losses: 0,
//     currentStreak: 3,
//   },
//   {
//     key: "4",
//     rank: 4,
//     player: "wally",
//     ratingScore: 1000,
//     wins: 5,
//     losses: 0,
//     currentStreak: 5,
//   },
//   {
//     key: "5",
//     rank: 5,
//     player: "miku",
//     ratingScore: 1000,
//     wins: 5,
//     losses: 500,
//     currentStreak: 5,
//   },
//   {
//     key: "6",
//     rank: 6,
//     player: "Marble Champ",
//     ratingScore: 980,
//     wins: 10,
//     losses: 2,
//     currentStreak: 5,
//   },
//   {
//     key: "7",
//     rank: 7,
//     player: "Speedy Racer",
//     ratingScore: 1015,
//     wins: 8,
//     losses: 3,
//     currentStreak: 5,
//   },
//   {
//     key: "8",
//     rank: 8,
//     player: "Gem Collector",
//     ratingScore: 1050,
//     wins: 12,
//     losses: 1,
//     currentStreak: 5,
//   },
//   {
//     key: "9",
//     rank: 9,
//     player: "Pro Gamer",
//     ratingScore: 1025,
//     wins: 15,
//     losses: 5,
//     currentStreak: 5,
//   },
//   {
//     key: "10",
//     rank: 10,
//     player: "Lucky Player",
//     ratingScore: 990,
//     wins: 7,
//     losses: 3,
//     currentStreak: 5,
//   },
//   {
//     key: "11",
//     rank: 11,
//     player: "Skilled Gamer",
//     ratingScore: 1035,
//     wins: 11,
//     losses: 4,
//     currentStreak: 5,
//   },
//   {
//     key: "12",
//     rank: 12,
//     player: "Strategy Master",
//     ratingScore: 1075,
//     wins: 9,
//     losses: 2,
//     currentStreak: 5,
//   },
//   {
//     key: "13",
//     rank: 13,
//     player: "Top Scorer",
//     ratingScore: 1010,
//     wins: 13,
//     losses: 6,
//     currentStreak: 5,
//   },
//   {
//     key: "14",
//     rank: 14,
//     player: "Marble King",
//     ratingScore: 1090,
//     wins: 18,
//     losses: 2,
//     currentStreak: 5,
//   },
//   {
//     key: "15",
//     rank: 15,
//     player: "Rookie",
//     ratingScore: 950,
//     wins: 2,
//     losses: 10,
//     currentStreak: 5,
//   },
// ];

// const sortedData = [...data].sort((a, b) => b.ratingScore - a.ratingScore);
// sortedData.forEach((item, index) => {
//   item.rank = index + 1;
// });

export const SoloLadder = () => {
  const [ladderData, setLadderData] = useState<PlayerLadderData[]>([]);

  useEffect(() => {
    getLadderData();
  }, []);

  useEffect(() => {
    console.log(ladderData);
  }, [ladderData]);

  const getLadderData = async () => {
    try {
      const res: Response = await fetch(BASE_ROUTE + "/ladderdata");
      const data: PlayerLadderData[] = await res.json();
      setLadderData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const data: PlayerLadderData[] = ladderData;
  const sortedData = [...data].sort((a, b) => b.ratingScore - a.ratingScore);
  sortedData.forEach((item, index) => {
    item.rank = index + 1;
  });

  return (
    <div className="pt-16 h-screen w-screen relative overflow-x-hidden">
      <div className="pt-24 flex relative overflow-x-hidden justify-center opacity-95">
        <Table
          className="sm:w-3/5 w-full"
          columns={columns}
          dataSource={sortedData}
          pagination={{
            showSizeChanger: true,
            defaultPageSize: 15,
            pageSizeOptions: [5, 15, 25, 50],
          }}
        />
      </div>
    </div>
  );
};
