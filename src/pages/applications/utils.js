import * as React from 'react'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'

export const Icon = props => {
  return (
    <div
      title={props.title}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '30px',
        height: '100%',

        fontSize: '18px'
      }}
      onClick={props.onClick}
    >
      <span style={{ fontSize: 'inherit', cursor: 'pointer' }} className='material-symbols-outlined'>
        <AddOutlinedIcon sx={{ paddingTop: 1 }} color='primary' />
      </span>
    </div>
  )
}
