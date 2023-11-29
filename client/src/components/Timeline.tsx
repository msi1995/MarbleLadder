import { useEffect, useState } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { BASE_ROUTE } from "../App";
import { TimelineEvent } from "../types/interfaces";

export const Timeline = () => {
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
    <div className="pt-24 w-full !overflow-x-hidden">
      <div className="mt-12 flex justify-center text-white">
        <VerticalTimeline lineColor={"black"}>
          {timelineEvents.map((entry) => {
            let content;

            switch (entry.type) {
              case "solo-IL":
                content = (
                  <div>
                    <h3 className="font-semibold">
                      World Record -{" "}
                      <span className="italic text-cyan-400">
                        {`${entry.map}, ${entry.score} — ${entry.playerName}`}
                      </span>
                    </h3>
                    <p className="!font-normal">
                      <a
                        href={`/player/${entry.playerName}`}
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
                );
                break;

              case "2000-event":
                content = (
                  <div>
                    <h3 className="font-semibold">🎉 Special Event 🎉</h3>
                    <div className="flex flex-col text-white gap-y-1">
                      <span className="text-yellow-400 py-4">
                        {entry.description}
                      </span>
                      {entry.multiLineDescription?.map((line) => {
                        const arr = line.split(' ');
                        const lineWithoutPlayername = arr.slice(0, arr.length - 1).join(' ');
                        const player = arr[arr.length-1];
                        return <span>{lineWithoutPlayername} <a href={`/player/${player}`} className='text-cyan-400 italic'>{player}</a></span>;
                      })}
                    </div>
                  </div>
                );
                break;

              default:
                // non IL event. custom event or something.
                content = (
                  <div>
                    <h3 className="font-semibold">Event </h3>
                    <p className="!font-normal text-cyan-400">
                      {entry.description}
                    </p>
                  </div>
                );
                break;
            }

            return (
              <VerticalTimelineElement
                contentStyle={{ background: "rgb(0, 0, 0)", color: "#fff" }}
                contentArrowStyle={{ borderRight: "7px solid  #11bdd7" }}
                date={formatDate(entry.date)}
                iconStyle={{ background: "rgb(0, 0, 0)", color: "#fff" }}
                icon={<img src={`/marbleladder01tsp.webp`} />}
              >
                {content}
              </VerticalTimelineElement>
            );
          })}
        </VerticalTimeline>
      </div>
    </div>
  );
};
