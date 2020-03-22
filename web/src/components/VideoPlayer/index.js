import React, { useEffect, useState } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';

function VideoPlayer({ video }) {
  const [ videoId, setVideoId ] = useState('');
  const [ videoType, setVideoType ] = useState('');
  const [ videoTitle, setVideoTitle ] = useState('');
  const [ youtubePlayer, setYoutubePlayer ] = useState(null);

  const youtubeOpts = {
    width: '750',
    height: '400',
    playerVars: { // https://developers.google.com/youtube/player_parameters
      autoplay: 0
    }
  };

  useEffect(() => {
    console.log(video);
    loadVideo();

    return () => {
      if (videoType === 'youtube' && youtubePlayer && youtubePlayer.destroy) {
        youtubePlayer.destroy();
      }
    }
  }, [video]);

  async function loadVideo() {
    // setVideoType(null);
    // setYoutubeVideoId(null);

    if (video) {
      // Vimeo
      if (video.indexOf('vimeo.com') >= 0) {
        try {
          const response = await axios.get(`https://vimeo.com/api/oembed.json?url=${video}&width=750&height=400&responsive=true`);

          if (response.data && response.data.video_id) {
            setVideoType('vimeo');
            setVideoId(response.data.video_id);
            setVideoTitle(response.data.title);
          } else {
            setVideoId(null);
          }
        } catch(e) {
          setVideoId(null);
        }

      // Youtube
      } else {
        if (video.indexOf('youtu.be/') >= 0 || video.indexOf('youtube.com') >= 0) {
          setVideoType('youtube');

          // https://youtu.be/{videoId}
          if (video.indexOf('youtu.be/') >= 0) {
            setVideoId(video.substr(video.lastIndexOf('/') + 1));

          // https://www.youtube.com/watch?v={videoId}
          // https://www.youtube.com/embed/{videoId}
          } else {
            if (video.indexOf('/watch') >= 0) {
              setVideoId(video.substr(video.lastIndexOf('?v=') + 3));
            } else if (video.indexOf('/embed/') >= 0 || video.indexOf('/v/') >= 0) {
              setVideoId(video.substr(video.lastIndexOf('/') + 1));
            }
          }
        }
      }
    }
  }

  function handleVideoReady(event) {
    if (videoType === 'youtube') {
      setYoutubePlayer(event.target);
      event.target.playVideo();
    }
  }

  function handlePlayerStateChange(event) {
    switch (event.data) {
      case -1:
        console.log('Video not started');
        break;
      case 0:
        console.log('Video ended');
        break;
      case 1:
        console.log('Video is playing');
        break;
      case 2:
        console.log('Video is paused');
        break;
      case 3:
        console.log('Video is storing buffer');
        break;
      case 5:
        console.log('Video cued');
        break;
      default:
        console.log(event.data);
        break;
    }
  }

  if (!video) {
    return ('Vídeo não disponível');
  }

  return (
    <div id="player" className="VideoPlayer">
      {(videoType === 'youtube' && videoId) &&
        <YouTube videoId={videoId} opts={youtubeOpts} onReady={handleVideoReady} onStateChange={handlePlayerStateChange} />
      }
      {(videoType === 'vimeo' && videoId) &&
        <iframe src={`https://player.vimeo.com/video/${videoId}`} width="750" height="450" frameBorder="0" title={videoTitle} webkitAllowFullScreen mozAllowFullScreen allowFullScreen />
      }
      {videoId === null &&
        <div className="video-error">Vídeo não disponível</div>
      }
    </div>
  )
}

export default VideoPlayer;
