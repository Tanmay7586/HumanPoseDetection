import React from "react";
import { useNavigate } from "react-router-dom";
import "./YogaPoses.css";

const YogaPoses = () => {
  const navigate = useNavigate();

  // Data for yoga poses
  const poses = [
    {
      name: "Bhujangasana",
      description:
        "Cobra Pose, or Bhujangasana, opens the heart and stretches the chest while strengthening the spine.",
      image: "https://via.placeholder.com/300x200",
      advantages: [
        "Strengthens the spine",
        "Opens up the chest and lungs",
        "Improves circulation",
      ],
      steps: [
        "Lie face down with your legs straight and feet hip-width apart.",
        "Place your hands under your shoulders.",
        "Gently lift your chest off the ground while keeping your pelvis down.",
        "Hold for a few breaths, then lower back down.",
      ],
    },
    {
      name: "Utkatasana",
      description:
        "Also known as Chair Pose, Utkatasana engages the core and strengthens the legs while promoting good posture.",
      image: "https://via.placeholder.com/300x200",
      advantages: [
        "Strengthens the legs and core",
        "Improves balance and posture",
        "Stimulates the heart and diaphragm",
      ],
      steps: [
        "Stand with your feet together and arms at your sides.",
        "Bend your knees and lower your hips as if sitting in a chair.",
        "Raise your arms overhead, keeping your shoulders relaxed.",
        "Hold for a few breaths, then return to standing.",
      ],
    },
    {
      name: "Adho Mukha Svanasana",
      description:
        "Commonly known as Downward-Facing Dog, this pose rejuvenates the body by stretching the spine and hamstrings.",
      image: "https://via.placeholder.com/300x200",
      advantages: [
        "Stretches the spine and hamstrings",
        "Strengthens the arms and shoulders",
        "Calms the mind and relieves stress",
      ],
      steps: [
        "Start on your hands and knees, with your wrists under your shoulders and knees under your hips.",
        "Lift your hips up and back, straightening your legs and forming an inverted V shape.",
        "Spread your fingers wide and press firmly into the ground.",
        "Hold for a few breaths, then return to the starting position.",
      ],
    },
    {
      name: "Virabhadrasana",
      description:
        "Warrior Pose strengthens the legs, opens the hips, and improves focus and balance.",
      image: "https://via.placeholder.com/300x200",
      advantages: [
        "Strengthens the legs and arms",
        "Opens the hips and chest",
        "Improves focus and balance",
      ],
      steps: [
        "Stand with your feet about 4 feet apart, turning your right foot out 90 degrees and your left foot slightly inward.",
        "Bend your right knee, keeping it directly over your ankle.",
        "Extend your arms out to the sides at shoulder height.",
        "Hold for a few breaths, then switch sides.",
      ],
    },
    {
      name: "Trikonasana",
      description:
        "Triangle Pose stretches the legs, torso, and spine while improving balance and stability.",
      image: "https://via.placeholder.com/300x200",
      advantages: [
        "Stretches the legs, hips, and spine",
        "Improves balance and stability",
        "Stimulates the abdominal organs",
      ],
      steps: [
        "Stand with your feet about 3-4 feet apart, turning your right foot out 90 degrees and your left foot slightly inward.",
        "Extend your arms out to the sides at shoulder height.",
        "Bend at the hips, reaching your right hand toward your right foot.",
        "Hold for a few breaths, then switch sides.",
      ],
    },
    {
      name: "Balasana",
      description:
        "Child's Pose is a resting pose that gently stretches the hips, thighs, and ankles.",
      image: "https://via.placeholder.com/300x200",
      advantages: [
        "Relaxes the body and mind",
        "Stretches the hips, thighs, and ankles",
        "Relieves back and neck pain",
      ],
      steps: [
        "Kneel on the floor, touching your big toes together and sitting on your heels.",
        "Separate your knees about hip-width apart.",
        "Bend forward, extending your arms in front of you and resting your forehead on the ground.",
        "Hold for a few breaths.",
      ],
    },
    {
      name: "Sarvangasana",
      description:
        "Shoulder Stand improves circulation, strengthens the shoulders, and calms the mind.",
      image: "https://via.placeholder.com/300x200",
      advantages: [
        "Improves circulation",
        "Strengthens the shoulders and arms",
        "Calms the mind and reduces stress",
      ],
      steps: [
        "Lie on your back with your arms at your sides.",
        "Lift your legs and hips off the ground, supporting your lower back with your hands.",
        "Straighten your legs upward, keeping your body in a straight line.",
        "Hold for a few breaths, then slowly lower back down.",
      ],
    },
  ];

  // Handle "Try Yoga" button click
  const handleTryYogaClick = (pose) => {
    navigate(`/pose/${pose.name}`, { state: { pose } });
  };

  return (
    <div className="yoga-poses-container">
      <h1>Yoga Poses</h1>
      <div className="poses-grid">
        {poses.map((pose, index) => (
          <div key={index} className="pose-card">
            <div className="pose-image">
              <img src={pose.image} alt={pose.name} />
            </div>
            <h2>{pose.name}</h2>
            <p>{pose.description}</p>
            <button
              className="try-yoga-button"
              onClick={() => handleTryYogaClick(pose)}
            >
              Try Yoga
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YogaPoses;
