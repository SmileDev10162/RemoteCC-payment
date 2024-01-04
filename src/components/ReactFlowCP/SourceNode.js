import React, { memo } from 'react'
// import * as R from 'ramda'
import { Handle } from 'reactflow'
import Node, { contentStyle as style } from './Node'

const isValidConnection = connection => {
  return R.last(R.split('__', connection.target)) === 'data'
}

const SourceNode = ({ data, selected }) => {
  return (
    <Node
      label={'Event'}
      selected={selected}
      color={'LemonChiffon'}
      content={
        <div style={style.io}>
          {data.label}
          <Handle type='source' position='right' style={{ ...style.handle, ...style.right }} isValidConnection={isValidConnection} />
        </div>
      }
    />
  )
}

export default memo(SourceNode)
