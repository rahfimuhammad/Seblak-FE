import React, { useState } from 'react'
import axios from 'axios'
import OrderImage from "../assets/OrderImage.png"
import { useDisclosure } from '@chakra-ui/react'
import { Box, ModalOverlay, Button, Modal } from '@chakra-ui/react'
import NewOrderList from './NewOrderList'
import Orderlist from './Orderlist'
import { IsSmallScreen } from '../hooks/useSmallScreen'
import NewOrder from './NewOrder'

const CreateOrder = () => {

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [clientName, setClientName] = useState("")
  const [orderId, setOrderId] = useState("")
  const [orderlistId, setOrderlistId] = useState("")
  const [orderlists, setOrderlists] = useState([])
  const isSmall = IsSmallScreen()

  const getOrderlists = async () => {

    try {
      const orderlists = await axios.get(`http://localhost:5000/orderlist/${orderId}`)
      setOrderlists(orderlists?.data?.data)
    } catch (error) {
      console.log(error.message)
    }
  }

  const createNewOrder = async () => {
    try {
      const response = await axios.post('http://localhost:5000/order', {
        client: clientName
        }
      )
        setOrderId(response?.data?.data?.id)
        onClose()
    } catch (error) {
      console.log(error.message)
    }
  }

  const createOrderList = async () => {
    try {
      onOpen()
      const response = await axios.post('http://localhost:5000/orderlist', {
        orderId: orderId,
        additional: "telor mata sapi",
        spicylevelId: 4
        }
      )
        setOrderlistId(response?.data?.data?.id)
    } catch (error) {
      console.log(error.message)
    }
  }

  const processOrder = async () => {

    try {
      const response = await axios.patch(`http://localhost:5000/order/process/${orderId}`, {
        client: clientName
      })
    } catch (error) {
      console.log(error.message)
    } finally {
      setClientName("")
      setOrderId("")
      setOrderlistId("")
      setOrderlists([])
    }
  }

  const saveOrder = () => {
    processOrder()
  }

  return (
    <>
        {orderId && <Box bg='gray.200' w={isSmall? '95%' : '550px'} mt='10px' mb='10px' h='200px' borderRadius='10px' onClick={() => createOrderList()}>Add Orderlist</Box>}
        <div style={{display: "flex", flexDirection: "column", gap: "10px", width: "100%", alignItems: "center"}}>
          {orderlists.map((orderlist, index) => (
              <Orderlist key={index} orderlist={orderlist} index={index}/>
          ))}
        </div>
        {!orderId 
        &&
        <div style={{width: "100%", height: `${isSmall? "calc(100vh - 120px)" : "calc(100vh - 60px)"}`, display: "flex", justifyContent: "center", alignItems: "center"}}>
          <div style={{display: "flex", flexDirection: "column", gap: "10px", alignItems: "center"}}>
            <img src={OrderImage} alt='order' style={{width: "250px", height: "auto"}}/>
            <Button onClick={onOpen}>Create New Order</Button>
          </div>
        </div>}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
              {orderId
              ? <NewOrderList orderlistId={orderlistId} onClose={onClose} getOrderlists={getOrderlists} /> 
              : <NewOrder clientName={clientName} setClientName={setClientName} onClose={onClose} actionFunction={createNewOrder}/>
              }
        </Modal>
        {orderlists.length?  <Button colorScheme='teal' mt='10px' mb='10px' onClick={() => saveOrder()}>Save Order</Button> : null}
    </>
  )
}

export default CreateOrder