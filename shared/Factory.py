from domains.base.Model import Model
import domains.League
import domains.User
class Factory:
    registry = {}
    def __init__(self) -> None:
        types = Model.__subclasses__()
        for cls in types:
            # print(cls.__name__)
            self.registry[cls.__name__] = cls
        pass
    def create(self, kind: Model):
        # print(kind.__name__)
        if kind is not '' and kind is not None and kind.__name__ in self.registry:
            obj = object.__new__(kind)
            return obj
        return None
    
    def populate(self, obj, data):
        kind = type(obj).__name__
        if kind in self.registry:
            obj.__init__(**data)