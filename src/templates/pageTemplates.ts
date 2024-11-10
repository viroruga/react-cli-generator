export type PageTemplateType = 'basic' | 'detail' | 'list' | 'dashboard';

interface PageOptions {
  withLayout?: boolean;
  withData?: boolean;
  withRouter?: boolean;
}

export const pageTemplates: Record<
  PageTemplateType,
  (name: string, options: PageOptions) => string
> = {
  basic: (name: string, options: PageOptions) => `import React from 'react';
  ${options.withLayout ? `import MainLayout from '../layouts/MainLayout';` : ''}
  ${options.withData ? `import { use${name}Data } from './${name}.data';` : ''}

  const ${name}Page: React.FC = () => {
    ${
      options.withData
        ? `
    const { data, loading, error } = use${name}Data();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    `
        : ''
    }

    return (
      ${options.withLayout ? `<MainLayout>` : ''}
      <div className="${name.toLowerCase()}-page">
        <h1>${name}</h1>
        <div className="content">
          {/* Contenido de la página */}
        </div>
      </div>
      ${options.withLayout ? `</MainLayout>` : ''}
    );
  };

  export default ${name}Page;`,

  detail: (name: string, options: PageOptions) => `import React from 'react';
  ${options.withRouter ? `import { useParams } from 'react-router-dom';` : ''}
  ${options.withLayout ? `import MainLayout from '../layouts/MainLayout';` : ''}
  ${options.withData ? `import { use${name}Data } from './${name}.data';` : ''}

  const ${name}DetailPage: React.FC = () => {
    ${options.withRouter ? `const { id } = useParams();` : ''}
    ${
      options.withData
        ? `
    const { data, loading, error } = use${name}Data(${options.withRouter ? 'id' : ''});

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!data) return <div>No data found</div>;
    `
        : ''
    }

    return (
      ${options.withLayout ? `<MainLayout>` : ''}
      <div className="${name.toLowerCase()}-detail-page">
        <div className="page-header">
          <h1>${name} Details</h1>
          <div className="actions">
            <button className="edit-button">Edit</button>
            <button className="delete-button">Delete</button>
          </div>
        </div>

        <div className="detail-content">
          {/* Detalles del item */}
          <div className="detail-section">
            <h2>Information</h2>
            {data && (
              <div className="info-grid">
                {/* Campos de información */}
              </div>
            )}
          </div>
        </div>
      </div>
      ${options.withLayout ? `</MainLayout>` : ''}
    );
  };

  export default ${name}DetailPage;`,

  list: (name: string, options: PageOptions) => `import React, { useState } from 'react';
${options.withRouter ? `import { useNavigate } from 'react-router-dom';` : ''}
${options.withLayout ? `import MainLayout from '../layouts/MainLayout';` : ''}
${options.withData ? `import { use${name}Data } from './${name}.data';` : ''}

const ${name}ListPage: React.FC = () => {
  ${options.withRouter ? `const navigate = useNavigate();` : ''}
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  ${
    options.withData
      ? `
  const { data, loading, error } = use${name}Data();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const filteredData = data?.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) || [];

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  `
      : ''
  }

  return (
    ${options.withLayout ? `<MainLayout>` : ''}
    <div className="${name.toLowerCase()}-list-page">
      <div className="page-header">
        <h1>${name} List</h1>
        <button
          className="create-button"
          ${options.withRouter ? `onClick={() => navigate('/${name.toLowerCase()}/create')}` : ''}
        >
          Create New
        </button>
      </div>

      <div className="filters-section">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="list-content">
        ${
          options.withData
            ? `
          {paginatedData.length > 0 ? (
            <>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item, index) => (
                    <tr
                      key={index}
                      ${
                        options.withRouter
                          ? `onClick={() => navigate(\`/${name.toLowerCase()}/\${item.id}\`)}`
                          : ''
                      }
                    >
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>
                        <button className="edit-button">Edit</button>
                        <button className="delete-button">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span>Page {currentPage} of {totalPages}</span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-results">No items found</div>
          )}
        `
            : '/* Aquí va el contenido de la lista */'
        }
      </div>
    </div>
    ${options.withLayout ? `</MainLayout>` : ''}
  );
};

export default ${name}ListPage;`,

  dashboard: (name: string, options: PageOptions) => `import React from 'react';
  ${options.withLayout ? `import DashboardLayout from '../layouts/DashboardLayout';` : ''}
  ${options.withData ? `import { use${name}Data } from './${name}.data';` : ''}

  const ${name}DashboardPage: React.FC = () => {
    ${
      options.withData
        ? `
    const { data, loading, error } = use${name}Data();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    `
        : ''
    }

    return (
      ${options.withLayout ? `<DashboardLayout>` : ''}
      <div className="${name.toLowerCase()}-dashboard">
        <div className="dashboard-header">
          <h1>${name} Dashboard</h1>
          <div className="date-picker">
            {/* Selector de fechas */}
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Tarjetas de resumen */}
          <div className="summary-card">
            <h3>Total Users</h3>
            <div className="card-value">1,234</div>
          </div>
          <div className="summary-card">
            <h3>Active Users</h3>
            <div className="card-value">789</div>
          </div>
          <div className="summary-card">
            <h3>Revenue</h3>
            <div className="card-value">$12,345</div>
          </div>
        </div>

        <div className="dashboard-charts">
          {/* Gráficos */}
          <div className="chart-container">
            <h3>Activity Over Time</h3>
            {/* Gráfico de actividad */}
          </div>
          <div className="chart-container">
            <h3>Distribution</h3>
            {/* Gráfico de distribución */}
          </div>
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {/* Lista de actividades recientes */}
          </div>
        </div>
      </div>
      ${options.withLayout ? `</DashboardLayout>` : ''}
    );
  };

  export default ${name}DashboardPage;`,
};
