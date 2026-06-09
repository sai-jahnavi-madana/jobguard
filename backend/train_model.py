"""Train TF-IDF model standalone."""
from app.ml.classifier import train_and_save

if __name__ == "__main__":
    train_and_save()
    print("Model saved to app/ml/model.joblib")
