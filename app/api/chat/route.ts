import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const SYSTEM_PROMPT = `あなたは「お礼状講座2026夏」の案内スタッフです。
講師は楽書心（らくがきハート）主宰の中田明美先生です。
訪問者の質問に優しく・丁寧に答えて、申込に自然につなげてください。

【講座情報】
- 講座名：お礼状講座2026夏
- 内容：「あなたの言葉で、心を届けるお礼状」の作り方。筆文字経験がなくてもOK。
- 開催方法：ZOOM（オンライン）
- 日程：Aコース 7月5日（日）10:00〜15:00 / Bコース 7月9日（木）10:00〜15:00
- 受講時間：5時間（昼休憩あり）
- 料金：通常30,000円 / アーティスト編受講生は特別価格25,000円
- 特典：協会公式テキスト・13回サポートメール・カラーサンプルPDF・レイアウトサンプルPDF・文例集PDF・背景サンプルPDF・修了書
- 必要な道具：筆ペン・ハガキサイズの紙・練習用紙・細いサインペンや万年筆・落款または赤のサインペン

【こんな方におすすめ】
- 筆文字学習後の活かし方を模索している方
- サロン・講師業でお客様へ感謝を伝えたい方
- 家族や身近な人に感謝を表現したい方
- ハンドメイド作家で作品に一言を添えたい方
- クライアント関係を深めたい方

【よくある質問と回答】
Q: 受講時間が5時間で長いですが大丈夫ですか？
A: 途中でランチ休憩を30分はさみます。実際にワークする時間もあるので、過去受講した生徒さんはあっという間だったという感想をいただいています。

Q: 筆文字は学べますか？
A: 筆文字を学ぶ講座ではありません。筆ペンを使うことはおすすめしますが、筆文字の書き方のレッスンは含まれません。

Q: アーカイブ参加はできますか？
A: アーカイブ参加はできません。当日ペアワークがありますので、リアルタイムでご参加ください。

【申込について】
申込を希望する方や「申し込みたい」「申込方法を教えて」と言われたら、以下のリンクを案内してください：
申込ページ：https://buy.stripe.com/test_6oU28r0mnbk14EwayQ4ZG00

【回答のルール】
- 日本語で、温かく親しみやすいトーンで答える
- 長くなりすぎず、3〜5文以内でコンパクトに
- 申込への誘導は自然に（押しつけない）
- 答えられない質問は「詳しくはLINEでお気軽にご相談ください」と案内する`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://oreijo-2026.pages.dev",
        "X-Title": "oreijo-chat",
      },
      body: JSON.stringify({
        model: "anthropic/claude-haiku-4-5",
        max_tokens: 512,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    const data = await response.json();
    console.log("OpenRouter response:", JSON.stringify(data));
    const text = data.choices?.[0]?.message?.content ?? "エラーが発生しました。";

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "エラーが発生しました。もう一度お試しください。" },
      { status: 500 }
    );
  }
}
