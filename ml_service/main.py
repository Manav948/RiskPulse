"""
FastAPI application exposing POST /predict-risk.

Behavior:
- On startup, attempt to load persisted model and scaler.
- If missing, run `train.train_and_persist()` to create artifacts.
- Endpoint accepts a single JSON body matching the `contracts/risk.contract.json` input.
- Response follows the contract and includes explainability via feature contributions.
"""
from fastapi import FastAPI, HTTPException
from typing import List
import numpy as np
import sys
from pathlib import Path

# Ensure ml_service is in path for imports
sys_path = str(Path(__file__).parent)
if sys_path not in sys.path:
    sys.path.insert(0, sys_path)

from schemas import RiskInput, RiskOutput
from preprocessing import build_feature_frame, load_scaler, scale_features
from model import RiskModel
from train import train_and_persist


app = FastAPI(title="RiskPulse ML Service")


def ensure_model():
    model = RiskModel.load()
    scaler = load_scaler()
    if model is None or scaler is None:
        # Train and persist a model if artifacts are missing
        train_and_persist()
        model = RiskModel.load()
        scaler = load_scaler()
    return model, scaler


@app.on_event("startup")
def startup_event():
    ensure_model()


def map_reasons_to_recs(reason_keys: List[str]) -> List[str]:
    mapping = {
        "commitsLast7Days": "Increase commit frequency and break work into smaller increments.",
        "daysToDeadline": "Re-evaluate scope or negotiate deadline extension.",
        "taskCompletionRate": "Improve prioritization and unblock bottlenecks to raise completion rate.",
        "openBugs": "Triage and address high-severity bugs first to reduce risk.",
        "workPressure": "Reduce work-in-progress and stabilize the backlog.",
    }
    return [mapping.get(k, "Investigate this factor further.") for k in reason_keys]


@app.post("/predict-risk", response_model=RiskOutput)
def predict_risk(payload: RiskInput):
    model, scaler = ensure_model()
    # Build feature frame (we only use numeric features)
    frame = build_feature_frame([payload.dict()])
    Xs = scale_features(frame, scaler)

    try:
        proba = model.predict_proba(Xs)[0, 1]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model error: {e}")

    # Confidence: how sure the model is (max class probability)
    raw_probs = model.predict_proba(Xs)[0]
    confidence = float(max(raw_probs))

    # Explainability: contribution = coef * standardized_feature_value
    coefs = model.model.coef_.flatten()
    contributions = (coefs * Xs.flatten())
    feature_names = ["commitsLast7Days", "daysToDeadline", "taskCompletionRate", "openBugs", "workPressure"]

    # Pick top positive contributors to predicted failure risk
    contrib_idx = contributions.argsort()[::-1]
    top_keys = []
    top_reasons = []
    for idx in contrib_idx:
        if contributions[idx] <= 0:
            continue
        top_keys.append(feature_names[idx])
        top_reasons.append(f"{feature_names[idx]} contributed {contributions[idx]:.3f}")
        if len(top_keys) >= 3:
            break

    # If no positive contributors, show top absolute contributors
    if not top_reasons:
        idx = np.argsort(np.abs(contributions))[::-1][:3]
        top_reasons = [f"{feature_names[i]} (importance {contributions[i]:.3f})" for i in idx]
        top_keys = [feature_names[i] for i in idx]

    recommendations = map_reasons_to_recs(top_keys)

    return RiskOutput(
        failureRisk=float(proba),
        confidence=confidence,
        topReasons=top_reasons,
        recommendations=recommendations,
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
