import "../index.css";

export const About = () => {
  return (
    <div className="flex h-screen relative justify-center items-center">
      <div className="sm:w-2/5 w-4/5 sm:px-16 sm:py-16 bg-black-opacity-90 rounded-md text-center">
        <span className="block sm:text-2xl text-xl p-4 text-white">
          MarbleLadder is not affiliated with Marble Collective or the Marble It
          Up development team in any capacity. This site is standalone and does
          not currently interface directly with any title or service.
        </span>
        <span className="block sm:text-2xl text-xl p-4 text-white">
          This is a site I built in my spare time to try and support the game
          further and is still under active development. There are likely bugs,
          and certain features are not yet complete. If you find major bugs,
          feel free to contact me on Discord at msi#8029.
        </span>
      </div>
    </div>
  );
};
