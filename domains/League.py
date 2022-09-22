from domains.base.Model import Model

class League(Model):

    def __init__(self, id, name = '', address = '', createdOn = '', updatedOn = ''):
        Model.__init__(self, id, createdOn, updatedOn)
        self.name = name
        self.address = address
        
        
