
from controllers.base.ControllerBase import ControllerBase
from flask import Blueprint, request, jsonify

from domains.League import League

class LeaguesController(ControllerBase):
    
    def clazz(self):
        return League

    @property
    def name(self):
        return 'leagues'

    def __init__(self):
        
        self.blueprint = Blueprint("League", __name__)
        ControllerBase.__init__(self)
        self.blueprint.add_url_rule(self.root + '/<id>', self.root + '/<id>/update' ,self.update, methods = ['PUT'])
        pass

    def update(self, id: str):
        json = request.get_json()
        print(json)
        doc = League(**json)
        q = self.service.update(id,doc)
        return jsonify(q.as_dict())
