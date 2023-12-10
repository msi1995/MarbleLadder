import { ColumnsType } from "antd/es/table";
import { NavLink } from "react-router-dom";
import { calculateScoreColor, round, smallScreen } from "../utils/utils";
import { Tooltip } from "antd";

export let gemHuntOverallColumns: ColumnsType<any> = [
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
    title: (
      <Tooltip
        overlayInnerStyle={{
          fontSize: "12px",
          color: "black",
          border: "2px solid black",
        }}
        title="Sum of all map ratings"
        color="#29dcec"
      >
        Overall Rating ⓘ
      </Tooltip>
    ),
    dataIndex: "totalRunRating",
    key: "score",
    render: (_, { totalRunRating }) => (
      //div by 100 for overall tab
      <span style={{ color: calculateScoreColor(totalRunRating / 100 ?? 0) }}>
        {round(totalRunRating, 1)}
      </span>
    ),
  },
  {
    title: "Points",
    dataIndex: "totalScore",
    key: "totalScore",
  },
  {
    title: "Screenshot / Video",
    dataIndex: "media",
    key: "mediaLink",
    width: "auto",
    render: (_) => <>See individual maps</>,
  },
];

if (smallScreen()) {
  gemHuntOverallColumns = gemHuntOverallColumns.filter(
    (item) => item.key !== "mediaLink"
  );
}
