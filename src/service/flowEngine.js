export default class FlowEngine{

  sortFlow(flow){
    let ret = []
    flow.forEach(item=>{
      item.x = 0
      item.y = 0
    })
    let current = flow.find(item => item.startNode)
    current.y = 100
    
    this.setChildrenY(flow, current)

    let parentAIndex,parentBIndex

    flow.sort((a,b) => {
      if(a.y == b.y){
        parentAIndex = this.getParentIndex(flow, a)
        parentBIndex = this.getParentIndex(flow, b)
        return parentAIndex - parentBIndex
      }
      return a.y - b.y
    })

    this.adjustX(flow)

    return flow
  }

  adjustX(flow){
    let i
    let currentY = -1
    
    let item
    let index = 1
    for(i=0;i<flow.length;i++){
      item = flow[i]
      if(item.y == currentY){
        index += 1
        item.x = 100 * index
      }else{
        currentY = item.y
        index = 1
      }
    }
  }

  setChildrenY(flow, current){
    let children = this.getChildren(flow, current)
    children.forEach(item=>{
      if(current.y + 100 > item.y){
        item.y =current.y + 100
        this.setChildrenY(flow, item)
      }
    })
  }

  getParentIndex(flow, child){
    let i,j
    for(i=0;i<flow.length;i++){
      for(j=0;j<flow[i].connectors.length;j++){
        if (flow[i].connectors[j].idOfTo == child.id){
          return j
        }
      }
    }
    return -1
  }

  getChildren(flow, item){
    let childrenIds = item.connectors.map(value => value.idOfTo)
    let index
    return flow.filter(value => {
      index = childrenIds.indexOf((value.id).toString())
      return index >= 0
      })
  }

  convert(flow){
    flow = this.sortFlow(flow)
    let i,j
    let nodeDataArray = []
    let linkDataArray = []
    let item
    let linkItem
    let x,y
    for(i=0;i<flow.length;i++){
      item = flow[i]
      // y = 100 * (i+1)
      y = item.y
      nodeDataArray.push({
        key: item.id,
        text: item.name,
        vId: item.vId,
        category: 'Super'
      })
      
      if(item.connectors.length == 0){
        nodeDataArray.push({
          key: item.id + '--',
          loc: "100 " + y,
          text: '结束',
          supers: [item.id]
        })
      }
      let linkItemId
      for(j=0;j<item.connectors.length;j++){
        linkItem = item.connectors[j]
        //x = 100 * (j+1)
        x = item.x + 100 * (j+1)
        linkItemId = item.id + '-' + linkItem.idOfTo + '-' + linkItem.on
        nodeDataArray.push({
          key: linkItemId,
          loc: x + " " + y,
          text: linkItem.onName,
          supers: [item.id]
        })

        linkDataArray.push({
          "from":  linkItemId, "to":  linkItem.idOfTo
        })
      }
    }
    
    return {
      nodeDataArray,
      linkDataArray
    }
  }
}