import React, { useEffect, useRef } from 'react';
import { View, Text, Button } from 'react-native';
import { RTCView, RTCPeerConnection, RTCIceCandidate, RTCSessionDescription, mediaDevices } from 'react-native-webrtc';

const App = () => {
  const localStream = useRef(null);
  const pc = useRef(null);
  const ws = useRef(new WebSocket('http://192.168.1.194:8080/'));

  const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

  const startStreaming = async () => {
    const isFront = true; // Change if necessary

    const stream = await mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          minWidth: 640,
          minHeight: 360,
          minFrameRate: 30,
        },
        facingMode: isFront ? 'user' : 'environment',
        optional: [],
      },
    });

    localStream.current = stream;
    pc.current = new RTCPeerConnection(configuration);

    // Add stream to peer connection
    localStream.current.getTracks().forEach(track => {
      pc.current.addTrack(track, localStream.current);
    });

    pc.current.onicecandidate = event => {
      if (event.candidate) {
        ws.current.send(JSON.stringify({ ice: event.candidate }));
      }
    };

    pc.current.createOffer().then(offer => {
      pc.current.setLocalDescription(offer).then(() => {
        ws.current.send(JSON.stringify({ sdp: pc.current.localDescription }));
      });
    });
  };

  useEffect(() => {
    ws.current.onopen = () => {
      console.log('Connected to the server');
    };

    ws.current.onmessage = async event => {
      const signal = JSON.parse(event.data);

      if (signal.sdp) {
        await pc.current.setRemoteDescription(new RTCSessionDescription(signal.sdp));
        if (signal.sdp.type === 'offer') {
          pc.current.createAnswer().then(answer => {
            pc.current.setLocalDescription(answer).then(() => {
              ws.current.send(JSON.stringify({ sdp: pc.current.localDescription }));
            });
          });
        }
      } else if (signal.ice) {
        pc.current.addIceCandidate(new RTCIceCandidate(signal.ice));
      }
    };

    ws.current.onclose = () => {
      console.log('Disconnected from the server');
    };
  }, []);

  const stopStreaming = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
      localStream.current.release();
    }

    if (pc.current) {
      pc.current.close();
    }

    if (ws.current) {
      ws.current.close();
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <RTCView streamURL={localStream.current?.toURL()} style={{ width: 200, height: 200 }} />
      <Button title="Start Streaming" onPress={startStreaming} />
      <Button title="Stop Streaming" onPress={stopStreaming} />
    </View>
  );
};

export default App;
