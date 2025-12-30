import {LiteGraph, LGraphNode} from '../../litegraph/litegraph'

//Subgraph: a node that contains a graph
class Subgraph extends LGraphNode {
    title = "分支蓝图"
    desc = "Graph inside a node";
    color = "#334";
    

    constructor() {
        super()
        this.addProperty('enabled', true, 'boolean')
        this.enabled = true;

        // this.addInput('触发', LiteGraph.ACTION)

        //create inner graph
        this.subgraph = new LiteGraph.LGraph();
        this.subgraph._subgraph_node = this;
        this.subgraph._is_subgraph = true;

        this.subgraph.onTrigger = this.onSubgraphTrigger.bind(this);

        //nodes input node added inside
        this.subgraph.onInputAdded = this.onSubgraphNewInput.bind(this);
        this.subgraph.onInputRenamed = this.onSubgraphRenamedInput.bind(this);
        this.subgraph.onInputTypeChanged = this.onSubgraphTypeChangeInput.bind(this);
        this.subgraph.onInputRemoved = this.onSubgraphRemovedInput.bind(this);

        this.subgraph.onOutputAdded = this.onSubgraphNewOutput.bind(this);
        this.subgraph.onOutputRenamed = this.onSubgraphRenamedOutput.bind(this);
        this.subgraph.onOutputTypeChanged = this.onSubgraphTypeChangeOutput.bind(this);
        this.subgraph.onOutputRemoved = this.onSubgraphRemovedOutput.bind(this);
    }


    onGetInputs() {
        // console.log('subgraph获取了可以添加的输入')
        return [
            ["enabled", "boolean"],
            ["触发", LiteGraph.ACTION]
        ];
    }
    onGetOutputs() {
        // console.log('subgraph获取了可以添加的输入')
        return [
            ["结束", LiteGraph.EVENT],
            ['被引用', 'lgraphNode']
        ];
    }
    // onGetInputs = function() {
    //     return [
    //         ["and", "boolean"]
    //     ];
    // };

    onDblClick(e, pos, graphcanvas) {
        var that = this;
        setTimeout(function() {
            graphcanvas.openSubgraph(that.subgraph);
        }, 10);
    }

    onDrawTitle(ctx, graph_mouse){
        let node = this
        if (!node.flags.collapsed && node.subgraph && !node.skip_subgraph_button) {
            var w = LiteGraph.NODE_TITLE_HEIGHT;
            var x = node.size[0] - w;
            var over = LiteGraph.isInsideRectangle(graph_mouse[0] - node.pos[0], graph_mouse[1] - node.pos[1], x+2, -w+2, w-4, w-4 );
            ctx.fillStyle = over ? "#888" : "#555";
            if( this.renderingShape == LiteGraph.BOX_SHAPE)
                ctx.fillRect(x+2, -w+2, w-4, w-4);
            else
            {
                ctx.beginPath();
                ctx.roundRect(x+2, -w+2, w-4, w-4,[4]);
                ctx.fill();
            }
            ctx.fillStyle = "#333";
            ctx.beginPath();
            ctx.moveTo(x + w * 0.2, -w * 0.6);
            ctx.lineTo(x + w * 0.8, -w * 0.6);
            ctx.lineTo(x + w * 0.5, -w * 0.3);
            ctx.fill();
        }
    }

    
    //onToggle执行的是onExecute，其它事件在onAction中执行
    onAction(action, param) {
        // console.log('Subgraph onAction',  action, param)
        this.subgraph.onAction(action, param);
    };

    onExecute() {
        // console.log('Subgraph onExecute')
        this.enabled = this.getInputOrProperty("enabled");
        if (!this.enabled) {
            return;
        }

        //send inputs to subgraph global inputs
        if (this.inputs) {
            for (var i = 0; i < this.inputs.length; i++) {
                var input = this.inputs[i];
                var value = this.getInputData(i);
                this.subgraph.setInputData(input.name, value);
            }
        }

        //execute
        this.subgraph.runStep();

        //send subgraph global outputs to outputs
        if (this.outputs) {
            for (var i = 0; i < this.outputs.length; i++) {
                var output = this.outputs[i];
                var value = this.subgraph.getOutputData(output.name);
                this.setOutputData(i, value);
            }
        }
    };

    sendEventToAllNodes(eventname, param, mode) {
        console.log('sendEventToAllNodes', eventname, param, mode)
        if (this.enabled) {
            this.subgraph.sendEventToAllNodes(eventname, param, mode);
        }
    };


    onDrawBackground(ctx, graphcanvas, canvas, pos) {
        if (this.flags.collapsed)
            return;
        var y = this.size[1] - LiteGraph.NODE_TITLE_HEIGHT + 0.5;
        // button
        var over = LiteGraph.isInsideRectangle(pos[0], pos[1], this.pos[0], this.pos[1] + y, this.size[0], LiteGraph.NODE_TITLE_HEIGHT);
        let overleft = LiteGraph.isInsideRectangle(pos[0], pos[1], this.pos[0], this.pos[1] + y, this.size[0] / 2, LiteGraph.NODE_TITLE_HEIGHT)
        // let over = true
        // let overleft = false
        ctx.fillStyle = over ? "#555" : "#222";
        ctx.beginPath();
        if (this._shape == LiteGraph.BOX_SHAPE) {
            if (overleft) {
                ctx.rect(0, y, this.size[0] / 2 + 1, LiteGraph.NODE_TITLE_HEIGHT);
            } else {
                ctx.rect(this.size[0] / 2, y, this.size[0] / 2 + 1, LiteGraph.NODE_TITLE_HEIGHT);
            }
        }
        else {
            if (overleft) {
                ctx.roundRect(0, y, this.size[0] / 2 + 1, LiteGraph.NODE_TITLE_HEIGHT, [0,0, 8,8]);
            } else {
                ctx.roundRect(this.size[0] / 2, y, this.size[0] / 2 + 1, LiteGraph.NODE_TITLE_HEIGHT, [0,0, 8,8]);
            }
        }
        if (over) {
            ctx.fill();
        } else {
            ctx.fillRect(0, y, this.size[0] + 1, LiteGraph.NODE_TITLE_HEIGHT);
        }
        // button
        ctx.textAlign = "center";
        ctx.font = "24px Arial";
        ctx.fillStyle = over ? "#DDD" : "#999";
        ctx.fillText("+", this.size[0] * 0.25, y + 24);
        ctx.fillText("+", this.size[0] * 0.75, y + 24);
    }

    // onMouseDown(e, pos, graphcanvas) {
    //     if (
    //         !this.flags.collapsed &&
    //         pos[0] > this.size[0] - LiteGraph.NODE_TITLE_HEIGHT &&
    //         pos[1] < 0
    //     ) {
    //         var that = this;
    //         setTimeout(function() {
    //             graphcanvas.openSubgraph(that.subgraph);
    //         }, 10);
    //     }
    // };

    onMouseDown (e, localpos, graphcanvas) {
        if (
            !this.flags.collapsed &&
            localpos[0] > this.size[0] - LiteGraph.NODE_TITLE_HEIGHT &&
            localpos[1] < 0
        ) {
            var that = this;
            setTimeout(function() {
                graphcanvas.openSubgraph(that.subgraph);
            }, 10);
        }

        var y = this.size[1] - LiteGraph.NODE_TITLE_HEIGHT + 0.5;
        console.log(0)
        if (localpos[1] > y) {
            if (localpos[0] < this.size[0] / 2) {
                console.log(1)
                graphcanvas.showSubgraphPropertiesDialog(this);
            } else {
                console.log(2)
                graphcanvas.showSubgraphPropertiesDialogRight(this);
            }
        }
    }

    computeSize()
    {
        var num_inputs = this.inputs ? this.inputs.length : 0;
        var num_outputs = this.outputs ? this.outputs.length : 0;
        return [ 200, Math.max(num_inputs,num_outputs) * LiteGraph.NODE_SLOT_HEIGHT + LiteGraph.NODE_TITLE_HEIGHT ];
    }

    //**** INPUTS ***********************************
    onSubgraphTrigger(event, param) {
        console.log('onSubgraphTrigger', event, param)
        var slot = this.findOutputSlot(event);
        if (slot != -1) {
            this.triggerSlot(slot);
        }
    };

    onSubgraphNewInput(name, type) {
        var slot = this.findInputSlot(name);
        if (slot == -1) {
            //add input to the node
            this.addInput(name, type);
        }
    };

    onSubgraphRenamedInput(oldname, name) {
        var slot = this.findInputSlot(oldname);
        if (slot == -1) {
            return;
        }
        var info = this.getInputInfo(slot);
        info.name = name;
    };

    onSubgraphTypeChangeInput(name, type) {
        var slot = this.findInputSlot(name);
        if (slot == -1) {
            return;
        }
        var info = this.getInputInfo(slot);
        info.type = type;
    };

    onSubgraphRemovedInput(name) {
        var slot = this.findInputSlot(name);
        if (slot == -1) {
            return;
        }
        this.removeInput(slot);
    };

    //**** OUTPUTS ***********************************
    onSubgraphNewOutput(name, type) {
        var slot = this.findOutputSlot(name);
        if (slot == -1) {
            this.addOutput(name, type);
        }
    };

    onSubgraphRenamedOutput(oldname, name) {
        var slot = this.findOutputSlot(oldname);
        if (slot == -1) {
            return;
        }
        var info = this.getOutputInfo(slot);
        info.name = name;
    };

    onSubgraphTypeChangeOutput(name, type) {
        var slot = this.findOutputSlot(name);
        if (slot == -1) {
            return;
        }
        var info = this.getOutputInfo(slot);
        info.type = type;
    };

    onSubgraphRemovedOutput(name) {
        var slot = this.findOutputSlot(name);
        if (slot == -1) {
            return;
        }
        this.removeOutput(slot);
    };
    
    // *****************************************************
    getExtraMenuOptions(graphcanvas) {
        var that = this;
        return [
            {
                content: "Open",
                callback: function() {
                    graphcanvas.openSubgraph(that.subgraph);
                }
            }
        ];
    };

    onResize = function(size) {
        size[1] += 20;
    };

    serialize = function() {
        var data = LiteGraph.LGraphNode.prototype.serialize.call(this);
        data.subgraph = this.subgraph.serialize();
        return data;
    };

    //no need to define node.configure, the default method detects node.subgraph and passes the object to node.subgraph.configure()
    reassignSubgraphUUIDs(graph) {
        const idMap = { nodeIDs: {}, linkIDs: {} }

        for (const node of graph.nodes) {
            const oldID = node.id
            const newID = LiteGraph.uuidv4()
            node.id = newID

            if (idMap.nodeIDs[oldID] || idMap.nodeIDs[newID]) {
                throw new Error(`New/old node UUID wasn't unique in changed map! ${oldID} ${newID}`)
            }

            idMap.nodeIDs[oldID] = newID
            idMap.nodeIDs[newID] = oldID
        }

        for (const link of graph.links) {
            const oldID = link[0]
            const newID = LiteGraph.uuidv4();
            link[0] = newID

            if (idMap.linkIDs[oldID] || idMap.linkIDs[newID]) {
                throw new Error(`New/old link UUID wasn't unique in changed map! ${oldID} ${newID}`)
            }

            idMap.linkIDs[oldID] = newID
            idMap.linkIDs[newID] = oldID

            const nodeFrom = link[1]
            const nodeTo = link[3]

            if (!idMap.nodeIDs[nodeFrom]) {
                throw new Error(`Old node UUID not found in mapping! ${nodeFrom}`)
            }

            link[1] = idMap.nodeIDs[nodeFrom]

            if (!idMap.nodeIDs[nodeTo]) {
                throw new Error(`Old node UUID not found in mapping! ${nodeTo}`)
            }

            link[3] = idMap.nodeIDs[nodeTo]
        }

        // Reconnect links
        for (const node of graph.nodes) {
            if (node.inputs) {
                for (const input of node.inputs) {
                    if (input.link) {
                        input.link = idMap.linkIDs[input.link]
                    }
                }
            }
            if (node.outputs) {
                for (const output of node.outputs) {
                    if (output.links) {
                        output.links = output.links.map(l => idMap.linkIDs[l]);
                    }
                }
            }
        }

        // Recurse!
        for (const node of graph.nodes) {
            if (node.type === "middle/graph/subgraph") {
                const merge = reassignGraphUUIDs(node.subgraph);
                idMap.nodeIDs.assign(merge.nodeIDs)
                idMap.linkIDs.assign(merge.linkIDs)
            }
        }
    };

    clone() {
        var node = LiteGraph.createNode(this.type);
        var data = this.serialize();

        if (LiteGraph.use_uuids) {
            // LGraph.serialize() seems to reuse objects in the original graph. But we
            // need to change node IDs here, so clone it first.
            const subgraph = LiteGraph.cloneObject(data.subgraph)

            this.reassignSubgraphUUIDs(subgraph);
            data.subgraph = subgraph;
        }

        delete data["id"];
        delete data["inputs"];
        delete data["outputs"];
        node.configure(data);
        return node;
    };

    buildFromNodes(nodes)
    {
        //clear all?
        //TODO

        //nodes that connect data between parent graph and subgraph
        var subgraph_inputs = [];
        var subgraph_outputs = [];

        //mark inner nodes
        var ids = {};
        var min_x = 0;
        var max_x = 0;
        for(var i = 0; i < nodes.length; ++i)
        {
            var node = nodes[i];
            ids[ node.id ] = node;
            min_x = Math.min( node.pos[0], min_x );
            max_x = Math.max( node.pos[0], min_x );
        }
        
        var last_input_y = 0;
        var last_output_y = 0;

        for(var i = 0; i < nodes.length; ++i)
        {
            var node = nodes[i];
            //check inputs
            if( node.inputs )
                for(var j = 0; j < node.inputs.length; ++j)
                {
                    var input = node.inputs[j];
                    if( !input || !input.link )
                        continue;
                    var link = node.graph.links[ input.link ];
                    if(!link)
                        continue;
                    if( ids[ link.origin_id ] )
                        continue;
                    //this.addInput(input.name,link.type);
                    this.subgraph.addInput(input.name,link.type);
                    /*
                    var input_node = LiteGraph.createNode("graph/input");
                    this.subgraph.add( input_node );
                    input_node.pos = [min_x - 200, last_input_y ];
                    last_input_y += 100;
                    */
                }

            //check outputs
            if( node.outputs )
                for(var j = 0; j < node.outputs.length; ++j)
                {
                    var output = node.outputs[j];
                    if( !output || !output.links || !output.links.length )
                        continue;
                    var is_external = false;
                    for(var k = 0; k < output.links.length; ++k)
                    {
                        var link = node.graph.links[ output.links[k] ];
                        if(!link)
                            continue;
                        if( ids[ link.target_id ] )
                            continue;
                        is_external = true;
                        break;
                    }
                    if(!is_external)
                        continue;
                    //this.addOutput(output.name,output.type);
                    /*
                    var output_node = LiteGraph.createNode("graph/output");
                    this.subgraph.add( output_node );
                    output_node.pos = [max_x + 50, last_output_y ];
                    last_output_y += 100;
                    */
                }
        }

        //detect inputs and outputs
            //split every connection in two data_connection nodes
            //keep track of internal connections
            //connect external connections

        //clone nodes inside subgraph and try to reconnect them

        //connect edge subgraph nodes to extarnal connections nodes
    };
}

Subgraph.title = '分支蓝图'
Subgraph.input_node_type = "middle/graph/input";
Subgraph.output_node_type = "middle/graph/output";
LiteGraph.Subgraph = Subgraph
LiteGraph.registerNodeType("middle/graph/subgraph", Subgraph);


class GraphInput extends LGraphNode {
    // Name to show
    title = "输入"
    desc = "用于对子蓝图输入参数";   //不会在显示节点中用到，仅仅在代码中的解释
    // color= '#510'

    constructor() {
        super()
        this.addOutput("", "number");

        this.name_in_graph = "";
        this.properties = {
            name: "",
            type: "number",
            value: 0
        }; 

        var that = this;

        this.name_widget = this.addWidget(
            "text",
            "Name",
            this.properties.name,
            function(v) {
                if (!v) {
                    return;
                }
                that.setProperty("name",v);
            }
        );
        this.type_widget = this.addWidget(
            "text",
            "Type",
            this.properties.type,
            function(v) {
                that.setProperty("type",v);
            }
        );

        this.value_widget = this.addWidget(
            "number",
            "Value",
            this.properties.value,
            function(v) {
                that.setProperty("value",v);
            }
        );

        this.widgets_up = true;
        this.size = [180, 90];
    }


    onConfigure(){
        this.updateType();
    }


    //ensures the type in the node output and the type in the associated graph input are the same
    updateType(){
        var type = this.properties.type;
        this.type_widget.value = type;

        //update output
        if(this.outputs[0].type != type)
        {
            if (!LiteGraph.isValidConnection(this.outputs[0].type,type))
                this.disconnectOutput(0);
            this.outputs[0].type = type;
        }

        //update widget
        if(type == "number")
        {
            this.value_widget.type = "number";
            this.value_widget.value = 0;
        }
        else if(type == "boolean")
        {
            this.value_widget.type = "toggle";
            this.value_widget.value = true;
        }
        else if(type == "string")
        {
            this.value_widget.type = "text";
            this.value_widget.value = "";
        }
        else
        {
            this.value_widget.type = null;
            this.value_widget.value = null;
        }
        this.properties.value = this.value_widget.value;

        //update graph
        if (this.graph && this.name_in_graph) {
            this.graph.changeInputType(this.name_in_graph, type);
        }
    }

    //this is executed AFTER the property has changed
    onPropertyChanged(name,v){
        if( name == "name" )
        {
            if (v == "" || v == this.name_in_graph || v == "enabled") {
                return false;
            }
            if(this.graph)
            {
                if (this.name_in_graph) {
                    //already added
                    this.graph.renameInput( this.name_in_graph, v );
                } else {
                    this.graph.addInput( v, this.properties.type );
                }
            } //what if not?!
            this.name_widget.value = v;
            this.name_in_graph = v;
        }
        else if( name == "type" )
        {
            this.updateType();
        }
        else if( name == "value" )
        {
        }
    }

    //
    getTitle() {
        if (this.flags.collapsed) {
            return this.properties.name;
        }
        return this.title;
    };

    onAction(action, param) {
        console.log('graph input 收到了action', action, param)
        if (this.properties.type == LiteGraph.EVENT) {
            this.triggerSlot(0, param);
        }
    };

    //不同的子graph中的nodeid会出现相同的情况，cctween绑定了nodeid，会导致不同的子graph出现执行动画干扰的情况
    //需要处理这个问题
    onExecute() {
        // console.log('this.graph.inputs', this.graph.inputs)
        var name = this.properties.name;
        //read from global input
        var data = this.graph.inputs[name];
        if (!data) {
            this.setOutputData(0, this.properties.value );
            return;
        }
        this.setOutputData(0, data.value !== undefined ? data.value : this.properties.value );
    };

    onRemoved() {
        if (this.name_in_graph) {
            this.graph.removeInput(this.name_in_graph);
        }
    };
}

GraphInput.title = '输入'
LiteGraph.GraphInput = GraphInput
LiteGraph.registerNodeType("middle/graph/input", GraphInput);



//这是一个输出界面
class GraphOutput extends LGraphNode {
    title = "输出"
    desc = "用于对子蓝图输出参数";   //不会在显示节点中用到，仅仅在代码中的解释
    // color= '#510'

    constructor() {
        super()

         this.addInput("", "");

        this.name_in_graph = "";
        this.properties = { name: "", type: "" };

        this.name_widget = this.addWidget("text","Name",this.properties.name,"name");
        this.type_widget = this.addWidget("text","Type",this.properties.type,"type");
        this.widgets_up = true;
        this.size = [180, 60];
    }

    onPropertyChanged (name, v) {
        if (name == "name") {
            if (v == "" || v == this.name_in_graph || v == "enabled") {
                return false;
            }
            if (this.graph) {
                if (this.name_in_graph) {
                    //already added
                    this.graph.renameOutput(this.name_in_graph, v);
                } else {
                    this.graph.addOutput(v, this.properties.type);
                }
            } //what if not?!
            this.name_widget.value = v;
            this.name_in_graph = v;
        }
        else if (name == "type") {
            this.updateType();
        }
        else if (name == "value") {
        }
    }

    updateType () {
        var type = this.properties.type;
        if (this.type_widget)
            this.type_widget.value = type;

        //update output
        if (this.inputs[0].type != type) {

            if ( type == "action" || type == "event")
                type = LiteGraph.EVENT;
            if (!LiteGraph.isValidConnection(this.inputs[0].type, type))
                this.disconnectInput(0);
            this.inputs[0].type = type;
        }

        //update graph
        if (this.graph && this.name_in_graph) {
            this.graph.changeOutputType(this.name_in_graph, type);
        }
    }

    onExecute() {
        this._value = this.getInputData(0);
        this.graph.setOutputData(this.properties.name, this._value);
    };

    onAction(action, param) {
        if (this.properties.type == LiteGraph.ACTION) {
            this.graph.trigger( this.properties.name, param );
        }
    };

    onRemoved() {
        if (this.name_in_graph) {
            this.graph.removeOutput(this.name_in_graph);
        }
    };

    getTitle() {
        if (this.flags.collapsed) {
            return this.properties.name;
        }
        return this.title;
    };
}

GraphOutput.title = '输出'
LiteGraph.GraphOutput = GraphOutput
LiteGraph.registerNodeType("middle/graph/output", GraphOutput);