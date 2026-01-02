// // pages/UserProfile.jsx
// import { useParams } from 'react-router-dom';
// import { Card, Row, Col, Avatar } from 'antd';
// import { useEffect, useState } from 'react';
// import axios from 'axios';

// const api = import.meta.env.VITE_API_BASE;

// const UserProfile = () => {
//     const { username } = useParams();
//     const [tours, setTours] = useState([]);

//     // 安全地获取第一个游记，获取 avatar 字段
//     const firstTour = tours.length > 0 ? tours[0] : null;


//     useEffect(() => {
//         axios.get(`${api}/api/tours?username=${username}`)
//             .then(res => setTours(res.data))
//             .catch(() => setTours([]));
//     }, [username]);

//     return (
//         <div style={{ padding: 24 }}>
//             {/* 顶部作者信息 */}
//             <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
//                 <Avatar
//                     src={firstTour?.avatar || `https://api.dicebear.com/7.x/thumbs/svg?seed=${username}`}
//                     size={64}
//                     style={{ marginRight: 16 }}
//                 />



//                 <div>
//                     <h2>{username}</h2>
//                     <p style={{ color: '#888' }}>TA发布的游记</p>
//                 </div>
//             </div>

//             {/* 游记卡片列表 */}
//             <Row gutter={[16, 16]}>
//                 {tours.map(tour => (
//                     <Col key={tour.id} xs={24} sm={12} md={8}>
//                         <Card
//                             hoverable
//                             cover={
//                                 <img
//                                     src={tour.mainImage}
//                                     alt={tour.name}
//                                     style={{ height: 200, objectFit: 'cover' }}
//                                 />
//                             }


//                             onClick={() => window.location.href = `/tours/${tour.id}`}
//                         >
//                             <Card.Meta title={tour.name} description={`￥${tour.price} / ${tour.duration}`} />
//                         </Card>
//                     </Col>
//                 ))}
//             </Row>
//         </div>
//     );
// };

// export default UserProfile;

import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Avatar, message, Button, Tabs, Tag, Modal, Form, Input, Radio, Space, Upload } from 'antd';
import { HeartOutlined, HeartFilled, EnvironmentOutlined, ManOutlined, WomanOutlined, EditOutlined, SettingOutlined, UploadOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { checkLoginAndRun } from '../utils/checkLoginAndRun';

const api = import.meta.env.VITE_API_BASE;

const UserProfile = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [tours, setTours] = useState([]);
    const [allTours, setAllTours] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('notes');

    // 获取当前登录用户
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setCurrentUser(user);
    }, []);

    // 获取用户个人资料
    const fetchUserProfile = () => {
        axios.get(`${api}/api/users/${username}`)
            .then(res => setUserProfile(res.data))
            .catch(err => {
                console.error("获取用户信息失败", err);
                message.error("获取用户信息失败");
            });
    };

    useEffect(() => {
        fetchUserProfile();
    }, [username]);

    // 获取用户发布的游记
    useEffect(() => {
        axios.get(`${api}/api/tours?username=${username}`)
            .then(res => setTours(res.data))
            .catch(() => setTours([]));
        
        // Fetch all tours to filter favorites (since backend doesn't return full favorite tour objects yet)
        axios.get(`${api}/api/tours`)
            .then(res => setAllTours(res.data))
            .catch(() => setAllTours([]));
    }, [username]);

    // 获取当前登录用户收藏 (仅用于显示收藏状态)
    useEffect(() => {
        if (!currentUser) return;
        axios.get(`${api}/api/favorites?username=${currentUser.username}`)
            .then(res => {
                setFavorites(res.data);
                localStorage.setItem('favorites', JSON.stringify(res.data));
            })
            .catch(err => console.error('获取收藏失败', err));
    }, [currentUser]);

    const toggleFavorite = (id) => {
        checkLoginAndRun(async () => {
            if (!currentUser) {
                message.error("用户信息缺失");
                return;
            }

            const isFavorited = favorites.includes(id);
            const updated = isFavorited
                ? favorites.filter(fid => fid !== id)
                : [...favorites, id];

            setFavorites(updated);
            localStorage.setItem('favorites', JSON.stringify(updated));
            message.success(isFavorited ? '已取消收藏' : '已添加到收藏');

            // 乐观更新点赞数
            setTours(prev => prev.map(t => {
                if (t.id === id) {
                    return { ...t, favoriteCount: (t.favoriteCount || 0) + (isFavorited ? -1 : 1) };
                }
                return t;
            }));

            try {
                const res = await axios.post(`${api}/api/favorites`, {
                    username: currentUser.username,
                    tour_id: id,
                    action: isFavorited ? 'remove' : 'add'
                });
                
                // 如果后端返回了最新计数，进行校准
                if (res.data.newCount !== undefined) {
                     setTours(prev => prev.map(t => t.id === id ? { ...t, favoriteCount: res.data.newCount } : t));
                }
            } catch (err) {
                console.error("同步失败", err);
                message.error("同步服务器失败");
            }
        }, navigate);
    };

    const handleEditSubmit = async (values) => {
        try {
            await axios.put(`${api}/api/users/${username}`, values);
            message.success('个人资料更新成功');
            setIsEditModalVisible(false);
            fetchUserProfile(); // 刷新资料
            
            // If editing own profile, update localStorage and notify Header
            if (isOwnProfile) {
                const updatedUser = { ...currentUser, ...values };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                window.dispatchEvent(new Event('user-updated'));
            }
        } catch (error) {
            console.error('更新失败', error);
            message.error('更新失败，请重试');
        }
    };
    
    const handleFollow = () => {
        checkLoginAndRun(async () => {
            if (!currentUser) return;
            try {
                const res = await axios.post(`${api}/api/users/${username}/follow`, {
                    follower: currentUser.username
                });
                
                if (res.data.success) {
                     const isFollowing = res.data.action === 'follow';
                     setUserProfile(prev => ({
                         ...prev,
                         followers: isFollowing 
                             ? [...(prev.followers || []), currentUser.username]
                             : (prev.followers || []).filter(u => u !== currentUser.username)
                     }));
                     message.success(isFollowing ? '已关注' : '已取消关注');
                }
            } catch (err) {
                console.error(err);
                if (err.response && err.response.data) {
                    message.error(err.response.data.message);
                } else {
                    message.error('操作失败');
                }
            }
        }, navigate);
    };

    const isOwnProfile = currentUser && currentUser.username === username;
    const isFollowing = userProfile && currentUser && userProfile.followers && userProfile.followers.includes(currentUser.username);

    // Calculate total favorites from tours
    const totalFavorites = tours.reduce((sum, tour) => sum + (tour.favoriteCount || 0), 0);
    
    // Filter favorite tours
    const favoriteTours = allTours.filter(tour => favorites.includes(tour.id));

    if (!userProfile) return <div style={{ padding: 40, textAlign: 'center' }}>加载中...</div>;

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 40 }}>
            {/* 顶部背景图 */}
            <div style={{
                height: 200,
                background: userProfile.backgroundImage ? `url(${userProfile.backgroundImage}) center/cover no-repeat` : 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
                borderRadius: '0 0 16px 16px',
                position: 'relative',
                marginBottom: 60
            }}>
                {/* 返回按钮 (可选) */}
            </div>

            {/* 个人信息区域 */}
            <div style={{ padding: '0 20px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: -50, marginBottom: 16 }}>
                    {/* 头像 */}
                    <Avatar
                        src={userProfile.avatar || `https://api.dicebear.com/7.x/thumbs/svg?seed=${username}`}
                        size={100}
                        style={{
                            border: '4px solid #fff',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                    />
                    
                    {/* 编辑/关注按钮 */}
                    <div>
                        {isOwnProfile ? (
                            <Button 
                                shape="round" 
                                icon={<EditOutlined />} 
                                onClick={() => {
                                    form.setFieldsValue(userProfile);
                                    setIsEditModalVisible(true);
                                }}
                            >
                                编辑资料
                            </Button>
                        ) : (
                            <Space>
                                <Button 
                                    shape="round" 
                                    type={isFollowing ? "default" : "primary"}
                                    style={isFollowing ? {} : { background: '#ff2442', borderColor: '#ff2442' }}
                                    onClick={handleFollow}
                                >
                                    {isFollowing ? '已关注' : '关注'}
                                </Button>
                                <Button shape="circle" icon={<SettingOutlined />} />
                            </Space>
                        )}
                    </div>
                </div>

                {/* 名字和ID */}
                <h1 style={{ fontSize: 24, fontWeight: 'bold', margin: '0 0 4px 0' }}>{userProfile.nickname || username}</h1>
                <div style={{ color: '#999', fontSize: 12, marginBottom: 12 }}>小红书号：{username}</div>

                {/* 简介 */}
                <div style={{ fontSize: 14, color: '#333', marginBottom: 12, whiteSpace: 'pre-wrap' }}>
                    {userProfile.bio || '这个人很懒，什么都没写~'}
                </div>

                {/* 标签：性别、位置等 */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                    {userProfile.gender !== 'secret' && (
                        <Tag color={userProfile.gender === 'male' ? 'blue' : 'magenta'} style={{ borderRadius: 12, padding: '0 8px' }}>
                            {userProfile.gender === 'male' ? <ManOutlined /> : <WomanOutlined />} 
                            {userProfile.gender === 'male' ? ' 男' : ' 女'}
                        </Tag>
                    )}
                    {userProfile.location && (
                        <Tag style={{ borderRadius: 12, padding: '0 8px', background: '#f5f5f5', border: 'none', color: '#666' }}>
                            <EnvironmentOutlined /> {userProfile.location}
                        </Tag>
                    )}
                </div>

                {/* 统计数据 */}
                <div style={{ display: 'flex', gap: 24, marginBottom: 20 }}>
                    <div style={{ textAlign: 'center' }}>
                        <span style={{ fontWeight: 'bold' }}>{userProfile.following ? userProfile.following.length : 0}</span> <span style={{ color: '#999', fontSize: 12 }}>关注</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <span style={{ fontWeight: 'bold' }}>{userProfile.followers ? userProfile.followers.length : 0}</span> <span style={{ color: '#999', fontSize: 12 }}>粉丝</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <span style={{ fontWeight: 'bold' }}>{totalFavorites}</span> <span style={{ color: '#999', fontSize: 12 }}>收藏数</span>
                    </div>
                </div>
            </div>

            {/* 内容 Tabs */}
            <Tabs 
                defaultActiveKey="notes" 
                centered 
                size="large"
                activeKey={activeTab}
                onChange={setActiveTab}
                tabBarStyle={{ borderBottom: '1px solid #eee' }}
                items={[
                    {
                        key: 'notes',
                        label: '笔记',
                        children: (
                            <div style={{ padding: '0 10px' }}>
                                <Row gutter={[10, 10]}>
                                    {tours.map(tour => (
                                        <Col xs={12} sm={12} md={8} key={tour.id}>
                                            <Card
                                                hoverable
                                                style={{ borderRadius: 8, overflow: 'hidden' }}
                                                bodyStyle={{ padding: 8 }}
                                                cover={
                                                    <div style={{ position: 'relative', paddingTop: '133%', background: '#f0f0f0' }}>
                                                        <img
                                                            alt={tour.name}
                                                            src={tour.mainImage}
                                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                                            onClick={() => navigate(`/tours/${tour.id}`)}
                                                        />
                                                    </div>
                                                }
                                            >
                                                <div onClick={() => navigate(`/tours/${tour.id}`)} style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.4' }}>
                                                    {tour.name}
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        <Avatar size={16} src={userProfile.avatar} />
                                                        <span style={{ fontSize: 10, color: '#666', maxWidth: 60, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{userProfile.nickname || username}</span>
                                                    </div>
                                                    <div onClick={() => toggleFavorite(tour.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        {favorites.includes(tour.id) ? <HeartFilled style={{ color: '#ff2442', fontSize: 12 }} /> : <HeartOutlined style={{ color: '#999', fontSize: 12 }} />}
                                                        <span style={{ fontSize: 12, color: '#999' }}>{tour.favoriteCount || 0}</span>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                                {tours.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>暂无笔记</div>}
                            </div>
                        )
                    },
                    {
                        key: 'collections',
                        label: '收藏',
                        children: (
                            <div style={{ padding: '0 10px' }}>
                                <Row gutter={[10, 10]}>
                                    {favoriteTours.map(tour => (
                                        <Col xs={12} sm={12} md={8} key={tour.id}>
                                            <Card
                                                hoverable
                                                style={{ borderRadius: 8, overflow: 'hidden' }}
                                                bodyStyle={{ padding: 8 }}
                                                cover={
                                                    <div style={{ position: 'relative', paddingTop: '133%', background: '#f0f0f0' }}>
                                                        <img
                                                            alt={tour.name}
                                                            src={tour.mainImage}
                                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                                            onClick={() => navigate(`/tours/${tour.id}`)}
                                                        />
                                                    </div>
                                                }
                                            >
                                                <div onClick={() => navigate(`/tours/${tour.id}`)} style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.4' }}>
                                                    {tour.name}
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        <Avatar size={16} src={tour.avatar} />
                                                        <span style={{ fontSize: 10, color: '#666', maxWidth: 60, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{tour.username}</span>
                                                    </div>
                                                    <div onClick={() => toggleFavorite(tour.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        {favorites.includes(tour.id) ? <HeartFilled style={{ color: '#ff2442', fontSize: 12 }} /> : <HeartOutlined style={{ color: '#999', fontSize: 12 }} />}
                                                        <span style={{ fontSize: 12, color: '#999' }}>{tour.favoriteCount || 0}</span>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                                {favoriteTours.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                                        <div style={{ fontSize: 40, marginBottom: 10 }}>🔒</div>
                                        这里空空如也
                                    </div>
                                )}
                            </div>
                        )
                    }
                ]}
            />

            {/* 编辑资料弹窗 */}
            <Modal
                title="编辑个人资料"
                open={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleEditSubmit}
                    initialValues={{ gender: 'secret' }}
                >
                    <Form.Item label="头像">
                        <Space>
                            <Form.Item name="avatar" hidden>
                                <Input />
                            </Form.Item>
                            <Upload
                                showUploadList={false}
                                action={`${api}/upload-tour-image`}
                                data={{ username: username }}
                                name="file"
                                onChange={(info) => {
                                    if (info.file.status === 'done') {
                                        if (info.file.response.success) {
                                            const newUrl = info.file.response.url;
                                            form.setFieldsValue({ avatar: newUrl });
                                            
                                            // Optimistic update for UI
                                            if (isOwnProfile) {
                                                setUserProfile(prev => ({ ...prev, avatar: newUrl }));
                                                const updatedUser = { ...currentUser, avatar: newUrl };
                                                localStorage.setItem('user', JSON.stringify(updatedUser));
                                                window.dispatchEvent(new Event('user-updated'));
                                            }
                                            
                                            message.success('上传成功');
                                        } else {
                                            message.error('上传失败');
                                        }
                                    }
                                }}
                            >
                                <Button icon={<UploadOutlined />}>点击上传头像</Button>
                            </Upload>
                        </Space>
                    </Form.Item>

                    <Form.Item label="背景图">
                        <Space>
                            <Form.Item name="backgroundImage" hidden>
                                <Input />
                            </Form.Item>
                            <Upload
                                showUploadList={false}
                                action={`${api}/upload-tour-image`}
                                data={{ username: username }}
                                name="file"
                                onChange={(info) => {
                                    if (info.file.status === 'done') {
                                        if (info.file.response.success) {
                                            const newUrl = info.file.response.url;
                                            form.setFieldsValue({ backgroundImage: newUrl });
                                            
                                            // Optimistic update for UI
                                            if (isOwnProfile) {
                                                setUserProfile(prev => ({ ...prev, backgroundImage: newUrl }));
                                            }

                                            message.success('上传成功');
                                        } else {
                                            message.error('上传失败');
                                        }
                                    }
                                }}
                            >
                                <Button icon={<UploadOutlined />}>点击上传背景图</Button>
                            </Upload>
                        </Space>
                    </Form.Item>
                    <Form.Item name="nickname" label="昵称" rules={[{ required: true, message: '请输入昵称' }]}>
                        <Input maxLength={20} showCount />
                    </Form.Item>
                    <Form.Item name="bio" label="简介">
                        <Input.TextArea rows={4} maxLength={100} showCount placeholder="介绍一下你自己..." />
                    </Form.Item>
                    <Form.Item name="gender" label="性别">
                        <Radio.Group>
                            <Radio value="male">男</Radio>
                            <Radio value="female">女</Radio>
                            <Radio value="secret">保密</Radio>
                        </Radio.Group>
                    </Form.Item>
                    {/* Location field removed as it is now auto-detected */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block shape="round" style={{ background: '#ff2442', borderColor: '#ff2442' }}>
                            保存
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserProfile;
