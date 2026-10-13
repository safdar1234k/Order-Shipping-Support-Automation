from pymongo import MongoClient
client = MongoClient('mongodb://localhost:27017/')
db = client['order_and_shipping_automation']
try:
    client.admin.command('ping')
    print("Successfully connected to MongoDB")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")

