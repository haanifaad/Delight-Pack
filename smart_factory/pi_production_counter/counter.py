import time
import requests
import json
import RPi.GPIO as GPIO

# Configuration
SENSOR_PIN = 17 # GPIO pin connected to optical sensor
API_ENDPOINT = "https://your-backend-api.com/ingest/production"
AUTH_TOKEN = "your_iot_device_token"
BATCH_INTERVAL = 60 # seconds

# State
box_count = 0
last_detection_time = 0
DEBOUNCE_TIME = 0.2 # 200ms debounce

def setup():
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(SENSOR_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)
    GPIO.add_event_detect(SENSOR_PIN, GPIO.FALLING, callback=sensor_callback)
    print("Optical sensor initialized. Waiting for boxes...")

def sensor_callback(channel):
    global box_count, last_detection_time
    current_time = time.time()
    
    # Strict debounce logic to prevent double-counting
    if (current_time - last_detection_time) > DEBOUNCE_TIME:
        box_count += 1
        last_detection_time = current_time
        print(f"Box detected! Count: {box_count}")

def send_batch():
    global box_count
    if box_count == 0:
        return
        
    payload = {
        "machine_id": "MCH-002",
        "box_count": box_count,
        "timestamp": int(time.time() * 1000)
    }
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {AUTH_TOKEN}"
    }
    
    try:
        response = requests.post(API_ENDPOINT, json=payload, headers=headers, timeout=10)
        if response.status_code == 200:
            print(f"Successfully sent batch of {box_count} boxes.")
            box_count = 0 # Reset count after successful send
        else:
            print(f"Failed to send data. Status: {response.status_code}")
    except Exception as e:
        print(f"Error sending data: {e}")

if __name__ == "__main__":
    try:
        setup()
        last_send_time = time.time()
        
        while True:
            time.sleep(1)
            current_time = time.time()
            if (current_time - last_send_time) >= BATCH_INTERVAL:
                send_batch()
                last_send_time = current_time
                
    except KeyboardInterrupt:
        print("Stopping script...")
    finally:
        GPIO.cleanup()
