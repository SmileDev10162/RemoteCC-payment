let script = ''
let executionOrder = []

export const compiler = async (nodes, edges) => {
  console.log('edges', edges)
  const startEvent = await nodes?.filter(item => item.type === 'startEventNode')

  if (startEvent != undefined) {
    executionOrder = []
    await orderByEdge(edges, startEvent[0]?.id)
    console.log('order', executionOrder)
  } else {
    return
  }

  const stepNodes = await nodes?.filter(item => item.type === 'stepNode')

  for (let i = 1; i < executionOrder?.length; i++) {
    const selectedStepNode = stepNodes?.filter(item => item.id === executionOrder[i])

    if (selectedStepNode.length !== 0) {
      console.log('selected step', selectedStepNode)
      const stepHandlers = edges?.filter(item => item.target === selectedStepNode[0].id)
      console.log('all handlers', stepHandlers)
    }
  }
}

const orderByEdge = (edges, startID) => {
  executionOrder.push(startID)
  const endPoint = edges.filter(item => item.source === startID)
  if (endPoint?.length == 0) {
    return
  } else {
    const targetNode = edges.filter(item => item.source === startID)
    orderByEdge(edges, targetNode[0]?.target)
  }
}
