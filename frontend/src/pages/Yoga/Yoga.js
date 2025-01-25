import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { count } from "../../utils/music";
import Instructions from "../../components/Instrctions/Instructions";
import "./Yoga.css";
import DropDown from "../../components/DropDown/DropDown";
import { poseImages } from "../../utils/pose_images";
import { POINTS, keypointConnections } from "../../utils/data";
import { drawPoint, drawSegment } from "../../utils/helper";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

// Constants
let skeletonColor = "rgb(255,255,255)";
let poseList = [
  "Tree",
  "Chair",
  "Cobra",
  "Warrior",
  "Dog",
  "Shoulderstand",
  "Traingle",
];

let interval;
let flag = false;

function Yoga() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [startingTime, setStartingTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [poseTime, setPoseTime] = useState(0);
  const [bestPerform, setBestPerform] = useState(0);
  const [currentPose, setCurrentPose] = useState("Tree");
  const [isStartPose, setIsStartPose] = useState(false);
  const [feedbackMessages, setFeedbackMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Authentication check for starting yoga
  const startYoga = () => {
    if (!user) {
      navigate("/signup");
      return;
    }
    setLoading(true);
    setError(null);
    setIsStartPose(true);
    runMovenet()
      .catch((err) => {
        setError("Failed to initialize pose detection");
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  // Pose detection timing logic
  useEffect(() => {
    const timeDiff = (currentTime - startingTime) / 1000;
    if (flag) {
      setPoseTime(timeDiff);
    }
    if (timeDiff > bestPerform) {
      setBestPerform(timeDiff);
    }
  }, [currentTime]);

  // Reset counters on pose change
  useEffect(() => {
    setCurrentTime(0);
    setPoseTime(0);
    setBestPerform(0);
  }, [currentPose]);

  // Pose classification setup
  const CLASS_NO = {
    Chair: 0,
    Cobra: 1,
    Dog: 2,
    No_Pose: 3,
    Shoulderstand: 4,
    Traingle: 5,
    Tree: 6,
    Warrior: 7,
  };

  // TensorFlow.js pose processing functions
  const get_center_point = (landmarks, left_bodypart, right_bodypart) => {
    const left = tf.gather(landmarks, left_bodypart, 1);
    const right = tf.gather(landmarks, right_bodypart, 1);
    return tf.add(tf.mul(left, 0.5), tf.mul(right, 0.5));
  };

  const get_pose_size = (landmarks, torso_size_multiplier = 2.5) => {
    const hips_center = get_center_point(
      landmarks,
      POINTS.LEFT_HIP,
      POINTS.RIGHT_HIP
    );
    const shoulders_center = get_center_point(
      landmarks,
      POINTS.LEFT_SHOULDER,
      POINTS.RIGHT_SHOULDER
    );
    const torso_size = tf.norm(tf.sub(shoulders_center, hips_center));
    let pose_center_new = get_center_point(
      landmarks,
      POINTS.LEFT_HIP,
      POINTS.RIGHT_HIP
    );
    pose_center_new = tf.broadcastTo(
      tf.expandDims(pose_center_new, 1),
      [1, 17, 2]
    );
    const d = tf.gather(tf.sub(landmarks, pose_center_new), 0, 0);
    const max_dist = tf.max(tf.norm(d, "euclidean", 0));
    return tf.maximum(tf.mul(torso_size, torso_size_multiplier), max_dist);
  };

  const normalize_pose_landmarks = (landmarks) => {
    const pose_center = get_center_point(
      landmarks,
      POINTS.LEFT_HIP,
      POINTS.RIGHT_HIP
    );
    const centered_landmarks = tf.sub(
      landmarks,
      tf.broadcastTo(tf.expandDims(pose_center, 1), [1, 17, 2])
    );
    const pose_size = get_pose_size(centered_landmarks);
    return tf.div(centered_landmarks, pose_size);
  };

  const landmarks_to_embedding = (landmarks) => {
    return tf.reshape(
      normalize_pose_landmarks(tf.expandDims(landmarks, 0)),
      [1, 34]
    );
  };

  // Pose detection initialization
  const runMovenet = async () => {
    try {
      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        { modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER }
      );

      const poseClassifier = await tf.loadLayersModel(
        "https://models.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json"
      );

      const countAudio = new Audio(count);
      countAudio.loop = true;

      interval = setInterval(() => {
        detectPose(detector, poseClassifier, countAudio);
      }, 100);
    } catch (err) {
      setError("Failed to initialize pose detection");
      console.error(err);
    }
  };

  // Pose detection and feedback logic
  const detectPose = async (detector, poseClassifier, countAudio) => {
    try {
      if (!webcamRef.current?.video) return;

      const imageSrc = webcamRef.current.getScreenshot();
      const blob = await fetch(imageSrc).then((res) => res.blob());
      const formData = new FormData();
      formData.append("image", blob, "webcam-image.png");

      const response = await fetch("http://localhost:5000/detect-pose", {
        method: "POST",
        body: formData,
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setFeedbackMessages(data.feedback || []);

      const pose = await detector.estimatePoses(webcamRef.current.video);
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      pose[0].keypoints.forEach((keypoint) => {
        if (
          keypoint.score > 0.4 &&
          !["left_eye", "right_eye"].includes(keypoint.name)
        ) {
          drawPoint(ctx, keypoint.x, keypoint.y, 8, "rgb(255,255,255)");
          keypointConnections[keypoint.name]?.forEach((connection) => {
            const conName = connection.toUpperCase();
            const targetPoint = pose[0].keypoints[POINTS[conName]];
            if (targetPoint) {
              drawSegment(
                ctx,
                [keypoint.x, keypoint.y],
                [targetPoint.x, targetPoint.y],
                skeletonColor
              );
            }
          });
        }
      });

      const input = pose[0].keypoints.map((kp) => [kp.x, kp.y]);
      const prediction = await poseClassifier
        .predict(landmarks_to_embedding(input))
        .array();

      if (prediction[0][CLASS_NO[currentPose]] > 0.97) {
        if (!flag) {
          countAudio.play();
          setStartingTime(Date.now());
          flag = true;
        }
        setCurrentTime(Date.now());
        skeletonColor = "rgb(0,255,0)";
      } else {
        flag = false;
        skeletonColor = "rgb(255,255,255)";
        countAudio.pause();
        countAudio.currentTime = 0;
      }
    } catch (err) {
      console.error("Pose detection error:", err);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(interval);
      tf.disposeVariables();
    };
  }, []);

  // UI Components
  if (isStartPose) {
    return (
      <div className="yoga-container">
        <div className="performance-container">
          <div className="pose-performance">
            <h4>Current: {poseTime.toFixed(1)}s</h4>
          </div>
          <div className="pose-performance">
            <h4>Best: {bestPerform.toFixed(1)}s</h4>
          </div>
        </div>

        <div className="webcam-and-pose-container">
          <div className="webcam-container">
            <Webcam
              ref={webcamRef}
              width={640}
              height={480}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "user" }}
              mirrored
            />
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              style={{ position: "absolute", left: 0, top: 0 }}
            />
          </div>

          <div className="pose-reference">
            <img
              src={poseImages[currentPose]}
              alt={`${currentPose} Pose Example`}
              className="pose-img"
            />
          </div>
        </div>

        <div className="feedback-container">
          {feedbackMessages.map((msg, i) => (
            <div key={i} className="feedback-message">
              {msg}
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            setIsStartPose(false);
            clearInterval(interval);
          }}
          className="secondary-btn"
        >
          Stop Session
        </button>

        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading-overlay">Initializing...</div>}
      </div>
    );
  }

  return (
    <div className="yoga-selection">
      <DropDown
        poseList={poseList}
        currentPose={currentPose}
        setCurrentPose={setCurrentPose}
      />
      <Instructions currentPose={currentPose} />
      <button onClick={startYoga} className="primary-btn" disabled={loading}>
        {loading ? "Initializing..." : "Start Practice"}
      </button>
    </div>
  );
}

export default Yoga;
