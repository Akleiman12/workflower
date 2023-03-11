import { Workflow, WorkflowNode, WorkflowNodeTypeEnum } from '@workflower/wf-shared';
import CytoscapeComponent from 'react-cytoscapejs';
import React from 'react';
import { v4 } from 'uuid';
import { ElementDefinition, LayoutOptions, NodeSingular, Position, Stylesheet } from 'cytoscape';

// Set node shape in graph depending on WorkflowNode.type
const NodeShapeArray = ['ellipse', 'ellipse', 'diamond', 'rectangle'];

// Set node color in graph depending on WorkflowNode.type
const NodeColorArray = ['lightgreen', 'pink', 'lightblue', 'yellow']

export class WorkflowGrapher extends React.Component<{ workflow: Workflow }, { workflow: Workflow, elements: ElementDefinition[], stylesheet: Stylesheet[],  error: Error | null}> {

    // Options for graph positioning of nodes on render
    options: LayoutOptions = {
        name: 'random',
        fit: true, 
        padding: 30, 
        boundingBox: undefined, 
        animate: false, 
        animationDuration: 500, 
        animationEasing: undefined, 
        animateFilter: function ( node: NodeSingular, i: number ){ return true; }, 
        ready: undefined, 
        stop: undefined, 
        transform: function (node: NodeSingular, position: Position ){ return position; } 
    };

    constructor(props: { workflow: Workflow }) {
        super(props);
        const graphProps = this.createGraph(props.workflow);
        if (graphProps) {
            this.state = { 
                workflow: props.workflow,
                elements: graphProps.elements,
                stylesheet: graphProps.stylesheet,
                error: null
            };
        }
    }

    componentDidUpdate(prev: { workflow: Workflow }): void {
        if (prev.workflow.id !== this.props.workflow.id) {
            const graphProps = this.createGraph(this.props.workflow);
            if (graphProps) {
                this.setState({
                    elements: graphProps.elements,
                    stylesheet: graphProps.stylesheet,
                    workflow: this.props.workflow
                })

            }
        }
    }

    /**
     * Create all graph elements (Nodes and Edges) with their respective styles
     * @param workflow 
     * @returns { elements: ElementDefinition[], stylesheet: Stylesheet[] }
     */
    createGraph(workflow: Workflow) {
        const nodesOrString = workflow.nodes;
        if (nodesOrString) {
            const nodes: WorkflowNode[] = typeof nodesOrString === 'string' ? JSON.parse(nodesOrString) : nodesOrString.slice();

            // IDs mapper between a WorkflowNode and a graphNode 
            const idsMap: Map<number, string> = new Map();

            // Stylesheet to define specific styles for each node and edge
            const stylesheet: Stylesheet[]  = []
            
            try {
                // Create Nodes
                const graphNodes: ElementDefinition[] = [];
                nodes.forEach((node) => {
                    if (isNaN(node.id) || isNaN(node.type)) throw new Error('Error loading graph nodes');
                    const graphNodeId = v4()
                    idsMap.set(node.id, graphNodeId);
                    stylesheet.push({
                        selector: `#${graphNodeId}`,
                        style: {
                            width: 40,
                            height: 40,
                            shape: NodeShapeArray[node.type] as cytoscape.Css.PropertyValueNode<cytoscape.Css.NodeShape>,
                            'background-color': NodeColorArray[node.type],
                            label: 'data(label)'
                        }
                    });
                    graphNodes.push({
                        data : {
                            id: graphNodeId,
                            label: `${WorkflowNodeTypeEnum[node.type]} - ${node.id}`
                        }
                    })
                });
    
                // Create Edges
                const graphEdges: ElementDefinition[] = [];
                nodes.forEach((node) => {
                    node.outgoingNodes?.forEach((outgoingNode) => {
                        const srcId = idsMap.get(node.id);
                        const trgtId = idsMap.get(outgoingNode);
                        const graphEdgeId = v4();
                        if (!srcId || !trgtId) throw new Error('Error loading graph edges');
                        stylesheet.push({
                            selector: `edge#${graphEdgeId}`,
                            style: {
                                width: 3,
                                "curve-style": 'bezier',
                                "target-arrow-shape": "triangle"
                            }
                        });
                        graphEdges.push({
                            data: {
                                id: graphEdgeId,
                                source: srcId,
                                target: trgtId,
                                arrow: 'triangle',
                                label: `Edge from ID-${node.id} to ID-${outgoingNode}`,
                            }
                        })
                    })
                });
    
                return { elements: [...graphNodes, ...graphEdges], stylesheet };
            } catch (e: unknown) {
                if ( e instanceof Error) {
                    this.setState({
                        error: e
                    })
                }
            }
        }
    }

    /**
     * Abstracted graph element to be filled with all the necessary data (elements, stylesheet and options for rendering)
     */
    generateGraphComponent() {
        return <CytoscapeComponent key={v4()} className='graph' layout={this.options} elements={this.state.elements} stylesheet={this.state.stylesheet}></CytoscapeComponent>
    }

    render() {
        return this.state.error ? <div>{ this.state.error.message }</div> : this.generateGraphComponent()
    }
}