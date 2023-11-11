import { ColumnsType } from "antd/es/table";
import { NavLink } from "react-router-dom";
import { Tag } from "antd";

export const smallScreen = () => {
  return window.innerWidth <= 850;
};

export const above1080 = () => {
  return window.innerWidth > 1980;
}

export interface GemHuntLadderData {
  mapName: string;
  scores: [
    {
      player: string;
      score: number;
      media: string;
      date: Date;
    }
  ];
}

export let gemHuntColumns: ColumnsType<GemHuntLadderData["scores"][0]> = [
    {
    title: "Game",
    dataIndex: "game",
    key: "game",
    width: smallScreen() ? "auto" : "15%",
    render: (_) => (
            <img
            className="w-3/4"
            src={'ultra_image.png'}
          ></img>
    ),
  },
  {
    title: "Rank",
    dataIndex: "rank",
    key: "rank",
  },
  {
    title: "Player",
    dataIndex: "player",
    key: "player",
    render: (text, record) => (
      <NavLink
        to={{ pathname: `/player/${text}` }}
      >
        {text}
      </NavLink>
    ),
  },
  {
    title: "Score",
    dataIndex: "score",
    key: "score",
  },
  {
    title: "Screenshot/Video",
    dataIndex: "media",
    key: "mediaLink",
    width: "auto",
    render: (_, { media }) => (
      <a className='text-blue-600' href={media} target="_blank">
        Link
      </a>
    ),
  },
  {
    title: "Date of run",
    dataIndex: "date",
    key: "date",
    render: (_, { date }) => <>{date.toString().split("T")[0]}</>,
    defaultSortOrder: "descend",
  },
];
