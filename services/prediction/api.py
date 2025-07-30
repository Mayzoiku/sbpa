from flask import Flask, jsonify
from engine import predict_next_month, predict_with_insights

app = Flask(__name__)

@app.route('/v1/ai/predict/<int:user_id>', methods=['GET'])
def predict_spending(user_id):
    try:
        result = predict_next_month(user_id)
        if result is None:
            return jsonify({'error': 'Not enough data to make prediction'}), 400
        return jsonify({'user_id': user_id, 'predictions': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/v1/ai/predict/<int:user_id>/insights', methods=['GET'])
def predict_spending_insights(user_id):
    try:
        result = predict_with_insights(user_id)
        if result is None:
            return jsonify({'error': 'Not enough data to generate insights'}), 400
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)