import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import firebase from '../../config/firebase'
import dataFirestore from '../../config/backup.json'

export default function index() {
    
    const [invitation, setInvitation] = useState([]);
    const [mail, setMail] = useState([]);
    const [notification, setNotification] = useState([]);
    const [rootUser, setRootUser] = useState([]);
    const [organization, setOrganization] = useState([]);

    const [colAPIKey, setColAPIKey] = useState([]);
    const [application, setApplication] = useState([]);
    const [colUser, setColUser] = useState([]);
    const [colScreen, setColScreen] = useState([]);
    const [colCode, setColCode] = useState([]);
    const [colEdge, setColEdge] = useState([]);
    const [colFunction, setColFunction] = useState([]);
    const [colGraph, setColGraph] = useState([]);
    const [colVariable, setColVariable] = useState([]);
    const [colParameter, setColParameter] = useState([]);
    const [colFuncGraph, setColFuncGraph] = useState([]);
    const [colFuncParameter, setColFuncParameter] = useState([]);
        
    
    const organizationRef = firebase.firestore().collection('organizations')
    const invitationRef = firebase.firestore().collection('invitation')
    const mailRef = firebase.firestore().collection('mail')
    const notificationRef = firebase.firestore().collection('notifications')
    const rootUserRef = firebase.firestore().collection('users')

    async function getInvitation() {
        const snapshot = await invitationRef.get();
        return snapshot.docs
      }
      
    async function getMail() {
        const snapshot = await mailRef.get();
        return snapshot.docs
      }
      
    async function getNotification() {
        const snapshot = await notificationRef.get();
        return snapshot.docs
      }

    async function getRootUser() {
        const snapshot = await rootUserRef.get();
        return snapshot.docs
    }

    async function getOrganization() {
      const snapshot = await organizationRef.get();
      return snapshot.docs
    }

    async function getAPIkey(org_id) {
        const snapshot = await organizationRef.doc(org_id).collection('APIKeys').get()
        return snapshot.docs
    }

    async function getApplication(org_id) {
        const snapshot = await organizationRef.doc(org_id).collection('applications').get()
        return snapshot.docs
    }

    async function getUser(org_id) {
        const snapshot = await organizationRef.doc(org_id).collection('users').get()
        return snapshot.docs
    }
    
    async function getScreen(org_id, app_id) {
        const snapshot = await organizationRef.doc(org_id).collection("applications").doc(app_id).collection('screens').get()
        return snapshot.docs
    }

    
    async function getCode(org_id, app_id, scr_id) {
        const snapshot = await organizationRef.doc(org_id).collection("applications").doc(app_id).collection('screens').doc(scr_id).collection('code').get()
        return snapshot.docs
    }
    
    async function getEdge(org_id, app_id, scr_id) {
        const snapshot = await organizationRef.doc(org_id).collection("applications").doc(app_id).collection('screens').doc(scr_id).collection('edge').get()
        return snapshot.docs
    }

    async function getFunction(org_id, app_id, scr_id) {
        const snapshot = await organizationRef.doc(org_id).collection("applications").doc(app_id).collection('screens').doc(scr_id).collection('functions').get()
        return snapshot.docs
    }


    async function getGraph(org_id, app_id, scr_id) {
        const snapshot = await organizationRef.doc(org_id).collection("applications").doc(app_id).collection('screens').doc(scr_id).collection('graph').get()
        return snapshot.docs
    }

    async function getVariable(org_id, app_id, scr_id) {
        const snapshot = await organizationRef.doc(org_id).collection("applications").doc(app_id).collection('screens').doc(scr_id).collection('variables').get()
        return snapshot.docs
    }

    async function getParameter(org_id, app_id, scr_id) {
        const snapshot = await organizationRef.doc(org_id).collection("applications").doc(app_id).collection('screens').doc(scr_id).collection('parameters').get()
        return snapshot.docs
    }

    async function getFuncGraph(org_id, app_id, scr_id, func_id) {
        const snapshot = await organizationRef.doc(org_id).collection("applications").doc(app_id).collection('screens').doc(scr_id).collection('functions').doc(func_id).collection('graph').get()
        return snapshot.docs
    }
    
    async function getFuncPrameter(org_id, app_id, scr_id, func_id) {
        const snapshot = await organizationRef.doc(org_id).collection("applications").doc(app_id).collection('screens').doc(scr_id).collection('functions').doc(func_id).collection('parameters').get()
        return snapshot.docs
    }

    const renderTree = (nodes) => (
        <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.id}>
          {Array.isArray(nodes.children)
            ? nodes.children.map((node) => renderTree(node))
            : null}
        </TreeItem>
      );

    useEffect(() => {
      async function fetchRootDirectory() {
        const markerInvitation = await getInvitation()
        const markerOrganization = await getOrganization()
        const markerMail = await getMail()
        const markerNotification = await getNotification()
        const markerRootUser = await getRootUser()
        setInvitation(markerInvitation)
        setRootUser(markerRootUser)
        setNotification(markerNotification)
        setMail(markerMail)
        setOrganization(markerOrganization);
      }


      fetchRootDirectory()
    // .then(fetchApplication())
    }, []);

    async function action(event, nodeId) {
        const path = nodeId.split("/")
        if (path[0] === "organizations") {
            const markerApplication = await getApplication(path[1])
            const markerUser = await getUser(path[1])
            const markerAPIKey = await getAPIkey(path[1])

            setColAPIKey(prevMarkerAPIKey => {
                return [...prevMarkerAPIKey, {[path[1]]: markerAPIKey}]
            })
            setApplication(prevMarkerApplication => {
                return [...prevMarkerApplication, {[path[1]]: markerApplication}]
            })
            setColUser((prevMarkerUser) => {
                return [...prevMarkerUser, {[path[1]]: markerUser}]
            })
        } else if (path[1] === "applications" && path.length === 3) {
            const markerScreen = await getScreen(path[0], path[2])
            
            setColScreen(prevMarkerScreen => {
                return [...prevMarkerScreen, {[path[2]]: markerScreen}]
            })
        } else if (path[3] === 'screens' && path.length === 5) {

            const markerCode = await getCode(path[0], path[2], path[4])
            const markerEdge = await getEdge(path[0], path[2], path[4])
            const markerFunction = await getFunction(path[0], path[2], path[4])
            const markerGraph = await getGraph(path[0], path[2], path[4])
            const markerVariable = await getVariable(path[0], path[2], path[4])
            const markerParameter = await getParameter(path[0], path[2], path[4])

            setColCode(prevMarkerCode => {
                return [...prevMarkerCode, {[path[4]]: markerCode}]
            })
            setColEdge(prevMarkerEdge => {
                return [...prevMarkerEdge, {[path[4]]: markerEdge}]
            })
            setColFunction((prevMarkerFunction) => {
                return [...prevMarkerFunction, {[path[4]]: markerFunction}]
            })
            setColGraph((prevMarkerGraph) => {
                return [...prevMarkerGraph, {[path[4]]: markerGraph}]
            })
            setColVariable((prevMarkerVariable) => {
                return [...prevMarkerVariable, {[path[4]]: markerVariable}]
            })
            setColParameter(prevMarkerParameter => {
                return [...prevMarkerParameter, {[path[4]]: markerParameter}]
            })

        } else if (path[5] === 'functions' && path.length === 7) {
            const markerFuncGraph = await getFuncGraph(path[0], path[2], path[4], path[6])
            const markerFuncParameter = await getFuncPrameter(path[0], path[2], path[4], path[6])
            setColFuncGraph((prevMarkerFuncGraph) => {
                return [...prevMarkerFuncGraph, {[path[6]]: markerFuncGraph}]
            })
            setColFuncParameter((prevMarkerFuncParameter) => {
                return [...prevMarkerFuncParameter, {[path[6]]: markerFuncParameter}]
            })
        }
    }


  return (
    <>
        <TreeView aria-label="file system navigator" onNodeSelect={action} defaultCollapseIcon={<ExpandMoreIcon />} defaultExpandIcon={<ChevronRightIcon />}>
            <TreeItem key="invitation" nodeId="invitation" label="Invitation">
                {
                    invitation.map(inviDoc => {
                        const inviDocData = inviDoc.data()
                        const inviDocCreatedAt = "createdAt: " + inviDocData.createdAt
                        const deliAttempts = "attempts: " + inviDocData.delivery?.attempts
                        const infoAccepted = "accepted: " + inviDocData.delivery?.info.accepted[0]
                        const infoMessageId = "messageId: " + inviDocData.delivery?.info.messageId
                        const infoPending = "pending: " + inviDocData.delivery?.info.pending[0]
                        const infoRejected = "rejected: " + inviDocData.delivery?.info.rejected[0]
                        const response = "response: " + inviDocData.delivery?.info.response
                        const deliEndTime = "endTime: " + new Date(inviDocData.delivery?.endTime?.seconds * 1000)
                        const deliError = "error: " + inviDocData.delivery?.error
                        const leaseExpireTime = "leaseExpireTime: " + inviDocData.delivery?.leaseExpireTime
                        const startTime = "startTime: " + new Date(inviDocData.delivery?.endTime?.seconds * 1000)
                        const state = "state: " + inviDocData.delivery?.state
                        const expiresAt = "expiresAt: " + inviDocData.expiresAt
                        const mesHtml = "html: " + inviDocData.message.html
                        const mesSubject = "subject: " + inviDocData.message.subject
                        const organizationID = "organizationID: " + inviDocData.organizationID
                        const inviDocTo = "to: " + inviDocData.to
                        const inviDocToken = 'token: ' + inviDocData.token

                        return <TreeItem key={`invitation/${inviDoc.id}`} nodeId={`invitation/${inviDoc.id}`} label={`${inviDoc.id}`}>
                                <TreeItem key={`invitation/${inviDoc.id}/createdaAt`} nodeId={`invitation/${inviDoc.id}/createdaAt`} label={`${inviDocCreatedAt}`} />
                                <TreeItem key={`invitation/${inviDoc.id}/delivery`} nodeId={`invitation/${inviDoc.id}/delivery`} label="delivery" >
                                    <TreeItem key={`invitation/${inviDoc.id}/delivery/attempts`} nodeId={`invitation/${inviDoc.id}/delivery/attempts`} label={`${deliAttempts}`} />
                                    <TreeItem key={`invitation/${inviDoc.id}/delivery/endTime`} nodeId={`invitation/${inviDoc.id}/delivery/endTime`} label={`${deliEndTime}`} />
                                    <TreeItem key={`invitation/${inviDoc.id}/delivery/error`} nodeId={`invitation/${inviDoc.id}/delivery/error`} label={`${deliError}`} />
                                    <TreeItem key={`invitation/${inviDoc.id}/delivery/info`} nodeId={`invitation/${inviDoc.id}/delivery/info`} label="info" >
                                        <TreeItem key={`invitation/${inviDoc.id}/delivery/info/accepted`} nodeId={`invitation/${inviDoc.id}/delivery/info/accepted`} label={`${infoAccepted}`} />
                                        <TreeItem key={`invitation/${inviDoc.id}/delivery/info/messageId`} nodeId={`invitation/${inviDoc.id}/delivery/info/messageId`} label={`${infoMessageId}`} />
                                        <TreeItem key={`invitation/${inviDoc.id}/delivery/info/pending`} nodeId={`invitation/${inviDoc.id}/delivery/info/pending`} label={`${infoPending}`} />
                                        <TreeItem key={`invitation/${inviDoc.id}/delivery/info/rejected`} nodeId={`invitation/${inviDoc.id}/delivery/info/rejected`} label={`${infoRejected}`} />
                                        <TreeItem key={`invitation/${inviDoc.id}/delivery/info/response`} nodeId={`invitation/${inviDoc.id}/delivery/info/response`} label={`${response}`} />
                                    </TreeItem>
                                    <TreeItem key={`invitation/${inviDoc.id}/delivery/leaseExpireTime`} nodeId={`invitation/${inviDoc.id}/delivery/leaseExpireTime`} label={`${leaseExpireTime}`} />
                                    <TreeItem key={`invitation/${inviDoc.id}/delivery/startTime`} nodeId={`invitation/${inviDoc.id}/delivery/startTime`} label={`${startTime}`} />
                                    <TreeItem key={`invitation/${inviDoc.id}/delivery/state`} nodeId={`invitation/${inviDoc.id}/delivery/state`} label={`${state}`} />
                                </TreeItem>
                                <TreeItem key={`invitation/${inviDoc.id}/expiresAt`} nodeId={`invitation/${inviDoc.id}/expiresAt`} label={`${expiresAt}`} />
                                <TreeItem key={`invitation/${inviDoc.id}/message`} nodeId={`invitation/${inviDoc.id}/message`} label="message" >
                                    <TreeItem key={`invitation/${inviDoc.id}/message/html`} nodeId={`invitation/${inviDoc.id}/message/html`} label={`${mesHtml}`} />
                                    <TreeItem key={`invitation/${inviDoc.id}/message/subject`} nodeId={`invitation/${inviDoc.id}/message/subject`} label={`${mesSubject}`} />
                                </TreeItem>
                                <TreeItem key={`invitation/${inviDoc.id}/organizationID`} nodeId={`invitation/${inviDoc.id}/organizationID`} label={`${organizationID}`} />
                                <TreeItem key={`invitation/${inviDoc.id}/to`} nodeId={`invitation/${inviDoc.id}/to`} label={`${inviDocTo}`} />
                                <TreeItem key={`invitation/${inviDoc.id}/token`} nodeId={`invitation/${inviDoc.id}/token`} label={`${inviDocToken}`} />
                            </TreeItem>
                    })
                }
            </TreeItem>
            <TreeItem key="mail" nodeId="mail" label="mail">
                {
                    mail.map(mailDoc => {
                        const maileDocData = mailDoc.data()
                        const mailTo = "to: " + maileDocData.to
                        const mesCode = "code: " + maileDocData?.message?.code
                        const mesHtml = "html: " + maileDocData?.message?.html
                        const mesSubject = "subject: " + maileDocData?.message?.subject
                        const deliAttempts = "attempts: " + maileDocData.delivery?.attempts
                        const infoAccepted = "accepted: " + maileDocData.delivery?.info.accepted[0]
                        const infoMessageId = "messageId: " + maileDocData.delivery?.info.messageId
                        const infoPending = "pending: " + maileDocData.delivery?.info.pending[0]
                        const infoRejected = "rejected: " + maileDocData.delivery?.info.rejected[0]
                        const response = "response: " + maileDocData.delivery?.info.response
                        const deliEndTime = "endTime: " + new Date(maileDocData.delivery?.endTime?.seconds * 1000)
                        const deliError = "error: " + maileDocData.delivery?.error
                        const leaseExpireTime = "leaseExpireTime: " + maileDocData.delivery?.leaseExpireTime
                        const startTime = "startTime: " + new Date(maileDocData.delivery?.endTime?.seconds * 1000)
                        const state = "state: " + maileDocData.delivery?.state
                        

                        return <TreeItem key={`mail/${mailDoc.id}`} nodeId={`mail/${mailDoc.id}`} label={`${mailDoc.id}`}>
                                <TreeItem key={`notifications/${mailDoc.id}/delivery`} nodeId={`notifications/${mailDoc.id}/delivery`} label="delivery" >
                                    <TreeItem key={`notifications/${mailDoc.id}/delivery/attempts`} nodeId={`notifications/${mailDoc.id}/delivery/attempts`} label={`${deliAttempts}`} />
                                    <TreeItem key={`notifications/${mailDoc.id}/delivery/endTime`} nodeId={`notifications/${mailDoc.id}/delivery/endTime`} label={`${deliEndTime}`} />
                                    <TreeItem key={`notifications/${mailDoc.id}/delivery/error`} nodeId={`notifications/${mailDoc.id}/delivery/error`} label={`${deliError}`} />
                                    <TreeItem key={`notifications/${mailDoc.id}/delivery/info`} nodeId={`notifications/${mailDoc.id}/delivery/info`} label="info" >
                                        <TreeItem key={`notifications/${mailDoc.id}/delivery/info/accepted`} nodeId={`notifications/${mailDoc.id}/delivery/info/accepted`} label={`${infoAccepted}`} />
                                        <TreeItem key={`notifications/${mailDoc.id}/delivery/info/messageId`} nodeId={`notifications/${mailDoc.id}/delivery/info/messageId`} label={`${infoMessageId}`} />
                                        <TreeItem key={`notifications/${mailDoc.id}/delivery/info/pending`} nodeId={`notifications/${mailDoc.id}/delivery/info/pending`} label={`${infoPending}`} />
                                        <TreeItem key={`notifications/${mailDoc.id}/delivery/info/rejected`} nodeId={`notifications/${mailDoc.id}/delivery/info/rejected`} label={`${infoRejected}`} />
                                        <TreeItem key={`notifications/${mailDoc.id}/delivery/info/response`} nodeId={`notifications/${mailDoc.id}/delivery/info/response`} label={`${response}`} />
                                    </TreeItem>
                                    <TreeItem key={`notifications/${mailDoc.id}/delivery/leaseExpireTime`} nodeId={`notifications/${mailDoc.id}/delivery/leaseExpireTime`} label={`${leaseExpireTime}`} />
                                    <TreeItem key={`notifications/${mailDoc.id}/delivery/startTime`} nodeId={`notifications/${mailDoc.id}/delivery/startTime`} label={`${startTime}`} />
                                    <TreeItem key={`notifications/${mailDoc.id}/delivery/state`} nodeId={`notifications/${mailDoc.id}/delivery/state`} label={`${state}`} />
                                </TreeItem>
                                <TreeItem key={`notifications/${mailDoc.id}/message`} nodeId={`notifications/${mailDoc.id}/message`} label="message" >
                                    <TreeItem key={`notifications/${mailDoc.id}/message/code`} nodeId={`notifications/${mailDoc.id}/message/code`} label={`${mesCode}`} />
                                    <TreeItem key={`notifications/${mailDoc.id}/message/html`} nodeId={`notifications/${mailDoc.id}/message/html`} label={`${mesHtml}`} />
                                    <TreeItem key={`notifications/${mailDoc.id}/message/subject`} nodeId={`notifications/${mailDoc.id}/message/subject`} label={`${mesSubject}`} />
                                </TreeItem>
                                <TreeItem key={`notifications/${mailDoc.id}/to`} nodeId={`notifications/${mailDoc.id}/to`} label={`${mailTo}`} />

                            </TreeItem>
                    })
                }
                
            </TreeItem>
            <TreeItem key="notifications" nodeId="notifications" label="Notifications">
                {
                    notification.map(notiDoc => {
                        const notiChecked = "checked: " + notiDoc.data().checked
                        const notiCreatedAt = "createdAt: " + new Date(notiDoc.data().createdAt?.seconds * 1000)
                        const notiOrg_id = "org_id: " + notiDoc.data().org_id
                        const notiTitle = "title: " + notiDoc.data().title
                        const notiType = "type: " + notiDoc.data().type
                        const notiUserID = "userID: " + notiDoc.data().userID
                        return <TreeItem key={`notifications/${notiDoc.id}`} nodeId={`notifications/${notiDoc.id}`} label={`${notiDoc.id}`}>
                                <TreeItem key={`notifications/${notiDoc.id}/checked`} nodeId={`notifications/${notiDoc.id}/checked`} label={`${notiChecked}`} />
                                <TreeItem key={`notifications/${notiDoc.id}/createdAt`} nodeId={`notifications/${notiDoc.id}/createdAt`} label={`${notiCreatedAt}`} />
                                <TreeItem key={`notifications/${notiDoc.id}/org_id`} nodeId={`notifications/${notiDoc.id}/org_id`} label={`${notiOrg_id}`} />
                                <TreeItem key={`notifications/${notiDoc.id}/title`} nodeId={`notifications/${notiDoc.id}/title`} label={`${notiTitle}`} />
                                <TreeItem key={`notifications/${notiDoc.id}/type`} nodeId={`notifications/${notiDoc.id}/type`} label={`${notiType}`} />
                                <TreeItem key={`notifications/${notiDoc.id}/userID`} nodeId={`notifications/${notiDoc.id}/userID`} label={`${notiUserID}`} />
                            </TreeItem>
                    })
                }
                
            </TreeItem>
            <TreeItem key="organizations" nodeId="Organizations" label="Organizations">
                {organization?.map((orgDoc, orgDocIndex) => {
                    const dateOrg = "createdAt: " + new Date(orgDoc.data().createdAt?.seconds * 1000)
                    const id = orgDocIndex.toString()
                    return  <TreeItem key={`organizations/${orgDoc.id}`} nodeId={`organizations/${orgDoc.id}`} label={orgDoc.id}>
                                <TreeItem key={`${orgDoc?.id}/APIKeys`} nodeId={`${orgDoc?.id}/APIKeys`} label="APIKeys" >
                                    {
                                        !!colAPIKey?.find(obj => obj.hasOwnProperty(`${orgDoc?.id}`)) ? colAPIKey?.find(obj => obj.hasOwnProperty(`${orgDoc?.id}`))[`${orgDoc?.id}`]?.map((apiKeyDoc) => {
                                            const apiKeyDocData = apiKeyDoc.data()
                                            const apiKeyCreatedAt = "createdAt: " + new Date(apiKeyDocData.createdAt?.seconds * 1000)
                                            const apiKeyName = "name: " + apiKeyDocData.name
                                            const apiKeyStatus = "status: " + apiKeyDocData.status
                                            return <TreeItem key={`${apiKeyDoc.id}`} nodeId={`${apiKeyDoc.id}`} label={apiKeyDoc.id} >
                                                    <TreeItem key={`${orgDoc?.id}/APIKeys/${apiKeyCreatedAt}`} nodeId={`${orgDoc?.id}/APIKeys/${apiKeyCreatedAt}`} label={apiKeyCreatedAt} />
                                                    <TreeItem key={`${orgDoc?.id}/APIKeys/${apiKeyName}`} nodeId={`${orgDoc?.id}/APIKeys/${apiKeyName}`} label={apiKeyName} />
                                                    <TreeItem key={`${orgDoc?.id}/APIKeys/${apiKeyStatus}`} nodeId={`${orgDoc?.id}/APIKeys/${apiKeyStatus}`} label={apiKeyStatus} />
                                            </TreeItem>
                                        }) : null
                                    }
                                </TreeItem>
                                <TreeItem key={`${orgDoc?.id}/applications`} nodeId={`${orgDoc?.id}/applications`} label="applications">
                                    {
                                        !!application?.find(obj => obj.hasOwnProperty(`${orgDoc?.id}`)) ? (application?.find(obj => obj.hasOwnProperty(`${orgDoc?.id}`))[`${orgDoc?.id}`]?.map((appDoc) =>{
                                        const createdDateApp = "createdAt: " + new Date(appDoc?.data()?.createdAt?.seconds * 1000)
                                        const updatedDateApp = "updatedAt: " + new Date(appDoc?.data()?.updatedAt?.seconds * 1000)
                                        const name = "name: " + appDoc.data().name
                                        const status = "status: " + appDoc.data().status
                                        return <TreeItem key={`${orgDoc.id}/applications/${appDoc.id}`} nodeId={`${orgDoc.id}/applications/${appDoc.id}`} label={`${appDoc.id}`}>
                                            <TreeItem key={`${orgDoc.id}/applications/${appDoc.id}/screens`} nodeId={`${orgDoc.id}/applications/${appDoc.id}/screens`} label="screens">
                                                {
                                                    !!colScreen?.find(obj => obj.hasOwnProperty(`${appDoc?.id}`)) ? (colScreen?.find(obj => obj.hasOwnProperty(`${appDoc?.id}`))[`${appDoc?.id}`]?.map((scrDoc) => {
                                                        const screenCreatedDate = "createdAt: " + new Date(scrDoc?.data()?.createdAt?.seconds * 1000)
                                                        const scrAuthorization = "authorization: " + scrDoc?.data()?.authorization
                                                        const endpointName = "endpointName: " + scrDoc?.data()?.endpointName
                                                        const propertyType = "propertyType: " + scrDoc?.data()?.propertyType
                                                        const route = "route: " + scrDoc?.data()?.route
                                                        return <TreeItem key={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}`} nodeId={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}`} label={`${scrDoc.id}`}>
                                                                {<TreeItem key={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}/code`} nodeId={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}/code`} label="code">
                                                                {
                                                                    !!colCode?.find(obj => obj.hasOwnProperty(`${scrDoc?.id}`)) ? colCode?.find(obj => obj.hasOwnProperty(`${scrDoc?.id}`))[`${scrDoc?.id}`]?.map((codeDoc) => {
                                                                        const codeJsCode = "jsCode: " + codeDoc.data().jsCode
                                                                        return <TreeItem key={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}/code/${codeDoc.id}`} nodeId={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}/code/${codeDoc.id}`} label={`${codeDoc.id}`}>
                                                                            
                                                                            <TreeItem key={`${codeDoc.id}codeJsCode`} nodeId={`${codeDoc.id}codeJsCode`} label={codeJsCode} />
                                                                        </TreeItem>
                                                                    }) : null
                                                                }
                                                                </TreeItem>}
                                                                {<TreeItem key={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}/edge`} nodeId={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}/edge`} label="edge">
                                                                {
                                                                    !!colEdge?.find(obj => obj.hasOwnProperty(`${scrDoc?.id}`)) ? colEdge?.find(obj => obj.hasOwnProperty(`${scrDoc?.id}`))[`${scrDoc?.id}`]?.map((edgeDoc) => {
                                                                        const edgeAnimated = "edgeAnimated: " + edgeDoc.data().animated
                                                                        const applicationID = "applicationID: " + edgeDoc.data().applicationID
                                                                        const edgeCreatedAt = "createdAt: " + new Date(edgeDoc?.data()?.createdAt?.seconds * 1000)
                                                                        const edgeMarkerEndType = "type: " + edgeDoc.data().markerEnd.type
                                                                        const edgeSource = "source: " + edgeDoc.data().source
                                                                        const edgeSourceHandle = "sourceHandle: " + edgeDoc.data().sourceHandle
                                                                        const edgeTarget = "target: " + edgeDoc.data().target
                                                                        const edgeTargetHandle = "targetHandle: " + edgeDoc.data().targetHandle
                                                                        return <TreeItem key={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}/code/${edgeDoc.id}`} nodeId={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}/code/${edgeDoc.id}`} label={`${edgeDoc.id}`}>
                                                                            
                                                                            <TreeItem key={`${edgeDoc.id}edgeAnimated`} nodeId={`${edgeDoc.id}edgeAnimated`} label={edgeAnimated} />
                                                                            <TreeItem key={`${edgeDoc.id}applicationID`} nodeId={`${edgeDoc.id}applicationID`} label={applicationID} />
                                                                            <TreeItem key={`${edgeDoc.id}edgeCreatedAt`} nodeId={`${edgeDoc.id}edgeCreatedAt`} label={edgeCreatedAt} />
                                                                            <TreeItem key={`${edgeDoc.id}markerEnd`} nodeId={`${edgeDoc.id}markerEnd`} label="markerEnd" >
                                                                                <TreeItem key={`${edgeDoc.id}edgeMarkerEndType`} nodeId={`${edgeDoc.id}edgeMarkerEndType`} label={edgeMarkerEndType} />
                                                                            </TreeItem>
                                                                            <TreeItem key={`${edgeDoc.id}edgeSource`} nodeId={`${edgeDoc.id}edgeSource`} label={edgeSource} />
                                                                            <TreeItem key={`${edgeDoc.id}edgeSourceHandle`} nodeId={`${edgeDoc.id}edgeSourceHandle`} label={edgeSourceHandle} />
                                                                            <TreeItem key={`${edgeDoc.id}edgeTarget`} nodeId={`${edgeDoc.id}edgeTarget`} label={edgeTarget} />
                                                                            <TreeItem key={`${edgeDoc.id}edgeTargetHandle`} nodeId={`${edgeDoc.id}edgeTargetHandle`} label={edgeTargetHandle} />
                                                                        </TreeItem>
                                                                    }) : null
                                                                }
                                                                </TreeItem>}
                                                                {<TreeItem key={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}/functions`} nodeId={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}/functions`} label="functions">
                                                                    {
                                                                        !!colFunction?.find(obj => obj.hasOwnProperty(`${scrDoc?.id}`)) ? colFunction?.find(obj => obj.hasOwnProperty(`${scrDoc?.id}`))[`${scrDoc?.id}`]?.map((funcDoc) => {
                                                                            const functionCreatedAt = "createdAt: " + new Date (funcDoc?.data()?.createdAt?.seconds * 10000)
                                                                            const functionName = "name: " + funcDoc?.data()?.name
                                                                            return <TreeItem key={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}/functions/${funcDoc.id}`} nodeId={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}/functions/${funcDoc.id}`} label={`${funcDoc.id}`}>
                                                                                <TreeItem key={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}/functions/${funcDoc.id}/graph`} nodeId={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}/functions/${funcDoc.id}/graph`} label="graph">
                                                                                    {
                                                                                        !!colFuncGraph?.find(obj => obj.hasOwnProperty(`${funcDoc?.id}`)) ? colFuncGraph?.find(obj => obj.hasOwnProperty(`${funcDoc?.id}`))[`${funcDoc?.id}`]?.map((funcGraphDoc) => {
                                                                                            const funcGraphCreatedAt = "createdAt: " + new Date (funcGraphDoc?.data()?.createdAt?.seconds * 10000)
                                                                                            const functionID = "functionID: " + funcGraphDoc?.data()?.functionID
                                                                                            const funcGraphId = "id: " + funcGraphDoc?.data()?.id
                                                                                            const nodeType = "nodeType: " + funcGraphDoc?.data()?.nodeType
                                                                                            const parentFunctionID = "parentFunctionID: " + funcGraphDoc?.data()?.parentFunctionID
                                                                                            const positionX = "x: " + funcGraphDoc?.data()?.position.x
                                                                                            const positionY = "y: " + funcGraphDoc?.data()?.position.y
                                                                                            const value = "value: " + funcGraphDoc?.data()?.value

                                                                                            return <TreeItem key={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}/functions/${funcDoc.id}/graph/${funcGraphDoc.id}`} nodeId={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}/functions/${funcDoc.id}/graph/${funcGraphDoc.id}`} label={`${funcGraphDoc.id}`}>
                                                                                                <TreeItem key={`${funcGraphDoc.id}funcGraphCreatedAt`} nodeId={`${funcGraphDoc.id}funcGraphCreatedAt`} label={funcGraphCreatedAt} />
                                                                                                <TreeItem key={`${funcGraphDoc.id}functionID`} nodeId={`${funcGraphDoc.id}functionID`} label={functionID} />
                                                                                                <TreeItem key={`${funcGraphDoc.id}funcGraphId`} nodeId={`${funcGraphDoc.id}funcGraphId`} label={funcGraphId} />
                                                                                                <TreeItem key={`${funcGraphDoc.id}nodeType`} nodeId={`${funcGraphDoc.id}nodeType`} label={nodeType} />
                                                                                                <TreeItem key={`${funcGraphDoc.id}parentFunctionID`} nodeId={`${funcGraphDoc.id}parentFunctionID`} label={parentFunctionID} />
                                                                                                <TreeItem key={`${funcGraphDoc.id}position`} nodeId={`${funcGraphDoc.id}position`} label="position" >
                                                                                                    <TreeItem key={`${funcGraphDoc.id}positionX`} nodeId={`${funcGraphDoc.id}positionX`} label={positionX} />
                                                                                                    <TreeItem key={`${funcGraphDoc.id}positionY`} nodeId={`${funcGraphDoc.id}positionY`} label={positionY} />
                                                                                                </TreeItem>
                                                                                                <TreeItem key={`${funcGraphDoc.id}value`} nodeId={`${funcGraphDoc.id}value`} label={value} />
                                                                                            </TreeItem>
                                                                                        }) : null
                                                                                    }
                                                                                </TreeItem>
                                                                                <TreeItem key={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}/functions/${funcDoc.id}/parameters`} nodeId={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}/functions/${funcDoc.id}/parameters`} label="parameters">
                                                                                    {
                                                                                        !!colFuncParameter?.find(obj => obj.hasOwnProperty(`${funcDoc?.id}`)) ? colFuncParameter?.find(obj => obj.hasOwnProperty(`${funcDoc?.id}`))[`${funcDoc?.id}`]?.map((funcParaDoc) => {
                                                                                            const paraCreatedAt = "createdAt: " + new Date (funcParaDoc?.data()?.createdAt?.seconds * 10000)
                                                                                            const paraDescription = "description: " + funcParaDoc.data().paraDescription
                                                                                            const paraName = "name: " + funcParaDoc.data().name
                                                                                            const paraType = "type: " + funcParaDoc.data().type
                                                                                            return <TreeItem key={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}/functions/${funcDoc.id}/prameters/${funcParaDoc.id}`} nodeId={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}/functions/${funcDoc.id}/prameters/${funcParaDoc.id}`} label={`${funcParaDoc.id}`}>
                                                                                                <TreeItem key={`${funcParaDoc.id}paraCreatedAt`} nodeId={`${funcParaDoc.id}paraCreatedAt`} label={paraCreatedAt} />
                                                                                                <TreeItem key={`${funcParaDoc.id}paraDescription`} nodeId={`${funcParaDoc.id}paraDescription`} label={paraDescription} />
                                                                                                <TreeItem key={`${funcParaDoc.id}paraName`} nodeId={`${funcParaDoc.id}paraName`} label={paraName} />
                                                                                                <TreeItem key={`${funcParaDoc.id}paraType`} nodeId={`${funcParaDoc.id}paraType`} label={paraType} />
                                                                                            </TreeItem>
                                                                                        }) : null
                                                                                    }
                                                                                </TreeItem>
                                                                                <TreeItem key={`${funcDoc.id}functionCreatedAt`} nodeId={`${funcDoc.id}functionCreatedAt`} label={functionCreatedAt} />
                                                                                <TreeItem key={`${funcDoc.id}functionName`} nodeId={`${funcDoc.id}functionName`} label={functionName} />
                                                                            </TreeItem>
                                                                        }) : null
                                                                    }
                                                                </TreeItem>}

                                                                {<TreeItem key={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}/graph`} nodeId={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}/graph`} label="graph">
                                                                    {
                                                                        !!colGraph?.find(obj => obj.hasOwnProperty(`${scrDoc?.id}`)) ? colGraph?.find(obj => obj.hasOwnProperty(`${scrDoc?.id}`))[`${scrDoc?.id}`]?.map((graphDoc) => {
                                                                            // console.log("")
                                                                            const applicationID = "applicationID: " + graphDoc.data().applicationID
                                                                            const graphCreatedAt = "createdAt: " + new Date (graphDoc?.data()?.createdAt?.seconds * 10000)
                                                                            const functionID = "functionID: " + graphDoc?.data().functionID
                                                                            const graphID = "id: " + graphDoc?.data().graphID
                                                                            const nodeType = "nodeType: " + graphDoc?.data()?.nodeType
                                                                            const positionX = "x: " + graphDoc?.data()?.position?.x
                                                                            const positionY = "y: " + graphDoc?.data()?.position?.y
                                                                            const value = "value: " + graphDoc?.data()?.value
                                                                            // console.log("colGraph", graphDoc.data())
                                                                           return <TreeItem key={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}/graph/${graphDoc.id}`} nodeId={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}/graph/${graphDoc.id}`} label={`${graphDoc.id}`}>
                                                                                <TreeItem key={`${graphDoc.id}applicationID`} nodeId={`${graphDoc.id}applicationID`} label={applicationID} />
                                                                                <TreeItem key={`${graphDoc.id}graphCreatedAt`} nodeId={`${graphDoc.id}graphCreatedAt`} label={graphCreatedAt} />
                                                                                <TreeItem key={`${graphDoc.id}functionID`} nodeId={`${graphDoc.id}functionID`} label={functionID} />
                                                                                <TreeItem key={`${graphDoc.id}graphID`} nodeId={`${graphDoc.id}graphID`} label={graphID} />
                                                                                <TreeItem key={`${graphDoc.id}nodeType`} nodeId={`${graphDoc.id}nodeType`} label={nodeType} />
                                                                                <TreeItem key={`${graphDoc.id}position`} nodeId={`${graphDoc.id}position`} label="position" >
                                                                                    <TreeItem key={`${graphDoc.id}positionX`} nodeId={`${graphDoc.id}positionX`} label={positionX} />
                                                                                    <TreeItem key={`${graphDoc.id}positionY`} nodeId={`${graphDoc.id}positionY`} label={positionY} />
                                                                                </TreeItem>
                                                                                <TreeItem key={`${graphDoc.id}value`} nodeId={`${graphDoc.id}value`} label={value} />
                                                                            </TreeItem>
                                                                        }) : null
                                                                    }
                                                                </TreeItem>}
                                                                {<TreeItem key={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}/variables`} nodeId={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}/variables`} label="variables">
                                                                {
                                                                    !!colVariable?.find(obj => obj.hasOwnProperty(`${scrDoc?.id}`)) ? colVariable?.find(obj => obj.hasOwnProperty(`${scrDoc?.id}`))[`${scrDoc?.id}`]?.map((varDoc) => {
                                                                        const varCreatedAt = "createdAt: " + new Date (varDoc?.data()?.createdAt?.seconds * 10000)
                                                                        const varName = "name: " + varDoc?.data()?.name
                                                                        const varType = "type: " + varDoc?.data()?.type
                                                                        return <TreeItem key={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}/variables/${varDoc.id}`} nodeId={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}/variables/${varDoc.id}`} label={`${varDoc.id}`}>
                                                                            <TreeItem key={`${varDoc.id}varCreatedAt`} nodeId={`${varDoc.id}varCreatedAt`} label={varCreatedAt} />
                                                                            <TreeItem key={`${varDoc.id}varName`} nodeId={`${varDoc.id}varName`} label={varName} />
                                                                            <TreeItem key={`${varDoc.id}varType`} nodeId={`${varDoc.id}varType`} label={varType} />
                                                                        </TreeItem>
                                                                    }) : null
                                                                }
                                                                </TreeItem>}
                                                                {<TreeItem key={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}/parameters`} nodeId={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}/parameters`} label="parameters">
                                                                {
                                                                    !!colParameter?.find(obj => obj.hasOwnProperty(`${scrDoc?.id}`)) ? colParameter?.find(obj => obj.hasOwnProperty(`${scrDoc?.id}`))[`${scrDoc?.id}`]?.map((paraDoc) => {
                                                                        const paraCreatedAt = "createdAt: " + new Date (paraDoc?.data()?.createdAt?.seconds * 10000)
                                                                        const paraDescription = "description: " + paraDoc?.data()?.description
                                                                        const paraName = "name: " + paraDoc?.data()?.name
                                                                        const paraType = "type: " + paraDoc?.data()?.type
                                                                        return <TreeItem key={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}/parameters/${paraDoc.id}`} nodeId={`${orgDoc.id}/applications/${appDoc.id}/screens/${scrDoc.id}/parameters/${paraDoc.id}`} label={`${paraDoc.id}`}>
                                                                            
                                                                            <TreeItem key={`${paraDoc.id}paraCreatedAt`} nodeId={`${paraDoc.id}paraCreatedAt`} label={paraCreatedAt} />
                                                                            <TreeItem key={`${paraDoc.id}paraDescription`} nodeId={`${paraDoc.id}paraDescription`} label={paraDescription} />
                                                                            <TreeItem key={`${paraDoc.id}paraName`} nodeId={`${paraDoc.id}paraName`} label={paraName} />
                                                                            <TreeItem key={`${paraDoc.id}paraType`} nodeId={`${paraDoc.id}paraType`} label={paraType} />
                                                                        </TreeItem>
                                                                    }) : null
                                                                }
                                                                </TreeItem>}
                                                                <TreeItem key={`${scrDoc.id}scrAuthorization`} nodeId={`${scrDoc.id}scrAuthorization`} label={scrAuthorization} />
                                                                <TreeItem key={`${scrDoc.id}screenCreatedDate`} nodeId={`${scrDoc.id}screenCreatedDate`} label={screenCreatedDate} />
                                                                <TreeItem key={`${scrDoc.id}endpointName`} nodeId={`${scrDoc.id}endpointName`} label={endpointName} />
                                                                <TreeItem key={`${scrDoc.id}propertyType`} nodeId={`${scrDoc.id}propertyType`} label={propertyType} />
                                                                <TreeItem key={`${scrDoc.id}route`} nodeId={`${scrDoc.id}route`} label={route} />
                                                            </TreeItem>
                                                    })) : null
                                                }
                                            </TreeItem>
                                            <TreeItem key={`${appDoc.id}createdDateApp`} nodeId={`${appDoc.id}createdDateApp`} label={createdDateApp} />
                                            <TreeItem key={`${appDoc.id}name`} nodeId={`${appDoc.id}name`} label={name} />
                                            <TreeItem key={`${appDoc.id}status`} nodeId={`${appDoc.id}status`} label={status} />
                                            <TreeItem key={`${appDoc.id}updatedDateApp`} nodeId={`${appDoc.id}updatedDateApp`} label={updatedDateApp} />
                                        </TreeItem>}
                                        )) : null
                                    }
                                </TreeItem>
                                <TreeItem key={`${orgDoc?.id}/users`} nodeId={`${orgDoc?.id}/users`} label="users" >
                                    {
                                        !!colUser?.find(obj => obj.hasOwnProperty(`${orgDoc?.id}`)) ? colUser?.find(obj => obj.hasOwnProperty(`${orgDoc?.id}`))[`${orgDoc?.id}`]?.map((userDoc) => {
                                            const userDocData = userDoc.data()
                                            const userCreatedAt = "createdAt: " + new Date(userDocData.createdAt?.seconds * 1000)
                                            const email = "email: " + userDocData.email
                                            const organizationID = "organizationID: " + userDocData.organizationID
                                            const role = "role: " + userDocData.role
                                            const storageCapacity= "storageCapacity: " + userDocData.storageCapacity
                                            const userType = "type: " + userDocData.type
                                            const uid = 'uid: ' + userDocData.uid
                                            return <TreeItem key={`${userDoc.id}`} nodeId={`${userDoc.id}`} label={userDoc.id} >
                                                    <TreeItem key={`${orgDoc?.id}/users/${userCreatedAt}`} nodeId={`${orgDoc?.id}/users/${userCreatedAt}`} label={userCreatedAt} />
                                                    <TreeItem key={`${orgDoc?.id}/users/${email}`} nodeId={`${orgDoc?.id}/users/${email}`} label={email} />
                                                    <TreeItem key={`${orgDoc?.id}/users/${organizationID}`} nodeId={`${orgDoc?.id}/users/${organizationID}`} label={organizationID} />
                                                    <TreeItem key={`${orgDoc?.id}/users/${role}`} nodeId={`${orgDoc?.id}/users/${role}`} label={role} />
                                                    <TreeItem key={`${orgDoc?.id}/users/${storageCapacity}`} nodeId={`${orgDoc?.id}/users/${storageCapacity}`} label={storageCapacity} />
                                                    <TreeItem key={`${orgDoc?.id}/users/${userType}`} nodeId={`${orgDoc?.id}/users/${userType}`} label={userType} />
                                                    <TreeItem key={`${orgDoc?.id}/users/${uid}`} nodeId={`${orgDoc?.id}/users/${uid}`} label={uid} />
                                            </TreeItem>
                                        }) : null
                                    }
                                </TreeItem>
                                <TreeItem key={id+5} nodeId={`${dateOrg}`} label={dateOrg} />
                                <TreeItem key={id+6} nodeId="organizationName" label={`organization: ${orgDoc.data().organization}`} />
                            </TreeItem>
                    }
                )}
            </TreeItem>
            <TreeItem key="users" nodeId="users" label="users">
                {
                    rootUser.map(userDoc => {
                        const userCreatedAt = "createdAt: " + new Date(userDoc.data().createdAt?.seconds * 1000)
                        const userEmail = "email: " + userDoc.data().email
                        const userFullName = "fullName: " + userDoc.data().fullName
                        const organizationID = "organizationID: " + userDoc.data().organizationID
                        const userRole = "role: " + userDoc.data().role
                        const userUid = "uid: " + userDoc.data().uid
                        return <TreeItem key={`user/${userDoc.id}`} nodeId={`user/${userDoc.id}`} label={`${userDoc.id}`}>
                                <TreeItem key={`user/${userDoc.id}/createdAt`} nodeId={`user/${userDoc.id}/createdAt`} label={`${userCreatedAt}`} />
                                <TreeItem key={`user/${userDoc.id}/email`} nodeId={`user/${userDoc.id}/email`} label={`${userEmail}`} />
                                <TreeItem key={`user/${userDoc.id}/fullName`} nodeId={`user/${userDoc.id}/fullName`} label={`${userFullName}`} />
                                <TreeItem key={`user/${userDoc.id}/organizationID`} nodeId={`user/${userDoc.id}/organizationID`} label={`${organizationID}`} />
                                <TreeItem key={`user/${userDoc.id}/role`} nodeId={`user/${userDoc.id}/role`} label={`${userRole}`} />
                                <TreeItem key={`user/${userDoc.id}/uid`} nodeId={`user/${userDoc.id}/uid`} label={`${userUid}`} />
                            </TreeItem>
                    })
                }
                
            </TreeItem>
        </TreeView>
    </>
  );
}