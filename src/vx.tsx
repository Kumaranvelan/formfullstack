import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Popconfirm,
  Radio,
  Row,
  Select,
  Switch,
  Table,
  Upload,
  UploadFile,
  UploadProps,
  message,
} from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
interface Details {
  fname: string;
  email: string;
  phone: string;
  gender: string;
  radio: string;
  checkbox?: string[];
}
export const CrudOperation = () => {
  const [form] = useForm();
  const [phone, setPhone] = useState("");
  const [tabledata, setTableData] = useState<Details[]>([]);
  const [editData, setEditData] = useState<string | null>(null);
  const [deletedData, setDeletedData] = useState<Details[]>([]);
  const columns = [
    {
      title: "Sno",
      dataIndex: "sno",
      key: "sno",
      render: (_: any, record: Details, index: number) => <>{index + 1}</>,
    },
    {
      title: "Name",
      dataIndex: "fname",
      key: "fname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Radio",
      dataIndex: "radio",
      key: "radio",
    },
    {
      title: "Checkbox",
      dataIndex: "checkbox",
      key: "checkbox",
      render: (checkbox: string[]) => (checkbox ? checkbox.join(", ") : ""),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: Details, index: number) => (
        <span>
          <Popconfirm
            title="Sure you want to edit this?"
            onConfirm={() => handleEdit(record)}
          >
            <a>Edit</a>
          </Popconfirm>{" "}
          ||
          <Popconfirm
            title="Sure about this delete?"
            onConfirm={() => handleDelete(record.email)}
          >
            <a>Delete</a>
          </Popconfirm>
        </span>
      ),
    },
  ];
  // localstorage..........
  useEffect(() => {
    const data = localStorage.getItem("tabledata");
    if (data) {
      setTableData(JSON?.parse(data));
    }
  }, []);
  // submit.........
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const newData: Details = {
        fname: values.fname,
        email: values.email,
        phone: phone,
        gender: values.gender,
        radio: values.radio,
        // checkbox:values.checkbox||[],
      };
      console.log(newData);
      console.log(values, "values");
      const existingEmail = tabledata?.find(
        (item) => item?.email === newData?.email && item?.email !== editData
      );
      if (existingEmail) {
        message.error("This email already exists!");
        return;
      } else if (editData) {
        const updatedData = tabledata?.map((item) =>
          item.email === editData ? newData : item
        );
        setTableData(updatedData);
        localStorage.setItem("tabledata", JSON.stringify(updatedData));
        setEditData(null);
      } else {
        const newTableData = [...tabledata, newData];
        console.log(newTableData);
        setTableData(newTableData);
        localStorage.setItem("tabledata", JSON.stringify(newTableData));
      }
      form.resetFields();
      setPhone("");
    } catch (error) {
      console.log("Error during creation of data", error);
    }
  };
  // edit..................
  const handleEdit = (record: Details) => {
    form.setFieldsValue({
      fname: record.fname,
      email: record.email,
      gender: record.gender,
      radio: record.radio,
      checkbox: record.checkbox,
    });
    setPhone(record.phone);
    setEditData(record.email);
  };
  // delete......
  function handleDelete(email: string) {
    const deletedItem = tabledata?.find((item) => item.email === email);
    if (deletedItem) {
      const updatedData = tabledata?.filter((item) => item.email !== email);
      setTableData(updatedData);
      localStorage.setItem("tabledata", JSON.stringify(updatedData));
      if (deletedData) {
        setDeletedData([...deletedData, deletedItem]);
      } else {
        setDeletedData([deletedItem]);
      }
      console.log("Deleted Item:", deletedItem);
      console.log("Updated Data:", updatedData);
    } else {
      console.log("Item not found in table data.");
    }
  }
  return (
    <>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        form={form}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Name"
          name="fname"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "The input is not a valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input disabled={!!editData} />
        </Form.Item>
        <Form.Item label="Phone">
          <PhoneInput
            country={"in"}
            value={phone}
            onChange={(phone:any) => setPhone(phone)}
          />
        </Form.Item>
        <Form.Item name="gender" label="gender">
          <Select
            defaultValue="select"
            // style={{ width: 120 }}
            options={[
              { value: "male", label: "male" },
              { value: "female", label: "female" },
              { value: "others", label: "others" },
            ]}
          />
        </Form.Item>
        <Form.Item name="radio" label="radio">
          <Radio.Group>
            <Radio value={1}>1</Radio>
            <Radio value={2}>2</Radio>
            <Radio value={3}>3</Radio>
            <Radio value={4}>4</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="checkbox" label="checkbox">
          <Checkbox.Group>
            <Row>
              <Col>
                <Checkbox value="A">A</Checkbox>
              </Col>
              <Col>
                <Checkbox value="B">B</Checkbox>
              </Col>
              <Col>
                <Checkbox value="C">C</Checkbox>
              </Col>
              <Col>
                <Checkbox value="D">D</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item label="switch">
          <Switch checkedChildren="IN" unCheckedChildren="OUT" defaultChecked />
        </Form.Item>
        <Button onClick={handleSubmit}>{editData ? "Update" : "Save"}</Button>
      </Form>
      <Table dataSource={tabledata} columns={columns} />
    </>
  );
};