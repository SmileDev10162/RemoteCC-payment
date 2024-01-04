import { MenuItem, MenuList, Paper, Box, Divider } from '@mui/material'
import React, { useState } from 'react'
import { NestedMenuItem } from 'mui-nested-menu'
import { useDispatch, useSelector } from 'react-redux'
import InputDialog from '../common/InputDialog'
import { addCustomEvent } from '../../store/actions/applicationActions'
import { toast } from 'react-toastify'
import { useParams } from 'react-router'
import { PlusOutlined } from '@ant-design/icons'

export default function PaneContextMenu (props) {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { customEvents } = useSelector(state => state.Application)
  const { id, org_id } = useParams()

  let top = props.location.top
  let left = props.location.left

  const [openDialog, setOpenDialog] = useState(false)
  const [customEventName, setCustomEventName] = useState('')

  const addCustomEventName = () => {
    const newCustomEvent = {
      name: customEventName
    }
    dispatch(
      addCustomEvent(org_id, id, newCustomEvent, () => {
        toast.success('Added new Custom Event')
      })
    )
  }

  const handleInputModal = () => {
    setOpenDialog(true)
  }

  return (
    <Box sx={{ top, left, zIndex: 1500 }} className='context-menu'>
      <Paper>
        <MenuList>
          <NestedMenuItem label='Events' parentMenuOpen={true}>
            <MenuItem
              onClick={() => {
                handleInputModal()
              }}
            >
              <PlusOutlined />
              Add Custom Event
            </MenuItem>
            <Divider />
            {props.source === 'ScreenGraph' && <MenuItem onClick={props.handleStartEvent}>On Start</MenuItem>}
            {props.source === 'ScreenGraph' && <MenuItem onClick={props.handleStopEvent}>On Stop</MenuItem>}
            <MenuItem onClick={props.handleOnRequestNode}>On Request</MenuItem>
            <Divider />
            {customEvents?.map((event, index) => (
              <MenuItem key={index} onClick={() => props.handleCustomEvent(event.name)}>
                {event.name}
              </MenuItem>
            ))}
          </NestedMenuItem>
          <NestedMenuItem label='Custom' parentMenuOpen={true}>
            <MenuItem onClick={props.handleInvokeEvent}>Invoke Event</MenuItem>
            <MenuItem onClick={props.handleStep}>Add Step</MenuItem>
          </NestedMenuItem>
          <Divider />
          <NestedMenuItem label='Constant' parentMenuOpen={true}>
            <MenuItem onClick={props.handleConstantNumber}>Constant Number</MenuItem>
            <MenuItem onClick={props.handleConstantString}>Constant String</MenuItem>
            <MenuItem onClick={props.handleConstantBoolean}>Constant Boolean</MenuItem>
          </NestedMenuItem>
          <NestedMenuItem label='Variable' parentMenuOpen={true}>
            <MenuItem onClick={props.handleSetValueNode}>SetValue Node</MenuItem>
          </NestedMenuItem>
          <Divider />
          <NestedMenuItem label='Calculate' parentMenuOpen={true}>
            <MenuItem onClick={props.handleOperatorNode}>Operator Node</MenuItem>
            <MenuItem onClick={props.handleComparisonNode}>Comparison Node</MenuItem>
            <MenuItem onClick={props.handleConditionNode}>Condition Node</MenuItem>
            <MenuItem onClick={props.handlePrintNode}>Print Node</MenuItem>
            <MenuItem onClick={props.handleAlertNode}>Alert Node</MenuItem>
          </NestedMenuItem>
          <Divider />
          <NestedMenuItem label='File & Database' parentMenuOpen={true}>
            <MenuItem onClick={props.handleFileWriteNode}>File Write Node</MenuItem>
            <MenuItem onClick={props.handleFileReadNode}>File Read Node</MenuItem>
            <MenuItem onClick={props.handleDatabaseWriteNode}>Database Write Node</MenuItem>
            <MenuItem onClick={props.handleDatabaseReadNode}>Database Read Node</MenuItem>
            <MenuItem onClick={props.handleLoopNode}>Loop Node</MenuItem>
            <MenuItem onClick={props.handleHTTPResponseNode}>HTTP Response Node</MenuItem>
          </NestedMenuItem>
          {props.source === 'FunctionGraph' && (
            <NestedMenuItem label='Function' parentMenuOpen={true}>
              <MenuItem onClick={props.handleFunctionReturnNode}>Function Return node</MenuItem>
            </NestedMenuItem>
          )}
        </MenuList>
      </Paper>
      <InputDialog
        open={openDialog}
        setOpen={setOpenDialog}
        handleValue={customEventName}
        handleChange={setCustomEventName}
        handleAction={addCustomEventName}
      />
    </Box>
  )
}
