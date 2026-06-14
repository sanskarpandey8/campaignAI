import { useState } from "react";
import API from "../services/api";

const SubjectGenerator = () => {
  const [goal, setGoal] = useState("");
  const [audience, setAudience] = useState("");
  const [subjects, setSubjects] = useState([]);

  const generateSubjects = async () => {
    try {
      const response = await API.post(
        "/subjects/generate",
        {
          campaignGoal: goal,
          audience,
        }
      );

      setSubjects(response.data.subjects);
    } catch (error) {
      console.error(error);
      alert("Failed to generate subjects");
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border">
      <h2 className="text-2xl font-bold mb-4">
         AI Subject Generator
      </h2>

      <input
        className="w-full border rounded-xl p-3 mb-3"
        placeholder="Campaign Goal"
        value={goal}
        onChange={(e) =>
          setGoal(e.target.value)
        }
      />

      <input
        className="w-full border rounded-xl p-3 mb-3"
        placeholder="Audience"
        value={audience}
        onChange={(e) =>
          setAudience(e.target.value)
        }
      />

      <button
        onClick={generateSubjects}
        className="
          bg-blue-600
          text-white
          px-5 py-3
          rounded-xl
          hover:bg-blue-700
        "
      >
        Generate 
      </button>

      <div className="mt-6 space-y-3">
        {subjects.map(
          (subject, index) => (
            <div
              key={index}
              className="
                p-3
                border
                rounded-xl
                bg-gray-50
              "
            >
              {subject}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SubjectGenerator;