from flask import Flask, request, jsonify,send_from_directory
from flask_cors import CORS
import json
import os
import time  
from werkzeug.utils import secure_filename
from datetime import datetime  

app = Flask(__name__)
CORS(app)

USER_FILE = 'users.json'


def load_users():
    if not os.path.exists(USER_FILE):
        return []
    with open(USER_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_users(users):
    with open(USER_FILE, 'w', encoding='utf-8') as f:
        json.dump(users, f, ensure_ascii=False, indent=2)


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'success': False, 'message': '用户名和密码不能为空'})

    users = load_users()
    if any(u['username'] == username for u in users):
        return jsonify({'success': False, 'message': '用户名已存在'})

    users.append({'username': username, 'password': password})
    save_users(users)
    return jsonify({'success': True, 'message': '注册成功'})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    users = load_users()
    user = next((u for u in users if u['username'] == username), None)

    if not user:
        return jsonify({'success': False, 'message': '用户不存在'})
    if user['password'] != password:
        return jsonify({'success': False, 'message': '密码错误'})
    
    return jsonify({
        'success': True,
        'message': '登录成功',
        'user': {
            'username': user['username'],
            'avatar': user.get('avatar', '')  # 没有头像时默认空字符串
        }
    })




FAVORITE_FILE = 'favorites.json'

def load_favorites():
    if not os.path.exists(FAVORITE_FILE):
        return {}
    with open(FAVORITE_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_favorites(data):
    with open(FAVORITE_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


@app.route('/api/favorites', methods=['GET'])
def get_favorites():
    username = request.args.get('username')
    all_data = load_favorites()
    return jsonify(all_data.get(username, []))


@app.route('/api/favorites', methods=['POST'])
def update_favorites():
    data = request.get_json()
    username = data.get('username')
    tour_id = data.get('tour_id')
    action = data.get('action')  # 'add' or 'remove'

    if not username or tour_id is None or action not in ['add', 'remove']:
        return jsonify({'success': False, 'message': '参数错误'})

    all_data = load_favorites()
    if username not in all_data:
        all_data[username] = []

    if action == 'add' and tour_id not in all_data[username]:
        all_data[username].append(tour_id)
    elif action == 'remove':
        all_data[username] = [tid for tid in all_data[username] if tid != tour_id]

    save_favorites(all_data)
    return jsonify({'success': True, 'favorites': all_data[username]})




UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

TOUR_FILE = 'tours.json'

def load_tours():
    if not os.path.exists(TOUR_FILE):
        return []
    with open(TOUR_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)
    

def save_tours(tours):
    with open(TOUR_FILE, 'w', encoding='utf-8') as f:
        json.dump(tours, f, ensure_ascii=False, indent=2)


# @app.route('/api/tours', methods=['GET'])
# def get_all_tours():
#     return jsonify(load_tours())

@app.route('/api/tours/<int:tour_id>', methods=['GET'])
def get_tour_by_id(tour_id):
    tours = load_tours()
    tour = next((t for t in tours if t['id'] == tour_id), None)
    if tour:
        return jsonify(tour)
    return jsonify({'success': False, 'message': '未找到该游记'}), 404

@app.route('/upload-tour-image', methods=['POST'])
def upload_tour_image():
    file = request.files.get('file')
    username = request.form.get('username')
    if not file or not username:
        return jsonify({'success': False, 'message': '缺少参数'})

    timestamp = int(time.time())
    filename = secure_filename(f"{username}_{timestamp}_{file.filename}")
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    host_url = request.host_url.rstrip('/')
    file_url = f"{host_url}/uploads/{filename}"
    return jsonify({'success': True, 'url': file_url})


@app.route('/api/tours/add', methods=['POST'])
def add_tour():
    data = request.get_json()
    
    # 所有必须字段
    required = ['username', 'name', 'description', 'price', 'duration', 'mainImage', 'images']
    if not all(field in data for field in required):
        return jsonify({'success': False, 'message': '缺少字段'})

    # 加载旧游记列表
    tours = load_tours()

    # 分配新 ID
    new_id = max([t['id'] for t in tours], default=0) + 1
    data['id'] = new_id

    # ✅ 添加发布时间
    from datetime import datetime
    data['createdAt'] = datetime.now().isoformat()

    # ✅ 若无食宿信息，自动填一个空字段（防止前端没传也报错）
    data['accommodation'] = data.get('accommodation', '')

    tours.append(data)
    save_tours(tours)

    return jsonify({'success': True, 'id': new_id})



@app.route('/upload-avatar', methods=['POST'])
def upload_avatar():
    file = request.files.get('file')
    username = request.form.get('username')

    if not file or not username:
        return jsonify({'success': False, 'message': '参数缺失'})

    filename = secure_filename(f"{username}_avatar.png")
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    # 假设 Render 上部署的 base URL 为：https://tour-app-60m1.onrender.com
    # file_url = f"https://tour-app-60m1.onrender.com/uploads/{filename}"
    # file_url = f"http://localhost:5000/uploads/{filename}"
     # 自动构造当前服务的 base URL（支持 localhost 或线上环境）  这两行代码会自动识别后端路径
    host_url = request.host_url.rstrip('/')  # 例如 http://localhost:5000 或 https://tour-app-60m1.onrender.com
    file_url = f"{host_url}/uploads/{filename}"

        # 更新用户信息中的头像字段
    users = load_users()
    for user in users:
        if user['username'] == username:
            user['avatar'] = file_url
            break
    save_users(users)

    return jsonify({'success': True, 'url': file_url})


# 对应我的发布界面的删除按钮
@app.route('/api/tours/<int:tour_id>', methods=['DELETE'])
def delete_tour(tour_id):
    tours = load_tours()
    new_tours = [tour for tour in tours if tour['id'] != tour_id]

    if len(new_tours) == len(tours):
        return jsonify({'success': False, 'message': '游记未找到'}), 404

    save_tours(new_tours)
    return jsonify({'success': True, 'message': '游记已删除'})




@app.route('/uploads/<filename>')
def get_avatar(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

#  更新搜索次数的接口
# 我们创建一个新接口 /api/tours/search-count，前端每次匹配成功就调用它：
@app.route('/api/tours/search-count', methods=['POST'])
def increment_search_count():
    data = request.get_json()
    tour_id = data.get('tour_id')

    if tour_id is None:
        return jsonify({'success': False, 'message': '缺少参数'}), 400

    tours = load_tours()
    updated = False
    for tour in tours:
        if tour['id'] == tour_id:
            if 'searchCount' not in tour:
                tour['searchCount'] = 0
            tour['searchCount'] += 1
            updated = True
            break

    if updated:
        save_tours(tours)
        return jsonify({'success': True})
    else:
        return jsonify({'success': False, 'message': '未找到对应游记'}), 404


# 第一次访问 /api/tours 时会自动把所有游记都补上 searchCount: 0 字段
@app.route('/api/tours', methods=['GET'])
def get_all_tours():
    tours = load_tours()
    users = load_users()  # 读取用户数据
    user_dict = {u['username']: u.get('avatar', '') for u in users}

    # 给旧数据补上 searchCount 字段（如果没有）
    updated = False
    for tour in tours:
        if 'searchCount' not in tour:
            tour['searchCount'] = 0
            updated = True

        # ✅ 加上头像字段
        tour['avatar'] = user_dict.get(tour['username'], '')

    # ✅ 获取查询参数
    username = request.args.get('username')
    if username:
        # 过滤出该作者的游记
        tours = [t for t in tours if t.get('username') == username]
        
    if updated:
        save_tours(tours)

    return jsonify(tours)



@app.route('/api/tours/<int:tour_id>', methods=['PUT'])
def update_tour(tour_id):
    data = request.get_json()
    tours = load_tours()
    users = load_users()  # ✅ 加上这行

    updated = False

    for i, tour in enumerate(tours):
        if tour['id'] == tour_id:
            # 保留不能改的字段
            data['id'] = tour_id
            data['username'] = tour['username']
            data['searchCount'] = tour.get('searchCount', 0)

             # ✅ 查找当前用户头像并写入
            avatar = ''
            for user in users:
                if user['username'] == tour['username']:
                    avatar = user.get('avatar', '')
                    break
            data['avatar'] = avatar  # ✅ 写入 avatar 字段
# ✅ 若前端没传 accommodation，也默认保留原值或设置为空
            data['accommodation'] = data.get('accommodation', tour.get('accommodation', ''))
            data['createdAt'] = datetime.now().isoformat()  # ✅ 添加这一行

            # 替换原游记数据
            tours[i] = data
            updated = True
            break

    if updated:
        save_tours(tours)
        return jsonify({'success': True})
    else:
        return jsonify({'success': False, 'message': '游记未找到'}), 404




if __name__ == '__main__':
    app.run(debug=True)
