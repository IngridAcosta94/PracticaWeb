# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START gae_python37_app]
from flask import Flask, session, json
from flask_cors import CORS
from datetime import timedelta
from firebase_admin import credentials
import firebase_admin
from controllers.LeaguesController import LeaguesController
from controllers.UserController import UserController
from shared.Factory import Factory
from shared.Middleware import Middleware

cred = credentials.Certificate('secret/secret.json')

firebase_admin.initialize_app(cred)

SESSION_TYPE = 'memcache'

app = Flask(__name__, static_folder='/static')
app.secret_key = 'ligas_web'
CORS(app, resources={
    r"/*": {
        "origins": "*"
    }
})
app.register_blueprint(LeaguesController().blueprint)
app.register_blueprint(UserController().blueprint)

@app.before_request
def before_request():
    session.permanent = True
    app.permanent_session_lifetime = timedelta(minutes=15)
    
@app.route('/hello')
def hello():
    r2 = {'message': 'hello'}
    f = Factory()
    
    return json.dumps(r2)

app.wsgi_app = Middleware(app.wsgi_app)
if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)
# [END gae_python37_app]
