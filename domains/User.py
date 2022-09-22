from domains.base.Model import Model

class User(Model):

    def __init__(self, id = '', name = '', profile = '', email = '', password= '', team = '', status = '', createdOn = '', updatedOn = ''):
        Model.__init__(self, id, createdOn, updatedOn)
        self.name = name
        self.email = email
        self.profile = profile
        self.password = password
        self.team = team
        self.status = status
        
        
