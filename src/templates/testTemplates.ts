type TestType = 'component' | 'hook' | 'page' | 'context' | 'util';

export const getTestTemplate = (name: string, type: TestType = 'component'): string => {
  switch (type) {
    case 'component':
      return getComponentTestTemplate(name);
    case 'hook':
      return getHookTestTemplate(name);
    case 'page':
      return getPageTestTemplate(name);
    case 'context':
      return getContextTestTemplate(name);
    case 'util':
      return getUtilTestTemplate(name);
    default:
      return getComponentTestTemplate(name);
  }
};

const getComponentTestTemplate = (name: string) => `import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ${name} from './${name}';

describe('${name}', () => {
  const mockProps = {
    // Define tus props mock aquí
  };

  it('renders without crashing', () => {
    render(<${name} {...mockProps} />);
  });

  it('matches snapshot', () => {
    const { container } = render(<${name} {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('displays the correct content', () => {
    render(<${name} {...mockProps} />);
    // Agrega tus assertions aquí
    // ejemplo: expect(screen.getByText('Título')).toBeInTheDocument();
  });

  it('handles click events correctly', () => {
    const onClickMock = jest.fn();
    render(<${name} {...mockProps} onClick={onClickMock} />);
    
    const element = screen.getByRole('button'); // Ajusta según tu componente
    fireEvent.click(element);
    
    expect(onClickMock).toHaveBeenCalled();
  });

  it('handles user input correctly', async () => {
    const onChangeMock = jest.fn();
    render(<${name} {...mockProps} onChange={onChangeMock} />);
    
    const input = screen.getByRole('textbox'); // Ajusta según tu componente
    await userEvent.type(input, 'test input');
    
    expect(onChangeMock).toHaveBeenCalled();
  });

  describe('conditional rendering', () => {
    it('shows loading state when loading prop is true', () => {
      render(<${name} {...mockProps} loading={true} />);
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('shows error message when there is an error', () => {
      render(<${name} {...mockProps} error="Error message" />);
      expect(screen.getByText(/error message/i)).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<${name} {...mockProps} />);
      // Requiere jest-axe para pruebas de accesibilidad
      // const results = await axe(container);
      // expect(results).toHaveNoViolations();
    });

    it('has the correct ARIA attributes', () => {
      render(<${name} {...mockProps} />);
      const element = screen.getByRole('button'); // Ajusta según tu componente
      expect(element).toHaveAttribute('aria-label');
    });
  });
});
`;

const getHookTestTemplate = (name: string) => `import { renderHook, act } from '@testing-library/react-hooks';
import ${name} from './${name}';

describe('${name}', () => {
  beforeEach(() => {
    // Setup antes de cada test
  });

  afterEach(() => {
    // Cleanup después de cada test
    jest.clearAllMocks();
  });

  it('returns the correct initial state', () => {
    const { result } = renderHook(() => ${name}());
    expect(result.current).toBeDefined();
    // Agrega más assertions específicas para tu estado inicial
  });

  it('updates state correctly', () => {
    const { result } = renderHook(() => ${name}());
    
    act(() => {
      // Ejecuta acciones que modifican el estado
      // result.current.someFunction();
    });

    // Verifica el nuevo estado
    // expect(result.current.someValue).toBe(expectedValue);
  });

  it('handles errors correctly', async () => {
    const { result } = renderHook(() => ${name}());
    
    // Simula un error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    await act(async () => {
      // Ejecuta una acción que debería manejar un error
    });

    expect(result.current.error).toBeDefined();
    consoleSpy.mockRestore();
  });

  describe('lifecycle', () => {
    it('cleans up on unmount', () => {
      const { unmount } = renderHook(() => ${name}());
      unmount();
      // Verifica que la limpieza se realizó correctamente
    });
  });

  describe('side effects', () => {
    it('handles side effects correctly', async () => {
      const mockFn = jest.fn();
      const { result, waitForNextUpdate } = renderHook(() => ${name}({ onEffect: mockFn }));
      
      await waitForNextUpdate();
      
      expect(mockFn).toHaveBeenCalled();
    });
  });
});
`;

const getPageTestTemplate = (name: string) => `import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ${name} from './${name}';

// Mock de los hooks y servicios que utiliza la página
jest.mock('../hooks/useData', () => ({
  useData: () => ({
    data: [],
    loading: false,
    error: null,
  }),
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  );
};

describe('${name}', () => {
  beforeEach(() => {
    // Reset mocks y estado inicial
  });

  it('renders the page correctly', () => {
    renderWithRouter(<${name} />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    jest.spyOn(require('../hooks/useData'), 'useData').mockImplementation(() => ({
      data: null,
      loading: true,
      error: null,
    }));

    renderWithRouter(<${name} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows error state', () => {
    jest.spyOn(require('../hooks/useData'), 'useData').mockImplementation(() => ({
      data: null,
      loading: false,
      error: new Error('Test error'),
    }));

    renderWithRouter(<${name} />);
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  it('handles user interactions correctly', async () => {
    renderWithRouter(<${name} />);
    
    // Simula interacciones de usuario
    const button = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(button);

    await waitFor(() => {
      // Verifica el resultado de la interacción
    });
  });

  describe('routing', () => {
    it('navigates correctly', async () => {
      renderWithRouter(<${name} />);
      
      const link = screen.getByRole('link', { name: /details/i });
      await userEvent.click(link);

      // Verifica la navegación
      expect(window.location.pathname).toBe('/expected-path');
    });
  });

  describe('form handling', () => {
    it('submits form data correctly', async () => {
      const mockSubmit = jest.fn();
      renderWithRouter(<${name} onSubmit={mockSubmit} />);

      const form = screen.getByRole('form');
      await userEvent.type(screen.getByLabelText(/name/i), 'Test Name');
      
      await userEvent.click(screen.getByRole('button', { name: /submit/i }));

      expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Test Name',
      }));
    });
  });
});
`;

const getContextTestTemplate = (name: string) => `import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ${name}Provider, use${name} } from './${name}Context';

// Componente de prueba que usa el contexto
const Test${name}Consumer = () => {
  const context = use${name}();
  return (
    <div>
      <span data-testid="value">{JSON.stringify(context.value)}</span>
      <button onClick={() => context.setValue('new value')}>Update Value</button>
    </div>
  );
};

describe('${name}Context', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <${name}Provider>{children}</${name}Provider>
  );

  it('provides the expected context value', () => {
    render(<Test${name}Consumer />, { wrapper });
    expect(screen.getByTestId('value')).toHaveTextContent(expect.any(String));
  });

  it('updates context value correctly', async () => {
    render(<Test${name}Consumer />, { wrapper });
    
    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(screen.getByTestId('value')).toHaveTextContent('new value');
  });

  it('throws error when used outside provider', () => {
    // Silencia el error de consola esperado
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => render(<Test${name}Consumer />)).toThrow();
    
    consoleSpy.mockRestore();
  });

  describe('provider functions', () => {
    it('handles async operations correctly', async () => {
      const TestAsync = () => {
        const { asyncOperation } = use${name}();
        return <button onClick={() => asyncOperation()}>Async</button>;
      };

      render(<TestAsync />, { wrapper });
      
      await act(async () => {
        await userEvent.click(screen.getByRole('button'));
      });

      // Verifica el resultado de la operación asíncrona
    });
  });
});
`;

const getUtilTestTemplate = (name: string) => `import { ${name} } from './${name}';

describe('${name}', () => {
  describe('basic functionality', () => {
    it('returns expected result for valid input', () => {
      const input = 'test input';
      const expectedOutput = 'expected output';
      expect(${name}(input)).toBe(expectedOutput);
    });

    it('handles edge cases correctly', () => {
      expect(${name}('')).toBe('');
      expect(${name}(null)).toBeNull();
      expect(${name}(undefined)).toBeUndefined();
    });
  });

  describe('error handling', () => {
    it('throws error for invalid input', () => {
      expect(() => ${name}(invalidInput)).toThrow();
    });

    it('returns fallback value for invalid input when specified', () => {
      const fallback = 'fallback value';
      expect(${name}(invalidInput, { fallback })).toBe(fallback);
    });
  });

  describe('performance', () => {
    it('handles large inputs efficiently', () => {
      const largeInput = 'x'.repeat(1000000);
      const startTime = performance.now();
      
      ${name}(largeInput);
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100); // 100ms límite
    });
  });

  describe('integration tests', () => {
    it('works with other utilities', () => {
      const result = compose(
        ${name},
        otherUtil
      )('test');
      
      expect(result).toBe('expected output');
    });
  });
});
`;