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
import { Card, Row, Col, Avatar, message } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { checkLoginAndRun } from '../utils/checkLoginAndRun';
import { Link } from 'react-router-dom';


const api = import.meta.env.VITE_API_BASE;

const UserProfile = () => {
    const { username } = useParams();
    const navigate = useNavigate();

    const [tours, setTours] = useState([]);
    const [favorites, setFavorites] = useState([]);

    // 安全获取作者头像
    const firstTour = tours.length > 0 ? tours[0] : null;

    // 获取用户游记
    useEffect(() => {
        axios.get(`${api}/api/tours?username=${username}`)
            .then(res => {
                console.log("返回的游记数据：", res.data);  // 👈调试
                setTours(res.data)
            })
            .catch(() => setTours([]));
    }, [username]);

    // 获取当前登录用户收藏
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.username) return;

        axios.get(`${api}/api/favorites?username=${user.username}`)
            .then(res => {
                setFavorites(res.data);
                localStorage.setItem('favorites', JSON.stringify(res.data));
            })
            .catch(err => {
                console.error('获取收藏失败', err);
            });
    }, []);

    const toggleFavorite = (id) => {
        checkLoginAndRun(async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.username) {
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

            try {
                await axios.post(`${api}/api/favorites`, {
                    username: user.username,
                    tour_id: id,
                    action: isFavorited ? 'remove' : 'add'
                });
            } catch (err) {
                console.error("同步失败", err);
                message.error("同步服务器失败");
            }
        }, navigate);
    };

    return (
        <div style={{ padding: 24 }}>
            {/* 顶部作者信息 - 分为左右两个区域 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                {/* 左侧：头像和用户名，左对齐 */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                        src={firstTour?.avatar || `https://api.dicebear.com/7.x/thumbs/svg?seed=${username}`}
                        size={32}
                        style={{ marginRight: 16 }}
                    />
                    <div style={{ fontWeight: 'bold', fontSize: 16 }}>{username}</div>
                </div>

                {/* 右侧：空占位，保持与左侧对称 */}
                <div style={{ width: 32 + 16 + 100 }} /> {/* 宽度约等于左侧头像+间距+用户名的总宽度 */}
            </div>

            {/* 标题单独一行，居中显示 */}
            <div style={{ color: '#333', fontSize: 22, textAlign: 'center', margin: '0 0 24px 0' }}>📌TA发布的游记</div>
            <span> </span>

            {/* 游记卡片列表 */}
            <Row gutter={[16, 16]}>
                {tours.map(tour => (
                    <Col xs={24} sm={12} md={8} lg={6} xl={6} key={tour.id}>
                        <Card
                            hoverable
                            onClick={() => navigate(`/tours/${tour.id}`)}
                            style={{
                                borderRadius: 12,
                                overflow: 'hidden',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                cursor: 'pointer',
                                border: 'none',
                                position: 'relative',
                            }}
                            cover={
                                <div style={{ position: 'relative' }}>
                                    <img
                                        alt={tour.name}
                                        src={tour.mainImage || 'https://via.placeholder.com/300x200?text=No+Image'}
                                        style={{ height: 200, objectFit: 'cover', width: '100%' }}
                                    />
                                    {/* ❤️ 收藏按钮浮动在右上角 */}
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite(tour.id);
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: 10,
                                            right: 10,
                                            background: 'rgba(255,255,255,0.85)',
                                            borderRadius: '50%',
                                            padding: 6,
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                                            zIndex: 2,
                                        }}
                                    >
                                        {favorites.includes(tour.id) ? (
                                            <HeartFilled style={{ color: 'purple', fontSize: 18 }} />
                                        ) : (
                                            <HeartOutlined style={{ color: '#999', fontSize: 18 }} />
                                        )}
                                    </div>
                                </div>
                            }
                        >
                            <Card.Meta
                                title={tour.name}
                                description={
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/user/${tour.username}`);
                                            }}
                                            style={{
                                                flexShrink: 0,
                                                cursor: 'pointer',
                                                transition: 'transform 0.2s ease',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'scale(1.15)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'scale(1)';
                                            }}
                                        >
                                            <Avatar
                                                size={18}
                                                src={
                                                    tour.avatar && tour.avatar.startsWith('http')
                                                        ? tour.avatar
                                                        : `https://api.dicebear.com/7.x/thumbs/svg?seed=${tour.username}`
                                                }
                                            />
                                        </div>
                                        <div
                                            style={{
                                                height: '60px',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    lineHeight: '1.4',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                {tour.description || '暂无描述'}
                                            </span>
                                        </div>
                                    </div>
                                }
                            />
                        </Card>
                    </Col>

                ))}
            </Row>
        </div>
    );
};

export default UserProfile;
