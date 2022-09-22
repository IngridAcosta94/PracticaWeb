from flask.json import jsonify
from flask.wrappers import Response
import jwt
from werkzeug.wrappers import Request, response

class Middleware:
    key = '12345'
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        # not Flask request - from werkzeug.wrappers import Request
        request = Request(environ)
        token = request.headers.get('Authorization')
        
        if request.path == '/api/login/authenticate':
            return self.app(environ, start_response)
        if request.path == '/api/users/register':
            return self.app(environ, start_response)
        print('path: %s, url: %s' % (request.path, request.url))
        if token is None:
            res = Response (response= 'Unauthorized', status= 401, mimetype='application/json')
            return res(environ, start_response) 
        try:
            user = jwt.decode(token, self.key, algorithms=["HS256"])
        except:
            res = Response (response= 'Unauthorized', status= 401, mimetype='application/json')
            return res(environ, start_response) 
        # just do here everything what you need
        return self.app(environ, start_response)