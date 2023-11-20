import React, {useContext, useEffect} from 'react';
import { GlobalContext}  from './GlobalContext';
import CollapsablePane from './CollapsablePane';
import _ from 'lodash';

function DocumentList() {

    const {state, timelinedata, topiclist} = useContext(GlobalContext);
    const reports = timelinedata.reports;
    const clusters = timelinedata.nodes;
    const links = timelinedata.links;
    const click_feature_list = state.click_feature_list;
    const click_timeline_cell = state.click_timeline_cell;
    const features =  topiclist.topiclist;


    useEffect(() => {
    }, [click_feature_list.toString()], click_timeline_cell)

    let showClusters = []
    features.forEach( (d, i) => {
        if(click_feature_list.includes(d)){
            if(!_.isEmpty(click_timeline_cell) && click_timeline_cell.clusterName == d){
                showClusters.push({'name': d, 'index': i, 'weekIndex': click_timeline_cell.weekIndex, 'weekName':click_timeline_cell.weekName})
            } else {
                showClusters.push({'name': d, 'index': i})
            }
        } else {
            if(!_.isEmpty(click_timeline_cell) && click_timeline_cell.clusterName == d){
                showClusters.push({'name': d, 'index': i, 'weekIndex': click_timeline_cell.weekIndex, 'weekName':click_timeline_cell.weekName})
            }
        }
    })

    // console.log(showClusters);

    let collapsableList = <p style={{color:'grey'}}>... Please select topics to load news report</p>;
    if(showClusters.length > 0){
        collapsableList = showClusters.map((d) => {
            if(d.weekIndex !== null && typeof d.weekIndex !== 'undefined'){
                const reportObjs = reports.filter(r => {
                    return r.cluster == d.index && r.week == d.weekIndex
                });
                reportObjs.sort((a,b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateB - dateA;
                });//descending order
                return (
                    <CollapsablePane cluster={d.name} clusterIndex={d.index} reportObjs={reportObjs} repreportID={reportObjs[0].id} key={`cluster_${d.index}`} weekName={d.weekName}/>
                );
            } else {
                const reportIDs = clusters[d.index].reportIDs;
                const reportObjs = reportIDs.map((reportID) => {
                    return _.find(reports, {'id': reportID});
                })
                reportObjs.sort((a,b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateB - dateA;
                });//descending order
                return (
                    <CollapsablePane cluster={d.name} clusterIndex={d.index} reportObjs={reportObjs} repreportID={reportObjs[0].id} key={`cluster_${d.index}`}/>
                );
            }
        });
    }

    return (
        <div id="ReportPanel" style={{overflow: 'auto', height: '1165px'}}>
            {collapsableList}
        </div>
    )
}

export default DocumentList;