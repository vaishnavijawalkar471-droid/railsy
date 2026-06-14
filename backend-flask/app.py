import os
import time
import random
import json
import threading
from flask import Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "railsy-secret-key")
CORS(app, resources={r"/api/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

# ── Mock Data ──────────────────────────────────────────────────────────────

TRAIN_STATUS = {
    "trainId": "TR-4481",
    "speed": 94,
    "fuelLevel": 71,
    "brakeStatus": "NORMAL",
    "engineHealth": 93,
    "trackCondition": "GOOD",
    "driverStatus": "ACTIVE",
}

ALERTS = [
    {"id": "1", "timestamp": "12:42:31", "trainId": "TR-4481", "priority": "critical", "description": "Track anomaly detected 1.2km ahead."},
    {"id": "2", "timestamp": "12:44:10", "trainId": "TR-2291", "priority": "warning",  "description": "Reduced visibility due to weather."},
    {"id": "3", "timestamp": "12:46:00", "trainId": "TR-4481", "priority": "info",     "description": "Signal junction 7A cleared."},
    {"id": "4", "timestamp": "12:50:12", "trainId": "TR-9088", "priority": "critical", "description": "Sensor failure — Engine bay 3."},
]

COLLISION_RISK = {
    "trainId": "TR-2291",
    "riskScore": 18,
    "distanceMeters": 1300,
    "closingSpeed": 42,
    "timeToImpact": 540,
    "threatLevel": "LOW",
    "recommendedAction": "Maintain Current Speed",
    "confidence": 87,
}

FLEET_TRAINS = [
    {"trainId": "TR-4481", "routeId": "RT-12", "latitude": 18.52, "longitude": 73.85, "speed": 94,  "status": "ACTIVE",      "healthScore": 93, "fuelLevel": 71, "delayMinutes": 0},
    {"trainId": "TR-2291", "routeId": "RT-07", "latitude": 18.62, "longitude": 73.90, "speed": 76,  "status": "ACTIVE",      "healthScore": 88, "fuelLevel": 58, "delayMinutes": 4},
    {"trainId": "TR-9088", "routeId": "RT-03", "latitude": 19.10, "longitude": 72.85, "speed": 0,   "status": "MAINTENANCE", "healthScore": 62, "fuelLevel": 40, "delayMinutes": 20},
    {"trainId": "TR-3301", "routeId": "RT-15", "latitude": 18.30, "longitude": 74.20, "speed": 110, "status": "ACTIVE",      "healthScore": 97, "fuelLevel": 85, "delayMinutes": 0},
    {"trainId": "TR-5566", "routeId": "RT-09", "latitude": 17.90, "longitude": 73.50, "speed": 0,   "status": "EMERGENCY",   "healthScore": 45, "fuelLevel": 22, "delayMinutes": 35},
]

FLEET_SUMMARY = {
    "totalTrains": 128,
    "activeTrains": 98,
    "emergencyTrains": 2,
    "maintenanceTrains": 12,
    "averageHealth": 91,
}

MAP_TRAINS = [
    {"trainId": "TR-4481", "latitude": 18.5204, "longitude": 73.8567, "heading": 45, "speed": 94},
    {"trainId": "TR-2291", "latitude": 18.62, "longitude": 73.90, "heading": 180, "speed": 76},
]

SIGNALS = [
    {"id": "SIG-1", "latitude": 18.58, "longitude": 73.88, "status": "green"},
    {"id": "SIG-2", "latitude": 18.43, "longitude": 73.82, "status": "yellow"},
]

TRACK_ANOMALIES = [
    {"id": "track-crack-alert",  "label": "Track Cracks",     "value": "2",           "color": "text-red-600 dark:text-red-400"},
    {"id": "misalignment-alert", "label": "Misalignment",     "value": "1 section",  "color": "text-saffron-d dark:text-saffron"},
    {"id": "obstacle-alert",     "label": "Obstacles",        "value": "Clear",      "color": "text-igreen-d dark:text-green-400"},
    {"id": "animal-alert",       "label": "Animal Intrusion", "value": "3 sightings","color": "text-saffron-d dark:text-saffron"},
    {"id": "human-alert",        "label": "Human Intrusion",  "value": "1 report",   "color": "text-red-600 dark:text-red-400"},
]

TELEMETRY = {
    "speed": 94,
    "targetSpeed": 100,
    "safeSpeed": 120,
    "engineTemperature": 82,
    "batteryHealth": 95,
    "fuelLevel": 71,
    "brakePressure": 84,
    "wheelHealth": 91,
    "vibrationLevel": 12,
    "timestamp": "12:00:00",
}

AI_DECISIONS = [
    {
        "id": "ai-1",
        "type": "SPEED_ADJUSTMENT",
        "trainId": "TR-4481",
        "confidence": 92,
        "riskReduction": 35,
        "recommendedValue": 85,
        "reasoning": "Reduce speed by 9 km/h to optimize fuel efficiency and maintain safe braking distance.",
        "status": "PENDING",
    },
    {
        "id": "ai-2",
        "type": "MAINTENANCE_ALERT",
        "trainId": "TR-9088",
        "confidence": 88,
        "riskReduction": 60,
        "reasoning": "Predictive maintenance recommended for engine bay 3 sensor replacement within 48 hours.",
        "status": "APPROVED",
    },
]

# ── REST API Endpoints ─────────────────────────────────────────────────────

@app.route("/api/train/status", methods=["GET"])
def get_train_status():
    return jsonify(TRAIN_STATUS)

@app.route("/api/train/telemetry", methods=["GET"])
def get_telemetry():
    return jsonify(TELEMETRY)

@app.route("/api/collision", methods=["GET"])
def get_collision():
    return jsonify(COLLISION_RISK)

@app.route("/api/alerts", methods=["GET"])
def get_alerts():
    return jsonify(ALERTS)

@app.route("/api/fleet/trains", methods=["GET"])
def get_fleet_trains():
    return jsonify(FLEET_TRAINS)

@app.route("/api/fleet/summary", methods=["GET"])
def get_fleet_summary():
    return jsonify(FLEET_SUMMARY)

@app.route("/api/map/trains", methods=["GET"])
def get_map_trains():
    return jsonify(MAP_TRAINS)

@app.route("/api/map/signals", methods=["GET"])
def get_signals():
    return jsonify(SIGNALS)

@app.route("/api/track/anomalies", methods=["GET"])
def get_track_anomalies():
    return jsonify(TRACK_ANOMALIES)

@app.route("/api/ai/decisions", methods=["GET"])
def get_ai_decisions():
    return jsonify(AI_DECISIONS)

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "service": "railsy-flask-backend"})

# ── WebSocket Events ───────────────────────────────────────────────────────

@socketio.on("connect")
def handle_connect():
    print(f"Client connected")
    emit("connected", {"message": "Connected to Railsy WebSocket"})

@socketio.on("disconnect")
def handle_disconnect():
    print(f"Client disconnected")

# ── Background data broadcaster ────────────────────────────────────────────

def broadcast_data():
    """Periodically broadcast real-time updates to all connected clients."""
    while True:
        time.sleep(5)
        # Simulate small variations in train data
        TRAIN_STATUS["speed"] = max(0, min(200, TRAIN_STATUS["speed"] + random.randint(-3, 3)))
        TRAIN_STATUS["fuelLevel"] = max(0, min(100, TRAIN_STATUS["fuelLevel"] - random.randint(0, 1)))
        TELEMETRY["speed"] = TRAIN_STATUS["speed"]
        TELEMETRY["fuelLevel"] = TRAIN_STATUS["fuelLevel"]
        TELEMETRY["engineTemperature"] = max(60, min(120, TELEMETRY["engineTemperature"] + random.randint(-2, 2)))
        TELEMETRY["timestamp"] = time.strftime("%H:%M:%S")

        # Update collision risk slightly
        COLLISION_RISK["riskScore"] = max(0, min(100, COLLISION_RISK["riskScore"] + random.randint(-2, 2)))
        COLLISION_RISK["distanceMeters"] = max(100, COLLISION_RISK["distanceMeters"] + random.randint(-20, 20))
        COLLISION_RISK["timeToImpact"] = max(30, COLLISION_RISK["timeToImpact"] + random.randint(-5, 5))

        # Update map train positions slightly
        for t in MAP_TRAINS:
            t["latitude"] += random.uniform(-0.002, 0.002)
            t["longitude"] += random.uniform(-0.002, 0.002)
            t["speed"] = max(0, min(200, t["speed"] + random.randint(-2, 2)))

        # Broadcast to all connected WebSocket clients
        socketio.emit("update", {
            "trainStatus": TRAIN_STATUS,
            "telemetry": TELEMETRY,
            "collisionRisk": COLLISION_RISK,
            "mapTrains": MAP_TRAINS,
            "alerts": ALERTS,
            "fleetTrains": FLEET_TRAINS,
            "fleetSummary": FLEET_SUMMARY,
        })

# Start broadcaster in background thread
thread = threading.Thread(target=broadcast_data, daemon=True)
thread.start()

# ── Main ────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    print(f"Railsy Flask Backend running on http://localhost:{port}")
    socketio.run(app, host="0.0.0.0", port=port, debug=True, allow_unsafe_werkzeug=True)