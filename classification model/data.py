# this module is taken from tensorflow example repository to use functions and algorithms in the project

# Copyright 2021 The TensorFlow Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Module contains the data types used in pose estimation."""

import enum
from typing import List, NamedTuple, Dict
import numpy as np


class BodyPart(enum.Enum):
  """Enum representing human body keypoints detected by pose estimation models."""
  NOSE = 0
  LEFT_EYE = 1
  RIGHT_EYE = 2
  LEFT_EAR = 3
  RIGHT_EAR = 4
  LEFT_SHOULDER = 5
  RIGHT_SHOULDER = 6
  LEFT_ELBOW = 7
  RIGHT_ELBOW = 8
  LEFT_WRIST = 9
  RIGHT_WRIST = 10
  LEFT_HIP = 11
  RIGHT_HIP = 12
  LEFT_KNEE = 13
  RIGHT_KNEE = 14
  LEFT_ANKLE = 15
  RIGHT_ANKLE = 16


class Point(NamedTuple):
  """A point in 2D space."""
  x: float
  y: float


class Rectangle(NamedTuple):
  """A rectangle in 2D space."""
  start_point: Point
  end_point: Point


class KeyPoint(NamedTuple):
  """A detected human keypoint."""
  body_part: BodyPart
  coordinate: Point
  score: float


class Person(NamedTuple):
  """A pose detected by a pose estimation model."""
  keypoints: List[KeyPoint]
  bounding_box: Rectangle
  score: float
  id: int = None


# Define correct keypoints for each yoga pose
CORRECT_POSES = {
    "Tree Pose": {
        BodyPart.LEFT_SHOULDER: Point(0.2, 0.3),
        BodyPart.RIGHT_SHOULDER: Point(0.8, 0.3),
        BodyPart.LEFT_HIP: Point(0.3, 0.6),
        BodyPart.RIGHT_HIP: Point(0.7, 0.6),
        BodyPart.LEFT_KNEE: Point(0.3, 0.8),
        BodyPart.RIGHT_KNEE: Point(0.7, 0.8),
        BodyPart.LEFT_ANKLE: Point(0.3, 0.95),
        BodyPart.RIGHT_ANKLE: Point(0.7, 0.95),
    },
    "Downward Dog": {
        BodyPart.LEFT_SHOULDER: Point(0.1, 0.2),
        BodyPart.RIGHT_SHOULDER: Point(0.9, 0.2),
        BodyPart.LEFT_HIP: Point(0.2, 0.5),
        BodyPart.RIGHT_HIP: Point(0.8, 0.5),
        BodyPart.LEFT_KNEE: Point(0.2, 0.7),
        BodyPart.RIGHT_KNEE: Point(0.8, 0.7),
        BodyPart.LEFT_ANKLE: Point(0.2, 0.9),
        BodyPart.RIGHT_ANKLE: Point(0.8, 0.9),
    }
}


def person_from_keypoints_with_scores(
    keypoints_with_scores: np.ndarray,
    image_height: float,
    image_width: float,
    keypoint_score_threshold: float = 0.1) -> Person:
  """Creates a Person instance from single pose estimation model output.

  Args:
    keypoints_with_scores: Output of the TFLite pose estimation model. A numpy
      array with shape [17, 3]. Each row represents a keypoint: [y, x, score].
    image_height: height of the image in pixels.
    image_width: width of the image in pixels.
    keypoint_score_threshold: Only use keypoints with above this threshold to
      calculate the person average score.

  Returns:
    A Person instance.
  """

  kpts_x = keypoints_with_scores[:, 1]
  kpts_y = keypoints_with_scores[:, 0]
  scores = keypoints_with_scores[:, 2]

  # Convert keypoints to the input image coordinate system.
  keypoints = []
  for i in range(scores.shape[0]):
    keypoints.append(
        KeyPoint(
            BodyPart(i),
            Point(int(kpts_x[i] * image_width), int(kpts_y[i] * image_height)),
            scores[i]))

  # Calculate bounding box as SinglePose models don't return bounding box.
  start_point = Point(
      int(np.amin(kpts_x) * image_width), int(np.amin(kpts_y) * image_height))
  end_point = Point(
      int(np.amax(kpts_x) * image_width), int(np.amax(kpts_y) * image_height))
  bounding_box = Rectangle(start_point, end_point)

  # Calculate person score by averaging keypoint scores.
  scores_above_threshold = list(
      filter(lambda x: x > keypoint_score_threshold, scores))
  person_score = np.average(scores_above_threshold)

  return Person(keypoints, bounding_box, person_score)


def compare_pose(user_keypoints: List[KeyPoint], correct_pose: Dict[BodyPart, Point], threshold: float = 0.1) -> List[str]:
  """Compares the user's keypoints with the correct pose and generates feedback.

  Args:
    user_keypoints: List of KeyPoint objects representing the user's pose.
    correct_pose: Dictionary of BodyPart to Point representing the correct pose.
    threshold: Maximum allowed deviation for a keypoint to be considered correct.

  Returns:
    A list of feedback messages indicating how to adjust the pose.
  """
  feedback = []
  for keypoint in user_keypoints:
    if keypoint.body_part in correct_pose:
      correct_point = correct_pose[keypoint.body_part]
      deviation = np.sqrt((keypoint.coordinate.x - correct_point.x) ** 2 + (keypoint.coordinate.y - correct_point.y) ** 2)
      if deviation > threshold:
        feedback.append(f"Adjust your {keypoint.body_part.name.lower()}.")
  return feedback


class Category(NamedTuple):
  """A classification category."""
  label: str
  score: float