# RiskPulse ML Service

This folder contains a FastAPI-based ML service that predicts project failure risk using logistic regression.

## Quick Start

### 1. Install Dependencies

```bash
# Using the venv in the parent directory
D:\riskpulse\.venv\Scripts\pip.exe install -r requirements.txt
```

### 2. Train Model (Optional)

The model is auto-trained on first API startup. To pre-train:

```bash
D:\riskpulse\.venv\Scripts\python.exe ml_service/train.py
```

This creates persisted artifacts under `ml_service/artifacts/`.

### 3. Run the API

```bash
# Set Python path and start uvicorn
$env:PYTHONPATH="D:\riskpulse\RiskPulse"
D:\riskpulse\.venv\Scripts\uvicorn.exe ml_service.main:app --host 0.0.0.0 --port 8000
```

The API will be available at `http://127.0.0.1:8000`.

## Example Request

**POST** `http://127.0.0.1:8000/predict-risk`

**Body (JSON):**
```json
{
  "projectId": "proj-123",
  "commitsLast7Days": 2,
  "daysToDeadline": 5,
  "taskCompletionRate": 0.4,
  "openBugs": 8
}
```

**Response:**
```json
{
  "failureRisk": 0.9999964320798372,
  "confidence": 0.9999964320798372,
  "topReasons": [
    "openBugs contributed 11.922",
    "commitsLast7Days contributed 3.585",
    "daysToDeadline contributed 1.828"
  ],
  "recommendations": [
    "Triage and address high-severity bugs first to reduce risk.",
    "Increase commit frequency and break work into smaller increments.",
    "Re-evaluate scope or negotiate deadline extension."
  ]
}
```

## Architecture

- **main.py** — FastAPI application with `/predict-risk` endpoint
- **model.py** — Logistic regression wrapper with load/save/explain
- **preprocessing.py** — Feature normalization and scaler persistence
- **schemas.py** — Pydantic request/response models
- **train.py** — Synthetic data generator and model trainer
- **artifacts/** — Persisted model (`model.joblib`) and scaler (`scaler.joblib`)

## Design Notes

- **Model:** Logistic Regression for interpretability; coefficients are feature importances
- **Features:** 5 numeric inputs + 1 derived feature (`workPressure`)
- **Explainability:** Feature contributions computed as `coef × scaled_value`
- **Persistence:** Model and scaler saved via `joblib` for fast inference

## Contract

Follows `contracts/risk.contract.json` with strict input/output validation via Pydantic.
