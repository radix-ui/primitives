import * as React from 'react';

type ContextProvider<ContextValueType extends object | null> = React.FC<
  ContextValueType & {
    children: React.ReactNode;
  }
>;

interface UseAssertedContext<ContextValueType extends object | null> {
  (consumerName: string): ContextValueType;
}

interface UseContext<ContextValueType extends object | null> {
  (consumerName: string): ContextValueType;
  (consumerName: string, options: { optional: true }): ContextValueType | undefined;
}

function createContext<ContextValueType extends object | null>(
  rootComponentName: string,
): readonly [ContextProvider<ContextValueType>, UseContext<ContextValueType>];
function createContext<ContextValueType extends object | null>(
  rootComponentName: string,
  defaultContext: ContextValueType,
): readonly [ContextProvider<ContextValueType>, UseAssertedContext<ContextValueType>];

function createContext<ContextValueType extends object | null>(
  rootComponentName: string,
  defaultContext?: ContextValueType,
): readonly [ContextProvider<ContextValueType>, UseContext<ContextValueType>] {
  const Context = React.createContext<ContextValueType | undefined>(defaultContext);
  Context.displayName = rootComponentName + 'Context';

  const Provider: ContextProvider<ContextValueType> = (props) => {
    const { children, ...context } = props;
    // Only re-memoize when prop values change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const value = React.useMemo(() => context, Object.values(context)) as ContextValueType;
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  Provider.displayName = rootComponentName + 'Provider';

  function useContext(consumerName: string): ContextValueType;
  function useContext(
    consumerName: string,
    options: { optional: true },
  ): ContextValueType | undefined;

  function useContext(
    consumerName: string,
    options: { optional?: boolean } = {},
  ): ContextValueType | undefined {
    const { optional = false } = options;
    const context = React.useContext(Context);
    if (context) return context;
    if (defaultContext !== undefined) return defaultContext;
    if (optional) return undefined;
    // if a defaultContext wasn't specified, it's a required context.
    throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
  }

  return [Provider, useContext];
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

type ScopedContextProvider<ContextValueType extends object | null> = React.FC<
  ContextValueType & {
    scope: Scope<ContextValueType>;
    children: React.ReactNode;
  }
>;

interface UseScopedContext<ContextValueType extends object | null> {
  (consumerName: string, scope: Scope<ContextValueType | undefined>): ContextValueType;
  (
    consumerName: string,
    scope: Scope<ContextValueType | undefined>,
    options: { optional?: true },
  ): ContextValueType | undefined;
}

interface UseAssertedScopedContext<ContextValueType extends object | null> {
  (consumerName: string, scope: Scope<ContextValueType | undefined>): ContextValueType;
}

interface CreateScopedContext {
  <ContextValueType extends object | null>(
    rootComponentName: string,
  ): readonly [ScopedContextProvider<ContextValueType>, UseScopedContext<ContextValueType>];
  <ContextValueType extends object | null>(
    rootComponentName: string,
    defaultContext: ContextValueType,
  ): readonly [ScopedContextProvider<ContextValueType>, UseAssertedScopedContext<ContextValueType>];
}

function createContextScope(
  scopeName: string,
  createContextScopeDeps: CreateScope[] = [],
): readonly [CreateScopedContext, CreateScope] {
  let defaultContexts: any[] = [];

  /* -----------------------------------------------------------------------------------------------
   * createContext
   * ---------------------------------------------------------------------------------------------*/

  function createContext<ContextValueType extends object | null>(
    rootComponentName: string,
    defaultContext?: ContextValueType,
  ) {
    const BaseContext = React.createContext<ContextValueType | undefined>(defaultContext);
    BaseContext.displayName = rootComponentName + 'Context';
    const index = defaultContexts.length;
    defaultContexts = [...defaultContexts, defaultContext];

    const Provider: ScopedContextProvider<ContextValueType> = (props) => {
      const { scope, children, ...context } = props;
      const Context = scope?.[scopeName]?.[index] || BaseContext;
      // Only re-memoize when prop values change
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const value = React.useMemo(() => context, Object.values(context)) as ContextValueType;
      return <Context.Provider value={value}>{children}</Context.Provider>;
    };

    Provider.displayName = rootComponentName + 'Provider';

    function useContext(
      consumerName: string,
      scope: Scope<ContextValueType | undefined>,
    ): ContextValueType;
    function useContext(
      consumerName: string,
      scope: Scope<ContextValueType | undefined>,
      options: { optional: true },
    ): ContextValueType | undefined;

    function useContext(
      consumerName: string,
      scope: Scope<ContextValueType | undefined>,
      options: { optional?: boolean } = {},
    ): ContextValueType | undefined {
      const { optional = false } = options;
      const Context = scope?.[scopeName]?.[index] || BaseContext;
      const context = React.useContext(Context);
      if (context) return context;
      if (defaultContext !== undefined) return defaultContext;
      if (optional) return undefined;
      // if a defaultContext wasn't specified, it's a required context.
      throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
    }

    return [Provider, useContext] as const;
  }

  /* -----------------------------------------------------------------------------------------------
   * createScope
   * ---------------------------------------------------------------------------------------------*/

  const createScope: CreateScope = () => {
    const scopeContexts = defaultContexts.map((defaultContext) => {
      return React.createContext(defaultContext);
    });
    return function useScope(scope: Scope) {
      const contexts = scope?.[scopeName] || scopeContexts;
      return React.useMemo(
        () => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }),
        [scope, contexts],
      );
    };
  };

  createScope.scopeName = scopeName;
  return [createContext, composeContextScopes(createScope, ...createContextScopeDeps)] as const;
}

/* -------------------------------------------------------------------------------------------------
 * composeContextScopes
 * -----------------------------------------------------------------------------------------------*/

function composeContextScopes(...scopes: [CreateScope, ...CreateScope[]]): CreateScope {
  const baseScope = scopes[0];
  if (scopes.length === 1) return baseScope;

  const createScope: CreateScope = () => {
    const scopeHooks = scopes.map((createScope) => ({
      useScope: createScope(),
      scopeName: createScope.scopeName,
    }));

    return function useComposedScopes(overrideScopes) {
      const nextScopes = scopeHooks.reduce((nextScopes, { useScope, scopeName }) => {
        // We are calling a hook inside a callback which React warns against to avoid inconsistent
        // renders, however, scoping doesn't have render side effects so we ignore the rule.
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const scopeProps = useScope(overrideScopes);
        const currentScope = scopeProps[`__scope${scopeName}`];
        return { ...nextScopes, ...currentScope };
      }, {});

      return React.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
    };
  };

  createScope.scopeName = baseScope.scopeName;
  return createScope;
}

/* -----------------------------------------------------------------------------------------------*/

export { createContext, createContextScope };
export type {
  CreateScope,
  CreateScopedContext,
  Scope,
  UseAssertedContext,
  UseAssertedScopedContext,
  UseContext,
  UseScopedContext,
};
