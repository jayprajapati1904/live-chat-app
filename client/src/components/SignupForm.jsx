// SignupForm.js
import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const SignupForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Form Submitted:", values);
      setLoading(false);
    }, 2000);

    try {
      const response = await fetch("/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        message.success(`Welcome, ${data.user.username}! Signup successful.`);
        localStorage.setItem("token", data.token);
        navigate("/users");
      } else {
        message.error(data.error || "Signup failed. Please try again.");
      }
    } catch (error) {
      message.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 mt-10 h-screen flex flex-col md:flex-row justify-center items-center gap-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 md:px-16">
      {/* Right Content - Welcome Message */}
      <div className=" md:flex flex-1 flex-col justify-center items-center text-center md:pl-10">
        <Title level={1} className="mb-4 text-4xl md:text-5xl font-bold">
          Welcome to{" "}
          <span className="text-yellow-300 font-bold">My Chat App</span>
        </Title>
        <Text className="text-lg md:text-xl text-gray-200">
          Join now to connect with your friends and family. Experience seamless
          and secure conversations in real-time!
        </Text>
      </div>
      {/* Left Content - Signup Form */}
      <div className="w-full md:w-1/2 max-w-md p-6 bg-white rounded-lg shadow-lg text-gray-800">
        <Title level={2} className="text-center mb-6 text-purple-600">
          Create an Account
        </Title>
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ remember: true }}
          className="space-y-4"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              {
                min: 8,
                message: "Password must be at least 8 characters long!",
              },
            ]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2"
              loading={loading}
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignupForm;
