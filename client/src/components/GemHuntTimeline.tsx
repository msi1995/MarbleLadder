import { useEffect, useState } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { BASE_ROUTE } from "../App";
import { TimelineEvent } from "../types/interfaces";

export const GemHuntTimeline = () => {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const fetchTimelineData = async () => {
    try {
      const res: Response = await fetch(
        BASE_ROUTE + `/gem-hunt-timeline-events`,
        {
          method: "GET",
        }
      );
      const timelineData: TimelineEvent[] = await res.json();
      setTimelineEvents(timelineData);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchTimelineData();
  }, []);

  const formatDate = (date: Date) => {
    return new Date(date).toDateString().split(" ").slice(1).join(" ");
  };

  return (
    <div className="pt-24 w-screen">
      <div className="mt-12 flex justify-center text-white">
        <VerticalTimeline lineColor={"black"}>
          {timelineEvents.map((entry) => (
            <VerticalTimelineElement
              className=""
              contentStyle={{ background: "rgb(0, 0, 0)", color: "#fff" }}
              contentArrowStyle={{ borderRight: "7px solid  #11bdd7" }}
              date={formatDate(entry.date)}
              iconStyle={{ background: "rgb(0, 0, 0)", color: "#fff" }}
              icon={<img src={`/marbleladder01tsp.webp`} />}
            >
              {entry.type === "solo-IL" ? (
                <div>
                  <h3 className="font-semibold">
                    World Record -{" "}
                    <span className="italic text-cyan-400">
                      {`${entry.map} ${entry.score}`}
                    </span>
                  </h3>
                  <p className="!font-normal">
                    <a
                      href="/player/Elomith"
                      className="text-cyan-400 hover:text-cyan-500"
                    >
                      {entry.playerName}{" "}
                    </a>
                    {`
                sets a new world record on ${entry.map}, with ${entry.score}
                points.`}
                  </p>
                  <p className="!font-normal">
                    {entry.previousRecord === 0
                      ? `This was the first record recorded.`
                      : `The previous record was ${entry.previousRecord}.`}
                  </p>
                </div>
              ) : 
              //non IL event. custom event or something.
              (
                <div>
                  <h3 className="font-semibold">
                    Event{" "}
                  </h3>
                  <p className="!font-normal text-cyan-400">
                    {entry.description}
                  </p>
                </div>
              )}
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </div>
    </div>
  );
};
