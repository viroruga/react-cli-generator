export type HookTemplateType = 'state' | 'api' | 'form' | 'media' | 'storage';

interface HookOptions {
  withTypes?: boolean;
  withTests?: boolean;
  withDocs?: boolean;
}

export const hookTemplates: Record<
  HookTemplateType,
  (name: string, options: HookOptions) => string
> = {
  state: (name: string, options: HookOptions) => `import { useState, useCallback } from 'react';
${
  options.withTypes
    ? `
export interface ${name}State {
  // Define tu estado aquí
  value: any;
}

export interface ${name}Actions {
  setValue: (value: any) => void;
  reset: () => void;
}`
    : ''
}

export const ${name} = <T>() => {
  const [state, setState] = useState<T>();

  const updateState = useCallback((newState: Partial<T>) => {
    setState(prev => ({ ...prev, ...newState }));
  }, []);

  const resetState = useCallback(() => {
    setState(undefined);
  }, []);

  return {
    state,
    updateState,
    resetState,
  };
};`,

  api: (name: string, options: HookOptions) => `import { useState, useEffect } from 'react';
${
  options.withTypes
    ? `
export interface ${name}Options<T> {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: HeadersInit;
  deps?: any[];
}

export interface ${name}Result<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}`
    : ''
}

export const ${name} = <T>({
  url,
  method = 'GET',
  body,
  headers,
  deps = []
}: ${options.withTypes ? `${name}Options<T>` : 'any'}) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(url, {
        method,
        body: body ? JSON.stringify(body) : undefined,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, deps);

  return { data, loading, error, refetch: fetchData };
};`,

  form: (name: string, options: HookOptions) => `import { useState, useCallback } from 'react';
${
  options.withTypes
    ? `
export interface ${name}Errors {
  [key: string]: string;
}

export interface ${name}Options<T> {
  initialValues: T;
  validate?: (values: T) => ${name}Errors;
  onSubmit?: (values: T) => Promise<void>;
}

export interface ${name}Result<T> {
  values: T;
  errors: ${name}Errors;
  touched: Record<keyof T, boolean>;
  isSubmitting: boolean;
  handleChange: (name: keyof T, value: any) => void;
  handleBlur: (name: keyof T) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}`
    : ''
}

export const ${name} = <T extends object>({
  initialValues,
  validate,
  onSubmit
}: ${options.withTypes ? `${name}Options<T>` : 'any'}) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<${options.withTypes ? `${name}Errors` : 'any'}>({});
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleBlur = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        setIsSubmitting(false);
        return;
      }
    }

    try {
      await onSubmit?.(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({} as Record<keyof T, boolean>);
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  };
};`,

  media: (name: string, options: HookOptions) => `import { useState, useEffect } from 'react';
${
  options.withTypes
    ? `
export interface ${name}Options {
  queries: {
    [key: string]: string;
  };
  defaultValues?: {
    [key: string]: boolean;
  };
}

export interface ${name}Result {
  [key: string]: boolean;
}`
    : ''
}

export const ${name} = ({
  queries,
  defaultValues = {}
}: ${options.withTypes ? `${name}Options` : 'any'}) => {
  const [matches, setMatches] = useState<${
    options.withTypes ? `${name}Result` : 'any'
  }>(defaultValues);

  useEffect(() => {
    const mediaQueries = Object.entries(queries).map(([key, query]) => ({
      key,
      mql: window.matchMedia(query),
    }));

    const handler = () => {
      const newMatches = mediaQueries.reduce((acc, { key, mql }) => ({
        ...acc,
        [key]: mql.matches,
      }), {});

      setMatches(newMatches);
    };

    mediaQueries.forEach(({ mql }) => {
      mql.addEventListener('change', handler);
    });

    handler();

    return () => {
      mediaQueries.forEach(({ mql }) => {
        mql.removeEventListener('change', handler);
      });
    };
  }, [queries]);

  return matches;
};`,

  storage: (
    name: string,
    options: HookOptions
  ) => `import { useState, useEffect, useCallback } from 'react';
${
  options.withTypes
    ? `
export interface ${name}Options<T> {
  key: string;
  initialValue: T;
  storage?: Storage;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
}

export interface ${name}Result<T> {
  value: T;
  setValue: (value: T) => void;
  remove: () => void;
  error: Error | null;
}`
    : ''
}

export const ${name} = <T>({
  key,
  initialValue,
  storage = localStorage,
  serialize = JSON.stringify,
  deserialize = JSON.parse,
}: ${options.withTypes ? `${name}Options<T>` : 'any'}): ${
    options.withTypes ? `${name}Result<T>` : 'any'
  } => {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = storage.getItem(key);
      return item ? deserialize(item) : initialValue;
    } catch (error) {
      console.error(\`Error reading from storage: \${error}\`);
      return initialValue;
    }
  });

  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      storage.setItem(key, serialize(value));
      setError(null);
    } catch (err) {
      console.error(\`Error writing to storage: \${err}\`);
      setError(err instanceof Error ? err : new Error('Storage error'));
    }
  }, [key, value, serialize, storage]);

  const remove = useCallback(() => {
    try {
      storage.removeItem(key);
      setValue(initialValue);
      setError(null);
    } catch (err) {
      console.error(\`Error removing from storage: \${err}\`);
      setError(err instanceof Error ? err : new Error('Storage error'));
    }
  }, [key, initialValue, storage]);

  return { value, setValue, remove, error };
};`,
};
