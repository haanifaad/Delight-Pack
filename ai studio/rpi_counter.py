import RPi.GPIO as GPIO
import time
import requests
import json

SENSOR_PIN = 17 # Data pin connected to the IR optical sensor
API_ENDPOINT = "https://your-api.com/api/counter"
AUTH_TOKEN = "your-auth-token"
MACHINE_ID = "MACHINE_003" # Conveyor Main

# Global state
box_count = 0
last_detection_time = 0
DEBOUNCE_TIME = 0.5  # 500ms debounce to prevent double counting a single box

def sensor_callback(channel):
    global box_count, last_detection_time
    current_time = time.time()
    
    # Strict debounce check
    if (current_time - last_detection_time) > DEBOUNCE_TIME:
        box_count += 1
        last_detection_time = current_time
        print(f"Box detected! Local counter: {box_count}")

# GPIO Setup
GPIO.setmode(GPIO.BCM)
GPIO.setup(SENSOR_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)

# Attach interrupt to falling edge (sensor triggers low when beam is broken)
GPIO.add_event_detect(SENSOR_PIN, GPIO.FALLING, callback=sensor_callback)

def send_batch():
    global box_count
    if box_count > 0:
        # Snapshot the count to send and reset local counter
        count_to_send = box_count
        box_count = 0 
        
        payload = {
            "machine_id": MACHINE_ID,
            "box_count": count_to_send,
            "timestamp": int(time.time() * 1000)
        }
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {AUTH_TOKEN}"
        }
        
        try:
            print(f"Sending batch: {payload}")
            response = requests.post(API_ENDPOINT, json=payload, headers=headers, timeout=5)
            response.raise_for_status()
            print("Batch sent successfully.")
        except Exception as e:
            print(f"Error sending data: {e}")
            # Revert count if failed to ensure no data loss
            box_count += count_to_send

try:
    print("Starting production counter...")
    while True:
        # Wait 60 seconds before sending the next batch
        time.sleep(60) 
        send_batch()
except KeyboardInterrupt:
    print("Exiting...")
finally:
    GPIO.cleanup()
