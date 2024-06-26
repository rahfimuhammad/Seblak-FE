import React, { useState } from 'react'
import { useOrder } from '../context/OrderProvider'
import { useDisclosure } from '@chakra-ui/react'
import { Box, ModalOverlay, Button, Modal } from '@chakra-ui/react'
import { IsSmallScreen } from '../function/detectSmallScreen'
import { PlusCircleOutlined } from '@ant-design/icons'
import NewOrder from '../elements/NewOrder'
import NewOrderList from './NewOrderList'
import Orderlist from './Orderlist'
import Spinner from '../elements/Spinner'
import axios from 'axios'

const CreateOrder = () => {

  const { orderId, processOrder, loading } = useOrder()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [clientName, setClientName] = useState("")
  const [orderlists, setOrderlists] = useState([])
  const isSmall = IsSmallScreen()
  const [isLoading, setIsLoading] = useState(false)

  const getOrderlists = async () => {
    try {
      setIsLoading(true)
      const orderlists = await axios.get(`https://seblak-api-40223dc59db0.herokuapp.com/orderlist/${orderId}`)
        setOrderlists(orderlists?.data?.data)
        
    } catch (error) {
        console.log(error.message)
    } finally {
        setIsLoading(false)
    }
  }

  const handleCreateOrderlist = () => {
    onOpen()
  }

  const handleProcessOrder = async () => {
    await processOrder(orderId)
    setOrderlists([])
  }

  return (
      <Box 
        w='100%' 
        display='flex' 
        flexDirection='column' 
        gap='10px' 
        alignItems='center' 
        p='10px'
      >
        {orderId && 
        <Box 
          bg='gray.200' 
          w={isSmall? '100%' : '550px'} 
          h='200px' 
          borderRadius='10px' 
          display='flex' 
          justifyContent='center' 
          alignItems='center'
          onClick={handleCreateOrderlist}>
          <PlusCircleOutlined 
                  style={{fontSize: "40px"}} 
                  color='#5f656e'
          />
        </Box>
        }
        <Box 
          style={{display: "flex", 
                  flexDirection: "column", 
                  gap: "10px", 
                  width: "100%",
                  height: "fit-content", 
                  alignItems: "center"}}
        >
          {isLoading && <Spinner size={25}/>}
          {orderlists.map((orderlist, index) => (
              <Orderlist 
                      key={index} 
                      orderlist={orderlist} 
                      index={index}/>
          ))}
        </Box>
        {!orderId 
        &&
        <div 
          style={{width: "calc(100% - 20px)", 
                  height: `${isSmall? "calc(100vh - 160px)" : "calc(100vh - 60px)"}`, 
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center"}}
        >
          <div 
            style={{display: "flex", 
                    flexDirection: "column", 
                    gap: "10px", 
                    alignItems: "center"}}
          >
            <img 
              src='/assets/OrderImage.png' 
              alt='order' 
              style={{width: "250px", 
                      height: "auto"}}
            />
            <Button onClick={onOpen}>
              Create Order
            </Button>
          </div>
        </div>}
        <Modal 
            isOpen={isOpen} 
            onClose={onClose}>
          <ModalOverlay />
              {orderId
              ? <NewOrderList 
                          orderId={orderId} 
                          onClose={onClose} 
                          getOrderlists={getOrderlists} /> 
              : <NewOrder  
                      setClientName={setClientName} 
                      onClose={onClose} 
                      data={clientName}/>
              }
        </Modal>
        {orderlists.length
        ? <Button 
              colorScheme='teal' 
              mt='10px' 
              mb='10px' 
              onClick={handleProcessOrder}
          >
            {loading? <Spinner size={20}/> : "Save Order"}
          </Button> 
          : null
        }
      </Box>
  )
}

export default CreateOrder