import Image from "next/image";

export function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-row">
          <div className="header-brand">
            <div className="header-logo-wrap">
              <Image
                src="/logowhite.png"
                alt="TESDA logo"
                width={100}
                height={100}
                className="header-logo-img"
                priority
              />
            </div>
            <div className="tesda-header-brand">
              <h1 className="tesda-header-title">TESDA</h1>
              <p className="tesda-header-subtitle">Scholar Registration Portal</p>
            </div>
          </div>
          <nav className="header-nav">
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
