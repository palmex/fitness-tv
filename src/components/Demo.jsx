import React, { useEffect, useRef, useState } from 'react';
import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils
} from "https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0";
import {usePoseAnalysis} from '../functions/usePoseAnalysis'
import PoseFeedback from './PoseFeedback'
import treepose from '../../imgs/poses/tree.png';
import { useNavigate } from 'react-router-dom';
import reverseWarrior from '../../imgs/poses/reverse_warrior.jpg';
import cobra from '../../imgs/poses/Cobra.png';
import sideBend from '../../imgs/poses/side_bend.png';
import prayerSquat from '../../imgs/poses/prayer-squat.jpg';
import { motion, AnimatePresence } from 'framer-motion';
import {checkInFrame, detectPoseType, calculateConfidence, generatePoseFeedback } from '../functions/poseProcessing';



  const poseImages = {
    TREE: treepose,
    REVERSE_WARRIOR: reverseWarrior,
    COBRA: cobra,
    SIDE_BEND: sideBend,
    PRAYER_SQUAT: prayerSquat,

  };

  const POSE_OPTIONS = [
    { id: 'TREE', label: 'Tree Pose' },
    { id: 'REVERSE_WARRIOR', label: 'Reverse Warrior' },
    { id: 'COBRA', label: 'Cobra'},
    { id: 'SIDE_BEND', label: 'Side Bend'},
    { id: 'PRAYER_SQUAT', label: 'Prayer Squat'}
  ];

  const AnimatedCounter = ({ value }) => {
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
      console.log('Counter value changed:', value);
      setIsUpdating(true);
      const timer = setTimeout(() => setIsUpdating(false), 150); // Match animation duration
      return () => clearTimeout(timer);
    }, [value]);

    return (
      <div className={`fixed top-4 right-4 ${isUpdating ? 'bg-green-600' : 'bg-red-600'} text-white rounded-xl p-4 shadow-lg transition-colors duration-150`}>
        <div className="text-center">
          <p className="text-sm mb-1">Points</p>
          
            <motion.span
            key={value}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.15 }}
            className="text-3xl font-bold block"
            > 
              {value}
            </motion.span>
          
        </div>
      </div>
    );
  };




export default function Demo() {
  const navigate = useNavigate();
  const [webcamRunning, setWebcamRunning] = useState(false);
  const [runningMode, setRunningMode] = useState("VIDEO");
  const poseLandmarkerRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const drawingUtilsRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [targetPose, setTargetPose] = useState('TREE');
  const currentPoseRef = useRef('TREE');
  const { poseState, analyzePose } = usePoseAnalysis(targetPose);
  const [lastPoseChange, setLastPoseChange] = useState(Date.now());
  const lastFrameCount = useRef(0);
  const [poseFeedback, setPoseFeedback] = useState('');

  const videoHeight = "360px";
  const videoWidth = "480px";

  useEffect(() => {
    const createPoseLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
          delegate: "GPU"
        },
        runningMode: runningMode,
        numPoses: 1
      });
      
      // Initialize drawing utils
      const canvasCtx = canvasRef.current.getContext("2d");
      drawingUtilsRef.current = new DrawingUtils(canvasCtx);
    };

    createPoseLandmarker();
    setIsLoading(false)
  }, []);

  useEffect(() => {
    if (!webcamRunning) return;

    const checkPoseChange = () => {
      const currentTime = Date.now();
      const timeElapsed = currentTime - lastPoseChange;
      const frameIncrease = poseState.frameCnt - lastFrameCount.current;

      // Change pose if 30 seconds passed or score increased by 100
      if (timeElapsed >= 30000 || frameIncrease >= 100) {
        // Get random pose that's different from current
        const availablePoses = POSE_OPTIONS.filter(pose => pose.id !== targetPose);
        const randomPose = availablePoses[Math.floor(Math.random() * availablePoses.length)];
        handlePoseSelect(randomPose.id);
      }
    };

    const interval = setInterval(checkPoseChange, 1000);
    return () => clearInterval(interval);
  }, [webcamRunning, targetPose, poseState.frameCnt]);


    // Add useEffect to monitor targetPose changes
  useEffect(() => {
    console.log('Target pose changed to:', targetPose);
  }, [targetPose]);

  useEffect(() => {
    // Create an intersection observer to check if the component is visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && webcamRunning) {
            // Component is visible, ensure prediction loop is running
            predictWebcam();
          }
        });
      },
      { threshold: 0.1 } // Trigger when at least 10% of the component is visible
    );

    // Start observing the container
    const container = document.getElementById('demo-container');
    if (container) {
      observer.observe(container);
    }

    return () => {
      observer.disconnect();
    };
  }, [webcamRunning]);
  

  const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;
  
  if (isLoading) {
    return <div><h2>Loading</h2></div>;
  }


  const handlePoseSelect = (pose) => {
    console.log('Selecting new pose:', pose);
    setTargetPose(pose);
    currentPoseRef.current = pose;
    setLastPoseChange(Date.now());
    lastFrameCount.current = poseState.frameCnt;
  };


  const enableCam = async () => {
    if (!poseLandmarkerRef.current) {
      console.log("Wait! poseLandmaker not loaded yet.");
      return;
    }

    const newWebcamState = !webcamRunning;
    setWebcamRunning(newWebcamState);

    if (newWebcamState) {
      // getUsermedia parameters
      const constraints = {
        video: true
      };

      // Activate the webcam stream
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener("loadeddata", () => {
          // Start prediction loop once video is loaded
          predictWebcam();
        });
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    } else {
      // Stop the stream when disabling
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const predictWebcam = async () => {
    // Safety checks
    if (!videoRef.current || !canvasRef.current || !drawingUtilsRef.current || !poseLandmarkerRef.current) {
      if (webcamRunning) {
        window.requestAnimationFrame(predictWebcam);
      }
      return;
    }

    const video = videoRef.current;
    const canvasElement = canvasRef.current;

    try {
      const startTimeMs = performance.now();
      
      // Detect poses in the current frame
      const results = await poseLandmarkerRef.current.detectForVideo(video, startTimeMs);
      // Analyze pose data
      if (results.landmarks && results.landmarks.length > 0) {
        // console.log(results)
        analyzePose(results.landmarks, currentPoseRef.current);
        console.log('Current frame count:', poseState.frameCnt, currentPoseRef.current);
      } else {
        setPoseFeedback('No pose detected - please stand in frame');
      }
      
      // Clear and prepare canvas
      const canvasCtx = canvasElement.getContext("2d");
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      
      // Draw the video frame first
      canvasCtx.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
      
      // Draw landmarks if available
      if (results.landmarks) {
        for (const landmark of results.landmarks) {
          drawingUtilsRef.current.drawLandmarks(landmark, {
            radius: (data) => DrawingUtils.lerp(data.from?.z || 0, -0.15, 0.1, 1, 1),
            color: "#FFFFFF",  // Green color for landmarks
            fillColor: "#FFFFFF"
          });
          drawingUtilsRef.current.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS, {
            color: "#FFFFFF",  // Red color for connections
            lineWidth: 1
          });
        }
      }
      canvasCtx.restore();
    } catch (error) {
      console.error("Error during pose detection:", error);
    }
    
    

    // Continue the animation loop if webcam is running
    if (webcamRunning) {
      window.requestAnimationFrame(predictWebcam);
    }
  };

  if (!hasGetUserMedia()) {
    return <div>getUserMedia() is not supported by your browser</div>;
  }

  

  return (
    <div className={`min-h-screen w-full bg-gradient-to-b from-gray-900 to-gray-800 text-white py-8`}>
      <div id="demo-container" className="relative flex flex-col items-center gap-8 w-full max-w-7xl mx-auto px-4">
          <button
            onClick={() => navigate('/')}
            className="absolute top-4 left-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Back
          </button>
          
      <div className={`bg-gray-900/80 backdrop-blur-lg rounded-2xl p-8 md:p-12 shadow-xl border border-white/10 min-w-[80%]`}>
        
          {<AnimatedCounter value={poseState.frameCnt} />}
          
          <div className="pose-selection w-full mb-8">
            <ul className="pose-selection flex gap-4 justify-center list-none p-0">
              {POSE_OPTIONS.map((pose) => (
                <li key={pose.id}>
                  <button 
                    className={`pose-button px-4 py-2 rounded-lg transition-all
                      ${targetPose === pose.id 
                        ? 'bg-blue-600 text-white border-2 border-blue-600' 
                        : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
                      }`}
                    onClick={() => handlePoseSelect(pose.id)}
                  >
                    {pose.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex w-full gap-8 justify-center">
            {/* Target Pose Image */}
            {targetPose && (
              <div className="w-1/2 max-w-xl">
                <img 
                  src={poseImages[targetPose]} 
                  alt={`${targetPose} pose`} 
                  className="pose-image w-full object-contain rounded-lg"
                  style={{maxHeight: videoHeight }}
                />
              </div>
            )}

            <div className="relative w-1/2 max-w-xl">
              <div className="relative">
                <video
                  id="webcam"
                  ref={videoRef}
                  style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: videoWidth,
                    height: videoHeight,
                    visibility: 'hidden'
                  }}
                  width={videoWidth}
                  height={videoHeight}
                  autoPlay
                  playsInline
                />
                <canvas
                  id="output_canvas"
                  ref={canvasRef}
                  style={{
                    width: '100%',
                    height: videoHeight
                  }}
                  width={videoWidth}
                  height={videoHeight}
                  className="rounded-lg"
                />
                <button 
                  onClick={enableCam}
                  className="w-full px-6 py-3 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {webcamRunning ? "DISABLE" : "ENABLE"} CAMERA
                </button>
              </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}