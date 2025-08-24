#!/bin/bash

# Jupyter Lab 起動スクリプト
# 使用方法: ./start_jupyter.sh

echo "🚀 Jupyter Lab環境を起動しています..."

# 仮想環境のディレクトリ
VENV_DIR="venv_jupyter"

# 仮想環境が存在しない場合は作成
if [ ! -d "$VENV_DIR" ]; then
    echo "📦 Python仮想環境を作成中..."
    python3 -m venv $VENV_DIR
    
    if [ $? -eq 0 ]; then
        echo "✅ 仮想環境が作成されました"
    else
        echo "❌ 仮想環境の作成に失敗しました"
        exit 1
    fi
fi

# 仮想環境を有効化
echo "🔧 仮想環境を有効化中..."
source $VENV_DIR/bin/activate

# requirements.txtが存在する場合は依存関係をインストール
if [ -f "requirements.txt" ]; then
    echo "📋 依存関係を確認・インストール中..."
    pip install -r requirements.txt
    
    if [ $? -eq 0 ]; then
        echo "✅ 依存関係のインストールが完了しました"
    else
        echo "❌ 依存関係のインストールに失敗しました"
        exit 1
    fi
else
    echo "⚠️  requirements.txtが見つかりません"
fi

# Jupyter Labを起動
echo "🎯 Jupyter Lab を起動中..."
echo "ブラウザで http://localhost:8888 が開きます"
echo "終了するには Ctrl+C を押してください"
echo ""

jupyter lab --ip=0.0.0.0 --port=8888 --no-browser --allow-root

echo ""
echo "👋 Jupyter Lab を終了しました"
