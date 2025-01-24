# Import necessary classes and functions from data.py
from data import BodyPart, Point, KeyPoint, CORRECT_POSES, compare_pose

# Simulated keypoints for a user's pose (with significant deviations)
user_keypoints = [
    KeyPoint(BodyPart.LEFT_SHOULDER, Point(0.3, 0.4), 0.9),  # Off (correct: 0.2, 0.3)
    KeyPoint(BodyPart.RIGHT_SHOULDER, Point(0.9, 0.4), 0.9),  # Off (correct: 0.8, 0.3)
    KeyPoint(BodyPart.LEFT_HIP, Point(0.4, 0.7), 0.9),        # Off (correct: 0.3, 0.6)
    KeyPoint(BodyPart.RIGHT_HIP, Point(0.8, 0.7), 0.9),       # Correct
    KeyPoint(BodyPart.LEFT_KNEE, Point(0.4, 0.9), 0.9),       # Off (correct: 0.3, 0.8)
    KeyPoint(BodyPart.RIGHT_KNEE, Point(0.8, 0.9), 0.9),      # Correct
    KeyPoint(BodyPart.LEFT_ANKLE, Point(0.4, 1.0), 0.9),      # Off (correct: 0.3, 0.95)
    KeyPoint(BodyPart.RIGHT_ANKLE, Point(0.8, 1.0), 0.9),     # Correct
]

# Get the correct pose for "Tree Pose"
correct_pose = CORRECT_POSES["Tree Pose"]

# Compare the user's pose with the correct pose
feedback = compare_pose(user_keypoints, correct_pose)

# Print the feedback
print("Feedback:", feedback)