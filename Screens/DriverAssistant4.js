import React from 'react';
import { useState } from "react";
import { View, Button, RTCView, MediaStream, getUserMedia } from "react-native-webrtc";

const DriverAssistant4 = () => {
  const [streamStarted, setStreamStarted] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  let pc = null

  const negotiate = async () => {
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      await new Promise((resolve) => {
        if (pc.iceGatheringState === "complete") {
          resolve();
        } else {
          function checkState() {
            if (pc.iceGatheringState === "complete") {
              pc.removeEventListener("icegatheringstatechange", checkState);
              resolve();
            }
          }

          pc.addEventListener("icegatheringstatechange", checkState);
        }
      });

      const offerToSend = pc.localDescription;
      const serverURL = "http://192.168.1.194:8080/offer";

      const response = await fetch(serverURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sdp: offerToSend.sdp,
          type: offerToSend.type,
        }),
      });

      const answer = await response.json();
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (e) {
      alert(e);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await getUserMedia({
        audio: true,
        video: {
          mandatory: {
            minWidth: 480,
            minHeight: 360,
            minFrameRate: 30,
          },
          facingMode: "user", // 'user' for front camera, 'environment' for rear camera
          optional: [],
        },
      });
      setLocalStream(stream);
      setStreamStarted(true);
      start()
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  const stopCamera = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
      setLocalStream(null);
      setStreamStarted(false);
    }
  };

  const start = () => {
    const configuration = {
      sdpSemantics: "unified-plan",
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }], // Adjust URL and credentials accordingly
    };

    const pc = new RTCPeerConnection(configuration);

    // Assuming you have the localStream variable containing the local video stream
    localStream.getVideoTracks().forEach(track => {
      pc.addTrack(track, localStream);
    });

    pc.ontrack = event => {
      console.log("Received server video");
      const stream = event.streams[0];
      // Assuming serverVideoRef is the reference to the server video element
      setRemoteStream(stream);
    };

    // Hide the start button
    // Use state or reference to handle the visibility of start and stop buttons

    // Call your negotiation function here
     negotiate();

    // Show the stop button
    // Use state or reference to handle the visibility of start and stop buttons
  };

  return (
    <View style={{ flex: 1 }}>
      {streamStarted && localStream && (
          <RTCView
            streamURL={localStream.toURL()}
            style={{ flex: 1 ,width: 200, height: 150}}
            objectFit="cover"
          />
      )}
      {streamStarted && remoteStream && (
        <>
          <RTCView
            streamURL={remoteStream.toURL()}
            style={{ flex: 1 ,width: 200, height: 150}}
            objectFit="cover"
          />
        </>
      )}

      {!streamStarted && (
        <Button title="Start Camera" onPress={startCamera} />
      )}

      {streamStarted && (
        <Button title="Stop Camera" onPress={stopCamera} />
      )}
    </View>
  );
};

export default DriverAssistant4;
