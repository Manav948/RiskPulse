"""
Simple preprocessing utilities.

Decisions:
- Keep feature engineering minimal and explainable: use raw numeric features
  plus a derived `workPressure` = openBugs / max(1, taskCompletionRate) to capture bug burden.
- Use sklearn's StandardScaler to normalize features for the logistic regression.
"""
from typing import List
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
import joblib
from pathlib import Path


SCALER_PATH = Path(__file__).parent / "artifacts" / "scaler.joblib"


def build_feature_frame(inputs: List[dict]) -> pd.DataFrame:
    df = pd.DataFrame(inputs)
    # Derived feature: bug burden relative to completion rate
    df["workPressure"] = df.apply(
        lambda r: r.get("openBugs", 0) / max(0.01, r.get("taskCompletionRate", 0.0)),
        axis=1,
    )
    # Keep only numeric columns used by the model
    cols = ["commitsLast7Days", "daysToDeadline", "taskCompletionRate", "openBugs", "workPressure"]
    return df[cols]


def fit_scaler(X: pd.DataFrame) -> StandardScaler:
    scaler = StandardScaler()
    scaler.fit(X)
    SCALER_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(scaler, SCALER_PATH)
    return scaler


def load_scaler() -> StandardScaler:
    if SCALER_PATH.exists():
        return joblib.load(SCALER_PATH)
    return None


def scale_features(X: pd.DataFrame, scaler: StandardScaler) -> np.ndarray:
    if scaler is None:
        # No scaler available — return raw values (model code will fit on startup if needed)
        return X.values
    return scaler.transform(X)
