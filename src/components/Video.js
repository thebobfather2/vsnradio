import React from "react";
import PropTypes from "prop-types";
import HLSPlayer from "../../node_modules/hls.js/dist/hls";
import DashJS from "dashjs";
import URI from "urijs";

class Video extends React.Component {
  constructor(props) {
    super(props);

    this.InitializeVideo = this.InitializeVideo.bind(this);
  }

  InitializeVideo(video) {
    if(!video) { return; }

    let videoUrl = this.props.playoutOptions.playoutUrl;
    if(this.props.videoType === "hls") {
      videoUrl = URI(videoUrl).addSearch("player_profile", "hls-js").toString();

      const player = new HLSPlayer();
      player.loadSource(videoUrl);
      player.attachMedia(video);
    } else {
      const player = DashJS.MediaPlayer().create();

      if(this.props.drm === "widevine") {
        const widevineUrl = this.props.playoutOptions.drms.widevine.licenseServers[0];

        player.setProtectionData({
          "com.widevine.alpha": {
            "serverURL": widevineUrl,
            "httpRequestHeaders": {
              "Authorization": `Bearer ${this.props.authToken}`
            },
            "withCredentials": false
          }
        });
      }

      player.initialize(video, videoUrl, false);
    }
  }

  render() {
    return (
      <div className="video-container">
        <h1>{this.props.metadata.name}</h1>
        <h3>{this.props.metadata.description}</h3>
        <video
          poster={this.props.posterUrl}
          crossOrigin="anonymous"
          ref={this.InitializeVideo}
          muted={false}
          autoPlay={false}
          controls={true}
          preload="auto"
        />
      </div>
    );
  }
}

Video.propTypes = {
  authToken: PropTypes.string,
  drm: PropTypes.string,
  metadata: PropTypes.object,
  playoutOptions: PropTypes.object.isRequired,
  posterUrl: PropTypes.string,
  videoType: PropTypes.string.isRequired,
};

export default Video;
