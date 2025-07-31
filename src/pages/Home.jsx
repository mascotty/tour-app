// import { Input, Button, Card, Row, Col } from 'antd';
// import { SearchOutlined } from '@ant-design/icons';
// import ReactECharts from 'echarts-for-react';
// import Banner from '../components/Banner';
// // import { chartData, destinations } from '../data/mockData';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { HeartOutlined, HeartFilled } from '@ant-design/icons';
// import { checkLoginAndRun } from '../utils/checkLoginAndRun';
// import { useNavigate } from 'react-router-dom';


// const api = import.meta.env.VITE_API_BASE;

// const Home = () => {
//     const [keyword, setKeyword] = useState('');
//     const [filtered, setFiltered] = useState([]);

//     const [allTours, setAllTours] = useState([]);//将destination的mock数据换成后端的真实数据
//     const [loadingFavorites, setLoadingFavorites] = useState(true);

//     useEffect(() => {
//         const fetchFavorites = async () => {
//             const user = JSON.parse(localStorage.getItem('user'));
//             if (!user?.username) return;

//             try {
//                 const res = await axios.get(`${api}/api/favorites?username=${user.username}`);
//                 const ids = res.data;
//                 setFavorites(ids);
//                 setLoadingFavorites(false);
//             } catch (err) {
//                 console.error("加载收藏失败", err);
//             }
//         };

//         fetchFavorites();
//     }, []);


//     useEffect(() => {
//         const fetchTours = async () => {
//             try {
//                 const res = await axios.get(`${api}/api/tours`);//拉取后端传入的数据
//                 setAllTours(res.data);
//                 setFiltered(res.data); // 初始全部展示
//             } catch (err) {
//                 console.error('获取失败', err);
//             }
//         };

//         fetchTours();
//     }, []);
//     const navigate = useNavigate();
//     const [favorites, setFavorites] = useState([]);

//     useEffect(() => {
//         const fetchFavorites = async () => {
//             const user = JSON.parse(localStorage.getItem('user'));
//             if (!user || !user.username) return;

//             try {
//                 const res = await axios.get(`${api}/api/favorites?username=${user.username}`);
//                 const ids = res.data;
//                 setFavorites(ids);
//                 localStorage.setItem('favorites', JSON.stringify(ids));
//             } catch (err) {
//                 console.error("加载收藏失败", err);
//             }
//         };

//         fetchFavorites();
//     }, []);

//     const toggleFavorite = (id) => {
//         checkLoginAndRun(async () => {
//             const user = JSON.parse(localStorage.getItem('user'));
//             if (!user || !user.username) {
//                 message.error("用户信息缺失");
//                 return;
//             }

//             const isFavorited = favorites.includes(id);
//             const updated = isFavorited
//                 ? favorites.filter(fid => fid !== id)
//                 : [...favorites, id];

//             setFavorites(updated);
//             localStorage.setItem('favorites', JSON.stringify(updated));
//             message.success(isFavorited ? '已取消收藏' : '已添加到收藏');

//             try {
//                 await axios.post(`${api}/api/favorites`, {
//                     username: user.username,
//                     tour_id: id,
//                     action: isFavorited ? 'remove' : 'add'
//                 });
//             } catch (err) {
//                 console.error("同步失败", err);
//                 message.error("同步服务器失败");
//             }
//         }, navigate);
//     };


//     // const chartData = allTours.reduce((acc, tour) => {//这一段没看懂
//     //     const name = tour.name;
//     //     const item = acc.find(i => i.name === name);
//     //     if (item) {
//     //         item.value += 1;
//     //     } else {
//     //         acc.push({ name, value: 1 });
//     //     }
//     //     return acc;
//     // }, []);

//     const chartData = [...allTours]
//         .filter(t => typeof t.searchCount === 'number')
//         .sort((a, b) => b.searchCount - a.searchCount)
//         .slice(0, 5)
//         .map(t => ({ name: t.name, value: t.searchCount }));



//     const chartOptions = {
//         title: { text: '' },
//         tooltip: {},
//         xAxis: { type: 'category', data: chartData.map(item => item.name) },
//         yAxis: { type: 'value' },
//         series: [{ type: 'bar', data: chartData.map(item => item.value) }],
//     };

//     // const handleSearch = () => { //没看懂
//     //     const trimmed = keyword.trim().toLowerCase();
//     //     if (trimmed === '') {
//     //         setFiltered(allTours);
//     //     } else {
//     //         const result = allTours.filter(d =>
//     //             d.name.toLowerCase().includes(trimmed) ||
//     //             d.description.toLowerCase().includes(trimmed) ||
//     //             d.category.toLowerCase().includes(trimmed)
//     //         );
//     //         setFiltered(result);
//     //     }
//     // };


//     // 命中就调用后端计数接口
//     const handleSearch = async () => {
//         const trimmed = keyword.trim().toLowerCase();
//         if (trimmed === '') {
//             setFiltered(allTours);
//         } else {
//             const result = allTours.filter(d =>
//                 d.name.toLowerCase().includes(trimmed) ||
//                 d.description.toLowerCase().includes(trimmed) ||
//                 (d.category || '').toLowerCase().includes(trimmed)
//             );

//             // 🔥 搜索命中后，向后端发送统计请求（每个匹配项 +1）
//             for (const tour of result) {
//                 try {
//                     await axios.post(`${api}/api/tours/search-count`, {
//                         tour_id: tour.id
//                     });
//                 } catch (err) {
//                     console.error(`更新游记 ${tour.id} 搜索次数失败`, err);
//                 }
//             }

//             setFiltered(result);
//         }
//     };
//     // 主页初始加载时展示「前三个最热门游记卡片」
//     const popularTours = [...allTours]
//         .filter(t => typeof t.searchCount === 'number')
//         .sort((a, b) => b.searchCount - a.searchCount)
//         .slice(0, 3);


//     return (
//         <div style={{ padding: '20px' }}>
//             <Banner />
//             <div style={{ textAlign: 'center', margin: '20px 0' }}>
//                 <Input
//                     placeholder="搜索目的地"
//                     prefix={<SearchOutlined />}
//                     style={{ width: 300, marginRight: 10 }}
//                     value={keyword}
//                     onChange={e => setKeyword(e.target.value)}
//                     onPressEnter={handleSearch}
//                 />
//                 <Button type="primary" onClick={handleSearch}>搜索</Button>
//             </div>
//             <h2 style={{ textAlign: 'center', marginTop: '40px' }}>🔥 热门目的地推荐</h2>
//             <Row justify="center" gutter={[16, 16]}>
//                 <Col span={16}>
//                     <Card title="热门目的地统计">
//                         <ReactECharts option={chartOptions} style={{ height: 300 }} />
//                     </Card>
//                 </Col>
//             </Row>

//             <div style={{ marginTop: '40px' }}>
//                 <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>搜索结果</h2>
//                 <Row gutter={[16, 16]}>
//                     {filtered.length === 0 ? (
//                         <p style={{ textAlign: 'center', width: '100%' }}>未找到匹配目的地</p>
//                     ) : (
//                         filtered.map(tour => (
//                             <Col xs={24} sm={12} md={8} key={tour.id}>
//                                 <Card
//                                     cover={
//                                         <img
//                                             alt={tour.name}
//                                             src={tour.mainImage || 'https://via.placeholder.com/300x200?text=No+Image'}
//                                             style={{ height: 200, objectFit: 'cover' }}
//                                         />
//                                     }
//                                     actions={[
//                                         <Button type="link" href={`/tours/${tour.id}`}>查看详情</Button>,
//                                         favorites.includes(tour.id) ? (
//                                             <HeartFilled
//                                                 key="filled"
//                                                 style={{ color: 'purple' }}
//                                                 onClick={() => toggleFavorite(tour.id)}
//                                             />
//                                         ) : (
//                                             <HeartOutlined
//                                                 key="outlined"
//                                                 onClick={() => toggleFavorite(tour.id)}
//                                             />
//                                         ),
//                                     ]}
//                                 >

//                                     <Card.Meta
//                                         title={tour.name}
//                                         description={`￥${tour.price} | ${tour.duration}`}
//                                     />
//                                 </Card>
//                             </Col>
//                         ))
//                     )}
//                 </Row>
//             </div>
//         </div>
//     );
// };

// export default Home;
import { Input, Button, Card, Row, Col, message, Avatar } from 'antd';
import { SearchOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import Banner from '../components/Banner';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { checkLoginAndRun } from '../utils/checkLoginAndRun';
import { useNavigate } from 'react-router-dom';

const api = import.meta.env.VITE_API_BASE;

const Home = () => {
    const [keyword, setKeyword] = useState('');
    const [filtered, setFiltered] = useState([]);
    const [allTours, setAllTours] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(true);
    const [hasSearched, setHasSearched] = useState(false);
    const resultRef = useRef(null);


    const navigate = useNavigate();

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const res = await axios.get(`${api}/api/tours`);
                setAllTours(res.data);
                setFiltered(res.data);
            } catch (err) {
                console.error('获取游记失败', err);
            }
        };

        fetchTours();
    }, []);

    useEffect(() => {
        const fetchFavorites = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user?.username) return;

            try {
                const res = await axios.get(`${api}/api/favorites?username=${user.username}`);
                setFavorites(res.data);
            } catch (err) {
                console.error("加载收藏失败", err);
            } finally {
                setLoadingFavorites(false);
            }
        };

        fetchFavorites();
    }, []);

    const toggleFavorite = (id) => {
        checkLoginAndRun(async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user?.username) return message.error("用户信息缺失");

            const isFavorited = favorites.includes(id);
            try {
                await axios.post(`${api}/api/favorites`, {
                    username: user.username,
                    tour_id: id,
                    action: isFavorited ? 'remove' : 'add'
                });

                const updated = isFavorited
                    ? favorites.filter(fid => fid !== id)
                    : [...favorites, id];

                setFavorites(updated);
                message.success(isFavorited ? '已取消收藏' : '已添加到收藏');
            } catch (err) {
                console.error("同步收藏失败", err);
                message.error("同步服务器失败");
            }
        }, navigate);
    };

    // const handleSearch = async () => {
    //     const trimmed = keyword.trim().toLowerCase();
    //     if (!trimmed) {
    //         setFiltered(allTours);
    //         return;
    //     }

    //     const result = allTours.filter(d =>
    //         d.name.toLowerCase().includes(trimmed) ||
    //         d.description.toLowerCase().includes(trimmed) ||
    //         (d.category || '').toLowerCase().includes(trimmed)
    //     );

    //     for (const tour of result) {
    //         try {
    //             await axios.post(`${api}/api/tours/search-count`, {
    //                 tour_id: tour.id
    //             });
    //         } catch (err) {
    //             console.error(`更新游记 ${tour.id} 搜索次数失败`, err);
    //         }
    //     }

    //     setFiltered(result);
    // };
    const handleSearch = async () => {
        const trimmed = keyword.trim().toLowerCase();

        if (!trimmed) {
            setFiltered(allTours);
            setHasSearched(false);  // 不显示搜索结果
            return;
        }

        const result = allTours.filter(d =>
            d.name.toLowerCase().includes(trimmed) ||
            d.description.toLowerCase().includes(trimmed) ||
            (d.category || '').toLowerCase().includes(trimmed)
        );

        for (const tour of result) {
            try {
                await axios.post(`${api}/api/tours/search-count`, {
                    tour_id: tour.id
                });
            } catch (err) {
                console.error(`更新游记 ${tour.id} 搜索次数失败`, err);
            }
        }

        setFiltered(result);
        setHasSearched(true);

        // ✅ 滚动到搜索结果区域
        setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };


    const chartData = [...allTours]
        .filter(t => typeof t.searchCount === 'number')
        .sort((a, b) => b.searchCount - a.searchCount)
        .slice(0, 5)
        .map(t => ({ name: t.name, value: t.searchCount }));

    const chartOptions = {
        title: { text: '' },
        tooltip: {},
        xAxis: { type: 'category', data: chartData.map(item => item.name) },
        yAxis: { type: 'value' },
        series: [{ type: 'bar', data: chartData.map(item => item.value) }],
    };

    const renderFavoriteIcon = (id) => {
        const isFavorited = favorites.includes(id);
        return isFavorited ? (
            <HeartFilled key="filled" style={{ color: 'purple' }} onClick={() => toggleFavorite(id)} />
        ) : (
            <HeartOutlined key="outlined" onClick={() => toggleFavorite(id)} />
        );
    };

    const popularTours = [...allTours]
        .filter(t => typeof t.searchCount === 'number')
        .sort((a, b) => b.searchCount - a.searchCount)
        .slice(0, 10);

    return (
        <div >
            <Banner />
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <Input
                    placeholder="搜索目的地"
                    prefix={<SearchOutlined />}
                    style={{ width: 300, marginRight: 10 }}
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    onPressEnter={handleSearch}
                />
                <Button type="primary" onClick={handleSearch}>搜索</Button>
            </div>

            <h2 style={{ textAlign: 'center', marginTop: '40px' }}>🔥 热门目的地推荐</h2>
            <Row justify="center" gutter={[16, 16]}>
                <Col span={16}>
                    <Card title="热门目的地统计">
                        <ReactECharts option={chartOptions} style={{ height: 300 }} />
                    </Card>
                </Col>
            </Row>

            <div ref={resultRef} style={{ marginTop: '40px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
                    {hasSearched ? '🔍 搜索结果' : '🌟 热门推荐'}
                </h2>

                <Row gutter={[16, 16]}>
                    {loadingFavorites ? (
                        <p style={{ textAlign: 'center', width: '100%' }}>加载收藏中...</p>
                    ) : (hasSearched ? filtered : popularTours).length === 0 ? (
                        <p style={{ textAlign: 'center', width: '100%' }}>
                            {hasSearched ? '未找到匹配目的地' : '暂无热门推荐'}
                        </p>
                    ) : (
                        (hasSearched ? filtered : popularTours).map(tour => (
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
                                                    <HeartFilled style={{ color: 'red', fontSize: 18 }} />
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

                        ))
                    )}
                </Row>
            </div>




        </div>
    );
};

export default Home;
