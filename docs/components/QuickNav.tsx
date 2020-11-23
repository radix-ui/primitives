import * as React from 'react';
import { Box, Heading, Link, Text, BoxProps } from '@modulz/radix';
import { useLayoutEffect } from '@interop-ui/react-utils';
import uniqBy from 'lodash/uniqBy';
import kebabCase from 'lodash/kebabCase';

type QuickNavItem = {
  label: string;
  slug: string;
  level: number;
};

const QuickNavContext = React.createContext({
  items: [] as QuickNavItem[],
  setItems: (() => {}) as React.Dispatch<React.SetStateAction<QuickNavItem[]>>,
});

function useQuickNavContext() {
  const context = React.useContext(QuickNavContext);
  if (context === null) {
    throw new Error('No QuickNavContext provided');
  }
  return context;
}

function QuickNavContextProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<QuickNavItem[]>([]);
  return (
    <QuickNavContext.Provider value={{ items, setItems }}>{children}</QuickNavContext.Provider>
  );
}

type QuickNavItemProps = {
  children: React.ReactNode;
  label?: string;
  slug?: string;
  level?: number;
};

function QuickNavItem({
  children,
  label: labelOverride,
  slug: slugOverride,
  level = 0,
}: QuickNavItemProps) {
  const { setItems } = useQuickNavContext();
  const [_label, setLabel] = React.useState(() => (typeof children === 'string' ? children : ''));
  const label = labelOverride ?? _label;
  const slug = slugOverride ?? `section-${level}-` + kebabCase(label);

  useLayoutEffect(() => {
    // I use `uniqBy` to make sure we aren't adding duplicate references to the items list every
    // time the effect runs. We will run this effect multiple times throughout the life of a
    // component if its dependency references change. Benoit has a suggestion to improve the
    // implementation but I'm not exactly sure at the moment what that looks like.
    // https://github.com/modulz/interop-ui/pull/249#discussion_r528978859
    setItems((items) => uniqBy([...items, { label, slug, level }], (item) => item.slug));
    return () => setItems((items) => items.filter((item) => item.slug !== slug));
  }, [slug, label, level, setItems]);

  // If children isn't a string (which can be the case if headings have additional inside elements)
  // we need to get the inner text from the DOM node.
  const setLabelFromInnerText = React.useCallback(
    (node: HTMLSpanElement | null) => {
      if (labelOverride != null) {
        return;
      }

      const innerText = node?.innerText || '';
      setLabel((label) => {
        if (!label) {
          return innerText;
        }
        return label;
      });
    },
    [labelOverride]
  );

  return (
    <Box as="span" id={slug} ref={setLabelFromInnerText} sx={{ scrollMargin: 15 }}>
      {children}
    </Box>
  );
}

function QuickNav({ as: asProp = 'div', sx = {} }: { as?: BoxProps['as']; sx?: BoxProps['sx'] }) {
  const { items } = useQuickNavContext();

  if (items.length === 0) return null;

  const hierarchicalItems = getHierarchicalItems(items);

  return (
    <Box
      as={asProp}
      sx={{
        ...sx,
      }}
    >
      <Heading as="h4" size={1} sx={{ lineHeight: 2, mb: 5, mt: 3 }}>
        Quick nav
      </Heading>
      <nav>
        <QuickNavList items={hierarchicalItems} sx={{ paddingLeft: 0 }} />
      </nav>
    </Box>
  );
}

type QuickNavItemWithChildren = QuickNavItem & { children: QuickNavItemWithChildren[] };

function QuickNavList({ items, sx }: { items: QuickNavItemWithChildren[]; sx?: any }) {
  return (
    <Box as="ul" sx={{ listStyle: 'none', margin: 0, padding: 0, paddingLeft: 5, ...sx }}>
      {items.map(({ label, slug, children }) => (
        <Text as="li" size={3} key={slug}>
          <Link href={`#${slug}`} variant="fade" sx={{ display: 'inline-block', py: 1 }}>
            {label}
          </Link>
          {children.length === 0 ? null : <QuickNavList items={children} />}
        </Text>
      ))}
    </Box>
  );
}

function getHierarchicalItems(items: QuickNavItem[]) {
  const hierarchy: QuickNavItemWithChildren[] = [];
  const appendQueue = [hierarchy];

  items.forEach((item, index) => {
    const previousItem = items[index - 1];

    if (previousItem && item.level > previousItem.level) {
      const whereToAppend = appendQueue[appendQueue.length - 1];
      const latestItem = whereToAppend[whereToAppend.length - 1];
      appendQueue.push(latestItem.children);
    } else if (previousItem && item.level < previousItem.level) {
      appendQueue.pop();
    }

    const whereToAppend = appendQueue[appendQueue.length - 1];
    whereToAppend.push({ ...item, children: [] });
  });

  return hierarchy;
}

export { QuickNavContextProvider, QuickNavItem, QuickNav };
