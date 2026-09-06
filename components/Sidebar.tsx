"use client";
import { LayoutDashboard, LineChart, Bot, ArrowLeftRight, Wallet, Bookmark, History, Settings, Network, } from "lucide-react";
const menuItems = [ { name: "Dashboard", icon: LayoutDashboard }, { name: "Market Analysis", icon: LineChart }, { name: "AI Agent", icon: Bot }, { name: "Trade", icon: ArrowLeftRight }, { name: "Portfolio", icon: Wallet }, { name: "Watchlist", icon: Bookmark }, { name: "Activity", icon: History }, { name: "Settings", icon: Settings }, ];
export default function Sidebar() { return ( <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-white/10 bg-[#080808] px-4 py-6 text-white"> <div className="mb-10 flex items-center gap-3 px-3"> <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400 text-black"> <Network size={26} strokeWidth={2.2} /> </div>
    <div>
      <h1 className="text-lg font-bold tracking-wide">
        SPIDER <span className="text-yellow-400">AI</span>
      </h1>
      <p className="text-xs tracking-[0.3em] text-gray-500">
        AGENT
      </p>
    </div>
  </div>

  <nav className="space-y-2">
    {menuItems.map((item, index) => {
      const Icon = item.icon;

      return (
        <button
          key={item.name}
          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
            index === 0
              ? "bg-yellow-400/10 text-yellow-400"
              : "text-gray-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Icon size={19} />
          <span>{item.name}</span>
        </button>
      );
    })}
  </nav>

  <div className="mt-auto rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-4">
    <div className="mb-2 flex items-center gap-2">
      <div className="h-2 w-2 rounded-full bg-green-400" />
      <span className="text-xs text-green-400">
        Spider Agent Online
      </span>
    </div>

    <p className="text-xs leading-5 text-gray-500">
      Catching signals others miss.
    </p>
  </div>
</aside>
); }