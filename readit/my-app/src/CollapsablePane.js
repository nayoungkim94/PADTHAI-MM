import React, {useContext, useEffect} from 'react';
import { GlobalContext}  from './GlobalContext';
import _ from 'lodash';

function CollapsablePane(props) {
    const {titleCase, recordMouseEvent} = useContext(GlobalContext);
    const clusterName = props.cluster;
    const clusterIndex = props.clusterIndex;
    const reportObjs = props.reportObjs;
    const repreportID = props.repreportID;
    const weekName = props.weekName;

    const toggleText = (event) => {
        if(event.target.innerHTML == 'Show More'){
            recordMouseEvent('DocumentsandSummaries', 'showmore', 'click', clusterName)
            document.getElementById(`moreItem_${clusterIndex}`).style.display = 'inline';
            event.target.innerHTML = 'Show Less';
        } else {
            recordMouseEvent('DocumentsandSummaries', 'showless', 'click', clusterName)
            document.getElementById(`moreItem_${clusterIndex}`).style.display = 'none';
            event.target.innerHTML = 'Show More';
        }
    }

    const toggleItem = (event) => {
        const itemClass = event.target.parentElement.parentElement.className;
        const accItem = document.getElementById(`Wrapper_${clusterIndex}`).getElementsByClassName("accordionItem")
        for (let i = 0; i < accItem.length; i++) {
            accItem[i].className = 'accordionItem close';
        }
        const newsid = event._dispatchInstances.key.split("_")[1]
        if (itemClass == 'accordionItem close') {
            event.target.parentElement.parentElement.className = 'accordionItem open';
            recordMouseEvent('DocumentsandSummaries', `openNews${newsid}`, 'click', clusterName)
        } else {
            recordMouseEvent('DocumentsandSummaries', `closeNews${newsid}`, 'click', clusterName)
        }
    }

    const captureHover = (event) => {
        const newsid = event._dispatchInstances.key.split("_")[1]
        // const newsid = event.target.parentElement.parentElement.getAttribute('newsid')
        recordMouseEvent('DocumentsandSummaries', `hoverNews${newsid}`, 'mousehover', clusterName)
    }

    const repReportObj = _.find(reportObjs, {'id': repreportID});

    const updatedReportObj = reportObjs.filter(d => d.id != repreportID)

    const firstDocHTML = (d) => {
        return (
            <div className='accordionItem close' key={`accordionItem_${d.id}`} newsid={`${d.id}`} onClick={toggleItem} onMouseOver={captureHover}>
                <div className='accordionItemHeading'>
                    <p className='title'>{d.title}</p>
                    <p className='date'>{d.date}</p>
                    <p className='summary'>{d.summary}</p>
                </div>
                <div className='accordionItemContent'>
                    <p className='content'>{d.content}</p>
                </div>
            </div>
        );
    }

    const documentHTML = updatedReportObj.map((d) => {
        return ( 
            <div className='accordionItem close' key={`accordionItem_${d.id}`} newsid={`${d.id}`} onClick={toggleItem} onMouseOver={captureHover}>
                <div className='accordionItemHeading'>
                    <p className='title'>{d.title}</p>
                    <p className='date'>{d.date}</p>
                    <p className='summary'>{d.summary}</p>
                </div>
                <div className='accordionItemContent'>
                    <p className='content'>{d.content}</p>
                </div>
            </div>
        );
    })

    const timelineSelected = () => {
        if(weekName !== null && typeof weekName !== 'undefined'){
            return  <p style={{margin: '0px 0px 5px 0px', fontSize: '16px'}}>Time: {weekName}</p>
        } else {
            return <></>;
        }
    }

    return (
        <div className="accordionWrapper" id={`Wrapper_${clusterIndex}`}>
            <p style={{margin: '0px', fontSize: '16px'}}>Topic: {titleCase(clusterName)}</p>
            <p style={{margin: '0px 0px 5px 0px', fontSize: '16px'}}>No. of News: {reportObjs.length}</p>
            {timelineSelected()}
            {firstDocHTML(repReportObj)}
            <div id={`moreItem_${clusterIndex}`} style={{display: 'none'}} key={`moreItem_${clusterIndex}`}>
                {documentHTML}
            </div>
            <button className='btn btn-outline-primary btn-sm' onClick={toggleText} id="textButton" style={{float: 'right', margin: '0px', padding: '1px 3px 1px 3px', fontSize: '12px'}}>
                Show More
            </button>
        </div>
    )
}

export default CollapsablePane;