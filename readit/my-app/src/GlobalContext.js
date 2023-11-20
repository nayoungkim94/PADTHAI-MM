import React, { createContext, useState } from 'react';

const GlobalContext = createContext();
const ip = 'http://127.0.0.1:5002';


const initState = {
    click_bubble: null,
    click_feature_row: null,
    click_feature_col: null,
    click_feature_list: [],
    click_timeline_cell: {}
};

const GlobalContextProvider = props => {
    const [state, setState] = useState(initState);
    // loader for entire page
    const [loading, setLoading]= useState(false);

    const [cor_matrix_data, setCor_matrix_data] = useState({
        hclust_matrix: [],
        hclust_features: null,
        alphabet_matrix: [],
    });

    const [timelinedata, setTimelinedata] =  useState({
        nodes: [],
        links: [],
        timeframes: [],
        reports: [],
        keywords: []
    })

    const [topiclist, setTopiclist] = useState({
        topiclist: []
    })

    const [matrixorder, setMatrixorder] = useState({
        matrixorder: 'alphabet'
    })

    const loadData = () => {
        fetch(`${ip}/fetchalldata`)
        .then(res => res.json())
        .then(response => {
            setCor_matrix_data({
                hclust_matrix: response['hclust_matrix'],
                hclust_features: response['hclust_features'],
                alphabet_matrix: response['alphabet_matrix'],
            })
            setTimelinedata({
                nodes: response['nodes'],
                links: response['links'],
                timeframes: response['timeframes'],
                reports: response['reports'],
                keywords: response['keywords']
            })
            setTopiclist({
                topiclist: response['topics']
            })
            setLoading(true);
        })
        .catch(e => console.log(e));
    };

    const loadCluster = () => {
        var flag = false;
        fetch(`${ip}/hcluster`)
        .then(res => res.json())
        .then(response => {
            setCor_matrix_data({
                hclust_matrix: response['hclust_matrix'],
                hclust_features: response['hclust_features'],
                alphabet_matrix: response['alphabet_matrix'],
            })
            flag = true;
        })
        .catch(e => console.log(e));
        return flag;
    };

    const updateMatrixOrder = () => {
        const sel = document.getElementById('order');
        const value = sel.options[sel.selectedIndex].value;
        setMatrixorder({matrixorder: value});
    }

    const onClickMultiCard = (feature_name, panelName) => {
        let action = (state.click_feature_list.includes(feature_name)) ? 'uncheck' : 'check'
        recordMouseEvent(panelName, action, 'click', feature_name)

        updateMatrixOrder();

        if (!state.click_feature_list.includes(feature_name)) {
            let feature_list = [...state.click_feature_list];
            feature_list.push(feature_name);
            setState({...state,
                click_feature_list: feature_list,
            });
        } else {
        //  otherwise remove feature from the list
            let feature_list = [...state.click_feature_list];
            feature_list = feature_list.filter(d => {return d !== feature_name});
            setState({...state,
                click_feature_list: feature_list,
            });
        }
    };

    const onClickTimelineCell = (cellObj, feature_name) => {
        // const tmpClusterName = cellObj.clusterName;
        // const tmpWeekName = cellObj.weekName;
        // if ( tmpClusterName == state.click_timeline_cell.clusterName && tmpWeekName == state.click_timeline_cell.weekName){
        //     recordMouseEvent('TopicTimeline', 'uncheck', 'click', `${feature_name}+${tmpWeekName}`)
        // } else {
        //     recordMouseEvent('TopicTimeline', 'check', 'click', `${feature_name}+${tmpWeekName}`)
        // }

        updateMatrixOrder();

        if (!state.click_feature_list.includes(feature_name)) {
            let feature_list = [...state.click_feature_list];
            feature_list.push(feature_name);
            setState({...state,
                click_feature_list: feature_list,
                click_timeline_cell: cellObj
            });
        } else {
            setState({...state,
                click_timeline_cell: cellObj
            });
        }
        // else {
        // //  otherwise remove feature from the list
        //     let feature_list = [...state.click_feature_list];
        //     feature_list = feature_list.filter(d => {return d !== feature_name});
        //     setState({...state,
        //         click_feature_list: feature_list,
        //         click_timeline_cell: cellObj
        //     });
        // }
    }

    const ClearAllFeatures = (panelName) => {
        recordMouseEvent(panelName, 'uncheck', 'click', 'all')

        updateMatrixOrder();

        setState({...state, click_feature_list: []});
    }
    const SelectAllFeatures = (panelName) => {
        recordMouseEvent(panelName, 'check', 'click', 'all')

        updateMatrixOrder();
        
        setState({...state, click_feature_list: [...cor_matrix_data.hclust_features]});
    }

    // utility functions
    const titleCase = (str) => {
        return str.toLowerCase().split(' ').map(function(word) {
            if (word == 'and'){
                return word;
            } else {
                return (word.charAt(0).toUpperCase() + word.slice(1));
            }
        }).join(' ');
    }

    const recordMouseEvent = (panelName, action, tmpEvent, topic) => {
        const startTime = new Date(); //get the start time
        const postData = {
            'panel': panelName,
            'action': action,
            'event': tmpEvent,
            'topic': topic,
            'timestamp': startTime
        };
        fetch(`${ip}/recordInteraction`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        })
        .catch(e => console.log(e));
    }

    const value = {
        state,
        setState,
        loadData,
        loadCluster,
        loading,
        onClickMultiCard,
        SelectAllFeatures,
        ClearAllFeatures,
        setMatrixorder,
        onClickTimelineCell,
        cor_matrix_data,
        timelinedata,
        topiclist,
        matrixorder,
        titleCase,
        recordMouseEvent
    };

    return (
        <GlobalContext.Provider value={value}>
            {props.children}
        </GlobalContext.Provider>
    );
};

export { GlobalContext, GlobalContextProvider }