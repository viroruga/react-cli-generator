export const hookTemplates = {
    state: (name: string) => `import { useState, useCallback } from 'react';
  
  export const ${name} = <T>(initialState: T) => {
    const [state, setState] = useState<T>(initialState);
  
    const updateState = useCallback((newState: Partial<T>) => {
      setState(prev => ({ ...prev, ...newState }));
    }, []);
  
    const resetState = useCallback(() => {
      setState(initialState);
    }, [initialState]);
  
    return {
      state,
      updateState,
      resetState,
    };
  };`,
  
    api: (name: string) => `import { useState, useEffect } from 'react';
  
  interface ${name}Options<T> {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    headers?: HeadersInit;
    deps?: any[];
  }
  
  export const ${name} = <T>({ url, method = 'GET', body, headers, deps = [] }: ${name}Options<T>) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
  
    useEffect(() => {
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
  
      fetchData();
    }, deps);
  
    return { data, loading, error };
  };`,
  
    form: (name: string) => `import { useState, useCallback } from 'react';
  
  interface FormErrors {
    [key: string]: string;
  }
  
  export const ${name} = <T extends object>(initialValues: T) => {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const handleChange = useCallback((name: keyof T, value: any) => {
      setValues(prev => ({ ...prev, [name]: value }));
      setErrors(prev => ({ ...prev, [name]: '' }));
    }, []);
  
    const handleBlur = useCallback((name: keyof T) => {
      setTouched(prev => ({ ...prev, [name]: true }));
    }, []);
  
    const validate = useCallback((values: T): FormErrors => {
      const errors: FormErrors = {};
      // Add your validation rules here
      return errors;
    }, []);
  
    const handleSubmit = useCallback(async (onSubmit: (values: T) => Promise<void>) => {
      setIsSubmitting(true);
      const validationErrors = validate(values);
      
      if (Object.keys(validationErrors).length === 0) {
        try {
          await onSubmit(values);
        } catch (error) {
          console.error('Form submission error:', error);
        }
      } else {
        setErrors(validationErrors);
      }
      setIsSubmitting(false);
    }, [values, validate]);
  
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
  
    media: (name: string) => `import { useState, useEffect } from 'react';
  
  interface MediaQueryConfig {
    query: string;
    defaultValue?: boolean;
  }
  
  export const ${name} = ({ query, defaultValue = false }: MediaQueryConfig) => {
    const [matches, setMatches] = useState(defaultValue);
  
    useEffect(() => {
      const mediaQuery = window.matchMedia(query);
      setMatches(mediaQuery.matches);
  
      const handler = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
      };
  
      mediaQuery.addEventListener('change', handler);
      
      return () => mediaQuery.removeEventListener('change', handler);
    }, [query]);
  
    return matches;
  };`,
  
    storage: (name: string) => `import { useState, useEffect, useCallback } from 'react';
  
  interface StorageConfig<T> {
    key: string;
    initialValue: T;
    storage?: Storage;
  }
  
  export const ${name} = <T>({
    key,
    initialValue,
    storage = localStorage
  }: StorageConfig<T>) => {
    const [value, setValue] = useState<T>(() => {
      try {
        const item = storage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.error('Error reading from storage:', error);
        return initialValue;
      }
    });
  
    useEffect(() => {
      try {
        storage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Error writing to storage:', error);
      }
    }, [key, value, storage]);
  
    const remove = useCallback(() => {
      try {
        storage.removeItem(key);
        setValue(initialValue);
      } catch (error) {
        console.error('Error removing from storage:', error);
      }
    }, [key, initialValue, storage]);
  
    return [value, setValue, remove] as const;
  };`
  };