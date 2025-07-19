from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


load_dotenv()

MONGODB_URL = os.environ["MONGODB_URL"]
DATABASE_NAME = os.environ["DATABASE_NAME"]
COLLECTION_NAME = os.environ["COLLECTION_NAME"]

logger.info(f"Connecting to MongoDB at: {MONGODB_URL}")
logger.info(f"Database: {DATABASE_NAME}")
logger.info(f"Collection: {COLLECTION_NAME}")

try:
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]
    tasks_collection = db[COLLECTION_NAME]
    logger.info("Database connection established successfully")
except Exception as e:
    logger.error(f"Failed to connect to database: {e}")
    raise 