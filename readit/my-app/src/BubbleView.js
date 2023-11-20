import React, {useContext, useEffect} from 'react';
import * as d3 from 'd3';
// import d3Tip from 'd3-tip';
import { tip as d3Tip } from "d3-v6-tip";
import _ from 'lodash';
import {GlobalContext} from './GlobalContext';


function BubbleView() {

    const { state, setState, topiclist, timelinedata, onClickMultiCard, titleCase, recordMouseEvent} = useContext(GlobalContext);

    const clusters = timelinedata.nodes;
    const keywords = timelinedata.keywords;
    const topics = topiclist.topiclist;
    const click_feature_list = state.click_feature_list;

    let svgnode = null;

    const width = 500, height = 500;
    const highlightColor = '#4393c3';
    const fadeColor = '#D3D3D3';
    // const highlightOpacity = 1.0;
    // const fadeOpacity = 0.5;
    // const highlightTextColor = 'black';
    // const fadeTextColor = 'white';//'#808080';
    const mouseHoverColor = '#f4a582';

    const round = (value, precision) => {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }


    const createBubbleView = () => {
        const d = 450;
        const fontSize  = 11;
        const margin = {top: 5, right: 5, bottom: 5, left: 15};

        var temp_data = {
            "children": clusters
        };

        var bubble = d3.pack(temp_data)
            .size([d, d])
            .padding(1.5);

        const svg = d3.select(svgnode)
            .append("g")
            .attr("width", d)
            .attr("height", d)
            .attr("class", "bubble")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
        
        const tip = d3Tip()
            .attr('id', 'bubbleview_tooltip')
            .attr("class", "d3-tip")
            // .style('background-color', 'rgba(255, 255, 255, .7)')
            .style("font-size", '14px')
            .html((EVENT, d) => {
                //filter keywords by topic
                const keyword_list =  keywords.filter(k => k.cluster == d.data.cluster);
                keyword_list.sort((a,b) => b.tfidf - a.tfidf); //descending order
                const tmpMaxWidth = 100;
                const offsetY = 5;
                const barHeight = 15;
                const maxScore = d3.max(keyword_list, d => d.tfidf)
                const offsetScore = 0.05
                const xAxis = d3.scaleLinear()
                  .domain([0, round(maxScore + offsetScore, 1)])
                  .range([0, tmpMaxWidth]);
                const bars = keyword_list.map((k,i) => {
                    const x = 90;
                    const y = offsetY + barHeight * i;
                    const width = xAxis(k.tfidf);
                    return `<g font-size="14" font-family="sans-serif" transform="translate(0, ${offsetY + barHeight * i})"><rect x=${x} y="0" width=${width} height=${barHeight*0.8} fill="#69b3a2" rx="2"></rect><text fill="#000" x=${x + width + 2} y=${0.5*barHeight + 2.5}>${k.tfidf.toFixed(2)}</text><text fill="#000" x= ${x-5} y=${0.5*barHeight + 2.5} text-anchor="end">${k.keyword}</text></g>`
                })
                // Create a dummy receptacle
                var receptacle = document.createElement('div');
                // Wrap the svg string to a svg object (string)
                var svgfragment = `<svg width="220px" height=${offsetY*2 + barHeight * keyword_list.length}>` + bars + '</svg>';

                // Add all svg to the receptacle
                receptacle.innerHTML = '' + svgfragment;
                return `Topics:<span style='color:black'><strong>${titleCase(topics[d.data.cluster])}</strong></span> <br />`
                + `No. of News:<span style='color:black'><strong>${d.data.count}</strong></span> <br />`
                + `${receptacle.innerHTML}`
            });

        svg.call(tip);

        var nodes = d3.hierarchy(temp_data)
            .sum( (d) => { 
                return d.count;
                // return d.reportIDs.length;
            });
        
        var node = svg.selectAll(".bubble")
            .data(bubble(nodes).descendants())
            .enter()
            .filter(function(d){
                return  !d.children
            })
            .append("g")
            .attr("class", "bubble")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
    
        // node.append("title")
        //     .text(function(d) {
        //         return d.cluster + ": " + d.count;
        //     });
        
        node.append("circle")
            .attr("r", function(d) {
                return d.r;
            })
            .style("fill", 'white')
            .attr('opacity', 0)
            .on('mouseover', (event, d) => {
                // $(`#ellipse_${d.row}_${d.col}`).css('fill', 'red');
                d3.select(`#bubbleview_circle_${d.data.cluster}`).style("fill", mouseHoverColor);
                tip.direction('e');
                tip.show(event, d);
                recordMouseEvent('TopicClusters', 'hoverBubble','mousehover', topics[d.data.cluster])
            })
            .on('mouseout', (event, d) =>{
                let color = fadeColor;
                if (click_feature_list.includes(topics[d.data.cluster])) {
                    color = highlightColor;
                }
                d3.select(`#bubbleview_circle_${d.data.cluster}`).style("fill", color);
                tip.hide(event, d);
            })
            .on('click', (event, d) => {
                onClickMultiCard(topics[d.data.cluster], 'TopicClusters');
            });

        node.insert("text", 'circle')
            .attr("dy", ".2em")
            .style("text-anchor", "middle")
            .text(function(d) {
                return titleCase(clusters[d.data.cluster].label.substring(0, d.r / 3));
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", function(d){
                // return d.r/5;
                return fontSize;
            })
            .attr("fill", "white")
            // .attr("fill", (d) => {
            //     if (click_feature_list.includes(topics[d.data.cluster])) {
            //         return highlightTextColor;
            //     } else {
            //         return fadeTextColor;
            //     }
            // })
    
        node.insert("text", 'circle')
            .attr("dy", "1.3em")
            .style("text-anchor", "middle")
            .text(function(d) {
                return d.data.count;
                // return d.data.reportIDs.length;
            })
            .attr("font-family",  "Gill Sans", "Gill Sans MT")
            .attr("font-size", function(d){
                // return d.r/5;
                return fontSize;
            })
            .attr("fill", "white")
        
        node.insert("circle", "text")
            .attr('id', (d) => {
                return `bubbleview_circle_${d.data.cluster}`
            })
            .attr("r", (d) => {
                return d.r;
            })
            .attr('fill', (d) => {
                if (click_feature_list.includes(topics[d.data.cluster])) {
                    return highlightColor;
                } else {
                    return fadeColor;
                }
            })
            // .style("opacity", (d) => {
            //     if (click_feature_list.includes(topics[d.data.cluster])) {
            //         return 1.0;
            //     } else {
            //         return 0.6;
            //     }
            // })
            // .attr('stroke', (d) => {
            //     if (click_feature_list.includes(topics[d.data.cluster])) {
            //         return 'blue';
            //     } else {
            //         return "#eee";
            //     }
            // })
            // .style("stroke-width", (d) => {
            //     if (click_feature_list.includes(topics[d.data.cluster])) {
            //         return 2;
            //     } else {
            //         return 0;
            //     }
            // });
    };



    useEffect(() => {
        svgnode.innerHTML = "";
        const tooltip = document.getElementById('bubbleview_tooltip')
        tooltip && tooltip.remove();
        createBubbleView();
    }, [click_feature_list.toString(),state.click_timeline_cell])

    const svgHeight = height + 0;
    const svgWidth = width + 0;
    const parentElm = document.getElementById('bubbleViewParentDiv');
    let maxWidth = '370px';

    if(parentElm != null){
        const parentWidth = parentElm.clientWidth;
        maxWidth = maxWidth > parentWidth ? maxWidth : parentWidth;
    }

    return (
        // <div id="BubbleViewDiv" style={{overflow: 'auto', width: maxWidth}}>
            <svg 
                ref={n => svgnode = n} 
                width={svgWidth} 
                height={svgHeight}>
            </svg>
        // </div>
    );

}

export default BubbleView;