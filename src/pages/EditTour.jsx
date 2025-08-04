// import { useEffect, useState } from 'react';
// import { Form, Input, InputNumber, Button, Upload, message } from 'antd';
// import { useParams, useNavigate } from 'react-router-dom';
// import { PlusOutlined } from '@ant-design/icons';
// import axios from 'axios';

// const api = import.meta.env.VITE_API_BASE;

// const EditTour = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [form] = Form.useForm();
//     const [mainImage, setMainImage] = useState(null);
//     const [otherImages, setOtherImages] = useState([]);
//     const [uploading, setUploading] = useState(false);
//     const [initialData, setInitialData] = useState(null);

//     const username = JSON.parse(localStorage.getItem('user'))?.username;

//     useEffect(() => {
//         const fetchTour = async () => {
//             try {
//                 const res = await axios.get(`${api}/api/tours/${id}`);
//                 const data = res.data;

//                 // 设置表单
//                 form.setFieldsValue({
//                     name: data.name,
//                     description: data.description,
//                     price: data.price,
//                     duration: data.duration,
//                     accommodation: data.accommodation || '', //  加这行
//                 });

//                 // 设置主图
//                 setMainImage(
//                     data.mainImage
//                         ? {
//                             uid: '-1',
//                             name: '主图',
//                             status: 'done',
//                             url: data.mainImage,
//                         }
//                         : null
//                 );


//                 // 设置多图
//                 setOtherImages(
//                     (data.images || []).map((url, index) => ({
//                         uid: String(-index - 1),
//                         name: `image-${index}`,
//                         status: 'done',
//                         url,
//                     }))
//                 );

//                 setInitialData(data);
//             } catch (err) {
//                 message.error('加载游记失败');
//             }
//         };
//         fetchTour();
//     }, [id, form]);


//     const handleUpload = async (file) => {
//         const formData = new FormData();
//         formData.append('file', file);
//         formData.append('username', username);
//         const res = await axios.post(`${api}/upload-tour-image`, formData);
//         return res.data.url;
//     };

//     const onFinish = async (values) => {
//         // console.log(mainImage)
//         try {
//             setUploading(true);

//             // // 如果主图是新上传的文件（非 url）
//             // let finalMainImage = mainImage;
//             // if (mainImage && mainImage.originFileObj) {
//             //     finalMainImage = await handleUpload(mainImage.originFileObj);
//             // }
//             let finalMainImage = '';
//             if (mainImage && mainImage.originFileObj) {
//                 finalMainImage = await handleUpload(mainImage.originFileObj);
//             } else if (typeof mainImage === 'string') {
//                 finalMainImage = mainImage;
//             } else if (mainImage?.url) {
//                 finalMainImage = mainImage.url;
//             }


//             // 如果其他图片中包含新文件，上传新文件并保留旧链接
//             const finalOtherImages = await Promise.all(
//                 otherImages.map(async (file) => {
//                     if (file.originFileObj) {
//                         return await handleUpload(file.originFileObj);
//                     }
//                     return file.url; // 旧图保留
//                 })
//             );

//             await axios.put(`${api}/api/tours/${id}`, {
//                 ...values,
//                 username,
//                 mainImage: finalMainImage,
//                 images: finalOtherImages,
//             });

//             message.success('更新成功');
//             navigate('/my-tours');
//         } catch (err) {
//             console.error(err);
//             message.error('更新失败');
//         } finally {
//             setUploading(false);
//         }
//     };

//     if (!initialData) return null;

//     return (
//         <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
//             <h2>编辑旅游线路</h2>
//             <Form form={form} layout="vertical" onFinish={onFinish}>
//                 <Form.Item name="name" label="线路名称" rules={[{ required: true }]}>
//                     <Input />
//                 </Form.Item>
//                 <Form.Item name="description" label="描述" rules={[{ required: true }]}>
//                     <Input.TextArea rows={4} />
//                 </Form.Item>
//                 <Form.Item name="price" label="价格" rules={[{ required: true }]}>
//                     <InputNumber min={0} style={{ width: '100%' }} />
//                 </Form.Item>
//                 <Form.Item name="duration" label="时长" rules={[{ required: true }]}>
//                     <Input />
//                 </Form.Item>
//                 <Form.Item name="accommodation" label="食宿标准">
//                     <Input.TextArea rows={2} placeholder="例如：住在民宿，早餐在当地小吃摊…" />
//                 </Form.Item>


//                 <Form.Item label="主图片" required>
//                     <Upload
//                         beforeUpload={(file) => {
//                             setMainImage({
//                                 uid: '-1',
//                                 name: file.name,
//                                 status: 'done',
//                                 originFileObj: file,
//                                 url: URL.createObjectURL(file), // 解决预览问题
//                             });
//                             return false;
//                         }}
//                         showUploadList={false}
//                     >
//                         <Button icon={<PlusOutlined />}>上传主图片</Button>
//                     </Upload>

//                     {mainImage && (
//                         <img
//                             src={
//                                 mainImage.url
//                                     ? mainImage.url
//                                     : mainImage.originFileObj
//                                         ? URL.createObjectURL(mainImage.originFileObj)
//                                         : ''
//                             }
//                             alt="主图预览"
//                             style={{ width: '100%', marginTop: 10 }}
//                         />
//                     )}

//                 </Form.Item>

//                 <Form.Item label="其他图片">
//                     <Upload
//                         multiple
//                         listType="picture"
//                         fileList={otherImages}
//                         beforeUpload={() => false}
//                         onChange={({ fileList }) => setOtherImages(fileList)}
//                     >
//                         <Button icon={<PlusOutlined />}>选择其他图片</Button>
//                     </Upload>
//                 </Form.Item>

//                 <Form.Item>
//                     <Button type="primary" htmlType="submit" loading={uploading}>
//                         保存修改
//                     </Button>
//                 </Form.Item>
//             </Form>
//         </div>
//     );
// };

// export default EditTour;

// 美化版：
import { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, Upload, message, Typography } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Modal } from 'antd';
// import 'antd/dist/antd.css'


const { Title } = Typography;
const api = import.meta.env.VITE_API_BASE;

const EditTour = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [mainImage, setMainImage] = useState(null);
    const [otherImages, setOtherImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [initialData, setInitialData] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();

    const username = JSON.parse(localStorage.getItem('user'))?.username;




    useEffect(() => {
        const fetchTour = async () => {
            try {
                const res = await axios.get(`${api}/api/tours/${id}`);
                const data = res.data;

                form.setFieldsValue({
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    duration: data.duration,
                    accommodation: data.accommodation || '',
                });

                setMainImage(
                    data.mainImage
                        ? {
                            uid: '-1',
                            name: '主图',
                            status: 'done',
                            url: data.mainImage,
                        }
                        : null
                );

                setOtherImages(
                    (data.images || []).map((url, index) => ({
                        uid: String(-index - 1),
                        name: `image-${index}`,
                        status: 'done',
                        url,
                    }))
                );

                setInitialData(data);
            } catch (err) {
                message.error('加载游记失败');
            }
        };
        fetchTour();
    }, [id, form]);

    const handleUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('username', username);
        const res = await axios.post(`${api}/upload-tour-image`, formData);
        return res.data.url;
    };

    const onFinish = async (values) => {
        try {
            setUploading(true);

            // 图片处理逻辑
            let finalMainImage = '';
            if (mainImage && mainImage.originFileObj) {
                finalMainImage = await handleUpload(mainImage.originFileObj);
            } else if (typeof mainImage === 'string') {
                finalMainImage = mainImage;
            } else if (mainImage?.url) {
                finalMainImage = mainImage.url;
            }

            const finalOtherImages = await Promise.all(
                otherImages.map(async (file) => {
                    if (file.originFileObj) {
                        return await handleUpload(file.originFileObj);
                    }
                    return file.url;
                })
            );

            // 发送更新请求
            await axios.put(`${api}/api/tours/${id}`, {
                ...values,
                username,
                mainImage: finalMainImage,
                images: finalOtherImages,
            });

            // 弹出提示后跳转
            Modal.success({
                title: '保存成功',
                content: '游记信息已更新成功！',
                onOk() {
                    navigate('/my-tours');
                },
            });

        } catch (err) {
            console.error(err);
            Modal.error({
                title: '保存失败',
                content: '请稍后再试，或检查网络连接。',
            });
        } finally {
            setUploading(false); //  放这里确保不管成功失败都重置按钮状态
        }
    };


    if (!initialData) return null;

    return (

        <div
            style={{
                // backgroundImage:
                //     'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80)',
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
                    编辑旅游游记 ✏️
                </Title>
                <Form form={form} layout="vertical" onFinish={onFinish} style={{ marginTop: 24 }}>
                    <Form.Item name="name" label="游记目的地" rules={[{ required: true }]}>
                        <Input placeholder="如：上海或巴黎" style={{ borderRadius: 8 }} />
                    </Form.Item>

                    <Form.Item name="description" label="内容" rules={[{ required: true }]}>
                        <Input.TextArea
                            rows={4}
                            placeholder="整体感受或印象深刻的瞬间…"
                            style={{ borderRadius: 8 }}
                        />
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
                            beforeUpload={(file) => {
                                setMainImage({
                                    uid: '-1',
                                    name: file.name,
                                    status: 'done',
                                    originFileObj: file,
                                    url: URL.createObjectURL(file),
                                });
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
                                src={
                                    mainImage.url
                                        ? mainImage.url
                                        : mainImage.originFileObj
                                            ? URL.createObjectURL(mainImage.originFileObj)
                                            : ''
                                }
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
                            listType="picture"
                            fileList={otherImages}
                            beforeUpload={() => false}
                            onChange={({ fileList }) => setOtherImages(fileList)}
                        >
                            <Button icon={<PlusOutlined />} style={{ borderRadius: 8 }}>
                                选择其他图片
                            </Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <>
                            {contextHolder}
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
                                保存修改
                            </Button>
                        </>
                    </Form.Item>
                </Form>
            </div>

        </div>
    );
};

export default EditTour;
