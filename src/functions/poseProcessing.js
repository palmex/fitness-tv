// import data from './data.json';
// Service to handle pose detection logic
export const detectPoseType = (landmarks, targetPose) => {
    switch (targetPose) {
        case 'TREE':
          return isTreePose(landmarks) ? 'TREE' : 'INCORRECT';
        case 'REVERSE_WARRIOR':
          return isReverseWarriorPose(landmarks) ? 'REVERSE_WARRIOR' : 'INCORRECT';
        case 'COBRA':
          return isCobraPose(landmarks) ? 'COBRA' : 'INCORRECT';
        case 'PRAYER_SQUAT':
          return isPrayerSquatPose(landmarks) ? 'PRAYER_SQUAT' : 'INCORRECT';
        case 'SIDE_BEND':
          return isSideBendPose(landmarks) ? 'SIDE_BEND' : 'INCORRECT';
        default:
          return 'UNKNOWN';
      }
  };

const dot = (a, b) => {
    a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n)
}

const cosineSimilarity = (landmarks, targetPose) => {
    // Convert landmarks and targetPose to flat arrays
    
    
    const flatLandmarks = landmarks.flat();
    const flatTarget = targetPose.flat();
    // console.log(flatLandmarks, flatTarget)

    // Calculate dot product
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < flatLandmarks.length; i++) {
        // console.log(dotProduct, normA, normB)
        // console.log(flatLandmarks[i], flatTarget[i])
        // Handle x, y, z coordinates separately
        
        dotProduct += flatLandmarks[i].x * flatTarget[i].x; 
        dotProduct += flatLandmarks[i].y * flatTarget[i].y; 
        dotProduct += flatLandmarks[i].z * flatTarget[i].z;
        
        normA += flatLandmarks[i].x * flatLandmarks[i].x;
        normA += flatLandmarks[i].y * flatLandmarks[i].y;
        normA += flatLandmarks[i].z * flatLandmarks[i].z;
        
        // normB += dot(flatTarget[i],flatTarget[i])
        normB += flatTarget[i].x * flatTarget[i].x;
        normB += flatTarget[i].y * flatTarget[i].y;
        normB += flatTarget[i].z * flatTarget[i].z;
    }
    
    // Calculate magnitude
    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);
    console.log(dotProduct, normA, normB)

    // Return cosine similarity
    const similarity = dotProduct / (normA * normB);
    console.log(similarity)
    return similarity
}

  export const isPose = (landmarks) => {
  if (!landmarks || !landmarks.length) return false;
  
  // Get the first detected pose
  const pose = landmarks[0];
  
  // Check if we have basic pose data
  if (!pose || pose.length < 33) return false;
  
  // Check if key points are present and have valid coordinates
  const keyPoints = [11, 12, 23, 24]; // Shoulders and hips
  return keyPoints.every(point => 
    pose[point] && 
    typeof pose[point].x === 'number' &&
    typeof pose[point].y === 'number' &&
    typeof pose[point].z === 'number'
  );
  };
  
  export const calculateConfidence = (landmarks) => {
    // Add confidence calculation logic
    return 0.8; // Example return
  };

  
  
  export const generatePoseFeedback = (analysis, targetPose) => {
    const { isCorrectPose, detectedPose, confidence,isVisible } = analysis;
  
    
    // if (!checkInFrame(detectedPose, targetPose)){
    //     console.log("You are not entirely visible")
    //     return "You are not entirely visible"
    // }
    if (!isVisible){
        return "Cannot see all limbs"
    }

    // if (detectedPose === 'INCORRECT') {
    //     switch (targetPose) {
    //     case 'TREE':
    //         return "Try to lift your foot to your thigh and keep your standing leg straight";
    //     case 'REVERSE_WARRIOR':
    //         return "Bend your front knee and reach back with your front arm";
    //     default:
    //         return "Try to match the pose shown in the image";
    //     }
    // }

    // If they're doing the pose correctly
    if (confidence < 0.6) {
        return "Good start! Try to hold the pose more steadily";
    }
    return "Excellent form!";
  };

export const checkInFrame = (landmarks, targetPose) => {
  // Required landmarks for each pose
  landmarks = landmarks[0]
  const requiredLandmarks = {
    'TREE': [23, 24, 25, 26, 27, 28], // Hips, knees, ankles
    'REVERSE_WARRIOR': [23, 24, 25, 26, 27, 28], // Hips, knees, ankles
    'COBRA': [23, 24, 25, 26, 27, 28], // Hips, knees, ankles
    'SIDE_BEND': [23, 24, 25, 26, 27, 28], // Hips, knees, ankles
    'PRAYER_SQUAT': [23, 24, 25, 26, 27, 28] // Hips, knees, ankles
  };

    
  // Get required landmarks for target pose
  const required = requiredLandmarks[targetPose];
//   console.log(required, targetPose, landmarks)
  if (!required) return false;
//   v10.0 does not have visibility!
    

//   console.log(landmarks[0].visibility)
//   // Check if all required landmarks are present and visible
  return required.every(index => {
    const landmark = landmarks[index]; // Access first detected pose's landmarks
    return landmark !== undefined;
  });
};

const isTreePose = (landmarks) => {
    // Get relevant landmarks
    // console.log(landmarks)
    // landmarks = landmarks[0]

    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    

    // Check if one foot is raised to opposite thigh/knee
    const lVerticalDifference = Math.abs(leftAnkle.y - rightAnkle.y);
    const rVerticalDifference = Math.abs(rightAnkle.y - rightAnkle.y);
    const isFootRaised = lVerticalDifference > 0.15 || rVerticalDifference > 0.15; // Threshold for foot height difference

    // Check if standing leg is straight
    const standingLegAngle = calculateAngle(
        leftAnkle,
        leftKnee,
        leftHip
    );
    const isLegStraight = standingLegAngle > 160; // Nearly straight leg

    return isFootRaised && isLegStraight;
};
  
const isWarriorPose = (landmarks) => {
    // Get relevant landmarks
    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];

    // Check for wide stance
    const stanceWidth = Math.abs(leftAnkle.x - rightAnkle.x);
    const isWideStance = stanceWidth > 0.5; // Threshold for stance width

    // Check for bent front knee
    const frontKneeAngle = calculateAngle(
    leftAnkle,
    leftKnee,
    leftHip
    );
    const isFrontKneeBent = frontKneeAngle < 130; // Bent knee threshold

    return isWideStance && isFrontKneeBent;
};

const isReverseWarriorPose = (landmarks) => {
    
    // Get relevant landmarks
    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];
  
    // Check for wide stance
    const stanceWidth = Math.abs(leftAnkle.x - rightAnkle.x);
    console.log('stanceWidth', stanceWidth)
    const isWideStance = stanceWidth > 0.2;
  
    // Check for bent front knee
    const leftKneeAngle = calculateAngle(
      leftAnkle,
      leftKnee,
      leftHip
    );

    const rightKneeAngle = calculateAngle(
        rightAnkle,
        rightKnee,
        rightHip
      );

    // console.log('leftKneeAngle', leftKneeAngle,'rightKneeAngle', rightKneeAngle )

    const isFrontKneeBent = leftKneeAngle < 130 || rightKneeAngle < 130;
  
    // Check for back arm raised
    // const armAngle = calculateAngle(
    //   leftWrist,
    //   leftShoulder,
    //   leftHip
    // );
    // const isArmRaised = armAngle > 150;
  
    // // Check for torso lean
    // const torsoAngle = calculateAngle(
    //   leftShoulder,
    //   leftHip,
    //   leftKnee
    // );
    // const isTorsoLeaning = torsoAngle < 150;
  
    return isWideStance && isFrontKneeBent //&& isArmRaised && isTorsoLeaning;
};

const isCobraPose = (landmarks) => {
    // Get relevant landmarks
    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftElbow = landmarks[13];
    const rightElbow = landmarks[14];
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];
    
  
     // Check if prone
     const verticalDifference = Math.abs(leftAnkle.y - leftKnee.y);
    
     const isProne = verticalDifference < 0.1; // Threshold for foot height
  
    // Check if standing leg is straight
    const backAngle = calculateAngle(
        leftKnee,
        leftHip,
        leftShoulder,
    );
    const isBackBent = backAngle > 120; // Nearly straight leg
  
    // Check for back arm raised
    const armAngle = calculateAngle(
      leftWrist,
      leftElbow,
      leftShoulder
    );
    const isArmStraight = armAngle > 150;

    // console.log('cobra')
    // console.log(backAngle, verticalDifference,armAngle)
    return isBackBent && isProne && isArmStraight;
};

const isPrayerSquatPose = (landmarks) => {
    // Get relevant landmarks
    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftElbow = landmarks[13];
    const rightElbow = landmarks[14];
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];

    // Check if hips are below knees
    const hipKneeDiff = leftHip.y - leftKnee.y;
    // console.log('hipKneeDiff', hipKneeDiff)
    const isDeepSquat = hipKneeDiff > 0; // Positive value means hips are lower than knees

    // Check if wrists are touching
    const wristDistance = Math.sqrt(
        Math.pow(leftWrist.x - rightWrist.x, 2) + 
        Math.pow(leftWrist.y - rightWrist.y, 2) +
        Math.pow(leftWrist.z - rightWrist.z, 2)
    );

    // console.log('wristDistance', wristDistance)
    const areWristsTouching = wristDistance < 0.2; // Small threshold for wrist proximity

    // Check if knees are bent (not straight)
    const kneeAngle = calculateAngle(
        leftAnkle,
        leftKnee,
        leftHip
    );

    // console.log('prayer kneeAngle', kneeAngle)
    const areKneesBent = kneeAngle < 120; // Significantly bent knees

    return isDeepSquat && areWristsTouching && areKneesBent;
};

const isSideBendPose = (landmarks) => {
    // console.log('sidebend', landmarks)
    
    // Get relevant landmarks
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];
    const leftKnee = landmarks[25];

    // Check if one arm is raised vertically
    const isLeftArmRaised = leftWrist.y < leftShoulder.y;
    const isRightArmRaised = rightWrist.y < rightShoulder.y;
    const isArmRaised = isLeftArmRaised || isRightArmRaised;

    // Check if torso is bent sideways
    const shoulderMidpoint = {
        x: (leftShoulder.x + rightShoulder.x) / 2,
        y: (leftShoulder.y + rightShoulder.y) / 2
    };
    const hipMidpoint = {
        x: (leftHip.x + rightHip.x) / 2,
        y: (leftHip.y + rightHip.y) / 2
    };
    const torsoAngle = Math.abs(calculateAngle(shoulderMidpoint, hipMidpoint, leftKnee));
    const isSideBent = torsoAngle < 160;


    // console.log('side bend')
    // console.log(torsoAngle )
    return isArmRaised && isSideBent;
};


export const isCobra = async (landmarks) => {

    // Load target pose landmarks from JSON file
    const response = await fetch('../../imgs/poses/Cobra.json');
    const targetPose = await response.json();
    
    // Calculate similarity between current pose and target cobra pose
    const similarity = cosineSimilarity(landmarks, targetPose);

    // Return true if similarity is above threshold
    return similarity;
}

export const isTree = async (landmarks) => {

    // Load target pose landmarks from JSON file
    
    
    const response =  await fetch('../../imgs/poses/tree.json');
    const targetPose = await response.json();
    
    // Calculate similarity between current pose and target cobra pose
    const similarity = cosineSimilarity(landmarks, targetPose);

    // Return true if similarity is above threshold
    return similarity;
}

export const isReverseWarrior = async (landmarks) => {

    // Load target pose landmarks from JSON file
    const response = await fetch('../../imgs/poses/reverse_warrior.json');
    const targetPose = await response.json();
    
    // Calculate similarity between current pose and target cobra pose
    const similarity = cosineSimilarity(landmarks, targetPose);

    // Return true if similarity is above threshold
    return similarity;
}


  
// Helper function to calculate angle between three points
const calculateAngle = (point1, point2, point3) => {
const radians = Math.atan2(
    point3.y - point2.y,
    point3.x - point2.x
) - Math.atan2(
    point1.y - point2.y,
    point1.x - point2.x
);

let angle = Math.abs(radians * 180.0 / Math.PI);
if (angle > 180.0) angle = 360 - angle;
return angle;
};