from datetime import datetime, timedelta, timezone
import jwt
from flask.wrappers import Response
from werkzeug.wrappers import response
from controllers.base.ControllerBase import ControllerBase
from flask import Blueprint, json, request, jsonify

from domains.User import User

class UserController(ControllerBase):
    key = '12345'
    def clazz(self):
        return User

    @property
    def name(self):
        return 'users'

    def __init__(self):
        
        self.blueprint = Blueprint("User", __name__)
        ControllerBase.__init__(self)
        self.blueprint.add_url_rule(self.root + '/<id>', self.root + '/<id>/update' ,self.update, methods = ['PUT'])
        self.blueprint.add_url_rule('/api/login/authenticate', 'authenticate', self.login, methods = ['POST'])
        self.blueprint.add_url_rule('/api/users/register', 'register', self.register, methods = ['POST'])
        pass

    def update(self, id: str):
        json = request.get_json()
        print(json)
        doc = User(**json)
        q = self.service.update(id,doc)
        return jsonify(q.as_dict())
    def register(self):
        json = request.get_json()
        doc = User(**json)
        q = self.service.add(doc)
        return jsonify(q.as_dict())
    def Merge(self, dict1, dict2):
        res = {**dict1, **dict2}
        return res
    def login(self):
        json = request.get_json()
        if json.get('email') is None and json.get('password') is None:
            return Response(response = 'Unauthorized', status = 401)
        
        print(json)
        doc  = User()
        r = self.service.list(self.clazz(), json)
        
        #Get token if True
        if r['entities'] is None or len(r['entities'])==0:
            return Response(response = 'Unauthorized', status = 401)
        user = r['entities'][0]
        
        token = jwt.encode(self.Merge({ "exp": datetime.now(tz=timezone.utc) + timedelta(seconds=30) }, user.as_dict()), self.key, algorithm="HS256" )

        return jsonify({'token': token, 'user': r['entities'][0].as_dict()})
    
    