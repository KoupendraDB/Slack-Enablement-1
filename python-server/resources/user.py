from flask_restful import Resource
from flask import request

def savings(income, expense):
    try:
        return income - expense
    except:
        return 0

class User(Resource):
    def get(self, user_id):
        user = mongo_client.db.users.find_one({'user_id': user_id}, {'_id': 0})
        print(user)
        if user:
            return {'success': True, 'user': user}, 200
        return {'success': False}, 404

    def post(self):
        user_request = request.get_json()
        user = mongo_client.db.users.find_one({'user_id': user_request['user_id']})
        if user:
            return {'success': False}, 409
        user_request['savings'] = savings(user_request['income'], user_request['expense'])
        mongo_client.db.users.insert_one(user_request)
        return {'success': True}, 201

from main import mongo_client