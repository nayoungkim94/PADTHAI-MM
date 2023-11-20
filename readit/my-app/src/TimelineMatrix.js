import React, {useContext, useEffect} from 'react';
import * as d3 from 'd3';
import { tip as d3Tip } from "d3-v6-tip";
import _ from 'lodash';
import {GlobalContext} from './GlobalContext';


function TimelineMatrix() {

    const { state, setState, topiclist, timelinedata, onClickMultiCard, onClickTimelineCell, titleCase, recordMouseEvent} = useContext(GlobalContext);
    
    const click_feature_list = state.click_feature_list;
    const nodes = timelinedata.nodes;
    const links = timelinedata.links;
    const timeframes = timelinedata.timeframes;
    const topics = topiclist.topiclist;

    let svgnode = null;

    const width = 700, height = 450;
    const highlightTextColor = '#2166ac';
    const fadeTextColor = 'black';
    const cellHighlightColor = '#4393c3';
    const cellFadeColor = 'lightgrey';
    const mouseHoverColor = '#f4a582';

    const createTimelineMatrix = () => {
        const n = nodes.length;
        const m = timeframes.length;
        const margin = {top: 80, right: 50, bottom: 10, left: 200};
        const x = d3.scaleBand().rangeRound([0, width]);
        const y = d3.scaleBand().rangeRound([0, height]);
        const z = d3.scaleLinear().domain([0, 4]).clamp(true);
        const c = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.range(10));

        const svg = d3.select(svgnode)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const tip = d3Tip()
            .attr('id', 'timeline_tooltip')
            .attr("class", "d3-tip")
            .style('background-color', 'rgba(255, 255, 255, .7)')
            .style("font-size", '12px')
            .html((EVENT, d) => {
                // const week_start_date = timeframes[d.x].week_start_date.replace('/2011', '')
                // const week_end_date = timeframes[d.x].week_end_date.replace('/2011', '')
                const week_start_date = timeframes[d.x].week_start_date;
                const week_end_date = timeframes[d.x].week_end_date;
                const tmpTime = week_start_date + '-' + week_end_date;
                return `Topics:<span style='color:black'><strong>${titleCase(topics[d.y])}</strong></span> <br />`
                + `Time:<span style='color:black'><strong>${tmpTime}</strong></span> <br />`
                + `Number of News report:<span style='color:black'><strong>${d.z.toFixed(0)}</strong></span>`});

        svg.call(tip);
        
        var matrix = []
        // Compute index per node
        nodes.forEach((node, i) => {
            matrix[i] = d3.range(m).map(function(j) {
                var d = {x: j, y: i, z: 0}; //x:weekindex, y:clusterindex
                return d;
            });
        });

        // Convert links to matrix; count character occurrences.
        const cluster_idxes = Array.from(Array(n).keys());
        const week_idxes = Array.from(Array(m).keys());

        links.forEach(function(link) {
            matrix[link.cluster][link.week].z = link.count;
        });
    
        // The default sort order.
        x.domain(week_idxes);
        y.domain(cluster_idxes);

        svg.append("rect")
            .style('fill', '#eee')
            .attr("width", m*x.bandwidth())
            .attr("height", n*y.bandwidth())
            .attr("y", y(0))
            .attr("x",x(0));
      
        const row = svg.selectAll(".row")
            .data(cluster_idxes)
            .enter().append("g")
            .attr("class", "row")
            .attr("transform", d => {
                return "translate(0," + y(d) + ")";
            })
        row.append("line")
            .attr("x2", width)
            .attr("stroke", "#fdf6ee");
        row.append("text")
            .attr('class', 'timeline-label-x')
            .attr("x", -6)
            .attr("y", y.bandwidth() / 2)
            .attr("dy", ".32em")
            .style("font-size", '12px')
            .attr("text-anchor", "end")
            .style('fill', (d, i) => {
                const label = nodes[d].label
                if (click_feature_list.includes(label)) {
                    return highlightTextColor;
                } else {
                    return fadeTextColor;
                }
            })
            .text(d => { return titleCase(nodes[d].label); })
            .on('click', (event, d) => {
                onClickMultiCard(nodes[d].label, 'TopicTimeline');
            });
        svg.append("g")
            .attr("class", "row")
            .attr("transform", "translate(0," + (y(cluster_idxes.length-1)+y.bandwidth()) + ")")
            .append("line")
            .attr("x2", width)
            .attr("stroke", "#fdf6ee");

        const column = svg.selectAll('.column')
            .data(week_idxes)
            .enter().append("g")
            .attr("class", "column")
            .attr("transform", (d) => {
                return "translate(" + x(d) + ")rotate(-90)";
            });
        column.append("line")
            .attr("stroke", "#fdf6ee")
            .attr("x1", -height);
        column.append("text")
            .attr("x", 6)
            .attr("y", x.bandwidth() / 2)
            .attr("dy", "-0.65em")
            .attr("dx", "0.65em")
            .attr("text-anchor", "start")
            .style("font-size", '12px')
            .attr('transform', 'rotate(45)')
            .text((d) => {
                const week_start_date = timeframes[d].week_start_date.replace('/2011', '')
                const week_end_date = timeframes[d].week_end_date.replace('/2011', '')
                return week_start_date + '-' + week_end_date;
            });
        svg.append("g")
            .attr("class", "column")
            .attr("transform", "translate(" + (x(week_idxes.length-1)+x.bandwidth()) + ")rotate(-90)")
            .append("line")
            .attr("x1", -height)
            .attr("stroke", "#fdf6ee");
        
        const groups = svg.selectAll(null)
            .data(matrix)
            .enter()
            .append('g')
            .attr("transform", (d, i) => { return `translate(0, ${y(i)})` });

        const cells = groups.selectAll('.cell')
            .data((d) => { return d })
            .enter().append("rect")
            .filter((d) => { return d.z > 0 })
            .attr("class", "cell")
            .style('fill', (d) => {
                const label = nodes[d.y].label;
                if (click_feature_list.includes(label)) {
                    return cellHighlightColor;
                } else {
                    return cellFadeColor;
                }
            })
            .attr('x', (d) => {
                return x(d.x)+1;
            })
            .attr('y', 1)
            .attr('width', x.bandwidth()-2)
            .attr('height', y.bandwidth()-2)
            .attr('stroke', (d) => {
                if(state.click_timeline_cell.clusterIndex == d.y && state.click_timeline_cell.weekIndex == d.x){
                    return '#810f7c';
                } else {
                    return '#eee';
                }
            })
            .style("stroke-width", (d) => {
                if(state.click_timeline_cell.clusterIndex == d.y && state.click_timeline_cell.weekIndex == d.x){
                    return 2.5;
                } else {
                    return 0;
                }
            })
            .on('mouseover', (event, d) => { 
                event.target.style.fill = mouseHoverColor;
                tip.show(event, d);
                const week_start_date = timeframes[d.x].week_start_date;
                const week_end_date = timeframes[d.x].week_end_date;
                const tmpTime = week_start_date + '-' + week_end_date;
                recordMouseEvent('TopicTimeline', 'hoverTimeline', 'mousehover', `${nodes[d.y].label}+${tmpTime}`)
            })
            .on('mouseout', (event, d) =>{
                const label = nodes[d.y].label;
                if (click_feature_list.includes(label)) {
                    event.target.style.fill = cellHighlightColor;
                } else {
                    event.target.style.fill = cellFadeColor;
                };
                tip.hide(event, d);
            })
            .on('click', (event, d)=>{
                const week_start_date = timeframes[d.x].week_start_date;
                const week_end_date = timeframes[d.x].week_end_date;
                const tmpTime = week_start_date + '-' + week_end_date;
                const cellObj = {
                    'clusterIndex': d.y,
                    'weekIndex': d.x,
                    'clusterName': nodes[d.y].label,
                    'weekName': tmpTime
                }
                if(_.isEmpty(state.click_timeline_cell)){
                    recordMouseEvent('TopicTimeline', 'check', 'click', `${nodes[d.y].label}+${tmpTime}`)
                    onClickTimelineCell(cellObj, nodes[d.y].label);
                } else {
                    if(state.click_timeline_cell.clusterIndex == d.y && state.click_timeline_cell.weekIndex == d.x){
                        recordMouseEvent('TopicTimeline', 'uncheck', 'click', `${nodes[d.y].label}+${tmpTime}`)
                        onClickTimelineCell({}, nodes[d.y].label);
                    } else {
                        recordMouseEvent('TopicTimeline', 'check', 'click', `${nodes[d.y].label}+${tmpTime}`)
                        onClickTimelineCell(cellObj, nodes[d.y].label);
                    }
                }
            })
    };

    useEffect(() => {
        svgnode.innerHTML = "";
        const tooltip = document.getElementById('timeline_tooltip')
        tooltip && tooltip.remove();
        createTimelineMatrix();
    }, [click_feature_list.toString(), state.click_timeline_cell])

    const svgHeight = height + 200;
    const svgWidth = width + 400;
    return (
        <svg 
            ref={n => svgnode = n} 
            width={svgWidth} 
            height={svgHeight}>
        </svg>
    );

}

export default TimelineMatrix;