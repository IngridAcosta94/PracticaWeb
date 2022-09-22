from abc import ABC
from datetime import datetime
from pytz import timezone

class Model(ABC):
    def __init__(self, id = 0, createdOn = '', updatedOn = ''):
        self.id = id
        if createdOn != '':
            self.createdOn = createdOn
        if updatedOn != '':
            self.updatedOn = updatedOn
    
    def as_dict(self):
        o = self.__dict__
        return o

    def from_dict(self, to):
        print(self.__dict__)
        for field in self.__dict__:
            print(field)
            if to is not None:
                if to.get(field):
                    self.__setattr__(field, to[field])
        pass

    def newTimestamps(self):
        self.createdOn = datetime.today().astimezone(
            timezone('America/Mexico_City')).strftime("%d/%m/%Y, %H:%M")
        self.updatedOn = datetime.today().astimezone(
            timezone('America/Mexico_City')).strftime("%d/%m/%Y, %H:%M")
        pass

    def setUpdatedOn(self):
        self.updatedOn = datetime.today().astimezone(
            timezone('America/Mexico_City')).strftime("%d/%m/%Y, %H:%M")
        pass
