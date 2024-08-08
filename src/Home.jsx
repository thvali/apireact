import { PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, Table, Upload, message } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function Home() {

  const [cities,setCities] = useState([])
  const [open, setOpen] = useState(false)
  const mytoken = localStorage.getItem('token')
  const urlImage = 'https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/'
  const getCity = () =>{
    axios({
        url: 'https://autoapi.dezinfeksiyatashkent.uz/api/cities',
        method: 'GET',
    }).then(data=>{
        setCities(data.data.data)
    }).catch(err=>console.log("Xatolik",err))
  }

  useEffect(()=>{
    getCity()
  },[])
  const showModal = () => {
    setOpen(true)
  }
  const closeModal = () => {
    setOpen(false)
  }
  const columns = [
    {
      title: "Name",
      dataIndex: "name"
    },
    {
      title: "Text",
      dataIndex: "text"
    },
    {
      title: "Images",
      dataIndex: "images",
    },
    {
      title: "Action",
      dataIndex: "button"
    }
  ]
  const data = cities.map((item,index)=>(

    {
      key: index,
      number: index+1,
      name: item.name,
      text: item.text,
      images: (<img style={{width:"150px", height:"130px"}} src={`${urlImage}${item.image_src}`} alt={item.name_en} />),
      button: (<><Button type='primary'>Edit</Button> <Button type='primary' danger>Delete  </Button></>)
    }
  ))

  const createPost = (values) => {
    const formData = new FormData()
    formData.append('name', values.name)
    formData.append('text', values.text)

    if (values.images && values.images.length > 0){
      values.images.forEach((image) => {
        if (image && image.originFileObj){
          formData.append('images', image.originFileObj, image.name)
        }
      })
    } 
    axios({
      url: 'https://autoapi.dezinfeksiyatashkent.uz/api/cities',
      method: 'POST',
      headers:{
        Authorization: `Bearer ${mytoken}`
      },
      data:formData
    })
    .then(res=>{
      if (res?.data?.success){
        message.success("yangi post qo'shdingiz janob")
        setOpen(false)
        getCity()
      }
    })
    .catch(err=>console.log(err))
  }

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    return isJpgOrPng;
  };
  const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
  }
  return (
    <div>
      <Button type='primary' onClick={showModal}>Add</Button>
      <Table columns={columns} dataSource={data} size='middle' pagination = {{pageSize: 3,}}/>
      <Modal open={open} onCancel={closeModal} footer={null}>
        <Form onFinish={createPost}>
          <Form.Item label='text' name='text'>
            <Input placeholder='text' style={{width:'90%'}}/>
          </Form.Item>
          <Form.Item label='name' name='name'>
            <Input placeholder='name'  style={{width:'90%'}}/>
          </Form.Item>
          <Form.Item label="Upload Image" name="images" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: true, message: 'Please upload an image' }]}>
            <Upload
              customRequest={({ onSuccess }) => {onSuccess("ok")}}beforeUpload={beforeUpload} listType="picture-card">
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item>
        <Button type="primary" htmlType="submit">
        Submit
        </Button>
        </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Home