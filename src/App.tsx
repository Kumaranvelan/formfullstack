import React, { useState } from 'react';
import './App.css';
import { Button, Checkbox, Form, Input, Popconfirm, Radio, Table, Upload } from 'antd';
import axios from 'axios';

interface Datas {
  _id: any;
  name: string;
  email: string;
  gender: string;
  account: string[];
  upload: {
    _id: any; name: string; originFileObj: File 
}[];
}

const App = () => {
  const [form] = Form.useForm();
  const [tabledata, setTableData] = useState<Datas[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
    },
    {
      title: 'Account',
      dataIndex: 'account',
      render: (text: any) => (Array.isArray(text) ? text.join(',') : text),
    },
    {
      title: 'Upload',
      dataIndex: 'upload',
      render: (text: any, record: Datas) => (
        Array.isArray(text) ? text.map((file: { name: string }) => file.name).join(', ') : text
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (text: string, record: Datas, index: number) => (
        <span>
          <a onClick={() => handleEdit(index)}>Edit</a> ||
          <Popconfirm title="Sure about this delete?" onConfirm={() => handleDelete(index)}>
            <a>Delete</a>
          </Popconfirm>
        </span>
      ),
    },
  ];

  const handleSubmit = async (values: any) => {
    try {
      await form.validateFields();
      console.log('values submitted ', values);

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('gender', values.gender);
      formData.append('account', values.account.toString());

      if (values.upload && values.upload.length > 0) {
        formData.append('upload', values.upload[0].originFileObj);
      }

      if (editingIndex !== null) {
        await axios.put(`http://localhost:4044/api/Form/${tabledata[editingIndex]._id}`, formData);
        const updatedData = [...tabledata];
        updatedData[editingIndex] = {
          ...values,
          _id: tabledata[editingIndex]._id,
          upload: values.upload.map((file: any) => ({ name: file.name, originFileObj: file.originFileObj })),
        };
        setTableData(updatedData);
        setEditingIndex(null);
      } else {
        const response = await axios.post('http://localhost:4044/api/Form', formData);
        setTableData((prevData) => [...prevData, response.data]);
      }

      form.resetFields();
    } catch (error) {
      console.error('form validation error', error);
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);

    const rowData = tabledata[index];
    const uploadData = Array.isArray(rowData.upload) ? rowData.upload.map((file) => ({
      uid: file._id,
      name: file.name,
      status: 'done',
      url: `/path/to/file/${file.name}`, // Adjust according to your API response
      originFileObj: file.originFileObj,
    })) : [];

    form.setFieldsValue({
      name: rowData.name,
      email: rowData.email,
      gender: rowData.gender,
      account: rowData.account,
      upload: uploadData,
    });

    form.validateFields();
  };

  const handleDelete = async (index: number) => {
    try {
      await axios.delete(`http://localhost:4044/api/Form/${tabledata[index]._id}`);
      const updatedData = tabledata.filter((_data, i) => i !== index);
      setTableData(updatedData);
    } catch (error) {
      console.error('Error in Deleting from entry', error);
    }
  };

  return (
    <div className="App">
      <div>
        <Form onFinish={handleSubmit} form={form}>
          <Form.Item name="name" label="Name:">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email:">
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Gender:">
            <Radio.Group>
              <Radio value="Male">Male</Radio>
              <Radio value="female">Female</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="account" label="DO YOU HAVE A BANK ACCOUNT:">
            <Checkbox.Group>
              <Checkbox value="Yes">Yes</Checkbox>
              <Checkbox value="No">No</Checkbox>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item
            name="upload"
            label="Upload Image"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
          >
            <Upload beforeUpload={() => false} listType="picture-card" maxCount={1} accept="image/*">
              <div style={{ marginTop: '8px' }}>Click to Upload</div>
            </Upload>
          </Form.Item>
          <Button htmlType="submit">Submit</Button>
        </Form>
      </div>
      <div>
        <Table dataSource={tabledata} columns={columns} />
      </div>
    </div>
  );
};

export default App;
