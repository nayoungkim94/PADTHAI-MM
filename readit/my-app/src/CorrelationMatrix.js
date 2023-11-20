import React, {useContext, useEffect} from 'react';
import * as d3 from 'd3';
// import d3Tip from 'd3-tip';
import { tip as d3Tip } from "d3-v6-tip";
import _ from 'lodash';
import {GlobalContext} from './GlobalContext';
import './d3tip.css';


function CorrelationMatrix() {

    const {state, setState, cor_matrix_data, topiclist, onClickMultiCard, matrixorder, titleCase, recordMouseEvent} = useContext(GlobalContext);

    const correlation_matrix_width = 480;
    const size = [correlation_matrix_width + 30, correlation_matrix_width];
    const margin = {
        top: 120,
        bottom: 15,
        left: 5,
        right: 30
    };

    const click_feature_row = state.click_feature_row;
    const click_feature_col = state.click_feature_col;
    const hclust_matrix = cor_matrix_data.hclust_matrix;
    const alphabet_matrix = cor_matrix_data.alphabet_matrix;
    const cluster = null;
    const hclust_ordered_features = cor_matrix_data.hclust_features;
    const alphabet_ordered_features = topiclist.topiclist;
    
    const click_feature_list = state.click_feature_list;

    let node = null;

    const highlightTextColor = '#2166ac';
    const fadeTextColor = 'black';

    const createCorrelationMatrix = () => {
        const ordermethod = matrixorder.matrixorder;
        // console.log('cor matrix rendering ...')
        // console.log('ordermethod', ordermethod)
        let ordered_features = [];
        let data = [];
        let correlation_matrix = [];
        if(ordermethod === 'alphabet'){
            ordered_features = alphabet_ordered_features;
            correlation_matrix = alphabet_matrix;
        } else {
            ordered_features = hclust_ordered_features;
            correlation_matrix = hclust_matrix;
        }

        data = correlation_matrix.map((row, row_idx) =>
            row.map((item, col_idx) => {
                return {
                    row: row_idx,
                    col: col_idx,
                    value: item
                };
            })
        );

        var colorScale = d3.scaleSequential(d3.interpolateBlues) //interpolateRdBu, interpolateGreens, interpolateReds
            .domain([0, 1]);

        const cols = data.length;
        const rows = data.length;

        const size1 = d3.min(size);

        let width = size1 - margin.left - margin.right;
        let height = size1 - margin.top - margin.bottom;

        if (width >= height) {
            width = height;
        } else {
            height = width;
        }

        const svg = d3.select(node)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const tip = d3Tip()
            .attr('id', 'correlation_matrix_tooltip')
            .attr("class", "d3-tip")
            .style('background-color', 'rgba(255, 255, 255, .7)')
            .style("font-size", '12px')
            .html((EVENT,d) => (`Row Topic: <span style='color:black'><strong>${titleCase(ordered_features[d.row])}</strong></span> <br />`
                + `Column Topic: <span style='color:black'><strong>${titleCase(ordered_features[d.col])}</strong></span> <br />`
                + `Cosine similarity:<span style='color:black'><strong>${d.value}</strong></span>`));

        svg.call(tip);

        const horizontalScale = d3.scaleBand()
            .domain(d3.range(cols))
            .range([0, width])
        

        const verticalScale = d3.scaleBand()
            .domain(d3.range(rows))
            .range([0, height])
        

        const nameScale = d3.scaleOrdinal()
            .domain(ordered_features)
            .range(d3.range(width / (2 * cols), width, width / cols));

        const xAxis = d3.axisTop(nameScale);
        const yAxis = d3.axisRight(nameScale);

        // const prediction = prediction_label;
        
        const x_axis_group = svg.append('g')
            .attr('class', 'axis')
            .attr('transform', `translate(0, -2)`)
            .call(xAxis)
            .selectAll('g')
            .attr('id', (d, i) => {
                return `axis_x_group_${i}`;
            })

        const clicked_row_index = click_feature_row;

        x_axis_group.select('text')
            .attr('class', 'axis-label-x')
            .attr('id', (d, i) => {return `axis_label_x_${i}`})
            .attr("y", -7)
            .attr("x", 7)
            .attr("transform", "rotate(-45, 0, 0)")
            .style("text-anchor", "start")
            .style("fill", (d, i) => {
                // if (prediction_label.includes(d)) {
                //     return "darkOrange";
                // } else if (i === clicked_row_index){
                //     return "blue";
                // } else if (click_feature_list.includes(d)) {
                //     return 'blue';
                // } else
                //     return "black";
                if (i === clicked_row_index){
                    return highlightTextColor;
                } else if (click_feature_list.includes(d)) {
                    return highlightTextColor;
                } else {
                    return fadeTextColor;
                }
            })
            .text(d => {return titleCase(d);})
            .style("font-size", (d, i) => {
                if (i === clicked_row_index){
                    return 12;
                }
            })
            .on('click', (event, d) => {
                // const sel = document.getElementById('order');
                // const value = sel.options[sel.selectedIndex].value;
                // setMatrixorder({matrixorder: value});
                onClickMultiCard(d, 'TopicSimilarity');
            })

        svg.append('g')
            .attr('class', 'axis')
            .attr('transform', `translate(${width}, 0)`)
            .call(yAxis)
            .selectAll('g')
            .attr('id', (d, i) => {
                return `axis_y_group_${i}`;
            })
            .selectAll('text')
            .attr('class', 'axis-label-y')
            .text(d => {return titleCase(d);})
            .style("fill", (d, i) => {
                // if (prediction_label.includes(d)) {
                //     return "darkOrange";
                // } else if (i === clicked_row_index){
                //     return "blue";
                // } else if (click_feature_list.includes(d)) {
                //     // return 'red';
                //     return 'blue';
                // } else
                //     return "black";
                if (i === clicked_row_index){
                        return highlightTextColor;
                } else if (click_feature_list.includes(d)) {
                    return highlightTextColor;
                } else {
                    return fadeTextColor;
                }
            })
            .style("font-size", (d, i) => {
                if (i === clicked_row_index){
                    return 13;
                }
            })
            .on('click', (event, d) => {
                const sel = document.getElementById('order');
                const value = sel.options[sel.selectedIndex].value;
                // setMatrixorder({matrixorder: value});
                onClickMultiCard(d, 'TopicSimilarity');
            })

        if (cluster !== null && typeof cluster !== 'undefined') {
            const feature_cluster = ordered_features.map((d, i) => {
                return { "name": d, "cluster": cluster[d], "order": i }
            })

            feature_cluster.sort((a, b) => {
                if (a.cluster !== b.cluster) {
                    return a.cluster - b.cluster;
                } else {
                    return a.order - b.order;
                }
            })

            const uniq_cluster = _.uniqBy(feature_cluster, 'cluster')

            if(uniq_cluster.length > 1) {
                uniq_cluster.forEach(obj => {
                    const subgroup = feature_cluster.filter(d => d.cluster === obj.cluster)
                    const tmpLen = subgroup.length;
                    const startIndex = subgroup[0].order;
                    const endIndex = subgroup[tmpLen - 1].order;
                    const tmpFeatureSize = Math.abs(endIndex - startIndex) + 1;
                    svg.append("rect")
                        .attr("x", horizontalScale(startIndex))
                        .attr("y", verticalScale(startIndex))
                        .attr("width", horizontalScale.bandwidth() * tmpFeatureSize)
                        .attr("height", verticalScale.bandwidth() * tmpFeatureSize)
                        .attr('fill-opacity', 0)
                        .attr('stroke', 'black')
                        .style("stroke-width", 3);
                })
            }

        }

        if (click_feature_row !== null && typeof click_feature_row !== 'undefined') {
            const tmprow = click_feature_row;
            const tmpcol = click_feature_col;
            
            svg.append("rect")
                .attr("x", horizontalScale(tmprow))
                .attr("y", 0)
                .attr("width", horizontalScale.bandwidth())
                .attr("height", rows * verticalScale.bandwidth())
                .attr('fill-opacity', 0)
                .style("stroke-width", 3)
                .style('opacity', 0.7);

            svg.append("rect")
                .attr("x", 0)
                .attr("y", verticalScale(tmpcol))
                .attr("width", rows * horizontalScale.bandwidth())
                .attr("height", verticalScale.bandwidth())
                .attr('fill-opacity', 0)
                .style("stroke-width", 3)
                .style('opacity', 0.7);
        }

        const groups = svg.selectAll(null)
            .data(data)
            .enter()
            .append('g')
            .attr('id', (d, i) => {
                return `cormatrix_g_${i}`;
            })
            .attr("transform", (d, i) => { return `translate(0, ${verticalScale(i)})` });

        const rects = groups.selectAll(null)
            .data(function (d) { return d })
            .enter()
            .append('rect')
            .attr('id', (d) => {
                return `cormatrix_rect_${d.row}_${d.col}`
            })
            .attr('fill', (d) => {return "white"})
            .attr('stroke', (d) => {
                // if (d.row === click_row && d.col === click_col){
                //     return "#aa9c3c";
                // } else {
                //     return "#eee";
                // }
                return "#eee";
            })
            .attr('stroke-width', (d) => {
                // if (d.row === click_row && d.col === click_col)
                //     return 2;
                // else
                //     return 0.2;
                return 0.2;
            })
            .attr("x", function (d, i) {
                return horizontalScale(i);
            })
            .attr("width", horizontalScale.bandwidth())
            .attr("height", verticalScale.bandwidth())
            .attr('fill-opacity', 0)
            .attr('opacity', 0.7)
            // .on('click', d => setState({...state, click_row: d.row, click_col: d.col}))
            .on('mouseover', (event, d) => {
                // d3.select(`#cormatrix_ellipse_${d.row}_${d.col}`).style("opacity", 1.0);
                event.target.style.stroke = '#810f7c';
                event.target.style.strokeWidth = 2.0;
                tip.show(event, d);
                recordMouseEvent('TopicSimilarity', 'hoverMatrix', 'mousehover', `${ordered_features[d.row]}+${ordered_features[d.col]}`)
            })
            .on('mouseout', (event, d) =>{
                // if(!click_feature_list.includes(ordered_features[d.row])){
                //     d3.select(`#cormatrix_ellipse_${d.row}_${d.col}`).style("opacity", 0.3);
                // }
                event.target.style.stroke = '#eee';
                event.target.style.strokeWidth = 0.2;
                tip.hide(event, d);
            });

        const max_circle_radius_x = horizontalScale.bandwidth() / 2;
        const max_circle_radius_y = verticalScale.bandwidth() / 2;

        const value_to_radius_ratio = d3.scaleLinear()
            .domain([0, 1])
            .range([0.3, 1])

        const circles = groups.selectAll("g")
            .data(d => { return d; })
            .enter()
            .insert("ellipse", "rect")
            .attr('id', (d) => {
                return `cormatrix_ellipse_${d.row}_${d.col}`
            })
            .attr('fill', d => {
                return colorScale(d.value);
            })
            .attr("cx", (d, i) => {
                return horizontalScale(i) + max_circle_radius_x;
            })
            .attr("cy", (d) => {
                return max_circle_radius_y;
            })
            .attr("rx", (d) => {
                if(d.row != d.col){
                    return max_circle_radius_x * value_to_radius_ratio(Math.abs(d.value))
                } else {
                    return 0;
                }
            })
            .attr("ry", (d) => {
                if(d.row != d.col){
                    return max_circle_radius_y * value_to_radius_ratio(Math.abs(d.value))
                } else {
                    return 0;
                }
            })
            .attr('opacity', (d) => {
                const click_feature_row_list = click_feature_list.map(feature => {
                    return ordered_features.indexOf(feature);
                });
                const click_feature_col_list = click_feature_list.map(feature => {
                    return ordered_features.indexOf(feature);
                });

                // if (d.row === click_feature_row || d.col === click_feature_col) {
                //     return 1;
                // } else if (d.row === click_row && d.col === click_col) {
                //     return 1;
                // } else 
                if(click_feature_row_list.includes(d.row) || click_feature_col_list.includes(d.col)){
                    return 1;
                } else {
                    return 0.3;
                }
            });

        const legend_top = height + margin.top + 10;
        const legend_height = verticalScale.bandwidth();

        const legend_svg = d3.select(node)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${legend_top})`);

        const defs = legend_svg.append("defs");

        const gradient = defs.append("linearGradient")
            .attr("id", "linear-gradient");

        let stops = [];
        const length = 10;
        for (let i = 0; i <= length; i++) {
            const offset = i / length;
            // const value = offset * 2 - 1;
            const value = offset;
            stops.push({ 'offset': offset, 'color': colorScale(value), 'value': value });
        }

        gradient.selectAll("stop")
            .data(stops)
            .enter()
            .append("stop")
            .attr("offset", (d) => (100 * d.offset + "%"))
            .attr("stop-color", (d) => (d.color));

        legend_svg.append("rect")
            .attr("width", width)
            .attr("height", legend_height)
            .style("stroke", 'black')
            .style("stroke-width", 0.8)
            .style("fill", "url(#linear-gradient)");

        legend_svg.selectAll('line')
            .data(stops)
            .enter()
            .append('line')
            .attr('x1', (d) => (width * d.offset))
            .attr('y1', legend_height)
            .attr('x2', (d) => (width * d.offset))
            .attr('y2', legend_height + 5)
            .style("stroke", 'black')
            .style("stroke-width", 0.8);

        legend_svg.selectAll("text")
            .data(stops)
            .enter()
            .append("text")
            .attr("x", (d) => (width * d.offset))
            .attr("dy", 35)
            .style('text-anchor', 'middle')
            
            .text((d) => (d.value.toFixed(2)))
            .style("font-size", '12px');
    };

    const handleOrderChange = (event) => {
        // console.log(event.target.value);
        recordMouseEvent('TopicSimilarity', 'dropdown', `${event.target.value}`, '')

        const cols = hclust_ordered_features.length;
        const rows = cols;

        const size1 = d3.min(size);

        let width = size1 - margin.left - margin.right;
        let height = size1 - margin.top - margin.bottom;

        if (width >= height) {
            width = height;
        } else {
            height = width;
        }

        const horizontalScale = d3.scaleBand()
        .domain(d3.range(cols))
        .range([0, width])
    

        const verticalScale = d3.scaleBand()
            .domain(d3.range(rows))
            .range([0, height])
        
        const max_circle_radius_x = horizontalScale.bandwidth() / 2;

        let init_order = [];
        let goto_order = [];

        const ordermethod = matrixorder.matrixorder;
        if(ordermethod === 'alphabet'){
            init_order = alphabet_ordered_features;
        } else {
            init_order = hclust_ordered_features;
        }

        if(event.target.value === 'alphabet'){
            goto_order = alphabet_ordered_features;
        } else {
            goto_order = hclust_ordered_features;
        }

        const nameScale = d3.scaleOrdinal()
            .domain(goto_order)
            .range(d3.range(width / (2 * cols), width, width / cols));
        
        for (let i = 0; i < rows; i++){

            d3.select(`#axis_y_group_${i}`).transition().delay(100).duration(2000)
                .attr('transform', (d) => {
                    const trans_y = nameScale(init_order[i]);
                    return `translate(0, ${trans_y})`;
                })

            d3.select(`#cormatrix_g_${i}`).transition().delay(100).duration(2000)
                .attr('transform', (d) => {
                    const gotoIndex = goto_order.indexOf(init_order[i]);
                    // const originalValue = init_order[i];
                    // const gotoIndex = _.indexOf(goto_order, originalValue);
                    return `translate(0, ${verticalScale(gotoIndex)})`;
                })

            d3.select(`#axis_x_group_${i}`).transition().delay(100).duration(2000)
                .attr('transform', (d) => {
                    const trans_x = nameScale(init_order[i]);
                    return `translate(${trans_x}, 0)`;
                })

            for (let j = 0; j < cols; j++){
                d3.select(`#cormatrix_rect_${i}_${j}`).transition().delay(100).duration(2000)
                .attr('x', (d) => {
                    const gotoIndex = goto_order.indexOf(init_order[j]);
                    // const originalValue = init_order[j];
                    // const gotoIndex = _.indexOf(goto_order, originalValue);
                    return horizontalScale(gotoIndex);
                })

                d3.select(`#cormatrix_ellipse_${i}_${j}`).transition().delay(100).duration(2000)
                .attr('cx', (d) => {
                    const gotoIndex = goto_order.indexOf(init_order[j]);
                    // const originalValue = init_order[j];
                    // const gotoIndex = _.indexOf(goto_order, originalValue);
                    return horizontalScale(gotoIndex) + max_circle_radius_x;
                })
            }
        }
    }

    useEffect(() => {
        node.innerHTML = "";
        const tooltip = document.getElementById('correlation_matrix_tooltip')
        tooltip && tooltip.remove();
        createCorrelationMatrix();
    }, [click_feature_list.toString(),state.click_timeline_cell])

    const width = size[0];
    const height = size[1] + 30;
    return (
        <>
            <p>Order:
                <select id="order" onChange={handleOrderChange} defaultValue='alphabet'>
                <option value="alphabet">by Alphabet</option>
                <option value="cluster">by Cluster</option>
                </select>
            </p>
            <svg 
                ref={n => node = n} 
                width={width} 
                height={height}>
            </svg>
        </>
    );

}

export default CorrelationMatrix;