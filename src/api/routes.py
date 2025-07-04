from flask import request, jsonify, Blueprint
from api.models import db, User
from flask_cors import CORS

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

api = Blueprint('api', __name__)

CORS(api)

@api.route('/token', methods=['POST'])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if not email or not password:
        return jsonify({"msg": "Email and password are required"}), 400
    
    user = User.query.filter_by(email=email, password=password).first()
    if not user:
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token)


@api.route('/user', methods=['POST'])
def create_user():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    if not email or not password:
        return jsonify({"msg": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"msg": "Email already registered"}), 409 # Conflict

    new_user = User(email=email, password=password)

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"msg": "User created successfully!"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error creating user: {str(e)}"}), 500


@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user_identity = get_jwt_identity()
    return jsonify(
        logged_in_as=current_user_identity,
        message="You have access to this protected data!"
    ), 200