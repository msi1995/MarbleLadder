import React from "react";

interface YoutubeEmbedProps {
  YTUrl: string;
}

export const YoutubeEmbedded = ({ YTUrl }: YoutubeEmbedProps) => {
    let embedID = null;
    const regExp = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=))([^"&?\/\s]{11})$/;
    const match = YTUrl.match(regExp)

    if(match && match[1]){
        embedID = match[1];
    }
    

  return embedID !== null ? (
    <div className="basis-full">
      <iframe
        className="w-screen h-screen"
        allow="autoplay; encrypted-media"
        src={`https://www.youtube.com/embed/${embedID}?autoplay=1&mute=1&disablekb=1&controls=0&playlist=${embedID}&rel=0&fs=0&loop=1`}
        frameBorder="0"
        title="Embedded youtube"
      />
    </div>
  ) : (
    <></>
  );
};
