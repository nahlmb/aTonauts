import { useState } from 'react';

export default function VideoPlayer({ src }) {
  const [playing, setPlaying] = useState(false);

  function handlePlay() {
    const video = document.getElementById('prolog-video');
    if (video) {
      video.play();
      setPlaying(true);
    }
  }

  return (
    <div className="video-wrapper">
      <video
        id="prolog-video"
        src={src}
        className="video-el"
        controls={playing}
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
      {!playing && (
        <button className="play-overlay" onClick={handlePlay} aria-label="Putar video">
          <img src="/assets/icons/Play_Icon.svg" alt="" className="play-icon" />
        </button>
      )}

      <style>{`
        .video-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          background: #0a0d11;
          border: 1px solid rgba(245, 247, 250, 0.15);
          border-radius: 8px;
          overflow: hidden;
        }
        .video-el {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .play-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.35);
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }
        .play-overlay:hover { background: rgba(0, 0, 0, 0.5); }
        .play-icon {
          width: 56px;
          height: 56px;
          filter: invert(1) brightness(2);
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}
