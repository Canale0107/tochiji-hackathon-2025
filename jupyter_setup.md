# Jupyter Lab 環境セットアップガイド

このプロジェクトでは、渋谷区の分煙対策データを分析するための Jupyter Lab 環境を提供しています。

## 📋 必要な環境

- Python 3.8 以上
- pip または conda

## 🚀 セットアップ手順

### 1. Python 仮想環境の作成

```bash
# プロジェクトディレクトリに移動
cd /Users/canale/Documents/tochiji-hackathon-2025

# 仮想環境の作成
python -m venv jupyter_env

# 仮想環境の有効化
# macOS/Linux:
source jupyter_env/bin/activate
# Windows:
# jupyter_env\Scripts\activate
```

### 2. 必要なパッケージのインストール

```bash
# requirements.txtからパッケージをインストール
pip install -r requirements.txt

# MeCabの辞書データのインストール（日本語テキスト処理用）
python -m pip install mecab-python3
```

### 3. Jupyter Lab の起動

```bash
# Jupyter Labを起動
jupyter lab
```

ブラウザが自動的に開き、`http://localhost:8888`で Jupyter Lab 環境にアクセスできます。

### 4. ノートブックの実行

1. 左側のファイルブラウザから `notebooks/data_analysis.ipynb` を開く
2. セルを順番に実行して分析を開始

## 📊 含まれているノートブック

### `notebooks/data_analysis.ipynb`

渋谷区分煙対策データの包括的な分析を行うノートブック

**主な機能:**

- データの読み込みと基本統計
- 時系列分析（月別・年別トレンド）
- インタラクティブな可視化（Plotly 使用）
- 相関分析
- React アプリ用の JSON データ出力

**生成される可視化:**

- 月別指導件数の推移グラフ
- 過料処分件数の時系列分析
- 指導件数と過料処分の相関散布図
- 月別パターン分析

## 📦 インストールされるパッケージ

### データ分析

- **pandas**: データ操作・分析
- **numpy**: 数値計算
- **scipy**: 統計分析
- **scikit-learn**: 機械学習

### 可視化

- **matplotlib**: 基本的なグラフ作成
- **seaborn**: 統計的可視化
- **plotly**: インタラクティブなグラフ
- **japanize-matplotlib**: 日本語フォント対応

### 地理空間分析

- **geopandas**: 地理空間データ処理
- **folium**: インタラクティブ地図
- **contextily**: 背景地図タイル

### その他

- **jupyterlab**: Jupyter Lab 環境
- **ipywidgets**: インタラクティブウィジェット
- **mecab-python3**: 日本語テキスト解析

## 🔧 トラブルシューティング

### MeCab のインストールエラー

```bash
# macOSの場合
brew install mecab mecab-ipadic

# Ubuntuの場合
sudo apt-get install mecab libmecab-dev mecab-ipadic-utf8
```

### 日本語フォントが表示されない場合

```python
# ノートブック内で実行
import matplotlib.pyplot as plt
plt.rcParams['font.family'] = ['DejaVu Sans', 'Hiragino Sans', 'Yu Gothic', 'Meiryo', 'Takao', 'IPAexGothic', 'IPAPGothic', 'VL PGothic', 'Noto Sans CJK JP']
```

### Jupyter Lab が起動しない場合

```bash
# ポートを指定して起動
jupyter lab --port=8889

# ブラウザを指定しない場合
jupyter lab --no-browser
```

## 💡 使用例

### データの基本分析

```python
import pandas as pd

# データ読み込み
df = pd.read_csv('data/131130_分煙対策_指導と過料処分の活動実績_1924926636818441489.csv')

# 基本統計
print(df.describe())
```

### 可視化例

```python
import matplotlib.pyplot as plt
import seaborn as sns

# 月別トレンドの可視化
monthly_data = df.groupby(['年月', '値区分'])['値'].sum().reset_index()
sns.lineplot(data=monthly_data, x='年月', y='値', hue='値区分')
plt.xticks(rotation=45)
plt.show()
```

## 🌐 React アプリとの連携

ノートブック内でデータ分析の結果を JSON ファイルとして出力し、React アプリのダッシュボードで使用することができます。

```python
# 分析結果をJSON出力
dashboard_data = {
    'monthly_summary': monthly_pivot.to_dict('index'),
    'yearly_totals': df.groupby(['年度', '値区分'])['値'].sum().to_dict()
}

import json
with open('public/data/smoking_data.json', 'w', encoding='utf-8') as f:
    json.dump(dashboard_data, f, ensure_ascii=False, indent=2)
```

## 📞 サポート

問題が発生した場合は、プロジェクトの Issue ページで報告してください。
