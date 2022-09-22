
from abc import abstractmethod
from flask import Flask, render_template, json, request, make_response, \
    session, send_file, send_from_directory, jsonify, redirect
from flask import Blueprint
from datetime import datetime
from pytz import timezone

from domains.base.Model import Model
from services.CatalogueService import CatalogueService
class ControllerBase(object):
    baseRoot = '/api/'
    
    service = CatalogueService()
    blueprint = None
    
    @property
    def root(self):
        return self.baseRoot + str.lower(self.name)

    @property
    @abstractmethod
    def name(self):
        pass
    @abstractmethod
    def clazz():
        return Model
    
    def __init__(self) -> None:
        super().__init__()
        self.blueprint.add_url_rule(self.root, self.root + '/create' ,self.store, methods = ['POST'])
        self.blueprint.add_url_rule(self.root + '/<id>', self.root + '/<id>/get' ,self.single, methods = ['GET'])
        self.blueprint.add_url_rule(self.root, self.root + '/list' ,self.list, methods = ['GET'])
        self.blueprint.add_url_rule(self.root + '/<id>', self.root + '/<id>/delete' ,self.delete, methods = ['DELETE'])
        pass

    
    def store(self):
        json = request.get_json()
        print(json)
        doc = object.__new__(self.clazz())
        doc.__init__(**json)

        q = self.service.add(doc)
        print(q)
        q = q.as_dict()
        return jsonify(q)

    def single(self, id: str):
        print (id)
        exist = object.__new__(self.clazz())
        exist.__init__(id)
        obj = self.service.single(exist)
        # if obj is not None:
        # if request.args.get('rel') and request.args.get('rel').lower() == 'true':
            # makeRelationship(obj)
        return jsonify(obj.as_dict())
    def list(self):
        params = request.args.to_dict()
        objs = self.service.list(self.clazz(), params)
        # if request.args.get('rel') and request.args.get('rel').lower() == 'true':
        # for obj in objs['entities']:
        #     makeRelationship(obj)
        return jsonify(cursor=objs["cursor"], entities = [o.as_dict() for o in objs["entities"]])

    def delete(self, id):
        doc = object.__new__(self.clazz())#Campaign(id)
        doc.__init__(id)
        deleted = self.service.delete(doc)
        return jsonify(deleted.as_dict())
