// // 接下来我为你完成了添加游记的前端页面组件 AddTourForm.jsx，它具备以下能力：

// // ✅ 输入标题、描述、花费、时长
// // ✅ 上传一张“主图片”（主卡片封面）和多张“其他图片”（详情页展示）
// // ✅ 提交后调用 / api / tours / add 并写入后端 tours.json 文件


// import { useState } from 'react';
// import { Input, Button, Upload, Form, message } from 'antd';
// import { PlusOutlined } from '@ant-design/icons';
// import axios from 'axios';

// const api = import.meta.env.VITE_API_BASE;

// const AddTourForm = () => {
//     const [form] = Form.useForm();
//     const [mainImage, setMainImage] = useState(null);
//     const [otherImages, setOtherImages] = useState([]);
//     const [uploading, setUploading] = useState(false);

//     const username = JSON.parse(localStorage.getItem('user'))?.username;

//     const handleUpload = async (file) => {
//         const formData = new FormData();
//         formData.append('file', file);
//         formData.append('username', username);

//         try {
//             const res = await axios.post(`${api}/upload-tour-image`, formData);
//             return res.data.url;
//         } catch (err) {
//             message.error('图片上传失败');
//             throw err;
//         }
//     };

//     const onFinish = async (values) => {
//         if (!mainImage) return message.warning('请上传主图片');
//         setUploading(true);
//         try {
//             const imageUrls = await Promise.all(
//                 otherImages.map(file => handleUpload(file.originFileObj))
//             );

//             await axios.post(`${api}/api/tours/add`, {
//                 ...values,
//                 username,
//                 mainImage,
//                 images: imageUrls
//             });

//             message.success('游记上传成功');
//             form.resetFields();
//             setMainImage(null);
//             setOtherImages([]);
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setUploading(false);
//         }
//     };

//     return (
//         <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
//             <h2>添加新游记</h2>
//             <Form form={form} layout="vertical" onFinish={onFinish}>
//                 <Form.Item name="name" label="游记标题" rules={[{ required: true, message: '请输入标题' }]}>
//                     <Input />
//                 </Form.Item>
//                 <Form.Item name="description" label="描述" rules={[{ required: true }]}>
//                     <Input.TextArea rows={4} />
//                 </Form.Item>
//                 <Form.Item name="price" label="花费 (元)" rules={[{ required: true }]}>
//                     <Input type="number" />
//                 </Form.Item>
//                 <Form.Item name="duration" label="游玩时长 (例如：3天2夜)" rules={[{ required: true }]}>
//                     <Input />
//                 </Form.Item>
//                 <Form.Item name="accommodation" label="消费项目" rules={[{ required: true, message: '请填写食宿标准' }]}>
//                     <Input.TextArea rows={3} placeholder="例如：住在山顶民宿，吃了当地烤鱼和酸汤牛肉锅" />
//                 </Form.Item>

//                 <Form.Item label="主图片" required>
//                     <Upload
//                         beforeUpload={async file => {
//                             const url = await handleUpload(file);
//                             setMainImage(url);
//                             return false;
//                         }}
//                         showUploadList={false}
//                     >
//                         <Button icon={<PlusOutlined />}>上传主图片</Button>
//                     </Upload>
//                     {mainImage && <img src={mainImage} style={{ width: '100%', marginTop: 10 }} />}
//                 </Form.Item>

//                 <Form.Item label="其他图片">
//                     <Upload
//                         multiple
//                         beforeUpload={() => false}
//                         fileList={otherImages}
//                         onChange={({ fileList }) => setOtherImages(fileList)}
//                     >
//                         <Button icon={<PlusOutlined />}>选择其他图片</Button>
//                     </Upload>
//                 </Form.Item>

//                 <Form.Item>
//                     <Button type="primary" htmlType="submit" loading={uploading}>
//                         上传目的地
//                     </Button>
//                 </Form.Item>
//             </Form>
//         </div>
//     );
// };

// export default AddTourForm;
import { useState } from 'react';
import { Input, Button, Upload, Form, message, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;
const api = import.meta.env.VITE_API_BASE;

const AddTourForm = () => {
    const [form] = Form.useForm();
    const [mainImage, setMainImage] = useState(null);
    const [otherImages, setOtherImages] = useState([]);
    const [uploading, setUploading] = useState(false);

    const username = JSON.parse(localStorage.getItem('user'))?.username;

    const handleUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('username', username);

        try {
            const res = await axios.post(`${api}/upload-tour-image`, formData);
            return res.data.url;
        } catch (err) {
            message.error('图片上传失败');
            throw err;
        }
    };

    const onFinish = async (values) => {
        if (!mainImage) return message.warning('请上传主图片');
        setUploading(true);
        try {
            const imageUrls = await Promise.all(
                otherImages.map(file => handleUpload(file.originFileObj))
            );

            await axios.post(`${api}/api/tours/add`, {
                ...values,
                username,
                mainImage,
                images: imageUrls
            });

            message.success('游记上传成功');
            form.resetFields();
            setMainImage(null);
            setOtherImages([]);
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div
            style={{
                // backgroundImage: 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                padding: '40px 20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
            }}
        >
            <div
                style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    padding: '30px 40px',
                    borderRadius: '16px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    maxWidth: 700,
                }}
            >
                <Title level={2} style={{ textAlign: 'center', color: '#2c3e50' }}>
                    添加你的旅行游记 🏞️
                </Title>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    style={{ marginTop: 24 }}
                >
                    <Form.Item name="name" label="游记目的地" rules={[{ required: true, message: '请输入国家或城市' }]}>
                        <Input placeholder="如：上海或巴黎" style={{ borderRadius: 8 }} />
                    </Form.Item>

                    <Form.Item name="description" label="内容" rules={[{ required: true }]}>
                        <Input.TextArea rows={4} placeholder="整体感受或印象深刻的瞬间…" style={{ borderRadius: 8 }} />
                    </Form.Item>

                    <Form.Item name="duration" label="游玩时长" rules={[{ required: true }]}>
                        <Input placeholder="如：3天2夜" style={{ borderRadius: 8 }} />
                    </Form.Item>

                    <Form.Item name="price" label="花费 (元)" rules={[{ required: true }]}>
                        <Input placeholder="大概花费，如 1200" style={{ borderRadius: 8 }} />
                    </Form.Item>



                    <Form.Item name="accommodation" label="消费项目" rules={[{ required: true }]}>
                        <Input.TextArea
                            rows={3}
                            placeholder="例如：住在山顶民宿，吃了当地烤鱼和酸汤牛肉锅"
                            style={{ borderRadius: 8 }}
                        />
                    </Form.Item>

                    <Form.Item label="主图片" required>
                        <Upload
                            beforeUpload={async file => {
                                const url = await handleUpload(file);
                                setMainImage(url);
                                return false;
                            }}
                            showUploadList={false}
                        >
                            <Button icon={<PlusOutlined />} style={{ borderRadius: 8 }}>
                                上传主图片
                            </Button>
                        </Upload>
                        {mainImage && (
                            <img
                                src={mainImage}
                                alt="主图预览"
                                style={{
                                    width: '100%',
                                    marginTop: 12,
                                    borderRadius: 12,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                }}
                            />
                        )}
                    </Form.Item>

                    <Form.Item label="其他图片">
                        <Upload
                            multiple
                            beforeUpload={() => false}
                            fileList={otherImages}
                            onChange={({ fileList }) => setOtherImages(fileList)}
                        >
                            <Button icon={<PlusOutlined />} style={{ borderRadius: 8 }}>
                                选择其他图片
                            </Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={uploading}
                            style={{
                                width: '100%',
                                height: 45,
                                borderRadius: 10,
                                background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
                                border: 'none',
                                fontWeight: 'bold',
                                fontSize: 16,
                            }}
                        >
                            上传目的地
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default AddTourForm;
