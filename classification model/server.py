from typing import List  # Import List for type hints
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import cv2
import numpy as np
from movenet import Movenet
from data import BodyPart, Point  # Import BodyPart and Point from data.py

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize MoveNet
movenet = Movenet('movenet_thunder.tflite')

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

# Define safe ranges for each yoga pose
SAFE_RANGES = {
    "Tree Pose": {
        BodyPart.LEFT_SHOULDER: {"x": (0.15, 0.25), "y": (0.25, 0.35)},
        BodyPart.RIGHT_SHOULDER: {"x": (0.75, 0.85), "y": (0.25, 0.35)},
        BodyPart.LEFT_HIP: {"x": (0.25, 0.35), "y": (0.55, 0.65)},
        BodyPart.RIGHT_HIP: {"x": (0.65, 0.75), "y": (0.55, 0.65)},
        BodyPart.LEFT_KNEE: {"x": (0.25, 0.35), "y": (0.75, 0.85)},
        BodyPart.RIGHT_KNEE: {"x": (0.65, 0.75), "y": (0.75, 0.85)},
        BodyPart.LEFT_ANKLE: {"x": (0.25, 0.35), "y": (0.90, 1.00)},
        BodyPart.RIGHT_ANKLE: {"x": (0.65, 0.75), "y": (0.90, 1.00)},
    },
    "Downward Dog": {
        BodyPart.LEFT_SHOULDER: {"x": (0.05, 0.15), "y": (0.15, 0.25)},
        BodyPart.RIGHT_SHOULDER: {"x": (0.85, 0.95), "y": (0.15, 0.25)},
        BodyPart.LEFT_HIP: {"x": (0.15, 0.25), "y": (0.45, 0.55)},
        BodyPart.RIGHT_HIP: {"x": (0.75, 0.85), "y": (0.45, 0.55)},
        BodyPart.LEFT_KNEE: {"x": (0.15, 0.25), "y": (0.65, 0.75)},
        BodyPart.RIGHT_KNEE: {"x": (0.75, 0.85), "y": (0.65, 0.75)},
        BodyPart.LEFT_ANKLE: {"x": (0.15, 0.25), "y": (0.85, 0.95)},
        BodyPart.RIGHT_ANKLE: {"x": (0.75, 0.85), "y": (0.85, 0.95)},
    }
}

def compare_pose(user_keypoints, correct_pose, safe_ranges) -> List[str]:
    """Compare the user's keypoints with the safe ranges and generate feedback."""
    feedback = []
    for keypoint in user_keypoints:
        if keypoint.body_part in correct_pose:
            # Normalize detected keypoints to [0, 1]
            normalized_x = keypoint.coordinate.x / 256  # Assuming image size is 256x256
            normalized_y = keypoint.coordinate.y / 256

            # Get the safe range for this body part
            safe_range = safe_ranges.get(keypoint.body_part, {"x": (0, 1), "y": (0, 1)})
            min_x, max_x = safe_range["x"]
            min_y, max_y = safe_range["y"]

            # Check if the keypoint is outside the safe range
            if not (min_x <= normalized_x <= max_x and min_y <= normalized_y <= max_y):
                # Calculate directional deviations
                if normalized_x < min_x:
                    x_direction = "right"
                    x_deviation = min_x - normalized_x
                elif normalized_x > max_x:
                    x_direction = "left"
                    x_deviation = normalized_x - max_x
                else:
                    x_direction = None
                    x_deviation = 0

                if normalized_y < min_y:
                    y_direction = "down"
                    y_deviation = min_y - normalized_y
                elif normalized_y > max_y:
                    y_direction = "up"
                    y_deviation = normalized_y - max_y
                else:
                    y_direction = None
                    y_deviation = 0

                # Generate feedback based on deviations
                if x_direction and y_direction:
                    feedback.append(
                        f"Move your {keypoint.body_part.name.lower()} {x_direction} by {x_deviation:.2f} and {y_direction} by {y_deviation:.2f}."
                    )
                elif x_direction:
                    feedback.append(
                        f"Move your {keypoint.body_part.name.lower()} {x_direction} by {x_deviation:.2f}."
                    )
                elif y_direction:
                    feedback.append(
                        f"Move your {keypoint.body_part.name.lower()} {y_direction} by {y_deviation:.2f}."
                    )
    return feedback

@app.route('/detect-pose', methods=['POST'])
def detect_pose():
    print("Received request at /detect-pose")  # Debug log

    if 'image' not in request.files:
        print("No image received in the request")  # Debug log
        return jsonify({"error": "No image received"}), 400

    file = request.files['image']
    print("Image file received successfully")  # Debug log

    try:
        # Read and preprocess the image
        image = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
        if image is None:
            print("Failed to decode image")  # Debug log
            return jsonify({"error": "Failed to decode image"}), 400

        input_size = 256
        resized_image = cv2.resize(image, (input_size, input_size))
        normalized_image = resized_image.astype(np.float32) / 255.0

        # Detect pose and get keypoints
        result = movenet.detect(normalized_image)
        person = result["person"]

        print("Detected Keypoints:")  # Debug log
        for keypoint in person.keypoints:
            print(f"{keypoint.body_part.name}: ({keypoint.coordinate.x:.2f}, {keypoint.coordinate.y:.2f})")

        # Generate feedback based on the safe ranges
        safe_ranges = SAFE_RANGES.get("Tree Pose", {})
        feedback = compare_pose(person.keypoints, CORRECT_POSES["Tree Pose"], safe_ranges)

        # Print feedback in the console
        print("Real-time Feedback:")
        for fb in feedback:
            print(fb)

        # Return the response
        response = {
            "keypoints": [{"x": kp.coordinate.x, "y": kp.coordinate.y} for kp in person.keypoints],
            "feedback": feedback
        }
        return jsonify(response)

    except Exception as e:
        print("Error processing image:", str(e))  # Debug log
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)