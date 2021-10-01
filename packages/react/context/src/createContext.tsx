import * as React from 'react';

const $$DefaultContext = Symbol.for('radix-ui.defaultContext');

function createContext<ContextValueType extends object | null>(
  rootComponentName: string,
  defaultContext?: ContextValueType
) {
  const Context = React.createContext<ContextValueType | undefined>(defaultContext);

  function Provider(props: ContextValueType & { children: React.ReactNode }) {
    const { children, ...providerProps } = props;
    // Only re-memoize when prop values change
    const value = React.useMemo(
      () => providerProps,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(providerProps)
    ) as ContextValueType;
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useContext(consumerName: string) {
    const context = React.useContext(Context);

    if (context === undefined) {
      // if a defaultContext wasn't specified, it's a required context.
      if (defaultContext === undefined) {
        throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
      }
      return defaultContext;
    }
    return context;
  }

  Provider.displayName = rootComponentName + 'Provider';
  return [Provider, useContext] as const;
}

/* -------------------------------------------------------------------------------------------------
 * createContextScope
 * -----------------------------------------------------------------------------------------------*/

type ScopeHook = (consumerName: string, props: Record<string, any>) => Record<string, any>;

interface CreateScope {
  __removeScopeProps<T>(props: T): T;
  (): ScopeHook;
}

function createContextScope(scopeName: string, createContextScopeDeps: CreateScope[] = []) {
  let baseContexts: React.Context<any>[] = [];

  function createContext<ContextValueType extends object | null>(
    rootComponentName: string,
    defaultContext?: ContextValueType
  ) {
    const BaseContext = React.createContext<ContextValueType | undefined>(defaultContext);
    const index = baseContexts.length;
    (BaseContext as any)[$$DefaultContext] = defaultContext;
    baseContexts = [...baseContexts, BaseContext];

    function Provider(
      props: ContextValueType & { scope: Record<string, any>; children: React.ReactNode }
    ) {
      const { scope, children, ...providerProps } = props;
      const __scope = (scope as any)[`__scope-${scopeName}-contexts`] || [];
      const Context = __scope[index] || BaseContext;

      // Only re-memoize when prop values change
      const value = React.useMemo(
        () => providerProps,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        Object.values(providerProps)
      ) as ContextValueType;

      return <Context.Provider value={value}>{children}</Context.Provider>;
    }

    function useContext(consumerName: string, props: Record<string, any>) {
      type ScopeContexts = React.Context<ContextValueType>[];
      const __scope: ScopeContexts = props[`__scope-${scopeName}-contexts`] || [];
      const partName = props[`__scope-${scopeName}-part`] || consumerName;
      const context = React.useContext(__scope[index] || BaseContext);
      if (context === undefined) {
        // if a defaultContext wasn't specified, it's a required context.
        if (defaultContext === undefined) {
          throw new Error(`\`${partName}\` must be used within \`${rootComponentName}\``);
        }
        return defaultContext;
      }
      return context;
    }

    Provider.displayName = rootComponentName + 'Provider';
    return [Provider, useContext] as const;
  }

  const createScope: CreateScope = () => {
    const scopeContexts = baseContexts.map((BaseContext) => {
      const defaultContext = (BaseContext as any)[$$DefaultContext];
      return React.createContext(defaultContext);
    });
    return function useScope(consumerName, props) {
      const contextsPropName = `__scope-${scopeName}-contexts`;
      const partPropName = `__scope-${scopeName}-part`;
      const contexts = props[contextsPropName] || scopeContexts;
      const part = props[partPropName] || consumerName;
      return React.useMemo(
        () => ({ [contextsPropName]: contexts, [partPropName]: part }),
        [contextsPropName, contexts, partPropName, part]
      );
    };
  };

  function removeScopeProps<T>(originalProps: T) {
    const props = removeScopePropsFromScopes(originalProps, createContextScopeDeps);
    return Object.fromEntries(
      Object.entries(props).filter(([prop]) => !prop.startsWith(`__scope-${scopeName}`))
    ) as T;
  }

  createScope.__removeScopeProps = removeScopeProps;

  return [
    createContext,
    removeScopeProps,
    composeContextScopes(createScope, ...createContextScopeDeps),
  ] as const;
}

/* -------------------------------------------------------------------------------------------------
 * composeContextScopes
 * -----------------------------------------------------------------------------------------------*/

function composeContextScopes(...scopes: CreateScope[]) {
  const createScope: CreateScope = () => {
    const scopeHooks: ScopeHook[] = scopes.map((createScope) => createScope());
    return function useComposedScopes(consumerName, props) {
      const scopes = scopeHooks.map((use) => use(consumerName, props));
      return React.useMemo(
        () => scopes.reduce((scopeA, scopeB) => ({ ...scopeA, ...scopeB }), {}),
        [scopes]
      );
    };
  };

  createScope.__removeScopeProps = (props) => removeScopePropsFromScopes(props, scopes);
  return createScope;
}

/* -------------------------------------------------------------------------------------------------
 * removeScopePropsFromScopes
 * -----------------------------------------------------------------------------------------------*/

function removeScopePropsFromScopes<T>(originalProps: T, scopes: CreateScope[]) {
  return scopes.reduce((props, { __removeScopeProps }) => __removeScopeProps(props), originalProps);
}

/* -----------------------------------------------------------------------------------------------*/

export { createContext, createContextScope };
export type { CreateScope };
