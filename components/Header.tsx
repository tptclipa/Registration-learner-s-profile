import Image from "next/image";

export function Header() {
  return (
    <header className="bg-[#0047AB] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center">
              <Image
                src="/logowhite.png"
                alt="TESDA logo"
                width={100}
                height={100}
                className="object-contain"
                priority
              />
            </div>
            <div className="tesda-header-brand">
              <h1 className="tesda-header-title">TESDA</h1>
              <p className="tesda-header-subtitle">Scholar Registration Portal</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#steps" className="tesda-header-link">
              Steps
            </a>
            <a href="#requirements" className="tesda-header-link">
              Requirements
            </a>
            <a href="#reminders" className="tesda-header-link">
              Reminders
            </a>
            <a href="#faq" className="tesda-header-link">
              FAQ
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
