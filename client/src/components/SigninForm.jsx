// SigninForm.js
import React, { useState } from "react";
import { Button, Form, Input, Typography, Alert } from "antd";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const SigninForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignin = async (e) => {
    setLoading(true);
    // Simulate API call

    try {
      const response = await fetch("/api/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`Welcome back, ${data.user.username}!`);
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id); // Store the user ID
        login(); // User is authenticated

        setError("");
        setLoading(false);
        navigate("/users");
      } else {
        setError(data.error || "Signin failed");
        setSuccess("");
      }
    } catch (error) {
      setError("An error occurred during signin");
    }
  };

  return (
    <div className="py-10 mt-10 h-screen flex flex-col md:flex-row justify-center items-center gap-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 md:px-16">
      {/* Right Content - Welcome Message */}
      <div className="md:flex flex-1 flex-col justify-center items-center text-center md:pl-10">
        <Title level={1} className="text-yellow-300 font-bold">
          Welcome Back to{" "}
          <span className="text-yellow-300 font-bold">My Chat App</span>
        </Title>
        <Text className="text-lg md:text-xl text-gray-200">
          Sign in to reconnect with your friends and explore your conversations
          effortlessly!
        </Text>
      </div>
      {/* Left Content - Sign In Form */}
      <div className="w-full md:w-1/2 max-w-md p-6 bg-white rounded-lg shadow-lg text-gray-800">
        <Title level={2} className="text-center text-purple-600 mb-6">
          Sign In
        </Title>
        {error && <Alert message={error} type="error" className="mb-4" />}
        {success && <Alert message={success} type="success" className="mb-4" />}
        <Form layout="vertical" onFinish={handleSignin} className="space-y-4">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
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
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SigninForm;
