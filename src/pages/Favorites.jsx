// import { useEffect, useState } from 'react';
// import { Card, Row, Col, Empty, Button, message, Pagination } from 'antd';
// import { Link } from 'react-router-dom';
// import { destinations } from '../data/mockData';
// import { HeartFilled } from '@ant-design/icons';
// import { useAuthGuard } from '../hooks/useAuthGuard';

// const PAGE_SIZE = 2; // 每页显示2条

// const Favorites = () => {
//     useAuthGuard();
//     const [favorites, setFavorites] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1); // 当前页

//     // 读取 localStorage 中收藏 ID，转为对象数组，为下面展示收藏列表做数据准备（favorite就是你要展示的目的地的所有信息）
//     const loadFavorites = () => {
//         const stored = localStorage.getItem('favorites');
//         if (stored) {
//             const ids = JSON.parse(stored);
//             const matched = destinations.filter(d => ids.includes(d.id));
//             setFavorites(matched);
//         } else {
//             setFavorites([]);
//         }
//     };

//     // 首次加载
//     useEffect(() => {
//         loadFavorites();
//     }, []);




//     // 取消收藏函数
//     // const handleUnfavorite = (id) => {
//     //     const stored = localStorage.getItem('favorites');  //首先获取本地存储中的id
//     //     if (!stored) return;

//     //     const updatedIds = JSON.parse(stored).filter(fid => fid !== id); //在获取到的id数组中过滤出其id不等于当前想要取消收藏的id
//     //     localStorage.setItem('favorites', JSON.stringify(updatedIds));//也就是剔除当前选中的小心心代表的id，重新设置本地数据
//     //     message.info('已取消收藏');
//     //     loadFavorites(); // 重新加载收藏项
//     // };

//     // 缺点：需要重新读取 localStorage 并遍历 destinations 数组，增加了不必要的计算开销
//     // 改进版
//     const handleUnfavorite = (id) => {
//         const stored = localStorage.getItem('favorites');
//         if (!stored) return;

//         const updatedIds = JSON.parse(stored).filter(fid => fid !== id);
//         localStorage.setItem('favorites', JSON.stringify(updatedIds));

//         // 直接更新状态（关键优化）
//         setFavorites(prev => prev.filter(tour => tour.id !== id));
//         message.info('已取消收藏');

//         // 若当前页无数据（被删完），自动退回上一页
//         const totalAfter = favorites.length - 1;
//         const lastPage = Math.ceil(totalAfter / PAGE_SIZE) || 1;
//         if (currentPage > lastPage) setCurrentPage(lastPage);
//     };

//     // 当前页显示的数据
//     const startIdx = (currentPage - 1) * PAGE_SIZE;
//     const currentData = favorites.slice(startIdx, startIdx + PAGE_SIZE);







//     return (
//         <div className="container" style={{ padding: '20px 0' }}>
//             <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>❤️ 我的收藏</h2>

//             {favorites.length === 0 ? (
//                 <Empty
//                     description="您还没有收藏任何线路"
//                     style={{ marginTop: '80px' }}
//                 >
//                     <Link to="/tours">
//                         <Button type="primary">浏览旅游线路</Button>
//                     </Link>
//                 </Empty>
//             ) : (
//                 <>
//                     <Row gutter={[16, 16]}>
//                         {currentData.map(tour => (
//                             <Col xs={24} sm={12} md={8} lg={6} key={tour.id}>
//                                 <Card
//                                     cover={
//                                         <img
//                                             alt={tour.name}
//                                             src={tour.image}
//                                             style={{ height: 200, objectFit: 'cover' }}
//                                         />
//                                     }
//                                     actions={[
//                                         <Link to={`/tours/${tour.id}`}>查看详情</Link>,
//                                         <HeartFilled
//                                             style={{ color: 'purple' }}
//                                             onClick={() => handleUnfavorite(tour.id)}
//                                         />,
//                                     ]}
//                                 >
//                                     <Card.Meta
//                                         title={tour.name}
//                                         description={`￥${tour.price} | ${tour.duration}`}
//                                     />
//                                 </Card>
//                             </Col>
//                         ))}
//                     </Row>
//                     <div style={{ textAlign: 'center', marginTop: 32 }}>
//                         <Pagination
//                             current={currentPage}
//                             total={favorites.length}
//                             pageSize={PAGE_SIZE}
//                             onChange={page => setCurrentPage(page)}
//                             showSizeChanger={false}
//                         />
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };

// export default Favorites;


// import { useEffect, useState } from 'react';
// import { Card, Row, Col, Empty, Button, message, Pagination, Avatar } from 'antd';
// import { Link, useNavigate } from 'react-router-dom';
// import { destinations } from '../data/mockData';
// import { HeartFilled } from '@ant-design/icons';
// import { useAuthGuard } from '../hooks/useAuthGuard';
// import axios from 'axios';

// const api = import.meta.env.VITE_API_BASE;



// const PAGE_SIZE = 2;

// const Favorites = () => {
//     useAuthGuard();
//     const navigate = useNavigate();

//     const [favorites, setFavorites] = useState([]); // 全部收藏项（完整对象）
//     const [currentPage, setCurrentPage] = useState(1); // 当前页码

//     // 加载后端收藏数据
//     const fetchFavorites = async () => {
//         const user = JSON.parse(localStorage.getItem('user'));
//         if (!user || !user.username) {
//             message.error("用户未登录");
//             return;
//         }

//         try {
//             const res = await axios.get(`${api}/api/favorites?username=${user.username}`);
//             const ids = res.data;
//             localStorage.setItem('favorites', JSON.stringify(ids)); // 同步缓存

//             // 🔥 新增：从后端获取所有游记
//             const allToursRes = await axios.get(`${api}/api/tours`);
//             const allTours = allToursRes.data;

//             // 过滤出当前收藏的 tours
//             const matched = allTours.filter(t => ids.includes(t.id));
//             setFavorites(matched);
//         } catch (err) {
//             console.error("加载收藏失败", err);
//             message.error("加载收藏失败");
//         }
//     };

//     useEffect(() => {
//         fetchFavorites();
//     }, []);

//     // 取消收藏（同步后端并更新状态）
//     const handleUnfavorite = async (id) => {
//         const user = JSON.parse(localStorage.getItem('user'));
//         if (!user || !user.username) {
//             message.error("用户未登录");
//             return;
//         }

//         try {
//             // 请求后端删除
//             await axios.post(`${api}/api/favorites`, {
//                 username: user.username,
//                 tour_id: id,
//                 action: 'remove',
//             });

//             // 同步前端状态
//             const updated = favorites.filter(tour => tour.id !== id);
//             setFavorites(updated);
//             const updatedIds = updated.map(t => t.id);
//             localStorage.setItem('favorites', JSON.stringify(updatedIds));

//             message.info('已取消收藏');

//             // 若当前页无数据（被删光），退回上一页
//             const totalAfter = updated.length;
//             const lastPage = Math.ceil(totalAfter / PAGE_SIZE) || 1;
//             if (currentPage > lastPage) setCurrentPage(lastPage);
//         } catch (err) {
//             console.error("取消收藏失败", err);
//             message.error("取消收藏失败");
//         }
//     };

//     // 当前页数据
//     const startIdx = (currentPage - 1) * PAGE_SIZE;
//     const currentData = favorites.slice(startIdx, startIdx + PAGE_SIZE);

//     return (
//         <div className="container" style={{ padding: '20px 0' }}>
//             <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>❤️ 我的收藏</h2>

//             {favorites.length === 0 ? (
//                 <Empty
//                     description="您还没有收藏任何线路"
//                     style={{ marginTop: '80px' }}
//                 >
//                     <Link to="/tours">
//                         <Button type="primary">浏览旅游线路</Button>
//                     </Link>
//                 </Empty>
//             ) : (
//                 <>
//                     <Row gutter={[16, 16]}>
//                         {currentData.map(tour => (
//                             <Col xs={24} sm={12} md={8} lg={6} key={tour.id}>
//                                 <Card
//                                     hoverable
//                                     onClick={() => navigate(`/tours/${tour.id}`)}
//                                     style={{
//                                         borderRadius: 12,
//                                         overflow: 'hidden',
//                                         boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
//                                         cursor: 'pointer',
//                                         border: 'none',
//                                         position: 'relative',
//                                     }}
//                                     cover={
//                                         <div style={{ position: 'relative' }}>
//                                             <img
//                                                 alt={tour.name}
//                                                 src={tour.mainImage}
//                                                 style={{
//                                                     height: 200,
//                                                     objectFit: 'cover',
//                                                     width: '100%',
//                                                 }}
//                                             />
//                                             {/* ❤️ 漂浮爱心图标 */}
//                                             <div
//                                                 onClick={(e) => {
//                                                     e.stopPropagation(); // 阻止卡片跳转
//                                                     handleUnfavorite(tour.id);
//                                                 }}
//                                                 style={{
//                                                     position: 'absolute',
//                                                     top: 10,
//                                                     right: 10,
//                                                     background: 'rgba(255,255,255,0.85)',
//                                                     borderRadius: '50%',
//                                                     padding: 6,
//                                                     cursor: 'pointer',
//                                                     boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
//                                                     zIndex: 2,
//                                                 }}
//                                             >
//                                                 <HeartFilled style={{ color: 'purple', fontSize: 18 }} />
//                                             </div>
//                                         </div>
//                                     }
//                                 >
//                                     <Card.Meta
//                                         title={tour.name}
//                                         description={
//                                             <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
//                                                 <div
//                                                     onClick={(e) => {
//                                                         e.stopPropagation();
//                                                         navigate(`/user/${tour.username}`);
//                                                     }}
//                                                     style={{
//                                                         flexShrink: 0,
//                                                         cursor: 'pointer',
//                                                         transition: 'transform 0.2s ease',
//                                                     }}
//                                                     onMouseEnter={(e) => {
//                                                         e.currentTarget.style.transform = 'scale(1.15)';
//                                                     }}
//                                                     onMouseLeave={(e) => {
//                                                         e.currentTarget.style.transform = 'scale(1)';
//                                                     }}
//                                                 >
//                                                     <Avatar
//                                                         size={18}
//                                                         src={
//                                                             tour.avatar && tour.avatar.startsWith('http')
//                                                                 ? tour.avatar
//                                                                 : `https://api.dicebear.com/7.x/thumbs/svg?seed=${tour.username}`
//                                                         }
//                                                     />
//                                                 </div>
//                                                 <div
//                                                     style={{
//                                                         height: '60px',
//                                                         overflow: 'hidden',
//                                                     }}
//                                                 >
//                                                     <span
//                                                         style={{
//                                                             lineHeight: '1.4',
//                                                             display: '-webkit-box',
//                                                             WebkitLineClamp: 3,
//                                                             WebkitBoxOrient: 'vertical',
//                                                             overflow: 'hidden',
//                                                             textOverflow: 'ellipsis',
//                                                         }}
//                                                     >
//                                                         {tour.description || '暂无描述'}
//                                                     </span>
//                                                 </div>
//                                             </div>
//                                         }
//                                     />
//                                 </Card>
//                             </Col>


//                         ))}
//                     </Row>
//                     <div style={{ textAlign: 'center', marginTop: 32 }}>
//                         <Pagination
//                             current={currentPage}
//                             total={favorites.length}
//                             pageSize={PAGE_SIZE}
//                             onChange={page => setCurrentPage(page)}
//                             showSizeChanger={false}
//                         />
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };

// export default Favorites;


// 去除分页功能：
import { useEffect, useState } from 'react';
import { Card, Row, Col, Empty, Button, message, Avatar } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { HeartFilled } from '@ant-design/icons';
import { useAuthGuard } from '../hooks/useAuthGuard';
import axios from 'axios';

const api = import.meta.env.VITE_API_BASE;

const Favorites = () => {
    useAuthGuard();
    const navigate = useNavigate();

    const [favorites, setFavorites] = useState([]);

    const fetchFavorites = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.username) {
            message.error("用户未登录");
            return;
        }

        try {
            const res = await axios.get(`${api}/api/favorites?username=${user.username}`);
            const ids = res.data;
            localStorage.setItem('favorites', JSON.stringify(ids));

            const allToursRes = await axios.get(`${api}/api/tours`);
            const allTours = allToursRes.data;
            const matched = allTours.filter(t => ids.includes(t.id));
            setFavorites(matched);
        } catch (err) {
            console.error("加载收藏失败", err);
            message.error("加载收藏失败");
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    const handleUnfavorite = async (id) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.username) {
            message.error("用户未登录");
            return;
        }

        try {
            await axios.post(`${api}/api/favorites`, {
                username: user.username,
                tour_id: id,
                action: 'remove',
            });

            const updated = favorites.filter(tour => tour.id !== id);
            setFavorites(updated);
            const updatedIds = updated.map(t => t.id);
            localStorage.setItem('favorites', JSON.stringify(updatedIds));

            message.info('已取消收藏');
        } catch (err) {
            console.error("取消收藏失败", err);
            message.error("取消收藏失败");
        }
    };

    return (
        <div className="container" style={{ padding: '20px 0' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>❤️ 我的收藏</h2>

            {favorites.length === 0 ? (
                <Empty
                    description="您还没有收藏任何线路"
                    style={{ marginTop: '80px' }}
                >
                    <Link to="/tours">
                        <Button type="primary">浏览旅游线路</Button>
                    </Link>
                </Empty>
            ) : (
                <Row gutter={[16, 16]}>
                    {favorites.map(tour => (
                        <Col xs={24} sm={12} md={8} lg={6} key={tour.id}>
                            <Card
                                hoverable
                                onClick={() => navigate(`/tours/${tour.id}`)}
                                style={{
                                    borderRadius: 12,
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
                                    cursor: 'pointer',
                                    border: 'none',
                                    position: 'relative',
                                }}
                                cover={
                                    <div style={{ position: 'relative' }}>
                                        <img
                                            alt={tour.name}
                                            src={tour.mainImage}
                                            style={{
                                                height: 200,
                                                objectFit: 'cover',
                                                width: '100%',
                                            }}
                                        />
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleUnfavorite(tour.id);
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
                                            <HeartFilled style={{ color: 'purple', fontSize: 18 }} />
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
                                            <div style={{ height: '60px', overflow: 'hidden' }}>
                                                <span style={{
                                                    lineHeight: '1.4',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}>
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
            )}
        </div>
    );
};

export default Favorites;
