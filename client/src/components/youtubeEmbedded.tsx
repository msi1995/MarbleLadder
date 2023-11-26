import React from "react";

interface YoutubeEmbedProps {
  YTUrl: string;
}

export const YoutubeEmbedded = ({ YTUrl }: YoutubeEmbedProps) => {
    const arr = YTUrl.split('?v=')
    const embedId = arr[1]

  return YTUrl !== '' ? (
    <div className="basis-full">
      <iframe
        className="w-screen h-screen"
        allow="autoplay; encrypted-media"
        src={`https://www.youtube.com/embed/${embedId}?autoplay=1&mute=1&disablekb=1&controls=0&playlist=${embedId}&rel=0&fs=0&loop=1`}
        frameBorder="0"
        title="Embedded youtube"
      />
    </div>
  ) : (
    <></>
  );
};
