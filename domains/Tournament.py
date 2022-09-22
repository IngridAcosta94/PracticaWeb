from domains.base.Model import Model

class Tournament(Model):

    def __init__(self, id, name = '', tournamentId = '', teams = [], createdOn = '', updatedOn = ''):
        Model.__init__(self, id, createdOn, updatedOn)
        self.name = name
        self.tournamentId = tournamentId
        self.teams = teams
        
        
