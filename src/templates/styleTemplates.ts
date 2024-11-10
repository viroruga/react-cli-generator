type StyleType = 'css' | 'scss' | 'styled-components';

export const getStyleTemplate = (name: string, styleType: StyleType): string => {
  switch (styleType) {
    case 'styled-components':
      return getStyledComponentsTemplate(name);
    case 'scss':
      return getScssTemplate(name);
    case 'css':
      return getCssTemplate(name);
    default:
      return getCssTemplate(name);
  }
};

const getCssTemplate = (name: string) => `/* Estilos para ${name} */

.${name.toLowerCase()}-container {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
}

/* Header Styles */
.${name.toLowerCase()}-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

/* Content Styles */
.${name.toLowerCase()}-content {
  flex: 1;
  padding: 1rem;
}

/* Form Styles */
.${name.toLowerCase()}-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 500;
  color: #374151;
}

.form-input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
}

/* Button Styles */
.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #9ca3af;
  color: white;
  border: none;
}

.btn-secondary:hover {
  background-color: #6b7280;
}

/* Table Styles */
.${name.toLowerCase()}-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.${name.toLowerCase()}-table th,
.${name.toLowerCase()}-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.${name.toLowerCase()}-table th {
  background-color: #f9fafb;
  font-weight: 600;
}

.${name.toLowerCase()}-table tr:hover {
  background-color: #f3f4f6;
}

/* Card Styles */
.${name.toLowerCase()}-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .${name.toLowerCase()}-header {
    flex-direction: column;
    gap: 1rem;
  }

  .${name.toLowerCase()}-table {
    display: block;
    overflow-x: auto;
  }
}
`;

const getScssTemplate = (name: string) => `// Variables
$primary-color: #3b82f6;
$secondary-color: #9ca3af;
$border-color: #e5e7eb;
$text-color: #374151;
$background-color: #ffffff;

// Mixins
@mixin flex-column {
  display: flex;
  flex-direction: column;
}

@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin button-base {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

// Component Styles
.${name.toLowerCase()}-container {
  @include flex-column;
  padding: 1rem;
  gap: 1rem;

  // Header
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: $background-color;
    border-bottom: 1px solid $border-color;
  }

  // Content
  &-content {
    flex: 1;
    padding: 1rem;
  }

  // Form
  &-form {
    @include flex-column;
    gap: 1rem;
    max-width: 500px;

    .form-group {
      @include flex-column;
      gap: 0.5rem;
    }

    .form-label {
      font-weight: 500;
      color: $text-color;
    }

    .form-input {
      padding: 0.5rem;
      border: 1px solid $border-color;
      border-radius: 0.375rem;
      font-size: 1rem;

      &:focus {
        outline: none;
        border-color: $primary-color;
      }
    }
  }

  // Buttons
  .btn {
    @include button-base;

    &-primary {
      background-color: $primary-color;
      color: white;
      border: none;

      &:hover {
        background-color: darken($primary-color, 10%);
      }
    }

    &-secondary {
      background-color: $secondary-color;
      color: white;
      border: none;

      &:hover {
        background-color: darken($secondary-color, 10%);
      }
    }
  }

  // Table
  &-table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;

    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid $border-color;
    }

    th {
      background-color: #f9fafb;
      font-weight: 600;
    }

    tr {
      &:hover {
        background-color: #f3f4f6;
      }
    }
  }

  // Card
  &-card {
    background-color: $background-color;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 1rem;
  }
}

// Responsive
@media (max-width: 768px) {
  .${name.toLowerCase()}-container {
    &-header {
      flex-direction: column;
      gap: 1rem;
    }

    &-table {
      display: block;
      overflow-x: auto;
    }
  }
}
`;

const getStyledComponentsTemplate = (name: string) => `import styled from 'styled-components';

// Variables
const colors = {
  primary: '#3b82f6',
  secondary: '#9ca3af',
  border: '#e5e7eb',
  text: '#374151',
  background: '#ffffff',
};

// Container
export const ${name}Container = styled.div\`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
\`;

// Header
export const ${name}Header = styled.header\`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: \${colors.background};
  border-bottom: 1px solid \${colors.border};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
\`;

// Content
export const ${name}Content = styled.div\`
  flex: 1;
  padding: 1rem;
\`;

// Form
export const ${name}Form = styled.form\`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
\`;

export const FormGroup = styled.div\`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
\`;

export const FormLabel = styled.label\`
  font-weight: 500;
  color: \${colors.text};
\`;

export const FormInput = styled.input\`
  padding: 0.5rem;
  border: 1px solid \${colors.border};
  border-radius: 0.375rem;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: \${colors.primary};
  }
\`;

// Buttons
export const Button = styled.button\`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
\`;

export const PrimaryButton = styled(Button)\`
  background-color: \${colors.primary};
  color: white;
  border: none;

  &:hover {
    background-color: #2563eb;
  }
\`;

export const SecondaryButton = styled(Button)\`
  background-color: \${colors.secondary};
  color: white;
  border: none;

  &:hover {
    background-color: #6b7280;
  }
\`;

// Table
export const ${name}Table = styled.table\`
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;

  @media (max-width: 768px) {
    display: block;
    overflow-x: auto;
  }
\`;

export const TableHeader = styled.th\`
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid \${colors.border};
  background-color: #f9fafb;
  font-weight: 600;
\`;

export const TableCell = styled.td\`
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid \${colors.border};
\`;

export const TableRow = styled.tr\`
  &:hover {
    background-color: #f3f4f6;
  }
\`;

// Card
export const ${name}Card = styled.div\`
  background-color: \${colors.background};
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem;
\`;
`;