from pymongo import MongoClient
from gridfs import GridFS
from flask_pymongo import PyMongo
from bson import ObjectId

class Database(object):
    URI = 'mongodb://127.0.0.1:27017'
    DATABASE = None

    @staticmethod
    def initialize(app):
        # mongo = PyMongo(app)
        client = MongoClient(Database.URI)
        Database.DATABASE = client['trello']
        # Database.DATABASE = mongo.db
        FS.DATABASE = GridFS(Database.DATABASE)
        # FS.DATABASE = GridFS(Database.DATABASE)
        

    @staticmethod
    def insert(collection, data):
        cursorId = Database.DATABASE[collection].insert(data)
        return cursorId 
    
    @staticmethod
    def find(collection, query):
        cursors = Database.DATABASE[collection].find(query)
        return cursors
    
    @staticmethod
    def find_one(collection, query):
        cursor = Database.DATABASE[collection].find_one(query)
        return cursor
    
    @staticmethod
    def delete_one(collection, data):
        return Database.DATABASE[collection].delete_one(data)

    @staticmethod
    def update_one(collection, query, newData):
        return Database.DATABASE[collection].update_one(query, {"$set": newData})
        
    @staticmethod
    def delete_one_from_array(collection, query, data):
        return Database.DATABASE[collection].update_one(query, {"$pull": data})
        
    @staticmethod
    def update_push(collection, query, newData):
        return Database.DATABASE[collection].update(query, {"$push": newData})



class FS(object):
    DATABASE = None

    @staticmethod
    def put(file, content_type, file_name):
        fieldId = FS.DATABASE.put(file, content_type=content_type, filename=file_name)
        return str(fieldId)
    
    @staticmethod
    def get(fileId):
        objectId = ObjectId(fileId)
        return FS.DATABASE.get(objectId)

    @staticmethod
    def delete(fileId):
        objectId = ObjectId(fileId)
        if FS.DATABASE.exists(objectId):
            FS.DATABASE.delete(objectId)
            return True
        else:
            return False