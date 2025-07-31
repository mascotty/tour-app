// src/pages/MyTours.jsx

import { useEffect, useState } from 'react';
import { Card, Row, Col, message, Empty, Popconfirm, Avatar } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DeleteOutlined } from '@ant-design/icons';

const api = import.meta.env.VITE_API_BASE;

const MyTours = () => {
    const [myTours, setMyTours] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {   //首先根据用户名从后端过滤出自己上传的旅游卡片
        const fetchMyTours = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.username) {
                message.error('用户未登录');
                return;
            }

            try {
                const res = await axios.get(`${api}/api/tours`);
                const all = res.data;
                const mine = all.filter(t => t.username === user.username); // 根据用户名过滤，从后端获取数据
                setMyTours(mine);
            } catch (err) {
                console.error('加载失败', err);
                message.error('加载我的发布失败');
            }
        };

        fetchMyTours();
    }, []);

    // 删除函数
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${api}/api/tours/${id}`);
            message.success('删除成功');
            // 直接更新本地 state
            setMyTours(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            console.error('删除失败', err);
            message.error('删除失败，请重试');
        }
    };

    return (
        <div className="container" style={{ padding: '20px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>📌 我的发布</h2>

            {myTours.length === 0 ? (
                <Empty description="你还没有发布任何线路">
                    <Link to="/add-tour">
                        <button>去发布</button>
                    </Link>
                </Empty>
            ) : (
                <Row gutter={[16, 16]}>
                    {myTours.map(tour => (
                        <Col xs={24} sm={12} md={8} lg={6} key={tour.id}>
                            <Card
                                cover={
                                    <img
                                        alt={tour.name}
                                        src={tour.mainImage}
                                        style={{ height: 200, objectFit: 'cover' }}
                                    />
                                }
                                actions={[
                                    <Link to={`/tours/${tour.id}`}>查看详情</Link>,
                                    <Link to={`/edit-tour/${tour.id}`}>编辑</Link>, // 👈 新增编辑按钮
                                    <Popconfirm
                                        title="确定删除这条游记？"
                                        onConfirm={() => handleDelete(tour.id)}
                                        okText="确定"
                                        cancelText="取消"
                                    >
                                        <DeleteOutlined style={{ color: 'red' }} />
                                    </Popconfirm>
                                ]}
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
                                        </div>}
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            )
            }
        </div >
    );
};

export default MyTours;
