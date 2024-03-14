from flask_restful import Resource
from flask import request
from datetime import timedelta

key_template = 'user_id:{}'

def set_cache(key, value):
    rendered_key = key_template.format(key)
    redis_conn.hmset(rendered_key, value)
    redis_conn.expire(rendered_key, timedelta(minutes=1))

def get_cache(key):
    rendered_key = key_template.format(key)
    return redis_conn.hgetall(rendered_key)

def delete_cache(key):
    rendered_key = key_template.format(key)
    redis_conn.delete(rendered_key)

def fetch_user(user_id):
    cached_response = get_cache(user_id)
    if cached_response:
        return cached_response
    user = mongo_client.example.users.find_one({'user_id': user_id}, {'_id': 0})
    if user:
        set_cache(user_id, user)
    return user

def savings(income, expense):
    try:
        return income - expense
    except:
        return 0
class User(Resource):
    def get(self, user_id):
        user = fetch_user(user_id)
        if user:
            return {'success': True, 'user': user}, 200
        return {'success': False}, 404

    def post(self):
        user_request = request.get_json()
        user = fetch_user(user_request['user_id'])
        if user:
            return {'success': False}, 409
        user_request['savings'] = savings(user_request['income'], user_request['expense'])
        insert_result = mongo_client.example.users.insert_one(user_request)
        if insert_result.inserted_id:
            return {'success': True}, 201
        return {'success': False}, 400

from main import mongo_client, redis_conn