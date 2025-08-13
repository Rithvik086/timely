"use client";

import { Button, Typography, Space, Layout } from "antd";
import { LoginOutlined, CalendarOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Content } = Layout;

export default function Home() {
  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Content
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <Space direction="vertical" size="large" align="center">
          <CalendarOutlined style={{ fontSize: "4rem", color: "#1890ff" }} />
          <Title level={1} style={{ margin: 0 }}>
            Timely
          </Title>
          <Text
            style={{
              fontSize: "1.2rem",
              textAlign: "center",
              maxWidth: "600px",
              marginBottom: "2rem",
            }}
          >
            Simplify your scheduling and time management with Timely
          </Text>

          <Space size="middle">
            <Button
              type="primary"
              size="large"
              icon={<LoginOutlined />}
              href="/auth/login"
              style={{ minWidth: "150px" }}
            >
              Login
            </Button>
            <Button
              size="large"
              href="/dashboard/manager"
              style={{ minWidth: "150px" }}
            >
              Learn More
            </Button>
          </Space>
        </Space>
      </Content>
    </Layout>
  );
}
