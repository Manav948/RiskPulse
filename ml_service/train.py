"""
Training script to produce a small, synthetic dataset and fit the logistic regression.

This script is intentionally simple: it creates a reproducible toy dataset
that captures intuitive relationships for risk:
- fewer commits, fewer days to deadline, lower completion rate, and more open bugs
  increase the failure risk.

Run directly for offline training, or the FastAPI app will call training automatically
if no model artifacts are found.
"""
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from preprocessing import build_feature_frame, fit_scaler
from model import RiskModel


def synthesize(n=200, random_state=0):
    rng = np.random.RandomState(random_state)
    commits = rng.poisson(5, n)
    days = rng.randint(0, 30, n)
    completion = rng.beta(2, 2, n)  # between 0 and 1
    bugs = rng.poisson(3, n)

    df = pd.DataFrame({
        "commitsLast7Days": commits,
        "daysToDeadline": days,
        "taskCompletionRate": completion,
        "openBugs": bugs,
    })

    # Synthetic label: higher risk when commits low, days small, completion low, bugs high
    score = (
        -0.3 * df["commitsLast7Days"]
        - 0.05 * df["daysToDeadline"]
        - 2.0 * df["taskCompletionRate"]
        + 0.6 * df["openBugs"]
    )
    prob = 1 / (1 + np.exp(-score))
    y = (prob > 0.5).astype(int)
    return df, y


def train_and_persist():
    df, y = synthesize(1000)
    X = build_feature_frame(df.to_dict(orient="records"))
    scaler = fit_scaler(X)
    Xs = scaler.transform(X)

    model = RiskModel()
    model.fit(Xs, y)
    print("Training complete.")


if __name__ == "__main__":
    train_and_persist()
