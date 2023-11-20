import React, { useEffect, useContext } from "react";
import { GlobalContext } from "./GlobalContext";
import ReactLoading from "react-loading";
import CorrelationMatrix from './CorrelationMatrix';
import FeatureClickable from './FeatureClickable';
import TimelineMatrix from './TimelineMatrix';
import BubbleView from './BubbleView';
import DocumentList from './DocumentList';
import ReactTooltip from "react-tooltip";


const rowStyle = {
  // display: "flex",
  // justifyContent: "space-around",
  paddingTop: "10px",
  // width: "100%",
  // height: '100%'
};

const borderStyle = {
  border: '1px solid lightgrey', 
  borderRadius: '3px'
}

const bannerStyle = {
  backgroundColor: 'lightgrey',
  // height: '3%',
}

const ReactLoadingStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  marginTop: '-50px',
  marginLeft: '-50px',
  width: '100px',
  height: '100px',
}


// root component
function FeatureSelection() {
  const { loadData, loading, recordMouseEvent } = useContext(GlobalContext);

  useEffect(() => {
    loadData();
  }, []);

  const captureHover = (event) => {
    const panelName = event.target.id;
    recordMouseEvent(panelName, 'infobox', 'mousehover', '')
}

  return (
    <>
    {!loading ? (
      <div style={ReactLoadingStyle}>
        <ReactLoading
          type={"bars"}
          color={"black"}
          height={"100%"}
          width={"100%"}
        />
      </div>
    ) : (
      <div className="row justify-content-start" style={rowStyle}>
        <div className='col-xl-7' style={{marginLeft: '10px'}}>
          <div className="row">
            <div className="col-6" style={{width: '530px', height: '610px', ...borderStyle}} id='bubbleViewParentDiv'>
              <div className="p-1 mb-1 view-name text-black font-weight-bold" style={bannerStyle}>
                Topic Clusters
                <button data-tip data-for="BubbleViewTip" className='bi bi-info-circle' style={{border: 'none', backgroundColor: 'lightgrey', paddingLeft: '5px', color: 'black', width: "22px", height: "22px"}} id="TopicClusters" onMouseOver={captureHover}></button>
                <ReactTooltip className='custom-color' border textColor='black' backgroundColor='white' id="BubbleViewTip" place="right" effect="solid">
                For more information please refer to the following <br/>
                sections of the datasheet on the About page:<br/>
                -Document clustering methodology<br/>
                -Keywords and cluster titles
                </ReactTooltip>
              </div>
                <BubbleView/>
            </div>
            
            <div  className="col-6" style={{width: '630px', height: '610px', ...borderStyle}}> 
              <div className="p-1 mb-1 view-name text-black font-weight-bold" style={bannerStyle}>
                Topic Similarity
                <button data-tip data-for="SimilarityMatrixTip" className='bi bi-info-circle' style={{border: 'none', backgroundColor: 'lightgrey', paddingLeft: '5px', color: 'black', width: "22px", height: "22px"}} id="TopicSimilarity" onMouseOver={captureHover}></button>
                <ReactTooltip className='custom-color' border textColor='black' backgroundColor='white' id="SimilarityMatrixTip" place="right" effect="solid">
                For more information please refer to the following <br/>
                sections of the datasheet on the About page:<br/>
                -Cluster similarity scoring
                </ReactTooltip>
              </div>
                <CorrelationMatrix/>
            </div>
          </div>
          <div className="row">
            <div  className="col" style={{width: '1280px', height: '600px', ...borderStyle}}> 
              <div className="p-1 mb-1 view-name text-black font-weight-bold" style={bannerStyle}>Topic Timeline</div>
                <TimelineMatrix/>
            </div>
          </div>      
        </div> 

        <div className='col-xl-3' style={{width: '250px', height: '1210px', ...borderStyle, marginLeft: '0px'}}>
          <div className="p-1 mb-1 view-name text-black font-weight-bold" style={bannerStyle}>
            Documents and Summaries
            <button data-tip data-for="NewsReportTip" className='bi bi-info-circle' style={{border: 'none', backgroundColor: 'lightgrey', paddingLeft: '5px', color: 'black', width: "22px", height: "22px"}} id="DocumentsandSummaries" onMouseOver={captureHover}></button>
                <ReactTooltip className='custom-color' border textColor='black' backgroundColor='white' id="NewsReportTip" place="right" effect="solid">
                For more information please refer to the following <br/>
                sections of the datasheet on the About page:<br/>
                -Document summarization methodology
                </ReactTooltip>
          </div>
            <DocumentList/>
        </div>

        <div className='col' style={{...borderStyle, height: '1210px', width: '200px', marginLeft: '0px'}}>
          <div className="p-1 mb-1 view-name text-black font-weight-bold" style={bannerStyle}>Topic Filtering</div>
            <FeatureClickable/>
        </div>
      </div>
    )}
  </>
  );
}


export default FeatureSelection;
