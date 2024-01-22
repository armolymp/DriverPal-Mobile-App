import React, { useState } from "react";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { mediaDevices, RTCView, RTCPeerConnection } from "react-native-webrtc";
import { useEffect } from "react/cjs/react.production.min";

const App = () => {
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  let pc;
  const start = async () => {
    console.log("start");
    if (!stream) {
      let s;
      try {
        s = await mediaDevices.getUserMedia({
          video: {facingMode: 'environment',width: { ideal: 640 },
          height: { ideal: 480 },frameRate: { ideal: 30, max: 30}},
          audio: false,
        });
        setStream(s);
      } catch (e) {
        console.error(e);
      }
    }
  };
  const stop = () => {
    console.log("stop");
    if (stream) {
      stream.release();
      setStream(null);
    }
  };

  // useEffect(()=>{
  //   console.log('--------------------stream------------------------')
  //   console.log(stream)
  //   console.log('--------------------stream------------------------')
  // },[stream])

  function startServer() {
    console.log("Starting...");
    var config = {
      sdpSemantics: "unified-plan",
      iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
    };
    pc = new RTCPeerConnection(config)
    console.log(pc)
    stream.getTracks().forEach(track => {
      pc.addTrack(track);
    });
    pc.addEventListener("track", function(evt) {
      console.log("Receiving server video track");
      if (evt.track.kind === "video") {
        console.log('methana')
        console.log(evt.streams[0])
        setRemoteStream(evt.streams[0]);
      }
    });

    negotiate()
    .then(() => {
        console.log("Negotiation process completed");
    })
    .catch((err) => {
        console.error("Negotiation process failed:", err);
    });
    console.log("Started negotiation");
  }

  const negotiate = async () => {
    console.log("Negotiating...");
    return pc.createOffer().then(function(offer) {
      console.log("Created offer");
      return pc.setLocalDescription(offer);
      // return new Promise(function(resolve) {
      //   retu
      // });
    }).then(function() {
      console.log("Waiting for ICE gathering to complete");
      return new Promise(function(resolve) {
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
    }).then(function() {
      console.log("Sending offer to server");
      var offer = pc.localDescription;
      return fetch('http://192.168.1.194:8080/offer', {
        body: JSON.stringify({
          sdp: offer.sdp,
          type: offer.type,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
    }).then(function(response) {
      console.log("Received response from server");
      return response.json();
    }).then(function(answer) {
      console.log("Setting remote description");
      return pc.setRemoteDescription(answer);
    }).catch((err) => {
      console.error("CONNECTION ERROR:::::::", err);
  });
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.body}>
        {
          remoteStream &&
          <RTCView
            streamURL={remoteStream.toURL()}
            style={styles.stream2} />
        }
        <View
          style={styles.footer}>
          <Button
            title="Start"
            onPress={start} />
          <Button
            title="Stop"
            onPress={stop} />
          <Button
            title="Start Server"
            onPress={startServer} />
          <Button
            title="Stop Server"
            onPress={stop} />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    ...StyleSheet.absoluteFill,
  },
  stream: {
    flex: 1,
    width: 10,
    height: 25,
  },
  stream2: {
    flex: 1,
    width: 400,
    height: 400,
  }
  ,
  footer: {
    backgroundColor: Colors.lighter,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default App;
