import { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = import.meta.env.VITE_API_BASE;


const Register = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const res = await axios.post(`${api}/register`, values); // 注意这里端口！
            if (res.data.success) {
                message.success('注册成功，请登录');
                navigate('/login'); // 跳转到登录页
            } else {
                message.error(res.data.message || '注册失败');
            }
        } catch (err) {
            message.error('请求出错');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '80px auto' }}>
            <Card title="注册新账号">
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="username"
                        label="用户名"
                        rules={[{ required: true, message: '请输入用户名' }]}
                    >
                        <Input placeholder="请输入用户名" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="密码"
                        rules={[{ required: true, message: '请输入密码' }]}
                    >
                        <Input.Password placeholder="请输入密码" />
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        label="确认密码"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: '请确认密码' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('两次密码输入不一致'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="请再次输入密码" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                        >
                            注册
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            <p style={{ marginTop: 16 }}>
                已有账号？<a onClick={() => navigate('/login')}>立即登录</a>
            </p>

        </div>
    );
};

export default Register;
