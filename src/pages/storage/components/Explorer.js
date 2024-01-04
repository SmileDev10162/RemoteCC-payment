import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getBuckets } from '../../../store/actions/storageAction'
import PropTypes from 'prop-types'
import { Link as ReactRouterLink, useSearchParams } from 'react-router-dom'
import {
  Box,
  VStack,
  Heading,
  Text,
  Link,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Icon
} from '@chakra-ui/react'
import { GrHome, GrFolder, GrDocument, GrFormNext } from 'react-icons/gr'
import { useContents } from '../hooks/useContents'
import { sanitizePrefix, formatFileSize } from '../helpers'
import { useState } from 'react'
import FileBrowser, {Icons} from 'react-keyed-file-browser'
import 'font-awesome/css/font-awesome.min.css'
import Moment from 'moment';
import 'react-keyed-file-browser/dist/react-keyed-file-browser.css';


const bucket_name = 'rcc-dev'

const exclude_pattern = '^index\\.html$'
const excludeRegex = new RegExp(exclude_pattern || /(?!)/)

// export default function Explorer () {
//   const { user } = useSelector(state => state.auth)
//   const { buckets } = useSelector(state => state.storage)
//   const dispatch = useDispatch()

//   useEffect(() => {
//     dispatch(getBuckets(user.id))
//   }, [])

//   const [searchParams] = useSearchParams()
//   const prefix = sanitizePrefix(searchParams.get('prefix') || '')

//   useEffect(() => {
//     document.title = bucket_name
//   }, [])

//   return (
//     <Box width={'100%'} mt={6}>
//       <VStack alignItems='left'>
//         {/* <Navigation prefix={prefix} />
//         <Listing buckets={buckets} /> */}
//       </VStack>
//     </Box>
//   )
// }


export default function Explorer () {
  
  // const [files, setFiles] = useState([
  //   {
  //     key: 'photos/animals/cat in a hat.png',
  //     modified: +Moment().subtract(1, 'hours'),
  //     size: 1.5 * 1024 * 1024,
  //   },
  //   {
  //     key: 'photos/animals/kitten_ball.png',
  //     modified: +Moment().subtract(3, 'days'),
  //     size: 545 * 1024,
  //   },
  //   {
  //     key: 'photos/animals/elephants.png',
  //     modified: +Moment().subtract(3, 'days'),
  //     size: 52 * 1024,
  //   },
  //   {
  //     key: 'photos/funny fall.gif',
  //     modified: +Moment().subtract(2, 'months'),
  //     size: 13.2 * 1024 * 1024,
  //   },
  //   {
  //     key: 'photos/holiday.jpg',
  //     modified: +Moment().subtract(25, 'days'),
  //     size: 85 * 1024,
  //   },
  //   {
  //     key: 'documents/letter chunks.doc',
  //     modified: +Moment().subtract(15, 'days'),
  //     size: 480 * 1024,
  //   },
  //   {
  //     key: 'documents/export.pdf',
  //     modified: +Moment().subtract(15, 'days'),
  //     size: 4.2 * 1024 * 1024,
  //   },
  // ]);

  
  const { user } = useSelector(state => state.auth)
  const buckets = useSelector(state => state.storage.buckets)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getBuckets(user.id))
  }, [])

  const [searchParams] = useSearchParams()
  const prefix = sanitizePrefix(searchParams.get('prefix') || '')

  useEffect(() => {
    document.title = bucket_name
  }, [])



  const handleCreateFolder = (key) => {
    setFiles((prevFiles) => [
      ...prevFiles,
      {
        key: key,
      },
    ]);
  };

  const handleCreateFiles = (uploadedFiles, prefix) => {
    setFiles((prevFiles) => {
      const newFiles = uploadedFiles.map((file) => {
        let newKey = prefix;
        if (prefix !== '' && prefix.substring(prefix.length - 1, prefix.length) !== '/') {
          newKey += '/';
        }
        newKey += file.name;
        return {
          key: newKey,
          size: file.size,
          modified: +Moment(),
        };
      });

      const uniqueNewFiles = newFiles.filter((newFile) => {
        return !prevFiles.some((existingFile) => existingFile.key === newFile.key);
      });

      return [...prevFiles, ...uniqueNewFiles];
    });
  };

  const handleRenameFolder = (oldKey, newKey) => {
    setFiles((prevFiles) => {
      const newFiles = prevFiles.map((file) => {
        if (file.key.substr(0, oldKey.length) === oldKey) {
          return {
            ...file,
            key: file.key.replace(oldKey, newKey),
            modified: +Moment(),
          };
        }
        return file;
      });
      return newFiles;
    });
  };

  const handleRenameFile = (oldKey, newKey) => {
    setFiles((prevFiles) => {
      const newFiles = prevFiles.map((file) => {
        if (file.key === oldKey) {
          return {
            ...file,
            key: newKey,
            modified: +Moment(),
          };
        }
        return file;
      });
      return newFiles;
    });
  };

  const handleDeleteFolder = (folderKey) => {
    setFiles((prevFiles) => {
      const newFiles = prevFiles.filter((file) => file.key.substr(0, folderKey.length) !== folderKey);
      return newFiles;
    });
  };

  const handleDeleteFile = (fileKey) => {
    setFiles((prevFiles) => {
      const newFiles = prevFiles.filter((file) => file.key !== fileKey);
      return newFiles;
    });
  };

  return (
    <Box width={'100%'} mt={6}>
      <VStack alignItems='left'>
          <FileBrowser
            files={buckets}
            icons={Icons.FontAwesome(4)}
            onCreateFolder={handleCreateFolder}
            onCreateFiles={handleCreateFiles}
            onMoveFolder={handleRenameFolder}
            onMoveFile={handleRenameFile}
            onRenameFolder={handleRenameFolder}
            onRenameFile={handleRenameFile}
            onDeleteFolder={handleDeleteFolder}
            onDeleteFile={handleDeleteFile}
          />
      </VStack>
    </Box>
  )
}

function Navigation ({ prefix }) {
  const folders = prefix
    .split('/')
    .slice(0, -1)
    .map((item, index, items) => ({
      name: `${item}/`,
      url: `/?prefix=${items.slice(0, index + 1).join('/')}/`,
      isCurrent: index == items.length - 1
    }))

  return (
    <Breadcrumb
      borderWidth='1px'
      shadow='md'
      p={3}
      background='gray.100'
      spacing={1}
      separator={<Icon as={GrFormNext} verticalAlign='middle' />}
    >
      <BreadcrumbItem key='root' isCurrentPage={folders.length == 0}>
        {folders.length == 0 ? (
          <Text color='gray.900'>
            <Icon as={GrHome} mr={2} verticalAlign='text-top' />
            {bucket_name}
          </Text>
        ) : (
          <BreadcrumbLink as={ReactRouterLink} to='' aria-label='bucket root'>
            <Icon as={GrHome} verticalAlign='text-top' />
          </BreadcrumbLink>
        )}
      </BreadcrumbItem>
      {folders.map((item, index) => (
        <BreadcrumbItem key={index} isCurrentPage={item.isCurrent}>
          {item.isCurrent ? (
            <Text color='gray.400'>{item.name}</Text>
          ) : (
            <BreadcrumbLink as={ReactRouterLink} to={item.url}>
              {item.name}
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  )
}

Navigation.propTypes = {
  prefix: PropTypes.string
}

function Listing ({ buckets }) {
  // const { status, data, error } = useContents(prefix);

  const [folders, setFolders] = useState([])
  const [objects, setObjects] = useState([])

  useEffect(() => {
    let temp_folder = []
    let temp_object = []

    buckets?.CommonPrefixes?.filter(({ Prefix }) => !excludeRegex.test(Prefix)).map(({ Prefix }) =>
      temp_folder.push({
        name: Prefix.slice(buckets.length),
        path: Prefix,
        url: `/?prefix=${Prefix}`
      })
    ) || []

    buckets?.Contents?.filter(({ Key }) => !excludeRegex.test(Key)).map(({ Key, LastModified, Size }) =>
      temp_object.push({
        name: Key.slice(buckets.length),
        lastModified: LastModified,
        size: Size,
        path: Key,
        url: `http://${bucket_name}/${Key}`
      })
    ) || []
      console.log("temp_folder: ", temp_folder)
      console.log("temp_object: ", temp_object)
    setFolders(temp_folder)
    setObjects(temp_object)
  }, [buckets])

  return (
    <Box width={'100%'}>
      {/* <Heading as='h3' size='lg' mt={2} mb={2} fontWeight='light'>
        {prefix ? `${prefix.split('/').slice(-2, -1)}/` : bucketName}
        {bucketName}
      </Heading> */}
      <Box borderWidth='1px' shadow='md'>
        <Table variant='simple' size='sm'>
          <Thead background='gray.200'>
            <Tr>
              <Th>Name</Th>
              <Th>Last modified</Th>
              <Th>Size</Th>
            </Tr>
          </Thead>
          <Tbody>
            {(() => {
              // case 'loading':
              //   return (
              //     <Tr>
              //       <Td colSpan={3} textAlign='center'>
              //         <Spinner size='sm' emptyColor='gray.200' verticalAlign='middle' mr={1} />
              //         Loading...
              //       </Td>
              //     </Tr>
              //   )
              // case 'error':
              //   return (
              //     <Tr>
              //       <Td colSpan={3} textAlign='center'>
              //         Failed to fetch data: {error.message}
              //       </Td>
              //     </Tr>
              //   )
              return (
                <>
                  {folders.map((item, index) => (
                    <Tr key={index}>
                      <Td>
                        <Icon as={GrFolder} mr={1} verticalAlign='text-top' />
                        <Link as={ReactRouterLink} to={item.url}>
                          {item.name}
                        </Link>
                      </Td>
                      <Td>–</Td>
                      <Td isNumeric>–</Td>
                    </Tr>
                  ))}
                  {objects.map((item, index) => (
                    <Tr key={index}>
                      <Td>
                        <Icon as={GrDocument} mr={1} verticalAlign='text-top' />
                        <Link href={item.url} isExternal>
                          {item.name}
                        </Link>
                      </Td>
                      <Td>{item.lastModified.toLocaleString()}</Td>
                      <Td isNumeric>{formatFileSize(item.size)}</Td>
                    </Tr>
                  ))}
                </>
              )
            })()}
          </Tbody>
        </Table>
      </Box>
    </Box>
  )
}

Listing.propTypes = {
  prefix: PropTypes.string
}
