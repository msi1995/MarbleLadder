import { ColumnsType } from "antd/es/table";
import { NavLink } from "react-router-dom";
import { smallScreen } from "../utils/utils";

export let gemHuntOverallColumns: ColumnsType<any> = [
  {
    title: "Game",
    dataIndex: "game",
    key: "game",
    width: smallScreen() ? "auto" : "15%",
    render: (_) => <img className="w-3/4" src={"ultra_image.png"}></img>,
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
    render: (text) => (
      <NavLink to={{ pathname: `/player/${text}` }}>{text}</NavLink>
    ),
  },
  {
    title: "Score",
    dataIndex: "score",
    key: "score",
    render: (_, { totalScore }) => (
      //render score if available, otherwise render totalScore (for overall tab)
      <p>{totalScore}</p>
    ),
  },
  {
    title: "Screenshot/Video",
    dataIndex: "media",
    key: "mediaLink",
    width: "auto",
    render: (_,) => <>See individual maps</>
  },
];
