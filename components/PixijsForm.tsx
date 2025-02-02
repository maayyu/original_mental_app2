"use client";

import { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import supabase from "@/lib/supabaseClient";

const PixijsForm = () => {
  const pixiContainer = useRef<HTMLDivElement | null>(null);
  const [stressLevel, setStressLevel] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [leaves, setLeaves] = useState<
    { x: number; y: number; color: string; rotation: number }[]
  >([]);
  const [addedStressLevels, setAddedStressLevels] = useState<Set<number>>(
    new Set()
  );
  const [isEmpty, setIsEmpty] = useState<boolean>(true);

  useEffect(() => {
    const fetchStressLevel = async () => {
      // 認証ユーザー情報の取得
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        alert("認証エラー: ログインしてください。");
        return;
      }

      setUserId(user.id); // ユーザーIDを保存

      // 最新のストレススコアを取得
      const { data, error } = await supabase
        .from("stress_checks")
        .select("percentage_score")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          console.warn(
            "ストレスレベルのデータが見つかりません。デフォルト値を設定します。"
          );
          setStressLevel(0);
          alert("ストレスチェックを受けてみましょう。");
        } else {
          console.error("ストレスレベルの取得に失敗しました", error);
        }
        return;
      }

      setStressLevel(data.percentage_score);

      // 過去の葉っぱ情報を取得
      const { data: leavesData, error: leavesError } = await supabase
        .from("leaves")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (leavesError) {
        console.error("葉っぱ情報の取得に失敗しました", leavesError);
        return;
      }

      setLeaves(leavesData);

      if (leavesData.length > 0) {
        setIsEmpty(false);
      } else {
        setIsEmpty(true);
      }
    };

    fetchStressLevel();
  }, []);

  useEffect(() => {
    if (!pixiContainer.current || stressLevel === null || !userId) return;

    // PixiJS のアプリケーションを作成
    const app = new PIXI.Application({
      width: 800,
      height: 600,
      backgroundColor: 0xffffff,
    });

    // PixiJS のビューを DOM に追加
    pixiContainer.current.innerHTML = "";
    pixiContainer.current.appendChild(app.view);

    // 木の画像を追加
    const treeTexture = PIXI.Texture.from("/images/tree.png");
    const treeSprite = new PIXI.Sprite(treeTexture);
    treeSprite.anchor.set(0.5);
    treeSprite.x = app.renderer.width / 2;
    treeSprite.y = app.renderer.height / 2 + 100;
    app.stage.addChild(treeSprite);

    // ストレスレベルがnullの場合、葉っぱは表示しない
    if (stressLevel === null) {
      // ストレスレベルがない場合、葉っぱを表示せずに木だけ表示する
      return;
    }

    // 葉っぱの色をストレスレベルに合わせて選択する
    const getColorForStress = (totalScore: number | null) => {
      if (totalScore === null || totalScore === undefined) {
        console.warn("total_scoreが未定義のため、デフォルト色を適用します。");
        return "#a8ffd3"; // デフォルト（緑）
      }

      if (totalScore >= 86) return "#ffc1c1"; // 赤
      if (totalScore >= 72) return "#ffd1ff"; // ピンク
      if (totalScore >= 58) return "#ffead6"; // オレンジ
      if (totalScore >= 43) return "#ffffd1"; // 黄色
      if (totalScore >= 29) return "#d1ffd1"; // 緑
      if (totalScore >= 15) return "#e8d1ff"; // 紫
      return "#d1e8ff"; // 青（0～14）
    };

    // 葉っぱを追加する関数
    const addLeaf = (
      posX: number,
      posY: number,
      color: string,
      rotation: number
    ) => {
      console.log(
        "葉っぱを追加: X=",
        posX,
        " Y=",
        posY,
        " 色=",
        color,
        " 回転=",
        rotation
      );

      const leafTexture = PIXI.Texture.from("/images/leaf.png");
      const leafSprite = new PIXI.Sprite(leafTexture);

      // クリック位置に設定
      leafSprite.x = posX;
      leafSprite.y = posY;

      // ランダムな回転
      leafSprite.rotation = rotation;

      // 葉っぱのサイズ調整
      const scale = Math.random() * 0 + 0.15;
      leafSprite.scale.set(scale);

      // 中心にアンカーを設定
      leafSprite.anchor.set(0.5);

      // 色を設定
      leafSprite.tint = parseInt(color.replace("#", "0x"), 16);

      app.stage.addChild(leafSprite);
    };

    // 既存の葉っぱを描画
    leaves.forEach((leaf) => {
      addLeaf(leaf.x, leaf.y, leaf.color, leaf.rotation);
    });

    // 新しい葉っぱを追加し、データベースに保存
    const handleLeafClick = async (event: MouseEvent) => {
      // ストレスレベルが null の場合は処理を中断
      if (stressLevel === null) {
        return;
      }
      // ストレスレベルに対して既に葉っぱが追加されていれば、何もせず終了
      if (addedStressLevels.has(stressLevel)) {
        console.log("既にこのストレスレベルに対して葉っぱが追加されています。");
        alert("今日の分は追加済です、明日も継続しましょう");
        return;
      }

      const rect = app.view.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const color = getColorForStress(stressLevel);
      const rotation = Math.random() * Math.PI * 2;

      console.log("追加する葉っぱの色:", color, "回転角度:", rotation);

      addLeaf(x, y, color, rotation);

      if (userId) {
        const { error: insertError } = await supabase.from("leaves").insert([
          {
            user_id: userId,
            x,
            y,
            rotation,
            color,
            created_at: new Date(),
          },
        ]);

        if (insertError) {
          console.error("葉っぱ情報の保存に失敗しました", insertError);
        }
        // 追加済みのストレスレベルを管理
        else {
          setAddedStressLevels((prev) => new Set(prev).add(stressLevel));

          // 新しい葉っぱ情報を状態に追加して再描画
          setLeaves((prevLeaves) => [...prevLeaves, { x, y, color, rotation }]);
        }
      }
    };

    app.view.addEventListener("click", handleLeafClick);

    // クリーンアップ処理
    return () => {
      if (app && app.view) {
        app.view.removeEventListener("click", handleLeafClick);
      }
      app.destroy(true, true);
    };
  }, [leaves, stressLevel, userId, addedStressLevels, isEmpty]);

  return <div ref={pixiContainer}></div>;
};

export default PixijsForm;
