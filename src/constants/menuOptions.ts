export interface MenuItem {
    name: string;
    value: string;
    submenu: SubMenuItem[];
  }
  
  export interface SubMenuItem {
    name: string;
    value: string;
  }
  
  export const generatorTypes: MenuItem[] = [
    {
      name: 'Componente',
      value: 'component',
      submenu: [
        { name: 'Componente Básico', value: 'basic' },
        { name: 'Card', value: 'card' },
        { name: 'Modal', value: 'modal' },
        { name: 'Tabla', value: 'table' },
        { name: 'Lista', value: 'list' },
        { name: 'Navbar', value: 'navbar' }
      ]
    },
    {
      name: 'Hook',
      value: 'hook',
      submenu: [
        { name: 'Hook de Estado', value: 'state' },
        { name: 'Hook de API', value: 'api' },
        { name: 'Hook de Formulario', value: 'form' },
        { name: 'Hook de Media Query', value: 'media' },
        { name: 'Hook de LocalStorage', value: 'storage' }
      ]
    },
    {
      name: 'Layout',
      value: 'layout',
      submenu: [
        { name: 'Layout por Defecto', value: 'default' },
        { name: 'Layout de Dashboard', value: 'dashboard' },
        { name: 'Layout de Autenticación', value: 'auth' },
        { name: 'Layout de Landing', value: 'landing' }
      ]
    },
    {
      name: 'Página',
      value: 'page',
      submenu: [
        { name: 'Página Básica', value: 'basic' },
        { name: 'Página de Detalle', value: 'detail' },
        { name: 'Página de Lista', value: 'list' },
        { name: 'Página de Dashboard', value: 'dashboard' }
      ]
    }
  ];