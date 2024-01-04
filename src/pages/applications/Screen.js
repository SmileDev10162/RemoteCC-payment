import React from 'react'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { Scene, Engine } from 'react-babylonjs'

export default function Screen () {
  return (
    <div style={{ flex: 1, display: 'flex', width: '100%', height: window.innerHeight - 180 }}>
      <Engine
        antialias
        adaptToDeviceRatio
        canvasId='babylon-js'
        renderOptions={{
          whenVisibleOnly: true
        }}
      >
        <Scene>
          <freeCamera name='camera1' position={new Vector3(2, 5, -10)} setTarget={[Vector3.Zero()]} />
          <hemisphericLight name='light1' intensity={0.7} direction={new Vector3(0, 1, 0)} />
          <ground name='ground' width={6} height={6} />
          <box name='box' size={2} position={new Vector3(0, 1, 0)} rotation={Vector3.Zero()} />
        </Scene>
      </Engine>
    </div>
  )
}
