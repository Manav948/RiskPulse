# RiskPulse ML Service

This folder contains a small FastAPI-based ML service that predicts project failure risk.

Quick start

1. Create a Python environment and install dependencies:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

2. Train model (optional — the API will auto-train on startup if artifacts are missing):

```bash
python train.py
```

3. Run the API locally:

```bash
uvicorn main:app --reload --port 8000
```

Example request

POST http://localhost:8000/predict-risk

Body (JSON):

```json
{
  "projectId": "proj-123",
  "commitsLast7Days": 2,
  "daysToDeadline": 5,
  "taskCompletionRate": 0.4,
  "openBugs": 8
}
```

Response follows the contract in `contracts/risk.contract.json` with `failureRisk`, `confidence`, `topReasons`, and `recommendations`.

Notes

- The model is intentionally simple (logistic regression) to favour explainability.
- Artifacts are persisted to `ml_service/artifacts/`.
