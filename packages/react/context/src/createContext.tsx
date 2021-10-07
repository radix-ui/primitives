import * as React from 'react';

const $$DefaultContext = Symbol.for('radix-ui.defaultContext');

function createContext<ContextValueType extends object | null>(
  rootComponentName: string,
  defaultContext?: ContextValueType
) {
  const Context = React.createContext<ContextValueType | undefined>(defaultContext);

  function Provider(props: ContextValueType & { children: React.ReactNode }) {
    const { children, ...context } = props;
    // Only re-memoize when prop values change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const value = React.useMemo(() => context, Object.values(context)) as ContextValueType;
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useContext(consumerName: string) {
    const context = React.useContext(Context);
    if (context) return context;
    if (defaultContext !== undefined) return defaultContext;
    // if a defaultContext wasn't specified, it's a required context.
    throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
  }

  Provider.displayName = rootComponentName + 'Provider';
  return [Provider, useContext] as const;
}

/* -------------------------------------------------------------------------------------------------
 * createContextScope
 * -----------------------------------------------------------------------------------------------*/

type Scope<C = any> = { [scopeName: string]: React.Context<C>[] } | undefined;
type ScopeHook = (scope: Scope) => { [__scopeProp: string]: Scope };
interface CreateScope {
  scopeName: string;
  (): ScopeHook;
}

function createContextScope(scopeName: string, createContextScopeDeps: CreateScope[] = []) {
  let baseContexts: React.Context<any>[] = [];

  /* -----------------------------------------------------------------------------------------------
   * createContext
   * ---------------------------------------------------------------------------------------------*/

  function createContext<ContextValueType extends object | null>(
    rootComponentName: string,
    defaultContext?: ContextValueType
  ) {
    const BaseContext = React.createContext<ContextValueType | undefined>(defaultContext);
    const index = baseContexts.length;

    // We attach the defaultContext to each context so we can clone later
    (BaseContext as any)[$$DefaultContext] = defaultContext;
    baseContexts = [...baseContexts, BaseContext];

    function Provider(
      props: ContextValueType & { scope: Scope<ContextValueType>; children: React.ReactNode }
    ) {
      const { scope, children, ...context } = props;
      const Context = scope?.[scopeName][index] || baseContexts[index];
      // Only re-memoize when prop values change
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const value = React.useMemo(() => context, Object.values(context)) as ContextValueType;
      return <Context.Provider value={value}>{children}</Context.Provider>;
    }

    function useContext(consumerName: string, scope: Scope<ContextValueType>) {
      const currentScope = scope?.[scopeName];
      const Context = currentScope?.[index] || baseContexts[index];
      const context = React.useContext(Context) as ContextValueType | undefined;
      if (context) return context;
      if (defaultContext !== undefined) return defaultContext;
      // if a defaultContext wasn't specified, it's a required context.
      throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
    }

    Provider.displayName = rootComponentName + 'Provider';
    return [Provider, useContext] as const;
  }

  /* -----------------------------------------------------------------------------------------------
   * createScope
   * ---------------------------------------------------------------------------------------------*/

  const createScope: CreateScope = () => {
    const scopeContexts = baseContexts.map((BaseContext) => {
      const defaultContext = (BaseContext as any)[$$DefaultContext];
      return React.createContext(defaultContext);
    });
    return function useScope(scope: Scope) {
      const contexts = scope?.[scopeName] || scopeContexts;
      return React.useMemo(
        () => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }),
        [scope, contexts]
      );
    };
  };

  createScope.scopeName = scopeName;
  return [createContext, composeContextScopes(createScope, ...createContextScopeDeps)] as const;
}

/* -------------------------------------------------------------------------------------------------
 * composeContextScopes
 * -----------------------------------------------------------------------------------------------*/

function composeContextScopes(...scopes: CreateScope[]) {
  const baseScope = scopes[0];
  if (scopes.length === 1) return baseScope;

  const createScope: CreateScope = () => {
    const scopeHooks = scopes.map((createScope) => ({
      use: createScope(),
      scopeName: createScope.scopeName,
    }));

    return function useComposedScopes(overrideScopes) {
      const nextScopes = scopeHooks.reduce((scopeA, { use, scopeName }) => {
        const scopeProps = use(overrideScopes);
        const scopeB = scopeProps[`__scope${scopeName}`];
        return { ...scopeA, ...scopeB };
      }, {});

      return React.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
    };
  };

  createScope.scopeName = baseScope.scopeName;
  return createScope;
}

/* -----------------------------------------------------------------------------------------------*/

export { createContext, createContextScope };
export type { CreateScope, Scope };
