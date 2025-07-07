// import { useState } from 'react';
// import { Form, Input, Button, Card, message } from 'antd';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';



// const Login = () => {
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     const onFinish = async (values) => {
//         try {
//             setLoading(true);
//             const res = await axios.post('http://localhost:5000/login', values);
//             console.log('响应数据:', res.data);
//             if (res.data.success) {
//                 message.info("登陆成功！")
//                 console.log("牛逼，登陆成功")
//                 localStorage.setItem('user', JSON.stringify(res.data.user)); // 保存用户信息，在登陆后，会将用户的信息（username保存到本地中去）
//                 navigate('/'); // 跳转首页
//             } else {
//                 // alert('看这里！'); // ✅ 手动确认是否真的进入了这里
//                 console.log("笨蛋！登陆失败")
//                 message.info("密码错了！！笨蛋")
//             }
//         } catch (err) {
//             console.log('错误信息:', err);
//             message.error('请求出错');


//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div style={{ maxWidth: 400, margin: '80px auto' }}>
//             <Card title="登录账号">
//                 <Form layout="vertical" onFinish={onFinish}>
//                     <Form.Item
//                         name="username"
//                         label="用户名"
//                         rules={[{ required: true, message: '请输入用户名' }]}
//                     >
//                         <Input placeholder="请输入用户名" />
//                     </Form.Item>

//                     <Form.Item
//                         name="password"
//                         label="密码"
//                         rules={[{ required: true, message: '请输入密码' }]}
//                     >
//                         <Input.Password placeholder="请输入密码" />
//                     </Form.Item>

//                     <Form.Item>
//                         <Button type="primary" htmlType="submit" loading={loading} block>
//                             登录
//                         </Button>
//                     </Form.Item>
//                 </Form>
//             </Card>
//             <p style={{ marginTop: 16 }}>
//                 没有账号？<a onClick={() => navigate('/register')}>注册</a>
//             </p>

//         </div>
//     );
// };

// export default Login;

import { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = import.meta.env.VITE_API_BASE;


const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm(); // 绑定表单实例
    const [fieldErrors, setFieldErrors] = useState({}); // 用于存储用户名/密码的错误状态

    const onFinish = async (values) => {
        try {
            setLoading(true);
            setFieldErrors({}); // 清空旧的错误
            const res = await axios.post('${api}/login', values);
            console.log('响应数据:', res.data);

            if (res.data.success) {
                message.success("登录成功！");
                localStorage.setItem('user', JSON.stringify(res.data.user));
                navigate('/');
            } else {
                // 显示在表单下方的错误信息
                const msg = res.data.message || '登录失败';
                // 优先使用后端返回的错误信息 res.data.message
                // 若后端未返回具体错误（res.data.message 为 undefined），则使用默认提示 '登录失败'
                if (msg.includes('用户')) {
                    setFieldErrors({ username: msg });
                } else if (msg.includes('密码')) {
                    setFieldErrors({ password: msg });
                } else {
                    message.error(msg);
                }
            }
        } catch (err) {
            console.log('错误信息:', err);
            message.error('服务器出错');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '80px auto' }}>
            <Card title="登录账号">
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="username"
                        label="用户名"
                        rules={[{ required: true, message: '请输入用户名' }]}
                        validateStatus={fieldErrors.username ? 'error' : ''}
                        help={fieldErrors.username}
                    >
                        <Input placeholder="请输入用户名" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="密码"
                        rules={[{ required: true, message: '请输入密码' }]}
                        validateStatus={fieldErrors.password ? 'error' : ''}
                        help={fieldErrors.password}
                    >
                        <Input.Password placeholder="请输入密码" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            <p style={{ marginTop: 16 }}>
                没有账号？<a onClick={() => navigate('/register')}>注册</a>
            </p>
        </div>
    );
};

export default Login;
