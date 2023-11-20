import React, {useContext} from 'react';
import { GlobalContext}  from './GlobalContext';
import './ScatterPlotOfFeatures.css';

const btnStyle = {background: '#adb5bd33', borderColor: '#1d21243b', padding: '2px 8px 2px 8px', margin: '2px 2px 2px 2px', fontSize: '14px'};


function FeatureClickable() {

    const {state, topiclist, onClickMultiCard, SelectAllFeatures, ClearAllFeatures, titleCase} = useContext(GlobalContext);
    const click_feature_list = state.click_feature_list;
    const features =  topiclist.topiclist;

    const defaultColors = ["#a6cee3", "#ff7f00", "#b2df8a", "#1f78b4", "#fdbf6f", "#33a02c", "#cab2d6", "#6a3d9a", "#fb9a99", "#e31a1c", "#ada815", "#b15928"];
    const legendHTML = features.map((d, i) => {
        // const mycolor = defaultColors[i % defaultColors.length];
        return (
            <tr key={d}>
                <td>
                <input readOnly id={d} className='legend' type='checkbox' onClick={event => onClickMultiCard(event.target.id, 'TopicFiltering')} checked={click_feature_list.includes(d)} />
                {/* <input readOnly id={d} className='legend' type='checkbox' /> */}
                <span style={{color: 'black', marginLeft: '5px'}}>{titleCase(d)}</span>
                </td>
            </tr>
        )
    });

    return (
        <div id='legend' style={{marginTop: '2px', marginLeft: '10px', marginRight: '10px'}}>
            <button onClick={event => SelectAllFeatures('TopicFiltering')} className='btn' style={btnStyle}>Select All</button>
            <button onClick={event => ClearAllFeatures('TopicFiltering')} className='btn' style={btnStyle}>Clear All</button>
            <table id='legendtable' style={{fontSize: '14px', width: '230px'}}>
                <tbody>
                    {legendHTML}
                </tbody>
            </table>
        </div>
    )
}

export default FeatureClickable;