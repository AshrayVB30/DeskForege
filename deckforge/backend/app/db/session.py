import dns.resolver
import certifi

dns.resolver.default_resolver = dns.resolver.Resolver(configure=False)
dns.resolver.default_resolver.nameservers = ['8.8.8.8', '8.8.4.4', '1.1.1.1']

from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

client: AsyncIOMotorClient = None

async def get_db():
    global client
    if client is None:
        # Use certifi's CA bundle — Conda ships outdated OpenSSL certs that
        # MongoDB Atlas rejects with TLSV1_ALERT_INTERNAL_ERROR.
        client = AsyncIOMotorClient(
            settings.DATABASE_URL,
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=30000,
            connectTimeoutMS=30000,
            socketTimeoutMS=30000,
        )
    db = client.get_database('deckforge')
    return db
