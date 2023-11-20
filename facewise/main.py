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

import datetime
import json
from flask import Flask, render_template, request, redirect
import os
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "creds.json"
from google.cloud import datastore
from process.readit.utils import *
from process.readit.extractive_summarizer import top_sentence
from flask import jsonify
import time


datastore_client = datastore.Client()

app = Flask(__name__)


def fetch_expert_data(usr_id):
    query = datastore_client.query(kind='expert_survey_%d' %usr_id)
    image_pairs = []
    data = query.fetch()
    for d in data:
        d = json.loads(json.dumps(d['values']), parse_int=str)
        d = list(d.keys())[0] + list(d.values())[0]
        img_pair = json.loads(d)['data'].split('|')[0].strip()
        image_pairs.append(img_pair)
    return image_pairs

def store_survey_results_test(user_responses):
    entity = datastore.Entity(key=datastore_client.key('mturk_survey_test'))
    tmp = {}
    ind = 0
    s = user_responses['user_response']
    while s != '':
        l = min(len(s), 1000)
        tmp[str(ind)] = s[:l]
        s = s[l:]
        ind += 1
    user_responses['user_response'] = tmp
    entity.update(user_responses)
    datastore_client.put(entity)

def store_form_data(user_responses, open_time, validation_quiz, pairs_inds):
    entity = datastore.Entity(key=datastore_client.key('mturk_survey'))

    entity.update({
        'open_time': open_time,
        'submission_time': datetime.datetime.now(),
        'validation_status': validation_quiz,
        'pairs_inds': pairs_inds
    })

    entity.update(json.loads(user_responses))

    datastore_client.put(entity)

def store_prolific_data(data):
    entity = datastore.Entity(key=datastore_client.key('PHX_airport_results_wed'), exclude_from_indexes=('data.user_response',))
    user_data = json.loads(data['user_response'])
    del data['user_response']
    entity.update({
        'data': data,
        'user_response': user_data
    })

    datastore_client.put(entity)

def store_pair_data(user_responses, usr_id):
    # print(user_responses)
    entity = datastore.Entity(key=datastore_client.key('expert_survey_%d' %usr_id))
    entity.update({'values': user_responses})   
    datastore_client.put(entity)

def record_twitter_data(dataset):
    # print(user_responses)
    for data in dataset:
        entity = datastore.Entity(key=datastore_client.key('twitter_data'))
        if len(data['text']) > 1500:
            data['text'] = data['text'][:1500]
        entity.update(data)
        datastore_client.put(entity)


###### FACEWISE ########
@app.route('/facewisenewtest')
def facewisenewtest():
    return render_template('facewise/facewise-test.html')

@app.route('/facewise')
def facewise():
    return render_template('facewise/facewise.html')

@app.route('/facewisenew')
def facewisenew():
    return render_template('facewise/facewise-new.html')

@app.route('/facewisenewlm')
def facewisenewlm():
    return render_template('facewise/facewise-low-mast.html')


###### READIT ########
# define routes here
@app.route('/readit')
def index():
    # get js files
    js_files = [os.path.join('./static/readit/js', i) for i in os.listdir('./static/readit/js') if '.js' in i]
    css_files = [os.path.join('./static/readit/css', i) for i in os.listdir('./static/readit/css') if '.css' in i]

    return render_template('readit/readit.html', js_files=js_files, css_files=css_files)

@app.route('/get_new_data', methods=['GET'])
def get_new_data():
    args = request.args.to_dict()
    hashtags = [i['value'] for i in json.loads(args['tags'])]

    # save previous datasets!
    # dataset = read_tweets_dataset('./static/readit/datasets/data_twitter.jsonl')
    # dataset.extend(read_reddit_dataset('./static/readit/datasets/data_reddit.jsonl'))
    # record_twitter_data(dataset)
    # json.dump(dataset, open('./static/readit/datasets/' + str(time.time()) + '.json', 'w', encoding='utf-8'))

    dataset = read_tweets_gcp(datastore_client)
    dataset.extend(read_reddit_gcp(datastore_client))

    download_tweets_hashtags(hashtags, datastore_client)
    download_reddit_submissions(hashtags, datastore_client)
    return jsonify('OK')

@app.route('/read_data', methods=['GET'])
def read_data():
    dataset = []

    # dataset = read_tweets_dataset('./static/readit/datasets/data_twitter.jsonl')
    # dataset.extend(read_reddit_dataset('./static/readit/datasets/data_reddit.jsonl'))
    dataset = read_tweets_gcp(datastore_client)
    dataset.extend(read_reddit_gcp(datastore_client))
    
    return jsonify(dataset)

@app.route('/get_summary', methods=['GET'])
def get_summary():

    args = request.args.to_dict()

    dataset = []

    # dataset = read_tweets_dataset('./static/readit/datasets/data_twitter.jsonl')
    # dataset.extend(read_reddit_dataset('./static/readit/datasets/data_reddit.jsonl'))
    dataset = read_tweets_gcp(datastore_client)
    dataset.extend(read_reddit_gcp(datastore_client))

    text = '. '.join([i['text'] for i in dataset])

    summary, imp_docs = top_sentence(text, [i['text'] for i in dataset], limit=int(args['limit']))

    return jsonify([{
        'result': summary,
        'imp_docs': imp_docs
    }])

@app.route('/get_alternate_summary', methods=['GET'])
def get_alternate_summary():

    args = request.args.to_dict()

    args['tags'] = json.loads(args['tags'])

    # send a request through tweepy
    download_tweets_hashtags_alternate(args, datastore_client)

    # get the saved data from datastore
    dataset = read_tweets_gcp(datastore_client)
    influences = sorted(dataset, key=lambda x:x['popularity'], reverse=True)

    text = '. '.join([i['text'] for i in dataset[:10]])

    summary, imp_docs = top_sentence(text, [i['text'] for i in dataset], limit=10)

    return jsonify([{
        'result': summary,
        'imp_docs': imp_docs,
        'most_influential': influences[:10]
    }])

###### FACEWISE ########

@app.route('/test_survey', methods=['POST', 'GET'])
def test_survey():
    if request.method == 'POST':
        print(request.form.to_dict())
        store_survey_results_test(request.form.to_dict())
        return 'OK'
    return 'NOPE!'


@app.route('/start_survey', methods=['GET'])
def start_survey():
    if request.method == 'GET':
        try:
            params = {
                'pro_id': request.args.get('PROLIFIC_PID'),
                'stu_id': request.args.get('STUDY_ID'),
                'ses_id': request.args.get('SESSION_ID')
            }

            task_id = str(request.args.get('TID'))

            return render_template('surveys/survey_v5_%s.html' %(task_id), params=params)
        except Exception as e:
            print(e)
            pass
            return 'Wrong URL Parameters!'
    return 'NOPE!'

@app.route('/get_pair', methods=['POST', 'GET'])
def get_pair():
    if request.method == 'POST':
        k = json.loads(list(request.form.to_dict().keys())[0])['key']
        usr_id = int(json.loads(list(request.form.to_dict().keys())[0])['id'])
        if k == 'plzdontusethiskey!':
            return {'pairs': fetch_expert_data(usr_id)}
        return 'WRONG KEY'
    return 'NOPE!'

@app.route('/record_pair', methods=['POST', 'GET'])
def record_pair():
    if request.method != 'POST':
        return render_template('error.html')

    # get data and save it!
    form_data = request.form.to_dict()
    usr_str = list(form_data.values())[0].split(',')[-1]
    usr_id = int(usr_str[usr_str.index(':') + 1:usr_str.index('}')])
    print('usr_id == %d' %usr_id)
    store_pair_data(form_data, usr_id)

    # show the incomming results!
    return 'OK'

@app.route('/record_prolific_results', methods=['POST', 'GET'])
def record_prolific_results():
    if request.method != 'POST':
        return render_template('error.html')

    # get data and save it!
    form_data = request.form.to_dict()
    store_prolific_data(form_data)


    # show the incomming results!
    # return redirect("https://app.prolific.co/submissions/complete?cc=947736E6", code=302)
    return "Results Recorded Successfully! Your code is %s" %form_data['qualtrics_id_1'].replace('"', '')


@app.route('/record_results', methods=['POST', 'GET'])
def record_results():
    if request.method != 'POST':
        return render_template('error.html')

    # get data and save it!
    form_data = request.form.to_dict()

    if 'user_response' not in form_data:
        return 'Validation Quiz Failed!'

    store_form_data(form_data['user_response'], form_data['open_time'], form_data['validation_quiz'], form_data['pairs_inds'])

    # show the incomming results!
    return 'Responses Recorded! Thank you!'


if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.

    # Flask's development server will automatically serve static files in
    # the "static" directory. See:
    # http://flask.pocoo.org/docs/1.0/quickstart/#static-files. Once deployed,
    # App Engine itself will serve those files as configured in app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)
