from flask import Flask, request, url_for, redirect, render_template, jsonify, session
import json
from flask_cors import CORS
import pandas as pd
from datetime import datetime, timedelta
from flask import render_template
from sklearn.preprocessing import LabelEncoder
import copy
import time

import redis
from flask_session import Session

import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
cors = CORS(app)
app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_REDIS'] = redis.from_url('redis://localhost:6379')
app.config['JSON_SORT_KEYS'] = False
app.config.from_object(__name__)
sess = Session()
sess.init_app(app)

redisDatabaseNum = 2

cluster_strings = ['Air travel','Healthcare', 'Sports events and broadcasting','National election and politics', 'Communications and technology','Securities lawsuits', 'Finance and business', 'Crime bulletin','Economic outlook', 'Sports news', 'Automobile economics', 'Tobacco','Asian News', 'Mergers and acquisitions', 'Agricultural economics','Family economics', 'Personal finance', 'Food corporations','Animal deaths', 'Food supply', 'Bioterrorism threats','Patino laboratory microbes', 'Hacking', 'Arms trafficking','Money Laundering', 'Dirty Bomb']

sorted_clusterStrs = copy.deepcopy(cluster_strings)
sorted_clusterStrs.sort()

# @app.route('/fetchnewsdata', methods=['GET'])
# def fetchNewsdata():
#     newsdata, newsintopic = getNewsdata()
#
#     return jsonify({
#         'newsdata': newsdata,
#         'newsintopic': newsintopic
#     })

# def getNewsdata():
#     df = pd.read_csv('files/27_clusters.csv')
#     row_size = df.shape[0]
#     # column_size = df.shape[1]
#     docObjects = []  # store the object of each news report
#     clusterObjects = {}  # store the id of documents in each cluster
#
#     for i in cluster_strings:
#         clusterObjects[i] = []
#
#     for i in range(0, row_size):
#         tmpDocObj = {}
#         docID = str(df.iloc[i]['id'])
#         tmpDocObj['id'] = docID
#         tmpDocObj['title'] = str(df.iloc[i]['title'])
#         # tmpDocObj['summary'] = str(df.iloc[i]['summary'])
#         tmpDocObj['content'] = str(df.iloc[i]['content'])
#         tmpDocObj['publisher'] = str(df.iloc[i]['publisher'])
#         tmpDocObj['date'] = str(df.iloc[i]['date'])
#
#         clusterList = []
#         for j in cluster_strings:
#             if (df.iloc[i][j] > 0):
#                 clusterList.append(j)
#                 clusterObjects[j].append(docID)
#         #         print(df.iloc[i])
#         tmpDocObj['clusters'] = clusterList
#         docObjects.append(tmpDocObj)
#
#     return docObjects, clusterObjects


@app.route('/hcluster', methods=['GET'])
def fetchHcluster():
    hclust_matrix, hclust_features, alphabet_matrix = getHcluster()

    return jsonify({
        'hclust_matrix': hclust_matrix,
        'hclust_features': hclust_features,
        'alphabet_matrix': alphabet_matrix
    })

def getHcluster():
    # Opening JSON file
    f = open('files/hcluster.json')

    # returns JSON object as a dictionary
    data = json.load(f)

    return data['hclust_matrix'], data['hclust_features'], data['alphabet_matrix']


@app.route('/fetchtimelinedata', methods=['GET'])
def fetchTimelinedata():
    nodes, links, timeframes, reports, keywords = getTimelinedata()

    return jsonify({
        'nodes': nodes,
        # 'counts': counts,
        'links': links,
        'timeframes': timeframes,
        'reports': reports,
        'keywords': keywords
    })

def getTimelinedata():
    df = pd.read_excel('files/26clusters.xlsx', index_col=0)
    # df = pd.read_csv('files/27_clusters.csv', index_col=0)
    df = df.reset_index(drop=True)

    cluster_cols = cluster_strings
    df_clusters = df[cluster_cols]
    cluster_labels = df_clusters.idxmax(axis=1).values
    df['cluster_label'] = cluster_labels
    df_timeline = df[['id', 'title', 'date', 'summary', 'content', 'cluster_label']]

    cur_date = list()
    week_start_Mon_date = list()
    week_end_Sun_date = list()
    for i in range(0, df_timeline['date'].values.shape[0]):
        t = df_timeline['date'].values[i]
        if isinstance(t, datetime):
            datetime_object = t
        else:
            sample_str = ''.join(t.split())
            datetime_object = datetime.strptime(sample_str, '%B%d,%Y')
        start_datetime_object = datetime_object - timedelta(days=datetime_object.weekday())
        end_datetime_object = start_datetime_object + timedelta(days=6)
        cur_date.append(datetime_object)
        week_start_Mon_date.append(start_datetime_object)
        week_end_Sun_date.append(end_datetime_object)

    df_timeline['date_datetime'] = cur_date
    df_timeline['week_start_Mon_date'] = week_start_Mon_date
    df_timeline['week_end_Sun_date'] = week_end_Sun_date

    df_timeline['week_in_the_year'] = df_timeline['date_datetime'].dt.week.values
    le = LabelEncoder()
    df_timeline['week_order'] = le.fit_transform(df_timeline['week_in_the_year'])
    # df_timeline

    df_report = df_timeline[['id', 'title', 'cluster_label', 'date_datetime', 'week_order', 'summary', 'content']]
    # df_report['summary'] = 'This is an one-sentence example summary for the report'   # change it to the real summary later
    df_report['date_datetime_str'] = df_report['date_datetime'].apply(lambda x: x.strftime('%b %d, %Y'))
    df_report = df_report.sort_values(by=['cluster_label', 'date_datetime'])
    # df_report

    cluster_time_count_df = df_timeline.groupby(['cluster_label', 'week_order', 'week_start_Mon_date', 'week_end_Sun_date']).describe()['week_in_the_year']['count']
    cluster_time_count_df = cluster_time_count_df.reset_index()
    num_weeks = cluster_time_count_df['week_order'].max() + 1
    # cluster_time_count_df

    cluster_week_link = list()
    cluster_labels = list()
    week_date_range_link = list()
    # count_by_cluster_list = list()
    report_list = list()
    keyword_tfidf_list = list()

    # generate json object of count for each cluster
    count_by_cluster = cluster_time_count_df.groupby(['cluster_label']).sum()['count'].reset_index().sort_values(by=['cluster_label'])
    cluster_sorted = list(count_by_cluster['cluster_label'].values)

    # for i in range(0, len(cluster_sorted)):
    #     cur_cluster = cluster_sorted[i]
    #     temp_dict = dict()
    #     temp_dict['cluster'] = i
    #     temp_dict['count'] = count_by_cluster[count_by_cluster['cluster_label'] == cur_cluster]['count'].values[0]
    #     count_by_cluster_list.append(temp_dict)

    # generate json object of start time and end time for each week
    for j in range(0, num_weeks):
        temp_dict = dict()
        start_date = cluster_time_count_df[cluster_time_count_df['week_order'] == j]['week_start_Mon_date'].values[0]
        end_date = cluster_time_count_df[cluster_time_count_df['week_order'] == j]['week_end_Sun_date'].values[0]
        temp_dict['week'] = j
        # start_list = start_date.astype(str).split("T")[0].split('-')
        # temp_dict['week_start_date'] = start_list[1] + '/' + start_list[2] + '/' + start_list[0]
        temp_dict['week_start_date'] = pd.to_datetime(start_date).strftime('%b %d/%Y')
        # end_list = end_date.astype(str).split("T")[0].split('-')
        # temp_dict['week_end_date'] = end_list[1] + '/' + end_list[2] + '/' + end_list[0]
        temp_dict['week_end_date'] = pd.to_datetime(end_date).strftime('%b %d/%Y')
        week_date_range_link.append(temp_dict)

    for i in range(0, df_report.shape[0]):
        cur_row = df_report.iloc[i]
        temp_dict = dict()
        temp_dict['cluster'] = cluster_sorted.index(cur_row['cluster_label'])
        temp_dict['date'] = cur_row['date_datetime_str']
        temp_dict['week'] = int(cur_row['week_order'])
        temp_dict['title'] = cur_row['title']
        temp_dict['summary'] = cur_row['summary']
        temp_dict['content'] = cur_row['content']
        temp_dict['id'] = str(cur_row['id'])
        report_list.append(temp_dict)

    # generate json object of count for each cluster in each week
    for i in range(0, len(cluster_sorted)):
        temp_dict0 = dict()
        temp_dict0['cluster'] = i
        temp_dict0['label'] = cluster_sorted[i]
        rslt_df = df_report[df_report['cluster_label'] == cluster_sorted[i]]
        temp_dict0['reportIDs'] = rslt_df['id'].astype(str).values.tolist()
        temp_dict0['count'] = rslt_df['id'].values.shape[0]
        # print(rslt_df['id'].values.shape[0])
        cluster_labels.append(temp_dict0)
        for j in range(0, num_weeks):
            temp_dict = dict()
            temp_dict['cluster'] = i
            temp_dict['week'] = j
            cur_cluster = cluster_sorted[i]
            cur_cluster_appear_weeks = cluster_time_count_df[cluster_time_count_df['cluster_label'] == cur_cluster][
                'week_order'].unique()
            if j in cur_cluster_appear_weeks:
                temp_dict['reportIDs'] = df_report[(df_report['cluster_label'] == cur_cluster) & (df_report['week_order'] == j)]['id'].astype(str).values.tolist()
                val = cluster_time_count_df[(cluster_time_count_df['cluster_label'] == cur_cluster) & (
                            cluster_time_count_df['week_order'] == j)]['count'].values[0]
            else:
                val = 0.0
            temp_dict['count'] = val
            cluster_week_link.append(temp_dict)

    # generate json object of keyword with tfidf score for each cluster
    df_keyword = pd.read_csv('files/26clusters_keyword_tfidf.csv').sort_values(by=['cluster_label', 'tfidf'], ascending=[True, False])
    topk = 6
    for i in range(0, len(cluster_sorted)):
        cluster_keyword_topk_df = df_keyword[df_keyword['cluster_label'] == cluster_sorted[i]].iloc[: topk]
        for j in range(0, topk):
            temp_dict = dict()
            temp_dict['cluster'] = i
            temp_dict['keyword'] = cluster_keyword_topk_df.iloc[j]['keyword']
            temp_dict['tfidf'] = cluster_keyword_topk_df.iloc[j]['tfidf']
            keyword_tfidf_list.append(temp_dict)

    # final_dict = dict()
    # final_dict['nodes'] = cluster_labels
    # final_dict['counts'] = count_by_cluster_list
    # final_dict['links'] = cluster_week_link
    # final_dict['timeframes'] = week_date_range_link
    # final_dict['reports'] = report_list
    # final_dict['keywords'] = keyword_tfidf_list
    # # convert into json
    # # file name is mydata
    # with open("timeline_data.json", "w") as final:
    #     json.dump(final_dict, final)

    return cluster_labels, cluster_week_link, week_date_range_link, report_list, keyword_tfidf_list


@app.route('/fetchalldata', methods=['GET'])
def fetchAlldata():
    hclust_matrix, hclust_features, alphabet_matrix = getHcluster()
    # newsdata, newsintopic = getNewsdata()
    nodes, links, timeframes, reports, keywords = getTimelinedata()

    return jsonify({
        # 'newsdata': newsdata,
        # 'newsintopic': newsintopic,
        'hclust_matrix': hclust_matrix,
        'hclust_features': hclust_features,
        'alphabet_matrix': alphabet_matrix,
        'nodes': nodes,
        # 'counts': counts,
        'links': links,
        'timeframes': timeframes,
        'reports': reports,
        'keywords': keywords,
        'topics': sorted_clusterStrs
    })

@app.route("/")
def hello_world():
    return "Test 123 "

@app.route('/start')
def start_page():
    return render_template('start.html')

@app.route('/index.html')
def dashboard_page():
    return render_template('index.html')

@app.route('/recordParticipantID', methods=['POST'])
def recordParticipantID():
    servertime = time.time()
    timestamp = request.form.get("timestamp") # time spent on start page
    starttime = request.form.get("starttime")
    key = request.form.get("key")
    participantID = request.form.get("participantID")

    r = redis.Redis(db=redisDatabaseNum)
    if str(participantID).strip()=="":
        # empty participantID string
        print('empty participant id')
        # return render_template("start.html") # go back to start page
        return "empty"
    else:
        # check the existence of participant ids
        if(r.sadd('participantidonly', str(participantID).strip()) == 1): # insert the new participant id
            # add successfully
            r.hset('user:' + participantID, 'starttime', starttime)
            r.hset('user:' + participantID, 'starttimeserver', servertime)
            print(participantID, 'added successfully')
            session['uid'] = str(participantID)
            if session.get('uid') is not None:
                print(session.get('uid'))
            return "true"
        else:
            # already exists
            print(participantID, 'already exist')
            return "false"

@app.route('/recordInteraction', methods=['POST'])
def recordMouseEvent():
    servertime = time.time()
    panel = request.get_json()['panel']
    action = request.get_json()['action']
    # timestamp = request.get_json()['timestamp']
    tmpEvent = request.get_json()['event']
    topic = request.get_json()['topic']

    if session.get('uid') is not None:
        print(session.get('uid'))
    uid_str = str(session.get('uid'))
    tmpEvent = panel + ',' + action + ',' + tmpEvent + ',' + topic + ',' + str(servertime)
    r = redis.Redis(db=redisDatabaseNum)
    # r.zadd('event:'+uid_str, {tmpEvent: servertime}, nx=True)
    r.rpush('event:'+uid_str, tmpEvent)

    return ''

if __name__ == '__main__':
    app.run(debug=True, threaded=True, host='0.0.0.0', port=5000)
    app.config['JSON_SORT_KEYS'] = False
    app.config["TEMPLATES_AUTO_RELOAD"] = True
    app.config['SESSION_TYPE'] = 'redis'