"""
Model wrapper providing training, prediction and simple explanation hooks.

Design choices:
- Use `sklearn.linear_model.LogisticRegression` for explainability (coefficients).
- Persist model and scaler with `joblib` under `artifacts/`.
"""
from sklearn.linear_model import LogisticRegression
import joblib
from pathlib import Path
import numpy as np
from typing import List


ARTIFACT_DIR = Path(__file__).parent / "artifacts"
MODEL_PATH = ARTIFACT_DIR / "model.joblib"


class RiskModel:
    def __init__(self, model: LogisticRegression = None):
        self.model = model

    def fit(self, X, y):
        self.model = LogisticRegression(solver="liblinear")
        self.model.fit(X, y)
        ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
        joblib.dump(self.model, MODEL_PATH)

    def predict_proba(self, X) -> np.ndarray:
        return self.model.predict_proba(X)

    def predict(self, X) -> np.ndarray:
        return self.model.predict(X)

    def explain(self, feature_names: List[str], top_k: int = 2) -> List[str]:
        """Return top_k feature importance descriptions sorted by absolute coefficient."""
        coefs = np.array(self.model.coef_).flatten()
        idx = np.argsort(np.abs(coefs))[::-1][:top_k]
        reasons = []
        for i in idx:
            fn = feature_names[i]
            coef = coefs[i]
            reasons.append(f"{fn} (weight {coef:.3f})")
        return reasons

    @classmethod
    def load(cls):
        if MODEL_PATH.exists():
            model = joblib.load(MODEL_PATH)
            return cls(model)
        return None
