import ChatWidget from "./components/ChatWidget";

export default function Home() {
  return (
    <main className="min-h-screen bg-pink-50">
      {/* LP 本体（iframe で読み込み） */}
      <iframe
        src="https://oreijo-2026.pages.dev/"
        className="w-full min-h-screen border-0"
        title="お礼状講座2026夏"
      />

      {/* AI チャットウィジェット（LP の上に重ねて表示） */}
      <ChatWidget />
    </main>
  );
}
