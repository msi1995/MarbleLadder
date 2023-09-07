import "../index.css";

export const Homepage = () => {
  return (
    <div className="sm:pt-16 h-screen w-screen relative overflow-x-hidden">
      <div className="sm:h-3/4 h-5/6 w-screen border-solid border-0 border-blue-600 flex justify-center align-middle items-center">
        <div className="text-center neon-text sm:text-7xl text-3xl text-white sm:mb-36">
          Welcome to MarbleLadder!
        </div>
      </div>
      <div className="sm:absolute sm:bottom-0 sm:left-0 py-6 flex flex-col flex-wrap sm:max-h-1/4 max-h-4/6 w-full bg-black items-center justify-center">
        <span className="block w-full border-0 px-4 border-solid border-red-600 sm:text-4xl text-xl text-white text-center">
          For now, MarbleLadder only supports <i>Marble It Up!</i> scores and
          rankings, and is focused on Multiplayer/Gem Hunt.
        </span>
        <br />
        <span className="block w-full sm:px-56 px-4 mt-4 border-0 border-solid border-red-600 sm:text-xl text-md text-white text-center">
          If you are playing 1v1 games, navigate to 1v1 ladder and click 'Report
          Result'. Search for the player you played against, and report the
          result. The player will be notified and must confirm the result of the
          match. You may include a YouTube link at any time which will then be
          embedded on the match details. ELO is updated upon confirmation.
        </span>
        <br />
        <span className="block w-full sm:px-56 px-4 border-0 border-solid border-red-600 sm:text-xl text-md text-white text-center">
          If you are posting a solo gem hunt run, click 'Report Result' and fill
          out the form. With the goal of these leaderboards being credible in
          mind, gem hunt submissions *must* include a screenshot or recording of
          the score and are subject to approval. There is currently no way to
          automatically parse multiplayer scores.
        </span>
      </div>
    </div>
  );
};