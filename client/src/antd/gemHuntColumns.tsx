import { ColumnsType } from "antd/es/table";
import { NavLink } from "react-router-dom";
import { Tag } from "antd";

export const smallScreen = () => {
  return window.innerWidth <= 850;
};

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
