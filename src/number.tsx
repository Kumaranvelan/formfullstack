import { Button, Form, Input } from "antd";
import { useState } from "react";
import validator from "validator";
import './App.css';

export const Numbers = () => {
  const [amount, SetAmount] = useState(Number);
  const [alert, SetAlert] = useState("");
  const [email, SetEmail] = useState("");
  const [message, SetMessage] = useState("");
  const [selectedColor, SetSelectedColor] = useState("white");
  const[green,SetGreen] = useState('White');
  const [yellow,SetYellow] = useState ('white');

const colorChange = () => {
    const color = selectedColor === 'white' ? 'red':'white'
    SetSelectedColor(color);
}
const colorChanged = () => {
    const color = yellow === 'white' ? 'yellow':'white'
    SetYellow(color);
}
const colorChangedd = () => {
    const color = green === 'white' ? 'green':'white'
    SetGreen(color);
}


console.log(selectedColor,'selectedColor')
  const handleEmail = (event: any) => {
    const mail = event.target.value;
    SetEmail(mail);
    if (!validator.isEmail(mail)) {
      SetMessage("! Please, Enter a proper Email ID");
    } else {
      SetMessage("");
    }
  };

  const handleChange = (e: any) => {
    const value = e.target.value;
    if (isNaN(value)) {
      SetAlert("Only Numbers Are Allowed");
    } else {
      if (parseInt(value) > 1000) {
        SetAlert("Amount should not be over 1000");
      } else {
        SetAmount(value);
        SetAlert("");
      }
    }
  };

  return (
    <>
      <div>
        <Form.Item label="Amount" name="Amount">
          <Input onChange={handleChange} value={amount} />
          {alert && <div style={{ color: "red" }}>{alert}</div>}
        </Form.Item>
        <Form.Item label="Email" name="Email">
          <Input value={email} onChange={handleEmail} />
          {message && <div style={{ color: "red" }}>{message}</div>}
        </Form.Item>
        <Form.Item label="Mobile Number" name="Mobile Number">
          <Input type="number" maxLength={10} />
        </Form.Item>
      </div>

      <Button style={{backgroundColor:selectedColor,color:'black'}}  onClick={colorChange}>red</Button>
      <Button style={{ backgroundColor: yellow,color:'black' }} onClick={colorChanged}>yellow</Button>
      <Button style={{ backgroundColor: green,color:'black' }} onClick={colorChangedd}>green</Button>
    </>
  );
};
