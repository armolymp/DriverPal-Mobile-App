import React, { useEffect } from 'react';
import { View, Button } from 'react-native';
import { RTCPeerConnection, RTCView, mediaDevices } from 'react-native-webrtc';

let pc = null;

const YourComponent = () => {
  let localStream, serverStream;

  useEffect(() => {
    const start = async () => {
      const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
      pc = new RTCPeerConnection(configuration);

      try {
        const stream = await mediaDevices.getUserMedia({
          video: { mandatory: { minWidth: 640, minHeight: 360, maxWidth: 640, maxHeight: 360 } },
        });
        localStream = stream;
        pc.addStream(stream);

        pc.onaddstream = (event) => {
          serverStream = event.stream;
        };

        negotiate();
      } catch (e) {
        alert(e);
      }
    };

    start();

    return () => {
      if (pc) {
        pc.close();
      }
    };
  }, []);

  const negotiate = async () => {
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Send the offer to a signaling server or fetch it as in your original code
      const answer = await fetch('/offer', {
        body: JSON.stringify({
          sdp: pc.localDescription.sdp,
          type: pc.localDescription.type,
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      const answerJSON = await answer.json();
      await pc.setRemoteDescription(answerJSON);
    } catch (e) {
      alert(e);
    }
  };

  const stop = () => {
    pc.close();
  };

  return (
    <View>
      <RTCView streamURL={localStream?.toURL()} style={{ width: 200, height: 200 }} />
      <RTCView streamURL={serverStream?.toURL()} style={{ width: 200, height: 200 }} />
      <Button title="Stop" onPress={stop} />
    </View>
  );
};

export default YourComponent;
