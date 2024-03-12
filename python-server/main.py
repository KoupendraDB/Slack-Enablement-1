from flask import Flask
from flask_restful import Api
from resources.user import User
# from pymongo.mongo_client import MongoClient
# from pymongo.server_api import ServerApi
# import os

# # Connecting to mongo db
# mongo_db_username = os.environ['mongo_db_username']
# mongo_db_password = os.environ['mongo_db_password']
# uri = "mongodb+srv://{0}:{1}@cluster0.nff3sst.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0".format(mongo_db_username, mongo_db_password)
# # Create a new client and connect to the server
# client = MongoClient(uri, server_api=ServerApi('1'))
# # Send a ping to confirm a successful connection
# try:
# 	client.admin.command('ping')
# 	print("Pinged your deployment. You successfully connected to MongoDB!")
# except Exception as e:
# 	print(e)


app = Flask(__name__)
api = Api(app)

api.add_resource(User, '/user', '/user/<int:user_id>', endpoint = 'user')

if __name__ == '__main__':
	app.run(debug=True)