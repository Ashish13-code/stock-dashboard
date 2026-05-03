import numpy as np
import random
import os
from sklearn.preprocessing import MinMaxScaler


class LSTMPredictor:
    def __init__(self, model_path="models/saved_model/lstm_weights.h5"):
        self.model = None
        self.scaler = MinMaxScaler()

        if os.path.exists(model_path):
            try:
                from tensorflow.keras.models import load_model
                self.model = load_model(model_path)
                print("LSTM model loaded successfully")
            except Exception as e:
                print(f"Could not load model: {e}")
                self.model = None
        else:
            print("No trained model found — using dummy predictions")

    def predict(self, close_prices: list) -> float:
        if self.model is None:
            last_price = close_prices[-1]
            dummy = last_price * random.uniform(0.98, 1.02)
            return round(float(dummy), 2)

        try:
            prices = np.array(close_prices).reshape(-1, 1)
            scaled = self.scaler.fit_transform(prices)

            X = scaled[-60:].reshape(1, 60, 1)
            prediction_scaled = self.model.predict(X)
            prediction = self.scaler.inverse_transform(prediction_scaled)
            return round(float(prediction[0][0]), 2)
        except Exception as e:
            print(f"Prediction error: {e}")
            last_price = close_prices[-1]
            return round(float(last_price * random.uniform(0.98, 1.02)), 2)

    def is_trained(self) -> bool:
        return self.model is not None


predictor = LSTMPredictor()