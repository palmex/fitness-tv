// Component to display feedback to the user
export default function PoseFeedback({ poseState }) {
    
    const { isCorrectPose,confidence,  feedback, detectedPose, isVisible } = poseState;
  
    console.log('poseState', isCorrectPose,confidence,  feedback, detectedPose, isVisible)
    return (
      <div className="absolute top-4 left-4 bg-black/50 p-4 rounded-lg text-white">
        <div className="text-lg font-bold">
          {detectedPose !== 'UNKNOWN' ? detectedPose : 'Analyzing...'}
        </div>
        <div className="text-sm">
          Confidence: {(confidence * 100).toFixed(1)}%
        </div>
        <div className="mt-2">
          {feedback}
        </div>
      </div>
    );
  }