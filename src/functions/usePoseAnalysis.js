// Custom hook to handle pose analysis logic
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {checkInFrame, detectPoseType, calculateConfidence, generatePoseFeedback } from './poseProcessing'

export const usePoseAnalysis = () => {
    const [poseState, setPoseState] = useState({
      isCorrectPose: false,
      confidence: 0,
      feedback: '',
      detectedPose: null,
      isVisible: false,
      targetPose: null,
      frameCnt: 0,
    });
  
    const analyzePose = useCallback((landmarks, targetPose) => {
        if (!landmarks?.length) return;
        
        // Process the first detected pose
        const pose = landmarks[0];
    
        const detected = detectPoseType(pose, targetPose);
        // console.log(detected);
      // Calculate pose metrics
        if (detected === targetPose) {
            setPoseState(prevState => ({
                ...prevState,
                frameCnt: prevState.frameCnt + 1
            }));
            return true; 
        }
        return false;
    }, []);
  
    return { poseState, analyzePose };
  };