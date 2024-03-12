from flask_restful import Resource
from flask import request

users = []

class User(Resource):
    def get(self, user_id):
        query_result = list(filter(lambda user: user['user_id'] == user_id, users))
        user = query_result and query_result[0]
        if user:
            return {'success': True, 'user': user}, 200
        return {'success': False}, 404

    def post(self):
        user_request = request.get_json()
        query_result = list(filter(lambda user: user['user_id'] == user_request['user_id'], users))
        user = query_result and query_result[0]
        if user:
            return {'success': False}, 400
        users.append(user_request)
        return {'success': True}, 201
