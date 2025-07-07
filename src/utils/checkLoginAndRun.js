export const checkLoginAndRun = (callback, navigate) => {
    const user = localStorage.getItem('user');
    if (!user) {
        navigate('/login');
        return false;
    }
    callback();
    return true;
};

// 已登录 → 执行第一个参数（回调函数 callback）
// 未登录 → 执行第二个参数（导航函数 navigate）
// 返回值的核心作用：标记登录状态，为调用方提供验证结果（即使当前未使用，也可能为后续扩展预留）。