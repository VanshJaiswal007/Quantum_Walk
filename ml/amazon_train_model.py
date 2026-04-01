#!/usr/bin/env python3
"""
Train ML model on real Amazon product data
Uses: price, rating, discount_percentage, rating_count
Predicts: relevance_score (0-1)
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import joblib
import json
import os

# Paths
CSV_PATH = 'd:/Projects/Quantum/dataset/amazon.csv'
PRODUCTS_CSV = 'd:/Projects/Quantum/dataset/amazon_products.csv'
MODEL_PATH = 'd:/Projects/Quantum/ml/amazon_model.pkl'
METADATA_PATH = 'd:/Projects/Quantum/ml/amazon_metadata.json'

print("=" * 60)
print("AMAZON ML MODEL TRAINING")
print("=" * 60)

# ============================================================
# STEP 1: CLEAN AND EXTRACT PRODUCT DATA
# ============================================================
print("\n[1] Loading and cleaning Amazon CSV...")

try:
    df = pd.read_csv(CSV_PATH)
    print(f"✓ Loaded {len(df)} rows from amazon.csv")
except Exception as e:
    print(f"✗ Error loading CSV: {e}")
    exit(1)

# Display original columns
print(f"\nOriginal columns: {list(df.columns)}")
print(f"First row sample:")
print(df.iloc[0])

# ============================================================
# STEP 2: EXTRACT REQUIRED FIELDS AND CLEAN
# ============================================================
print("\n[2] Extracting and cleaning fields...")

# Create products dataframe with only needed columns
products_df = pd.DataFrame()

# Extract fields
products_df['product_id'] = df['product_id']
products_df['product_name'] = df['product_name'].str.strip()
products_df['category'] = df['category'].str.split('|').str[0]  # Get main category
products_df['price'] = df['discounted_price']
products_df['actual_price'] = df['actual_price']
products_df['rating'] = df['rating']
products_df['rating_count'] = df['rating_count']
products_df['discount_percentage'] = df['discount_percentage'].str.rstrip('%').astype(float)

print(f"\n✓ Extracted {len(products_df)} products")
print(f"\nColumns: {list(products_df.columns)}")
print(f"\nFirst 3 products:")
print(products_df.head(3).to_string())

# Clean price - remove ₹ and convert to float
def clean_price(price):
    if isinstance(price, str):
        return float(price.replace('₹', '').replace(',', '').strip())
    return float(price)

products_df['price'] = products_df['price'].apply(clean_price)
products_df['actual_price'] = products_df['actual_price'].apply(clean_price)

# Clean rating_count - remove commas
def clean_count(count):
    if isinstance(count, str):
        return int(count.replace(',', '').strip())
    return int(count)

products_df['rating_count'] = products_df['rating_count'].apply(clean_count)

print(f"\n✓ Data cleaned successfully!")
print(f"\nData types:")
print(products_df.dtypes)
print(f"\nBasic stats:")
print(products_df[['price', 'rating', 'discount_percentage', 'rating_count']].describe())

# ============================================================
# STEP 3: SAVE CLEANED PRODUCTS
# ============================================================
print(f"\n[3] Saving cleaned products CSV...")
products_df.to_csv(PRODUCTS_CSV, index=False)
print(f"✓ Saved {len(products_df)} products to {PRODUCTS_CSV}")

# ============================================================
# STEP 4: PREPARE DATA FOR ML MODEL
# ============================================================
print(f"\n[4] Preparing data for ML model training...")

# Create features from real data
X = products_df[[
    'price',
    'rating',
    'discount_percentage',
    'rating_count'
]].copy()

# Calculate target: relevance score (0-1)
# Based on: rating (60%) + popularity via log(rating_count) (40%)
products_df['relevance_score'] = (
    (products_df['rating'] / 5.0) * 0.6 +  # Rating: 60% weight
    (np.log1p(products_df['rating_count']) / 10) * 0.4  # Popularity: 40% weight
)

# Normalize to 0-1 range
products_df['relevance_score'] = np.clip(products_df['relevance_score'], 0, 1)

y = products_df['relevance_score']

print(f"\n✓ Created features: {list(X.columns)}")
print(f"✓ Target (relevance_score) calculated")
print(f"\nRelevance score stats:")
print(y.describe())
print(f"\nSample predictions:")
for i in range(min(5, len(products_df))):
    row = products_df.iloc[i]
    print(f"  {row['product_name'][:50]}...")
    print(f"    Rating: {row['rating']}/5 | Reviews: {row['rating_count']} | Discount: {row['discount_percentage']}%")
    print(f"    → Relevance: {row['relevance_score']:.3f}")

# ============================================================
# STEP 5: TRAIN MODEL
# ============================================================
print(f"\n[5] Training Random Forest model...")

model = RandomForestRegressor(
    n_estimators=100,
    max_depth=10,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
)

model.fit(X, y)

# Calculate training metrics
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error

y_pred = model.predict(X)
r2 = r2_score(y, y_pred)
rmse = np.sqrt(mean_squared_error(y, y_pred))
mae = mean_absolute_error(y, y_pred)

print(f"\n✓ Model trained successfully!")
print(f"\n Model Performance:")
print(f"  R² Score:  {r2:.4f} ({r2*100:.2f}% variance explained)")
print(f"  RMSE:      {rmse:.4f}")
print(f"  MAE:       {mae:.4f}")

# Feature importance
feature_importance = pd.DataFrame({
    'feature': X.columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print(f"\n Feature Importance:")
for idx, row in feature_importance.iterrows():
    print(f"  {row['feature']:25s} {row['importance']*100:6.2f}%")

# ============================================================
# STEP 6: SAVE MODEL
# ============================================================
print(f"\n[6] Saving model...")

joblib.dump(model, MODEL_PATH)
print(f"✓ Model saved to {MODEL_PATH}")

# Save metadata
metadata = {
    'model_type': 'RandomForestRegressor',
    'features': list(X.columns),
    'target': 'relevance_score',
    'training_samples': len(X),
    'r2_score': float(r2),
    'rmse': float(rmse),
    'mae': float(mae),
    'feature_importance': feature_importance.set_index('feature')['importance'].to_dict(),
    'formula': 'relevance = (rating/5 * 0.6) + (log(rating_count)/10 * 0.4)',
    'data_source': 'Amazon Kaggle Dataset',
    'price_range': [float(X['price'].min()), float(X['price'].max())],
    'rating_range': [float(X['rating'].min()), float(X['rating'].max())],
    'discount_range': [float(X['discount_percentage'].min()), float(X['discount_percentage'].max())],
    'rating_count_range': [int(X['rating_count'].min()), int(X['rating_count'].max())]
}

with open(METADATA_PATH, 'w') as f:
    json.dump(metadata, f, indent=2)

print(f"✓ Metadata saved to {METADATA_PATH}")

# ============================================================
# STEP 7: SELECT TOP 15 PRODUCTS
# ============================================================
print(f"\n[7] Selecting top 15 products by relevance...")

top_15 = products_df.nlargest(15, 'relevance_score')[
    ['product_id', 'product_name', 'category', 'price', 'rating', 'discount_percentage', 'rating_count', 'relevance_score']
].reset_index(drop=True)

print(f"\n✓ Top 15 Products:")
print("=" * 120)
for idx, row in top_15.iterrows():
    print(f"{idx+1:2d}. {row['product_name'][:60]:<60s}")
    print(f"    Price: ₹{row['price']:.2f} | Rating: {row['rating']}/5 ({row['rating_count']:,} reviews) | Discount: {row['discount_percentage']:.0f}%")
    print(f"    Relevance Score: {row['relevance_score']:.3f}")
    print()

# Save top 15
top_15_path = 'd:/Projects/Quantum/dataset/amazon_top_15.csv'
top_15.to_csv(top_15_path, index=False)
print(f"✓ Top 15 products saved to {top_15_path}")

# ============================================================
# STEP 8: TEST MODEL WITH MANUAL ITEMS
# ============================================================
print(f"\n[8] Testing model with sample manual items...")

test_items = [
    {'price': 500, 'rating': 4.5, 'discount_percentage': 20, 'rating_count': 1000},
    {'price': 200, 'rating': 3.8, 'discount_percentage': 50, 'rating_count': 500},
    {'price': 1000, 'rating': 4.0, 'discount_percentage': 10, 'rating_count': 100},
]

print(f"\n✓ Model predictions for manual items:")
for i, item in enumerate(test_items):
    X_test = pd.DataFrame([item])
    pred = model.predict(X_test)[0]
    print(f"  Item {i+1}: Price=₹{item['price']}, Rating={item['rating']}, Discount={item['discount_percentage']}%")
    print(f"    → Predicted Relevance: {pred:.3f}")

print("\n" + "=" * 60)
print("✓ TRAINING COMPLETE!")
print("=" * 60)
print(f"\nModel ready for:")
print(f"  • Backend: Predicting relevance for loaded products")
print(f"  • Frontend: Handling manual item predictions")
print(f"  • API: /api/predict endpoint for custom items")
print("=" * 60 + "\n")
