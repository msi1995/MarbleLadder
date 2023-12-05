import { useEffect, useState } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { BASE_ROUTE } from "../App";
import { TimelineEvent } from "../types/interfaces";

export const Timeline = () => {
  const [rawTimelineEvents, setRawTimelineEvents] = useState<TimelineEvent[]>([]);
  const [displayedTimelineEvents, setDisplayedTimelineEvents] = useState<TimelineEvent[]>([]);
  const [mapToFilterBy, setMapToFilterBy] = useState<string>("Select");
  const fetchTimelineData = async () => {
    try {
      const res: Response = await fetch(
        BASE_ROUTE + `/gem-hunt-timeline-events`,
        {
          method: "GET",
        }
      );
      const timelineData: TimelineEvent[] = await res.json();
      setRawTimelineEvents(timelineData);
      setDisplayedTimelineEvents(timelineData);
    } catch (e) {
      console.log(e);
    }
  };

  const filterTimelineEvents = () => {
    const filteredEvents = rawTimelineEvents.filter(
      (event) =>
        event.type === "solo-IL" &&
        (mapToFilterBy !== "Select" ? event.map === mapToFilterBy : true)
    );
    setDisplayedTimelineEvents(filteredEvents);
  };

  useEffect(() => {
    fetchTimelineData();
  }, []);

  useEffect(() => {
    filterTimelineEvents();
  }, [mapToFilterBy]);

  const formatDate = (date: Date) => {
    return new Date(date).toDateString().split(" ").slice(1).join(" ");
  };

  return (
    <div className="pt-24 w-full !overflow-x-hidden">
      <div className="mt-12 flex flex-col items-center justify-center text-white">
        <div className="flex pb-8 gap-x-4 items-center">
          <label htmlFor="map-filter">Filter by map:</label>
          <select
            value={mapToFilterBy}
            onChange={(e) => {
              setMapToFilterBy(e.target.value);
            }}
            name="map-filter"
            id="map-filter"
            className="!text-cyan-400 italic w-32 rounded-md px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-black"
          >
            <option value="Select">Select</option>
            <option value="Arcadia">Arcadia</option>
            <option value="Assault">Assault</option>
            <option value="Brawl">Brawl</option>
            <option value="Frostbite">Frostbite</option>
            <option value="Jumphouse">Jumphouse</option>
            <option value="Mosh Pit">Mosh Pit</option>
            <option value="Nexus">Nexus</option>
            <option value="Pythagoras">Pythagoras</option>
            <option value="Stadion">Stadion</option>
            <option value="Surf's Up">Surf's Up</option>
          </select>
        </div>
        <VerticalTimeline lineColor={"black"}>
          {displayedTimelineEvents.map((entry) => {
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
                        const arr = line.split(" ");
                        const lineWithoutPlayername = arr
                          .slice(0, arr.length - 1)
                          .join(" ");
                        const player = arr[arr.length - 1];
                        return (
                          <span>
                            {lineWithoutPlayername}{" "}
                            <a
                              href={`/player/${player}`}
                              className="text-cyan-400 italic"
                            >
                              {player}
                            </a>
                          </span>
                        );
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
