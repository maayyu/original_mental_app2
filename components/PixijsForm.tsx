"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

const PixijsForm = () => {
  const pixiContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!pixiContainer.current) return;

    // PixiJS のアプリケーションを作成
    const app = new PIXI.Application({
      width: 800,
      height: 600,
      backgroundColor: 0xffffff,
    });

    // PixiJS のビューを DOM に追加
    pixiContainer.current.appendChild(app.view);

    // 木の画像を追加
    const treeTexture = PIXI.Texture.from("/images/tree.png");
    const treeSprite = new PIXI.Sprite(treeTexture);
    treeSprite.anchor.set(0.5);
    treeSprite.x = app.renderer.width / 2;
    treeSprite.y = app.renderer.height / 2 + 100;
    app.stage.addChild(treeSprite);

    // カラーの配列
    const pastelRainbowColors = [
      "#ff2137", // 赤
      "#ff9d2d", // オレンジ
      "#fefe51", // 黄色
      "#4ffd74", // 緑
      "#2ba3ff", // 青
      "#a839fd", // 紫
    ];

    // カラーをランダムに取得する関数
    const getRandomPastelColor = () => {
      const randomIndex = Math.floor(
        Math.random() * pastelRainbowColors.length
      );
      return pastelRainbowColors[randomIndex];
    };

    // 葉っぱを追加する関数
    const addLeaf = (posX, posY) => {
      const leafTexture = PIXI.Texture.from("/images/leaf.png");
      const leafSprite = new PIXI.Sprite(leafTexture);

      // クリック位置に設定
      leafSprite.x = posX;
      leafSprite.y = posY;

      // ランダムな回転
      leafSprite.rotation = Math.random() * Math.PI * 2; // 0〜360度の回転

      // 葉っぱのサイズ調整
      const scale = Math.random() * 0 + 0.15;
      leafSprite.scale.set(scale);

      // 中心にアンカーを設定
      leafSprite.anchor.set(0.5);

      // カラーコードを16進数に変換する関数
      const hexToNumber = (hex) => parseInt(hex.replace("#", ""), 16);

      // ランダムなパステルカラーを適用
      const randomColor = getRandomPastelColor();
      leafSprite.tint = hexToNumber(randomColor);
      app.stage.addChild(leafSprite);
    };

    // クリックイベントで葉っぱを追加
    app.view.addEventListener("click", (event) => {
      const rect = app.view.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      addLeaf(x, y);
    });

    // クリーンアップ処理
    return () => {
      app.destroy(true, true);
    };
  }, []);

  return <div ref={pixiContainer}></div>;
};

export default PixijsForm;
