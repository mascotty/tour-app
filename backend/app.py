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
    
    # Update location based on IP (Mock implementation for localhost)
    # In a real app, use a GeoIP library or API
    ip_address = request.remote_addr
    # Simple mock logic for demonstration
    location = "未知IP地区"
    if ip_address == '127.0.0.1':
        location = "本地开发环境"
    
    # In production (e.g., Render), use X-Forwarded-For header
    if request.headers.getlist("X-Forwarded-For"):
        ip_address = request.headers.getlist("X-Forwarded-For")[0]
        # Here you would call a GeoIP service with the real IP
        # location = get_location(ip_address)
        location = f"IP: {ip_address}" # For now just show IP

    user['location'] = location
    save_users(users)
    
    return jsonify({
        'success': True,
        'message': '登录成功',
        'user': {
            'username': user['username'],
            'nickname': user.get('nickname', user['username']),
            'avatar': user.get('avatar', ''),
            'bio': user.get('bio', ''),
            'gender': user.get('gender', 'secret'), # male, female, secret
            'location': location,
            'followers': user.get('followers', []),
            'following': user.get('following', [])
        }
    })


@app.route('/api/users/<username>', methods=['GET'])
def get_user_profile(username):
    users = load_users()
    user = next((u for u in users if u['username'] == username), None)
    
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404
        
    # Return public info
    return jsonify({
        'username': user['username'],
        'nickname': user.get('nickname', user['username']),
        'avatar': user.get('avatar', ''),
        'bio': user.get('bio', '这个人很懒，什么都没写~'),
        'gender': user.get('gender', 'secret'),
        'location': user.get('location', '未知IP'),
        'backgroundImage': user.get('backgroundImage', ''),
        'followers': user.get('followers', []),
        'following': user.get('following', [])
    })

@app.route('/api/users/<username>', methods=['PUT'])
def update_user_profile(username):
    data = request.get_json()
    # Security check: ensure the requester is the user (simplified for this mock)
    # In real app, check session/token. Here we assume client behaves.
    
    users = load_users()
    updated = False
    
    for user in users:
        if user['username'] == username:
            # Update fields
            if 'nickname' in data: user['nickname'] = data['nickname']
            if 'bio' in data: user['bio'] = data['bio']
            if 'gender' in data: user['gender'] = data['gender']
            # Location is now auto-updated on login, removed from manual edit
            if 'avatar' in data: user['avatar'] = data['avatar'] # In case they change it via URL or upload flow updates it
            if 'backgroundImage' in data: user['backgroundImage'] = data['backgroundImage']
            
            updated = True
            break
            
    if updated:
        save_users(users)
        return jsonify({'success': True})
    else:
        return jsonify({'success': False, 'message': 'User not found'}), 404

@app.route('/api/users/<username>/follow', methods=['POST'])
def follow_user(username):
    data = request.get_json()
    current_username = data.get('follower') # The person who is clicking "Follow"
    
    if not current_username:
         return jsonify({'success': False, 'message': 'Auth required'}), 401

    if current_username == username:
        return jsonify({'success': False, 'message': 'Cannot follow yourself'}), 400

    users = load_users()
    target_user = next((u for u in users if u['username'] == username), None)
    current_user_obj = next((u for u in users if u['username'] == current_username), None)
    
    if not target_user or not current_user_obj:
        return jsonify({'success': False, 'message': 'User not found'}), 404
        
    # Initialize lists if missing
    if 'followers' not in target_user: target_user['followers'] = []
    if 'following' not in current_user_obj: current_user_obj['following'] = []
    
    # Toggle logic
    is_following = current_username in target_user['followers']
    
    if is_following:
        # Unfollow
        target_user['followers'].remove(current_username)
        current_user_obj['following'].remove(username)
        action = 'unfollow'
    else:
        # Follow
        target_user['followers'].append(current_username)
        current_user_obj['following'].append(username)
        action = 'follow'
        
    save_users(users)
    
    return jsonify({
        'success': True, 
        'action': action,
        'followersCount': len(target_user['followers']),
        'followingCount': len(target_user.get('following', [])) # Target user's following count doesn't change here, but return anyway
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



def get_favorite_counts():
    favorites_data = load_favorites()
    counts = {}
    for username, tour_ids in favorites_data.items():
        for tour_id in tour_ids:
            counts[tour_id] = counts.get(tour_id, 0) + 1
    return counts

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
    
    # Return updated count for this tour so frontend can update immediately if needed
    fav_counts = get_favorite_counts()
    new_count = fav_counts.get(tour_id, 0)
    
    return jsonify({'success': True, 'favorites': all_data[username], 'newCount': new_count})





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
        # Inject favorite count
        fav_counts = get_favorite_counts()
        tour['favoriteCount'] = fav_counts.get(tour_id, 0)
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
    
    # Get favorite counts
    fav_counts = get_favorite_counts()

    # 给旧数据补上 searchCount 字段（如果没有）
    updated = False
    for tour in tours:
        if 'searchCount' not in tour:
            tour['searchCount'] = 0
            updated = True

        # ✅ 加上头像字段
        tour['avatar'] = user_dict.get(tour['username'], '')
        
        # ✅ 加上点赞/收藏数
        tour['favoriteCount'] = fav_counts.get(tour['id'], 0)

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





COMMENT_FILE = 'comments.json'

def load_comments():
    if not os.path.exists(COMMENT_FILE):
        return []
    with open(COMMENT_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_comments(comments):
    with open(COMMENT_FILE, 'w', encoding='utf-8') as f:
        json.dump(comments, f, ensure_ascii=False, indent=2)

@app.route('/api/comments', methods=['GET'])
def get_comments():
    tour_id = request.args.get('tour_id', type=int)
    if not tour_id:
        return jsonify([])
    
    comments = load_comments()
    # Filter comments for this tour
    tour_comments = [c for c in comments if c.get('tour_id') == tour_id]
    
    # Inject user avatars
    users = load_users()
    user_map = {u['username']: u.get('avatar', '') for u in users}
    
    for c in tour_comments:
        c['avatar'] = user_map.get(c['username'], '')
        
    return jsonify(tour_comments)

@app.route('/api/comments', methods=['POST'])
def add_comment():
    data = request.get_json()
    username = data.get('username')
    tour_id = data.get('tour_id')
    content = data.get('content')
    parent_id = data.get('parent_id') # Can be None
    
    if not username or not tour_id or not content:
        return jsonify({'success': False, 'message': 'Missing parameters'})
        
    comments = load_comments()
    new_id = max([c['id'] for c in comments], default=0) + 1
    
    new_comment = {
        'id': new_id,
        'tour_id': tour_id,
        'parent_id': parent_id,
        'username': username,
        'content': content,
        'created_at': datetime.now().isoformat(),
        'likes': []
    }
    
    comments.append(new_comment)
    save_comments(comments)
    
    return jsonify({'success': True, 'comment': new_comment})

@app.route('/api/comments/<int:comment_id>', methods=['DELETE'])
def delete_comment(comment_id):
    username = request.args.get('username')
    if not username:
        return jsonify({'success': False, 'message': 'Auth required'}), 401
        
    comments = load_comments()
    comment = next((c for c in comments if c['id'] == comment_id), None)
    
    if not comment:
        return jsonify({'success': False, 'message': 'Comment not found'}), 404
        
    if comment['username'] != username:
        return jsonify({'success': False, 'message': 'Permission denied'}), 403
        
    # If it's a parent comment, delete its replies too? 
    # Usually yes. Let's find all descendants.
    # Simple approach: delete this comment and any comment with parent_id == comment_id
    ids_to_delete = {comment_id}
    
    # Find direct children (only 1 level nesting usually, but let's be safe)
    # If we support multi-level, we need recursion. Let's assume 1 level for now or simple recursion.
    # Loop to find children
    while True:
        added = False
        for c in comments:
            if c['id'] not in ids_to_delete and c.get('parent_id') in ids_to_delete:
                ids_to_delete.add(c['id'])
                added = True
        if not added:
            break
            
    new_comments = [c for c in comments if c['id'] not in ids_to_delete]
    save_comments(new_comments)
    
    return jsonify({'success': True})

@app.route('/api/comments/<int:comment_id>/like', methods=['POST'])
def like_comment(comment_id):
    data = request.get_json()
    username = data.get('username')
    
    if not username:
        return jsonify({'success': False, 'message': 'Auth required'}), 401
        
    comments = load_comments()
    comment = next((c for c in comments if c['id'] == comment_id), None)
    
    if not comment:
        return jsonify({'success': False, 'message': 'Comment not found'}), 404
        
    if 'likes' not in comment:
        comment['likes'] = []
        
    if username in comment['likes']:
        comment['likes'].remove(username)
        action = 'unlike'
    else:
        comment['likes'].append(username)
        action = 'like'
        
    save_comments(comments)
    
    return jsonify({'success': True, 'likes': comment['likes'], 'action': action})

if __name__ == '__main__':
    app.run(debug=True)
