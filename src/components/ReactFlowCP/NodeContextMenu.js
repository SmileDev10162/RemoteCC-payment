import { MenuItem, MenuList, Paper, Box } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { DeleteOutlined } from '@ant-design/icons'

export default function NodeContextMenu (props) {
  const { drawerOpen } = useSelector(state => state.menu)
  let top = props.location.top
  let left = props.location.left

  return (
    <Box sx={{ top, left }} className='context-menu'>
      <Paper>
        <MenuList>
          <MenuItem onClick={props.deleteNode}>
            <DeleteOutlined />
            Remove
          </MenuItem>
        </MenuList>
      </Paper>
    </Box>
  )
}
