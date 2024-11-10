export type LayoutTemplateType = 'default' | 'dashboard' | 'auth' | 'landing';

interface LayoutOptions {
   withNav?: boolean;
   withFooter?: boolean;
   withSidebar?: boolean;
}
  
export const layoutTemplates: Record<LayoutTemplateType, (name: string, options: LayoutOptions) => string> = {
    
  default: (name: string, options: LayoutOptions) => `import React, { ReactNode } from 'react';
  ${options.withNav ? `import ${name}Nav from './${name}Nav';` : ''}
  ${options.withFooter ? `import ${name}Footer from './${name}Footer';` : ''}
  
  interface ${name}Props {
    children: ReactNode;
    className?: string;
  }
  
  const ${name}: React.FC<${name}Props> = ({ children, className = '' }) => {
    return (
      <div className={\`layout-container \${className}\`}>
        ${options.withNav ? `<${name}Nav />` : ''}
        <main className="layout-main">
          {children}
        </main>
        ${options.withFooter ? `<${name}Footer />` : ''}
      </div>
    );
  };
  
  export default ${name};`,
  
    dashboard: (name: string, options: LayoutOptions) => `import React, { ReactNode, useState } from 'react';
  ${options.withNav ? `import ${name}Nav from './${name}Nav';` : ''}
  ${options.withFooter ? `import ${name}Footer from './${name}Footer';` : ''}
  
  interface ${name}Props {
    children: ReactNode;
    sidebar?: ReactNode;
    className?: string;
  }
  
  const ${name}: React.FC<${name}Props> = ({
    children,
    sidebar,
    className = ''
  }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
  
    return (
      <div className={\`dashboard-layout \${className}\`}>
        ${options.withNav ? `<${name}Nav />` : ''}
        <div className="dashboard-container">
          {sidebar && (
            <aside className={\`dashboard-sidebar \${isSidebarOpen ? 'open' : 'closed'}\`}>
              <button className="sidebar-toggle" onClick={toggleSidebar}>
                {isSidebarOpen ? '←' : '→'}
              </button>
              {sidebar}
            </aside>
          )}
          <main className="dashboard-main">
            {children}
          </main>
        </div>
        ${options.withFooter ? `<${name}Footer />` : ''}
      </div>
    );
  };
  
  export default ${name};`,
  
    auth: (name: string, options: LayoutOptions) => `import React, { ReactNode } from 'react';
  ${options.withNav ? `import ${name}Nav from './${name}Nav';` : ''}
  ${options.withFooter ? `import ${name}Footer from './${name}Footer';` : ''}
  
  interface ${name}Props {
    children: ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
    logo?: ReactNode;
  }
  
  const ${name}: React.FC<${name}Props> = ({
    children,
    className = '',
    title,
    subtitle,
    logo
  }) => {
    return (
      <div className={\`auth-layout \${className}\`}>
        ${options.withNav ? `<${name}Nav />` : ''}
        <div className="auth-container">
          <div className="auth-card">
            {logo && <div className="auth-logo">{logo}</div>}
            {title && <h1 className="auth-title">{title}</h1>}
            {subtitle && <p className="auth-subtitle">{subtitle}</p>}
            <div className="auth-content">
              {children}
            </div>
          </div>
        </div>
        ${options.withFooter ? `<${name}Footer />` : ''}
      </div>
    );
  };
  
  export default ${name};`,
  
    landing: (name: string, options: LayoutOptions) => `import React, { ReactNode, useEffect, useState } from 'react';
  ${options.withNav ? `import ${name}Nav from './${name}Nav';` : ''}
  ${options.withFooter ? `import ${name}Footer from './${name}Footer';` : ''}
  
  interface ${name}Props {
    children: ReactNode;
    className?: string;
  }
  
  const ${name}: React.FC<${name}Props> = ({
    children,
    className = ''
  }) => {
    const [isScrolled, setIsScrolled] = useState(false);
  
    useEffect(() => {
      const handleScroll = () => {
        const scrollTop = window.scrollY;
        setIsScrolled(scrollTop > 50);
      };
  
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  
    return (
      <div className={\`landing-layout \${className}\`}>
        ${options.withNav ? `<${name}Nav className={\`nav-container \${isScrolled ? 'scrolled' : ''}\`} />` : ''}
        <main className="landing-main">
          {children}
        </main>
        ${options.withFooter ? `<${name}Footer />` : ''}
      </div>
    );
  };
  
  export default ${name};`
  };