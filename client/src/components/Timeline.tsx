import { useEffect, useState } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { BASE_ROUTE } from "../App";
import { TimelineEvent } from "../types/interfaces";
import { projectedMaxes, round } from "../utils/utils";
import { Tooltip } from "antd";

export const Timeline = () => {
  const [rawTimelineEvents, setRawTimelineEvents] = useState<TimelineEvent[]>(
    []
  );
  const [displayedTimelineEvents, setDisplayedTimelineEvents] = useState<
    TimelineEvent[]
  >([]);
  const [mapToFilterBy, setMapToFilterBy] = useState<string>("All");
  const [eventTypeToFilterBy, setEventTypeToFilterBy] = useState<string>("All");
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

  //first filter by map, if no map then filter by event type.
  const filterTimelineEvents = () => {
    const filteredEvents = rawTimelineEvents
      .filter((event) =>
        mapToFilterBy !== "All" ? event?.map === mapToFilterBy : true
      )
      // if the event is not solo-IL/gold-run, return all non solo-IL/gold-run. Done this way because there are many types of custom events.
      // if NOT custom and NOT all, filter based on eventTypeToFilterBy. If all, return everything.
      .filter((event) =>
        eventTypeToFilterBy === "custom"
          ? event?.type !== "solo-IL" && event?.type !== "gold-run"
          : eventTypeToFilterBy === "All"
          ? true
          : event?.type === eventTypeToFilterBy
      );
    setDisplayedTimelineEvents(filteredEvents);
  };

  useEffect(() => {
    fetchTimelineData();
  }, []);

  useEffect(() => {
    filterTimelineEvents();
  }, [mapToFilterBy, eventTypeToFilterBy]);

  const formatDate = (date: Date) => {
    return new Date(date).toDateString().split(" ").slice(1).join(" ");
  };

  return (
    <div className="pt-24 w-full !overflow-x-hidden">
      <div className="mt-12 flex flex-col items-center justify-center text-white">
        <div className="flex flex-col pb-8 gap-y-2 items-center">
          <div className="flex gap-x-4 items-center">
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
              <option value="All">All</option>
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
          <div className="flex gap-x-4 items-center">
            <label htmlFor="event-filter">Filter by type:</label>
            <select
              value={eventTypeToFilterBy}
              onChange={(e) => {
                setEventTypeToFilterBy(e.target.value);
              }}
              name="event-filter"
              id="event-filter"
              className="!text-cyan-400 italic w-32 rounded-md px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-black"
            >
              <option value="All">All</option>
              <option value="gold-run">Gold Runs</option>
              <option value="solo-IL">Records</option>
              <option value="custom">Special Events</option>
            </select>
          </div>
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
                        ? `This was the first score reported for the map.`
                        : `The previous record was ${entry.previousRecord}.`}
                    </p>
                  </div>
                );
                break;

              case "gold-run":
                content = (
                  <div>
                    <h3 className="font-semibold text-yellow-400">
                      Gold Run -{" "}
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
                    records a `}{" "}
                      <Tooltip
                        className="text-yellow-400"
                        overlayInnerStyle={{
                          fontSize: "12px",
                          color: "black",
                          border: "2px solid black",
                          fontStyle: "italic",
                        }}
                        arrow={false}
                        title="Run rating of 980+"
                        color="#29dcec"
                      >
                        gold run
                      </Tooltip>
                      <span> on {entry.map}, with a rating of </span>
                      <span className="text-yellow-400">{`${round(
                        (entry.score / entry.projMaxWas!) * 1000,
                        1
                      )}! `}</span>
                      <br />
                      The projected max at the time was{" "}
                      <span className="text-cyan-400">{entry.projMaxWas}.</span>
                      <br />
                      <br/>
                      <span>This is an extraordinary score.</span>
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

              case "custom":
                // non IL event. display playerName with link if the entry has a player associated with it
                content = (
                  <div>
                    <h3 className="font-semibold">Event </h3>
                    <p className="!font-normal">
                      {entry.playerName && (
                        <a
                          href={`/player/${entry.playerName}`}
                          className="text-cyan-400 hover:text-cyan-500"
                        >
                          {entry.playerName}{" "}
                        </a>
                      )}
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
                icon={<img src={`/main_logo.webp`} />}
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
