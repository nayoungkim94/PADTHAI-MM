import spacy
from collections import Counter
from string import punctuation

def top_sentence(text, documents, limit):
    nlp = spacy.load("en_core_web_sm")
    imp_docs = []

    keyword = []
    pos_tag = ['PROPN', 'ADJ', 'NOUN', 'VERB']
    doc = nlp(text.lower())
    for token in doc:
        if token.text in nlp.Defaults.stop_words or token.text in punctuation or '/' in token.text:
            continue
        if token.pos_ in pos_tag:
            keyword.append(token.text)
    
    freq_word = Counter(keyword)
    max_freq = Counter(keyword).most_common(1)[0][1]
    for w in freq_word:
        freq_word[w] = (freq_word[w]/max_freq)
        
    sent_strength={}
    for sent in doc.sents:
        if '/r/' in sent.text or 'keyword' in sent.text:
            continue
        for word in sent:
            if word.text in freq_word.keys():
                if sent in sent_strength.keys():
                    sent_strength[sent] += freq_word[word.text]
                else:
                    sent_strength[sent] = freq_word[word.text]
    
    summary = []
    
    sorted_x = sorted(sent_strength.items(), key=lambda kv: kv[1], reverse=True)
    counter = 0
    for i in range(len(sorted_x)):
        summary.append(str(sorted_x[i][0]).capitalize())

        # mark the document(s)
        for d_ind, doc in enumerate(documents):
            if str(sorted_x[i][0]).capitalize() in doc:
                imp_docs.append(d_ind)

        counter += 1
        if(counter >= limit):
            break
            
    return '</p><p align="left">'.join(summary), imp_docs
