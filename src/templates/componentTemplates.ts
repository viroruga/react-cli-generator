export const componentTemplates = {
    basic: (name: string) => `import React from 'react';
  
  interface ${name}Props {
    // Define tus props aquí
  }
  
  const ${name}: React.FC<${name}Props> = () => {
    return (
      <div className="${name.toLowerCase()}-container">
        <h1>${name} Component</h1>
      </div>
    );
  };
  
  export default ${name};`,
  
    card: (name: string) => `import React from 'react';
  
  interface ${name}Props {
    title: string;
    content: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
  }
  
  const ${name}: React.FC<${name}Props> = ({
    title,
    content,
    footer,
    className = ''
  }) => {
    return (
      <div className={\`card-container \${className}\`}>
        <div className="card-header">
          <h2 className="card-title">{title}</h2>
        </div>
        <div className="card-content">
          {content}
        </div>
        {footer && (
          <div className="card-footer">
            {footer}
          </div>
        )}
      </div>
    );
  };
  
  export default ${name};`,
  
    modal: (name: string) => `import React, { useEffect } from 'react';
  
  interface ${name}Props {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
  }
  
  const ${name}: React.FC<${name}Props> = ({
    isOpen,
    onClose,
    title,
    children,
    className = ''
  }) => {
    useEffect(() => {
      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };
  
      if (isOpen) {
        document.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';
      }
  
      return () => {
        document.removeEventListener('keydown', handleEsc);
        document.body.style.overflow = 'unset';
      };
    }, [isOpen, onClose]);
  
    if (!isOpen) return null;
  
    return (
      <>
        <div className="modal-overlay" onClick={onClose} />
        <div className={\`modal-container \${className}\`}>
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
            <button
              onClick={onClose}
              className="modal-close"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
          <div className="modal-content">
            {children}
          </div>
        </div>
      </>
    );
  };
  
  export default ${name};`,
  
    table: (name: string) => `import React, { useState } from 'react';
  
  interface Column<T> {
    key: keyof T;
    title: string;
    render?: (value: T[keyof T], item: T) => React.ReactNode;
  }
  
  interface ${name}Props<T> {
    columns: Column<T>[];
    data: T[];
    onRowClick?: (item: T) => void;
    pagination?: boolean;
    itemsPerPage?: number;
    className?: string;
  }
  
  const ${name} = <T extends object>({
    columns,
    data,
    onRowClick,
    pagination = false,
    itemsPerPage = 10,
    className = ''
  }: ${name}Props<T>) => {
    const [currentPage, setCurrentPage] = useState(1);
  
    const totalPages = pagination ? Math.ceil(data.length / itemsPerPage) : 1;
    const paginatedData = pagination
      ? data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      : data;
  
    return (
      <div className={\`table-wrapper \${className}\`}>
        <table className="table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)}>{column.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(item)}
                className={onRowClick ? 'clickable' : ''}
              >
                {columns.map((column) => (
                  <td key={String(column.key)}>
                    {column.render
                      ? column.render(item[column.key], item)
                      : String(item[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        
        {pagination && totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  };
  
  export default ${name};`,
  
    list: (name: string) => `import React from 'react';
  
  interface ${name}Props<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    className?: string;
    emptyMessage?: string;
  }
  
  const ${name} = <T,>({
    items,
    renderItem,
    className = '',
    emptyMessage = 'No items to display'
  }: ${name}Props<T>) => {
    if (items.length === 0) {
      return <div className="empty-list">{emptyMessage}</div>;
    }
  
    return (
      <div className={\`list-container \${className}\`}>
        {items.map((item, index) => (
          <div key={index} className="list-item">
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    );
  };
  
  export default ${name};`,
  
    navbar: (name: string) => `import React, { useState } from 'react';
  
  interface NavItem {
    label: string;
    href: string;
    icon?: React.ReactNode;
  }
  
  interface ${name}Props {
    items: NavItem[];
    logo?: React.ReactNode;
    className?: string;
  }
  
  const ${name}: React.FC<${name}Props> = ({
    items,
    logo,
    className = ''
  }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <nav className={\`navbar \${className}\`}>
        <div className="navbar-brand">
          {logo}
          <button
            className="navbar-burger"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="menu"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>
  
        <div className={\`navbar-menu \${isOpen ? 'is-active' : ''}\`}>
          <div className="navbar-start">
            {items.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="navbar-item"
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </nav>
    );
  };
  
  export default ${name};`
  };