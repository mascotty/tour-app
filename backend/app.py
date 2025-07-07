from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

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

    return jsonify({'success': True, 'message': '登录成功', 'user': {'username': user['username']}})



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



if __name__ == '__main__':
    app.run(debug=True)
