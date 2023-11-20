import json
from datetime import datetime, timezone
from numpy import result_type
import tweepy
import requests
from google.cloud import datastore


def download_tweets_hashtags(hashtags, datastore_client):
    auth = tweepy.OAuthHandler('YXIhXkEI4datrgY7O8UgjUHm3', 'gbo6xOpr2cBzuHC99vHtk7kqBHmfZUeZnSSyBcPRVclBNon9eL')
    auth.set_access_token('857813621149138944-uWMcOyEHcQ45C3VVg7iwG9nISaLrZr0', 'XwDAjKPfNJDphPvPYquLLHwo62UgbUbMB6o8b85Eas7Ai')

    api = tweepy.API(auth, wait_on_rate_limit=True)
    
    # fout = open('./static/readit/datasets/data_twitter.jsonl', 'w')
    current_time = datetime.now(tz=timezone.utc)

    search_words = "#".join(hashtags)
    new_search = search_words + " -filter:retweets"
    
    for tweet in api.search_tweets(
        new_search,
        lang="en",
        count=500,
        result_type="popular",
        tweet_model='extended'
    ):
        try:
            # fout.write(json.dumps(tweet._json)+"\n")    
            data = tweet._json
            data['saving_time'] = current_time

            if len(data['text']) > 1500:
                data['text'] = data['text'][:1500]

            entity = datastore.Entity(key=datastore_client.key('twitter_data'))
            entity.update(data)

            # push the data
            datastore_client.put(entity)
        except:
            pass

def download_tweets_hashtags_alternate(data_dict, datastore_client):
    auth = tweepy.OAuthHandler('YXIhXkEI4datrgY7O8UgjUHm3', 'gbo6xOpr2cBzuHC99vHtk7kqBHmfZUeZnSSyBcPRVclBNon9eL')
    auth.set_access_token('857813621149138944-uWMcOyEHcQ45C3VVg7iwG9nISaLrZr0', 'XwDAjKPfNJDphPvPYquLLHwo62UgbUbMB6o8b85Eas7Ai')

    api = tweepy.API(auth, wait_on_rate_limit=True)
    
    # fout = open('./static/readit/datasets/data_twitter.jsonl', 'w')
    current_time = datetime.now(tz=timezone.utc)

    search_words = "#".join( data_dict['tags'][0].values() )
    new_search = search_words

    print(new_search)
    for tweet in api.search_full_archive(
        query=new_search,
        maxResults=100,
        label="readit",
        fromDate=data_dict['sd'].replace('-', '') + '0000',
        toDate=data_dict['ed'].replace('-', '') + '0000',
    ):
        try:
            # fout.write(json.dumps(tweet._json)+"\n")    
            data = tweet._json
            data['saving_time'] = current_time

            if len(data['text']) > 1500:
                data['text'] = data['text'][:1500]

            entity = datastore.Entity(key=datastore_client.key('twitter_data'))
            entity.update(data)

            # push the data
            datastore_client.put(entity)
        except Exception as e:
            print(e)
            pass

def download_reddit_submissions(hashtags, datastore_client):
    r = requests.get('https://api.pushshift.io/reddit/submission/search?q=%s&size=500' %(' '.join(hashtags)))
    # fout = open('./static/readit/datasets/data_reddit.jsonl', 'w', encoding='utf-8')
    current_time = datetime.now(tz=timezone.utc)

    for d in r.json()['data']:
        try:
            data = d
            data['saving_time'] = current_time
            entity = datastore.Entity(key=datastore_client.key('reddit_data'))

            if len(data['text']) > 1500:
                data['text'] = data['text'][:1500]

            entity.update(data)
            datastore_client.put(entity)
        except:
            pass

def read_tweets_dataset(path):
    fin = open(path)
    dataset = []

    for line in fin.readlines():
        line = json.loads(line.strip())
        dataset.append({
            'text': line['text'],
            'username': line['user']['screen_name'],
            'date': line['created_at'],
            'dtype': 'tweet',
            'popularity': int(line['retweet_count']) + int(line['favorite_count'])
        })

    fin.close()
    return dataset

def read_reddit_dataset(path):
    fin = open(path)
    dataset = []

    for line in fin.readlines():
        line = json.loads(line.strip())
        try:
            dataset.append({
                'title': line['title'],
                'text': line['selftext'],
                'username': line['author'],
                'date': datetime.fromtimestamp(line['created_utc']),
                'dtype': 'reddit'
            })
        except:
            pass

    fin.close()
    return dataset


def read_tweets_gcp(datastore_client):
    dataset = []
    query = datastore_client.query(kind='twitter_data')
    query.order = ['-saving_time']

    for data in query.fetch(limit=100):
        dataset.append({
            'text': data['text'],
            'username': data['user']['screen_name'],
            'date': data['created_at'],
            'dtype': 'tweet',
            'popularity': int(data['retweet_count']) + int(data['favorite_count'])
        })


    return dataset

def read_reddit_gcp(datastore_client):
    query = datastore_client.query(kind='reddit_data')
    query.order = ['-saving_time']

    dataset = []

    for data in query.fetch(limit=100):
        try:
            dataset.append({
                'title': data['title'],
                'text': data['selftext'],
                'username': data['author'],
                'date': datetime.fromtimestamp(data['created_utc']),
                'dtype': 'reddit'
            })
        except:
            pass
    return dataset
