<template>
    <div>
        <div 
            :id="containerId" 
            class="process-container"
            style="height: 600px;"></div>
    </div>
</template>

<script>
// import go from 'gojs'
// import '../util/go.js'
import FlowEngine from '../service/flowEngine'
function init(self, containerId, flow) {
    var $ = go.GraphObject.make;  // for conciseness in defining templates

    var myDiagram =
      $(go.Diagram, containerId,  // must name or refer to the DIV HTML element
        {
          // start everything in the middle of the viewport
          initialContentAlignment: go.Spot.Center,
          allowMove:false,//允许拖动
          allowCopy: false,
          allowDelete: false,
          layout: $(CustomLayout),
          // enable undo & redo
          "undoManager.isEnabled": true,
          "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom
        });
    myDiagram.addDiagramListener("ObjectSingleClicked",function (e) {
      if(e.subject.part.data.vId) {
        //console.log('节点点击了', e.subject.part.data);
        self.$emit('nodeClick', {vId: e.subject.part.data.vId});
      }else {
        // 标签点击的时候，显示父框的配置
        let superArr = flow.filter((item, index) => {
          return item.id == e.subject.part.data.supers[0]
        });
        if(superArr.length > 0) {
          //console.log('标签点击了', superArr[0].vId);
          self.$emit('nodeClick', {vId: superArr[0].vId});
        }
      }
    });
    // define the Node template
    myDiagram.nodeTemplate =
      $(go.Node, "Auto",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        // define the node's outer shape, which will surround the TextBlock
        {
            selectionAdorned: false,
            cursor:"pointer",
        },
        $(go.Shape, "RoundedRectangle",
          {
            fill: "#3c9ef8", stroke: "transparent", parameter1: 10,  // the corner has a large radius
            portId: "", fromSpot: go.Spot.AllSides, toSpot: go.Spot.AllSides
          },
          new go.Binding("fill", "isSelected", function(sel) {
              if (sel) return "#3c9ef8"; else return "#3c9ef8";
          }).ofObject(""),
          new go.Binding("stroke", "isSelected", function(sel) {
              if (sel) return "transparent"; else return "transparent";
          }).ofObject(""),),
        $(go.Panel, "Vertical",{padding:0},
          $(go.TextBlock,
            {
              font: "12px sans-serif", stroke: "#fff", 
            },
            new go.Binding("text", "text").makeTwoWay())
        ),
      );

    myDiagram.nodeTemplateMap.add("Super",
      $(go.Node, "Auto",
        { locationObjectName: "BODY" },
        {
            selectionAdorned: false,
            cursor:"pointer"
        },
        $(go.Shape, "RoundedRectangle",
          {
            fill: "#f8f8f8", stroke: "transparent", parameter1: 4,
            spot1: go.Spot.TopLeft, spot2: go.Spot.BottomRight, minSize: new go.Size(30, 30)
          },
          new go.Binding("fill", "isSelected", function(sel) {
              if (sel) return "#ebf6ec"; else return "#f8f8f8";
          }).ofObject(""),
          new go.Binding("stroke", "isSelected", function(sel) {
              if (sel) return "#35b53f"; else return "#f8f8f8";
          }).ofObject(""),
        ),
        $(go.Panel, "Vertical",
          { margin: 10 },
          $(go.TextBlock,
            { font: "14px sans-serif", margin: new go.Margin(0, 0, 5, 0) },
            new go.Binding("text")),
          $(go.Shape,
            { name: "BODY", opacity: 0 })
        ),
      ));

    // replace the default Link template in the linkTemplateMap
    myDiagram.linkTemplate =
      $(go.Link,  // the whole link panel
        { routing: go.Link.AvoidsNodes, corner: 10, curve: go.Link.JumpOver, },
        $(go.Shape,  // the link shape
          { stroke: '#979797', strokeWidth: 2 }),
        $(go.Shape,  // the arrowhead
          { toArrow: "Standard", fill: '#979797', stroke: null })
      );

    // read in the JSON-format data from the "mySavedModel" element
    load(myDiagram, flow);
  }

  // A custom layout that sizes each "Super" node to be big enough to cover all of it member nodes
  function CustomLayout() {
    go.Layout.call(this);
  }
  go.Diagram.inherit(CustomLayout, go.Layout);

  /** @override */
  CustomLayout.prototype.doLayout = function(coll) {
    coll = this.collectParts(coll);

    var supers = new go.Set(go.Node);
    coll.each(function(p) {
      if (p instanceof go.Node && p.category === "Super") supers.add(p);
    });

    function membersOf(sup, diag) {
      var arr = sup.data._members;
      if(!arr){
        return null
      }
      var set = new go.Set(go.Part);
      for (var i = 0; i < arr.length; i++) {
        var d = arr[i];
        set.add(diag.findNodeForData(d));
      }
      return set;
    }

    function isReady(sup, supers, diag) {
      var arr = sup.data._members;
      if(!arr){
        return true
      }
      for (var i = 0; i < arr.length; i++) {
        var d = arr[i];
        if (d.category !== "Super") continue;
        var n = diag.findNodeForData(d);
        if (supers.contains(n)) return false;
      }
      return true;
    }

    // implementations of doLayout that do not make use of a LayoutNetwork
    // need to perform their own transactions
    this.diagram.startTransaction("Custom Layout");

    while (supers.count > 0) {
      var ready = null;
      var it = supers.iterator;
      while (it.next()) {
        if (isReady(it.value, supers, this.diagram)) {
          ready = it.value;
          break;
        }
      }
      supers.remove(ready);
      let children = membersOf(ready, this.diagram)
      let b
      if(children){
        b = this.diagram.computePartsBounds(children);
      }else{
        b = this.diagram.computePartsBounds(ready)
      }
      
      ready.location = b.position;
      var body = ready.findObject("BODY");
      if (body) body.desiredSize = b.size;
    }

    this.diagram.commitTransaction("Custom Layout");
  };
  // end CustomLayout

  function load(myDiagram, flow) {
    // myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
    let engine = new FlowEngine()
    let m = JSON.stringify(engine.convert(flow))
    myDiagram.model = go.Model.fromJson(m)
    // make sure all data have up-to-date "members" collections
    // this does not prevent any "cycles" of membership, which would result in undefined behavior
    var arr = myDiagram.model.nodeDataArray;
    for (var i = 0; i < arr.length; i++) {
      var data = arr[i];
      var supers = data.supers;
      if (supers) {
        for (var j = 0; j < supers.length; j++) {
          var sdata = myDiagram.model.findNodeDataForKey(supers[j]);
          if (sdata) {
            // update _supers to be an Array of references to node data
            if (!data._supers) {
              data._supers = [sdata];
            } else {
              data._supers.push(sdata);
            }
            // update _members to be an Array of references to node data
            if (!sdata._members) {
              sdata._members = [data];
            } else {
              sdata._members.push(data);
            }
          }
        }
      }
    }
  }


export default {
    data() {
        return {
        }
    },
    props: ['flow', 'containerId'],
    mounted() {
        let self = this;
        init(self, self.containerId, self.flow)
    },
}
</script>

<style lang="scss">
.process-container{
     &>div{
         width: 100%;
        /*滚动条样式*/
        &::-webkit-scrollbar{
            width:6px;
            height:6px;
        }
        &::-webkit-scrollbar-track{
            padding: 0 3px;
            background: #f7f7f7;
            border: 1px solid #e6e6e6;
        }
        &::-webkit-scrollbar-thumb{
            background: #ccc;
            border-radius:3px;
        }
        &::-webkit-scrollbar-thumb:hover{
            background: #ccc;
        }
        &::-webkit-scrollbar-corner{
            background: #f6f6f6;
        }
     }
}
</style>