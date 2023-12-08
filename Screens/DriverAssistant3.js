import React, { useEffect, useRef, useState } from "react";
import { View, Button } from "react-native";
import { RTCView, RTCPeerConnection, RTCSessionDescription, mediaDevices } from "react-native-webrtc";

const App = () => {
  const [localStream, setLocalStream] = useState(null);
  const [serverStream, setServerStream] = useState(null);
  const config = {
    sdpSemantics: "unified-plan",
    iceServers: [{ urls: "stun:stun.l..com:19302" }], // Adjust URL and credentials accordingly
  };
  let pc = new RTCPeerConnection(config);

  const start = async () => {
    const isFront = true;

    const stream = await mediaDevices.getUserMedia({
      video: {
        mandatory: {
          minWidth: 640,
          minHeight: 360,
          minFrameRate: 30,
        },
        facingMode: isFront ? "user" : "environment",
        optional: [],
      },
      audio: false,
    });

    setLocalStream(stream);

    localStream.getTracks().forEach(track => {
      pc.addTrack(track);
    });

    pc.addEventListener("track", function(evt) {
      console.log("receive server video");
      if (evt.track.kind == "video") {
        setServerStream(event.streams[0]);
      }
    });

    // pc.ontrack = event => {
    //   console.log("Received server video");
    //   if (event.track.kind === 'video') {
    //     setServerStream(event.streams[0]);
    //   }
    // };

    await negotiate();
  };

  function negotiate() {
    return new Promise(async (resolve, reject) => {
      try {
        const offer = await pc.createOffer();
        console.log("Offer created");

        await pc.setLocalDescription(offer);
        console.log("Local description set");

        // Wait for ICE gathering to complete
        await new Promise((resolveIce) => {
          if (pc.iceGatheringState === "complete") {
            console.log("ICE gathering already complete");
            resolveIce();
          } else {
            function checkState() {
              if (pc.iceGatheringState === "complete") {
                pc.removeEventListener("icegatheringstatechange", checkState);
                console.log("ICE gathering complete");
                resolveIce();
              }
            }

            pc.addEventListener("icegatheringstatechange", checkState);
          }
        });

        const offerToSend = pc.localDescription;
        console.log("Sending offer to server");

        const response = await fetch("http://192.168.1.194:8080/offer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sdp: offerToSend.sdp,
            type: offerToSend.type,
          }),
        });
        console.log("Offer sent to server");

        const answer = await response.json();
        console.log("Received response from server");

        await pc.setRemoteDescription(answer);
        console.log("Remote description set");
        resolve("Negotiation successful");
      } catch (error) {
        console.error("Error during negotiation:", error);
        reject(error);
      }
    });
  }
  const stop = () => {
    if (pc) {
      pc.close();
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <RTCView streamURL={localStream?.toURL()} style={{ width: 200, height: 200 }} />
      <RTCView streamURL={serverStream?.toURL()} style={{ width: 200, height: 200 }} />
      <Button title="Start" onPress={start} />
      <Button title="Stop" onPress={stop} />
    </View>
  );
};

export default App;
