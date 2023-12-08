import React, { Component } from "react";
import { View, Button, Text } from "react-native";
import { RTCView, MediaStream, RTCIceCandidate, RTCPeerConnection } from "react-native-webrtc";

class WebRTCExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      localStream: null,
      peerConnection: null,
    };
  }

  async componentDidMount() {
    const configuration = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

    const localStream = await MediaStream.getUserMedia({ audio: true, video: true });
    this.setState({ localStream });

    const peerConnection = new RTCPeerConnection(configuration);
    this.setState({ peerConnection });

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // Send the ICE candidate to the remote peer (you need to implement this)
        this.sendIceCandidateToRemotePeer(event.candidate);
      }
    };
  }

  start = async () => {
    const { peerConnection } = this.state;
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    // Send the offer to the remote peer (you need to implement this)
    this.sendOfferToRemotePeer(offer);
  };

  stop = () => {
    const { localStream, peerConnection } = this.state;
    localStream.getTracks().forEach((track) => {
      track.stop();
    });

    peerConnection.close();
    this.setState({
      localStream: null,
      remoteStream: null,
      peerConnection: null,
    });
  };

  render() {
    const { localStream, remoteStream } = this.state;

    return (
      <View>
        <RTCView streamURL={localStream ? localStream.toURL() : null} style={{ width: 200, height: 150 }} />
        <RTCView streamURL={remoteStream ? remoteStream.toURL() : null} style={{ width: 200, height: 150 }} />
        <Button title="Start" onPress={this.start} />
        <Button title="Stop" onPress={this.stop} />
      </View>
    );
  }
}

export default WebRTCExample;
