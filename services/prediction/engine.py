import pandas as pd
import joblib
import os
import pymysql
from dotenv import load_dotenv
from sklearn.linear_model import LinearRegression

load_dotenv()

def get_db_connection():
    return pymysql.connect(
        host=os.getenv('DB_HOST', '127.0.0.1'),
        user=os.getenv('DB_USER', 'sql'),
        password=os.getenv('DB_PASSWORD', 'secret'),
        database=os.getenv('DB_NAME', 'database'),
        cursorclass=pymysql.cursors.DictCursor
    )

def load_debit_transactions(user_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT amount, category, timestamp
                FROM wallet_transactions
                WHERE user_id = %s AND type = 'debit'
            """, (user_id,))
            rows = cursor.fetchall()
            df = pd.DataFrame(rows)
            df['timestamp'] = pd.to_datetime(df['timestamp'])
            return df
    finally:
        conn.close()

def prepare_training_data(df):
    df['month'] = df['timestamp'].dt.to_period('M')
    monthly = df.groupby(['month', 'category'])['amount'].sum().reset_index()
    monthly['month'] = monthly['month'].dt.to_timestamp()

    training_rows = []
    for category in monthly['category'].unique():
        cat_df = monthly[monthly['category'] == category].copy()
        cat_df.sort_values('month', inplace=True)
        cat_df['target'] = cat_df['amount'].shift(-1)

        for i in range(3, len(cat_df) - 1):
            row = {
                'category': category,
                'prev_1': cat_df.iloc[i - 1]['amount'],
                'prev_2': cat_df.iloc[i - 2]['amount'],
                'prev_3': cat_df.iloc[i - 3]['amount'],
                'target': cat_df.iloc[i]['target']
            }
            training_rows.append(row)
    return pd.DataFrame(training_rows)

def train_model(train_df, model_path='spba.pkl'):
    if train_df.empty:
        print("❌ Not enough data to train the model.")
        return

    X = train_df[['prev_1', 'prev_2', 'prev_3']].values
    y = train_df['target'].values

    model = LinearRegression()
    model.fit(X, y)

    joblib.dump(model, model_path)
    print(f"✅ Model trained and saved to {model_path}")

def prepare_latest_sample(df):
    df['month'] = df['timestamp'].dt.to_period('M')
    monthly = df.groupby(['month', 'category'])['amount'].sum().reset_index()
    monthly['month'] = monthly['month'].dt.to_timestamp()

    samples = []

    for category in monthly['category'].unique():
        cat_data = monthly[monthly['category'] == category].copy()
        cat_data.sort_values('month', inplace=True)

        if len(cat_data) < 4:
            continue

        latest = cat_data.tail(3)
        if len(latest) < 3:
            continue

        sample = {
            'category': category,
            'prev_1': latest.iloc[-1]['amount'],
            'prev_2': latest.iloc[-2]['amount'],
            'prev_3': latest.iloc[-3]['amount']
        }
        samples.append(sample)

    return pd.DataFrame(samples)

def predict_next_month(user_id, model_path='spba.pkl'):
    df = load_debit_transactions(user_id)
    sample_df = prepare_latest_sample(df)

    if sample_df.empty:
        return None

    model = joblib.load(model_path)

    X = sample_df[['prev_1', 'prev_2', 'prev_3']].values
    predictions = model.predict(X)

    results = []
    for i, row in sample_df.iterrows():
        results.append({
            'category': row['category'],
            'predicted_amount': round(float(predictions[i]), 2)
        })

    return results

def predict_with_insights(user_id, model_path='spba.pkl'):
    df = load_debit_transactions(user_id)
    sample_df = prepare_latest_sample(df)

    if sample_df.empty:
        return None

    model = joblib.load(model_path)
    X = sample_df[['prev_1', 'prev_2', 'prev_3']].values
    predictions = model.predict(X)

    df['month'] = df['timestamp'].dt.to_period('M')
    monthly = df.groupby(['month', 'category'])['amount'].sum().reset_index()
    monthly['month'] = monthly['month'].dt.to_timestamp()

    results = []
    for i, row in sample_df.iterrows():
        category = row['category']
        predicted = round(float(predictions[i]), 2)
        avg = monthly[monthly['category'] == category]['amount'].mean()
        diff = round(predicted - avg, 2)

        if diff > 50:
            trend = "up"
            suggestion = f"Your spending on {category} is projected to increase. Consider reducing unnecessary expenses."
        elif diff < -50:
            trend = "down"
            suggestion = f"Your spending on {category} is expected to decrease. Keep up the good work!"
        else:
            trend = "steady"
            suggestion = f"Your {category} expenses are stable. Keep budgeting wisely."

        results.append({
            'category': category,
            'predicted': predicted,
            'monthly_avg': round(avg, 2),
            'difference': diff,
            'trend': trend,
            'suggestion': suggestion
        })

    return results

if __name__ == '__main__':
    user_id = 101
    trx_df = load_debit_transactions(user_id)
    train_df = prepare_training_data(trx_df)
    train_model(train_df)