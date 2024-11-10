export const validateComponentName = (name: string): boolean => {
    return /^[A-Z][a-zA-Z0-9]*$/.test(name);
  };
  
  export const validateHookName = (name: string): boolean => {
    return /^use[A-Z][a-zA-Z0-9]*$/.test(name);
  };
  
  export const getValidationMessage = (type: string, name: string): string | true => {
    if (type === 'hook') {
      return validateHookName(name) ? true : 'Los hooks deben empezar con "use"';
    }
    return validateComponentName(name) ? true : 'El nombre debe empezar con mayúscula';
  };