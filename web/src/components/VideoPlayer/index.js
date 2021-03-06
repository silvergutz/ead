import React, { useEffect, useState } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';

import './styles.css';

function VideoPlayer({ video, onVideoEnded, onVideoPlaying }) {
  const [ videoId, setVideoId ] = useState('');
  const [ videoType, setVideoType ] = useState('');
  const [ videoTitle, setVideoTitle ] = useState('');
  // const [ youtubePlayer, setYoutubePlayer ] = useState(null);

  const youtubeOpts = {
    width: '750',
    height: '400',
    playerVars: { // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
      rel: 0,
      showinfo: 0,
      controls: 2,
      modestbranding: 1,
      iv_load_policy: 3,
    }
  };

  useEffect(() => {
    loadVideo();
  }, [video]);

  async function loadVideo() {
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
      // setYoutubePlayer(event.target);
      event.target.setVolume(100);
      event.target.playVideo();
    }
  }

  function handlePlayerStateChange(event) {
    switch (event.data) {
      case -1:
        // console.log('Video not started');
        break;
      case 0:
        // console.log('Video ended');
        onVideoEnded(event);
        break;
      case 1:
        // console.log('Video is playing');
        onVideoPlaying(event);
        break;
      case 2:
        // console.log('Video is paused');
        break;
      case 3:
        // console.log('Video is storing buffer');
        break;
      case 5:
        // console.log('Video cued');
        break;
      default:
        // console.log(event.data);
        break;
    }
  }

  if (!video) {
    return (<div id="player" className="VideoPlayer">Vídeo não disponível</div>);
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
