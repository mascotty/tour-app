// import { useParams } from 'react-router-dom';
// import { Card, Button, Descriptions, Image, Divider } from 'antd';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom'; // 导入 Link 组件
// import { Avatar } from 'antd';


// const api = import.meta.env.VITE_API_BASE;


// const TourDetail = () => {
//     const { id } = useParams(); // 从路径中获取 URL 参数
//     const [tour, setTour] = useState(null);

//     useEffect(() => {
//         axios.get(`${api}/api/tours/${id}`)
//             .then(res => setTour(res.data))
//             .catch(() => setTour(null));
//     }, [id]);


//     if (!tour) {
//         return <div style={{ padding: 20 }}>线路不存在或加载中...</div>;
//     }

//     return (
//         <div className="container" style={{ padding: '20px' }}>
//             {/* ===== 作者信息 ===== */}
//             <div style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 marginBottom: 20,
//                 background: 'white',
//                 padding: 10,
//                 borderRadius: 8
//             }}>
//                 <Link to={`/user/${tour.username}`} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
//                     <Avatar
//                         src={tour.avatar || `https://api.dicebear.com/7.x/thumbs/svg?seed=${tour.username}`}
//                         size={32}
//                         style={{ marginRight: 16 }}
//                     />

//                     <div>
//                         <div style={{ fontWeight: 'bold', fontSize: 16 }}>{tour.username}</div>
//                         <div style={{ color: '#888', fontSize: 12 }}>这个人很懒~</div>
//                     </div>
//                 </Link>
//             </div>
//             <Card
//                 cover={
//                     <img
//                         alt={tour.name}
//                         src={tour.mainImage}
//                         style={{ height: 400, objectFit: 'cover' }}
//                     />
//                 }
//             >
//                 <Descriptions
//                     title={tour.name}
//                     bordered
//                     size="middle"
//                     column={1}
//                     style={{ marginBottom: 20 }}
//                 >
//                     <Descriptions.Item label="价格">￥{tour.price}</Descriptions.Item>
//                     <Descriptions.Item label="时长">{tour.duration}</Descriptions.Item>
//                     <Descriptions.Item label="类别">{tour.category}</Descriptions.Item>
//                     <Descriptions.Item label="描述">{tour.description}</Descriptions.Item>
//                 </Descriptions>

//                 <Button type="primary">立即预订（后续接入API）</Button>
//             </Card>
//             {/* 多图展示区 */}
//             {tour.images && tour.images.length > 0 && (
//                 <>
//                     <Divider>其他图片</Divider>
//                     <Image.PreviewGroup>
//                         <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
//                             {tour.images.map((img, i) => (
//                                 <Image
//                                     key={i}
//                                     src={img}
//                                     width={200}
//                                     height={150}
//                                     style={{ objectFit: 'cover' }}
//                                 />
//                             ))}
//                         </div>
//                     </Image.PreviewGroup>
//                 </>
//             )}

//         </div>
//     );
// };

// export default TourDetail;
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, Button, Descriptions, Image, Divider, Avatar, message } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import axios from 'axios';

const api = import.meta.env.VITE_API_BASE;

const TourDetail = () => {
    const { id } = useParams();
    const [tour, setTour] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTour = async () => {
            try {
                const res = await axios.get(`${api}/api/tours/${id}`);
                console.log("后端返回的tour对象：", res.data); // ✅看这里有没有 avatar 字段
                setTour(res.data);
                // console.log("头像链接", tour.avatar || `https://api.dicebear.com/7.x/thumbs/svg?seed=${tour.username}`);

            } catch {
                setTour(null);
            }
        };

        const fetchFavorites = async () => {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            setUser(storedUser);
            if (!storedUser?.username) return;

            try {
                const res = await axios.get(`${api}/api/favorites?username=${storedUser.username}`);
                setFavorites(res.data);
            } catch (err) {
                console.error('收藏数据获取失败', err);
            }
        };

        fetchTour();
        fetchFavorites();
    }, [id]);

    const toggleFavorite = async () => {
        if (!user || !user.username) {
            message.warning("请先登录！");
            navigate('/login');
            return;
        }

        const isFavorited = favorites.includes(Number(id));
        const updated = isFavorited
            ? favorites.filter(fid => fid !== Number(id))
            : [...favorites, Number(id)];

        setFavorites(updated);
        localStorage.setItem('favorites', JSON.stringify(updated));
        message.success(isFavorited ? '已取消收藏' : '已添加到收藏');

        try {
            await axios.post(`${api}/api/favorites`, {
                username: user.username,
                tour_id: Number(id),
                action: isFavorited ? 'remove' : 'add'
            });
        } catch (err) {
            console.error("同步服务器失败", err);
            message.error("操作失败，请稍后重试");
        }
    };

    if (!tour) {
        return <div style={{ padding: 20 }}>线路不存在或加载中...</div>;
    }

    const isFavorited = favorites.includes(Number(id));

    return (
        <div className="container" style={{ padding: '20px' }}>
            {/* ===== 作者信息 ===== */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 20,
                background: 'white',
                padding: 10,
                borderRadius: 8
            }}>
                <Link to={`/user/${tour.username}`} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                    <Avatar
                        // src={tour.avatar || `https://api.dicebear.com/7.x/thumbs/svg?seed=${tour.username}`}
                        src={tour.avatar || `https://api.dicebear.com/7.x/thumbs/png?seed=${tour.username}`}

                        size={32}
                        style={{ marginRight: 16 }}
                    />
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: 16 }}>{tour.username}</div>
                        <div style={{ color: '#888', fontSize: 12 }}>这个人很懒~</div>
                    </div>
                </Link>
            </div>

            {/* ===== 主卡片内容 ===== */}
            <Card>
                <div style={{ display: 'flex', gap: 24 }}>
                    {/* 左侧：主图 + 多图 */}
                    <div style={{
                        flex: 1,
                        background: 'white',
                        borderRadius: 8,
                        padding: 16,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',// ✅ 阴影
                        border: '1px solid #f0f0f0',               // ✅ 淡边框
                    }}>
                        <div style={{ position: 'relative' }}>
                            <img
                                alt={tour.name}
                                src={tour.mainImage}
                                style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 8 }}
                            />
                            {/* 收藏按钮悬浮 */}
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 16,
                                    right: 16,
                                    background: 'rgba(255,255,255,0.85)',
                                    borderRadius: '50%',
                                    padding: 8,
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                }}
                                onClick={toggleFavorite}
                            >
                                {isFavorited ? (
                                    <HeartFilled style={{ color: '#eb2f96', fontSize: 20 }} />
                                ) : (
                                    <HeartOutlined style={{ color: '#555', fontSize: 20 }} />
                                )}
                            </div>
                        </div>

                        {/* 多图展示 */}
                        {tour.images && tour.images.length > 0 && (
                            <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
                                {tour.images.map((img, i) => (
                                    <Image
                                        key={i}
                                        src={img}
                                        width={100}
                                        height={80}
                                        style={{ objectFit: 'cover', borderRadius: 4 }}
                                    />
                                ))}
                            </div>
                        )}
                        <Descriptions column={1} bordered size="middle" style={{ marginBottom: 20 }}>
                            <Descriptions.Item label="目的地">{tour.name}</Descriptions.Item>

                            <Descriptions.Item label="价格">￥{tour.price}</Descriptions.Item>
                            <Descriptions.Item label="时长">{tour.duration}</Descriptions.Item>
                            <Descriptions.Item label="tips!">{tour.accommodation}</Descriptions.Item>
                        </Descriptions>

                        <Button type="primary">立即预订（后续接入API）</Button>
                    </div>

                    {/* 右侧：描述信息 */}
                    {/* 右侧：描述信息（小红书风格） */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {/* 作者头像 + 描述标题 */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                            <Avatar
                                src={tour.avatar || `https://api.dicebear.com/7.x/thumbs/svg?seed=${tour.username}`}
                                size={30}
                                style={{ marginRight: 12 }}
                            />
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: 16, color: '#701c54ff' }}>{tour.username}</div>
                                {/* <div style={{ color: '#888', fontSize: 12 }}>这个人很懒~</div> */}
                            </div>

                        </div>
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: 16 }}>{tour.description || '暂无描述'}</div>
                        </div>
                        {/* 发布时间 */}
                        <div style={{ fontSize: 12, color: '#888', marginBottom: 8, marginTop: 16 }}>
                            发布时间：{tour.createdAt ? new Date(tour.createdAt).toLocaleDateString() : '未知'}
                        </div>



                        {/* 预留评论区 */}
                        <Divider style={{ marginTop: 12 }}>评论区（待接入）</Divider>
                    </div>

                </div>
            </Card >
        </div >
    )
}
export default TourDetail;
