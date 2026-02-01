import axios from "axios";

export async function predictRisk(input: {
  projectId?: string;
  commitsLast7Days: number;
  deadlineDays: number;
  taskCompletionRate: number;
  openBugs: number;
}) {
  try {
    const response = await axios.post("http://127.0.0.1:8000/predict-risk", input);
    return response.data;
  } catch (error) {
    console.error("ML service error:", error);
    // Fallback to mock
    return {
      failureRisk: 0.74,
      confidence: 0.88,
      topReasons: [
        "Low commit activity",
        "Deadline approaching"
      ],
      recommendations: [
        "Increase commit frequency",
        "Begin testing phase"
      ],
    };
  }
}
