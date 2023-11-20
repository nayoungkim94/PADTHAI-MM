import React, { useEffect, useContext } from 'react';
import {GlobalContextProvider, GlobalContext} from './GlobalContext';
import FeatureSelection from './FeatureSelection';
import { TabPanel, useTabs } from "react-headless-tabs";
import { TabSelector } from "./TabSelector";
import logo from './logo.png';



function App() {
    const {recordMouseEvent} = useContext(GlobalContext);

    const [selectedTab, setSelectedTab] = useTabs([
        "options",
        "documents",
        "about"
      ]);

    const toggleText = (event) => {
        const btnID = event.target.id;
        const divID = `${btnID}Div`;
        let btnText = document.getElementById(`${btnID}`).innerHTML;
        btnText = btnText.substring(2);
        if(document.getElementById(`${divID}`).style.display == 'none'){
            document.getElementById(`${divID}`).style.display = 'inline';
            document.getElementById(`${btnID}`).innerHTML = `- ${btnText}`;
            recordMouseEvent('aboutpage', `collapse${btnID}`, 'click', '')
        } else {
            document.getElementById(`${divID}`).style.display = 'none';
            document.getElementById(`${btnID}`).innerHTML = `+ ${btnText}`;
            recordMouseEvent('aboutpage', `expand${btnID}`, 'click', '')
        }
    }

    return (
        <>  
            <img className="img-fluid" style={{paddingBottom: '0px', marginBottom: '-84px', marginLeft: '25px', width: '80px'}} src={logo}></img>
            <nav className="nav nav-tabs" style={{paddingLeft: "152px", paddingTop: "30px"}}>
                <TabSelector
                    isActive={selectedTab === "options"}
                    onClick={() => {
                        setSelectedTab("options"); 
                        recordMouseEvent('dashboard', 'options', 'click','');
                    }}
                >
                    Options
                </TabSelector>
                <TabSelector
                    isActive={selectedTab === "documents"}
                    onClick={() => {
                        setSelectedTab("documents");
                        recordMouseEvent('dashboard', 'documents', 'click','');
                    }}
                >
                    Documents
                </TabSelector>
                <TabSelector
                    isActive={selectedTab === "about"}
                    onClick={() => {
                        setSelectedTab("about"); 
                        recordMouseEvent('dashboard', 'about', 'click','');
                    }}
                >
                    About
                </TabSelector>
            </nav>
            <div className="p-4">
                <TabPanel hidden={selectedTab !== "options"}>
                    <GlobalContextProvider>
                        <FeatureSelection/>
                    </GlobalContextProvider>
                </TabPanel>
                <TabPanel hidden={selectedTab !== "documents"}>
                <div className="container">
                    <div className="row d-xl-flex justify-content-xl-center" style={{marginTop: "100px"}}>
                        <div className="col-md-4 col-xl-3 d-xxl-flex justify-content-center justify-content-xxl-center" style={{marginRight: "15px"}}>
                            <div className="row" style={{background: "#e9ecef", marginBottom: "15px", borderRadius: "10px"}}>
                                <div className="col" style={{marginBottom: "0px", width: "300px", height: "430px"}}>
                                    <div className="row" style={{marginRight: "0px", marginLeft: "0px"}}>
                                        <div className="col d-flex d-xxl-flex justify-content-center" style={{marginTop: "50px", marginBottom: "20px"}}>
                                            <p style={{textAlign: "center", fontSize: "24px", marginTop: "0px", marginBottom: "0px"}}>Document count:<br/><strong>423</strong></p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col d-flex justify-content-center align-items-xxl-start" style={{marginBottom: "0px", marginTop: "0px"}}><button className="btn btn-primary disabled" type="button" disabled="" style={{background: "#495057", borderColor: "#343a40"}}>Add new docs</button></div>
                                    </div>
                                    <div className="row" style={{marginRight: "0px", marginLeft: "0px"}}>
                                        <div className="col d-flex justify-content-center" style={{marginTop: "50px", marginBottom: "20px"}}>
                                            <p style={{fontSize: "24px", textAlign: "center", marginTop: "0px", marginBottom: "0px"}}>Locations:<br/><strong>Vastopolis</strong></p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col d-flex justify-content-center" style={{marginBottom: "50px"}}><button className="btn btn-primary disabled" type="button" disabled="" style={{background: "#495057", borderColor: "#343a40"}}>Change Location</button></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 col-xl-3 d-xxl-flex justify-content-center justify-content-xxl-center" style={{marginRight: "15px"}}>
                            <div className="row" style={{background: "#e9ecef", marginBottom: "15px", borderRadius: "10px"}}>
                                <div className="col" style={{marginBottom: "0px", width: "300px", height: "430px"}}>
                                    <div className="row" style={{marginRight: "0px", marginLeft: "0px"}}>
                                        <div className="col" style={{marginTop: "50px", marginBottom: "20px"}}>
                                            <p style={{textAlign: "center", fontSize: "24px", marginTop: "0px", marginBottom: "0px"}}>Document type:<br/><strong>News Reports</strong><br/></p>
                                        </div>
                                    </div>
                                    <div className="row" style={{marginRight: "0px", marginLeft: "0px", marginTop: "20px", marginBottom: "20px"}}>
                                        <div className="col">
                                            <p style={{textAlign: "center", fontSize: "24px"}}>Average length:<br/><strong>483</strong> words&nbsp;</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col d-flex justify-content-center" style={{marginBottom: "35px", marginTop: "20px"}}>
                                            <p style={{textAlign: "center", fontSize: "24px"}}>Date range:<br/><strong>April 2010 - May 2011</strong></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 col-xl-3 d-xxl-flex justify-content-center justify-content-xxl-center" style={{marginRight: "15px"}}>
                            <div className="row" style={{background: "#e9ecef", marginBottom: "15px", borderRadius: "10px"}}>
                                <div className="col" style={{marginBottom: "0px", width: "300px", height: "430px"}}>
                                    <div className="row" style={{marginRight: "0px", marginLeft: "0px"}}>
                                        <div className="col d-flex d-xxl-flex justify-content-center" style={{marginTop: "50px", marginBottom: "20px"}}>
                                            <p style={{textAlign: "center", fontSize: "24px", marginTop: "0px", marginBottom: "0px"}}><strong>Similar searches</strong><br/></p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <p style={{textAlign: "center", fontSize: "20px"}}><strong>Agency</strong>: FBI<br/><strong>Documents</strong>: 980<br/><strong>Type</strong>: News reports<br/><strong>Average length</strong>: 139<br/><strong>Topics</strong>: 76<br/><strong>Connections</strong>: 27<br/><br/></p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col d-flex justify-content-center" style={{marginBottom: '50px'}}><button className="btn btn-primary disabled" type="button" disabled="" style={{background: "#495057", borderColor: "#343a40"}}>View More</button></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </TabPanel>
                <TabPanel hidden={selectedTab !== "about"}>
                <div className="container d-flex" id='aboutpagediv'>
                    <div style={{marginLeft: "100px", width: "800px", textAlign: "left", marginTop: "50px", marginRight: "15px"}}>
                        <p><strong><span style={{color: "rgb(0, 0, 0)", backgroundColor: "transparent"}}>About READIT 2.0</span></strong><br/><span style={{color: "rgb(0, 0, 0)",  backgroundColor: "transparent"}}>The Report Assistant for Defense and Intelligence Tasks (READIT) system is a natural language processing system built to aid the intelligence community in analyzing documents and large corpora of text. To this end, READIT 2.0 employs clustering, topic modeling, and summarization techniques. READIT is designed to analyze large corpora of documents. The current version, READIT 2.0, can handle 100K documents, considering a machine with a GPU.&nbsp;</span><br/><br/><span style={{color: "rgb(0, 0, 0)", backgroundColor: "transparent"}}>Click on a section for details about individual features.</span><br/></p>
                        <div style={{display: 'block', float: 'left'}}>
                            <button className='btn' onClick={toggleText} id="BtnDocProcMeth" style={{float: 'left', margin: '0px', padding: '0px 3px 1px 3px', fontSize: '16px', textDecoration: "underline", color: "rgb(0, 0, 0)", backgroundColor: "transparent"}}>
                            + Document preprocessing methodology
                            </button>
                            <div id="BtnDocProcMethDiv" style={{display: 'none', float: 'left'}}>
                                <p><span style={{color: "rgb(0, 0, 0)", backgroundColor: "transparent"}}>After documents are imported, READIT cleans the data through a few pre-processing steps. Stop words, numbers, and punctuation are removed from the data and the remaining words are stemmed (i.e. “transformer” becomes “transform”). READIT then takes these stemmed words and makes them into clusters.&nbsp;</span><br/></p>
                            </div>
                        </div>
                        <div style={{clear: 'both'}}></div><br/>
                        <div style={{display: 'block', float: 'left'}}>
                            <button className='btn' onClick={toggleText} id="BtnDocClustMeth" style={{float: 'left', margin: '0px', padding: '0px 3px 1px 3px', fontSize: '16px', textDecoration: "underline", color: "rgb(0, 0, 0)", backgroundColor: "transparent"}}>
                            + Document clustering methodology
                            </button>
                            <div id="BtnDocClustMethDiv" style={{display: 'none', float: 'left'}}>
                                <p><span style={{color: "rgb(0, 0, 0)", backgroundColor: "transparent"}}>READIT uses the BERT technique (Bidirectional Encoder Representations from Transformers) to cluster similar documents together. Specifically, READIT uses an offshoot of BERT called BERTopic which is designed to perform clustering of documents or topic modeling.</span><br/><br/><span style={{color: "rgb(0, 0, 0)", backgroundColor: "transparent"}}>This algorithm first performs embedding to get the pre-processed documents into a format that computers can analyze (i.e. in vector space, with numbers). The embeddings are simplified using a process called dimensionality reduction. The reduced embeddings are clustered using HDBSCAN, a method of clustering that looks for densely populated areas when the reduced embeddings of the documents are represented in vector space.</span><br/><br/><span style={{color: "rgb(0, 0, 0)", backgroundColor: "transparent"}}>Thus, clusters contain documents that are similar and related to each other. BERTopic produces a single, non-relevant cluster which includes documents which are similarly unrelated to the remaining clusters. This cluster can be considered less relevant and READIT removes it before generating the final visualizations users see.</span><br/></p>
                            </div>
                        </div>
                        <div style={{clear: 'both'}}></div><br/>
                        <div style={{display: 'block', float: 'left'}}>
                            <button className='btn' onClick={toggleText} id="BtnClustTitle" style={{float: 'left', margin: '0px', padding: '0px 3px 1px 3px', fontSize: '16px', textDecoration: "underline", color: "rgb(0, 0, 0)", backgroundColor: "transparent"}}>
                            + Keywords and cluster titles
                            </button>
                            <div id="BtnClustTitleDiv" style={{display: 'none', float: 'left'}}>
                                <p><span style={{color: "rgb(0, 0, 0)", backgroundColor: "transparent"}}>Keywords are extracted from each cluster of documents using tf-idf (term frequency-inverse document frequency). TF-IDF is a measure that quantifies the importance of a keyword in a document over a collection, or corpus, of documents. TF is the relevant frequency of the term within the document and IDF is the logarithmically scaled value from dividing the total number of documents by the number of documents containing the keyword. By multiplying TF by IDF you can obtain a TF-IDF score. A higher TF-IDF score indicates that keyword is more important because tf-idf increases proportionally to the frequency of the keyword in the document, offset by the number of documents in the corpus containing that word. This offsetting also prevents stopwords from gaining a high TF-IDF score.</span><br/><br/><span style={{color: "rgb(0, 0, 0)", backgroundColor: "transparent"}}>Cluster titles are generated using keyword extraction. Keyword extraction pulls out the most important words or phrases from a set of documents and provides a human understandable topic title.&nbsp;</span><br/></p>
                            </div>
                        </div>
                        <div style={{clear: 'both'}}></div><br/>
                        <div style={{display: 'block', float: 'left'}}>
                            <button className='btn' onClick={toggleText} id="BtnSumMeth" style={{float: 'left', margin: '0px', padding: '0px 3px 1px 3px', fontSize: '16px', textDecoration: "underline", color: "rgb(0, 0, 0)", backgroundColor: "transparent"}}>
                            + Document summarization methodology
                            </button>
                            <div id="BtnSumMethDiv" style={{display: 'none', float: 'left'}}>
                                <p><span style={{color: "rgb(0, 0, 0)", backgroundColor: "transparent"}}>The summaries of documents are generated using Pegasus. The Pegasus model uses the transformer encoder-decoder structure.The encoder encodes the input text into the numerical context vector, which will be decoded by the decoder to generate summaries. The model is pre-trained to choose and mask important sentences and then recover them, which is called Gap Sentence Generation. This task is very similar to text summarization. The pre-training dataset used in this case is the cnn_dailymail dataset.&nbsp;</span><br/></p>
                            </div>
                        </div>
                        <div style={{clear: 'both'}}></div><br/>
                        <div style={{display: 'block', float: 'left'}}>
                            <button className='btn' onClick={toggleText} id="BtnClustScore" style={{float: 'left', margin: '0px', padding: '0px 3px 1px 3px', fontSize: '16px', textDecoration: "underline", color: "rgb(0, 0, 0)", backgroundColor: "transparent"}}>
                            + Cluster similarity scoring
                            </button>
                            <div id="BtnClustScoreDiv" style={{display: 'none', float: 'left'}}>
                                <p><span style={{color: "rgb(0, 0, 0)", backgroundColor: "transparent"}}>The similarity between two topic clusters are measured with cosine similarity of the topic embeddings. Cosine similarity is denoted as the dot product of two vectors divided by the multiplication of their magnitudes, a scaled distance metric similar to Euclidean and Mahalanobis.&nbsp;</span><br/></p>
                            </div>
                        </div>
                        <div style={{clear: 'both'}}></div><br/>
                        <div style={{display: 'block', float: 'left'}}>
                            <button className='btn' onClick={toggleText} id="BtnTVVA" style={{float: 'left', margin: '0px', padding: '0px 3px 1px 3px', fontSize: '16px', textDecoration: "underline", color: "rgb(0, 0, 0)", backgroundColor: "transparent"}}>
                            + Training, verification, validation, and accuracy
                            </button>
                            <div id="BtnTVVADiv" style={{display: 'none', float: 'left'}}>
                                <p><span style={{color: "rgb(0, 0, 0)", backgroundColor: "transparent"}}>READIT was trained using two algorithms. The BERTopic method for gathering the clusters of documents (topic modeling) was validated using three datasets: 16309 news articles across 20 categories, 2225 documents from the BBC News website between 2004 and 2005, and 44253 tweets of Trump. The performance of the model is evaluated by two widely-used metrics: topic coherence and topic diversity. Compared with other methods, BERTopic has high topic coherence scores across all three datasets (0.166, 0.167 and 0.66) and a nearly best performance for topic diversity scores (0.851, 0.792 and 0.663).</span><br/><br/><span style={{color: "rgb(0, 0, 0)", backgroundColor: "transparent"}}>Pegasus was pre-trained on two large text corpora: C4(350M Web-pages) and HugeNews(1.5B news-like documents). It can achieve state-of-the-art results on 12 different downstream summarization datasets measured by ROUGH scores. In the CNN/DailyMail dataset(contains 93k and 220k articles from CNN and the Daily Mail newspapers separately), the training dataset we selected for ReadIt summarization, can achieve human-level summarization performance and its best ROUGE numbers are: 44.16 for ROUGE-1, 21.28 for ROUGE-2 and 40.90 for ROUGE-L.&nbsp;</span><br/><br/><span style={{color: "rgb(0, 0, 0)", backgroundColor: "transparent"}}>To ensure that fair and unbiased points of view were incorporated in the training data, READIT was trained using the above multiple datasets. The training datasets were curated by intelligence analysts to ensure fair representation of view points.</span><br/></p>
                            </div>
                        </div>
                        <div style={{clear: 'both'}}></div><br/>
                        <div style={{display: 'block', float: 'left'}}>
                            <button className='btn' onClick={toggleText} id="BtnRecmd" style={{float: 'left', margin: '0px', padding: '0px 3px 1px 3px', fontSize: '16px', textDecoration: "underline", color: "rgb(0, 0, 0)", backgroundColor: "transparent"}}>
                            + Recommended use and restrictions on use
                            </button>
                            <div id="BtnRecmdDiv" style={{display: 'none', float: 'left'}}>
                                <p>It is recommended to use READIT on similar types of documents to the training data. Shorter documents in large corpora will likely produce the best performance. READIT will not perform well on single, short documents and therefore use is restricted to corpora with a minimum of 200 documents. If a single, short document is fed into the system BERTopic will give you an error since it needs a minimum of two documents per cluster.<br/></p>
                            </div>
                        </div>
                        <div style={{clear: 'both'}}></div><br/>
                        <div style={{display: 'block', float: 'left'}}>
                            <button className='btn' onClick={toggleText} id="BtnCitation" style={{float: 'left', margin: '0px', padding: '0px 3px 1px 3px', fontSize: '16px', textDecoration: "underline", color: "rgb(0, 0, 0)", backgroundColor: "transparent"}}>
                            + Citations
                            </button>
                            <div id="BtnCitationDiv" style={{display: 'none', float: 'left'}}>
                                <p><span style={{color: "rgb(34, 34, 34)"}}> Grootendorst, M. (2022). BERTopic: Neural topic modeling with a class-based TF-IDF procedure. </span><span style={{color: "rgb(34, 34, 34)"}}>arXiv preprint arXiv:2203.05794</span><span style={{color: "rgb(34, 34, 34)"}}>. https://doi.org/10.48550/arXiv.2203.05794</span><br/><br/><span style={{color: "rgb(0, 0, 0)", backgroundColor: "transparent"}}>Ganesan, K. (2017, January 26). </span><span style={{color: "rgb(0, 0, 0)", backgroundColor: "transparent"}}>An intro to ROUGE, and how to use it to evaluate summaries</span><span style={{color: "rgb(0, 0, 0)", backgroundColor: "transparent"}}>. freeCodeCamp.</span><a href="https://www.freecodecamp.org/news/what-is-rouge-and-how-it-works-for-evaluation-of-summaries-e059fb8ac840/"><span style={{color: "rgb(17, 85, 204)", backgroundColor: "transparent"}}>https://www.freecodecamp.org/news/what-is-rouge-and-how-it-works-for-evaluation-of-summaries-e059fb8ac840/</span></a><br/></p>    
                            </div>
                        </div>
                    </div>
                </div>
                </TabPanel>
            </div>
        </>

    );
}

export default App;
