function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5] text-[#333]">
      {/* 頂部導覽列 */}
      <header className="w-full bg-white shadow-sm">
        <nav className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* 之後可以放 logo 圖 */}
            <div className="w-8 h-8 rounded-full bg-[#2b6cb0]" />
            <span className="font-semibold text-lg">CTCM</span>
          </div>
          <div className="flex gap-4 text-sm">
            <a href="#about" className="hover:text-[#2b6cb0]">關於我們</a>
            <a href="#news" className="hover:text-[#2b6cb0]">最新消息</a>
            <a href="#courses" className="hover:text-[#2b6cb0]">課程 / 活動</a>
            <a href="#contact" className="hover:text-[#2b6cb0]">聯絡資訊</a>
          </div>
        </nav>
      </header>

      {/* Hero 區塊 */}
      <main className="flex-1">
        <section className="bg-gradient-to-b from-[#edf2ff] to-[#f5f5f5]">
          <div className="max-w-5xl mx-auto px-4 py-16 grid gap-8 md:grid-cols-2 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-relaxed">
                CTCM
                <br />
                <span className="text-[#2b6cb0]">佛法‧禪修‧生命成長</span>
              </h1>
              <p className="text-sm md:text-base leading-relaxed mb-6">
                這裡可以放一段簡短介紹：
                例如 CTCM 是什麼、服務對象是誰、希望帶給大家什麼樣的學習與陪伴。
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <a
                  href="#courses"
                  className="px-4 py-2 rounded-full bg-[#2b6cb0] text-white hover:bg-[#24549a]"
                >
                  查看近期活動
                </a>
                <a
                  href="#about"
                  className="px-4 py-2 rounded-full border border-[#2b6cb0] text-[#2b6cb0] hover:bg-white"
                >
                  認識 CTCM
                </a>
              </div>
            </div>

            {/* 右邊未來可以放插圖 / 照片 */}
            <div className="w-full h-48 md:h-64 rounded-2xl bg-white shadow-sm border border-[#e2e8f0] flex items-center justify-center text-sm text-[#718096]">
              之後可以放道場 / 活動照片，
              <br />
              或一張代表 CTCM 精神的插畫。
            </div>
          </div>
        </section>

        {/* 關於我們 */}
        <section id="about" className="max-w-5xl mx-auto px-4 py-10">
          <h2 className="text-xl font-semibold mb-3">關於 CTCM</h2>
          <p className="text-sm leading-relaxed">
            這裡暫時先放說明文字：
            例如創立緣起、宗旨、核心精神、主要活動方向等等。
            之後我們可以一起把這段換成正式文案。
          </p>
        </section>

        {/* 最新消息 */}
        <section id="news" className="max-w-5xl mx-auto px-4 py-10 bg-white rounded-2xl shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">最新消息</h2>
          <ul className="space-y-3 text-sm">
            <li>．[範例] 2025 春季禪修課程報名開放中</li>
            <li>．[範例] 線上共修時間調整公告</li>
            <li>．[範例] 新增佛學入門分享會</li>
          </ul>
        </section>

        {/* 課程 / 活動 */}
        <section id="courses" className="max-w-5xl mx-auto px-4 py-10">
          <h2 className="text-xl font-semibold mb-4">課程 / 活動</h2>
          <p className="text-sm mb-3">
            未來我們可以依據「定期課程、專題講座、營隊、說明會」分區塊呈現。
          </p>
        </section>

        {/* 聯絡資訊 */}
        <section id="contact" className="max-w-5xl mx-auto px-4 py-10">
          <h2 className="text-xl font-semibold mb-3">聯絡資訊</h2>
          <p className="text-sm leading-relaxed">
            這裡可以放：
            <br />
            ‧ 道場地址
            <br />
            ‧ E-mail / LINE 官方帳號
            <br />
            ‧ Facebook / IG / YouTube 等連結
          </p>
        </section>
      </main>

      {/* 頁尾 */}
      <footer className="w-full bg-[#1a202c] text-[#e2e8f0] text-xs py-4">
        <div className="max-w-5xl mx-auto px-4 flex justify-between flex-wrap gap-2">
          <span>© {new Date().getFullYear()} CTCM. All rights reserved.</span>
          <span>以佛法與禪修，陪伴每一顆心慢慢安定下來。</span>
        </div>
      </footer>
    </div>
  )
}

export default App
