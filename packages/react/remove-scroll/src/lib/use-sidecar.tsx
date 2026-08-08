// Fork of https://github.com/theKashey/use-sidecar
// MIT License, Copyright (c) Anton Korzunov
import * as React from 'react';
import { canUseDOM } from '@radix-ui/primitive';

export const env = {
  forceCache: false,
};

const cache = new WeakMap();
const NO_OPTIONS = {};

const config: IConfig = {
  onError: (e) => console.error(e),
};

export const setConfig = (conf: Partial<IConfig>) => {
  Object.assign(config, conf);
};

type removeCb = () => void;
type MediumCallback<T> = (data: T) => any;
type MiddlewareCallback<T> = (data: T, assigned: boolean) => T;
type SidePush<T> = {
  length?: number;
  push(data: T): void;
  filter(cb: (x: T) => boolean): SidePush<T>;
};

/**
 * An object describing side medium
 */
export interface SideMedium<T> {
  /**
   * Pushes effect to the medium
   * @param effect any information for real handler
   */
  useMedium(effect: T): removeCb;

  /**
   * Assigns effect handler to the medium
   * @param {Function(effect: T)} handler effect handler
   */
  assignMedium(handler: MediumCallback<T>): void;

  /**
   * Assigns a synchronous effect handler to the medium, which would be executed right on call
   * @param {Function(effect: T)} handler effect handler
   */
  assignSyncMedium(handler: MediumCallback<T>): void;

  /**
   * reads the data stored in the medium
   */
  read(): T | undefined;

  options?: Record<string, any>;
}

type DefaultOrNot<T> = { default: T } | T;

type Importer<T> = () => Promise<DefaultOrNot<React.ComponentType<T>>>;

type SideCarMedium<T = {}> = SideMedium<React.ComponentType<T>>;

type SideCarHOC<T = {}> = {
  readonly sideCar: SideCarMedium<T>;
};

interface SideCarMediumOptions {
  async?: boolean;
  ssr?: boolean;
}

export type SideCarComponent<T> = React.FunctionComponent<T & SideCarHOC<T>>;

export function sidecar<T>(
  importer: Importer<T>,
  errorComponent?: React.ReactNode,
): React.FunctionComponent<Omit<T, 'sideCar'> & SideCarHOC<Omit<T, 'sideCar'>>> {
  const ErrorCase: React.FunctionComponent = () => errorComponent as any;

  return function Sidecar(props) {
    const [Car, error] = useSidecar(importer, props.sideCar);
    if (error && errorComponent) {
      return ErrorCase as any;
    }

    // @ts-expect-error type shenanigans
    return Car ? React.createElement(Car, props) : null;
  };
}

export function useSidecar<T>(
  importer: Importer<T>,
  effect?: SideMedium<any>,
): [React.ComponentType<T> | null, Error | null] {
  const options: any = (effect && effect.options) || NO_OPTIONS;

  if (!canUseDOM && !options.ssr) {
    return [null, null];
  }

  // oxlint-disable-next-line react-hooks/rules-of-hooks
  return useRealSidecar(importer, effect);
}

function useRealSidecar<T>(
  importer: Importer<T>,
  effect?: SideMedium<any>,
): [React.ComponentType<T> | null, Error | null] {
  const options: any = (effect && effect.options) || NO_OPTIONS;

  const couldUseCache = env.forceCache || (!canUseDOM && !!options.ssr) || !options.async;

  const [Car, setCar] = React.useState(couldUseCache ? () => cache.get(importer) : undefined);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!Car) {
      importer().then(
        (car) => {
          const resolved: T = effect ? effect.read() : (car as any).default || car;

          if (!resolved) {
            console.error('Sidecar error: with importer', importer);

            let error: Error;

            if (effect) {
              console.error('Sidecar error: with medium', effect);
              error = new Error('Sidecar medium was not found');
            } else {
              error = new Error('Sidecar was not found in exports');
            }

            setError(() => error);
            throw error;
          }

          cache.set(importer, resolved);
          setCar(() => resolved);
        },
        (e) => setError(() => e),
      );
    }
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [Car, error];
}

interface IConfig {
  onError(e: Error): void;
}

function ItoI<T>(a: T) {
  return a;
}

function innerCreateMedium<T>(
  defaults?: T,
  middleware: MiddlewareCallback<T> = ItoI,
): SideMedium<T> {
  let buffer: SidePush<T> = [];
  let assigned = false;

  const medium: SideMedium<T> = {
    read(): T {
      if (assigned) {
        throw new Error(
          'Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.',
        );
      }

      if (buffer.length) {
        return (buffer as Array<T>)[buffer.length - 1]!;
      }

      return defaults!;
    },
    useMedium(data: T) {
      const item = middleware(data, assigned);
      buffer.push(item);

      return () => {
        buffer = buffer.filter((x) => x !== item);
      };
    },
    assignSyncMedium(cb: MediumCallback<T>) {
      assigned = true;

      while (buffer.length) {
        const cbs = buffer as Array<T>;
        buffer = [];
        cbs.forEach(cb);
      }

      buffer = {
        push: (x) => cb(x),
        filter: () => buffer,
      };
    },
    assignMedium(cb: MediumCallback<T>) {
      assigned = true;

      let pendingQueue: Array<T> = [];

      if (buffer.length) {
        const cbs = buffer as Array<T>;
        buffer = [];
        cbs.forEach(cb);
        pendingQueue = buffer as Array<T>;
      }

      const executeQueue = () => {
        const cbs = pendingQueue;
        pendingQueue = [];
        cbs.forEach(cb);
      };

      const cycle = () => Promise.resolve().then(executeQueue);

      cycle();

      buffer = {
        push: (x) => {
          pendingQueue.push(x);
          cycle();
        },
        filter: (filter) => {
          pendingQueue = pendingQueue.filter(filter);

          return buffer;
        },
      };
    },
  };

  return medium;
}

export function createMedium<T>(
  defaults?: T,
  middleware: MiddlewareCallback<T> = ItoI,
): Readonly<SideMedium<T>> {
  return innerCreateMedium(defaults, middleware);
}

export function createSidecarMedium<T = {}>(
  options: SideCarMediumOptions = {},
): Readonly<SideCarMedium<T>> {
  const medium = innerCreateMedium(null as any);

  medium.options = {
    async: true,
    ssr: false,
    ...options,
  };

  return medium;
}

type CombinedProps<T extends any[], K> = { children: (...prop: T) => any } & K;
type RenderPropComponent<T extends any[], K> = React.ComponentType<CombinedProps<T, K>>;

type Callback = (state: any) => void;

type ChildrenProps<T extends any[]> = {
  stateRef: React.MutableRefObject<Callback>;
  defaultState: React.RefObject<T>;
  children: (...prop: T) => any;
};

export function renderCar<T extends any[], K, C = RenderPropComponent<T, K & Partial<SideCarHOC>>>(
  WrappedComponent: C,
  defaults: (props: K) => T,
): React.FC<CombinedProps<T, K>> {
  function State({
    stateRef,
    props,
  }: {
    stateRef: React.RefObject<Callback>;
    props: CombinedProps<T, K>;
  }) {
    const renderTarget = React.useCallback(function SideTarget(...args: T) {
      React.useLayoutEffect(() => {
        stateRef.current!(args);
      });

      return null;
      // oxlint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // @ts-ignore
    return <WrappedComponent {...props} children={renderTarget} />;
  }

  const Children = React.memo(
    ({ stateRef, defaultState, children }: ChildrenProps<T>) => {
      const [state, setState] = React.useState<T>(defaultState.current!);

      React.useEffect(() => {
        stateRef.current = setState;
        // oxlint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      return children(...state);
    },
    () => true,
  );

  return function Combiner(props: CombinedProps<T, K>) {
    const defaultState = React.useRef<T>(defaults(props));
    const ref = React.useRef((state: T) => (defaultState.current = state));

    return (
      <React.Fragment>
        <State stateRef={ref} props={props} />
        <Children stateRef={ref} defaultState={defaultState} children={props.children} />
      </React.Fragment>
    );
  };
}

const SideCar = ({ sideCar, ...rest }: any) => {
  if (!sideCar) {
    throw new Error('Sidecar: please provide `sideCar` property to import the right car');
  }

  const Target = sideCar.read();

  if (!Target) {
    throw new Error('Sidecar medium not found');
  }

  return <Target {...rest} />;
};

SideCar.isSideCarExport = true;

export function exportSidecar<T>(
  medium: SideCarMedium<T>,
  exported: React.ComponentType<T>,
): SideCarComponent<T> {
  medium.useMedium(exported);

  return SideCar as any;
}
