import Link from "next/link";

export default function NavBar() {
return (
    <nav className="bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
            <div className="text-xl font-semibold tracking-tight">ZPay</div>
            <div className="flex items-center gap-6 text-sm text-white/70">
                <Link href="/">Home</Link>
                <Link href="/merchant">Merchant</Link>
                <Link href="https://docs.flashift.app/" target="_blank" className="transition hover:text-white">
                    Flashift Docs
                </Link>
            </div>
        </div>
    </nav>
)
}